"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useLanguage } from "@/shared/lib/i18n/LanguageContext";

interface SoundTrack {
  id: string;
  title: string;
  artist: string;
  src: string;
}

const TRACKS: SoundTrack[] = [
  {
    id: "odium",
    title: "Odium",
    artist: "LXST CXNTURY, Kingpin Skinny Pimp",
    src: "/audio/odium.mp3",
  },
  {
    id: "nurega",
    title: "Nurega",
    artist: "Organic Audio",
    src: "/audio/nurega.mp3",
  },
  {
    id: "fuck-you-all",
    title: "Fuck You All",
    artist: "FREXMANE, MSIDIIX",
    src: "/audio/fuck-you-all.mp3",
  },
  {
    id: "feel",
    title: "Feel",
    artist: "Misanthrop",
    src: "/audio/feel.mp3",
  },
  {
    id: "reclaim-the-throne",
    title: "Reclaim the Throne",
    artist: "Swollen Members, Madchild, Tre Nyce",
    src: "/audio/reclaim-the-throne.mp3",
  },
  {
    id: "snake-style",
    title: "Snake Style",
    artist: "FREE FLOW FLAVA",
    src: "/audio/snake-style.mp3",
  },
  {
    id: "six-days-remix",
    title: "Six Days (Remix)",
    artist: "DJ Shadow, Mos Def",
    src: "/audio/six-days-remix.mp3",
  },
  {
    id: "the-girl-next-door",
    title: "the girl next door",
    artist: "IVOXYGEN",
    src: "/audio/the-girl-next-door.mp3",
  },
  {
    id: "i-against-i",
    title: "I Against I",
    artist: "Massive Attack, Mos Def",
    src: "/audio/i-against-i.mp3",
  },
];

const MINI_BAR_SOURCES = [
  { barIndex: 2, minHeight: 25, idleHeight: 35 },
  { barIndex: 8, minHeight: 35, idleHeight: 65 },
  { barIndex: 15, minHeight: 20, idleHeight: 30 },
] as const;

const IDLE_BAR_HEIGHT = 12;
const NUM_BARS = 24;

const BAR_WEIGHTS = [
  0.92, 0.78, 0.95, 0.82, 0.68, 0.88, 0.74, 0.91, 0.83, 0.65, 0.89, 0.72,
  0.84, 0.66, 0.93, 0.76, 0.58, 0.86, 0.69, 0.81, 0.54, 0.78, 0.62, 0.71,
];

