"use client";

import { useEffect, useRef, type KeyboardEvent, type RefObject } from "react";
import { useScrollLock } from "@/shared/ui/smooth-scroll";

export const APP_SHELL_ID = "app-shell";

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

let inertLocks = 0;

function lockAppShell() {
  inertLocks += 1;
  const shell = document.getElementById(APP_SHELL_ID);
  if (shell) shell.inert = true;
}

function releaseAppShell() {
  inertLocks -= 1;
  if (inertLocks > 0) return;
  const shell = document.getElementById(APP_SHELL_ID);
  if (shell) shell.inert = false;
}

interface ModalA11yOptions {
  onClose: () => void;
  labelledById: string;
}

interface ModalA11yResult {
  panelRef: RefObject<HTMLDivElement | null>;
  dialogProps: {
    role: "dialog";
    "aria-modal": true;
    "aria-labelledby": string;
    onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void;
  };
}

export function useModalA11y({ onClose, labelledById }: ModalA11yOptions): ModalA11yResult {
  const panelRef = useRef<HTMLDivElement | null>(null);

  useScrollLock(true);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    lockAppShell();

    const panel = panelRef.current;
    const firstFocusable = panel?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
    (firstFocusable ?? panel)?.focus({ preventScroll: true });

    return () => {
      releaseAppShell();
      previouslyFocused?.focus?.({ preventScroll: true });
    };
  }, []);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.stopPropagation();
      onClose();
      return;
    }

    if (event.key !== "Tab") return;

    const panel = panelRef.current;
    if (!panel) return;

    const focusable = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
      (element) => element.offsetParent !== null,
    );

    if (focusable.length === 0) {
      event.preventDefault();
      panel.focus({ preventScroll: true });
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;

    if (event.shiftKey && (active === first || active === panel)) {
      event.preventDefault();
      last.focus();
      return;
    }

    if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return {
    panelRef,
    dialogProps: {
      role: "dialog",
      "aria-modal": true,
      "aria-labelledby": labelledById,
      onKeyDown,
    },
  };
}
