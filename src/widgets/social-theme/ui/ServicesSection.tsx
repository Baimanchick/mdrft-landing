"use client";

import React from "react";
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
          className="grid grid-cols-1 lg:grid-cols-12 border-b border-white/10 relative overflow-hidden bg-black"
        >
          {/* Background Photo in top half of block */}
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            <img
              src="/images/services-telemetry-bg.webp"
              alt="BMW M Telemetry & Engineering"
              style={{ opacity: 0.42 }}
              className="w-full h-full object-cover object-[center_45%] select-none scale-105"
            />
            {/* Soft atmospheric gradient only to preserve text contrast on the right */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-black/30 to-black/75" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
          </div>

          <motion.div
            variants={itemVariants}
            className="lg:col-span-3 p-8 sm:p-14 border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col justify-between relative z-10"
          >
            <div className="text-3xl sm:text-5xl font-bold text-white flex items-baseline">
              <span>(02)</span>
              <span className="text-gradient-red">.</span>
            </div>
            <div className="text-sm text-[#8e8e93] uppercase tracking-widest mt-12 font-medium">
              {t.services.category}
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="lg:col-span-9 p-8 sm:p-14 lg:p-20 flex flex-col justify-end relative z-10"
          >
            <div className="text-right">
              <span className="text-sm text-[#ea4043] tracking-widest uppercase mb-4 inline-block font-semibold">
                {t.services.subheading}
              </span>
              <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] xl:text-[6.5rem] font-bold uppercase tracking-tighter text-white leading-[1.05]">
                {t.services.titleMain}
                <br />
                <span className="text-[#3a3a42] hover:text-white transition-colors">{t.services.titleHighlight}</span>
                {t.services.titleSuffix}
              </h2>
            </div>
          </motion.div>
        </motion.div>

        {/* Asymmetrical Diagonal Art Grid Row 1 (5 + 7) */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.15, margin: "-50px" }}
          className="grid grid-cols-1 lg:grid-cols-12 border-b border-white/10"
        >
          {/* Pillar 01 (Span 5 - Widened) */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-5 p-8 sm:p-12 lg:p-14 border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col justify-between min-h-[420px] hover:bg-white/[0.02] transition-colors group"
          >
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-white">01<span className="text-gradient-red">.</span></div>
            </div>

            <div className="my-8 space-y-4">
              <h3 className="text-3xl sm:text-4xl font-bold uppercase tracking-tight text-white">
                {t.services.p1Title}
              </h3>
              <p className="text-base sm:text-lg text-[#a0a0a8] leading-relaxed">
                {t.services.p1Desc}
              </p>
            </div>

            <div className="pt-4 border-t border-white/10 text-sm text-white/70 font-medium tracking-wider">
              {t.services.p1Detail}
            </div>
          </motion.div>

          {/* Pillar 02: Architectural Card (Span 7) */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-7 p-8 sm:p-14 lg:p-16 flex flex-col justify-between min-h-[420px] bg-[#050508] hover:bg-white/[0.02] transition-colors group"
          >
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-white">02<span className="text-gradient-red">.</span></div>
            </div>

            <div className="my-8 space-y-4 max-w-xl">
              <h3 className="text-3xl sm:text-4xl font-bold uppercase tracking-tight text-white">
                {t.services.p2Title}
              </h3>
              <p className="text-base sm:text-lg text-[#a0a0a8] leading-relaxed">
                {t.services.p2Desc}
              </p>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-sm text-[#8e8e93] font-medium tracking-wider">
              <span>{t.services.p2Detail}</span>
              <span>→</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Second Row of Asymmetry (7 + 5) */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.15, margin: "-50px" }}
          className="grid grid-cols-1 lg:grid-cols-12"
        >
          {/* Pillar 03: Wide Format (Span 7) */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-7 p-8 sm:p-14 lg:p-16 border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col justify-between min-h-[420px] hover:bg-white/[0.02] transition-colors group"
          >
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-white">03<span className="text-gradient-red">.</span></div>
            </div>

            <div className="my-8 space-y-4">
              <h3 className="text-2xl sm:text-3xl lg:text-[2.1rem] xl:text-[2.35rem] font-bold uppercase tracking-tight text-white whitespace-normal lg:whitespace-nowrap">
                {t.services.p3Title}
              </h3>
              <p className="text-base sm:text-lg text-[#a0a0a8] leading-relaxed max-w-2xl">
                {t.services.p3Desc}
              </p>
            </div>

            <div className="pt-4 border-t border-white/10 text-sm text-[#8e8e93] font-medium tracking-wider">
              {t.services.p3Detail}
            </div>
          </motion.div>

          {/* Pillar 04: Format (Span 5) */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-5 p-8 sm:p-12 lg:p-14 flex flex-col justify-between min-h-[420px] bg-black"
          >
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-white">04<span className="text-gradient-red">.</span></div>
            </div>

            <div className="my-8 space-y-4">
              <h3 className="text-3xl sm:text-4xl font-bold uppercase tracking-tight text-white">
                {t.services.p4Title}
              </h3>
              <p className="text-base sm:text-lg text-[#a0a0a8] leading-relaxed">
                {t.services.p4Desc}
              </p>
            </div>

            <div className="pt-4 border-t border-white/10">
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
