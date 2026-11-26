import type { IncomingMessage, ServerResponse } from 'node:http';
import { validateWebhookUrl } from '../src/lib/n8n';
import { getServerWebhookUrl } from './_n8nConfig';

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

  const webhookCheck = validateWebhookUrl(getServerWebhookUrl());
  const payload = {
    status: 'ok',
    consultationConfigured: webhookCheck.valid,
  };

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
