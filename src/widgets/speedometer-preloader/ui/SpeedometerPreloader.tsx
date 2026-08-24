"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useScrollLock } from "@/shared/ui/smooth-scroll";
import { clusterFont } from "../lib/cluster-font";
import { createClusterRenderer } from "../lib/cluster-renderer";

type SpeedometerPreloaderProps = {
  onComplete?: () => void;
};

const EXIT_EASE = [0.16, 1, 0.3, 1] as const;

export function SpeedometerPreloader({ onComplete }: SpeedometerPreloaderProps) {
  const [visible, setVisible] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const completeRef = useRef(onComplete);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    completeRef.current = onComplete;
  });

  useScrollLock(visible);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = hostRef.current;

    if (!canvas || !host) return;

    const renderer = createClusterRenderer({
      canvas,
      host,
      reducedMotion: prefersReducedMotion === true,
      onFinish: () => {
        setVisible(false);
        completeRef.current?.();
      },
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") renderer.finishNow();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      renderer.stop();
    };
  }, [prefersReducedMotion]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="speedometer-preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02, transition: { duration: 0.55, ease: EXIT_EASE } }}
          className={`speedometer-preloader-shell ${clusterFont.className} fixed inset-0 z-[100] overflow-hidden bg-black`}
        >
          <noscript>
            <style>{".speedometer-preloader-shell{display:none}"}</style>
          </noscript>
          <div ref={hostRef} className="relative h-full w-full">
            <canvas ref={canvasRef} aria-hidden="true" className="block h-full w-full" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
