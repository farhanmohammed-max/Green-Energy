import { Cpu, Eye, Leaf, MessageSquareQuote, Sun, ZapOff } from 'lucide-react';
import { BENEFITS_LIST, TESTIMONIALS, type BenefitItem } from '../data/campaignData';

function renderBenefitIcon(iconName: BenefitItem['iconName']) {
  const iconClass = 'h-5 w-5 text-emerald-800';
  switch (iconName) {
    case 'eye':
      return <Eye className={iconClass} aria-hidden="true" />;
    case 'zap-off':
      return <ZapOff className={iconClass} aria-hidden="true" />;
    case 'sun':
      return <Sun className={iconClass} aria-hidden="true" />;
    case 'cpu':
      return <Cpu className={iconClass} aria-hidden="true" />;
    case 'leaf':
      return <Leaf className={iconClass} aria-hidden="true" />;
  }
}

export function BenefitsAndTestimonials() {
  return (
    <>
      {/* Benefits Section */}
      <section id="manfaat" className="bg-editorial-linen border-t border-[#14261E]/10 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="text-xs font-semibold tracking-wider text-emerald-800">
                Manfaat Kampanye
              </p>
              <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-[#0B2E22] sm:text-4xl [text-wrap:balance]">
                Dampak Positif bagi Keseharian & Lingkungan
              </h2>
              <p className="mt-4 text-base leading-relaxed text-[#41544B]">
                Edukasi yang konsisten membantu setiap individu mengambil keputusan penggunaan
                energi yang lebih bijak tanpa harus menunggu perubahan besar.
              </p>
            </div>

            <div className="lg:col-span-8">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {BENEFITS_LIST.map((benefit, index) => (
                  <div
                    key={benefit.id}
                    className={`rounded-xl border border-[#14261E]/10 bg-[#FAF9F5] p-6 ${
                      index === BENEFITS_LIST.length - 1 ? 'sm:col-span-2' : ''
                    }`}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white border border-[#14261E]/10">
                      {renderBenefitIcon(benefit.iconName)}
                    </div>
                    <h3 className="mt-4 font-display text-lg font-bold text-[#0B2E22]">
                      {benefit.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#485C52]">
                      {benefit.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section (Honest Empty-State Structure Ready for Verified Stories) */}
      <section id="testimoni" className="bg-sage-wash border-t border-[#14261E]/10 py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-wider text-emerald-800">
              Testimoni Peserta
            </p>
            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-[#0B2E22] sm:text-4xl [text-wrap:balance]">
              Cerita Nyata dari Peserta Kampanye
            </h2>
          </div>

          {TESTIMONIALS.length > 0 ? (
            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
              {TESTIMONIALS.map((item) => (
                <figure
                  key={item.id}
                  className="flex flex-col justify-between rounded-xl border border-[#14261E]/10 bg-white p-6"
                >
                  <blockquote className="text-sm leading-relaxed text-[#33463D]">
                    &ldquo;{item.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-6 border-t border-[#14261E]/8 pt-4">
                    <div className="font-display text-sm font-bold text-[#0B2E22]">{item.name}</div>
                    <div className="text-xs text-[#5A6E64]">{item.role}</div>
                  </figcaption>
                </figure>
              ))}
            </div>
          ) : (
            <div className="mt-10 rounded-xl border border-dashed border-[#0B2E22]/25 bg-white p-8 sm:p-12">
              <div className="mx-auto flex max-w-xl flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E9F3EE] text-emerald-800">
                  <MessageSquareQuote className="h-6 w-6" aria-hidden="true" />
                </div>
                <p className="mt-4 font-display text-lg font-bold text-[#0B2E22]">
                  Testimoni peserta kampanye akan ditampilkan di sini.
                </p>
                <p className="mt-2 text-sm leading-relaxed text-[#485C52]">
                  Kami hanya menampilkan pengalaman dan umpan balik terverifikasi dari peserta asli
                  kampanye Green Energy. Bagian ini telah disiapkan agar testimoni nyata dapat
                  ditambahkan segera setelah terkumpul.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
