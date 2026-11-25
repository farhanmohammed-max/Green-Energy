import { ArrowDownRight, MessageSquareText } from 'lucide-react';
import { HERO_IMAGE, HERO_PILLARS } from '../data/campaignData';
import { SafeImage } from './SafeImage';

interface HeroSectionProps {
  onOpenConsultant: () => void;
}

export function HeroSection({ onOpenConsultant }: HeroSectionProps) {
  return (
    <section
      id="beranda"
      className="bg-hero-atmosphere relative overflow-hidden pt-8 pb-16 sm:pt-12 lg:pt-16 lg:pb-24"
    >
      {/* Subtle architectural solar grid fading softly at the edges */}
      <div
        aria-hidden="true"
        className="bg-solar-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_75%_65%_at_50%_35%,black_25%,transparent_100%)]"
      />

      {/* Organic energy contour wave decoration */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1440 420"
        fill="none"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-56 w-full opacity-45"
      >
        <path
          d="M0 290C240 210 470 360 760 280C1020 208 1220 130 1440 190V420H0V290Z"
          fill="url(#heroContourFill)"
        />
        <path
          d="M0 265C260 185 495 335 780 250C1040 172 1230 105 1440 162"
          stroke="#059669"
          strokeOpacity="0.16"
          strokeWidth="1.5"
        />
        <path
          d="M0 325C290 255 540 375 840 300C1085 238 1265 182 1440 228"
          stroke="#0B2E22"
          strokeOpacity="0.09"
          strokeWidth="1.25"
        />
        <defs>
          <linearGradient id="heroContourFill" x1="720" y1="140" x2="720" y2="420" gradientUnits="userSpaceOnUse">
            <stop stopColor="#059669" stopOpacity="0.08" />
            <stop offset="1" stopColor="#059669" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-stretch gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Editorial Copy Column */}
          <div className="flex flex-col justify-center lg:col-span-6">
            <p className="text-xs font-semibold tracking-wider text-emerald-800">
              Kampanye Hemat Energi · Teknologi Ramah Lingkungan
            </p>

            <h1 className="mt-4 font-display text-[clamp(2.25rem,4vw,3.65rem)] font-extrabold leading-[1.08] tracking-tight text-[#0B2E22] [text-wrap:balance]">
              Mulai Hemat Energi, Bangun Masa Depan Lebih Hijau.
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-[#384D43] sm:text-lg">
              Kenali cara menghemat energi, temukan solusi teknologi ramah lingkungan, dan mulai
              perubahan kecil untuk masa depan yang lebih berkelanjutan.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <button
                type="button"
                onClick={onOpenConsultant}
                className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-lg bg-emerald-700 px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_-8px_rgba(4,120,87,0.55)] hover:bg-emerald-800 active:scale-[0.99] transition-all duration-150 whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
              >
                <MessageSquareText className="h-4 w-4" aria-hidden="true" />
                Tanya AI Konsultan
              </button>

              <a
                href="#tentang"
                className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-lg border border-[#0B2E22]/20 bg-white/90 px-6 py-3 text-sm font-semibold text-[#0B2E22] hover:bg-white transition-colors duration-150 whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
              >
                Pelajari Sekarang
                <ArrowDownRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Dominant Visual Anchor (16:9 Architectural Solar Residence) */}
          <div className="lg:col-span-6">
            <div className="relative h-full min-h-[280px] overflow-hidden rounded-2xl border border-[#14261E]/12 bg-[#E6EFEA] shadow-[0_20px_48px_-24px_rgba(8,39,29,0.28)]">
              <SafeImage
                src={HERO_IMAGE.src}
                alt={HERO_IMAGE.alt}
                fallbackTitle="GREEN ENERGY — Energi Bersih & Hunian Berkelanjutan"
                loading="eager"
                className="aspect-[16/10] h-full w-full object-cover lg:aspect-auto"
              />
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#061812]/92 via-[#061812]/55 to-transparent p-5 sm:p-6"
              >
                <p className="text-xs font-medium text-emerald-200 tracking-[0.01em]">
                  Energi Surya · Efisiensi Hunian · Keberlanjutan
                </p>
                <p className="mt-1 text-sm font-medium text-white/95 max-w-[215px] sm:max-w-md leading-snug">
                  Langkah kecil dari rumah mendukung transisi menuju pemanfaatan energi yang lebih bersih.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Full-Width Sustainability Strip (Qualitative Pillars — No Fabricated Stats) */}
        <div className="mt-12 grid grid-cols-1 divide-y divide-[#14261E]/10 rounded-xl border border-[#14261E]/12 bg-white/88 backdrop-blur-sm shadow-[0_8px_28px_-14px_rgba(11,46,34,0.12)] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {HERO_PILLARS.map((pillar) => (
            <div key={pillar.title} className="p-5 sm:p-6">
              <p className="text-xs font-medium text-emerald-800">{pillar.label}</p>
              <h2 className="mt-1.5 font-display text-base font-bold text-[#0B2E22]">
                {pillar.title}
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-[#485C52]">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
