"use client";

import { motion } from "motion/react";
import { useLanguage } from "@/shared/lib/i18n/LanguageContext";
import { AmbientVideo } from "@/shared/ui/video";

const M2_VIDEOS = [
  { webm: "/videos/forlastblock.webm" },
  { webm: "/videos/forlastblock2.webm" },
] as const;

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
  const { lang } = useLanguage();
  const isRu = lang === "ru";

  return (
    <section className="relative w-full min-h-[620px] sm:min-h-[640px] lg:min-h-[680px] py-14 sm:py-20 bg-black border-b border-white/10 overflow-hidden flex items-center justify-center font-sans">
      <AmbientVideo
        clips={M2_VIDEOS}
        poster="/images/tariffs-instructor-m2.webp"
        posterClassName="object-cover object-[58%_center] sm:object-center"
        className="absolute inset-0 w-full h-full object-cover object-[58%_center] sm:object-center"
        activeClassName="opacity-100 z-1"
        inactiveClassName="opacity-0 z-0 pointer-events-none"
      />

      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/45 to-black/85 z-2 pointer-events-none" />
      <div className="absolute inset-0 bg-radial-vignette opacity-70 z-2 pointer-events-none" />

      <div className="relative z-10 max-w-[1820px] w-full h-full mx-auto border-l border-r border-white/10 flex items-center justify-center px-5 sm:px-12 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl w-full mx-auto flex flex-col items-center text-center space-y-5 sm:space-y-6 pointer-events-auto"
        >
          <div className="space-y-3">
            <span className="text-xs uppercase tracking-widest text-[#ea4043] font-bold block">
              {isRu ? "// РЕВ МОТОРА, СКОРОСТЬ, АДРЕНАЛИН, КЛУБЫ ДЫМА" : "// ENGINE ROAR • SPEED • ADRENALINE • SMOKE TRAILS"}
            </span>

            <h2 className="text-[clamp(1.75rem,8.5vw,2.5rem)] sm:text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tight text-white leading-tight drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]">
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

          <div className="w-full max-w-md pt-2 sm:pt-4 z-20 flex flex-col sm:flex-row sm:flex-wrap items-center justify-center gap-2.5 sm:gap-4">
            {/* Primary Action */}
            <button
              onClick={() => onOpenBooking && onOpenBooking()}
              className="w-full sm:w-auto order-1 sm:order-4 px-6 sm:px-8 py-4 sm:py-4 bg-[#ea4043] hover:bg-[#ff2a55] active:scale-[0.98] text-white font-bold uppercase tracking-[0.12em] sm:tracking-[0.14em] text-xs sm:text-[13px] border border-[#ea4043] hover:border-[#ff2a55] rounded-xl sm:rounded transition-all duration-200 shadow-[0_0_30px_rgba(234,64,67,0.45)] hover:shadow-[0_0_45px_rgba(234,64,67,0.7)] cursor-pointer select-none"
            >
              {isRu ? "Записаться на тренировку" : "Book Training"}
            </button>

            {/* Secondary App Chips on Mobile */}
            <div className="grid grid-cols-2 gap-2 w-full sm:w-auto sm:flex sm:gap-4 order-2">
              <button
                onClick={onOpenClub}
                className="w-full sm:w-auto px-3 sm:px-7 py-3 sm:py-4 bg-black/70 hover:bg-white active:scale-[0.97] text-white hover:text-black font-bold uppercase tracking-[0.1em] sm:tracking-[0.14em] text-[11px] sm:text-[13px] border border-white/25 hover:border-white rounded-xl sm:rounded transition-all duration-200 backdrop-blur-xl cursor-pointer select-none"
              >
                {isRu ? "М-Комьюнити" : "M-Community"}
              </button>

              <button
                onClick={onOpenCertificate}
                className="w-full sm:w-auto px-3 sm:px-7 py-3 sm:py-4 bg-black/70 hover:bg-white active:scale-[0.97] text-white hover:text-black font-bold uppercase tracking-[0.1em] sm:tracking-[0.14em] text-[11px] sm:text-[13px] border border-white/25 hover:border-white rounded-xl sm:rounded transition-all duration-200 backdrop-blur-xl cursor-pointer select-none"
              >
                {isRu ? "Сертификат" : "Certificate"}
              </button>
            </div>

            <button
              onClick={onOpenPartnership}
              className="w-full sm:w-auto order-3 sm:order-1 px-4 sm:px-7 py-2.5 sm:py-4 bg-white/[0.04] sm:bg-black/70 hover:bg-white active:scale-[0.97] text-[#a0a0a8] hover:text-black font-bold uppercase tracking-[0.1em] sm:tracking-[0.14em] text-[11px] sm:text-[13px] border border-white/10 hover:border-white rounded-xl sm:rounded transition-all duration-200 backdrop-blur-xl cursor-pointer select-none"
            >
              {isRu ? "Партнёрам" : "Partners"}
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
