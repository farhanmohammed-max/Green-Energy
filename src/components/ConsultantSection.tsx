import { ArrowRight, Bot, MessageSquareText, Workflow } from 'lucide-react';
import { QUICK_CONSULTATION_QUESTIONS } from '../data/campaignData';

interface ConsultantSectionProps {
  onOpenConsultant: () => void;
  onSelectQuickQuestion: (question: string) => void;
  consultationConfigured: boolean | null;
}

export function ConsultantSection({
  onOpenConsultant,
  onSelectQuickQuestion,
  consultationConfigured,
}: ConsultantSectionProps) {
  return (
    <section id="konsultan" className="bg-editorial-linen border-t border-[#14261E]/10 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="bg-consultant-panel rounded-2xl border border-emerald-900/15 p-6 shadow-[0_14px_38px_-22px_rgba(11,46,34,0.2)] sm:p-10 lg:p-12">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
            {/* Left Intro & Primary CTA */}
            <div className="lg:col-span-6">
              <p className="text-xs font-semibold tracking-wider text-emerald-800">
                AI Konsultan Green Tech · Terhubung ke n8n AI Agent
              </p>
              <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-[#0B2E22] sm:text-4xl [text-wrap:balance]">
                Konsultasi Hemat Energi & Teknologi Hijau Secara Interaktif
              </h2>
              <p className="mt-4 text-base leading-relaxed text-[#41544B]">
                Tanyakan apa saja seputar hemat energi, teknologi hijau, dan solusi penggunaan
                energi yang lebih efisien. Pertanyaanmu diteruskan melalui backend server secara
                aman ke AI Agent pada workflow n8n.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={onOpenConsultant}
                  className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-lg bg-emerald-700 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-800 active:scale-[0.99] transition-all duration-150 whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
                >
                  <MessageSquareText className="h-4 w-4" aria-hidden="true" />
                  Buka AI Konsultan
                </button>

                {consultationConfigured === false && (
                  <span className="text-xs text-[#5A6E64]">
                    Status integrasi: menunggu konfigurasi <span className="font-mono">N8N_WEBHOOK_URL</span> di server
                  </span>
                )}
              </div>

              <div className="mt-8 grid grid-cols-1 gap-4 border-t border-[#14261E]/10 pt-6 sm:grid-cols-2">
                <div className="flex items-start gap-3">
                  <Workflow className="mt-0.5 h-4 w-4 shrink-0 text-emerald-800" aria-hidden="true" />
                  <div>
                    <h3 className="text-sm font-bold text-[#0B2E22]">Jalur Webhook Aman</h3>
                    <p className="mt-1 text-xs leading-relaxed text-[#485C52]">
                      URL Webhook disimpan di server backend, tidak diekspos ke browser pengunjung.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Bot className="mt-0.5 h-4 w-4 shrink-0 text-emerald-800" aria-hidden="true" />
                  <div>
                    <h3 className="text-sm font-bold text-[#0B2E22]">Referensi Katalog n8n</h3>
                    <p className="mt-1 text-xs leading-relaxed text-[#485C52]">
                      AI Agent dapat memanfaatkan tool <span className="font-mono">Katalog_Produk</span> dan kalkulator pada workflow n8n.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Quick Prompts Trigger List */}
            <div className="lg:col-span-6">
              <div className="rounded-xl border border-[#14261E]/10 bg-white p-6">
                <h3 className="font-display text-base font-bold text-[#0B2E22]">
                  Mulai dari Pertanyaan Cepat
                </h3>
                <p className="mt-1 text-xs text-[#5A6E64]">
                  Pilih salah satu topik di bawah untuk langsung membuka jendela konsultasi.
                </p>

                <div className="mt-4 space-y-2.5">
                  {QUICK_CONSULTATION_QUESTIONS.map((question) => (
                    <button
                      key={question}
                      type="button"
                      onClick={() => onSelectQuickQuestion(question)}
                      className="group flex min-h-[44px] w-full items-center justify-between gap-3 rounded-lg border border-[#14261E]/10 bg-[#FAF9F5] px-4 py-3 text-left text-sm font-medium text-[#163025] hover:border-emerald-700/40 hover:bg-[#EDF5F0] transition-colors duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
                    >
                      <span>{question}</span>
                      <ArrowRight
                        className="h-4 w-4 shrink-0 text-emerald-800 transition-transform duration-150 group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </button>
                  ))}
                </div>

                <p className="mt-4 text-xs text-[#5A6E64]">
                  Pemberitahuan: Pesan konsultasi dapat dicatat untuk keperluan evaluasi layanan.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
