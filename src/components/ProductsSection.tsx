import { useEffect, useState } from 'react';
import { ArrowUpRight, Info } from 'lucide-react';
import {
  CATALOG_FILTERS,
  SOLUTION_CATEGORIES,
  type CatalogFilterKey,
  type SolutionCategoryItem,
} from '../data/campaignData';
import { SafeImage } from './SafeImage';

interface ProductsSectionProps {
  onAskAboutCategory: (prompt: string) => void;
}

export function ProductsSection({ onAskAboutCategory }: ProductsSectionProps) {
  const [activeFilter, setActiveFilter] = useState<CatalogFilterKey>('semua');
  const [categories, setCategories] = useState<SolutionCategoryItem[]>(SOLUTION_CATEGORIES);
  const [isLoading, setIsLoading] = useState(false);

  // Architecture ready to hydrate directly from /api/catalog (which can later proxy an n8n Google Sheets API)
  useEffect(() => {
    let active = true;
    setIsLoading(true);
    fetch('/api/catalog')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (active && data && Array.isArray(data.items) && data.items.length > 0) {
          setCategories(data.items as SolutionCategoryItem[]);
        }
      })
      .catch(() => {
        // Keep bundled example categories if endpoint is unreachable
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const filteredItems =
    activeFilter === 'semua'
      ? categories
      : categories.filter((item) => item.filterKey === activeFilter);

  return (
    <section id="produk" className="bg-sage-wash border-t border-[#14261E]/10 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-wider text-emerald-800">
              Produk & Solusi Hemat Energi · Contoh Kategori
            </p>
            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-[#0B2E22] sm:text-4xl [text-wrap:balance]">
              Kategori Solusi untuk Mendukung Efisiensi Energi
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[#41544B]">
              Jelajahi contoh kategori perangkat hemat energi sebagai referensi awal. Klik tombol
              konsultasi pada setiap kategori untuk menanyakan rekomendasi yang sesuai kebutuhanmu.
            </p>
          </div>

          {/* Interactive Category Filter Controls */}
          <div
            role="group"
            aria-label="Filter kategori solusi"
            className="flex flex-wrap items-center gap-1.5 rounded-lg border border-[#14261E]/10 bg-white/95 p-1"
          >
            {CATALOG_FILTERS.map((tab) => {
              const isSelected = activeFilter === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveFilter(tab.key)}
                  aria-pressed={isSelected}
                  className={`min-h-[38px] rounded-md px-3 py-1.5 text-xs font-semibold transition-colors duration-150 whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 ${
                    isSelected
                      ? 'bg-[#0B2E22] text-white'
                      : 'text-[#41544B] hover:bg-[#F3F0E8] hover:text-[#0B2E22]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Transparent Example Disclaimer Banner (No border-l-4 cliché, subtle hairline enclosure) */}
        <div className="mt-8 flex items-start gap-3 rounded-xl border border-emerald-900/15 bg-white/90 px-5 py-4 backdrop-blur-xs">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-emerald-800" aria-hidden="true" />
          <p className="text-sm leading-relaxed text-[#3E5248]">
            <strong className="font-semibold text-[#0B2E22]">Informasi Katalog:</strong> Daftar di
            bawah ini merupakan <span className="font-medium text-[#0B2E22]">contoh kategori solusi</span>{' '}
            untuk tujuan edukasi, bukan penawaran produk aktual, harga, maupun stok. Katalog produk
            aktual dapat diakses melalui AI Konsultan Green Tech yang terhubung ke Google Sheets
            (<span className="font-mono text-xs">Katalog_Produk</span>) pada workflow n8n.
          </p>
        </div>

        {/* Loading state if refreshing */}
        {isLoading && categories.length === 0 ? (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((skeleton) => (
              <div
                key={skeleton}
                className="h-96 animate-pulse rounded-xl border border-[#14261E]/10 bg-white/70"
              />
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="mt-10 rounded-xl border border-[#14261E]/10 bg-white p-10 text-center">
            <p className="text-sm text-[#485C52]">
              Belum ada contoh kategori untuk filter yang dipilih.
            </p>
            <button
              type="button"
              onClick={() => setActiveFilter('semua')}
              className="mt-4 inline-flex items-center justify-center rounded-lg bg-[#0B2E22] px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-900 transition-colors cursor-pointer"
            >
              Tampilkan Semua Kategori
            </button>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item) => (
              <article
                key={item.id}
                className="group flex flex-col overflow-hidden rounded-xl border border-[#14261E]/10 bg-white/95 shadow-[0_6px_22px_-12px_rgba(11,46,34,0.12)] transition-all duration-150 hover:border-emerald-700/35 hover:-translate-y-0.5"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#E6EFEA]">
                  <SafeImage
                    src={item.image}
                    alt={item.imageAlt}
                    fallbackTitle={item.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                </div>

                <div className="flex flex-1 flex-col justify-between p-6">
                  <div>
                    <p className="text-xs font-medium text-[#5A6E64]">{item.categoryLabel}</p>
                    <h3 className="mt-2 font-display text-lg font-bold text-[#0B2E22]">
                      {item.name}
                    </h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-[#41544B]">
                      {item.description}
                    </p>
                    <p className="mt-3 text-xs text-[#64786E]">{item.exampleNote}</p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#14261E]/8">
                    <button
                      type="button"
                      onClick={() => onAskAboutCategory(item.aiPrompt)}
                      aria-label={`Tanyakan kepada AI tentang ${item.name}`}
                      className="inline-flex min-h-[42px] w-full items-center justify-center gap-2 rounded-lg bg-[#0B2E22] px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 transition-colors duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
                    >
                      Tanyakan kepada AI
                      <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
