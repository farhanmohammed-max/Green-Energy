export const MAX_CONSULTATION_MESSAGE_LENGTH = 1000;
export const DEFAULT_N8N_TIMEOUT_MS = 25000;

export const N8N_NOT_CONFIGURED_MESSAGE =
  'Fitur konsultasi AI sedang dalam tahap konfigurasi. Administrator perlu mengatur variabel N8N_WEBHOOK_URL di konfigurasi server terlebih dahulu.';

export interface ConsultationRequestPayload {
  message: string;
  sessionId: string;
  source: 'website';
}

export type ValidationResult =
  | { valid: true; payload: ConsultationRequestPayload }
  | { valid: false; error: string };

const SESSION_ID_PATTERN = /^[a-zA-Z0-9_-]{6,128}$/;

/**
 * Validates and sanitizes incoming consultation messages before forwarding to n8n.
 */
export function validateConsultationInput(body: unknown): ValidationResult {
  if (!body || typeof body !== 'object') {
    return { valid: false, error: 'Permintaan tidak valid. Silakan kirim pertanyaan dalam format teks.' };
  }

  const record = body as Record<string, unknown>;
  const rawMessage = record.message;
  const rawSessionId = record.sessionId;

  if (typeof rawMessage !== 'string') {
    return { valid: false, error: 'Pesan pertanyaan wajib diisi berupa teks.' };
  }

  // Strip null bytes and normalize line endings
  const cleanedMessage = rawMessage.replace(/\0/g, '').replace(/\r\n/g, '\n').trim();

  if (cleanedMessage.length === 0) {
    return { valid: false, error: 'Silakan tulis pertanyaan terlebih dahulu sebelum mengirim.' };
  }

  if (cleanedMessage.length > MAX_CONSULTATION_MESSAGE_LENGTH) {
    return {
      valid: false,
      error: `Pesan terlalu panjang. Batas maksimal adalah ${MAX_CONSULTATION_MESSAGE_LENGTH} karakter.`,
    };
  }

  if (typeof rawSessionId !== 'string' || !SESSION_ID_PATTERN.test(rawSessionId.trim())) {
    return {
      valid: false,
      error: 'Sesi konsultasi tidak valid. Silakan muat ulang halaman atau mulai sesi baru.',
    };
  }

  return {
    valid: true,
    payload: {
      message: cleanedMessage,
      sessionId: rawSessionId.trim(),
      source: 'website',
    },
  };
}

export type WebhookUrlCheck =
  | { configured: false; valid: false; reason: 'empty' }
  | { configured: true; valid: false; reason: 'invalid_format' | 'unsafe_host' }
  | { configured: true; valid: true; url: string };

const BLOCKED_HOSTNAMES = new Set([
  'localhost',
  '127.0.0.1',
  '0.0.0.0',
  '::1',
  '[::1]',
  '169.254.169.254',
  'metadata.google.internal',
]);

function isPrivateOrLinkLocalIPv4(hostname: string): boolean {
  const parts = hostname.split('.');
  if (parts.length !== 4 || !parts.every((p) => /^\d+$/.test(p))) {
    return false;
  }
  const [a, b] = parts.map(Number);
  if (a === 10) return true;
  if (a === 127) return true;
  if (a === 169 && b === 254) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  if (a === 0) return true;
  return false;
}

/**
 * Validates N8N_WEBHOOK_URL to ensure proper scheme and guard against SSRF targets.
 */
export function validateWebhookUrl(rawUrl: string | undefined): WebhookUrlCheck {
  const trimmed = (rawUrl ?? '').trim();
  if (!trimmed) {
    return { configured: false, valid: false, reason: 'empty' };
  }

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return { configured: true, valid: false, reason: 'invalid_format' };
  }

  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
    return { configured: true, valid: false, reason: 'invalid_format' };
  }

  const hostname = parsed.hostname.toLowerCase();
  if (BLOCKED_HOSTNAMES.has(hostname) || isPrivateOrLinkLocalIPv4(hostname)) {
    return { configured: true, valid: false, reason: 'unsafe_host' };
  }

  return { configured: true, valid: true, url: parsed.toString() };
}

const REPLY_KEYS = ['reply', 'output', 'text', 'response', 'message', 'answer', 'content'] as const;

function extractFromObject(obj: Record<string, unknown>, depth: number): string | null {
  if (depth > 4) return null;

  for (const key of REPLY_KEYS) {
    const val = obj[key];
    if (typeof val === 'string' && val.trim().length > 0) {
      return val.trim();
    }
  }

  // Handle nested wrapper objects like { data: { output: "..." } } or { result: { reply: "..." } }
  const containerKeys = ['data', 'result', 'body', 'json'] as const;
  for (const key of containerKeys) {
    const nested = obj[key];
    if (nested && typeof nested === 'object') {
      const found = extractReplyFromN8nPayload(nested, depth + 1);
      if (found) return found;
    }
  }

  return null;
}

/**
 * Extracts a clean text reply from standard `{ reply }` or common alternative n8n response shapes
 * (`output`, `text`, `response`, `message`, arrays of items, nested data objects, or plain text).
 */
export function extractReplyFromN8nPayload(payload: unknown, depth = 0): string | null {
  if (depth > 4 || payload === null || payload === undefined) {
    return null;
  }

  if (typeof payload === 'string') {
    const trimmed = payload.trim();
    if (!trimmed) return null;

    // If n8n sent a JSON string inside text, attempt to parse it cleanly
    if ((trimmed.startsWith('{') && trimmed.endsWith('}')) || (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
      try {
        const parsed = JSON.parse(trimmed);
        const extracted = extractReplyFromN8nPayload(parsed, depth + 1);
        if (extracted) return extracted;
      } catch {
        // Fall through to plain text
      }
    }
    return trimmed;
  }

  if (Array.isArray(payload)) {
    for (const item of payload) {
      const found = extractReplyFromN8nPayload(item, depth + 1);
      if (found) return found;
    }
    return null;
  }

  if (typeof payload === 'object') {
    return extractFromObject(payload as Record<string, unknown>, depth);
  }

  return null;
}

/**
 * Resolves configured timeout in milliseconds with safe bounds (5s - 60s).
 */
export function resolveTimeoutMs(rawTimeout: string | undefined): number {
  const parsed = Number(rawTimeout);
  if (!Number.isFinite(parsed) || parsed < 5000 || parsed > 60000) {
    return DEFAULT_N8N_TIMEOUT_MS;
  }
  return Math.floor(parsed);
}
