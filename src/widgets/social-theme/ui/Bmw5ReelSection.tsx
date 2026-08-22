"use client";

import { AmbientVideo } from "@/shared/ui/video";

const VIDEOS = [
  "/videos/bmw5-1.webm",
  "/videos/bmw5-2.webm",
  "/videos/bmw5-3.webm",
  "/videos/bmw5-4.webm",
];

export function Bmw5ReelSection() {
  return (
    <section className="relative w-full h-[450px] sm:h-[540px] lg:h-[620px] bg-black border-b border-white/10 overflow-hidden">
      <AmbientVideo
        clips={VIDEOS}
        className="absolute inset-0 w-full h-full object-cover"
        activeClassName="opacity-100 z-1"
        inactiveClassName="opacity-0 z-0 pointer-events-none"
      />

      {/* Architectural Grid Line Container matching the site */}
      <div className="relative z-10 max-w-[1820px] h-full mx-auto border-l border-r border-white/10 pointer-events-none" />
    </section>
  );
}
