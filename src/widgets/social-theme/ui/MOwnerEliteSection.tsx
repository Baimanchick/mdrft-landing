"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "motion/react";
import type { BookingProgramId } from "@/entities/lead";
import { useLanguage } from "@/shared/lib/i18n/LanguageContext";

interface MOwnerEliteSectionProps {
  onOpenBooking: (tariffId?: BookingProgramId) => void;
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

export function MOwnerEliteSection({ onOpenBooking }: MOwnerEliteSectionProps) {
  const [activeModuleTab, setActiveModuleTab] = useState(0);
  const { t } = useLanguage();

  const flagshipModules = t.tariffs.flagship.modules;

  return (
    <section id="flagship" className="relative w-full bg-black text-white border-b border-white/10 overflow-hidden font-sans">
      <div className="max-w-[1820px] mx-auto border-l border-r border-white/10">
        {/* Top Header Row with BMW M Fleet Background Photo */}
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
              src="/images/flagship-m-fleet.webp"
              alt=""
              fill
              sizes="(min-width: 1820px) 1820px, 100vw"
              style={{ opacity: 0.42 }}
              className="w-full h-full object-cover object-[60%_40%] sm:object-[center_40%] select-none lg:scale-105"
            />
            {/* Soft atmospheric gradient only to preserve text contrast on the right */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/30 lg:bg-gradient-to-r lg:from-black/20 lg:via-black/30 lg:to-black/75" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
          </div>

          {/* Left Column: Number & Category */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-3 p-5 sm:p-10 lg:p-14 border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col justify-between relative z-10"
          >
            <div className="text-3xl sm:text-5xl font-bold text-white flex items-baseline">
              <span>(05)</span>
              <span className="text-gradient-red">.</span>
            </div>
            <div className="text-xs sm:text-sm text-[#b5b5bd] lg:text-[#8e8e93] uppercase tracking-widest mt-6 sm:mt-10 lg:mt-12 font-medium">
              LEVEL ELITE // FLAGSHIP
            </div>
          </motion.div>

          {/* Right Column: Title & Subheading matching other section headers */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-9 p-5 sm:p-10 lg:p-20 flex flex-col justify-end relative z-10"
          >
            <div className="text-left lg:text-right">
              <span className="text-sm text-[#ea4043] tracking-widest uppercase mb-4 inline-block font-semibold">
                {t.tariffs.flagship.subheading}
              </span>
              <h2 className="text-[clamp(2.1rem,10.5vw,4.5rem)] sm:text-6xl md:text-7xl lg:text-[5.5rem] xl:text-[6.5rem] font-bold tracking-tighter uppercase leading-[0.95] text-white break-words">
                M-OWNER ELITE <span className="text-gradient-red">PROGRAM</span>.
              </h2>
              <p className="text-sm sm:text-base text-[#8e8e93] uppercase tracking-wider font-medium mt-3">
                {t.tariffs.flagship.subtitle}
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Row 1: Target Audience & Format / Philosophy Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.15, margin: "-50px" }}
          className="grid grid-cols-1 lg:grid-cols-12 border-b border-white/10"
        >
          {/* Card 1: 100% Control & M Fleet Coverage */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-6 p-5 sm:p-10 lg:p-14 border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col justify-between bg-black"
          >
            <div className="space-y-4">
              <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
                <span className="text-xs uppercase tracking-widest text-[#ea4043] font-bold">
                  {"// АДАПТАЦИЯ К M-СЕРИИ"}
                </span>
                <span className="text-xs text-[#8e8e93] bg-white/5 px-3 py-1 border border-white/10 rounded font-semibold tracking-wider uppercase">
                  RWD & M xDRIVE
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold uppercase tracking-tight text-white leading-snug">
                100% Контроль над M-мощью в любых условиях
              </h3>
              <p className="text-sm sm:text-base text-[#a0a0a8] leading-relaxed">
                {t.tariffs.flagship.desc}
              </p>
            </div>

            {/* M Car Badges List */}
            <div className="pt-8 border-t border-white/10 mt-6">
              <div className="text-xs text-[#8e8e93] uppercase tracking-wider font-semibold mb-3">
                ПОДХОДИТ ДЛЯ ВЛАДЕЛЬЦЕВ МОДЕЛЕЙ:
              </div>
              <div className="flex flex-wrap gap-2">
                {["BMW M2", "BMW M3", "BMW M4", "BMW M5", "BMW M6", "BMW M8"].map((car, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 bg-white/5 border border-white/10 text-white text-xs font-semibold uppercase tracking-wider rounded"
                  >
                    {car}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Card 2: Format & Philosophy */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-6 p-5 sm:p-10 lg:p-14 flex flex-col justify-between bg-[#050508]"
          >
            <div className="space-y-6">
              <div className="p-5 sm:p-6 bg-white/[0.03] border border-white/10 rounded space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#ea4043]" />
                  <span>{t.tariffs.flagship.formatLabel}</span>
                </div>
                <p className="text-xs sm:text-sm text-[#a0a0a8] leading-relaxed">
                  {t.tariffs.flagship.formatValue}
                </p>
              </div>

              <div className="p-5 sm:p-6 bg-white/[0.03] border border-white/10 rounded space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#ea4043]" />
                  <span>{t.tariffs.flagship.philosophyLabel}</span>
                </div>
                <p className="text-xs sm:text-sm text-[#a0a0a8] leading-relaxed">
                  {t.tariffs.flagship.philosophyValue}
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 mt-6 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
              <span className="text-xs text-[#8e8e93] uppercase tracking-wider font-semibold">
                ГЛАВНЫЙ ИНСТРУКТОР + ТЕЛЕМЕТРИЯ
              </span>
              <span className="text-xs text-[#ea4043] font-bold tracking-wider uppercase">
                ● 1-ON-1 COACHING
              </span>
            </div>
          </motion.div>
        </motion.div>

        {/* Row 2: 4 In-Depth Interactive Modules Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.15, margin: "-50px" }}
          className="p-4 sm:p-10 lg:p-20 border-b border-white/10 bg-[#07070a] space-y-4 sm:space-y-8"
        >
          {/* Header & Tabs */}
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 sm:gap-4">
              <div>
                <span className="text-[10px] sm:text-xs uppercase tracking-widest text-[#ea4043] font-bold block mb-1">
                  {"// M-OWNER ELITE PROGRAM — ПРОГРАММА МОДУЛЕЙ:"}
                </span>
                <h3 className="text-xl sm:text-3xl lg:text-4xl font-bold uppercase tracking-tight text-white leading-snug">
                  Что входит в курс «M-Owner Elite»
                </h3>
              </div>
              <div className="text-[11px] sm:text-xs text-[#8e8e93] uppercase tracking-wider font-semibold">
                4 СПЕЦИАЛИЗИРОВАННЫХ БЛОКА
              </div>
            </div>

            {/* 4 iOS-style Segmented Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-white/[0.03] p-1.5 rounded-2xl border border-white/10">
              {flagshipModules.map((mod, i) => (
                <button
                  key={i}
                  onClick={() => setActiveModuleTab(i)}
                  className={`min-h-11 p-2.5 sm:p-4 text-center text-[11px] sm:text-sm uppercase tracking-wider font-bold transition-all duration-200 rounded-xl cursor-pointer active:scale-95 ${
                    activeModuleTab === i
                      ? "bg-white text-black shadow-[0_4px_16px_rgba(0,0,0,0.5)] border border-white"
                      : "bg-transparent text-[#8e8e93] hover:text-white border border-transparent hover:bg-white/10"
                  }`}
                >
                  <span>{mod.tab}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Active Module Details & Full Points Grid */}
          <div className="p-4 sm:p-10 bg-black/70 border border-white/10 rounded-2xl space-y-4 sm:space-y-6">
            <div>
              <h4 className="text-lg sm:text-2xl font-bold uppercase tracking-tight text-white mb-1.5">
                {flagshipModules[activeModuleTab].title}
              </h4>
              <p className="text-xs sm:text-base text-[#a0a0a8] leading-relaxed max-w-3xl font-light">
                {flagshipModules[activeModuleTab].intro}
              </p>
            </div>

            {/* Sub-points Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-4 pt-3 sm:pt-4 border-t border-white/10">
              {flagshipModules[activeModuleTab].points.map((p, idx) => (
                <div
                  key={idx}
                  className="p-3.5 sm:p-5 bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 rounded-xl transition-colors"
                >
                  <div className="text-white font-bold text-xs sm:text-sm uppercase tracking-wider mb-1.5 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ea4043] shrink-0" />
                    <span>{p.label}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#a0a0a8] leading-relaxed font-light">
                    {p.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Row 3: Telemetry Metrics & Booking Strip */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.25, margin: "-40px" }}
          className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-12 bg-black border-t border-white/10"
        >
          {/* Column 01: Duration */}
          <div className="p-5 sm:p-8 lg:p-12 border-b md:border-b-0 md:border-r border-white/10 flex flex-col justify-between lg:col-span-3">
            <div className="text-[11px] sm:text-xs text-[#8e8e93] uppercase tracking-widest font-bold mb-2 sm:mb-4 font-mono">
              {"// 01. ДЛИТЕЛЬНОСТЬ"}
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono">10+ ЧАСОВ</div>
              <div className="text-xs text-[#8e8e93] uppercase tracking-wider font-semibold mt-1">
                ИНДИВИДУАЛЬНОЙ ПРАКТИКИ
              </div>
            </div>
          </div>

          {/* Column 02: Skill & Emotions */}
          <div className="p-5 sm:p-8 lg:p-12 border-b md:border-b-0 lg:border-r border-white/10 flex flex-col justify-between lg:col-span-3">
            <div className="text-[11px] sm:text-xs text-[#8e8e93] uppercase tracking-widest font-bold mb-2 sm:mb-4 font-mono">
              {"// 02. РЕЗУЛЬТАТИВНОСТЬ"}
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono">
                5 / 5 <span className="text-[#ea4043] font-bold text-sm sm:text-base">PRO LEVEL</span>
              </div>
              <div className="text-xs text-[#8e8e93] uppercase tracking-wider font-semibold mt-1">
                МАКСИМАЛЬНЫЙ НАВЫК И ЭМОЦИИ
              </div>
            </div>
          </div>

          {/* Column 03: Price */}
          <div className="p-5 sm:p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col justify-between lg:col-span-3">
            <div className="text-[11px] sm:text-xs text-[#8e8e93] uppercase tracking-widest font-bold mb-2 sm:mb-4 font-mono">
              {"// 03. СТОИМОСТЬ"}
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono">
                {t.tariffs.flagship.price}
              </div>
              <div className="text-xs text-[#8e8e93] uppercase tracking-wider font-semibold mt-1">
                ПОЛНЫЙ КУРС «ПОД КЛЮЧ»
              </div>
            </div>
          </div>

          {/* Column 04: Action Button */}
          <div className="p-5 sm:p-8 lg:p-12 flex flex-col justify-center bg-[#07070a] md:col-span-3 lg:col-span-3">
            <button
              onClick={() => onOpenBooking("m-owner-elite")}
              className="w-full min-h-[52px] py-4 px-6 bg-white hover:bg-[#ea4043] active:scale-[0.98] text-black hover:text-white font-bold uppercase tracking-[0.14em] text-xs rounded-xl lg:rounded transition-all duration-300 shadow-[0_4px_25px_rgba(0,0,0,0.5)] cursor-pointer select-none flex items-center justify-between group"
            >
              <span>{t.tariffs.flagship.btn}</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
