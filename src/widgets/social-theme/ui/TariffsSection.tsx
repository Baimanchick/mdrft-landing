"use client";

import Image from "next/image";
import { motion } from "motion/react";
import type { BookingProgramId } from "@/entities/lead";
import { useLanguage } from "@/shared/lib/i18n/LanguageContext";

interface TariffsSectionProps {
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

function MetricRating({
  label,
  score,
  max = 5,
  icon,
  color,
}: {
  label: string;
  score: number;
  max?: number;
  icon: "star" | "fire";
  color: "blue" | "red";
}) {
  return (
    <div className="flex items-center justify-between py-2 px-3.5 rounded bg-white/[0.05] border border-white/10 backdrop-blur-md">
      <div className="flex items-center gap-2 font-medium text-white/90">
        {icon === "star" ? (
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="text-[#0099ff] drop-shadow-[0_0_8px_rgba(0,153,255,0.8)] shrink-0"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        ) : (
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="text-[#ea4043] drop-shadow-[0_0_8px_rgba(234,64,67,0.8)] shrink-0"
          >
            <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
          </svg>
        )}
        <span className="uppercase tracking-wider text-xs sm:text-[13px] font-bold font-mono text-[#e0e0e6]">
          {label}:
        </span>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex gap-1">
          {Array.from({ length: max }).map((_, i) => (
            <span
              key={i}
              className={`h-2 w-3 sm:w-3.5 rounded-xs transition-all ${
                i < score
                  ? color === "red"
                    ? "bg-[#ea4043] shadow-[0_0_8px_rgba(234,64,67,0.7)]"
                    : "bg-[#0099ff] shadow-[0_0_8px_rgba(0,153,255,0.7)]"
                  : "bg-white/15"
              }`}
            />
          ))}
        </div>
        <span className="font-mono font-bold text-white text-xs sm:text-sm min-w-[26px] text-right">
          {score}/{max}
        </span>
      </div>
    </div>
  );
}

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
          className="grid min-h-[430px] grid-cols-1 lg:min-h-[600px] lg:grid-cols-12 border-b border-white/10 relative overflow-hidden bg-black"
        >
          {/* Background Photo in top half of block */}
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            <Image
              src="/images/tariffs-instructor-m2.webp"
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
              <span>(04)</span>
              <span className="text-gradient-red">.</span>
            </div>
            <div className="text-xs sm:text-sm text-[#b5b5bd] lg:text-[#8e8e93] uppercase tracking-widest mt-6 sm:mt-10 lg:mt-12 font-medium">
              {t.tariffs.category}
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="lg:col-span-9 p-5 sm:p-10 lg:p-20 flex flex-col justify-end relative z-10"
          >
            <div className="space-y-2">
              <span className="text-sm text-[#ea4043] tracking-widest uppercase block font-semibold">
                {t.tariffs.subheading}
              </span>
              <h2 className="text-[clamp(2.25rem,11vw,4.5rem)] sm:text-6xl md:text-7xl lg:text-[5.5rem] xl:text-[6.5rem] font-bold uppercase tracking-tighter text-white leading-[1.05] break-words">
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
            className="md:col-span-6 lg:col-span-4 p-5 sm:p-10 lg:p-14 border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col justify-between min-h-[460px] sm:min-h-[500px] lg:min-h-[520px] bg-black relative overflow-hidden group cursor-pointer"
          >
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
              <Image
                src="/images/tariff-1-first-touch.webp"
                alt=""
                fill
                sizes="(min-width: 1820px) 607px, (min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                className="w-full h-full object-cover opacity-50 group-hover:opacity-75 group-hover:scale-105 transition-all duration-500 ease-out select-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30 group-hover:via-black/40 group-hover:to-black/10 transition-colors duration-500" />
            </div>

            <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
              <div className="text-3xl font-bold text-white">01<span className="text-gradient-red">.</span></div>
              <span className="text-xs sm:text-sm px-3.5 py-1 bg-white/5 border border-white/10 text-[#a0a0a8] font-semibold tracking-wider backdrop-blur-md">
                {t.tariffs.card1.badge}
              </span>
            </div>

            <div className="relative z-10 my-5 space-y-3">
              <div className="text-3xl sm:text-4xl font-bold text-white tracking-tight">{t.tariffs.card1.price}</div>
              <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-white leading-snug">
                {t.tariffs.card1.title}
              </h3>
              <p className="text-sm text-[#a0a0a8] leading-relaxed">
                {t.tariffs.card1.desc}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1.5">
                <MetricRating label={t.tariffs.skillLabel} score={t.tariffs.card1.skillScore} icon="star" color="blue" />
                <MetricRating label={t.tariffs.emotionLabel} score={t.tariffs.card1.emotionScore} icon="fire" color="red" />
              </div>
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
            className="md:col-span-6 lg:col-span-4 p-5 sm:p-10 lg:p-14 border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col justify-between min-h-[460px] sm:min-h-[500px] lg:min-h-[520px] bg-[#050508] relative overflow-hidden group cursor-pointer"
          >
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
              <Image
                src="/images/tariff-2-asphalt-start.webp"
                alt=""
                fill
                sizes="(min-width: 1820px) 607px, (min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                className="w-full h-full object-cover opacity-50 group-hover:opacity-75 group-hover:scale-105 transition-all duration-500 ease-out select-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30 group-hover:via-black/40 group-hover:to-black/10 transition-colors duration-500" />
            </div>

