"use client";

import React, { useState, useEffect, useId, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useScrollLock } from "@/shared/ui/smooth-scroll";

interface SpeedometerPreloaderProps {
  onComplete?: () => void;
}

// Apple / Automotive signature fluid deceleration curve
const appleEase = [0.16, 1, 0.3, 1] as const;

export function SpeedometerPreloader({ onComplete }: SpeedometerPreloaderProps) {
  const [visible, setVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const [speed, setSpeed] = useState(0);
  const [rpm, setRpm] = useState(0);
  const [currentTime, setCurrentTime] = useState("4:12 PM");
  const [odometerVal, setOdometerVal] = useState(870);
  const [tripVal, setTripVal] = useState(21.6);

  // Ignition stage sequence states for sequential startup lighting
  const [ignitionStage, setIgnitionStage] = useState(0);

  const filterId = useId().replace(/:/g, "_");

  const exitFadeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useScrollLock(visible);

  useEffect(() => {
    // Real time formatted as H:MM AM/PM
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      hours = hours ? hours : 12;
      setCurrentTime(`${hours}:${minutes} ${ampm}`);
    };
    updateTime();

    if (typeof document !== "undefined") {
      document.body.style.overflow = "hidden";
    }

    const startTime = Date.now();
    const duration = 4400; // 4.4 seconds total sequence

    let animFrame: number;

    const updateDashboard = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // --- 1. SEQUENTIAL IGNITION STAGES (загораются по очереди) ---
      // Stage 1: (0.0s - 0.5s) Centers, M5 Badge & Driving Modes power on
      // Stage 2: (0.4s - 0.9s) Main dial scale rings & tick marks ignite
      // Stage 3: (0.8s - 1.3s) Needles ignite in brilliant neon red
      // Stage 4: (1.1s - 1.6s) Side mini gauges (Fuel & Oil Temp) light up
      // Stage 5: (1.4s+) Road visual & bottom telemetry bar light up
      if (progress < 0.08) {
        setIgnitionStage(1);
      } else if (progress < 0.18) {
        setIgnitionStage(2);
      } else if (progress < 0.28) {
        setIgnitionStage(3);
      } else if (progress < 0.38) {
        setIgnitionStage(4);
      } else {
        setIgnitionStage(5);
      }

      // --- 2. SPEEDOMETER (С ЛОГИКОЙ ПЕРЕКЛЮЧЕНИЙ И ПАДЕНИЙ ДО 90 КМ/Ч) ---
      let currentSpeed = 0;

      if (progress < 0.20) {
        currentSpeed = 0;
      } else if (progress < 0.35) {
        // 1: 0 -> 20 km/h
        const p = (progress - 0.20) / 0.15;
        currentSpeed = 0 + p * 20;
      } else if (progress < 0.40) {
        // Спад 1: 20 -> 16 km/h
        const p = (progress - 0.35) / 0.05;
        currentSpeed = 20 - p * 4;
      } else if (progress < 0.55) {
        // 2: 16 -> 38 km/h
        const p = (progress - 0.40) / 0.15;
        currentSpeed = 16 + p * 22;
      } else if (progress < 0.60) {
        // Спад 2: 38 -> 32 km/h
        const p = (progress - 0.55) / 0.05;
        currentSpeed = 38 - p * 6;
      } else if (progress < 0.74) {
        // 3: 32 -> 62 km/h
        const p = (progress - 0.60) / 0.14;
        currentSpeed = 32 + p * 30;
      } else if (progress < 0.79) {
        // Спад 3: 62 -> 56 km/h
        const p = (progress - 0.74) / 0.05;
        currentSpeed = 62 - p * 6;
      } else if (progress < 0.92) {
        // 4: 56 -> 90 km/h
        const p = (progress - 0.79) / 0.13;
        currentSpeed = 56 + p * 34;
      } else {
        currentSpeed = 90;
      }

      // --- 3. ПРАВЫЙ ТАХОМЕТР (СРАЗУ ДОХОДИТ ПЛАВНОЙ СТРЕЛКОЙ ДО МАКСИМУМА 8.0 БЕЗ ОТРЫВКОВ) ---
      let currentRpm = 0.8;
      if (progress < 0.12) {
        currentRpm = 0.8;
      } else {
        const p = (progress - 0.12) / 0.88;
        // Непрерывный, плавный подъем стрелки прямо до 8.0 без падений и рывков
        currentRpm = 0.8 + Math.pow(p, 1.15) * 7.2;
      }

      currentSpeed = Math.min(90, Math.max(0, currentSpeed));
      currentRpm = Math.min(8.0, Math.max(0, currentRpm));

      setSpeed(currentSpeed);
      setRpm(currentRpm);
      setOdometerVal(870 + Math.floor(currentSpeed * 0.05));
      setTripVal(Number((21.6 + currentSpeed * 0.015).toFixed(1)));

      if (progress < 1) {
        animFrame = requestAnimationFrame(updateDashboard);
      }
    };

    animFrame = requestAnimationFrame(updateDashboard);

    const exitTimer = setTimeout(() => {
      triggerSequentialExit();
    }, 4900);

    return () => {
      cancelAnimationFrame(animFrame);
      clearTimeout(exitTimer);
      if (exitFadeTimerRef.current) clearTimeout(exitFadeTimerRef.current);
    };
  }, []);

  const triggerSequentialExit = () => {
    setIsExiting(true);
    exitFadeTimerRef.current = setTimeout(() => {
      setVisible(false);
      if (onComplete) onComplete();
    }, 800);
  };

  // Speedometer Needle Angular mapping (0 to 330 km/h) -> (-135° to +135°)
  const speedNeedleAngle = -135 + (speed / 330) * 270;

  // RPM Needle Angular mapping (0 to 8 x 1000) -> (-135° to +135°)
  const rpmNeedleAngle = -135 + (rpm / 8) * 270;

  // Speedometer Major Numbers & Ticks (0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330)
  const speedLabels = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];
  const speedTicks = [];
  for (let s = 0; s <= 330; s += 5) {
    const angle = -135 + (s / 330) * 270;
    const isMajor = s % 30 === 0;
    const isSemi = s % 10 === 0;
    const isActive = s <= speed;
    speedTicks.push({ speed: s, angle, isMajor, isSemi, isActive });
  }

  // Tachometer Major Numbers & Ticks (0 to 8)
  const rpmLabels = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  const rpmTicks = [];
  for (let r = 0; r <= 8; r += 0.2) {
    const angle = -135 + (r / 8) * 270;
    const isMajor = Math.abs(r - Math.round(r)) < 0.05;
    const isSemi = Math.abs((r * 10) % 5) < 0.05;
    const isRedline = r >= 7.0;
    const isYellow = r >= 6.3 && r < 7.0;
    const isActive = r <= rpm;
    rpmTicks.push({ rpm: r, angle, isMajor, isSemi, isRedline, isYellow, isActive });
  }

  const odoStr = String(odometerVal).padStart(5, "0");
  const tripStr = tripVal.toFixed(1).padStart(6, "0");

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="bmw-m5-speedometer-preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6 } }}
          className="fixed inset-0 z-[9999] bg-[#000000] text-white flex items-center justify-center select-none overflow-hidden font-sans p-2 sm:p-6 cursor-default"
        >
          {/* BMW M5 DIGITAL CLUSTER */}
          <div className="relative w-full max-w-[1380px] flex items-center justify-center my-auto px-1 sm:px-2">
            <motion.div
              initial={{ scale: 0.97, opacity: 0, filter: "blur(10px)" }}
              animate={
                isExiting
                  ? { scale: 1.04, opacity: 0, filter: "blur(14px)" }
                  : { scale: 1, opacity: 1, filter: "blur(0px)" }
              }
              transition={{
                duration: isExiting ? 0.65 : 0.8,
                ease: appleEase,
              }}
              className="relative w-full aspect-[1340/520] max-h-[86vh]"
            >
              <svg
                viewBox="0 0 1340 520"
                className="w-full h-full"
                style={{ shapeRendering: "geometricPrecision" }}
              >
                <defs>
                  {/* Metallic Satin-Chrome Bezel 3D Gradient */}
                  <linearGradient id={`mSatinChrome_${filterId}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#e2e8f0" />
                    <stop offset="20%" stopColor="#64748b" />
                    <stop offset="45%" stopColor="#f8fafc" />
                    <stop offset="70%" stopColor="#1e293b" />
                    <stop offset="90%" stopColor="#cbd5e1" />
                    <stop offset="100%" stopColor="#475569" />
                  </linearGradient>

                  {/* Chrome Crescent Bezel Gradient for Left Gauge */}
                  <linearGradient id={`mLeftCrescent_${filterId}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="35%" stopColor="#94a3b8" />
                    <stop offset="70%" stopColor="#cbd5e1" />
                    <stop offset="100%" stopColor="#475569" />
                  </linearGradient>

                  {/* Chrome Crescent Bezel Gradient for Right Gauge */}
                  <linearGradient id={`mRightCrescent_${filterId}`} x1="100%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="35%" stopColor="#94a3b8" />
                    <stop offset="70%" stopColor="#cbd5e1" />
                    <stop offset="100%" stopColor="#475569" />
                  </linearGradient>

                  {/* Silver Inner Horseshoe Ring Gradient */}
                  <linearGradient id={`mSilverRing_${filterId}`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#dce1ec" />
                    <stop offset="50%" stopColor="#5a5e69" />
                    <stop offset="100%" stopColor="#aab0be" />
                  </linearGradient>

                  {/* Dark Dial Face Gradient */}
                  <radialGradient id={`mDialBg_${filterId}`} cx="50%" cy="45%" r="55%">
                    <stop offset="0%" stopColor="#0a0c12" />
                    <stop offset="70%" stopColor="#040508" />
                    <stop offset="100%" stopColor="#010203" />
                  </radialGradient>

                  {/* Red Illuminated Pointer Filter */}
                  <filter id={`bmwNeedleGlow_${filterId}`} x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="0" dy="0" stdDeviation="3.5" floodColor="#ff1e28" floodOpacity="0.95" />
                    <feDropShadow dx="0" dy="0" stdDeviation="1.5" floodColor="#ffffff" floodOpacity="0.9" />
                  </filter>

                  {/* Red Arc Luminous Glow */}
                  <filter id={`redArcGlow_${filterId}`} x="-30%" y="-30%" width="160%" height="160%">
                    <feDropShadow dx="0" dy="0" stdDeviation="3.5" floodColor="#ff1e28" floodOpacity="0.9" />
                  </filter>

                  {/* Blue Cold Arc Filter */}
                  <filter id={`blueColdGlow_${filterId}`} x="-30%" y="-30%" width="160%" height="160%">
                    <feDropShadow dx="0" dy="0" stdDeviation="3.5" floodColor="#38bdf8" floodOpacity="0.9" />
                  </filter>

                  {/* Road Shading Gradient */}
                  <linearGradient id={`roadPerspectiveGrad_${filterId}`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#101520" stopOpacity="0" />
                    <stop offset="35%" stopColor="#182336" stopOpacity="0.5" />
                    <stop offset="85%" stopColor="#0c111c" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#030508" stopOpacity="1" />
                  </linearGradient>
                </defs>

                {/* ====================================================
                    1. TOP CENTER DRIVING MODES (Ignition Stage 1+)
                    ==================================================== */}
                <g
                  transform="translate(670, 72)"
                  style={{
                    opacity: ignitionStage >= 1 ? 1 : 0,
                    transition: "opacity 0.6s ease-out",
                  }}
                >
                  {/* Mode 1: Efficient */}
                  <g transform="translate(-135, 0)">
                    <text x="0" y="0" fill="#ced3dc" fontSize="12" fontFamily="'Arial', sans-serif" fontWeight="bold" textAnchor="middle">
                      Efficient
                    </text>
                    <path d="M -9 16 A 9 9 0 0 1 9 16" fill="none" stroke="#ced3dc" strokeWidth="1.5" />
                    <line x1="0" y1="16" x2="-4" y2="10" stroke="#ced3dc" strokeWidth="1.5" />
                  </g>

                  {/* Mode 2: Comfort (Suspension Damper) */}
                  <g transform="translate(0, 0)">
                    <text x="0" y="0" fill="#ced3dc" fontSize="12" fontFamily="'Arial', sans-serif" fontWeight="bold" textAnchor="middle">
                      Comfort
                    </text>
                    <line x1="-7" y1="19" x2="7" y2="9" stroke="#ced3dc" strokeWidth="2.2" strokeLinecap="round" />
                    <circle cx="-6" cy="18" r="1.6" fill="#ced3dc" />
                    <circle cx="6" cy="10" r="1.6" fill="#ced3dc" />
                  </g>

                  {/* Mode 3: Comfort (Steering Wheel) */}
                  <g transform="translate(135, 0)">
                    <text x="0" y="0" fill="#ced3dc" fontSize="12" fontFamily="'Arial', sans-serif" fontWeight="bold" textAnchor="middle">
                      Comfort
                    </text>
                    <circle cx="0" cy="14.5" r="8" fill="none" stroke="#ced3dc" strokeWidth="1.5" />
                    <circle cx="0" cy="14.5" r="2.5" fill="#ced3dc" />
                    <line x1="-8" y1="14.5" x2="-2.5" y2="14.5" stroke="#ced3dc" strokeWidth="1.2" />
                    <line x1="2.5" y1="14.5" x2="8" y2="14.5" stroke="#ced3dc" strokeWidth="1.2" />
                    <line x1="0" y1="17" x2="0" y2="22.5" stroke="#ced3dc" strokeWidth="1.2" />
                  </g>

                  {/* 2WD Drift Mode Status */}
                  <text
                    x="0"
                    y="50"
                    fill="#ffffff"
                    fontSize="14"
                    fontFamily="'Arial Black', sans-serif"
                    fontWeight="900"
                    letterSpacing="1px"
                    textAnchor="middle"
                  >
                    2WD
                  </text>
                </g>

                {/* ====================================================
                    2. CENTRAL ROAD / RUNWAY (Ignition Stage 5)
                    ==================================================== */}
                <g
                  transform="translate(670, 260)"
                  style={{
                    opacity: ignitionStage >= 5 ? 1 : 0,
                    transition: "opacity 0.8s ease-out",
                  }}
                >
                  <path
                    d="M -185 155 L -58 55 L 58 55 L 185 155 Z"
                    fill={`url(#roadPerspectiveGrad_${filterId})`}
                    stroke="rgba(255,255,255,0.06)"
                    strokeWidth="1"
                  />
                  <line x1="-40" y1="58" x2="-135" y2="155" stroke="rgba(255,255,255,0.26)" strokeWidth="1.8" />
                  <line x1="40" y1="58" x2="135" y2="155" stroke="rgba(255,255,255,0.26)" strokeWidth="1.8" />
                  <line x1="0" y1="60" x2="0" y2="155" stroke="rgba(255,255,255,0.15)" strokeWidth="1.2" strokeDasharray="8,8" />
                  <line x1="-155" y1="55" x2="155" y2="55" stroke="rgba(255,255,255,0.35)" strokeWidth="1.8" />
                  <ellipse cx="0" cy="55" rx="78" ry="3.5" fill="rgba(255,255,255,0.2)" />
                </g>

                {/* ====================================================
                    3. LEFT GAUGE - SPEEDOMETER (0 to 330 km/h)
                    ==================================================== */}
                <g transform="translate(330, 240)">
                  <circle cx="0" cy="0" r="172" fill={`url(#mDialBg_${filterId})`} />

                  {/* Inner Silver Ring (Ignition Stage 2+) */}
                  <path
                    d="M -102 70 A 108 108 0 1 1 102 70"
                    fill="none"
                    stroke={`url(#mSilverRing_${filterId})`}
                    strokeWidth="3.2"
                    style={{
                      opacity: ignitionStage >= 2 ? 0.9 : 0.05,
                      transition: "opacity 0.6s ease-out",
                    }}
                  />
                  <path
                    d="M -97 68 A 102 102 0 1 1 97 68"
                    fill="none"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="1"
                    style={{
                      opacity: ignitionStage >= 2 ? 1 : 0.05,
                      transition: "opacity 0.6s ease-out",
                    }}
                  />

                  {/* Speedometer Scale Ticks (Ignition Stage 2+) */}
                  <g
                    style={{
                      opacity: ignitionStage >= 2 ? 1 : 0,
                      transition: "opacity 0.7s ease-out",
                    }}
                  >
                    {speedTicks.map((tick) => {
                      const isMajor = tick.isMajor;
                      const isSemi = tick.isSemi;
                      const tickLen = isMajor ? 16 : isSemi ? 10 : 5.5;
                      const tickW = isMajor ? 2.8 : isSemi ? 1.6 : 1.1;
                      const tickColor = tick.isActive
                        ? "#ffffff"
                        : isMajor
                        ? "rgba(255,255,255,0.92)"
                        : "rgba(255,255,255,0.48)";

                      return (
                        <rect
                          key={`sp-tick-${tick.speed}`}
                          x={-tickW / 2}
                          y={-168}
                          width={tickW}
                          height={tickLen}
                          fill={tickColor}
                          transform={`rotate(${tick.angle})`}
                          className={tick.isActive ? "drop-shadow-[0_0_4px_rgba(255,255,255,0.8)]" : ""}
                        />
                      );
                    })}
                  </g>

                  {/* Speedometer Numbers (Ignition Stage 2+) */}
                  <g
                    style={{
                      opacity: ignitionStage >= 2 ? 1 : 0,
                      transition: "opacity 0.8s ease-out",
                    }}
                  >
                    {speedLabels.map((s) => {
                      const angleDeg = -135 + (s / 330) * 270;
                      const angleRad = ((angleDeg - 90) * Math.PI) / 180;
                      const r = 132;
                      const x = r * Math.cos(angleRad);
                      const y = r * Math.sin(angleRad);
                      const isActive = s <= speed;

                      return (
                        <text
                          key={`sp-num-${s}`}
                          x={x}
                          y={y + 1}
                          fill={isActive ? "#ffffff" : "rgba(255,255,255,0.95)"}
                          fontSize={s >= 100 ? "19" : "20"}
                          fontFamily="var(--font-geist-sans), 'Arial Black', -apple-system, BlinkMacSystemFont, sans-serif"
                          fontWeight="800"
                          letterSpacing="-0.5px"
                          textAnchor="middle"
                          dominantBaseline="central"
                          className={isActive ? "drop-shadow-[0_0_6px_rgba(255,255,255,0.65)]" : ""}
                        >
                          {s}
                        </text>
                      );
                    })}
                  </g>

                  {/* TOP INNER ZONE: DIGITAL SPEED & km/h (Ignition Stage 1+) */}
                  <g
                    style={{
                      opacity: ignitionStage >= 1 ? 1 : 0,
                      transition: "opacity 0.5s ease-out",
                    }}
                  >
                    <text
                      x="0"
                      y="-52"
                      fill="#9ca3af"
                      fontSize="11.5"
                      fontFamily="'Arial', sans-serif"
                      fontWeight="bold"
                      textAnchor="middle"
                      letterSpacing="0.5px"
                    >
                      km/h
                    </text>
                    <text
                      x="0"
                      y="-16"
                      fill="#ffffff"
                      fontSize="46"
                      fontFamily="var(--font-geist-sans), 'Arial Black', sans-serif"
                      fontWeight="900"
                      textAnchor="middle"
                      dominantBaseline="central"
                      className="drop-shadow-[0_0_15px_rgba(255,255,255,0.7)]"
                    >
                      {Math.round(speed)}
                    </text>
                  </g>

                  {/* LOWER INNER ZONE: NEEDLE PIVOT HUB & ILLUMINATED NEEDLE (Ignition Stage 3+) */}
                  <g
                    transform="translate(0, 35)"
                    style={{
                      opacity: ignitionStage >= 3 ? 1 : 0,
                      transition: "opacity 0.6s ease-out",
                    }}
                  >
                    <g
                      transform={`rotate(${speedNeedleAngle})`}
                      filter={`url(#bmwNeedleGlow_${filterId})`}
                    >
                      <polygon points="-3.2,-25 3.2,-25 1.2,-158 -1.2,-158" fill="#ff1e28" />
                      <polygon points="-1,-25 1,-25 0.5,-155 -0.5,-155" fill="#ffffff" />
                    </g>

                    <circle cx="0" cy="0" r="28" fill="none" stroke={`url(#mSilverRing_${filterId})`} strokeWidth="3" />
                    <circle cx="0" cy="0" r="25" fill="none" stroke="#ff1e28" strokeWidth="2" filter={`url(#redArcGlow_${filterId})`} />
                    <circle cx="0" cy="0" r="22" fill="#010204" />
                  </g>

                  {/* "km/h" vertical badge */}
                  <text
                    x="142"
                    y="-88"
                    fill="#757b88"
                    fontSize="9"
                    fontFamily="'Arial', sans-serif"
                    fontWeight="bold"
                    transform="rotate(65 142 -88)"
                    style={{
                      opacity: ignitionStage >= 2 ? 1 : 0,
                      transition: "opacity 0.6s ease-out",
                    }}
                  >
                    km/h
                  </text>
                </g>

                {/* ====================================================
                    4. MINI GAUGE 1: FUEL GAUGE (Ignition Stage 4+)
                    ==================================================== */}
                <g
                  transform="translate(0, 0)"
                  style={{
                    opacity: ignitionStage >= 4 ? 1 : 0,
                    transition: "opacity 0.8s ease-out",
                  }}
                >
                  {/* 1. Thin Chrome Crescent Bezel Line at 50% Opacity */}
                  <path
                    d="M 64 304 A 65 65 0 0 0 64 396"
                    fill="none"
                    stroke={`url(#mLeftCrescent_${filterId})`}
                    strokeWidth="4.5"
                    strokeLinecap="round"
                    opacity="0.5"
                    className="drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]"
                  />

                  {/* 2. Scale Baseline Arc Line */}
                  <path
                    d="M 70 310 A 56 56 0 0 0 70 390"
                    fill="none"
                    stroke="rgba(255,255,255,0.25)"
                    strokeWidth="1.2"
                  />

                  {/* 3. Red Reserve Arc (below 0) */}
                  <path
                    d="M 70 390 A 56 56 0 0 0 82 399"
                    fill="none"
                    stroke="#ff1e28"
                    strokeWidth="3.5"
                    filter={`url(#redArcGlow_${filterId})`}
                  />

                  {/* 4. Mathematically Exact Radial Ticks */}
                  {/* Major Tick at 1 (Full) */}
                  <line x1="70" y1="310" x2="79" y2="319" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" />
                  {/* Sub-tick 3/4 */}
                  <line x1="58" y1="329" x2="66" y2="332" stroke="#ffffff" strokeWidth="1.4" strokeLinecap="round" />
                  {/* Major Tick at 1/2 */}
                  <line x1="54" y1="350" x2="66" y2="350" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" />
                  {/* Sub-tick 1/4 */}
                  <line x1="58" y1="371" x2="66" y2="368" stroke="#ffffff" strokeWidth="1.4" strokeLinecap="round" />
                  {/* Major Tick at 0 */}
                  <line x1="70" y1="390" x2="79" y2="381" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" />

                  {/* 5. Numbers: 1/2 and 0 */}
                  <text
                    x="76"
                    y="350"
                    fill="#ffffff"
                    fontSize="13.5"
                    fontFamily="var(--font-geist-sans), 'Arial Black', sans-serif"
                    fontWeight="900"
                    dominantBaseline="central"
                  >
                    1/2
                  </text>

                  <text
                    x="94"
                    y="378"
                    fill="#ffffff"
                    fontSize="13.5"
                    fontFamily="var(--font-geist-sans), 'Arial Black', sans-serif"
                    fontWeight="900"
                    dominantBaseline="central"
                  >
                    0
                  </text>

                  {/* 6. Fuel Pump Icon + Direction Arrow (⛽ ▶) */}
                  <g transform="translate(86, 288) scale(0.95)">
                    <rect x="0" y="0" width="10" height="13" rx="1.5" fill="#ffffff" />
                    <rect x="2" y="2.5" width="6" height="4" rx="0.5" fill="#04060a" />
                    <path d="M 10 3 C 13 3, 13 10, 13 12 L 11 12" fill="none" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" />
                    <polygon points="16,4.5 20,7.5 16,10.5" fill="#ffffff" />
                  </g>

                  {/* 7. Needle */}
                  <line
                    x1="130"
                    y1="370"
                    x2="72"
                    y2="312"
                    stroke="#ff1e28"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                    filter={`url(#bmwNeedleGlow_${filterId})`}
                  />
                  <line
                    x1="130"
                    y1="370"
                    x2="74"
                    y2="314"
                    stroke="#ffffff"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />

                  {/* 8. Range Display: 483 km */}
                  <g transform="translate(132, 400)">
                    <text
                      x="0"
                      y="0"
                      fill="#ffffff"
                      fontSize="21"
                      fontFamily="var(--font-geist-sans), 'Arial Black', sans-serif"
                      fontWeight="900"
                      letterSpacing="-0.5px"
                      textAnchor="start"
                      dominantBaseline="central"
                    >
                      483
                    </text>
                    <text
                      x="0"
                      y="16"
                      fill="#ffffff"
                      fontSize="13"
                      fontFamily="var(--font-geist-sans), 'Arial Black', sans-serif"
                      fontWeight="bold"
                      textAnchor="start"
                      dominantBaseline="central"
                    >
                      km
                    </text>
                  </g>
                </g>

                {/* ====================================================
                    5. RIGHT GAUGE - TACHOMETER (0 to 8 x 1000)
                    ==================================================== */}
                <g transform="translate(1010, 240)">
                  <circle cx="0" cy="0" r="172" fill={`url(#mDialBg_${filterId})`} />

                  {/* Inner Silver Ring (Ignition Stage 2+) */}
                  <path
                    d="M -102 70 A 108 108 0 1 1 102 70"
                    fill="none"
                    stroke={`url(#mSilverRing_${filterId})`}
                    strokeWidth="3.2"
                    style={{
                      opacity: ignitionStage >= 2 ? 0.9 : 0.05,
                      transition: "opacity 0.6s ease-out",
                    }}
                  />
                  <path
                    d="M -97 68 A 102 102 0 1 1 97 68"
                    fill="none"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="1"
                    style={{
                      opacity: ignitionStage >= 2 ? 1 : 0.05,
                      transition: "opacity 0.6s ease-out",
                    }}
                  />

                  {/* Tachometer Scale Ticks (Ignition Stage 2+) */}
                  <g
                    style={{
                      opacity: ignitionStage >= 2 ? 1 : 0,
                      transition: "opacity 0.7s ease-out",
                    }}
                  >
                    {rpmTicks.map((tick, idx) => {
                      const isMajor = tick.isMajor;
                      const isSemi = tick.isSemi;
                      const tickLen = isMajor ? 16 : isSemi ? 10 : 5.5;
                      const tickW = isMajor ? 2.8 : isSemi ? 1.6 : 1.1;

                      let tickColor = tick.isActive
                        ? "#ffffff"
                        : isMajor
                        ? "rgba(255,255,255,0.92)"
                        : "rgba(255,255,255,0.48)";

                      if (tick.isRedline) {
                        tickColor = "#ea4043";
                      } else if (tick.isYellow) {
                        tickColor = "#f59e0b";
                      }

                      return (
                        <rect
                          key={`rpm-tick-${idx}`}
                          x={-tickW / 2}
                          y={-168}
                          width={tickW}
                          height={tickLen}
                          fill={tickColor}
                          transform={`rotate(${tick.angle})`}
                          className={
                            tick.isRedline || (tick.isActive && tick.rpm >= 7.0)
                              ? "drop-shadow-[0_0_4px_#ea4043]"
                              : tick.isYellow
                              ? "drop-shadow-[0_0_4px_#f59e0b]"
                              : tick.isActive
                              ? "drop-shadow-[0_0_4px_rgba(255,255,255,0.8)]"
                              : ""
                          }
                        />
                      );
                    })}
                  </g>

                  {/* Tachometer Numbers (Ignition Stage 2+) */}
                  <g
                    style={{
                      opacity: ignitionStage >= 2 ? 1 : 0,
                      transition: "opacity 0.8s ease-out",
                    }}
                  >
                    {rpmLabels.map((r) => {
                      const angleDeg = -135 + (r / 8) * 270;
                      const angleRad = ((angleDeg - 90) * Math.PI) / 180;
                      const radius = 132;
                      const x = radius * Math.cos(angleRad);
                      const y = radius * Math.sin(angleRad);
                      const isActive = r <= rpm;
                      const isRedline = r >= 7;

                      return (
                        <text
                          key={`rpm-num-${r}`}
                          x={x}
                          y={y + 1}
                          fill={
                            isRedline
                              ? "#ea4043"
                              : isActive
                              ? "#ffffff"
                              : "rgba(255,255,255,0.95)"
                          }
                          fontSize="23"
                          fontFamily="var(--font-geist-sans), 'Arial Black', -apple-system, BlinkMacSystemFont, sans-serif"
                          fontWeight="800"
                          textAnchor="middle"
                          dominantBaseline="central"
                          className={
                            isRedline
                              ? "drop-shadow-[0_0_6px_#ea4043]"
                              : isActive
                              ? "drop-shadow-[0_0_6px_rgba(255,255,255,0.65)]"
                              : ""
                          }
                        >
                          {r}
                        </text>
                      );
                    })}
                  </g>

                  <text
                    x="-138"
                    y="-48"
                    fill="#757b88"
                    fontSize="10"
                    fontFamily="'Arial', sans-serif"
                    fontWeight="bold"
                    transform="rotate(-65 -138 -48)"
                    style={{
                      opacity: ignitionStage >= 2 ? 1 : 0,
                      transition: "opacity 0.6s ease-out",
                    }}
                  >
                    1/min x 1000
                  </text>

                  {/* (A) START STOP Icon */}
                  <g
                    transform="translate(-112, 14)"
                    style={{
                      opacity: ignitionStage >= 1 ? 1 : 0,
                      transition: "opacity 0.6s ease-out",
                    }}
                  >
                    <circle cx="0" cy="0" r="11" fill="none" stroke="#ced2db" strokeWidth="1.2" strokeDasharray="50,15" />
                    <text x="0" y="3.5" fill="#ced2db" fontSize="10" fontWeight="bold" fontFamily="'Arial'" textAnchor="middle">
                      A
                    </text>
                    <text x="0" y="19" fill="#ced2db" fontSize="6.5" fontWeight="bold" fontFamily="'Arial'" textAnchor="middle">
                      START
                    </text>
                    <text x="0" y="26" fill="#ced2db" fontSize="6.5" fontWeight="bold" fontFamily="'Arial'" textAnchor="middle">
                      STOP
                    </text>
                  </g>

                  {/* TOP INNER ZONE: BMW ///M5 LOGO (Ignition Stage 1+) */}
                  <g
                    transform="translate(0, -32)"
                    style={{
                      opacity: ignitionStage >= 1 ? 1 : 0,
                      transition: "opacity 0.4s ease-out",
                    }}
                  >
                    <polygon points="-40,7 -34,7 -28,-11 -34,-11" fill="#0099da" />
                    <polygon points="-31,7 -25,7 -19,-11 -25,-11" fill="#0c1982" />
                    <polygon points="-22,7 -16,7 -10,-11 -16,-11" fill="#e00000" />

                    <text
                      x="10"
                      y="6"
                      fill="#ffffff"
                      fontSize="28"
                      fontFamily="var(--font-geist-sans), 'Arial Black', sans-serif"
                      fontWeight="900"
                      fontStyle="italic"
                      letterSpacing="-1px"
                      textAnchor="middle"
                      className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]"
                    >
                      M5
                    </text>
                  </g>

                  {/* LOWER INNER ZONE: NEEDLE PIVOT HUB & ILLUMINATED NEEDLE (Ignition Stage 3+) */}
                  <g
                    transform="translate(0, 35)"
                    style={{
                      opacity: ignitionStage >= 3 ? 1 : 0,
                      transition: "opacity 0.6s ease-out",
                    }}
                  >
                    <g
                      transform={`rotate(${rpmNeedleAngle})`}
                      filter={`url(#bmwNeedleGlow_${filterId})`}
                    >
                      <polygon points="-3.2,-25 3.2,-25 1.2,-158 -1.2,-158" fill="#ff1e28" />
                      <polygon points="-1,-25 1,-25 0.5,-155 -0.5,-155" fill="#ffffff" />
                    </g>

                    <circle cx="0" cy="0" r="28" fill="none" stroke={`url(#mSilverRing_${filterId})`} strokeWidth="3" />
                    <circle cx="0" cy="0" r="25" fill="none" stroke="#ff1e28" strokeWidth="2" filter={`url(#redArcGlow_${filterId})`} />
                    <circle cx="0" cy="0" r="22" fill="#010204" />
                  </g>
                </g>

                {/* ====================================================
                    6. MINI GAUGE 2: OIL TEMP GAUGE (Ignition Stage 4+)
                    ==================================================== */}
                <g
                  transform="translate(0, 0)"
                  style={{
                    opacity: ignitionStage >= 4 ? 1 : 0,
                    transition: "opacity 0.8s ease-out",
                  }}
                >
                  {/* 1. Thin Chrome Crescent Bezel Line at 50% Opacity */}
                  <path
                    d="M 1276 304 A 65 65 0 0 1 1276 396"
                    fill="none"
                    stroke={`url(#mRightCrescent_${filterId})`}
                    strokeWidth="4.5"
                    strokeLinecap="round"
                    opacity="0.5"
                    className="drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]"
                  />

                  {/* 2. Scale Baseline Arc Line */}
                  <path
                    d="M 1270 310 A 56 56 0 0 1 1270 390"
                    fill="none"
                    stroke="rgba(255,255,255,0.25)"
                    strokeWidth="1.2"
                  />

                  {/* 3. Top Red Hot Arc (near 170) */}
                  <path
                    d="M 1258 301 A 56 56 0 0 1 1270 310"
                    fill="none"
                    stroke="#ff1e28"
                    strokeWidth="3.5"
                    filter={`url(#redArcGlow_${filterId})`}
                  />

                  {/* 4. Bottom Blue Cold Arc (below 70) */}
                  <path
                    d="M 1270 390 A 56 56 0 0 1 1258 399"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="3.5"
                    filter={`url(#blueColdGlow_${filterId})`}
                  />

                  {/* 5. Mathematically Exact Radial Ticks */}
                  {/* Major Tick at 170 */}
                  <line x1="1270" y1="310" x2="1261" y2="319" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" />
                  {/* Sub-tick */}
                  <line x1="1282" y1="329" x2="1274" y2="332" stroke="#ffffff" strokeWidth="1.4" strokeLinecap="round" />
                  {/* Major Tick at 120 */}
                  <line x1="1286" y1="350" x2="1274" y2="350" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" />
                  {/* Sub-tick */}
                  <line x1="1282" y1="371" x2="1274" y2="368" stroke="#ffffff" strokeWidth="1.4" strokeLinecap="round" />
                  {/* Major Tick at 70 */}
                  <line x1="1270" y1="390" x2="1261" y2="381" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" />

                  {/* 6. Numbers: 170, 120, 70, °C */}
                  <text
                    x="1254"
                    y="322"
                    fill="#ffffff"
                    fontSize="13.5"
                    fontFamily="var(--font-geist-sans), 'Arial Black', sans-serif"
                    fontWeight="900"
                    textAnchor="end"
                    dominantBaseline="central"
                  >
                    170
                  </text>

                  <text
                    x="1264"
                    y="350"
                    fill="#ffffff"
                    fontSize="13.5"
                    fontFamily="var(--font-geist-sans), 'Arial Black', sans-serif"
                    fontWeight="900"
                    textAnchor="end"
                    dominantBaseline="central"
                  >
                    120
                  </text>

                  <text
                    x="1246"
                    y="378"
                    fill="#ffffff"
                    fontSize="13.5"
                    fontFamily="var(--font-geist-sans), 'Arial Black', sans-serif"
                    fontWeight="900"
                    textAnchor="end"
                    dominantBaseline="central"
                  >
                    70
                  </text>

                  <text
                    x="1224"
                    y="398"
                    fill="#ffffff"
                    fontSize="13"
                    fontFamily="var(--font-geist-sans), 'Arial Black', sans-serif"
                    fontWeight="bold"
                    textAnchor="end"
                    dominantBaseline="central"
                  >
                    °C
                  </text>

                  {/* 7. Oil Can + Thermometer Icon (🛢 🌡) at Top */}
                  <g transform="translate(1248, 276) scale(0.95)">
                    <path
                      d="M 2 9 L 15 9 C 17 9, 18 11, 18 14 L 0 14 C 0 12, 1 9, 2 9 Z"
                      fill="#ffffff"
                    />
                    <path d="M 15 9 L 19 5 L 21 6" fill="none" stroke="#ffffff" strokeWidth="1.4" strokeLinecap="round" />
                    <circle cx="21" cy="8" r="0.8" fill="#ffffff" />
                    <line x1="8.5" y1="0" x2="8.5" y2="9" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
                    <line x1="6.5" y1="3" x2="8.5" y2="3" stroke="#ffffff" strokeWidth="1.2" />
                    <line x1="6.5" y1="6" x2="8.5" y2="6" stroke="#ffffff" strokeWidth="1.2" />
                    <circle cx="8.5" cy="9" r="2" fill="#ffffff" />
                  </g>

                  {/* 8. Needle */}
                  <line
                    x1="1200"
                    y1="350"
                    x2="1284"
                    y2="350"
                    stroke="#ff1e28"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                    filter={`url(#bmwNeedleGlow_${filterId})`}
                  />
                  <line
                    x1="1200"
                    y1="350"
                    x2="1282"
                    y2="350"
                    stroke="#ffffff"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                </g>

                {/* ====================================================
                    7. BOTTOM TELEMETRY STATUS BAR (Ignition Stage 5)
                    ==================================================== */}
                <g
                  transform="translate(670, 472)"
                  style={{
                    opacity: ignitionStage >= 5 ? 1 : 0,
                    transition: "opacity 0.8s ease-out",
                  }}
                >
                  <path
                    d="M -410 0 L -380 -22 L 380 -22 L 410 0 Z"
                    fill="#020306"
                    stroke="#1a1c22"
                    strokeWidth="1.2"
                  />

                  <text
                    x="-305"
                    y="-7"
                    fill="#ffffff"
                    fontSize="14.5"
                    fontFamily="var(--font-geist-sans), 'Arial', sans-serif"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {currentTime}
                  </text>

                  <text
                    x="-145"
                    y="-7"
                    fill="#8e94a0"
                    fontSize="11"
                    fontFamily="'Arial', sans-serif"
                    fontWeight="bold"
                    textAnchor="end"
                  >
                    TOTAL
                  </text>
                  <text
                    x="-82"
                    y="-7"
                    fill="#ffffff"
                    fontSize="15.5"
                    fontFamily="'Courier New', Courier, monospace"
                    fontWeight="bold"
                    textAnchor="start"
                  >
                    {odoStr}
                    <tspan fill="#8e94a0" fontSize="11" fontFamily="'Arial'"> km</tspan>
                  </text>

                  <text
                    x="50"
                    y="-7"
                    fill="#8e94a0"
                    fontSize="11"
                    fontFamily="'Arial', sans-serif"
                    fontWeight="bold"
                    textAnchor="end"
                  >
                    TRIP
                  </text>
                  <text
                    x="112"
                    y="-7"
                    fill="#ffffff"
                    fontSize="15.5"
                    fontFamily="'Courier New', Courier, monospace"
                    fontWeight="bold"
                    textAnchor="start"
                  >
                    {tripStr}
                    <tspan fill="#8e94a0" fontSize="11" fontFamily="'Arial'"> km</tspan>
                  </text>

                  <text
                    x="295"
                    y="-7"
                    fill="#ffffff"
                    fontSize="14.5"
                    fontFamily="var(--font-geist-sans), 'Arial', sans-serif"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    +10.0 °C
                  </text>
                </g>
              </svg>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
