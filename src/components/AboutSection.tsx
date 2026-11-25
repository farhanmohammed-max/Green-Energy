import { CORE_VALUES } from '../data/campaignData';

export function AboutSection() {
  return (
    <section id="tentang" className="bg-editorial-linen border-t border-[#14261E]/10 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left Narrative Column */}
          <div className="lg:col-span-5">
            <p className="text-xs font-semibold tracking-wider text-emerald-800">
              Tentang Kampanye
            </p>
            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-[#0B2E22] sm:text-4xl [text-wrap:balance]">
              Mengenal Kampanye Green Energy
            </h2>
            <p className="mt-5 text-base leading-relaxed text-[#41544B]">
              Green Energy merupakan kampanye edukasi yang mengajak masyarakat untuk memahami
              pentingnya penggunaan energi secara bijak, mengurangi pemborosan listrik, serta
              mengenal perkembangan teknologi ramah lingkungan.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-[#556960]">
              Melalui informasi praktis dan layanan AI Konsultan Green Tech, pengunjung dapat
              mempelajari kebiasaan hemat daya sekaligus memahami pilihan teknologi efisiensi
              energi secara objektif.
            </p>
          </div>

          {/* Right Editorial Numbered Values */}
          <div className="lg:col-span-7">
            <div className="divide-y divide-[#14261E]/10 border-t border-b border-[#14261E]/10">
              {CORE_VALUES.map((item) => (
                <div
                  key={item.number}
                  className="grid grid-cols-1 gap-3 py-7 sm:grid-cols-12 sm:items-start sm:gap-6"
                >
                  <div className="sm:col-span-2">
                    <span className="font-mono text-sm font-medium text-emerald-800 tabular-nums">
                      {item.number}.
                    </span>
                  </div>
                  <div className="sm:col-span-10">
                    <h3 className="font-display text-xl font-bold text-[#0B2E22]">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#485C52] sm:text-base">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
