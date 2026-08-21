"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";

interface GarageSectionProps {
  onOpenBooking: (carModel?: string) => void;
}

interface CarData {
  id: string;
  badge: string;
  name: string;
  generation: string;
  powerValue: string;
  powerUnit: string;
  accelValue: string;
  accelUnit: string;
  driveValue: string;
  driveDetail: string;
  torqueValue: string;
  torqueUnit: string;
  engine: string;
  transmission: string;
  tag: string;
  image: string;
}

const BMW_M_CARS: CarData[] = [
  {
    id: "m2",
    badge: "M2",
    name: "BMW M2 Coupé",
    generation: "G87 / F87",
    powerValue: "460",
    powerUnit: "HP",
    accelValue: "4.1",
    accelUnit: "SEC 0-100",
    driveValue: "RWD",
    driveDetail: "PURE REAR WHEEL",
    torqueValue: "550",
    torqueUnit: "NM",
    engine: "3.0L S58 TwinPower Turbo",
    transmission: "8-Speed M Steptronic",
    tag: "AGILE DRIFT WEAPON // КОМПАКТНЫЙ БОЕЦ",
    image: "/cars/m2.webp",
  },
  {
    id: "m3",
    badge: "M3",
    name: "BMW M3 Competition",
    generation: "G80 / F80",
    powerValue: "510",
    powerUnit: "HP",
    accelValue: "3.5",
    accelUnit: "SEC 0-100",
    driveValue: "M xDrive",
    driveDetail: "2WD DRIFT MODE",
    torqueValue: "650",
    torqueUnit: "NM",
    engine: "3.0L S58 BiTurbo",
    transmission: "8-Speed M Steptronic",
    tag: "THE BENCHMARK ICON // ЭТАЛОН БАЛАНСА",
    image: "/cars/m3.webp",
  },
  {
    id: "m4",
    badge: "M4",
    name: "BMW M4 Competition",
    generation: "G82 / F82",
    powerValue: "510",
    powerUnit: "HP",
    accelValue: "3.5",
    accelUnit: "SEC 0-100",
    driveValue: "RWD",
    driveDetail: "DYNAMIC SLIP LOCK",
    torqueValue: "650",
    torqueUnit: "NM",
    engine: "3.0L S58 Twin-Turbo",
    transmission: "8-Speed M Steptronic",
    tag: "TRACK SHREDDER // КУПЕ ПРЕДЕЛЬНОГО КОНТРОЛЯ",
    image: "/cars/m4.webp",
  },
  {
    id: "m5",
    badge: "M5",
    name: "BMW M5 Competition",
    generation: "F90 / G90",
    powerValue: "625",
    powerUnit: "HP",
    accelValue: "3.0",
    accelUnit: "SEC 0-100",
    driveValue: "M xDrive",
    driveDetail: "SWITCHABLE 2WD",
    torqueValue: "750",
    torqueUnit: "NM",
    engine: "4.4L S63 V8 BiTurbo",
    transmission: "8-Speed M Steptronic",
    tag: "TWIN-TURBO V8 MONSTER // АБСОЛЮТНАЯ МОЩЬ",
    image: "/cars/m5.webp",
  },
  {
    id: "m6",
    badge: "M6",
    name: "BMW M6 Gran Coupé",
    generation: "F13 / F06",
    powerValue: "560",
    powerUnit: "HP",
    accelValue: "3.9",
    accelUnit: "SEC 0-100",
    driveValue: "RWD",
    driveDetail: "7-SPEED DCT ROBOT",
    torqueValue: "680",
    torqueUnit: "NM",
    engine: "4.4L S63 V8 TwinPower",
    transmission: "7-Speed M-DCT",
    tag: "CLASSIC M V8 POWER // БЕСКОМПРОМИССНЫЙ ХАРАКТЕР",
    image: "/cars/m6.webp",
  },
  {
    id: "m8",
    badge: "M8",
    name: "BMW M8 Competition",
    generation: "F92 / F93",
    powerValue: "625",
    powerUnit: "HP",
    accelValue: "3.2",
    accelUnit: "SEC 0-100",
    driveValue: "M xDrive",
    driveDetail: "2WD DRIFT MODE",
    torqueValue: "750",
    torqueUnit: "NM",
    engine: "4.4L S63 V8 BiTurbo",
    transmission: "8-Speed M Steptronic",
    tag: "FLAGSHIP HYPER TOURER // ВЕРШИНА M-СЕРИИ",
    image: "/cars/m8.webp",
  },
];

