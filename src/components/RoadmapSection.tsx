import { ROADMAP_STAGES } from '../data/campaignData';

export function RoadmapSection() {
  return (
    <section
      id="roadmap"
      className="bg-forest-aurora relative overflow-hidden border-t border-[#14261E]/10 py-20 text-white lg:py-28"
    >
      {/* Subtle architectural grid overlay */}
      <div
        aria-hidden="true"
        className="bg-forest-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_80%_75%_at_50%_40%,black_30%,transparent_100%)]"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-wider text-emerald-300">
            Roadmap Kampanye
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-[0.005em] text-white sm:text-4xl [text-wrap:balance]">
            Tiga Tahapan Perjalanan Menuju Kebiasaan Hemat Energi
          </h2>
          <p className="mt-4 text-base leading-relaxed text-emerald-100/80">
            Pendekatan bertahap agar edukasi hemat energi tidak berhenti pada wacana, melainkan
            tumbuh menjadi praktik nyata yang terus dievaluasi.
          </p>
        </div>

        {/* Desktop Horizontal Timeline & Mobile Vertical Timeline */}
        <div className="relative mt-14">
          {/* Horizontal connecting line on desktop */}
          <div
            aria-hidden="true"
            className="hidden lg:block absolute top-5 left-0 right-0 h-px bg-emerald-400/25"
          />

          <ol className="relative grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-8">
            {ROADMAP_STAGES.map((item, idx) => (
              <li key={item.stage} className="relative pl-10 lg:pl-0">
                {/* Mobile vertical connecting line */}
                {idx < ROADMAP_STAGES.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="lg:hidden absolute left-[15px] top-9 bottom-[-2.5rem] w-px bg-emerald-400/25"
                  />
                )}

                {/* Stage node marker */}
                <div className="absolute left-0 top-0.5 lg:static lg:mb-6 flex h-8 w-8 lg:h-10 lg:w-10 items-center justify-center rounded-full border border-emerald-400/45 bg-[#103D2D] font-mono text-xs font-semibold text-emerald-200 tabular-nums shadow-[0_0_24px_rgba(52,211,153,0.18)]">
                  {String(idx + 1).padStart(2, '0')}
                </div>

                <div className="rounded-xl border border-white/14 bg-white/[0.06] backdrop-blur-xs p-6 h-full">
                  <p className="font-mono text-xs font-medium tracking-wide text-emerald-300">
                    {item.stage}
                  </p>
                  <h3 className="mt-2 font-display text-xl font-bold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-emerald-50/90">
                    {item.description}
                  </p>

                  <ul className="mt-5 space-y-2 border-t border-white/10 pt-4 text-sm text-emerald-100/75">
                    {item.focusPoints.map((point) => (
                      <li key={point} className="flex items-start gap-2.5">
                        <span
                          aria-hidden="true"
                          className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400"
                        />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
