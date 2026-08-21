"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

interface SoundTrack {
  id: string;
  name: string;
  src: string;
}

const TRACKS: SoundTrack[] = [
  {
    id: "solto-night",
    name: "SOLTO CLUB — NIGHT TRACK",
    src: "/audio/night-track.mp3",
  },
];

const NUM_BARS = 24;

// Individual unique frequency band curves & variations for each bar
const BAR_WEIGHTS = [
  0.92, 0.78, 0.95, 0.82, 0.68, 0.88, 0.74, 0.91, 0.83, 0.65, 0.89, 0.72,
  0.84, 0.66, 0.93, 0.76, 0.58, 0.86, 0.69, 0.81, 0.54, 0.78, 0.62, 0.71,
];

export function AudioPlayer() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIdx, setCurrentTrackIdx] = useState(0);
  const [currentTimeSec, setCurrentTimeSec] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [barHeights, setBarHeights] = useState<number[]>(
    Array(NUM_BARS).fill(12)
  );

  const containerRef = useRef<HTMLDivElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const currentPeaksRef = useRef<number[]>(Array(NUM_BARS).fill(12));

  const track = TRACKS[currentTrackIdx];

  // Auto-collapse when clicking or tapping outside
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

  // Connect Web Audio API Analyser
  const setupAudioContext = () => {
    if (!audioRef.current) return;
    if (!audioCtxRef.current) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioContextClass();
      audioCtxRef.current = ctx;

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 128;
      analyser.smoothingTimeConstant = 0.1; // crisp transients
      analyserRef.current = analyser;

      if (!sourceNodeRef.current) {
        try {
          const source = ctx.createMediaElementSource(audioRef.current);
          source.connect(analyser);
          analyser.connect(ctx.destination);
          sourceNodeRef.current = source;
        } catch {
          // Source already connected
        }
      }
    }

    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
  };

  // Sharp Peak & Gravity Drop Audio Spectrum Physics (Every bar has a distinct height)
  useEffect(() => {
    if (!isPlaying) {
      setBarHeights(Array(NUM_BARS).fill(12));
      currentPeaksRef.current = Array(NUM_BARS).fill(12);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }

    let t = 0;
    const renderSpectrum = () => {
      t += 0.2;
      const prevHeights = currentPeaksRef.current;
      const dataArray = analyserRef.current
        ? new Uint8Array(analyserRef.current.frequencyBinCount)
        : null;

      if (analyserRef.current && dataArray) {
        analyserRef.current.getByteFrequencyData(dataArray);
      }

      const nextHeights = prevHeights.map((prevH, i) => {
        let targetH = 12;

        if (dataArray) {
          // Spread bins across whole frequency spectrum
          const binIdx = Math.min(
            dataArray.length - 1,
            Math.floor((i / NUM_BARS) * (dataArray.length * 0.75))
          );
          const rawEnergy = (dataArray[binIdx] || 0) / 255;
          const bassBoost = (dataArray[1] || 0) / 255;

          // Individual variation per bar
          const weight = BAR_WEIGHTS[i];
          const dynamicSpike = rawEnergy * 0.7 + (i < 8 ? bassBoost * 0.35 : (dataArray[i] || 0) / 510);
          
          targetH = Math.round(12 + dynamicSpike * weight * 86);
        } else {
          // Fallback musical dance pattern
          const wave = Math.sin(t * 3.5 + i * 0.75) * 0.5 + 0.5;
          targetH = Math.round(12 + wave * BAR_WEIGHTS[i] * 82);
        }

        // Peak & Sharp Drop Physics:
        // If new target is higher, snap up sharply instantly!
        // If lower, drop sharply with gravity decay!
        let newH: number;
        if (targetH > prevH) {
          newH = targetH; // Sharp instant upward leap
        } else {
          newH = Math.max(12, prevH - 8); // Sharp rapid gravity fall
        }

        return Math.max(10, Math.min(96, newH));
      });

      currentPeaksRef.current = nextHeights;
      setBarHeights(nextHeights);

      animFrameRef.current = requestAnimationFrame(renderSpectrum);
    };

    animFrameRef.current = requestAnimationFrame(renderSpectrum);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying]);

  // Audio Play / Pause handler
  const togglePlayback = async () => {
    if (!audioRef.current) return;

    setupAudioContext();

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch {
        // Autoplay policy
      }
    }
  };

  const restartTrack = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentTimeSec(0);
      if (!isPlaying) {
        togglePlayback();
      }
    }
  };

  // Sync volume with real audio element
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
    /* Grid-Aligned Fixed Wrapper matching site max-w-[1820px] and vertical grid borders */
    <div className="fixed bottom-6 inset-x-0 z-40 pointer-events-none">
      <div className="max-w-[1820px] mx-auto px-4 sm:px-6 2xl:px-0 flex justify-end">
        {/* Local Anchor container for zero-shift position stability flush on the grid line */}
        <div ref={containerRef} className="relative pointer-events-auto font-sans flex items-end justify-end">
          {/* Real Native HTML5 Audio Element streaming Solto Club Music */}
          <audio
            ref={audioRef}
            src={track.src}
            preload="metadata"
            onTimeUpdate={(e) => setCurrentTimeSec(e.currentTarget.currentTime)}
            onEnded={() => setIsPlaying(false)}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />

          {/* 1. Permanent Fixed-Anchor Floating Trigger Button */}
          <motion.button
            onClick={() => setIsExpanded(!isExpanded)}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            className={`relative w-14 h-14 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 border ${
              isPlaying
                ? "bg-black border-[#ea4043]"
                : "bg-[#0a0a0c]/95 border-white/20 hover:border-white/40 text-white"
            } ${isExpanded ? "opacity-0 pointer-events-none scale-75" : "opacity-100"}`}
            aria-label="Open Audio Player"
          >
            {/* Animated 3-bar voice memo icon */}
            <div className="flex items-end justify-center gap-1 h-6 w-6">
              <span
                style={{ height: isPlaying ? `${Math.max(25, barHeights[2])}%` : "35%" }}
                className="w-1 bg-[#ea4043] rounded-full transition-none"
              />
              <span
                style={{ height: isPlaying ? `${Math.max(35, barHeights[8])}%` : "65%" }}
                className="w-1 bg-white rounded-full transition-none"
              />
              <span
                style={{ height: isPlaying ? `${Math.max(20, barHeights[15])}%` : "30%" }}
                className="w-1 bg-[#0099ff] rounded-full transition-none"
              />
            </div>

            {isPlaying && (
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#ea4043] border border-black animate-ping" />
            )}
          </motion.button>

          {/* 2. Expanded Player Popover anchored to the exact same bottom-right coordinate */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10, originX: 1, originY: 1 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                data-lenis-prevent="true"
                onWheel={(e) => e.stopPropagation()}
                className="absolute bottom-0 right-0 w-[280px] sm:w-[310px] bg-[#09090c]/98 border border-white/15 rounded-xl p-5 sm:p-6 shadow-[0_25px_60px_rgba(0,0,0,0.95)] backdrop-blur-2xl text-white space-y-5 select-none"
              >
                {/* Top Area: 3-Color Bouncing M-Equalizer Spectrum (Distinct Height Per Bar) */}
                <div className="relative h-14 flex items-end justify-between px-1 gap-1 overflow-hidden pt-2">
                  {barHeights.map((height, idx) => (
                    <span
                      key={idx}
                      style={{ height: `${height}%` }}
                      className={`w-full rounded-xs transition-none ${
                        idx < 8
                          ? "bg-[#0099ff]"
                          : idx < 16
                          ? "bg-white"
                          : "bg-[#ea4043]"
                      }`}
                    />
                  ))}
                </div>

                {/* Time Code & Track Title */}
                <div className="flex items-center justify-between gap-3 px-1">
                  {/* Clean Digital Time */}
                  <span className="text-3xl sm:text-[34px] font-normal tracking-tight text-white font-mono leading-none">
                    {formatTime(currentTimeSec)}
                  </span>

                  {/* Current Song Title Only */}
                  <div className="text-right min-w-0 flex-1 pl-2">
                    <div className="text-xs font-bold uppercase tracking-wider text-white truncate leading-tight">
                      {track.name}
                    </div>
                  </div>
                </div>

                {/* 3 Circular Control Buttons: [Restart/Prev] [Play/Pause] [Next] */}
                <div className="flex items-center justify-between px-1 pt-1">
                  {/* Left Button: Previous / Restart Track */}
                  <button
                    type="button"
                    onClick={restartTrack}
                    className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#18181c] hover:bg-[#222228] active:scale-95 border border-white/10 flex items-center justify-center transition-all cursor-pointer text-white/80 hover:text-white"
                    title="Restart Track"
                    aria-label="Restart Track"
                  >
                    <svg
                      width="18"
                      height="18"
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

                  {/* Center Hero Button: Red Play / Pause (Turns Gray on Hover, No Glow) */}
                  <button
                    type="button"
                    onClick={togglePlayback}
                    className="w-16 h-16 sm:w-17 sm:h-17 rounded-full bg-[#ea4043] hover:bg-[#2c2c34] active:scale-95 text-white flex items-center justify-center transition-all duration-200 cursor-pointer select-none"
                    aria-label={isPlaying ? "Pause" : "Play"}
                  >
                    {isPlaying ? (
                      /* Pause Icon (Double vertical bars) */
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-6 bg-white rounded-full" />
                        <span className="w-1.5 h-6 bg-white rounded-full" />
                      </div>
                    ) : (
                      /* Play Triangle Icon */
                      <svg
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="ml-1 text-white"
                      >
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                    )}
                  </button>

                  {/* Right Button: Next / Loop Track */}
                  <button
                    type="button"
                    onClick={restartTrack}
                    className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#18181c] hover:bg-[#222228] active:scale-95 border border-white/10 flex items-center justify-center transition-all cursor-pointer text-white/80 hover:text-white"
                    title="Next Track"
                    aria-label="Next Track"
                  >
                    <svg
                      width="18"
                      height="18"
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

                {/* Bottom Luxury Volume Slider */}
                <div className="pt-3 px-1 border-t border-white/10 flex items-center gap-3.5">
                  {/* Speaker Icon */}
                  <button
                    type="button"
                    onClick={() => setVolume((v) => (v > 0 ? 0 : 0.8))}
                    className="text-white/70 hover:text-white transition-colors cursor-pointer shrink-0"
                    aria-label="Mute / Unmute"
                  >
                    {volume === 0 ? (
                      <svg
                        width="17"
                        height="17"
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
                        width="17"
                        height="17"
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

                  {/* Custom Track with Filled Progress & Range Controller */}
                  <div className="relative flex-1 flex items-center h-6 cursor-pointer group">
                    {/* Background Track */}
                    <div className="absolute inset-x-0 h-2 bg-white/10 rounded-full overflow-hidden">
                      {/* Active Filled Gradient */}
                      <div
                        style={{ width: `${volume * 100}%` }}
                        className="h-full bg-gradient-to-r from-white/60 via-white to-[#ea4043] rounded-full transition-all duration-75"
                      />
                    </div>

                    {/* Range Input for Native Dragging / Clicking */}
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

                    {/* Custom Thumb Indicator */}
                    <div
                      style={{ left: `calc(${volume * 100}% - 7px)` }}
                      className="absolute w-3.5 h-3.5 bg-white rounded-full border-2 border-black pointer-events-none transition-all duration-75 group-hover:scale-125"
                    />
                  </div>

                  {/* Percentage Indicator */}
                  <span className="text-xs font-mono font-bold text-white/90 w-8 text-right shrink-0 tracking-tight">
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
