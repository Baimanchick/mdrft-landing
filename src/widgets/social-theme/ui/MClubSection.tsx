"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { useLanguage } from "@/shared/lib/i18n/LanguageContext";

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

export function MClubSection() {
  const { t } = useLanguage();

  return (
    <section id="club" className="relative w-full bg-black text-white border-b border-white/10 overflow-hidden font-sans">
      <div className="max-w-[1820px] mx-auto border-l border-r border-white/10">
        {/* Top Header Row with Tandem Drift Background Photo */}
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
              src="/images/teach.webp"
              alt=""
              fill
              sizes="100vw"
              style={{ opacity: 0.42 }}
              className="w-full h-full object-cover object-[center_50%] select-none scale-105"
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
              <span>(03)</span>
              <span className="text-gradient-red">.</span>
            </div>
            <div className="text-sm text-[#8e8e93] uppercase tracking-widest mt-12 font-medium">
              {t.club.category}
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="lg:col-span-9 p-8 sm:p-14 lg:p-20 flex flex-col justify-end relative z-10"
          >
            <div className="text-right">
              <span className="text-sm text-[#ea4043] tracking-widest uppercase mb-4 inline-block font-semibold">
                {t.club.subheading}
              </span>
              <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] xl:text-[6.5rem] font-bold uppercase tracking-tighter text-white leading-[1.05]">
                {t.club.titleMain}
                <br />
                <span className="text-[#3a3a42] hover:text-white transition-colors">{t.club.titleHighlight}</span>
                {t.club.titleSuffix}
              </h2>
            </div>
          </motion.div>
        </motion.div>

        {/* Asymmetrical Collage Row 1 (Span 8 + Span 4) */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.15, margin: "-50px" }}
          className="grid grid-cols-1 lg:grid-cols-12 border-b border-white/10"
        >
          {/* Card 01: Private Community (Span 7) */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-7 p-8 sm:p-14 lg:p-16 border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col justify-between min-h-[440px] bg-[#050508] hover:bg-white/[0.02] transition-colors group"
          >
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-white">01<span className="text-gradient-red">.</span></div>
            </div>

            <div className="my-8 space-y-4 max-w-xl">
              <h3 className="text-3xl sm:text-4xl font-bold uppercase tracking-tight text-white whitespace-normal xl:whitespace-nowrap">
                {t.club.c1Title}
              </h3>
              <p className="text-base sm:text-lg text-[#a0a0a8] leading-relaxed">
                {t.club.c1Desc}
              </p>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-sm text-[#8e8e93] font-medium tracking-wider">
              <span>{t.club.c1MetaLeft}</span>
              <span>{t.club.c1MetaRight}</span>
            </div>
          </motion.div>

          {/* Card 02: Hardware Advisory (Span 5) */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-5 p-8 sm:p-12 lg:p-14 flex flex-col justify-between min-h-[440px] bg-black hover:bg-white/[0.02] transition-colors group"
          >
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-white">02<span className="text-gradient-red">.</span></div>
            </div>

            <div className="my-8 space-y-4">
              <h3 className="text-3xl sm:text-4xl font-bold uppercase tracking-tight text-white whitespace-normal lg:whitespace-nowrap">
                {t.club.c2Title}
              </h3>
              <p className="text-base sm:text-lg text-[#a0a0a8] leading-relaxed">
                {t.club.c2Desc}
              </p>
            </div>

            <div className="pt-4 border-t border-white/10 text-sm text-[#8e8e93] font-medium tracking-wider">
              {t.club.c2Meta}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
