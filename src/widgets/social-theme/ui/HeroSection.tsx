"use client";

import { motion } from "motion/react";
import { useLanguage } from "@/shared/lib/i18n/LanguageContext";
import { AmbientVideo } from "@/shared/ui/video";

interface HeroSectionProps {
  isRevealed?: boolean;
  onOpenBooking?: (carModel?: string) => void;
  onOpenCertificate?: () => void;
  onOpenClub?: () => void;
  onFirstClipNearEnd?: () => void;
}

const HERO_VIDEOS = [
  { webm: "/videos/hero-0.webm", mp4: "/videos/hero-0.mp4" },
  { webm: "/videos/hero-2.webm", mp4: "/videos/hero-2.mp4" },
  { webm: "/videos/hero-3.webm", mp4: "/videos/hero-3.mp4" },
  { webm: "/videos/hero-4.webm", mp4: "/videos/hero-4.mp4" },
  { webm: "/videos/hero-5.webm", mp4: "/videos/hero-5.mp4" },
] as const;

export function HeroSection({
  isRevealed = true,
  onOpenBooking,
  onOpenCertificate,
  onOpenClub,
  onFirstClipNearEnd,
}: HeroSectionProps) {
  const { t, lang } = useLanguage();
  const isRu = lang === "ru";

  return (
    <section
      id="hero"
      className={`relative min-h-[100svh] md:min-h-[100dvh] w-full bg-black text-white overflow-hidden flex flex-col justify-center items-center border-b ${
        isRevealed ? "border-white/10" : "border-transparent"
      } transition-colors duration-1000 font-sans`}
    >
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden bg-black pointer-events-none">
        <AmbientVideo
          clips={HERO_VIDEOS}
          poster="/images/hero-cars.webp"
          posterPreload
          posterClassName="object-cover object-[56%_center] sm:object-center"
          isEnabled={true}
          loop={true}
          className="absolute inset-0 w-full h-full object-cover"
          activeClassName="opacity-100 z-1"
          inactiveClassName="opacity-0 z-0 pointer-events-none"
          onFirstClipNearEnd={onFirstClipNearEnd}
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/70 z-2" />
        <div className="absolute inset-0 bg-radial-vignette opacity-30 z-2" />
      </div>

      {/* Centered Hero Content */}
      <div
        className={`relative z-10 max-w-[1820px] w-full mx-auto border-l border-r ${
          isRevealed ? "border-white/10" : "border-transparent"
        } flex flex-col justify-center items-center flex-1 py-20 sm:py-24 md:py-28 px-5 sm:px-12 pointer-events-auto transition-colors duration-1000`}
      >
        <div className="max-w-[1400px] w-full mx-auto flex flex-col items-center justify-center text-center space-y-5 sm:space-y-6">
          <div className="flex flex-col items-center justify-center text-center space-y-4 sm:space-y-5">
            {/* Headline with cinematic reveal */}
            <motion.h1
              initial={{ opacity: 0, y: 35, filter: "blur(14px)" }}
              animate={
                isRevealed
                  ? { opacity: 1, y: 0, filter: "blur(0px)" }
                  : { opacity: 0, y: 35, filter: "blur(14px)" }
              }
              transition={{
                duration: 0.9,
                delay: 0.35,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="text-[clamp(2.75rem,14vw,4.5rem)] sm:text-7xl md:text-8xl lg:text-[7rem] font-bold tracking-tighter uppercase leading-[0.92] select-none text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)]"
            >
              {t.hero.headline}
              <span className="text-gradient-red">.</span>
            </motion.h1>

            {/* Subtitle with cinematic reveal */}
            <motion.p
              initial={{ opacity: 0, y: 25, filter: "blur(10px)" }}
              animate={
                isRevealed
                  ? { opacity: 1, y: 0, filter: "blur(0px)" }
                  : { opacity: 0, y: 25, filter: "blur(10px)" }
              }
              transition={{
                duration: 0.85,
                delay: 0.55,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="text-base sm:text-lg lg:text-xl text-[#c8c8cf] max-w-2xl leading-relaxed font-light drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]"
            >
              {t.hero.subtitle}
            </motion.p>

            {/* Action buttons with staggered reveal */}
            <motion.div
              initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
              animate={
                isRevealed
                  ? { opacity: 1, y: 0, filter: "blur(0px)" }
                  : { opacity: 0, y: 20, filter: "blur(8px)" }
              }
              transition={{
                duration: 0.8,
                delay: 0.75,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="grid w-full max-w-sm grid-cols-1 items-center justify-center gap-3 pt-4 sm:flex sm:max-w-none sm:flex-wrap sm:gap-4 sm:pt-5 z-20"
            >
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
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
