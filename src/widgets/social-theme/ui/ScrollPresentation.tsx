"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, MotionValue } from "motion/react";
import { Header } from "./Header";
import { HeroSection } from "./HeroSection";
import { AboutSection } from "./AboutSection";
import { ServicesSection } from "./ServicesSection";
import { MClubSection } from "./MClubSection";
import { ManifestoSection } from "./ManifestoSection";
import { TariffsSection } from "./TariffsSection";
import { Footer } from "./Footer";
import { BookingModal } from "./BookingModal";

interface StageWrapperProps {
  progress: MotionValue<number>;
  range: [number, number, number]; // [enterStart, peak, exitEnd]
  children: React.ReactNode;
  isFirst?: boolean;
  isLast?: boolean;
}

function StageSlide({ progress, range, children, isFirst, isLast }: StageWrapperProps) {
  const [start, peak, end] = range;

  // Entrance & Exit opacity
  const opacity = useTransform(
    progress,
    isFirst
      ? [0, peak, end]
      : isLast
      ? [start, peak, 1]
      : [start, peak, (peak + end) / 2, end],
    isFirst ? [1, 1, 0] : isLast ? [0, 1, 1] : [0, 1, 1, 0]
  );

  // Entrance & Exit blur
  const blurValue = useTransform(
    progress,
    isFirst
      ? [0, peak, end]
      : isLast
      ? [start, peak, 1]
      : [start, peak, (peak + end) / 2, end],
    isFirst ? [0, 0, 24] : isLast ? [24, 0, 0] : [24, 0, 0, 24]
  );

  const filter = useTransform(blurValue, (v) => `blur(${v}px)`);

  // Subtle vertical float
  const y = useTransform(
    progress,
    isFirst
      ? [0, peak, end]
      : isLast
      ? [start, peak, 1]
      : [start, peak, (peak + end) / 2, end],
    isFirst ? [0, 0, -40] : isLast ? [40, 0, 0] : [50, 0, 0, -50]
  );

  // Subtle scale
  const scale = useTransform(
    progress,
    isFirst
      ? [0, peak, end]
      : isLast
      ? [start, peak, 1]
      : [start, peak, (peak + end) / 2, end],
    isFirst ? [1, 1, 0.96] : isLast ? [0.96, 1, 1] : [0.96, 1, 1, 0.96]
  );

  // Pointer events: only active slide is clickable
  const pointerEvents = useTransform(
    progress,
    (v) => (v >= start && v <= end ? "auto" : "none")
  );

  return (
    <motion.div
      style={{
        opacity,
        filter,
        y,
        scale,
        pointerEvents: pointerEvents as any,
      }}
      className="absolute inset-0 w-full h-full flex flex-col justify-center overflow-y-auto overflow-x-hidden py-16"
    >
      {children}
    </motion.div>
  );
}

export function ScrollPresentation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedTariffId, setSelectedTariffId] = useState<string | undefined>(undefined);
  const [activeStageIndex, setActiveStageIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Track active stage index for pagination dots
  useEffect(() => {
    return scrollYProgress.on("change", (latest) => {
      const idx = Math.min(5, Math.floor(latest * 6));
      setActiveStageIndex(idx);
    });
  }, [scrollYProgress]);

  const handleOpenBooking = (tariffId?: string) => {
    setSelectedTariffId(tariffId);
    setIsBookingOpen(true);
  };

  const handleCloseBooking = () => {
    setIsBookingOpen(false);
    setSelectedTariffId(undefined);
  };

  // 6 Stages ranges in [0, 1]
  // 0: Hero (0.00 -> 0.16)
  // 1: About (0.16 -> 0.33)
  // 2: Services / Why Us (0.33 -> 0.50)
  // 3: M-Club (0.50 -> 0.66)
  // 4: Manifesto (0.66 -> 0.83)
  // 5: Tariffs & Footer (0.83 -> 1.00)

  return (
    <div ref={containerRef} className="relative h-[650vh] bg-black text-white">
      {/* Sticky Fullscreen Presentation Deck */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between">
        {/* Persistent Header */}
        <Header onOpenBooking={() => handleOpenBooking("pro-progress")} />

        {/* Stage Slides Viewport */}
        <div className="relative flex-1 w-full h-full">
          {/* STAGE 0: HERO */}
          <StageSlide
            progress={scrollYProgress}
            range={[0, 0.08, 0.18]}
            isFirst
          >
            <HeroSection onOpenBooking={() => handleOpenBooking("pro-progress")} />
          </StageSlide>

          {/* STAGE 1: ABOUT */}
          <StageSlide
            progress={scrollYProgress}
            range={[0.16, 0.26, 0.36]}
          >
            <AboutSection />
          </StageSlide>

          {/* STAGE 2: WHY US / SERVICES */}
          <StageSlide
            progress={scrollYProgress}
            range={[0.34, 0.44, 0.54]}
          >
            <ServicesSection onOpenBooking={() => handleOpenBooking("pro-progress")} />
          </StageSlide>

          {/* STAGE 3: M-CLUB ECOSYSTEM */}
          <StageSlide
            progress={scrollYProgress}
            range={[0.52, 0.62, 0.72]}
          >
            <MClubSection onOpenBooking={() => handleOpenBooking("m-owner-elite")} />
          </StageSlide>

          {/* STAGE 4: MANIFESTO */}
          <StageSlide
            progress={scrollYProgress}
            range={[0.70, 0.79, 0.88]}
          >
            <ManifestoSection onOpenBooking={() => handleOpenBooking("pro-progress")} />
          </StageSlide>

          {/* STAGE 5: TARIFFS & FOOTER */}
          <StageSlide
            progress={scrollYProgress}
            range={[0.86, 0.95, 1]}
            isLast
          >
            <div className="space-y-12">
              <TariffsSection onOpenBooking={handleOpenBooking} />
              <Footer />
            </div>
          </StageSlide>
        </div>

        {/* Floating Side Stage Pagination Dots */}
        <div className="fixed right-6 sm:right-10 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-3 pointer-events-none">
          {["01", "02", "03", "04", "05", "06"].map((label, i) => (
            <div key={i} className="flex items-center gap-3">
              <span
                className={`text-[10px] tracking-widest font-mono transition-opacity duration-300 ${
                  activeStageIndex === i ? "opacity-100 text-white font-bold" : "opacity-0 text-[#8e8e93]"
                }`}
              >
                {label}
              </span>
              <div
                className={`w-1.5 rounded-full transition-all duration-300 ${
                  activeStageIndex === i
                    ? "h-6 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                    : "h-1.5 bg-white/20"
                }`}
              />
            </div>
          ))}
        </div>

        {/* Floating Bottom Scroll Hint */}
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 pointer-events-none text-center">
          <div className="text-[11px] text-[#8e8e93] tracking-widest uppercase flex items-center gap-2">
            <span>SCROLL TO EXPLORE</span>
            <span className="inline-block animate-bounce">↓</span>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={handleCloseBooking}
        initialTariffId={selectedTariffId}
      />
    </div>
  );
}
