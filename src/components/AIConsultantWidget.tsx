import { useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  Bot,
  Loader2,
  MessageSquareText,
  RotateCcw,
  Send,
  X,
} from 'lucide-react';
import { AI_WELCOME_MESSAGE, QUICK_CONSULTATION_QUESTIONS } from '../data/campaignData';
import { MAX_CONSULTATION_MESSAGE_LENGTH } from '../lib/n8n';
import { parseInlineEmphasis, parseMessageBlocks } from '../lib/formatMessage';

export interface ChatMessage {
  id: string;
  role: 'assistant' | 'user' | 'error';
  content: string;
  timestamp: string;
  retryPrompt?: string;
}

interface AIConsultantWidgetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  queuedPrompt: string | null;
  onConsumeQueuedPrompt: () => void;
}

const SESSION_STORAGE_KEY = 'green_energy_consultation_session_id';

function createSessionId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `ge_${crypto.randomUUID().replace(/-/g, '')}`;
  }
  return `ge_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

function getOrCreateSessionId(): string {
  try {
    const existing = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (existing && /^[a-zA-Z0-9_-]{6,128}$/.test(existing)) {
      return existing;
    }
    const fresh = createSessionId();
    window.sessionStorage.setItem(SESSION_STORAGE_KEY, fresh);
    return fresh;
  } catch {
    return createSessionId();
  }
}

function formatClockTime(): string {
  try {
    return new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

function createInitialMessages(): ChatMessage[] {
  return [
    {
      id: 'welcome-msg',
      role: 'assistant',
      content: AI_WELCOME_MESSAGE,
      timestamp: formatClockTime(),
    },
  ];
}

function FormattedMessageBody({ content }: { content: string }) {
  const blocks = parseMessageBlocks(content);

  const renderInline = (text: string) =>
    parseInlineEmphasis(text).map((seg, idx) =>
      seg.bold ? (
        <strong key={idx} className="font-semibold">
          {seg.text}
        </strong>
      ) : (
        <span key={idx}>{seg.text}</span>
      )
    );

  return (
    <div className="space-y-2 text-sm leading-relaxed">
      {blocks.map((block, index) => {
        if (block.type === 'bullet-list') {
          return (
            <ul key={index} className="list-disc pl-5 space-y-1">
              {block.items.map((item, idx) => (
                <li key={idx}>{renderInline(item)}</li>
              ))}
            </ul>
          );
        }
        if (block.type === 'ordered-list') {
          return (
            <ol key={index} className="space-y-2">
              {block.items.map((item, idx) => (
                <li key={idx} className="space-y-1">
                  <div className="flex items-start gap-2">
                    <span className="font-semibold text-emerald-800 tabular-nums shrink-0">
                      {item.number}.
                    </span>
                    <span>{renderInline(item.text)}</span>
                  </div>
                  {item.subItems.length > 0 && (
                    <ul className="list-disc pl-8 space-y-1 text-[#3E5248]">
                      {item.subItems.map((sub, subIdx) => (
                        <li key={subIdx}>{renderInline(sub)}</li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ol>
          );
        }
        return <p key={index}>{renderInline(block.text)}</p>;
      })}
    </div>
  );
}

export function AIConsultantWidget({
  isOpen,
  onOpenChange,
  queuedPrompt,
  onConsumeQueuedPrompt,
}: AIConsultantWidgetProps) {
  const [sessionId, setSessionId] = useState<string>(() => getOrCreateSessionId());
  const [messages, setMessages] = useState<ChatMessage[]>(() => createInitialMessages());
  const [inputValue, setInputValue] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      const frame = window.requestAnimationFrame(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
        }
      });
      const timer = window.setTimeout(() => {
        inputRef.current?.focus();
      }, 120);
      return () => {
        window.cancelAnimationFrame(frame);
        window.clearTimeout(timer);
      };
    }
  }, [isOpen, messages, isLoading]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onOpenChange(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onOpenChange]);

  const sendMessage = async (rawText: string) => {
    const trimmed = rawText.trim();
    if (!trimmed) {
      setValidationError('Silakan ketik pertanyaan terlebih dahulu.');
      return;
    }

    if (trimmed.length > MAX_CONSULTATION_MESSAGE_LENGTH) {
      setValidationError(
        `Pesan terlalu panjang. Maksimal ${MAX_CONSULTATION_MESSAGE_LENGTH} karakter.`
      );
      return;
    }

    if (isLoading) return;

    setValidationError(null);
    setInputValue('');

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmed,
      timestamp: formatClockTime(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/consultation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          sessionId,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data || data.ok !== true || typeof data.reply !== 'string') {
        const friendlyError =
          data && typeof data.error === 'string'
            ? data.error
            : 'Koneksi ke layanan AI Konsultan gagal. Silakan coba kembali beberapa saat lagi.';

        setMessages((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            role: 'error',
            content: friendlyError,
            timestamp: formatClockTime(),
            retryPrompt: trimmed,
          },
        ]);
        return;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          content: data.reply,
          timestamp: formatClockTime(),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'error',
          content:
            'Tidak dapat terhubung ke server konsultasi. Pastikan koneksi internet aktif lalu coba lagi.',
          timestamp: formatClockTime(),
          retryPrompt: trimmed,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Automatically process queued prompt triggered from Product Cards or Quick Prompt section
  useEffect(() => {
    if (isOpen && queuedPrompt && !isLoading) {
      const promptToSend = queuedPrompt;
      onConsumeQueuedPrompt();
      void sendMessage(promptToSend);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, queuedPrompt]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void sendMessage(inputValue);
  };

  const handleResetSession = () => {
    if (isLoading) return;
    const freshId = createSessionId();
    try {
      window.sessionStorage.setItem(SESSION_STORAGE_KEY, freshId);
    } catch {
      // Ignore storage failures in restricted contexts
    }
    setSessionId(freshId);
    setMessages(createInitialMessages());
    setValidationError(null);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6">
      {/* Chat Dialog Panel */}
      {isOpen && (
        <section
          role="dialog"
          aria-label="AI Konsultan Green Tech"
          aria-modal="false"
          className="mb-3 flex h-[min(78vh,620px)] w-[min(calc(100vw-2rem),410px)] flex-col overflow-hidden rounded-2xl border border-[#14261E]/15 bg-white shadow-xl"
        >
          {/* Header */}
          <div className="bg-[#0B2E22] px-4 py-3.5 text-white">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5 min-w-0">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-700/80 text-white">
                  <Bot className="h-4 w-4" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <h2 className="font-display text-sm font-bold tracking-[0.015em] text-white">
                    AI Konsultan Green Tech
                  </h2>
                  <p className="mt-0.5 text-xs leading-snug text-emerald-100/85">
                    Tanyakan apa saja seputar hemat energi, teknologi hijau, dan solusi penggunaan
                    energi yang lebih efisien.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={handleResetSession}
                  disabled={isLoading}
                  aria-label="Mulai sesi konsultasi baru"
                  title="Sesi Baru"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-emerald-100 hover:bg-white/10 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
                >
                  <RotateCcw className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => onOpenChange(false)}
                  aria-label="Tutup jendela AI Konsultan"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-emerald-100 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="mt-2.5 flex items-center justify-between gap-2 border-t border-white/10 pt-2 text-[11px] text-emerald-100/75">
              <span>Pesan konsultasi dapat dicatat untuk evaluasi layanan.</span>
              <span className="font-mono shrink-0" title={sessionId}>
                Sesi: {sessionId.slice(0, 8)}
              </span>
            </div>
          </div>

          {/* Messages Stream */}
          <div
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto bg-[#F8F6F1] px-4 py-4 space-y-3.5"
            aria-live="polite"
          >
            {messages.map((msg) => {
              if (msg.role === 'user') {
                return (
                  <div key={msg.id} className="flex flex-col items-end">
                    <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-emerald-700 px-3.5 py-2.5 text-white">
                      <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                        {msg.content}
                      </p>
                    </div>
                    {msg.timestamp && (
                      <span className="mt-1 text-[11px] text-[#64786E] tabular-nums">
                        Anda · {msg.timestamp}
                      </span>
                    )}
                  </div>
                );
              }

              if (msg.role === 'error') {
                return (
                  <div key={msg.id} className="flex flex-col items-start">
                    <div
                      role="alert"
                      className="max-w-[92%] rounded-2xl rounded-bl-sm border border-amber-700/25 bg-amber-50 px-3.5 py-3 text-amber-950"
                    >
                      <div className="flex items-start gap-2">
                        <AlertCircle
                          className="mt-0.5 h-4 w-4 shrink-0 text-amber-800"
                          aria-hidden="true"
                        />
                        <div className="space-y-2">
                          <p className="text-xs font-semibold text-amber-900">
                            Kendala Layanan Konsultasi
                          </p>
                          <p className="text-sm leading-relaxed text-amber-950">{msg.content}</p>
                          {msg.retryPrompt && (
                            <button
                              type="button"
                              onClick={() => void sendMessage(msg.retryPrompt!)}
                              disabled={isLoading}
                              className="inline-flex items-center gap-1.5 rounded-md border border-amber-800/25 bg-white px-2.5 py-1 text-xs font-semibold text-amber-950 hover:bg-amber-100 transition-colors cursor-pointer disabled:opacity-50"
                            >
                              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                              Coba Lagi
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <div key={msg.id} className="flex flex-col items-start">
                  <div className="max-w-[90%] rounded-2xl rounded-bl-sm border border-[#14261E]/10 bg-white px-3.5 py-3 text-[#14261E]">
                    <FormattedMessageBody content={msg.content} />
                  </div>
                  {msg.timestamp && (
                    <span className="mt-1 text-[11px] text-[#64786E] tabular-nums">
                      AI Konsultan · {msg.timestamp}
                    </span>
                  )}
                </div>
              );
            })}

            {/* Quick question suggestions visible when conversation just started */}
            {messages.length === 1 && !isLoading && (
              <div className="pt-1">
                <p className="mb-2 text-xs font-medium text-[#54685E]">Pertanyaan cepat:</p>
                <div className="flex flex-col gap-1.5">
                  {QUICK_CONSULTATION_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => void sendMessage(q)}
                      className="rounded-lg border border-[#14261E]/12 bg-white px-3 py-2 text-left text-xs font-medium text-[#163025] hover:border-emerald-700/40 hover:bg-[#EDF5F0] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex items-center gap-2 rounded-xl border border-[#14261E]/10 bg-white px-3.5 py-2.5 w-fit">
                <Loader2 className="h-4 w-4 animate-spin text-emerald-700" aria-hidden="true" />
                <span className="text-xs font-medium text-[#3E5248]">
                  AI Konsultan sedang memproses pertanyaan...
                </span>
              </div>
            )}
          </div>

          {/* Input Composer */}
          <form
            onSubmit={handleFormSubmit}
            className="border-t border-[#14261E]/10 bg-white px-3.5 py-3"
          >
            {validationError && (
              <p role="alert" className="mb-2 text-xs font-medium text-red-700">
                {validationError}
              </p>
            )}

            <div className="flex items-center gap-2">
              <label htmlFor="ai-consultant-input" className="sr-only">
                Ketik pertanyaan untuk AI Konsultan Green Tech
              </label>
              <input
                ref={inputRef}
                id="ai-consultant-input"
                type="text"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  if (validationError) setValidationError(null);
                }}
                maxLength={MAX_CONSULTATION_MESSAGE_LENGTH + 20}
                placeholder="Tulis pertanyaan seputar hemat energi..."
                disabled={isLoading}
                className="min-h-[42px] flex-1 rounded-lg border border-[#14261E]/15 bg-[#FAF9F5] px-3 py-2 text-sm text-[#14261E] placeholder:text-[#6B7F75] focus:border-emerald-700 focus:bg-white focus:outline-none disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={isLoading}
                aria-label="Kirim pertanyaan"
                className="inline-flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 transition-colors cursor-pointer disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
              >
                <Send className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <div className="mt-1.5 flex items-center justify-between text-[11px] text-[#64786E] tabular-nums">
              <span>Tekan Enter untuk mengirim</span>
              <span>
                {inputValue.length}/{MAX_CONSULTATION_MESSAGE_LENGTH}
              </span>
            </div>
          </form>
        </section>
      )}

      {/* Floating Toggle Button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => onOpenChange(!isOpen)}
          aria-expanded={isOpen}
          aria-label={isOpen ? 'Tutup AI Konsultan Green Tech' : 'Buka AI Konsultan Green Tech'}
          className="inline-flex min-h-[48px] items-center gap-2.5 rounded-full bg-[#0B2E22] px-5 py-3 text-sm font-semibold text-white shadow-lg hover:bg-emerald-800 active:scale-[0.98] transition-all duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
        >
          {isOpen ? (
            <>
              <X className="h-4 w-4" aria-hidden="true" />
              <span className="whitespace-nowrap">Tutup Konsultan</span>
            </>
          ) : (
            <>
              <MessageSquareText className="h-4 w-4 text-emerald-300" aria-hidden="true" />
              <span className="whitespace-nowrap">AI Konsultan</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