export function GarageSection({ onOpenBooking }: GarageSectionProps) {
  const [activeCarIndex, setActiveCarIndex] = useState(2); // M4 default
  const activeCar = BMW_M_CARS[activeCarIndex];

  return (
    <section id="garage" className="relative w-full bg-black text-white border-b border-white/10 overflow-hidden py-32 px-6 sm:px-12 lg:px-16 xl:px-20">
      <div className="max-w-[1820px] mx-auto space-y-16">
        {/* Section Header with Asymmetrical Layout */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-8 border-b border-white/10">
          <div className="space-y-3">
            <div className="text-xs font-mono text-[#ff2a55] tracking-widest uppercase">
              // BOUTIQUE GARAGE LINEUP
            </div>
            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-bold uppercase tracking-tight text-white">
              АВТОПАРК M-СЕРИИ<span className="text-[#ff2a55]">.</span>
            </h2>
          </div>

          {/* Model Selection Tabs */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            {BMW_M_CARS.map((car, idx) => (
              <button
                key={car.id}
                onClick={() => setActiveCarIndex(idx)}
                className={`px-5 sm:px-7 py-3 text-xs sm:text-sm font-mono font-bold uppercase transition-all duration-300 ${
                  activeCarIndex === idx
                    ? "bg-white text-black shadow-[0_0_25px_rgba(255,255,255,0.4)]"
                    : "bg-white/5 text-[#7e7e86] hover:text-white border border-white/10 hover:border-white/30"
                }`}
              >
                {car.badge}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Car Showcase Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#060608] border border-white/12 p-8 sm:p-14 rounded-[2rem] relative overflow-hidden">
          {/* Subtle Ambient Radial Light behind car */}
          <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-white/5 rounded-full blur-3xl pointer-events-none" />

          {/* Left Column: Car Identity & Large Cutout Image (Span 7) */}
          <div className="lg:col-span-7 space-y-8 relative z-10">
            <div className="space-y-2">
              <div className="text-xs font-mono tracking-widest text-[#ff2a55] uppercase">
                {activeCar.tag}
              </div>
              <h3 className="text-3xl sm:text-5xl lg:text-6xl font-bold uppercase tracking-tight text-white">
                {activeCar.name}
              </h3>
              <div className="text-sm font-mono text-[#7e7e86]">
                ДВС: <span className="text-white">{activeCar.engine}</span> • КПП: <span className="text-white">{activeCar.transmission}</span>
              </div>
            </div>

            {/* Smooth Animated Car Image */}
            <div className="relative w-full h-[260px] sm:h-[340px] flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCar.id}
                  initial={{ opacity: 0, scale: 0.94, filter: "blur(10px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, scale: 0.94, filter: "blur(10px)" }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={activeCar.image}
                    alt={activeCar.name}
                    fill
                    className="object-contain drop-shadow-[0_25px_50px_rgba(0,0,0,0.95)]"
                    priority
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Right Column: 4 Precision Telemetry Cards & Action Button (Span 5) */}
          <div className="lg:col-span-5 space-y-6 relative z-10">
            <div className="grid grid-cols-2 gap-4">
              {/* 01: POWER */}
              <div className="bg-[#101014] border border-white/10 rounded-2xl p-6 flex flex-col justify-between">
                <div className="text-xs font-mono text-[#7e7e86] uppercase tracking-wider">
                  МОЩНОСТЬ // 01
                </div>
                <div className="mt-4 flex items-baseline gap-1.5">
                  <span className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                    {activeCar.powerValue}
                  </span>
                  <span className="text-xs font-mono text-[#7e7e86] uppercase">
                    {activeCar.powerUnit}
                  </span>
                </div>
                <div className="mt-3 w-full h-[2px] bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white transition-all duration-700"
                    style={{ width: `${(parseInt(activeCar.powerValue) / 650) * 100}%` }}
                  />
                </div>
              </div>

              {/* 02: ACCELERATION */}
              <div className="bg-[#101014] border border-white/10 rounded-2xl p-6 flex flex-col justify-between">
                <div className="text-xs font-mono text-[#7e7e86] uppercase tracking-wider">
                  0–100 КМ/Ч // 02
                </div>
                <div className="mt-4 flex items-baseline gap-1.5">
                  <span className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                    {activeCar.accelValue}
                  </span>
                  <span className="text-xs font-mono text-[#7e7e86] uppercase">
                    СЕК
                  </span>
                </div>
                <div className="mt-3 w-full h-[2px] bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-400 transition-all duration-700"
                    style={{ width: `${((5.0 - parseFloat(activeCar.accelValue)) / 2.5) * 100}%` }}
                  />
                </div>
              </div>

              {/* 03: DRIVETRAIN */}
              <div className="bg-[#101014] border border-white/10 rounded-2xl p-6 flex flex-col justify-between">
                <div className="text-xs font-mono text-[#7e7e86] uppercase tracking-wider">
                  ПРИВОД // 03
                </div>
                <div className="mt-4">
                  <div className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    {activeCar.driveValue}
                  </div>
                  <div className="text-[10px] font-mono text-[#7e7e86] uppercase mt-0.5">
                    {activeCar.driveDetail}
                  </div>
                </div>
                <div className="mt-3 w-full h-[2px] bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full w-full bg-[#0099ff]" />
                </div>
              </div>

              {/* 04: TORQUE */}
              <div className="bg-[#101014] border border-white/10 rounded-2xl p-6 flex flex-col justify-between">
                <div className="text-xs font-mono text-[#7e7e86] uppercase tracking-wider">
                  КРУТЯЩИЙ // 04
                </div>
                <div className="mt-4 flex items-baseline gap-1.5">
                  <span className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                    {activeCar.torqueValue}
                  </span>
                  <span className="text-xs font-mono text-[#7e7e86] uppercase">
                    {activeCar.torqueUnit}
                  </span>
                </div>
                <div className="mt-3 w-full h-[2px] bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#ff2a55] transition-all duration-700"
                    style={{ width: `${(parseInt(activeCar.torqueValue) / 800) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Direct Booking CTA Button */}
            <div className="pt-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onOpenBooking(activeCar.name)}
                className="w-full btn-pill-white justify-center text-sm py-4 shadow-xl font-bold"
              >
                <span>Выбрать {activeCar.badge} для тренировки</span>
                <span className="btn-circle-icon text-xs w-6 h-6">+</span>
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