            <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
              <div className="text-3xl font-bold text-white">02<span className="text-gradient-red">.</span></div>
              <span className="text-xs sm:text-sm px-3.5 py-1 bg-white/5 border border-white/10 text-[#a0a0a8] font-semibold tracking-wider backdrop-blur-md">
                {t.tariffs.card2.badge}
              </span>
            </div>

            <div className="relative z-10 my-5 space-y-3">
              <div className="text-3xl sm:text-4xl font-bold text-white tracking-tight">{t.tariffs.card2.price}</div>
              <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-white leading-snug">
                {t.tariffs.card2.title}
              </h3>
              <p className="text-sm text-[#a0a0a8] leading-relaxed">
                {t.tariffs.card2.desc}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1.5">
                <MetricRating label={t.tariffs.skillLabel} score={t.tariffs.card2.skillScore} icon="star" color="blue" />
                <MetricRating label={t.tariffs.emotionLabel} score={t.tariffs.card2.emotionScore} icon="fire" color="red" />
              </div>
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
            className="md:col-span-12 lg:col-span-4 p-5 sm:p-10 lg:p-14 flex flex-col justify-between min-h-[460px] sm:min-h-[500px] lg:min-h-[520px] bg-[#07070a] relative overflow-hidden group cursor-pointer"
          >
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
              <Image
                src="/images/tariff-3-pro-progress.webp"
                alt=""
                fill
                sizes="(min-width: 1820px) 607px, (min-width: 1024px) 33vw, 100vw"
                className="w-full h-full object-cover opacity-50 group-hover:opacity-75 group-hover:scale-105 transition-all duration-500 ease-out select-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30 group-hover:via-black/40 group-hover:to-black/10 transition-colors duration-500" />
            </div>

            <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
              <div className="text-3xl font-bold text-white">03<span className="text-gradient-red">.</span></div>
              <span className="text-xs sm:text-sm px-3 py-1 bg-[#ea4043] text-white font-bold tracking-wider rounded-sm shadow-[0_0_15px_rgba(234,64,67,0.4)]">
                {t.tariffs.card3.badge}
              </span>
            </div>

            <div className="relative z-10 my-5 space-y-3">
              <div className="text-3xl sm:text-4xl font-bold text-white tracking-tight">{t.tariffs.card3.price}</div>
              <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-white leading-snug">
                {t.tariffs.card3.title}
              </h3>
              <p className="text-sm text-[#a0a0a8] leading-relaxed">
                {t.tariffs.card3.desc}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1.5">
                <MetricRating label={t.tariffs.skillLabel} score={t.tariffs.card3.skillScore} icon="star" color="blue" />
                <MetricRating label={t.tariffs.emotionLabel} score={t.tariffs.card3.emotionScore} icon="fire" color="red" />
              </div>
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
          {/* Card 04: Mastery / Max Control */}
          <motion.div
            variants={itemVariants}
            className="md:col-span-6 lg:col-span-4 p-5 sm:p-10 lg:p-14 border-b md:border-b-0 md:border-r border-white/10 flex flex-col justify-between min-h-[460px] sm:min-h-[500px] lg:min-h-[520px] bg-black relative overflow-hidden group cursor-pointer"
          >
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
              <Image
                src="/images/tariff-4-mastery-control.webp"
                alt=""
                fill
                sizes="(min-width: 1820px) 607px, (min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                className="w-full h-full object-cover opacity-50 group-hover:opacity-75 group-hover:scale-105 transition-all duration-500 ease-out select-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30 group-hover:via-black/40 group-hover:to-black/10 transition-colors duration-500" />
            </div>

            <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
              <div className="text-3xl font-bold text-white">04<span className="text-gradient-red">.</span></div>
              <span className="text-xs sm:text-sm px-3.5 py-1 bg-white/5 border border-white/10 text-[#a0a0a8] font-semibold tracking-wider backdrop-blur-md">
                {t.tariffs.card4.badge}
              </span>
            </div>

