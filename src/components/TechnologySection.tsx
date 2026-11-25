import { GREEN_TECHNOLOGIES } from '../data/campaignData';
import { SafeImage } from './SafeImage';

export function TechnologySection() {
  return (
    <section id="teknologi" className="bg-editorial-linen border-t border-[#14261E]/10 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-wider text-emerald-800">
            Green Technology
          </p>
          <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-[#0B2E22] sm:text-4xl [text-wrap:balance]">
            Inovasi Teknologi untuk Masa Depan
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[#41544B]">
            Mengenal lima pilar teknologi ramah lingkungan yang mendukung pemanfaatan energi lebih
            bersih, terukur, dan berkelanjutan.
          </p>
        </div>

        {/* Asymmetric Bento Grid */}
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-12">
          {GREEN_TECHNOLOGIES.map((tech, idx) => {
            // Layout rhythm: Row 1 -> Solar Panel (7 cols) + Smart Home (5 cols);
            // Row 2 -> Energy Storage (4 cols) + LED Technology (4 cols) + Renewable Energy (4 cols)
            const spanClass =
              idx === 0
                ? 'lg:col-span-7'
                : idx === 1
                  ? 'lg:col-span-5'
                  : 'lg:col-span-4';

            return (
              <article
                key={tech.id}
                className={`group flex flex-col overflow-hidden rounded-xl border border-[#14261E]/10 bg-[#FAF9F5] transition-colors duration-150 hover:border-emerald-700/35 ${spanClass}`}
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#E6EFEA]">
                  <SafeImage
                    src={tech.image}
                    alt={tech.imageAlt}
                    fallbackTitle={tech.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <p className="text-xs font-medium text-emerald-800">
                    {String(idx + 1).padStart(2, '0')} · {tech.category}
                  </p>
                  <h3 className="mt-2 font-display text-xl font-bold text-[#0B2E22]">
                    {tech.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-[#485C52]">
                    {tech.description}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
