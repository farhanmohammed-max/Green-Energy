import { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Clock,
  Lightbulb,
  MessageSquareText,
  Plug,
  Power,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Sun,
  Thermometer,
  Wind,
} from 'lucide-react';
import {
  EXTRA_EDUCATION_TIPS,
  PRIMARY_EDUCATION_TIPS,
  type EducationTip,
} from '../data/campaignData';

interface EducationSectionProps {
  onAskTips: (question: string) => void;
}

function renderTipIcon(iconName: EducationTip['iconName']) {
  const iconClass = 'h-5 w-5 text-emerald-800';
  switch (iconName) {
    case 'lightbulb':
      return <Lightbulb className={iconClass} aria-hidden="true" />;
    case 'sparkles':
      return <Sparkles className={iconClass} aria-hidden="true" />;
    case 'power':
      return <Power className={iconClass} aria-hidden="true" />;
    case 'sliders':
      return <SlidersHorizontal className={iconClass} aria-hidden="true" />;
    case 'sun':
      return <Sun className={iconClass} aria-hidden="true" />;
    case 'shield':
      return <ShieldCheck className={iconClass} aria-hidden="true" />;
    case 'wind':
      return <Wind className={iconClass} aria-hidden="true" />;
    case 'thermometer':
      return <Thermometer className={iconClass} aria-hidden="true" />;
    case 'clock':
      return <Clock className={iconClass} aria-hidden="true" />;
    case 'plug':
      return <Plug className={iconClass} aria-hidden="true" />;
  }
}

export function EducationSection({ onAskTips }: EducationSectionProps) {
  const [showMoreTips, setShowMoreTips] = useState(false);

  const visibleTips = showMoreTips
    ? [...PRIMARY_EDUCATION_TIPS, ...EXTRA_EDUCATION_TIPS]
    : PRIMARY_EDUCATION_TIPS;

  return (
    <section id="edukasi" className="bg-sage-wash relative border-t border-[#14261E]/10 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-wider text-emerald-800">
              Edukasi Hemat Energi
            </p>
            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-[#0B2E22] sm:text-4xl [text-wrap:balance]">
              Kebiasaan Sederhana untuk Mengurangi Pemborosan Listrik
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-[#485C52]">
            Perubahan kebiasaan harian di rumah merupakan fondasi paling mudah diterapkan sebelum
            beralih ke perangkat efisiensi energi yang lebih lanjut.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visibleTips.map((tip, index) => (
            <article
              key={tip.id}
              className="group flex flex-col justify-between rounded-xl border border-[#14261E]/10 bg-white/95 p-6 shadow-[0_4px_18px_-10px_rgba(11,46,34,0.1)] transition-all duration-150 hover:border-emerald-700/35 hover:-translate-y-0.5"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#E9F3EE] transition-colors duration-150 group-hover:bg-emerald-100">
                    {renderTipIcon(tip.iconName)}
                  </div>
                  <span className="font-mono text-xs text-[#64786E] tabular-nums">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>

                <h3 className="mt-5 font-display text-lg font-bold leading-snug text-[#0B2E22]">
                  {tip.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-[#41544B]">
                  {tip.description}
                </p>
              </div>

              <p className="mt-4 pt-4 border-t border-[#14261E]/8 text-xs leading-relaxed text-[#5C7066]">
                {tip.detail}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-[#14261E]/10 pt-8">
          <button
            type="button"
            onClick={() => setShowMoreTips((prev) => !prev)}
            aria-expanded={showMoreTips}
            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg border border-[#0B2E22]/20 bg-white px-5 py-2.5 text-sm font-semibold text-[#0B2E22] hover:bg-[#EFECE4] transition-colors duration-150 whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
          >
            {showMoreTips ? (
              <>
                Tampilkan Lebih Sedikit
                <ChevronUp className="h-4 w-4" aria-hidden="true" />
              </>
            ) : (
              <>
                Pelajari Tips Lainnya
                <ChevronDown className="h-4 w-4" aria-hidden="true" />
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => onAskTips('Bagaimana cara menghemat listrik di rumah?')}
            className="inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-emerald-800 hover:text-emerald-950 transition-colors cursor-pointer whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700 rounded-md"
          >
            <MessageSquareText className="h-4 w-4" aria-hidden="true" />
            Diskusikan tips hemat listrik dengan AI Konsultan
          </button>
        </div>
      </div>
    </section>
  );
}
