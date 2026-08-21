"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { FloatingGlassPrism } from "@/shared/ui/canvas/FloatingGlassPrism";
import { MotionReveal, TextLineReveal } from "@/shared/ui/reveal/MotionReveal";

interface ManifestoSectionProps {
  onOpenBooking: () => void;
}

export function ManifestoSection({ onOpenBooking }: ManifestoSectionProps) {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const prismY = useTransform(scrollYProgress, [0, 1], [-100, 100]);
  const prismScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.85, 1.1, 0.85]);

  return (
    <section
      ref={containerRef}
      id="manifesto"
      className="py-56 px-6 sm:px-12 lg:px-16 xl:px-20 max-w-[1820px] mx-auto relative flex flex-col items-center justify-center text-center overflow-hidden"
    >
      {/* 3D Glass Floating Prism with Scroll Parallax directly in the center */}
      <motion.div
        style={{ y: prismY, scale: prismScale }}
        className="absolute w-[540px] h-[540px] sm:w-[700px] sm:h-[700px] lg:w-[850px] lg:h-[850px] opacity-75 pointer-events-none z-0"
      >
        <FloatingGlassPrism size="lg" className="w-full h-full" />
      </motion.div>

      <div className="relative z-10 space-y-12 max-w-6xl">
        <div className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[6.5rem] 2xl:text-[7.5rem] font-medium tracking-tight text-white uppercase leading-[0.98]">
          <TextLineReveal text="«ДРИФТ НА УЛИЦАХ" delay={0.1} />
          <TextLineReveal text="НАУЧИЛ НАС:" delay={0.22} />
          <TextLineReveal text="МАШИНА НЕ ПРОЩАЕТ СУЕТЫ»" delay={0.34} />
        </div>

        <MotionReveal delay={0.45} yOffset={24} blur>
          <p className="text-base sm:text-xl lg:text-2xl text-[#8e8e93] leading-relaxed max-w-3xl mx-auto font-light">
            Чтобы уверенно двигаться на грани, нужно перестать бороться с автомобилем и научиться его слушать. Мы открываем M-серию с той стороны, которую не покажут в обычных автошколах.
          </p>
        </MotionReveal>

        <MotionReveal delay={0.55} yOffset={20} blur>
          <div className="pt-6">
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              onClick={onOpenBooking}
              className="btn-pill-white text-sm sm:text-base py-4 px-10 shadow-[0_15px_45px_rgba(255,255,255,0.2)] font-medium"
            >
              <span>Записаться на тренировку</span>
              <span className="btn-circle-icon text-sm w-7 h-7">+</span>
            </motion.button>
          </div>
        </MotionReveal>
      </div>
    </section>
  );
}
