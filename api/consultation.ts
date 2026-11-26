import type { IncomingMessage, ServerResponse } from 'node:http';
import {
  N8N_NOT_CONFIGURED_MESSAGE,
  extractReplyFromN8nPayload,
  resolveTimeoutMs,
  validateConsultationInput,
  validateWebhookUrl,
} from '../src/lib/n8n';
import { getServerWebhookUrl } from './_n8nConfig';

interface VercelRequest extends IncomingMessage {
  body?: unknown;
}

interface VercelResponse extends ServerResponse {
  status?: (code: number) => VercelResponse;
  json?: (body: unknown) => void;
}

function sendJson(res: VercelResponse, statusCode: number, payload: unknown) {
  if (typeof res.status === 'function') {
    const nextRes = res.status(statusCode);
    if (typeof nextRes.json === 'function') {
      nextRes.json(payload);
      return;
    }
  }
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(payload));
}

async function readBody(req: VercelRequest): Promise<unknown> {
  if (req.body !== undefined) {
    if (typeof req.body === 'string') {
      try {
        return JSON.parse(req.body);
      } catch {
        return null;
      }
    }
    return req.body;
  }

  const chunks: Buffer[] = [];
  let totalBytes = 0;
  for await (const chunk of req) {
    const buf = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    totalBytes += buf.length;
    if (totalBytes > 16 * 1024) {
      throw new Error('PAYLOAD_TOO_LARGE');
    }
    chunks.push(buf);
  }

  const raw = Buffer.concat(chunks).toString('utf8').trim();
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    sendJson(res, 405, {
      ok: false,
      code: 'METHOD_NOT_ALLOWED',
      error: 'Metode permintaan tidak didukung. Gunakan HTTP POST.',
    });
    return;
  }

  let parsedBody: unknown;
  try {
    parsedBody = await readBody(req);
  } catch (err) {
    if (err instanceof Error && err.message === 'PAYLOAD_TOO_LARGE') {
      sendJson(res, 413, {
        ok: false,
        code: 'PAYLOAD_TOO_LARGE',
        error: 'Ukuran permintaan terlalu besar.',
      });
      return;
    }
    parsedBody = null;
  }

  const validation = validateConsultationInput(parsedBody);
  if (!validation.valid) {
    sendJson(res, 400, {
      ok: false,
      code: 'INVALID_INPUT',
      error: validation.error,
    });
    return;
  }

  const webhookCheck = validateWebhookUrl(getServerWebhookUrl());
  if (!webhookCheck.configured) {
    sendJson(res, 503, {
      ok: false,
      code: 'NOT_CONFIGURED',
      error: N8N_NOT_CONFIGURED_MESSAGE,
    });
    return;
  }

  if (!webhookCheck.valid) {
    sendJson(res, 503, {
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
      sendJson(res, 502, {
        ok: false,
        code: 'UPSTREAM_ERROR',
        error:
          'Layanan AI Konsultan sedang mengalami kendala saat memproses pertanyaan. Silakan coba beberapa saat lagi.',
      });
      return;
    }

    const contentType = upstreamResponse.headers.get('content-type') || '';
    const rawData: unknown = contentType.includes('application/json')
      ? await upstreamResponse.json()
      : await upstreamResponse.text();

    const reply = extractReplyFromN8nPayload(rawData);
    if (!reply) {
      sendJson(res, 502, {
        ok: false,
        code: 'EMPTY_UPSTREAM_REPLY',
        error:
          'AI Konsultan tidak mengembalikan jawaban yang dapat dibaca. Pastikan node Respond to Webhook pada n8n mengirimkan properti reply.',
      });
      return;
    }

    sendJson(res, 200, {
      ok: true,
      reply,
      sessionId: validation.payload.sessionId,
    });
  } catch (error: unknown) {
    const isAbort = error instanceof Error && error.name === 'AbortError';
    sendJson(res, isAbort ? 504 : 502, {
      ok: false,
      code: isAbort ? 'UPSTREAM_TIMEOUT' : 'UPSTREAM_CONNECTION_FAILED',
      error: isAbort
        ? 'Permintaan ke AI Konsultan melebihi batas waktu tunggu. Silakan coba kirim ulang pertanyaan kamu.'
        : 'Tidak dapat terhubung ke layanan AI Konsultan saat ini. Silakan periksa koneksi atau coba lagi nanti.',
    });
  } finally {
    clearTimeout(timeoutId);
  }
}
