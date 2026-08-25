"use client";

import { useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

interface AmbientVideoProps {
  clips: string[];
  isEnabled?: boolean;
  loop?: boolean;
  className: string;
  activeClassName: string;
  inactiveClassName: string;
}

const IN_VIEW_MARGIN = "800px";

function getSources(clip: string) {
  if (clip.endsWith(".mp4")) {
    return [{ src: clip, type: "video/mp4" }];
  }
  return [
    { src: clip, type: "video/webm" },
    { src: clip.replace(/\.webm$/, ".mp4"), type: "video/mp4" },
  ];
}

export function AmbientVideo({
  clips,
  isEnabled = true,
  loop = true,
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

    if (!shouldPlay || (active.ended && !loop)) {
      active.pause();
      return;
    }

    active.play().catch(() => {});

    if (activeIdx < clips.length - 1 || loop) {
      const next = videoRefs.current[(activeIdx + 1) % clips.length];
      if (next && next !== active && next.preload !== "auto") {
        next.preload = "auto";
        next.load();
      }
    }
  }, [activeIdx, shouldPlay, clips.length, loop]);

  useEffect(() => {
    const pauseWhenHidden = () => {
      if (!document.hidden) return;
      for (const video of videoRefs.current) video?.pause();
    };

    const resumeWhenVisible = () => {
      if (document.hidden || !shouldPlay) return;
      const active = videoRefs.current[activeIdx];
      if (active && (!active.ended || loop)) {
        active.play().catch(() => {});
      }
    };

    const onVisibilityChange = () => {
      pauseWhenHidden();
      resumeWhenVisible();
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, [activeIdx, shouldPlay, loop]);

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
      if (idx === clips.length - 1 && !loop) {
        const video = videoRefs.current[idx];
        if (video) {
          video.pause();
        }
        return;
      }
      const nextIdx = (idx + 1) % clips.length;
      const nextVideo = videoRefs.current[nextIdx];
      if (nextVideo) {
        nextVideo.currentTime = 0;
        nextVideo.play().catch(() => {});
      }
      setActiveIdx(nextIdx);
    },
    [clips.length, loop],
  );

  const handleTimeUpdate = useCallback(
    (element: HTMLVideoElement, idx: number) => {
      if (loop || (isSingleClip ? false : idx < clips.length - 1)) {
        return;
      }
      if (element.duration > 0 && element.currentTime >= element.duration - 0.04) {
        element.pause();
      }
    },
    [clips.length, isSingleClip, loop],
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
          loop={loop && isSingleClip}
          preload={idx === 0 && isInView ? "metadata" : "none"}
          onEnded={() => handleEnded(idx)}
          onTimeUpdate={(event) => handleTimeUpdate(event.currentTarget, idx)}
          onLoadedMetadata={(event) => {
            if (prefersReducedMotion && event.currentTarget.currentTime === 0) {
              event.currentTarget.currentTime = 0.05;
            }
          }}
          style={{
            transform: "translateZ(0)",
            backfaceVisibility: "hidden",
          }}
          className={`${className} ${idx === activeIdx ? activeClassName : inactiveClassName}`}
        >
          {getSources(clip).map((source) => (
            <source key={source.src} src={source.src} type={source.type} />
          ))}
        </video>
      ))}
    </div>
  );
}
