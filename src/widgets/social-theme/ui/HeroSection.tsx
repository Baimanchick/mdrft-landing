"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useLanguage } from "@/shared/lib/i18n/LanguageContext";
import { AmbientVideo } from "@/shared/ui/video";

interface HeroSectionProps {
  isLoaded?: boolean;
  onOpenBooking?: (carModel?: string) => void;
  onOpenCertificate?: () => void;
  onOpenClub?: () => void;
}

const HERO_VIDEOS = [
  "/videos/hero-1.webm",
  "/videos/hero-2.webm",
  "/videos/hero-3.webm",
  "/videos/hero-4.webm",
  "/videos/hero-5.webm",
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    filter: "blur(10px)",
    y: 24,
  },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    y: 0,
    transition: {
      duration: 0.75,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

export function HeroSection({
  isLoaded = true,
  onOpenBooking,
  onOpenCertificate,
  onOpenClub,
}: HeroSectionProps) {
  const { t, lang } = useLanguage();
  const isRu = lang === "ru";
  const [isCentered, setIsCentered] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;

    const centerTimer = setTimeout(() => {
      setIsCentered(true);
    }, 5000);

    return () => clearTimeout(centerTimer);
  }, [isLoaded]);

  return (
    <section id="hero" className="relative min-h-screen w-full bg-black text-white overflow-hidden flex flex-col justify-start items-center border-b border-white/10 font-sans">
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden bg-black pointer-events-none">
        <AmbientVideo
          clips={HERO_VIDEOS}
          isEnabled={isLoaded}
          className="absolute inset-0 w-full h-full object-cover scale-105"
          activeClassName="opacity-100 z-1"
          inactiveClassName="opacity-0 z-0 pointer-events-none"
        />

        {/* Crisp Lighting & Contrast Overlays for clear typography */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/35 to-black/85 z-2" />
        <div className="absolute inset-0 bg-radial-vignette opacity-60 z-2" />
      </div>

      {/* Main Architectural Grid Container */}
      <div className="relative z-10 max-w-[1820px] w-full mx-auto border-l border-r border-white/10 flex flex-col justify-start items-center flex-1 pt-28 sm:pt-36 md:pt-40 lg:pt-44 pb-16 px-6 sm:px-12 pointer-events-auto">
        {/* Center Display Typography & Description with 5-second fluid smooth slide to vertical center */}
        <motion.div
          animate={{
            y: isCentered ? "20vh" : "0vh",
          }}
          transition={{
            duration: 2.2,
            ease: [0.16, 1, 0.3, 1], // Apple-grade smooth deceleration
          }}
          className="max-w-[1400px] w-full mx-auto flex flex-col items-center text-center space-y-5 sm:space-y-6"
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center text-center space-y-4 sm:space-y-5"
          >
            {/* Centered Headline with Red Gradient Dot */}
            <motion.h1
              variants={itemVariants}
              className="text-5xl sm:text-7xl md:text-8xl lg:text-[7rem] font-bold tracking-tighter uppercase leading-[0.92] select-none text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)]"
            >
              {t.hero.headline}<span className="text-gradient-red">.</span>
            </motion.h1>

            {/* Centered Description */}
            <motion.p
              variants={itemVariants}
              className="text-base sm:text-lg lg:text-xl text-[#c8c8cf] max-w-2xl leading-relaxed font-light drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]"
            >
              {t.hero.subtitle}
            </motion.p>

            {/* 3 Main Action Buttons with Clean Typography & Architectural Styling */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-4 sm:pt-5 z-20"
            >
              {/* Button 1: М-КОМЬЮНИТИ */}
              <button
                onClick={onOpenClub}
                className="px-6 sm:px-7 py-3.5 sm:py-4 bg-black/60 hover:bg-white text-white hover:text-black font-bold uppercase tracking-[0.14em] text-xs sm:text-[13px] border border-white/25 hover:border-white rounded transition-all duration-300 backdrop-blur-md cursor-pointer select-none shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
              >
                {isRu ? "М-Комьюнити" : "M-Community"}
              </button>

              {/* Button 2: КУПИТЬ СЕРТИФИКАТ */}
              <button
                onClick={onOpenCertificate}
                className="px-6 sm:px-7 py-3.5 sm:py-4 bg-black/60 hover:bg-white text-white hover:text-black font-bold uppercase tracking-[0.14em] text-xs sm:text-[13px] border border-white/25 hover:border-white rounded transition-all duration-300 backdrop-blur-md cursor-pointer select-none shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
              >
                {isRu ? "Купить сертификат" : "Gift Certificate"}
              </button>

              {/* Button 3: ЗАПИСАТЬСЯ НА ТРЕНИРОВКУ (Primary CTA) */}
              <button
                onClick={() => onOpenBooking && onOpenBooking()}
                className="px-7 sm:px-8 py-3.5 sm:py-4 bg-[#ea4043] hover:bg-[#ff2a55] text-white font-bold uppercase tracking-[0.14em] text-xs sm:text-[13px] border border-[#ea4043] hover:border-[#ff2a55] rounded transition-all duration-300 shadow-[0_0_30px_rgba(234,64,67,0.4)] hover:shadow-[0_0_45px_rgba(234,64,67,0.65)] cursor-pointer select-none"
              >
                {isRu ? "Записаться на тренировку" : "Book Training"}
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}