export function AudioPlayer({ isRevealed = true }: { isRevealed?: boolean } = {}) {
  const { lang } = useLanguage();
  const isRu = lang === "ru";

  const [isExpanded, setIsExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIdx, setCurrentTrackIdx] = useState(0);
  const [currentTimeSec, setCurrentTimeSec] = useState(0);
  const [volume, setVolume] = useState(0.25);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile, { passive: true });
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const isPlayingRef = useRef(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const currentPeaksRef = useRef<number[]>(Array(NUM_BARS).fill(12));
  const barRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const miniBarRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const track = TRACKS[currentTrackIdx];

  // Auto-collapse when clicking outside
  useEffect(() => {
    if (!isExpanded) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isExpanded]);

  const paintBars = (heights: number[]) => {
    for (let i = 0; i < heights.length; i += 1) {
      const bar = barRefs.current[i];
      if (bar) bar.style.height = `${heights[i]}%`;
    }
    MINI_BAR_SOURCES.forEach((source, idx) => {
      const mini = miniBarRefs.current[idx];
      if (mini) mini.style.height = `${Math.max(source.minHeight, heights[source.barIndex])}%`;
    });
  };

  const resetBars = () => {
    for (const bar of barRefs.current) {
      if (bar) bar.style.height = `${IDLE_BAR_HEIGHT}%`;
    }
    MINI_BAR_SOURCES.forEach((source, idx) => {
      const mini = miniBarRefs.current[idx];
      if (mini) mini.style.height = `${source.idleHeight}%`;
    });
  };

  // Spectrum animation
  useEffect(() => {
    if (!isPlaying) {
      currentPeaksRef.current = Array(NUM_BARS).fill(IDLE_BAR_HEIGHT);
      resetBars();
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }

    let t = 0;
    const renderSpectrum = () => {
      t += 0.038;
      const prevHeights = currentPeaksRef.current;

      const nextHeights = prevHeights.map((prevH, i) => {
        // Fluid harmonic wave oscillation
        const wave1 = Math.sin(t * 1.6 + i * 0.28) * 0.5 + 0.5;
        const wave2 = Math.sin(t * 1.05 - i * 0.18 + 1.2) * 0.5 + 0.5;
        const wave3 = Math.cos(t * 0.65 + i * 0.12) * 0.5 + 0.5;
        const rhythm = Math.pow(Math.sin(t * 1.9) * 0.5 + 0.5, 3) * 0.28;

        const combined = (wave1 * 0.45 + wave2 * 0.35 + wave3 * 0.2) + rhythm * (i < 8 ? 0.5 : 0.2);
        const targetH = 14 + combined * BAR_WEIGHTS[i] * 68;

        // Smooth Exponential Moving Average / LERP
        const lerpFactor = targetH > prevH ? 0.12 : 0.07;
        const newH = prevH + (targetH - prevH) * lerpFactor;

        return Math.max(10, Math.min(92, newH));
      });

      currentPeaksRef.current = nextHeights;
      paintBars(nextHeights);

      animFrameRef.current = requestAnimationFrame(renderSpectrum);
    };

    animFrameRef.current = requestAnimationFrame(renderSpectrum);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying]);

  // Handle track source loading & playback transitions
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.src = TRACKS[currentTrackIdx].src;
    audio.currentTime = 0;
    setCurrentTimeSec(0);

    if (isPlayingRef.current) {
      const p = audio.play();
      if (p !== undefined) {
        p.catch(() => {
          // Play was interrupted or blocked
        });
      }
    }
  }, [currentTrackIdx]);

  // Autoplay on initial load with interaction fallback
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;

    const startPlayback = async () => {
      try {
        await audio.play();
        setIsPlaying(true);
        isPlayingRef.current = true;
      } catch {
        const handleFirstInteraction = async () => {
          try {
            await audio.play();
            setIsPlaying(true);
            isPlayingRef.current = true;
          } catch {}
          window.removeEventListener("pointerdown", handleFirstInteraction);
          window.removeEventListener("keydown", handleFirstInteraction);
          window.removeEventListener("touchstart", handleFirstInteraction);
        };

        window.addEventListener("pointerdown", handleFirstInteraction, { once: true });
        window.addEventListener("keydown", handleFirstInteraction, { once: true });
        window.addEventListener("touchstart", handleFirstInteraction, { once: true });
      }
    };

    startPlayback();
  }, []);

  const selectTrack = useCallback((idx: number, startPlaying = true) => {
    if (startPlaying) {
      setIsPlaying(true);
      isPlayingRef.current = true;
    }
    setCurrentTrackIdx(idx);
  }, []);

  const nextTrack = useCallback(() => {
    selectTrack((currentTrackIdx + 1) % TRACKS.length, true);
  }, [currentTrackIdx, selectTrack]);

  const prevTrack = useCallback(() => {
    const audio = audioRef.current;
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      setCurrentTimeSec(0);
      return;
    }
    selectTrack((currentTrackIdx - 1 + TRACKS.length) % TRACKS.length, true);
  }, [currentTrackIdx, selectTrack]);

  const togglePlayback = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      isPlayingRef.current = false;
    } else {
      setIsPlaying(true);
      isPlayingRef.current = true;
      try {
        await audio.play();
      } catch {
        setIsPlaying(false);
        isPlayingRef.current = false;
      }
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="fixed [bottom:max(5.1rem,calc(env(safe-area-inset-bottom)+4.6rem))] md:bottom-6 inset-x-0 z-40 pointer-events-none">
      <div className="max-w-[1820px] mx-auto px-4 sm:px-6 2xl:px-0 flex justify-center md:justify-end">
        <div ref={containerRef} className="relative pointer-events-auto font-sans flex items-end justify-center md:justify-end">
          <audio
            ref={audioRef}
            preload="auto"
            onTimeUpdate={(e) => setCurrentTimeSec(e.currentTarget.currentTime)}
            onEnded={nextTrack}
            onPlay={() => {
              setIsPlaying(true);
              isPlayingRef.current = true;
            }}
            onPause={() => {
              if (isPlayingRef.current && !audioRef.current?.ended) {
                // If paused unexpectedly, don't desync unless ended
                return;
              }
              setIsPlaying(false);
              isPlayingRef.current = false;
            }}
          />

          {/* Floating Trigger Capsule */}
          <motion.div
            initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
            animate={
              isRevealed && !isExpanded
                ? { opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }
                : isExpanded
                  ? { opacity: 0, scale: 0.9, y: 0 }
                  : { opacity: 0, y: 30, filter: "blur(8px)", scale: 1 }
            }
            transition={{ duration: 0.8, delay: 0.95, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={`relative rounded-full p-[1.5px] overflow-hidden transition-all duration-300 shadow-[0_12px_36px_rgba(0,0,0,0.85)] ${
              isExpanded ? "pointer-events-none" : ""
            }`}
          >
            {/* Animated Flowing Gradient Background Layer (Red -> Dark Blue -> Light Blue -> Red) */}
            {isPlaying ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-[150%] bg-[conic-gradient(from_0deg,#ea4043_0%,#1044a8_35%,#0099ff_65%,#ea4043_100%)] pointer-events-none transform-gpu will-change-transform"
              />
            ) : (
              <div className="absolute inset-0 bg-white/20 rounded-full" />
            )}

            {/* Ambient subtle glow when playing */}
            {isPlaying && (
              <div className="absolute inset-0 bg-gradient-to-r from-[#ea4043]/30 via-[#1044a8]/25 to-[#0099ff]/30 blur-md rounded-full pointer-events-none" />
            )}

            {/* Inner Pill Button */}
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="group relative h-12 sm:h-13 pl-4 sm:pl-5 pr-2.5 sm:pr-3 rounded-full flex items-center gap-3.5 sm:gap-4 cursor-pointer bg-[#0a0a0e] hover:bg-[#121218] text-white select-none transition-colors duration-200"
              aria-label="Open Audio Player"
            >
              {/* Left: Track Status & Title */}
              <div className="text-left min-w-0 flex flex-col justify-center">
                <div className="flex items-center gap-1.5 leading-none mb-1">
                  <span className={`w-1.5 h-1.5 rounded-full ${isPlaying ? "bg-[#ea4043] animate-pulse" : "bg-white/40"}`} />
                  <span className={`text-[10px] font-mono font-semibold tracking-wider uppercase ${isPlaying ? "text-white/80" : "text-white/50"}`}>
                    {isPlaying
                      ? isRu
                        ? "СЕЙЧАС ИГРАЕТ"
                        : "NOW PLAYING"
                      : isRu
                        ? "ВКЛЮЧИТЬ МУЗЫКУ"
                        : "PLAY MUSIC"}
                  </span>
                </div>
                <span className="text-xs sm:text-sm font-extrabold uppercase tracking-tight text-white truncate max-w-[130px] sm:max-w-[190px] leading-tight group-hover:text-[#ea4043] transition-colors">
                  {track.title}
                </span>
              </div>

              {/* Right: Equalizer Icon Circle */}
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/[0.06] border border-white/10 group-hover:border-white/20 flex items-center justify-center shrink-0 transition-colors">
                <div className="flex items-end justify-center gap-[3px] h-4 w-4">
                  <span
                    ref={(element) => {
                      miniBarRefs.current[0] = element;
                    }}
                    style={{ height: "35%" }}
                    className="w-1 bg-[#0099ff] rounded-full transition-none"
                  />
                  <span
                    ref={(element) => {
                      miniBarRefs.current[1] = element;
                    }}
                    style={{ height: "65%" }}
                    className="w-1 bg-[#1044a8] rounded-full transition-none"
                  />
                  <span
                    ref={(element) => {
                      miniBarRefs.current[2] = element;
                    }}
                    style={{ height: "30%" }}
                    className="w-1 bg-[#ea4043] rounded-full transition-none"
                  />
                </div>
              </div>
            </button>
          </motion.div>

          {/* Expanded Player Popover */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0.9,
                  y: 12,
                  originX: isMobile ? 0.5 : 1,
                  originY: 1,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: 0,
                  originX: isMobile ? 0.5 : 1,
                  originY: 1,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.9,
                  y: 12,
                  originX: isMobile ? 0.5 : 1,
                  originY: 1,
                }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                data-lenis-prevent="true"
                onWheel={(e) => e.stopPropagation()}
                className="absolute bottom-0 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-0 w-[min(340px,calc(100vw-2rem))] sm:w-[370px] bg-[#09090c]/98 border border-white/15 rounded-2xl p-6 shadow-[0_30px_70px_rgba(0,0,0,0.98)] backdrop-blur-2xl text-white space-y-5 select-none"
              >
                {/* Header with Track Index */}
                <div className="flex items-center justify-between px-1">
                  <span className="text-sm sm:text-base font-mono text-[#ea4043] font-bold tracking-wider">
                    {String(currentTrackIdx + 1).padStart(2, "0")} / {String(TRACKS.length).padStart(2, "0")}
                  </span>
                  <span className="uppercase tracking-widest text-xs text-[#a0a0a8] font-bold">
                    // M-DRIFT SOUND
                  </span>
                </div>

                {/* Equalizer Spectrum */}
                <div className="relative h-14 flex items-end justify-between px-1 gap-1 overflow-hidden pt-1">
                  {BAR_WEIGHTS.map((_, idx) => (
                    <span
                      key={idx}
                      ref={(element) => {
                        barRefs.current[idx] = element;
                      }}
                      style={{ height: `${IDLE_BAR_HEIGHT}%` }}
                      className={`w-full rounded-xs transition-none ${
                        idx < 8
                          ? "bg-[#0099ff]"
                          : idx < 16
                          ? "bg-[#1044a8]"
                          : "bg-[#ea4043]"
                      }`}
                    />
                  ))}
                </div>

                {/* Time Code & Track Info */}
                <div className="flex items-center justify-between gap-4 px-1">
                  <span className="text-4xl sm:text-[42px] font-extrabold tracking-tight text-white font-mono leading-none">
                    {formatTime(currentTimeSec)}
                  </span>

                  <div className="text-right min-w-0 flex-1 pl-2 space-y-1">
                    <div className="text-base sm:text-lg font-extrabold uppercase tracking-tight text-white truncate leading-tight">
                      {track.title}
                    </div>
                    <div className="text-xs sm:text-sm text-[#a0a0a8] truncate leading-tight font-medium">
                      {track.artist}
                    </div>
                  </div>
                </div>

                {/* Control Buttons */}
                <div className="flex items-center justify-between px-1 pt-1">
                  {/* Previous Track */}
                  <button
                    type="button"
                    onClick={prevTrack}
                    className="w-14 h-14 sm:w-15 sm:h-15 rounded-full bg-[#18181c] hover:bg-[#222228] active:scale-95 border border-white/10 flex items-center justify-center transition-all cursor-pointer text-white/80 hover:text-white"
                    title="Previous Track"
                    aria-label="Previous Track"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polygon points="19 20 9 12 19 4 19 20" fill="currentColor" />
                      <line x1="5" y1="19" x2="5" y2="5" strokeWidth="2.5" />
                    </svg>
                  </button>

                  {/* Play / Pause */}
                  <button
                    type="button"
                    onClick={togglePlayback}
                    className="w-18 h-18 sm:w-19 sm:h-19 rounded-full bg-[#ea4043] hover:bg-[#2c2c34] active:scale-95 text-white flex items-center justify-center transition-all duration-200 cursor-pointer select-none shadow-[0_0_30px_rgba(234,64,67,0.35)]"
                    aria-label={isPlaying ? "Pause" : "Play"}
                  >
                    {isPlaying ? (
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-7 bg-white rounded-full" />
                        <span className="w-2 h-7 bg-white rounded-full" />
                      </div>
                    ) : (
                      <svg
                        width="26"
                        height="26"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="ml-1 text-white"
                      >
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                    )}
                  </button>

                  {/* Next Track */}
                  <button
                    type="button"
                    onClick={nextTrack}
                    className="w-14 h-14 sm:w-15 sm:h-15 rounded-full bg-[#18181c] hover:bg-[#222228] active:scale-95 border border-white/10 flex items-center justify-center transition-all cursor-pointer text-white/80 hover:text-white"
                    title="Next Track"
                    aria-label="Next Track"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polygon points="5 4 15 12 5 20 5 4" fill="currentColor" />
                      <line x1="19" y1="5" x2="19" y2="19" strokeWidth="2.5" />
                    </svg>
                  </button>
                </div>

                {/* Volume Slider */}
                <div className="pt-2 px-1 border-t border-white/10 flex items-center gap-3.5">
                  <button
                    type="button"
                    onClick={() => setVolume((v) => (v > 0 ? 0 : 0.8))}
                    className="text-white/70 hover:text-white transition-colors cursor-pointer shrink-0"
                    aria-label="Mute / Unmute"
                  >
                    {volume === 0 ? (
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-[#ea4043]"
                      >
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                        <line x1="23" y1="9" x2="17" y2="15" />
                        <line x1="17" y1="9" x2="23" y2="15" />
                      </svg>
                    ) : (
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                        {volume > 0.5 && <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />}
                      </svg>
                    )}
                  </button>

                  <div className="relative flex-1 flex items-center h-6 cursor-pointer group">
                    <div className="absolute inset-x-0 h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${volume * 100}%` }}
                        className="h-full bg-gradient-to-r from-white/60 via-white to-[#ea4043] rounded-full transition-all duration-75"
                      />
                    </div>

                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={volume}
                      onChange={(e) => setVolume(parseFloat(e.target.value))}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      aria-label="Volume Slider"
                    />

                    <div
                      style={{ left: `calc(${volume * 100}% - 7px)` }}
                      className="absolute w-3.5 h-3.5 bg-white rounded-full border-2 border-black pointer-events-none transition-all duration-75 group-hover:scale-125"
                    />
                  </div>

                  <span className="text-xs sm:text-sm font-mono font-bold text-white/90 w-8 text-right shrink-0 tracking-tight">
                    {Math.round(volume * 100)}%
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
