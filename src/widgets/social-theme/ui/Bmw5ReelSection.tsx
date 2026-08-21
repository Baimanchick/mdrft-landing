"use client";

import React, { useState, useRef, useEffect } from "react";

const VIDEOS = [
  "/videos/bmw5-1.webm",
  "/videos/bmw5-2.webm",
  "/videos/bmw5-3.webm",
  "/videos/bmw5-4.webm",
];

export function Bmw5ReelSection() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const handleEnded = (idx: number) => {
    const nextIdx = (idx + 1) % VIDEOS.length;
    const nextVideo = videoRefs.current[nextIdx];
    if (nextVideo) {
      nextVideo.currentTime = 0;
      nextVideo.play().catch(() => {});
    }
    setCurrentIdx(nextIdx);
  };

  useEffect(() => {
    const activeVid = videoRefs.current[currentIdx];
    if (activeVid) {
      activeVid.play().catch(() => {});
    }
  }, [currentIdx]);

  return (
    <section className="relative w-full h-[450px] sm:h-[540px] lg:h-[620px] bg-black border-b border-white/10 overflow-hidden">
      {/* 4 Preloaded instant seamless video layers */}
      {VIDEOS.map((src, idx) => (
        <video
          key={src}
          ref={(el) => {
            videoRefs.current[idx] = el;
          }}
          autoPlay={idx === 0}
          muted
          playsInline
          preload="auto"
          onEnded={() => handleEnded(idx)}
          className={`absolute inset-0 w-full h-full object-cover ${
            idx === currentIdx ? "opacity-100 z-1" : "opacity-0 z-0 pointer-events-none"
          }`}
          src={src}
        />
      ))}

      {/* Architectural Grid Line Container matching the site */}
      <div className="relative z-10 max-w-[1820px] h-full mx-auto border-l border-r border-white/10 pointer-events-none" />
    </section>
  );
}
