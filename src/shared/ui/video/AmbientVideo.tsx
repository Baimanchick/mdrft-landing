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
  poster: string;
  posterClassName?: string;
  posterPreload?: boolean;
  posterSizes?: string;
  isEnabled?: boolean;
  loop?: boolean;
  className: string;
  activeClassName: string;
  inactiveClassName: string;
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
  const connection = (navigator as NavigatorWithConnection).connection;
  return (
    connection?.saveData !== true &&
    connection?.effectiveType !== "slow-2g" &&
    connection?.effectiveType !== "2g"
  );
}

function getSources(clip: AmbientVideoClip) {
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
}: AmbientVideoProps) {
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const [sourcesEnabled, setSourcesEnabled] = useState(false);
  const [readyIndexes, setReadyIndexes] = useState<readonly number[]>([]);
  const isSingleClip = clips.length === 1;
  const shouldPlay =
    isEnabled && isInView && sourcesEnabled && !prefersReducedMotion;

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
          isEnabled &&
          !prefersReducedMotion &&
          canLoadAmbientVideo()
        ) {
          setSourcesEnabled(true);
        }
      },
      { rootMargin: isMobile ? "200px" : "600px" },
    );
    playbackObserver.observe(container);
    sourceObserver.observe(container);

    return () => {
      playbackObserver.disconnect();
      sourceObserver.disconnect();
    };
  }, [isEnabled, prefersReducedMotion]);

  useEffect(() => {
    if (!sourcesEnabled) return;
    videoRefs.current[activeIdx]?.load();
  }, [activeIdx, sourcesEnabled]);

  useEffect(() => {
    const active = videoRefs.current[activeIdx];
    if (!active) return;

    if (!shouldPlay || (active.ended && !loop)) {
      active.pause();
      return;
    }

    active.play().catch(() => {});

  }, [activeIdx, shouldPlay, loop]);

  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.hidden) {
        for (const video of videoRefs.current) video?.pause();
        return;
      }

      if (!shouldPlay) return;
      const active = videoRefs.current[activeIdx];
      if (active && (!active.ended || loop)) {
        active.play().catch(() => {});
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, [activeIdx, shouldPlay, loop]);

  useEffect(() => {
    const videos = videoRefs.current.slice();
    return () => {
      for (const video of videos) video?.pause();
    };
  }, []);

  const handleEnded = useCallback(
    (idx: number) => {
      if (idx === clips.length - 1 && !loop) {
        videoRefs.current[idx]?.pause();
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
      if (loop || (!isSingleClip && idx < clips.length - 1)) return;
      if (element.duration > 0 && element.currentTime >= element.duration - 0.04) {
        element.pause();
      }
    },
    [clips.length, isSingleClip, loop],
  );

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 h-full w-full overflow-hidden bg-black"
    >
      <Image
        src={poster}
        alt=""
        fill
        preload={posterPreload}
        sizes={posterSizes}
        className={`pointer-events-none select-none ${posterClassName}`}
      />

      {clips.map((clip, idx) => {
        const clipKey = clip.webm ?? clip.mp4 ?? String(idx);
        const isReady = readyIndexes.includes(idx);
        const isNextClip =
          !isSingleClip && idx === (activeIdx + 1) % clips.length;
        const preload =
          sourcesEnabled && (idx === activeIdx || isNextClip)
            ? idx === activeIdx
              ? "metadata"
              : "auto"
            : "none";

        return (
          <video
            key={clipKey}
            ref={(element) => {
              videoRefs.current[idx] = element;
            }}
            muted
            playsInline
            loop={loop && isSingleClip}
            preload={preload}
            onEnded={() => handleEnded(idx)}
            onTimeUpdate={(event) =>
              handleTimeUpdate(event.currentTarget, idx)
            }
            onLoadedData={() => {
              setReadyIndexes((current) =>
                current.includes(idx) ? current : [...current, idx],
              );
            }}
            style={{
              transform: "translateZ(0)",
              backfaceVisibility: "hidden",
            }}
            className={`${className} ${
              idx === activeIdx && isReady
                ? activeClassName
                : inactiveClassName
            }`}
          >
            {getSources(clip).map((source) => (
              <source
                key={source.src}
                src={sourcesEnabled ? source.src : undefined}
                type={source.type}
              />
            ))}
          </video>
        );
      })}
    </div>
  );
}
