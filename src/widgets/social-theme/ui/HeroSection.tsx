"use client";

import { useLanguage } from "@/shared/lib/i18n/LanguageContext";
import { AmbientVideo } from "@/shared/ui/video";

interface HeroSectionProps {
  isLoaded?: boolean;
  onOpenBooking?: (carModel?: string) => void;
  onOpenCertificate?: () => void;
  onOpenClub?: () => void;
}

const HERO_VIDEOS = [{ webm: "/videos/for1block.webm" }] as const;

export function HeroSection({
  isLoaded = true,
  onOpenBooking,
  onOpenCertificate,
  onOpenClub,
}: HeroSectionProps) {
  const { t, lang } = useLanguage();
  const isRu = lang === "ru";

  return (
    <section id="hero" className="relative min-h-[100svh] md:min-h-[100dvh] w-full bg-black text-white overflow-hidden flex flex-col justify-start items-center border-b border-white/10 font-sans">
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden bg-black pointer-events-none">
        <AmbientVideo
          clips={HERO_VIDEOS}
          poster="/images/hero-cars.webp"
          posterPreload
          posterClassName="object-cover object-[56%_center] sm:object-center"
          isEnabled={isLoaded}
          loop={false}
          className="absolute inset-0 w-full h-full object-cover"
          activeClassName="opacity-100 z-1"
          inactiveClassName="opacity-0 z-0 pointer-events-none"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/15 to-black/60 z-2" />
        <div className="absolute inset-0 bg-radial-vignette opacity-30 z-2" />
      </div>

      <div className="relative z-10 max-w-[1820px] w-full mx-auto border-l border-r border-white/10 flex flex-col justify-start items-center flex-1 pt-24 sm:pt-36 md:pt-40 lg:pt-44 pb-10 sm:pb-16 px-5 sm:px-12 pointer-events-auto">
        <div className="max-w-[1400px] w-full mx-auto flex flex-col items-center text-center space-y-5 sm:space-y-6">
          <div className="flex flex-col items-center text-center space-y-4 sm:space-y-5">
            <h1 className="text-[clamp(2.75rem,14vw,4.5rem)] sm:text-7xl md:text-8xl lg:text-[7rem] font-bold tracking-tighter uppercase leading-[0.92] select-none text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)]">
              {t.hero.headline}<span className="text-gradient-red">.</span>
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-[#c8c8cf] max-w-2xl leading-relaxed font-light drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
              {t.hero.subtitle}
            </p>

            <div className="grid w-full max-w-sm grid-cols-1 items-center justify-center gap-3 pt-4 sm:flex sm:max-w-none sm:flex-wrap sm:gap-4 sm:pt-5 z-20">
              <button
                onClick={onOpenClub}
                className="w-full sm:w-auto px-5 sm:px-7 py-3.5 sm:py-4 bg-black/60 hover:bg-white text-white hover:text-black font-bold uppercase tracking-[0.12em] sm:tracking-[0.14em] text-xs sm:text-[13px] border border-white/25 hover:border-white rounded transition-all duration-300 backdrop-blur-md cursor-pointer select-none shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
              >
                {isRu ? "М-Комьюнити" : "M-Community"}
              </button>

              <button
                onClick={onOpenCertificate}
                className="w-full sm:w-auto px-5 sm:px-7 py-3.5 sm:py-4 bg-black/60 hover:bg-white text-white hover:text-black font-bold uppercase tracking-[0.12em] sm:tracking-[0.14em] text-xs sm:text-[13px] border border-white/25 hover:border-white rounded transition-all duration-300 backdrop-blur-md cursor-pointer select-none shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
              >
                {isRu ? "Купить сертификат" : "Gift Certificate"}
              </button>

              <button
                onClick={() => onOpenBooking && onOpenBooking()}
                className="w-full sm:w-auto px-5 sm:px-8 py-3.5 sm:py-4 bg-[#ea4043] hover:bg-[#ff2a55] text-white font-bold uppercase tracking-[0.12em] sm:tracking-[0.14em] text-xs sm:text-[13px] border border-[#ea4043] hover:border-[#ff2a55] rounded transition-all duration-300 shadow-[0_0_30px_rgba(234,64,67,0.4)] hover:shadow-[0_0_45px_rgba(234,64,67,0.65)] cursor-pointer select-none"
              >
                {isRu ? "Записаться на тренировку" : "Book Training"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

