"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { useLanguage } from "@/shared/lib/i18n/LanguageContext";

const M2_VIDEOS = [
  "/videos/bmwm2-1.webm",
  "/videos/bmwm2-2.webm",
];

interface BmwM2ReelSectionProps {
  onOpenBooking?: () => void;
  onOpenCertificate?: () => void;
  onOpenClub?: () => void;
  onOpenPartnership?: () => void;
}

export function BmwM2ReelSection({
  onOpenBooking,
  onOpenCertificate,
  onOpenClub,
  onOpenPartnership,
}: BmwM2ReelSectionProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const { lang } = useLanguage();
  const isRu = lang === "ru";

  const handleEnded = (idx: number) => {
    const nextIdx = (idx + 1) % M2_VIDEOS.length;
    const nextVideo = videoRefs.current[nextIdx];
    if (nextVideo) {
      nextVideo.currentTime = 0;
      nextVideo.play().catch(() => {});
    }
    setCurrentIdx(nextIdx);
  };

  useEffect(() => {
    const activeVid = videoRefs.current[currentIdx];
    if (activeVid) {
      activeVid.play().catch(() => {});
    }
  }, [currentIdx]);

  return (
    <section className="relative w-full min-h-[560px] sm:min-h-[620px] lg:min-h-[680px] py-16 sm:py-20 bg-black border-b border-white/10 overflow-hidden flex items-center justify-center font-sans">
      {/* 2 Preloaded instant seamless video layers */}
      {M2_VIDEOS.map((src, idx) => (
        <video
          key={src}
          ref={(el) => {
            videoRefs.current[idx] = el;
          }}
          autoPlay={idx === 0}
          muted
          playsInline
          preload="auto"
          onEnded={() => handleEnded(idx)}
          className={`absolute inset-0 w-full h-full object-cover scale-105 ${
            idx === currentIdx ? "opacity-100 z-1" : "opacity-0 z-0 pointer-events-none"
          }`}
          src={src}
        />
      ))}

      {/* Cinematic Contrast Vignette Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/45 to-black/85 z-2 pointer-events-none" />
      <div className="absolute inset-0 bg-radial-vignette opacity-70 z-2 pointer-events-none" />

      {/* Architectural Grid Line Container matching the site */}
      <div className="relative z-10 max-w-[1820px] w-full h-full mx-auto border-l border-r border-white/10 flex items-center justify-center px-6 sm:px-12 pointer-events-none">
        {/* Dynamic CTA Text and Buttons Panel */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl w-full mx-auto flex flex-col items-center text-center space-y-5 sm:space-y-6 pointer-events-auto"
        >
          {/* Subheading, Headline & Description */}
          <div className="space-y-3">
            <span className="text-xs uppercase tracking-widest text-[#ea4043] font-bold block">
              {isRu ? "// РЕВ МОТОРА, СКОРОСТЬ, АДРЕНАЛИН, КЛУБЫ ДЫМА" : "// ENGINE ROAR • SPEED • ADRENALINE • SMOKE TRAILS"}
            </span>

            <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tight text-white leading-tight drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]">
              {isRu ? (
                <>
                  ГОТОВ ПРОВЕРИТЬ СЕБЯ?
                  <br />
                  ПОСМОТРИМ, НА ЧТО ТЫ СПОСОБЕН<span className="text-gradient-red">!</span>
                </>
              ) : (
                <>
                  READY TO TEST YOURSELF?
                  <br />
                  LET&apos;S SEE WHAT YOU&apos;RE CAPABLE OF<span className="text-gradient-red">!</span>
                </>
              )}
            </h2>

            <p className="text-sm sm:text-base text-[#d1d1d6] max-w-xl mx-auto font-light leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
              {isRu
                ? "Ощутите 100% контроль над машиной в управляемом заносе. Выберите программу тренировок, оформите сертификат или вступите в M-Community."
                : "Experience 100% control in controlled slides. Choose a training program, get a certificate or join M-Community."}
            </p>
          </div>

          {/* The 4 Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-1">
            {/* Button 1: ПАРТНЁРАМ */}
            <button
              onClick={onOpenPartnership}
              className="px-6 sm:px-7 py-3.5 sm:py-4 bg-black/60 hover:bg-white text-white hover:text-black font-bold uppercase tracking-[0.14em] text-xs sm:text-[13px] border border-white/25 hover:border-white rounded transition-all duration-300 backdrop-blur-md cursor-pointer select-none shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
            >
              {isRu ? "Партнёрам" : "Partners"}
            </button>

            {/* Button 2: М-КОМЬЮНИТИ */}
            <button
              onClick={onOpenClub}
              className="px-6 sm:px-7 py-3.5 sm:py-4 bg-black/60 hover:bg-white text-white hover:text-black font-bold uppercase tracking-[0.14em] text-xs sm:text-[13px] border border-white/25 hover:border-white rounded transition-all duration-300 backdrop-blur-md cursor-pointer select-none shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
            >
              {isRu ? "М-Комьюнити" : "M-Community"}
            </button>

            {/* Button 3: КУПИТЬ СЕРТИФИКАТ */}
            <button
              onClick={onOpenCertificate}
              className="px-6 sm:px-7 py-3.5 sm:py-4 bg-black/60 hover:bg-white text-white hover:text-black font-bold uppercase tracking-[0.14em] text-xs sm:text-[13px] border border-white/25 hover:border-white rounded transition-all duration-300 backdrop-blur-md cursor-pointer select-none shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
            >
              {isRu ? "Купить сертификат" : "Gift Certificate"}
            </button>

            {/* Button 4: ЗАПИСАТЬСЯ НА ТРЕНИРОВКУ (Primary CTA) */}
            <button
              onClick={() => onOpenBooking && onOpenBooking()}
              className="px-7 sm:px-8 py-3.5 sm:py-4 bg-[#ea4043] hover:bg-[#ff2a55] text-white font-bold uppercase tracking-[0.14em] text-xs sm:text-[13px] border border-[#ea4043] hover:border-[#ff2a55] rounded transition-all duration-300 shadow-[0_0_30px_rgba(234,64,67,0.4)] hover:shadow-[0_0_45px_rgba(234,64,67,0.65)] cursor-pointer select-none"
            >
              {isRu ? "Записаться на тренировку" : "Book Training"}
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
