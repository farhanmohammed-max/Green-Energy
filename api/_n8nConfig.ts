/**
 * Server-side only webhook resolver.
 * Never import this file from frontend React components.
 * Environment variable N8N_WEBHOOK_URL always takes precedence when configured.
 */
const CONFIGURED_N8N_WEBHOOK_URL =
  'https://miaw-maiw-miaw.app.n8n.cloud/webhook/konsultan-greentech';

export function getServerWebhookUrl(): string {
  const fromEnv = (process.env.N8N_WEBHOOK_URL ?? '').trim();
  return fromEnv || CONFIGURED_N8N_WEBHOOK_URL;
}
