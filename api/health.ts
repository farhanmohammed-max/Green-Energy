import type { IncomingMessage, ServerResponse } from 'node:http';

const DEFAULT_N8N_WEBHOOK_URL =
  'https://miaw-maiw-miaw.app.n8n.cloud/webhook/konsultan-greentech';

interface VercelResponse extends ServerResponse {
  status?: (code: number) => VercelResponse;
  json?: (body: unknown) => void;
}

export default function handler(req: IncomingMessage, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    res.statusCode = 405;
    res.end();
    return;
  }

  const rawUrl = (process.env.N8N_WEBHOOK_URL ?? '').trim() || DEFAULT_N8N_WEBHOOK_URL;
  let configured = false;
  try {
    const parsed = new URL(rawUrl);
    configured = parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    configured = false;
  }

  const payload = {
    status: 'ok',
    consultationConfigured: configured,
  };

  res.setHeader('Cache-Control', 'no-store');
  if (typeof res.status === 'function') {
    const nextRes = res.status(200);
    if (typeof nextRes.json === 'function') {
      nextRes.json(payload);
      return;
    }
  }

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(payload));
}
