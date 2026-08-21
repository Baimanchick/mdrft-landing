"use client";

import React from "react";
import { motion } from "motion/react";
import { useLanguage } from "@/shared/lib/i18n/LanguageContext";

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

export function AboutSection() {
  const { t } = useLanguage();

  return (
    <section id="about" className="relative w-full bg-black text-white border-b border-white/10 overflow-hidden font-sans">
      {/* Background Architectural Grid Lines & Crosshairs */}
      <div className="max-w-[1820px] mx-auto border-l border-r border-white/10 relative">
        {/* Top Header Row with 10% Opacity Background Photo */}
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
              src="/images/about-m3-lineup.webp"
              alt="BMW M Heritage"
              style={{ opacity: 0.42 }}
              className="w-full h-full object-cover object-[center_68%] select-none scale-105"
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
              <span>(01)</span>
              <span className="text-gradient-red">.</span>
            </div>
            <div className="text-sm text-[#8e8e93] uppercase tracking-widest mt-12 font-medium">
              {t.about.category}
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="lg:col-span-9 p-8 sm:p-14 lg:p-20 flex flex-col justify-end relative z-10"
          >
            <div className="text-right">
              <span className="text-sm text-[#ea4043] tracking-widest uppercase mb-4 inline-block font-semibold">
                {t.about.subheading}
              </span>
              <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] xl:text-[6.5rem] font-bold uppercase tracking-tighter text-white leading-[1.06] pt-1">
                {t.about.titleMain}
                <br />
                <span className="text-[#3a3a42] hover:text-white transition-colors">{t.about.titleHighlight}</span>
                {t.about.titleSuffix}
              </h2>
            </div>
          </motion.div>
        </motion.div>

        {/* Spacious 2-Column Architectural Layout (Scale Metrics + Core Rules Manifesto) */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.15, margin: "-50px" }}
          className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px]"
        >
          {/* Left Column: Giant Scale Metrics (Span 7) */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-7 p-8 sm:p-12 lg:p-16 border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col justify-between bg-black relative"
          >
            {/* Giant Stacked Typographic Scale with Uniform Sizing */}
            <div className="font-bold tracking-tighter leading-none select-none flex flex-col justify-between flex-1 gap-2">
              {/* Row 1: 00 */}
              <div className="flex items-baseline justify-between gap-4 py-2 sm:py-3 border-b border-white/5 group hover:border-white/20 transition-colors">
                <span className="text-5xl sm:text-7xl lg:text-[6rem] text-[#2a2a32] group-hover:text-white transition-colors">
                  00
                </span>
                <span className="text-sm sm:text-base lg:text-lg font-semibold uppercase tracking-wider text-[#8e8e93] group-hover:text-white transition-colors text-right">
                  {t.about.scaleItems[0].label}
                </span>
              </div>

              {/* Row 2: 01. (Highlighted Main School Metric) */}
              <div className="flex items-baseline justify-between gap-4 py-2 sm:py-3 border-b border-white/5 group">
                <div className="text-5xl sm:text-7xl lg:text-[6rem] text-white flex items-baseline">
                  <span>01</span>
                  <span className="text-gradient-red text-3xl sm:text-5xl lg:text-[4.5rem]">.</span>
                </div>
                <span className="text-sm sm:text-base lg:text-lg font-semibold uppercase tracking-wider text-white text-right">
                  {t.about.scaleItems[1].label}
                </span>
              </div>

              {/* Row 3: 100% */}
              <div className="flex items-baseline justify-between gap-4 py-2 sm:py-3 border-b border-white/5 group hover:border-white/20 transition-colors">
                <span className="text-5xl sm:text-7xl lg:text-[6rem] text-[#33333d] group-hover:text-white transition-colors">
                  100%
                </span>
                <span className="text-sm sm:text-base lg:text-lg font-semibold uppercase tracking-wider text-[#8e8e93] group-hover:text-white transition-colors text-right">
                  {t.about.scaleItems[2].label}
                </span>
              </div>

              {/* Row 4: №1 */}
              <div className="flex items-baseline justify-between gap-4 py-2 sm:py-3 group hover:border-white/20 transition-colors">
                <span className="text-5xl sm:text-7xl lg:text-[6rem] text-[#22222a] group-hover:text-white transition-colors">
                  №1
                </span>
                <span className="text-sm sm:text-base lg:text-lg font-semibold uppercase tracking-wider text-[#8e8e93] group-hover:text-white transition-colors text-right">
                  {t.about.scaleItems[3].label}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: CORE RULES Manifesto (Span 5) */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-5 p-8 sm:p-12 lg:p-16 flex flex-col justify-between bg-black relative"
          >
            {/* 3 Structured Manifesto Cards stretching to match full height of the left column */}
            <div className="flex flex-col justify-between gap-4 sm:gap-5 h-full flex-1">
              {t.about.rules.map((rule, idx) => (
                <div
                  key={idx}
                  className="flex-1 p-5 sm:p-6 lg:p-7 bg-white/[0.02] border border-white/10 hover:border-[#ea4043]/40 rounded transition-colors group flex flex-col justify-center"
                >
                  <h3 className="text-white font-bold text-base sm:text-lg uppercase tracking-tight mb-2 group-hover:text-white transition-colors">
                    {rule.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#a0a0a8] leading-relaxed font-light">
                    {rule.desc}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

