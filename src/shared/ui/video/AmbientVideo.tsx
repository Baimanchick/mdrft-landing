"use client";

import Image from "next/image";
import { useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

export type AmbientVideoClip = {
  mp4?: string;
  webm?: string;
};

interface AmbientVideoProps {
  clips: readonly AmbientVideoClip[];
  poster?: string;
  posterClassName?: string;
  posterPreload?: boolean;
  posterSizes?: string;
  isEnabled?: boolean;
  loop?: boolean;
  className: string;
  activeClassName: string;
  inactiveClassName: string;
  onFirstClipNearEnd?: () => void;
}

type NetworkInformation = {
  effectiveType?: string;
  saveData?: boolean;
};

type NavigatorWithConnection = Navigator & {
  connection?: NetworkInformation;
};

const MOBILE_MEDIA_QUERY = "(max-width: 767px)";

function canLoadAmbientVideo() {
  if (typeof navigator === "undefined") return true;
  const connection = (navigator as NavigatorWithConnection).connection;
  return (
    connection?.saveData !== true &&
    connection?.effectiveType !== "slow-2g" &&
    connection?.effectiveType !== "2g"
  );
}

function getSources(clip?: AmbientVideoClip) {
  if (!clip) return [];
  return [
    clip.webm ? { src: clip.webm, type: "video/webm" } : null,
    clip.mp4 ? { src: clip.mp4, type: "video/mp4" } : null,
  ].filter((source): source is { src: string; type: string } => source !== null);
}

export function AmbientVideo({
  clips,
  poster,
  posterClassName = "object-cover object-center",
  posterPreload = false,
  posterSizes = "(min-width: 1820px) 1820px, 100vw",
  isEnabled = true,
  loop = true,
  className,
  activeClassName,
  inactiveClassName,
  onFirstClipNearEnd,
}: AmbientVideoProps) {
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  const videoRefA = useRef<HTMLVideoElement | null>(null);
  const videoRefB = useRef<HTMLVideoElement | null>(null);
  const hasTriggeredNearEnd = useRef(false);

  const [activeSlot, setActiveSlot] = useState<"A" | "B">("A");
  const [clipIdxA, setClipIdxA] = useState(0);
  const [clipIdxB, setClipIdxB] = useState(clips.length > 1 ? 1 : 0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const [isInView, setIsInView] = useState(false);
  const [sourcesEnabled, setSourcesEnabled] = useState(false);

  const isSingleClip = clips.length <= 1;
  const shouldPlay =
    isEnabled && isInView && sourcesEnabled && !prefersReducedMotion;

  // Viewport & network observers
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const isMobile = window.matchMedia(MOBILE_MEDIA_QUERY).matches;
    const playbackObserver = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.01 },
    );
    const sourceObserver = new IntersectionObserver(
      ([entry]) => {
        if (
          entry.isIntersecting &&
          (!isMobile || canLoadAmbientVideo())
        ) {
          setSourcesEnabled(true);
          sourceObserver.disconnect();
        }
      },
      { rootMargin: "200px" },
    );

    playbackObserver.observe(container);
    sourceObserver.observe(container);

    return () => {
      playbackObserver.disconnect();
      sourceObserver.disconnect();
    };
  }, []);

  // Initial source loading when sources become enabled
  useEffect(() => {
    if (!sourcesEnabled) return;
    if (videoRefA.current && videoRefA.current.readyState === 0) {
      videoRefA.current.load();
    }
    if (!isSingleClip && videoRefB.current && videoRefB.current.readyState === 0) {
      videoRefB.current.load();
    }
  }, [sourcesEnabled, isSingleClip]);

  // Play/pause control
  useEffect(() => {
    const activeVideo = activeSlot === "A" ? videoRefA.current : videoRefB.current;
    if (!activeVideo) return;

    if (!shouldPlay) {
      activeVideo.pause();
      return;
    }

    const p = activeVideo.play();
    if (p !== undefined) {
      p.catch(() => {});
    }
  }, [activeSlot, shouldPlay]);

  // Visibility change
  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.hidden) {
        videoRefA.current?.pause();
        videoRefB.current?.pause();
        return;
      }

      if (!shouldPlay) return;
      const activeVideo = activeSlot === "A" ? videoRefA.current : videoRefB.current;
      if (activeVideo && (!activeVideo.ended || loop)) {
        activeVideo.play().catch(() => {});
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, [activeSlot, shouldPlay, loop]);

  // Transition trigger helper
  const triggerTransition = useCallback(() => {
    if (isSingleClip || isTransitioning) return;

    const currentClipIdx = activeSlot === "A" ? clipIdxA : clipIdxB;
    if (!loop && currentClipIdx === clips.length - 1) {
      const activeVideo = activeSlot === "A" ? videoRefA.current : videoRefB.current;
      activeVideo?.pause();
      return;
    }

    setIsTransitioning(true);

    if (activeSlot === "A") {
      const nextVideo = videoRefB.current;
      if (nextVideo) {
        nextVideo.currentTime = 0;
        nextVideo.play().catch(() => {});
      }
      setActiveSlot("B");
    } else {
      const nextVideo = videoRefA.current;
      if (nextVideo) {
        nextVideo.currentTime = 0;
        nextVideo.play().catch(() => {});
      }
      setActiveSlot("A");
    }
  }, [activeSlot, clipIdxA, clipIdxB, clips.length, isSingleClip, isTransitioning, loop]);

  const handlePlaying = useCallback((slot: "A" | "B") => {
    if (slot === activeSlot && isTransitioning) {
      // Incoming player is now playing on top.
      // Clean up the outgoing background player and queue the next clip.
      if (slot === "B") {
        const prevVideo = videoRefA.current;
        if (prevVideo) {
          prevVideo.pause();
        }
        const nextNextIdx = (clipIdxB + 1) % clips.length;
        setClipIdxA(nextNextIdx);
        setIsTransitioning(false);
        // Reload slot A in background with its new clip
        setTimeout(() => {
          if (videoRefA.current) {
            videoRefA.current.load();
          }
        }, 50);
      } else {
        const prevVideo = videoRefB.current;
        if (prevVideo) {
          prevVideo.pause();
        }
        const nextNextIdx = (clipIdxA + 1) % clips.length;
        setClipIdxB(nextNextIdx);
        setIsTransitioning(false);
        // Reload slot B in background with its new clip
        setTimeout(() => {
          if (videoRefB.current) {
            videoRefB.current.load();
          }
        }, 50);
      }
    }
  }, [activeSlot, clipIdxA, clipIdxB, clips.length, isTransitioning]);

  const handleTimeUpdate = useCallback(
    (element: HTMLVideoElement, slot: "A" | "B") => {
      if (slot !== activeSlot) return;

      if (slot === "A" && clipIdxA === 0 && !hasTriggeredNearEnd.current) {
        if (
          element.currentTime >= 3.6 ||
          (element.duration > 0 && element.duration - element.currentTime <= 3.2)
        ) {
          hasTriggeredNearEnd.current = true;
          onFirstClipNearEnd?.();
        }
      }

      if (isSingleClip) return;
      if (element.duration > 0 && element.currentTime >= element.duration - 0.08) {
        triggerTransition();
      }
    },
    [activeSlot, clipIdxA, isSingleClip, onFirstClipNearEnd, triggerTransition],
  );

  const clipA = clips[clipIdxA];
  const clipB = clips[clipIdxB];

  const classSlotA =
    activeSlot === "A"
      ? activeClassName
      : isTransitioning
        ? "opacity-100 z-0 pointer-events-none"
        : inactiveClassName;

  const classSlotB =
    activeSlot === "B"
      ? activeClassName
      : isTransitioning
        ? "opacity-100 z-0 pointer-events-none"
        : inactiveClassName;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 h-full w-full overflow-hidden bg-black"
    >
      {poster && (
        <Image
          src={poster}
          alt=""
          fill
          preload={posterPreload}
          sizes={posterSizes}
          className={`pointer-events-none select-none ${posterClassName}`}
        />
      )}

      {/* Player A */}
      <video
        ref={videoRefA}
        muted
        playsInline
        loop={loop && isSingleClip}
        preload={sourcesEnabled ? "auto" : "none"}
        onEnded={triggerTransition}
        onPlaying={() => handlePlaying("A")}
        onTimeUpdate={(e) => handleTimeUpdate(e.currentTarget, "A")}
        style={{
          transform: "translateZ(0)",
          backfaceVisibility: "hidden",
        }}
        className={`${className} ${classSlotA}`}
      >
        {sourcesEnabled &&
          getSources(clipA).map((source) => (
            <source
              key={source.src}
              src={source.src}
              type={source.type}
            />
          ))}
      </video>

      {/* Player B (dual buffer for seamless transition) */}
      {!isSingleClip && (
        <video
          ref={videoRefB}
          muted
          playsInline
          preload={sourcesEnabled ? "auto" : "none"}
          onEnded={triggerTransition}
          onPlaying={() => handlePlaying("B")}
          onTimeUpdate={(e) => handleTimeUpdate(e.currentTarget, "B")}
          style={{
            transform: "translateZ(0)",
            backfaceVisibility: "hidden",
          }}
          className={`${className} ${classSlotB}`}
        >
          {sourcesEnabled &&
            getSources(clipB).map((source) => (
              <source
                key={source.src}
                src={source.src}
                type={source.type}
              />
            ))}
        </video>
      )}
    </div>
  );
}
