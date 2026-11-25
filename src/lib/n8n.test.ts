import test from 'node:test';
import assert from 'node:assert/strict';
import {
  MAX_CONSULTATION_MESSAGE_LENGTH,
  extractReplyFromN8nPayload,
  resolveTimeoutMs,
  validateConsultationInput,
  validateWebhookUrl,
} from './n8n';

test('validateConsultationInput accepts valid Indonesian question and sessionId', () => {
  const result = validateConsultationInput({
    message: '  Bagaimana cara menghemat listrik di rumah?  ',
    sessionId: 'ge-session_123456',
  });
  assert.equal(result.valid, true);
  if (result.valid) {
    assert.equal(result.payload.message, 'Bagaimana cara menghemat listrik di rumah?');
    assert.equal(result.payload.sessionId, 'ge-session_123456');
    assert.equal(result.payload.source, 'website');
  }
});

test('validateConsultationInput rejects empty messages and oversized messages', () => {
  const empty = validateConsultationInput({ message: '   ', sessionId: 'ge-session_123456' });
  assert.equal(empty.valid, false);

  const longMsg = 'a'.repeat(MAX_CONSULTATION_MESSAGE_LENGTH + 1);
  const oversized = validateConsultationInput({ message: longMsg, sessionId: 'ge-session_123456' });
  assert.equal(oversized.valid, false);
});

test('validateConsultationInput rejects invalid session IDs', () => {
  const shortSession = validateConsultationInput({ message: 'Halo', sessionId: '123' });
  assert.equal(shortSession.valid, false);

  const badChars = validateConsultationInput({ message: 'Halo', sessionId: 'session with spaces!' });
  assert.equal(badChars.valid, false);
});

test('validateWebhookUrl distinguishes empty, invalid, unsafe SSRF, and valid HTTPS URLs', () => {
  assert.deepEqual(validateWebhookUrl(''), { configured: false, valid: false, reason: 'empty' });
  assert.deepEqual(validateWebhookUrl(undefined), { configured: false, valid: false, reason: 'empty' });
  assert.deepEqual(validateWebhookUrl('not-a-url'), {
    configured: true,
    valid: false,
    reason: 'invalid_format',
  });
  assert.deepEqual(validateWebhookUrl('file:///etc/passwd'), {
    configured: true,
    valid: false,
    reason: 'invalid_format',
  });
  assert.deepEqual(validateWebhookUrl('http://169.254.169.254/latest/meta-data'), {
    configured: true,
    valid: false,
    reason: 'unsafe_host',
  });
  assert.deepEqual(validateWebhookUrl('http://127.0.0.1:5678/webhook/test'), {
    configured: true,
    valid: false,
    reason: 'unsafe_host',
  });
  assert.deepEqual(validateWebhookUrl('https://n8n.example.org/webhook/green-energy'), {
    configured: true,
    valid: true,
    url: 'https://n8n.example.org/webhook/green-energy',
  });
});

test('extractReplyFromN8nPayload handles reply, output, text, response, message, arrays, and nested objects', () => {
  assert.equal(extractReplyFromN8nPayload({ reply: 'Gunakan lampu LED.' }), 'Gunakan lampu LED.');
  assert.equal(extractReplyFromN8nPayload({ output: 'Matikan perangkat standby.' }), 'Matikan perangkat standby.');
  assert.equal(extractReplyFromN8nPayload({ text: 'Panel surya memanfaatkan matahari.' }), 'Panel surya memanfaatkan matahari.');
  assert.equal(extractReplyFromN8nPayload({ response: 'Smart plug membantu kontrol daya.' }), 'Smart plug membantu kontrol daya.');
  assert.equal(extractReplyFromN8nPayload({ message: 'Gunakan pencahayaan alami.' }), 'Gunakan pencahayaan alami.');
  assert.equal(extractReplyFromN8nPayload([{ json: { output: 'Jawaban dari array n8n.' } }]), 'Jawaban dari array n8n.');
  assert.equal(extractReplyFromN8nPayload({ data: { reply: 'Nested reply.' } }), 'Nested reply.');
  assert.equal(extractReplyFromN8nPayload('Jawaban plain text.'), 'Jawaban plain text.');
  assert.equal(extractReplyFromN8nPayload({}), null);
  assert.equal(extractReplyFromN8nPayload('   '), null);
});

test('resolveTimeoutMs enforces safe bounds', () => {
  assert.equal(resolveTimeoutMs(undefined), 25000);
  assert.equal(resolveTimeoutMs('1000'), 25000);
  assert.equal(resolveTimeoutMs('15000'), 15000);
  assert.equal(resolveTimeoutMs('999999'), 25000);
});
