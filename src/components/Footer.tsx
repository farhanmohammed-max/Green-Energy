import { Leaf } from 'lucide-react';
import { NAV_ITEMS } from '../data/campaignData';

interface FooterProps {
  onOpenConsultant: () => void;
}

export function Footer({ onOpenConsultant }: FooterProps) {
  return (
    <footer className="bg-forest-aurora border-t border-white/10 text-emerald-100/80">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12">
          {/* Brand & Description */}
          <div className="lg:col-span-4">
            <a
              href="#beranda"
              className="inline-flex items-center gap-2.5 text-white whitespace-nowrap"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-800 text-emerald-200">
                <Leaf className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="font-display text-base font-extrabold tracking-tight">
                GREEN ENERGY
              </span>
            </a>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-emerald-100/75">
              Kampanye edukasi Hemat Energi dan Green Technology Focus yang mengajak masyarakat
              menerapkan penggunaan listrik secara bijak serta mengenal teknologi ramah lingkungan.
            </p>
            <button
              type="button"
              onClick={onOpenConsultant}
              className="mt-5 inline-flex min-h-[40px] items-center justify-center rounded-lg border border-emerald-400/30 bg-white/[0.06] px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-800 transition-colors cursor-pointer"
            >
              Buka AI Konsultan Green Tech
            </button>
          </div>

          {/* Website Navigation */}
          <div className="lg:col-span-3">
            <h2 className="font-display text-sm font-bold text-white">Navigasi Website</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-emerald-100/75 hover:text-white transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info Placeholders (No Fabricated Data) */}
          <div className="lg:col-span-3">
            <h2 className="font-display text-sm font-bold text-white">Informasi Kontak</h2>
            <ul className="mt-4 space-y-2.5 text-sm text-emerald-100/70">
              <li>Email: [Alamat email resmi belum tersedia]</li>
              <li>Telepon: [Nomor kontak resmi belum tersedia]</li>
              <li>Sekretariat: [Alamat kampanye belum tersedia]</li>
            </ul>
          </div>

          {/* Social Media Placeholders (No Fabricated Accounts or Dead Links) */}
          <div className="lg:col-span-2">
            <h2 className="font-display text-sm font-bold text-white">Media Sosial</h2>
            <ul className="mt-4 space-y-2.5 text-sm text-emerald-100/70">
              <li>Instagram — Segera hadir</li>
              <li>LinkedIn — Segera hadir</li>
              <li>YouTube — Segera hadir</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-emerald-100/65 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} GREEN ENERGY. Seluruh hak cipta dilindungi.</p>
          <p className="font-medium text-emerald-200/90">Hemat Energi untuk Masa Depan.</p>
        </div>
      </div>
    </footer>
  );
}
