"use client";

import { useEffect } from "react";
import { useSmoothScroll } from "./SmoothScrollProvider";

let activeLocks = 0;
let restoreBodyOverflow = "";

export function useScrollLock(isLocked: boolean) {
  const lenis = useSmoothScroll();

  useEffect(() => {
    if (!isLocked) return;

    if (activeLocks === 0) {
      restoreBodyOverflow = document.body.style.overflow;
    }
    activeLocks += 1;
    document.body.style.overflow = "hidden";
    lenis?.stop();

    return () => {
      activeLocks = Math.max(0, activeLocks - 1);
      if (activeLocks === 0) {
        document.body.style.overflow = restoreBodyOverflow;
        lenis?.start();
      }
    };
  }, [isLocked, lenis]);
}
