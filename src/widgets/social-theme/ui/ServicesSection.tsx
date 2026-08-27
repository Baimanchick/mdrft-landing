"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { useLanguage } from "@/shared/lib/i18n/LanguageContext";

interface ServicesSectionProps {
  onOpenBooking: () => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.14,
      delayChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    filter: "blur(10px)",
    y: 28,
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

export function ServicesSection({ onOpenBooking }: ServicesSectionProps) {
  const { t } = useLanguage();

  return (
    <section id="services" className="relative w-full bg-black text-white border-b border-white/10 overflow-hidden font-sans">
      <div className="max-w-[1820px] mx-auto border-l border-r border-white/10">
        {/* Top Header Row with Right-Aligned Offset & Telemetry Background Image */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.25, margin: "-40px" }}
          className="grid min-h-[430px] grid-cols-1 lg:min-h-[600px] lg:grid-cols-12 border-b border-white/10 relative overflow-hidden bg-black"
        >
          {/* Background Photo in top half of block */}
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            <Image
              src="/images/services-telemetry-bg.webp"
              alt=""
              fill
              sizes="(min-width: 1820px) 1820px, 100vw"
              style={{ opacity: 0.42 }}
              className="w-full h-full object-cover object-[58%_45%] sm:object-[center_45%] select-none lg:scale-105"
            />
            {/* Soft atmospheric gradient only to preserve text contrast on the right */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/30 lg:bg-gradient-to-r lg:from-black/20 lg:via-black/30 lg:to-black/75" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
          </div>

          <motion.div
            variants={itemVariants}
            className="lg:col-span-3 p-5 sm:p-10 lg:p-14 border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col justify-between relative z-10"
          >
            <div className="text-3xl sm:text-5xl font-bold text-white flex items-baseline">
              <span>(02)</span>
              <span className="text-gradient-red">.</span>
            </div>
            <div className="text-xs sm:text-sm text-[#b5b5bd] lg:text-[#8e8e93] uppercase tracking-widest mt-6 sm:mt-10 lg:mt-12 font-medium">
              {t.services.category}
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="lg:col-span-9 p-5 sm:p-10 lg:p-20 flex flex-col justify-end relative z-10"
          >
            <div className="text-left lg:text-right">
              <span className="text-sm text-[#ea4043] tracking-widest uppercase mb-4 inline-block font-semibold">
                {t.services.subheading}
              </span>
              <h2 className="text-[clamp(2.25rem,11vw,4.5rem)] sm:text-6xl md:text-7xl lg:text-[5.5rem] xl:text-[6.5rem] font-bold uppercase tracking-tighter text-white leading-[1.05] break-words">
                {t.services.titleMain}
                <br />
                <span className="text-[#3a3a42] hover:text-white transition-colors">{t.services.titleHighlight}</span>
                {t.services.titleSuffix}
              </h2>
            </div>
          </motion.div>
        </motion.div>

        {/* Art Grid Row 1 (5 + 7) */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.15, margin: "-50px" }}
          className="grid grid-cols-1 lg:grid-cols-12 border-b border-white/10 gap-3 sm:gap-0 p-3 sm:p-0"
        >
          {/* Pillar 01 */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-5 p-5 sm:p-10 lg:p-14 border border-white/10 sm:border-0 sm:border-b lg:border-b-0 lg:border-r border-white/10 rounded-2xl sm:rounded-none flex flex-col justify-between min-h-[260px] sm:min-h-[380px] lg:min-h-[420px] bg-white/[0.02] sm:bg-transparent hover:bg-white/[0.04] transition-colors group"
          >
            <div className="flex items-center justify-between">
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">01<span className="text-[#ea4043]">.</span></div>
              <span className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider text-[#ea4043] bg-[#ea4043]/10 px-2.5 py-1 rounded-full border border-[#ea4043]/20">
                100% PRACTICE
              </span>
            </div>

            <div className="my-5 sm:my-8 space-y-2.5 sm:space-y-4">
              <h3 className="text-xl sm:text-3xl lg:text-4xl font-bold uppercase tracking-tight text-white leading-snug">
                {t.services.p1Title}
              </h3>
              <p className="text-xs sm:text-base lg:text-lg text-[#a0a0a8] leading-relaxed font-light">
                {t.services.p1Desc}
              </p>
            </div>

            <div className="pt-3.5 sm:pt-4 border-t border-white/10 text-xs sm:text-sm text-white/70 font-medium tracking-wider">
              {t.services.p1Detail}
            </div>
          </motion.div>

          {/* Pillar 02: Architectural Card */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-7 p-5 sm:p-10 lg:p-16 border border-white/10 sm:border-0 rounded-2xl sm:rounded-none flex flex-col justify-between min-h-[260px] sm:min-h-[380px] lg:min-h-[420px] bg-white/[0.02] sm:bg-[#050508] hover:bg-white/[0.04] transition-colors group"
          >
            <div className="flex items-center justify-between">
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">02<span className="text-[#ea4043]">.</span></div>
              <span className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider text-[#0099ff] bg-[#0099ff]/10 px-2.5 py-1 rounded-full border border-[#0099ff]/20">
                BMW M FLEET
              </span>
            </div>

            <div className="my-5 sm:my-8 space-y-2.5 sm:space-y-4 max-w-xl">
              <h3 className="text-xl sm:text-3xl lg:text-4xl font-bold uppercase tracking-tight text-white leading-snug">
                {t.services.p2Title}
              </h3>
              <p className="text-xs sm:text-base lg:text-lg text-[#a0a0a8] leading-relaxed font-light">
                {t.services.p2Desc}
              </p>
            </div>

            <div className="pt-3.5 sm:pt-4 border-t border-white/10 flex items-center justify-between text-xs sm:text-sm text-[#8e8e93] font-medium tracking-wider">
              <span>{t.services.p2Detail}</span>
              <span>→</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Second Row of Cards (7 + 5) */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.15, margin: "-50px" }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-0 p-3 sm:p-0"
        >
          {/* Pillar 03 */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-7 p-5 sm:p-10 lg:p-16 border border-white/10 sm:border-0 sm:border-b lg:border-b-0 lg:border-r border-white/10 rounded-2xl sm:rounded-none flex flex-col justify-between min-h-[260px] sm:min-h-[380px] lg:min-h-[420px] bg-white/[0.02] sm:bg-transparent hover:bg-white/[0.04] transition-colors group"
          >
            <div className="flex items-center justify-between">
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">03<span className="text-[#ea4043]">.</span></div>
              <span className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider text-white/70 bg-white/10 px-2.5 py-1 rounded-full border border-white/15">
                TELEMETRY
              </span>
            </div>

            <div className="my-5 sm:my-8 space-y-2.5 sm:space-y-4">
              <h3 className="text-xl sm:text-3xl lg:text-[2.1rem] xl:text-[2.35rem] font-bold uppercase tracking-tight text-white leading-snug">
                {t.services.p3Title}
              </h3>
              <p className="text-xs sm:text-base lg:text-lg text-[#a0a0a8] leading-relaxed max-w-2xl font-light">
                {t.services.p3Desc}
              </p>
            </div>

            <div className="pt-3.5 sm:pt-4 border-t border-white/10 text-xs sm:text-sm text-[#8e8e93] font-medium tracking-wider">
              {t.services.p3Detail}
            </div>
          </motion.div>

          {/* Pillar 04 */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-5 p-5 sm:p-10 lg:p-14 border border-white/10 sm:border-0 rounded-2xl sm:rounded-none flex flex-col justify-between min-h-[260px] sm:min-h-[380px] lg:min-h-[420px] bg-white/[0.02] sm:bg-black"
          >
            <div className="flex items-center justify-between">
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">04<span className="text-[#ea4043]">.</span></div>
              <span className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider text-[#ea4043] bg-[#ea4043]/10 px-2.5 py-1 rounded-full border border-[#ea4043]/20">
                PRO COACHING
              </span>
            </div>

            <div className="my-5 sm:my-8 space-y-2.5 sm:space-y-4">
              <h3 className="text-xl sm:text-3xl lg:text-4xl font-bold uppercase tracking-tight text-white leading-snug">
                {t.services.p4Title}
              </h3>
              <p className="text-xs sm:text-base lg:text-lg text-[#a0a0a8] leading-relaxed font-light">
                {t.services.p4Desc}
              </p>
            </div>

            <div className="pt-3.5 sm:pt-4 border-t border-white/10">
              <button
                onClick={onOpenBooking}
                className="btn-card-swiss"
              >
                <span>{t.services.p4Btn}</span>
                <span>→</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
