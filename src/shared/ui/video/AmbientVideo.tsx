"use client";

import { useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

interface AmbientVideoProps {
  clips: string[];
  isEnabled?: boolean;
  className: string;
  activeClassName: string;
  inactiveClassName: string;
}

const IN_VIEW_MARGIN = "800px";

function toMp4(webmPath: string) {
  return webmPath.replace(/\.webm$/, ".mp4");
}

export function AmbientVideo({
  clips,
  isEnabled = true,
  className,
  activeClassName,
  inactiveClassName,
}: AmbientVideoProps) {
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const isSingleClip = clips.length === 1;

  const shouldPlay = isEnabled && isInView && !prefersReducedMotion;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { rootMargin: IN_VIEW_MARGIN },
    );
    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const active = videoRefs.current[activeIdx];
    if (!active) return;

    if (!shouldPlay) {
      active.pause();
      return;
    }

    active.play().catch(() => {});

    const next = videoRefs.current[(activeIdx + 1) % clips.length];
    if (next && next !== active && next.preload !== "auto") {
      next.preload = "auto";
      next.load();
    }
  }, [activeIdx, shouldPlay, clips.length]);

  useEffect(() => {
    const pauseWhenHidden = () => {
      if (!document.hidden) return;
      for (const video of videoRefs.current) video?.pause();
    };

    const resumeWhenVisible = () => {
      if (document.hidden || !shouldPlay) return;
      videoRefs.current[activeIdx]?.play().catch(() => {});
    };

    const onVisibilityChange = () => {
      pauseWhenHidden();
      resumeWhenVisible();
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, [activeIdx, shouldPlay]);

  useEffect(() => {
    if (!prefersReducedMotion) return;

    for (const video of videoRefs.current) {
      if (!video) continue;
      video.pause();
      if (video.preload === "none") {
        video.preload = "metadata";
        video.load();
      }
    }
  }, [prefersReducedMotion]);

  useEffect(() => {
    const videos = videoRefs.current.slice();
    return () => {
      for (const video of videos) video?.pause();
    };
  }, []);

  const handleEnded = useCallback(
    (idx: number) => {
      const nextIdx = (idx + 1) % clips.length;
      const nextVideo = videoRefs.current[nextIdx];
      if (nextVideo) {
        nextVideo.currentTime = 0;
        nextVideo.play().catch(() => {});
      }
      setActiveIdx(nextIdx);
    },
    [clips.length],
  );

  return (
    <div ref={containerRef} className="absolute inset-0 h-full w-full">
      {clips.map((clip, idx) => (
        <video
          key={clip}
          ref={(element) => {
            videoRefs.current[idx] = element;
          }}
          muted
          playsInline
          loop={isSingleClip}
          preload={idx === 0 && isInView ? "metadata" : "none"}
          onEnded={isSingleClip ? undefined : () => handleEnded(idx)}
          onLoadedMetadata={(event) => {
            if (prefersReducedMotion && event.currentTarget.currentTime === 0) {
              event.currentTarget.currentTime = 0.05;
            }
          }}
          className={`${className} ${idx === activeIdx ? activeClassName : inactiveClassName}`}
        >
          <source src={clip} type="video/webm" />
          <source src={toMp4(clip)} type="video/mp4" />
        </video>
      ))}
    </div>
  );
}
