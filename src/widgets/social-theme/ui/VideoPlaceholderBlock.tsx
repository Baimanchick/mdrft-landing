"use client";

import React from "react";

interface VideoPlaceholderBlockProps {
  slotId?: string;
  label?: string;
  videoSrc?: string;
}

export function VideoPlaceholderBlock({ videoSrc }: VideoPlaceholderBlockProps) {
  return (
    <section className="relative w-full h-[180px] sm:h-[220px] lg:h-[260px] bg-black border-b border-white/10 overflow-hidden">
      {/* Video Background if provided */}
      {videoSrc && (
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      )}

      {/* Architectural Grid Line Container matching the site */}
      <div className="relative z-10 max-w-[1820px] h-full mx-auto border-l border-r border-white/10 pointer-events-none" />
    </section>
  );
}
