"use client";

import React, { useRef, useState } from "react";
import { motion } from "motion/react";
import { useLanguage } from "@/shared/lib/i18n/LanguageContext";

interface TrackDaysSectionProps {
  onOpenClub: () => void;
}

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
    filter: "blur(8px)",
    y: 20,
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

export function TrackDaysSection({ onOpenClub }: TrackDaysSectionProps) {
  const { t } = useLanguage();
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const toggleSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <section id="track-days" className="relative w-full bg-black text-white border-b border-white/10 overflow-hidden font-sans">
      <div className="max-w-[1820px] mx-auto border-l border-r border-white/10 relative min-h-[500px] sm:min-h-[560px] lg:min-h-[600px] flex flex-col justify-between overflow-hidden">
        {/* Background Fullscreen High-Speed Video */}
        <div className="absolute inset-0 z-0 overflow-hidden bg-black pointer-events-none">
          <video
            ref={videoRef}
            src="/videos/block-5.webm"
            autoPlay
            loop
            muted={isMuted}
            playsInline
            className="w-full h-full object-cover select-none"
          />

          {/* Deep Left Gradient Overlay: 96% -> 85% on the left, fading to 0% transparent on the right */}
          <div
            className="absolute inset-0 z-1 pointer-events-none"
            style={{
              background:
                "linear-gradient(90deg, rgba(0, 0, 0, 0.96) 0%, rgba(0, 0, 0, 0.85) 32%, rgba(0, 0, 0, 0.45) 55%, rgba(0, 0, 0, 0) 80%)",
            }}
          />
        </div>

        {/* Foreground Content */}
        <div className="relative z-10 w-full py-16 sm:py-20 lg:py-24 px-8 sm:px-14 lg:px-20 flex flex-col justify-center flex-1 pointer-events-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3, margin: "-40px" }}
            className="flex flex-col justify-center my-auto"
          >
            {/* Title, Description & Compact Button Block */}
            <motion.div variants={itemVariants} className="space-y-5 max-w-3xl">
              <div className="text-xs sm:text-sm uppercase tracking-widest text-[#ea4043] font-bold drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                {t.club.bannerBadge}
              </div>
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold uppercase tracking-tight text-white leading-[1.05] drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
                {t.club.bannerTitle}
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-[#d1d1d6] leading-relaxed font-light drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)] max-w-2xl">
                {t.club.bannerDesc}
              </p>

              {/* Compact Button directly under description */}
              <div className="pt-2">
                <button
                  onClick={onOpenClub}
                  className="px-6 py-3 bg-black/60 hover:bg-white text-white hover:text-black font-semibold uppercase tracking-[0.12em] text-xs border border-white/30 hover:border-white rounded transition-all duration-300 backdrop-blur-md cursor-pointer select-none shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
                >
                  {t.club.bannerBtn}
                </button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
