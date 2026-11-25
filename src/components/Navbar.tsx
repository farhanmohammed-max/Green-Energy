import { useEffect, useState } from 'react';
import { Leaf, Menu, X } from 'lucide-react';
import { NAV_ITEMS } from '../data/campaignData';

interface NavbarProps {
  onStartConsultation: () => void;
}

export function Navbar({ onStartConsultation }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 12);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-colors duration-200 ${
        isScrolled
          ? 'bg-[#FAF8F2]/92 backdrop-blur-md border-b border-[#14261E]/10'
          : 'bg-[#FAF8F2]/70 backdrop-blur-sm border-b border-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-3.5 sm:px-6 lg:px-8">
        {/* Zone 1: Clean single-line brand wordmark */}
        <a
          href="#beranda"
          className="flex items-center gap-2.5 text-[#0B2E22] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700 rounded-md"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0B2E22] text-emerald-300">
            <Leaf className="h-4 w-4" aria-hidden="true" />
          </span>
          <span className="font-display text-base font-extrabold tracking-tight">
            GREEN ENERGY
          </span>
        </a>

        {/* Zone 2: Clean single-line text navigation links */}
        <nav aria-label="Navigasi utama" className="hidden lg:flex items-center gap-5 xl:gap-6">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-[#374B42] hover:text-[#0B2E22] transition-colors duration-150 whitespace-nowrap shrink-0 py-1 border-b-2 border-transparent hover:border-emerald-700/40 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Single primary action + mobile hamburger */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onStartConsultation();
            }}
            className="hidden sm:inline-flex items-center justify-center rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800 active:scale-[0.99] transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
          >
            Mulai Konsultasi
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation-drawer"
            aria-label={mobileMenuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
            className="inline-flex lg:hidden h-10 w-10 items-center justify-center rounded-lg border border-[#14261E]/15 bg-white text-[#0B2E22] hover:bg-[#EFECE4] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation-drawer"
          className="lg:hidden border-t border-[#14261E]/10 bg-[#F8F6F1] px-5 pb-5 pt-3 shadow-sm"
        >
          <nav aria-label="Navigasi mobile" className="flex flex-col space-y-1">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={handleNavClick}
                className="flex min-h-[44px] items-center rounded-lg px-3 py-2 text-sm font-medium text-[#1F352C] hover:bg-[#ECE8DE] hover:text-[#0B2E22] transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="mt-3 pt-3 border-t border-[#14261E]/10">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onStartConsultation();
              }}
              className="flex min-h-[44px] w-full items-center justify-center rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 transition-colors cursor-pointer"
            >
              Mulai Konsultasi
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
