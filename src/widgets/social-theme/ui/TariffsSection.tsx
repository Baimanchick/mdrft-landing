"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { useLanguage } from "@/shared/lib/i18n/LanguageContext";

interface TariffsSectionProps {
  onOpenBooking: (tariffId?: string) => void;
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

export function TariffsSection({ onOpenBooking }: TariffsSectionProps) {
  const { t } = useLanguage();

  return (
    <section id="tariffs" className="relative w-full bg-black text-white border-b border-white/10 overflow-hidden font-sans">
      <div className="max-w-[1820px] mx-auto border-l border-r border-white/10">
        {/* Top Header with Instructor & BMW M2 Background Photo */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.25, margin: "-40px" }}
          className="grid grid-cols-1 lg:grid-cols-12 border-b border-white/10 relative overflow-hidden bg-black"
        >
          {/* Background Photo in top half of block */}
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            <Image
              src="/images/tariffs-instructor-m2.webp"
              alt=""
              fill
              sizes="100vw"
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
              <span>(04)</span>
              <span className="text-gradient-red">.</span>
            </div>
            <div className="text-sm text-[#8e8e93] uppercase tracking-widest mt-12 font-medium">
              {t.tariffs.category}
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="lg:col-span-9 p-8 sm:p-14 lg:p-20 flex flex-col justify-end relative z-10"
          >
            <div className="space-y-2">
              <span className="text-sm text-[#ea4043] tracking-widest uppercase block font-semibold">
                {t.tariffs.subheading}
              </span>
              <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] xl:text-[6.5rem] font-bold uppercase tracking-tighter text-white leading-[1.05]">
                {t.tariffs.titleMain}
                <br />
                <span className="text-[#3a3a42] hover:text-white transition-colors">{t.tariffs.titleHighlight}</span>
                {t.tariffs.titleSuffix}
              </h2>
            </div>
          </motion.div>
        </motion.div>

