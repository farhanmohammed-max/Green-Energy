import 'dotenv/config';
import express from 'express';
import type { Request, Response } from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  N8N_NOT_CONFIGURED_MESSAGE,
  extractReplyFromN8nPayload,
  resolveTimeoutMs,
  validateConsultationInput,
  validateWebhookUrl,
} from './src/lib/n8n.ts';
import { SOLUTION_CATEGORIES } from './src/data/campaignData.ts';
import { getServerWebhookUrl } from './api/_n8nConfig.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 25;

interface RateBucket {
  count: number;
  resetAt: number;
}

const rateBuckets = new Map<string, RateBucket>();

function isRateLimited(clientKey: string): boolean {
  const now = Date.now();
  const existing = rateBuckets.get(clientKey);

  if (!existing || now > existing.resetAt) {
    rateBuckets.set(clientKey, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  existing.count += 1;
  if (existing.count > RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }
  return false;
}

function getClientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.trim().length > 0) {
    return forwarded.split(',')[0].trim();
  }
  return req.socket.remoteAddress || 'unknown';
}

async function createServer() {
  const app = express();
  app.disable('x-powered-by');
  app.use(express.json({ limit: '16kb' }));

  // Health & safe configuration readiness check (never exposes N8N_WEBHOOK_URL)
  app.get('/api/health', (_req: Request, res: Response) => {
    const webhookCheck = validateWebhookUrl(getServerWebhookUrl());
    res.json({
      status: 'ok',
      consultationConfigured: webhookCheck.valid,
    });
  });

  // Extensible catalog endpoint returning example categories until synced with an n8n Sheets API
  app.get('/api/catalog', (_req: Request, res: Response) => {
    res.json({
      source: 'example',
      syncedWithGoogleSheets: false,
      note: 'Data ini merupakan contoh kategori solusi untuk tampilan awal website. Katalog produk aktual diakses oleh AI Konsultan melalui tool Katalog_Produk di workflow n8n.',
      items: SOLUTION_CATEGORIES,
    });
  });

  // Primary AI Consultation proxy route -> forwards to n8n Webhook
  app.post('/api/consultation', async (req: Request, res: Response) => {
    const clientIp = getClientIp(req);
    if (isRateLimited(clientIp)) {
      res.status(429).json({
        ok: false,
        code: 'RATE_LIMITED',
        error: 'Terlalu banyak permintaan dalam waktu singkat. Silakan tunggu sebentar lalu coba lagi.',
      });
      return;
    }

    const validation = validateConsultationInput(req.body);
    if (!validation.valid) {
      res.status(400).json({
        ok: false,
        code: 'INVALID_INPUT',
        error: validation.error,
      });
      return;
    }

    const webhookCheck = validateWebhookUrl(getServerWebhookUrl());
    if (!webhookCheck.configured) {
      res.status(503).json({
        ok: false,
        code: 'NOT_CONFIGURED',
        error: N8N_NOT_CONFIGURED_MESSAGE,
      });
      return;
    }

    if (!webhookCheck.valid) {
      res.status(503).json({
        ok: false,
        code: 'INVALID_WEBHOOK_CONFIG',
        error:
          'Konfigurasi layanan konsultasi AI pada server belum valid. Mohon periksa pengaturan N8N_WEBHOOK_URL.',
      });
      return;
    }

    const timeoutMs = resolveTimeoutMs(process.env.N8N_TIMEOUT_MS);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const upstreamResponse = await fetch(webhookCheck.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json, text/plain;q=0.9',
        },
        body: JSON.stringify(validation.payload),
        signal: controller.signal,
      });

      if (!upstreamResponse.ok) {
        res.status(502).json({
          ok: false,
          code: 'UPSTREAM_ERROR',
          error:
            'Layanan AI Konsultan sedang mengalami kendala saat memproses pertanyaan. Silakan coba beberapa saat lagi.',
        });
        return;
      }

      const contentType = upstreamResponse.headers.get('content-type') || '';
      let rawData: unknown;

      if (contentType.includes('application/json')) {
        rawData = await upstreamResponse.json();
      } else {
        rawData = await upstreamResponse.text();
      }

      const reply = extractReplyFromN8nPayload(rawData);
      if (!reply) {
        res.status(502).json({
          ok: false,
          code: 'EMPTY_UPSTREAM_REPLY',
          error:
            'AI Konsultan tidak mengembalikan jawaban yang dapat dibaca. Pastikan node Respond to Webhook pada n8n mengirimkan properti reply.',
        });
        return;
      }

      res.json({
        ok: true,
        reply,
        sessionId: validation.payload.sessionId,
      });
    } catch (error: unknown) {
      const isAbort = error instanceof Error && error.name === 'AbortError';
      res.status(isAbort ? 504 : 502).json({
        ok: false,
        code: isAbort ? 'UPSTREAM_TIMEOUT' : 'UPSTREAM_CONNECTION_FAILED',
        error: isAbort
          ? 'Permintaan ke AI Konsultan melebihi batas waktu tunggu. Silakan coba kirim ulang pertanyaan kamu.'
          : 'Tidak dapat terhubung ke layanan AI Konsultan saat ini. Silakan periksa koneksi atau coba lagi nanti.',
      });
    } finally {
      clearTimeout(timeoutId);
    }
  });

  // Handle malformed JSON body gracefully
  app.use((err: unknown, _req: Request, res: Response, next: express.NextFunction) => {
    if (err instanceof SyntaxError && 'body' in err) {
      res.status(400).json({
        ok: false,
        code: 'INVALID_JSON',
        error: 'Format data permintaan tidak valid.',
      });
      return;
    }
    next(err);
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`GREEN ENERGY server listening on http://0.0.0.0:${PORT}`);
  });
}

createServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
