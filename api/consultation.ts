import type { IncomingMessage, ServerResponse } from 'node:http';

/**
 * Self-contained Vercel Serverless Function for POST /api/consultation.
 * Zero relative/cross-directory runtime imports to guarantee compatibility
 * with Vercel Node.js ESM runtimes ("type": "module").
 */

const DEFAULT_N8N_WEBHOOK_URL =
  'https://miaw-maiw-miaw.app.n8n.cloud/webhook/konsultan-greentech';
const MAX_MESSAGE_LENGTH = 1000;
const DEFAULT_TIMEOUT_MS = 30000;
const SESSION_ID_PATTERN = /^[a-zA-Z0-9_-]{6,128}$/;

const BLOCKED_HOSTNAMES = new Set([
  'localhost',
  '127.0.0.1',
  '0.0.0.0',
  '::1',
  '[::1]',
  '169.254.169.254',
  'metadata.google.internal',
]);

const REPLY_KEYS = ['reply', 'output', 'text', 'response', 'message', 'answer', 'content'] as const;
const CONTAINER_KEYS = ['data', 'result', 'body', 'json'] as const;

interface VercelRequest extends IncomingMessage {
  body?: unknown;
}

interface VercelResponse extends ServerResponse {
  status?: (code: number) => VercelResponse;
  json?: (body: unknown) => void;
}

function sendJson(res: VercelResponse, statusCode: number, payload: unknown) {
  res.setHeader('Cache-Control', 'no-store');
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

function isPrivateOrLinkLocalIPv4(hostname: string): boolean {
  const parts = hostname.split('.');
  if (parts.length !== 4 || !parts.every((p) => /^\d+$/.test(p))) {
    return false;
  }
  const [a, b] = parts.map(Number);
  return (
    a === 10 ||
    a === 127 ||
    a === 0 ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168)
  );
}

function resolveWebhookUrl(): { valid: true; url: string } | { valid: false; reason: string } {
  const raw = (process.env.N8N_WEBHOOK_URL ?? '').trim() || DEFAULT_N8N_WEBHOOK_URL;
  let parsed: URL;
  try {
    parsed = new URL(raw);
  } catch {
    return { valid: false, reason: 'invalid_format' };
  }

  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
    return { valid: false, reason: 'invalid_format' };
  }

  const host = parsed.hostname.toLowerCase();
  if (BLOCKED_HOSTNAMES.has(host) || isPrivateOrLinkLocalIPv4(host)) {
    return { valid: false, reason: 'unsafe_host' };
  }

  return { valid: true, url: parsed.toString() };
}

function resolveTimeoutMs(): number {
  const parsed = Number(process.env.N8N_TIMEOUT_MS);
  if (!Number.isFinite(parsed) || parsed < 5000 || parsed > 55000) {
    return DEFAULT_TIMEOUT_MS;
  }
  return Math.floor(parsed);
}

function extractReply(payload: unknown, depth = 0): string | null {
  if (depth > 4 || payload === null || payload === undefined) return null;

  if (typeof payload === 'string') {
    const trimmed = payload.trim();
    if (!trimmed) return null;
    if (
      (trimmed.startsWith('{') && trimmed.endsWith('}')) ||
      (trimmed.startsWith('[') && trimmed.endsWith(']'))
    ) {
      try {
        const parsed = JSON.parse(trimmed);
        const extracted = extractReply(parsed, depth + 1);
        if (extracted) return extracted;
      } catch {
        // Return as plain text
      }
    }
    return trimmed;
  }

  if (Array.isArray(payload)) {
    for (const item of payload) {
      const found = extractReply(item, depth + 1);
      if (found) return found;
    }
    return null;
  }

  if (typeof payload === 'object') {
    const obj = payload as Record<string, unknown>;
    for (const key of REPLY_KEYS) {
      const val = obj[key];
      if (typeof val === 'string' && val.trim().length > 0) {
        return val.trim();
      }
    }
    for (const key of CONTAINER_KEYS) {
      const nested = obj[key];
      if (nested && typeof nested === 'object') {
        const found = extractReply(nested, depth + 1);
        if (found) return found;
      }
    }
  }

  return null;
}

async function readJsonBody(req: VercelRequest): Promise<unknown> {
  if (req.body !== undefined) {
    if (typeof req.body === 'string') {
      try {
        return JSON.parse(req.body);
      } catch {
        return null;
      }
    }
    if (Buffer.isBuffer(req.body)) {
      try {
        return JSON.parse(req.body.toString('utf8'));
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
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

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
    parsedBody = await readJsonBody(req);
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

  if (!parsedBody || typeof parsedBody !== 'object') {
    sendJson(res, 400, {
      ok: false,
      code: 'INVALID_INPUT',
      error: 'Permintaan tidak valid. Silakan kirim pertanyaan dalam format teks.',
    });
    return;
  }

  const record = parsedBody as Record<string, unknown>;
  const rawMessage = record.message;
  const rawSessionId = record.sessionId;

  if (typeof rawMessage !== 'string') {
    sendJson(res, 400, {
      ok: false,
      code: 'INVALID_INPUT',
      error: 'Pesan pertanyaan wajib diisi berupa teks.',
    });
    return;
  }

  const cleanedMessage = rawMessage.replace(/\0/g, '').replace(/\r\n/g, '\n').trim();
  if (!cleanedMessage) {
    sendJson(res, 400, {
      ok: false,
      code: 'INVALID_INPUT',
      error: 'Silakan tulis pertanyaan terlebih dahulu sebelum mengirim.',
    });
    return;
  }

  if (cleanedMessage.length > MAX_MESSAGE_LENGTH) {
    sendJson(res, 400, {
      ok: false,
      code: 'INVALID_INPUT',
      error: `Pesan terlalu panjang. Batas maksimal adalah ${MAX_MESSAGE_LENGTH} karakter.`,
    });
    return;
  }

  if (typeof rawSessionId !== 'string' || !SESSION_ID_PATTERN.test(rawSessionId.trim())) {
    sendJson(res, 400, {
      ok: false,
      code: 'INVALID_INPUT',
      error: 'Sesi konsultasi tidak valid. Silakan muat ulang halaman atau mulai sesi baru.',
    });
    return;
  }

  const webhook = resolveWebhookUrl();
  if (!webhook.valid) {
    sendJson(res, 503, {
      ok: false,
      code: 'INVALID_WEBHOOK_CONFIG',
      error:
        'Konfigurasi layanan konsultasi AI pada server belum valid. Mohon periksa pengaturan N8N_WEBHOOK_URL.',
    });
    return;
  }

  const sessionId = rawSessionId.trim();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), resolveTimeoutMs());

  try {
    const upstreamResponse = await fetch(webhook.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json, text/plain;q=0.9',
      },
      body: JSON.stringify({
        message: cleanedMessage,
        sessionId,
        source: 'website',
      }),
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

    const reply = extractReply(rawData);
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
      sessionId,
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