            <div className="relative z-10 my-5 space-y-3">
              <div className="text-3xl sm:text-4xl font-bold text-white tracking-tight">{t.tariffs.card4.price}</div>
              <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-white leading-snug">
                {t.tariffs.card4.title}
              </h3>
              <p className="text-sm text-[#a0a0a8] leading-relaxed">
                {t.tariffs.card4.desc}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1.5">
                <MetricRating label={t.tariffs.skillLabel} score={t.tariffs.card4.skillScore} icon="star" color="blue" />
                <MetricRating label={t.tariffs.emotionLabel} score={t.tariffs.card4.emotionScore} icon="fire" color="red" />
              </div>
            </div>

            <div className="relative z-10 pt-4 border-t border-white/10">
              <button
                onClick={() => onOpenBooking("mastery-control")}
                className="btn-card-swiss"
              >
                <span className="text-left">{t.tariffs.card4.btn}</span>
                <span>→</span>
              </button>
            </div>
          </motion.div>

          {/* Card 05: ADM Race Track Experience */}
          <motion.div
            variants={itemVariants}
            className="md:col-span-6 lg:col-span-4 p-5 sm:p-10 lg:p-14 border-b md:border-b-0 lg:border-r border-white/10 flex flex-col justify-between min-h-[460px] sm:min-h-[500px] lg:min-h-[520px] bg-[#07070a] relative overflow-hidden group cursor-pointer"
          >
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
              <Image
                src="/images/tariff-5-adm-raceway.webp"
                alt=""
                fill
                sizes="(min-width: 1820px) 607px, (min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                className="w-full h-full object-cover opacity-50 group-hover:opacity-75 group-hover:scale-105 transition-all duration-500 ease-out select-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30 group-hover:via-black/40 group-hover:to-black/10 transition-colors duration-500" />
            </div>

            <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
              <div className="text-3xl font-bold text-white">05<span className="text-gradient-red">.</span></div>
              <span className="text-xs sm:text-sm px-3.5 py-1 bg-[#ea4043]/15 text-[#ea4043] border border-[#ea4043]/30 font-bold tracking-wider backdrop-blur-md">
                {t.tariffs.card5.badge}
              </span>
            </div>

            <div className="relative z-10 my-5 space-y-3">
              <div className="text-3xl sm:text-4xl font-bold text-white tracking-tight">{t.tariffs.card5.price}</div>
              <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-white leading-snug">
                {t.tariffs.card5.title}
              </h3>
              <p className="text-sm text-[#a0a0a8] leading-relaxed">
                {t.tariffs.card5.desc}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1.5">
                <MetricRating label={t.tariffs.skillLabel} score={t.tariffs.card5.skillScore} icon="star" color="blue" />
                <MetricRating label={t.tariffs.emotionLabel} score={t.tariffs.card5.emotionScore} icon="fire" color="red" />
              </div>
            </div>

            <div className="relative z-10 pt-4 border-t border-white/10">
              <button
                onClick={() => onOpenBooking("adm-track")}
                className="btn-card-swiss"
              >
                <span className="text-left">{t.tariffs.card5.btn}</span>
                <span>→</span>
              </button>
            </div>
          </motion.div>

          {/* Card 06: Own BMW M Car */}
          <motion.div
            variants={itemVariants}
            className="md:col-span-12 lg:col-span-4 p-5 sm:p-10 lg:p-14 flex flex-col justify-between min-h-[460px] sm:min-h-[500px] lg:min-h-[520px] bg-black relative overflow-hidden group cursor-pointer"
          >
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
              <Image
                src="/images/tariff-6-own-car.webp"
                alt=""
                fill
                sizes="(min-width: 1820px) 607px, (min-width: 1024px) 33vw, 100vw"
                className="w-full h-full object-cover opacity-50 group-hover:opacity-75 group-hover:scale-105 transition-all duration-500 ease-out select-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30 group-hover:via-black/40 group-hover:to-black/10 transition-colors duration-500" />
            </div>

            <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
              <div className="text-3xl font-bold text-white">06<span className="text-gradient-red">.</span></div>
              <span className="text-xs sm:text-sm px-3.5 py-1 bg-white/5 border border-white/10 text-white font-semibold tracking-wider backdrop-blur-md">
                {t.tariffs.card6.badge}
              </span>
            </div>

            <div className="relative z-10 my-5 space-y-3">
              <div className="text-3xl sm:text-4xl font-bold text-white tracking-tight">{t.tariffs.card6.price}</div>
              <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-white leading-snug">
                {t.tariffs.card6.title}
              </h3>
              <p className="text-sm text-[#a0a0a8] leading-relaxed">
                {t.tariffs.card6.desc}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1.5">
                <MetricRating label={t.tariffs.skillLabel} score={t.tariffs.card6.skillScore} icon="star" color="blue" />
                <MetricRating label={t.tariffs.emotionLabel} score={t.tariffs.card6.emotionScore} icon="fire" color="red" />
              </div>
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