        {/* Row 1: Cards 01, 02, 03 */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.15, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-12 border-b border-white/10"
        >
          {/* Card 01: First Touch (Plastic Skidpad) */}
          <motion.div
            variants={itemVariants}
            className="md:col-span-6 lg:col-span-4 p-8 sm:p-12 lg:p-14 border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col justify-between min-h-[480px] bg-black relative overflow-hidden group cursor-pointer"
          >
            {/* Background Image: Deep dark idle -> Brighter on hover */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
              <Image
                src="/images/tariff-1-first-touch.webp"
                alt=""
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                className="w-full h-full object-cover opacity-50 group-hover:opacity-75 group-hover:scale-105 transition-all duration-500 ease-out select-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30 group-hover:via-black/40 group-hover:to-black/10 transition-colors duration-500" />
            </div>

            <div className="relative z-10 flex items-center justify-between">
              <div className="text-3xl font-bold text-white">01<span className="text-gradient-red">.</span></div>
              <span className="text-sm px-3.5 py-1 bg-white/5 border border-white/10 text-[#a0a0a8] font-semibold tracking-wider backdrop-blur-md">
                {t.tariffs.card1.badge}
              </span>
            </div>

            <div className="relative z-10 my-6 space-y-3">
              <div className="text-3xl sm:text-4xl font-bold text-white tracking-tight">{t.tariffs.card1.price}</div>
              <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-white leading-snug">
                {t.tariffs.card1.title}
              </h3>
              <p className="text-sm sm:text-base text-[#a0a0a8] leading-relaxed">
                {t.tariffs.card1.desc}
              </p>
            </div>

            <div className="relative z-10 pt-4 border-t border-white/10">
              <button
                onClick={() => onOpenBooking("first-touch")}
                className="btn-card-swiss"
              >
                <span>{t.tariffs.card1.btn}</span>
                <span>→</span>
              </button>
            </div>
          </motion.div>

          {/* Card 02: Asphalt Start (Tarmac Drift) */}
          <motion.div
            variants={itemVariants}
            className="md:col-span-6 lg:col-span-4 p-8 sm:p-12 lg:p-14 border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col justify-between min-h-[480px] bg-[#050508] relative overflow-hidden group cursor-pointer"
          >
            {/* Background Image: Deep dark idle -> Brighter on hover */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
              <Image
                src="/images/tariff-2-asphalt-start.webp"
                alt=""
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                className="w-full h-full object-cover opacity-50 group-hover:opacity-75 group-hover:scale-105 transition-all duration-500 ease-out select-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30 group-hover:via-black/40 group-hover:to-black/10 transition-colors duration-500" />
            </div>

            <div className="relative z-10 flex items-center justify-between">
              <div className="text-3xl font-bold text-white">02<span className="text-gradient-red">.</span></div>
              <span className="text-sm px-3.5 py-1 bg-white/5 border border-white/10 text-[#a0a0a8] font-semibold tracking-wider backdrop-blur-md">
                {t.tariffs.card2.badge}
              </span>
            </div>

            <div className="relative z-10 my-6 space-y-3">
              <div className="text-3xl sm:text-4xl font-bold text-white tracking-tight">{t.tariffs.card2.price}</div>
              <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-white leading-snug">
                {t.tariffs.card2.title}
              </h3>
              <p className="text-sm sm:text-base text-[#a0a0a8] leading-relaxed">
                {t.tariffs.card2.desc}
              </p>
            </div>

            <div className="relative z-10 pt-4 border-t border-white/10">
              <button
                onClick={() => onOpenBooking("asphalt-start")}
                className="btn-card-swiss"
              >
                <span>{t.tariffs.card2.btn}</span>
                <span>→</span>
              </button>
            </div>
          </motion.div>

          {/* Card 03: Pro Progress (Intensive Course) */}
          <motion.div
            variants={itemVariants}
            className="md:col-span-12 lg:col-span-4 p-8 sm:p-12 lg:p-14 flex flex-col justify-between min-h-[480px] bg-[#07070a] relative overflow-hidden group cursor-pointer"
          >
            {/* Background Image: Deep dark idle -> Brighter on hover */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
              <Image
                src="/images/tariff-3-pro-progress.webp"
                alt=""
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                className="w-full h-full object-cover opacity-50 group-hover:opacity-75 group-hover:scale-105 transition-all duration-500 ease-out select-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30 group-hover:via-black/40 group-hover:to-black/10 transition-colors duration-500" />
            </div>

            <div className="relative z-10 flex items-center justify-between">
              <div className="text-3xl font-bold text-white">03<span className="text-gradient-red">.</span></div>
              <span className="text-sm px-3 py-1 bg-[#ea4043] text-white font-bold tracking-wider rounded-sm shadow-[0_0_15px_rgba(234,64,67,0.4)]">
                {t.tariffs.card3.badge}
              </span>
            </div>

            <div className="relative z-10 my-6 space-y-3">
              <div className="text-3xl sm:text-4xl font-bold text-white tracking-tight">{t.tariffs.card3.price}</div>
              <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-white leading-snug">
                {t.tariffs.card3.title}
              </h3>
              <p className="text-sm sm:text-base text-[#a0a0a8] leading-relaxed">
                {t.tariffs.card3.desc}
              </p>
            </div>

            <div className="relative z-10 pt-4 border-t border-white/10">
              <button
                onClick={() => onOpenBooking("pro-progress")}
                className="btn-card-swiss"
              >
                <span>{t.tariffs.card3.btn}</span>
                <span>→</span>
              </button>
            </div>
          </motion.div>
        </motion.div>

        {/* Row 2: Cards 04, 05, 06 */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.15, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-12"
        >
          {/* Card 04: Mastery Control (Deep Drift Entry) */}
          <motion.div
            variants={itemVariants}
            className="md:col-span-6 lg:col-span-4 p-8 sm:p-12 lg:p-14 border-b md:border-b-0 md:border-r border-white/10 flex flex-col justify-between min-h-[480px] bg-black relative overflow-hidden group cursor-pointer"
          >
            {/* Background Image: Deep dark idle -> Brighter on hover */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
              <Image
                src="/images/tariff-4-mastery-control.webp"
                alt=""
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                className="w-full h-full object-cover opacity-50 group-hover:opacity-75 group-hover:scale-105 transition-all duration-500 ease-out select-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30 group-hover:via-black/40 group-hover:to-black/10 transition-colors duration-500" />
            </div>

            <div className="relative z-10 flex items-center justify-between">
              <div className="text-3xl font-bold text-white">04<span className="text-gradient-red">.</span></div>
              <span className="text-sm px-3.5 py-1 bg-white/5 border border-white/10 text-[#a0a0a8] font-semibold tracking-wider backdrop-blur-md">
                {t.tariffs.card4.badge}
              </span>
            </div>

            <div className="relative z-10 my-6 space-y-3">
              <div className="text-3xl sm:text-4xl font-bold text-white tracking-tight">{t.tariffs.card4.price}</div>
              <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-white leading-snug">
                {t.tariffs.card4.title}
              </h3>
              <p className="text-sm sm:text-base text-[#a0a0a8] leading-relaxed">
                {t.tariffs.card4.desc}
              </p>
            </div>

            <div className="relative z-10 pt-4 border-t border-white/10 space-y-3">
              <div className="text-xs text-[#8e8e93] font-medium tracking-wider">
                {t.tariffs.card4.meta}
              </div>
              <button
                onClick={() => onOpenBooking("mastery-control")}
                className="btn-card-swiss"
              >
                <span className="whitespace-nowrap">{t.tariffs.card4.btn}</span>
                <span>→</span>
              </button>
            </div>
          </motion.div>

          {/* Card 05: ADM Race Track Experience */}
          <motion.div
            variants={itemVariants}
            className="md:col-span-6 lg:col-span-4 p-8 sm:p-12 lg:p-14 border-b md:border-b-0 lg:border-r border-white/10 flex flex-col justify-between min-h-[480px] bg-[#07070a] relative overflow-hidden group cursor-pointer"
          >
            {/* Background Image: Deep dark idle -> Brighter on hover */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
              <Image
                src="/images/tariff-5-adm-raceway.webp"
                alt=""
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                className="w-full h-full object-cover opacity-50 group-hover:opacity-75 group-hover:scale-105 transition-all duration-500 ease-out select-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30 group-hover:via-black/40 group-hover:to-black/10 transition-colors duration-500" />
            </div>

            <div className="relative z-10 flex items-center justify-between">
              <div className="text-3xl font-bold text-white">05<span className="text-gradient-red">.</span></div>
              <span className="text-sm px-3.5 py-1 bg-[#ea4043]/15 text-[#ea4043] border border-[#ea4043]/30 font-bold tracking-wider backdrop-blur-md">
                {t.tariffs.card5.badge}
              </span>
            </div>

            <div className="relative z-10 my-6 space-y-3">
              <div className="text-3xl sm:text-4xl font-bold text-white tracking-tight">{t.tariffs.card5.price}</div>
              <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-white leading-snug">
                {t.tariffs.card5.title}
              </h3>
              <p className="text-sm sm:text-base text-[#a0a0a8] leading-relaxed">
                {t.tariffs.card5.desc}
              </p>
            </div>

            <div className="relative z-10 pt-4 border-t border-white/10 space-y-3">
              <div className="text-xs text-[#8e8e93] font-medium tracking-wider">
                {t.tariffs.card5.meta}
              </div>
              <button
                onClick={() => onOpenBooking("adm-raceway")}
                className="btn-card-swiss"
              >
                <span className="whitespace-nowrap">{t.tariffs.card5.btn}</span>
                <span>→</span>
              </button>
            </div>
          </motion.div>

          {/* Card 06: Own BMW M Car */}
          <motion.div
            variants={itemVariants}
            className="md:col-span-12 lg:col-span-4 p-8 sm:p-12 lg:p-14 flex flex-col justify-between min-h-[480px] bg-black relative overflow-hidden group cursor-pointer"
          >
            {/* Background Image: Deep dark idle -> Brighter on hover */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
              <Image
                src="/images/tariff-6-own-car.webp"
                alt=""
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                className="w-full h-full object-cover opacity-50 group-hover:opacity-75 group-hover:scale-105 transition-all duration-500 ease-out select-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30 group-hover:via-black/40 group-hover:to-black/10 transition-colors duration-500" />
            </div>

            <div className="relative z-10 flex items-center justify-between">
              <div className="text-3xl font-bold text-white">06<span className="text-gradient-red">.</span></div>
              <span className="text-sm px-3.5 py-1 bg-white/5 border border-white/10 text-white font-semibold tracking-wider backdrop-blur-md">
                {t.tariffs.card6.badge}
              </span>
            </div>

            <div className="relative z-10 my-6 space-y-3">
              <div className="text-3xl sm:text-4xl font-bold text-white tracking-tight">{t.tariffs.card6.price}</div>
              <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-white leading-snug">
                {t.tariffs.card6.title}
              </h3>
              <p className="text-sm sm:text-base text-[#a0a0a8] leading-relaxed">
                {t.tariffs.card6.desc}
              </p>
            </div>

            <div className="relative z-10 pt-4 border-t border-white/10">
              <button
                onClick={() => onOpenBooking("custom-car")}
                className="btn-card-swiss"
              >
                <span>{t.tariffs.card6.btn}</span>
                <span>→</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
