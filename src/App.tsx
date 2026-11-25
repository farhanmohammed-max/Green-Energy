import { useEffect, useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { EducationSection } from './components/EducationSection';
import { TechnologySection } from './components/TechnologySection';
import { ProductsSection } from './components/ProductsSection';
import { RoadmapSection } from './components/RoadmapSection';
import { BenefitsAndTestimonials } from './components/BenefitsAndTestimonials';
import { ConsultantSection } from './components/ConsultantSection';
import { Footer } from './components/Footer';
import { AIConsultantWidget } from './components/AIConsultantWidget';
import { RevealOnScroll } from './components/RevealOnScroll';

export default function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [queuedPrompt, setQueuedPrompt] = useState<string | null>(null);
  const [consultationConfigured, setConsultationConfigured] = useState<boolean | null>(null);

  useEffect(() => {
    let active = true;
    fetch('/api/health')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (active && data && typeof data.consultationConfigured === 'boolean') {
          setConsultationConfigured(data.consultationConfigured);
        }
      })
      .catch(() => {
        // Ignore transient health check error
      });

    return () => {
      active = false;
    };
  }, []);

  const openConsultant = () => {
    setIsChatOpen(true);
  };

  const askConsultantWithPrompt = (prompt: string) => {
    setQueuedPrompt(prompt);
    setIsChatOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F8F6F1] text-[#14261E]">
      <a
        href="#konten-utama"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-lg focus:bg-[#0B2E22] focus:px-4 focus:py-2 text-sm font-semibold text-white"
      >
        Langsung ke konten utama
      </a>

      <Navbar onStartConsultation={openConsultant} />

      <main id="konten-utama">
        <HeroSection onOpenConsultant={openConsultant} />
        <RevealOnScroll>
          <AboutSection />
        </RevealOnScroll>
        <RevealOnScroll>
          <EducationSection onAskTips={askConsultantWithPrompt} />
        </RevealOnScroll>
        <RevealOnScroll>
          <TechnologySection />
        </RevealOnScroll>
        <RevealOnScroll>
          <ProductsSection onAskAboutCategory={askConsultantWithPrompt} />
        </RevealOnScroll>
        <RevealOnScroll>
          <RoadmapSection />
        </RevealOnScroll>
        <RevealOnScroll>
          <BenefitsAndTestimonials />
        </RevealOnScroll>
        <RevealOnScroll>
          <ConsultantSection
            onOpenConsultant={openConsultant}
            onSelectQuickQuestion={askConsultantWithPrompt}
            consultationConfigured={consultationConfigured}
          />
        </RevealOnScroll>
      </main>

      <Footer onOpenConsultant={openConsultant} />

      <AIConsultantWidget
        isOpen={isChatOpen}
        onOpenChange={setIsChatOpen}
        queuedPrompt={queuedPrompt}
        onConsumeQueuedPrompt={() => setQueuedPrompt(null)}
      />
    </div>
  );
}
