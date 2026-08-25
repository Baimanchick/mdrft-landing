"use client";

import { AmbientVideo } from "@/shared/ui/video";

const VIDEOS = [
  { webm: "/videos/hero-2.webm", mp4: "/videos/hero-2.mp4" },
] as const;

export function Bmw5ReelSection() {
  return (
    <section className="relative w-full h-[260px] min-[480px]:h-[320px] sm:h-[480px] lg:h-[620px] bg-black border-b border-white/10 overflow-hidden">
      <AmbientVideo
        clips={VIDEOS}
        poster="/images/about-m3-lineup.webp"
        posterClassName="object-cover object-[58%_center] sm:object-center"
        className="absolute inset-0 w-full h-full object-cover object-[58%_center] sm:object-center"
        activeClassName="opacity-100 z-1"
        inactiveClassName="opacity-0 z-0 pointer-events-none"
      />

      <div className="relative z-10 max-w-[1820px] h-full mx-auto border-l border-r border-white/10 pointer-events-none" />
    </section>
  );
}
