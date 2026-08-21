"use client";

import React from "react";
import { motion, type Variants } from "motion/react";

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  yOffset?: number;
  className?: string;
  blur?: boolean;
}

export const LUXURY_EASE = [0.16, 1, 0.3, 1] as const;

export function MotionReveal({
  children,
  delay = 0,
  duration = 0.85,
  yOffset = 36,
  className = "",
  blur = true,
}: RevealProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: yOffset,
        filter: blur ? "blur(14px)" : "blur(0px)",
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
      }}
      viewport={{ once: false, margin: "-8%" }}
      transition={{
        duration,
        delay,
        ease: LUXURY_EASE,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerContainer({
  children,
  className = "",
  staggerDelay = 0.12,
}: {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}) {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.05,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, margin: "-8%" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className = "",
  yOffset = 30,
}: {
  children: React.ReactNode;
  className?: string;
  yOffset?: number;
}) {
  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      y: yOffset,
      filter: "blur(12px)",
      scale: 0.98,
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      scale: 1,
      transition: {
        duration: 0.8,
        ease: LUXURY_EASE,
      },
    },
  };

  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  );
}

export function TextLineReveal({
  text,
  className = "",
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div
        initial={{ y: "110%", opacity: 0, filter: "blur(10px)" }}
        whileInView={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
        viewport={{ once: false, margin: "-5%" }}
        transition={{ duration: 0.9, delay, ease: LUXURY_EASE }}
      >
        {text}
      </motion.div>
    </div>
  );
}
