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
      className={`relative min-h-[540px] h-[82svh] max-h-[720px] md:h-auto md:min-h-[100dvh] md:max-h-none w-full bg-black text-white overflow-hidden flex flex-col justify-center items-center border-b ${
        isRevealed ? "border-white/10" : "border-transparent"
      } transition-colors duration-1000 font-sans`}
    >
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden bg-black pointer-events-none">
        <AmbientVideo
          clips={HERO_VIDEOS}
          isEnabled={true}
          loop={true}
          className="absolute inset-0 w-full h-full object-cover object-[50%_45%] sm:object-center"
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
        } flex flex-col justify-center items-center flex-1 pt-16 pb-12 sm:pt-24 sm:pb-20 md:py-28 px-4 sm:px-12 pointer-events-auto transition-colors duration-1000`}
      >
        <div className="max-w-[1400px] w-full mx-auto flex flex-col items-center justify-center text-center space-y-4 sm:space-y-6">
          <div className="flex flex-col items-center justify-center text-center space-y-3 sm:space-y-5">
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
              className="text-[clamp(2.35rem,10.5vw,3.75rem)] sm:text-7xl md:text-8xl lg:text-[7rem] font-bold tracking-tighter uppercase leading-[0.94] select-none text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]"
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
              className="text-xs sm:text-lg lg:text-xl text-[#d4d4dc] max-w-2xl px-2 sm:px-0 leading-relaxed font-light drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]"
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
              className="w-full max-w-sm md:max-w-none pt-3 sm:pt-5 z-20 flex flex-col md:flex-row items-center justify-center gap-2.5 sm:gap-4"
            >
              {/* Primary Action Button */}
              <button
                onClick={() => onOpenBooking && onOpenBooking()}
                className="w-full md:w-auto px-6 md:px-8 py-4 bg-[#ea4043] hover:bg-[#ff2a55] active:scale-[0.98] text-white font-bold uppercase tracking-[0.12em] md:tracking-[0.14em] text-xs md:text-[13px] border border-[#ea4043] hover:border-[#ff2a55] rounded-xl md:rounded transition-all duration-200 shadow-[0_0_30px_rgba(234,64,67,0.45)] hover:shadow-[0_0_45px_rgba(234,64,67,0.7)] cursor-pointer select-none whitespace-nowrap"
              >
                {isRu ? "Записаться на тренировку" : "Book Training"}
              </button>

              {/* Secondary Buttons: 2 columns on mobile, inline on desktop */}
              <div className="grid grid-cols-2 gap-2.5 w-full md:w-auto md:flex md:gap-4">
                <button
                  onClick={onOpenCertificate}
                  className="w-full md:w-auto px-3 md:px-7 py-3 md:py-4 bg-black/70 hover:bg-white active:scale-[0.97] text-white hover:text-black font-bold uppercase tracking-[0.1em] md:tracking-[0.14em] text-[11px] md:text-[13px] border border-white/25 hover:border-white rounded-xl md:rounded transition-all duration-200 backdrop-blur-xl cursor-pointer select-none shadow-[0_4px_20px_rgba(0,0,0,0.5)] whitespace-nowrap"
                >
                  {isRu ? "Сертификат" : "Certificate"}
                </button>

                <button
                  onClick={onOpenClub}
                  className="w-full md:w-auto px-3 md:px-7 py-3 md:py-4 bg-black/70 hover:bg-white active:scale-[0.97] text-white hover:text-black font-bold uppercase tracking-[0.1em] md:tracking-[0.14em] text-[11px] md:text-[13px] border border-white/25 hover:border-white rounded-xl md:rounded transition-all duration-200 backdrop-blur-xl cursor-pointer select-none shadow-[0_4px_20px_rgba(0,0,0,0.5)] whitespace-nowrap"
                >
                  {isRu ? "М-Комьюнити" : "M-Community"}
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
