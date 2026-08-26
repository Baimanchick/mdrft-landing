"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/shared/lib/i18n/LanguageContext";
import type { Language } from "@/shared/lib/i18n/types";

type HeaderProps = {
  onOpenBooking: () => void;
  isRevealed?: boolean;
};

type LanguageSwitcherProps = {
  activeLanguage: Language;
  label: string;
  onChange: (language: Language) => void;
};

const NAV_ITEMS = [
  { href: "#hero", label: "garage" },
  { href: "#about", label: "about" },
  { href: "#services", label: "services" },
  { href: "#club", label: "club" },
  { href: "#tariffs", label: "tariffs" },
  { href: "#flagship", label: "flagship" },
] as const;

const WIDE_NAV_QUERY = "(min-width: 112rem)";

function LanguageSwitcher({
  activeLanguage,
  label,
  onChange,
}: LanguageSwitcherProps) {
  return (
    <div
      role="group"
      aria-label={label}
      className="inline-flex h-10 items-center rounded-md border border-white/15 bg-white/[0.05] p-[3px] text-xs uppercase tracking-wider backdrop-blur-md lg:h-11"
    >
      {(["ru", "en"] as const).map((language) => {
        const isActive = activeLanguage === language;

        return (
          <button
            key={language}
            type="button"
            onClick={() => onChange(language)}
            aria-pressed={isActive}
            className={`flex h-full min-w-10 cursor-pointer items-center justify-center rounded-[4px] border px-2.5 text-xs font-bold tracking-wider transition-colors duration-200 lg:min-w-11 ${
              isActive
                ? "border-white/20 bg-white/15 text-white"
                : "border-transparent text-[#8e8e93] hover:text-white"
            }`}
          >
            {language.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}

export function Header({ onOpenBooking, isRevealed = true }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const { lang, setLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const wideNavigation = window.matchMedia(WIDE_NAV_QUERY);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    const handleBreakpointChange = (event: MediaQueryListEvent) => {
      if (event.matches) setMenuOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    wideNavigation.addEventListener("change", handleBreakpointChange);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      wideNavigation.removeEventListener("change", handleBreakpointChange);
    };
  }, [menuOpen]);

  const handleBooking = () => {
    setMenuOpen(false);
    onOpenBooking();
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-[padding,background-color,border-color,box-shadow] duration-700 ${
        scrolled || menuOpen
          ? "border-white/15 bg-black/90 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.7)] backdrop-blur-xl sm:py-3.5"
          : isRevealed
            ? "border-white/10 bg-gradient-to-b from-black/85 via-black/45 to-transparent py-4 sm:py-5 backdrop-blur-[2px]"
            : "border-transparent bg-transparent py-4 sm:py-5 pointer-events-none"
      }`}
    >
      <div className="relative mx-auto grid w-full max-w-[1920px] grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 sm:gap-5 sm:px-6 lg:px-10 xl:px-12">
        <motion.a
          href="#hero"
          initial={{ opacity: 0, y: -20, filter: "blur(8px)" }}
          animate={
            isRevealed
              ? { opacity: 1, y: 0, filter: "blur(0px)" }
              : { opacity: 0, y: -20, filter: "blur(8px)" }
          }
          transition={{ duration: 0.8, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
          className="group relative z-10 flex shrink-0 items-center"
        >
          <Image
            src="/images/logo.webp"
            alt="M Drift School"
            width={1540}
            height={172}
            className="h-[18px] w-auto object-contain transition-transform duration-200 group-hover:scale-[1.03] sm:h-[22px] lg:h-[26px]"
          />
        </motion.a>

        <motion.nav
          aria-label={t.header.navLabel}
          initial={{ opacity: 0, y: -15 }}
          animate={
            isRevealed
              ? { opacity: 1, y: 0 }
              : { opacity: 0, y: -15 }
          }
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="hidden min-[112rem]:block"
        >
          <ul className="flex items-center justify-center gap-5 min-[120rem]:gap-7">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="whitespace-nowrap text-[11px] font-bold uppercase tracking-[0.08em] text-[#8e8e93] transition-colors duration-200 hover:text-white"
                >
                  {t.header.nav[item.label]}
                </a>
              </li>
            ))}
          </ul>
        </motion.nav>

        <motion.div
          initial={{ opacity: 0, y: -15, filter: "blur(6px)" }}
          animate={
            isRevealed
              ? { opacity: 1, y: 0, filter: "blur(0px)" }
              : { opacity: 0, y: -15, filter: "blur(6px)" }
          }
          transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="col-start-3 flex shrink-0 items-center justify-end gap-2 sm:gap-3"
        >
          <div className="hidden sm:block">
            <LanguageSwitcher
              activeLanguage={lang}
              label={t.header.languageLabel}
              onChange={setLanguage}
            />
          </div>

          <button
            ref={menuButtonRef}
            type="button"
            onClick={handleBooking}
            className="btn-swiss-primary hidden h-10 whitespace-nowrap px-4 text-xs lg:inline-flex lg:h-11 lg:px-5"
          >
            <span>{t.header.bookBtn}</span>
          </button>

          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls="primary-navigation-menu"
            aria-label={menuOpen ? t.header.menuClose : t.header.menuOpen}
            onClick={() => setMenuOpen((isOpen) => !isOpen)}
            className="flex size-10 cursor-pointer items-center justify-center rounded-md border border-white/15 bg-white/[0.05] text-white transition-colors duration-200 hover:border-white/35 hover:bg-white/10 lg:size-11 min-[112rem]:hidden"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="size-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="square"
            >
              {menuOpen ? (
                <path d="M6 6 18 18M18 6 6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </motion.div>
      </div>

      {menuOpen ? (
        <div
          id="primary-navigation-menu"
          className="absolute inset-x-0 top-full max-h-[calc(100svh-4rem)] overflow-y-auto border-b border-white/10 bg-black/95 shadow-[0_24px_60px_rgba(0,0,0,0.65)] backdrop-blur-xl min-[112rem]:hidden"
        >
          <div className="mx-auto w-full max-w-[1920px] px-4 py-4 sm:px-6 sm:py-5 lg:px-10 xl:px-12">
            <nav aria-label={t.header.navLabel}>
              <ul className="grid gap-px overflow-hidden rounded-md border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
                {NAV_ITEMS.map((item) => (
                  <li key={item.href} className="bg-[#08090b]">
                    <a
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className="flex min-h-14 items-center justify-between px-4 text-xs font-bold uppercase tracking-[0.08em] text-[#b4b4ba] transition-colors duration-200 hover:bg-white/[0.04] hover:text-white sm:px-5"
                    >
                      <span>{t.header.nav[item.label]}</span>
                      <span aria-hidden="true" className="text-[#ea4043]">
                        ↗
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="mt-3 flex items-stretch gap-2 lg:hidden">
              <div className="sm:hidden">
                <LanguageSwitcher
                  activeLanguage={lang}
                  label={t.header.languageLabel}
                  onChange={setLanguage}
                />
              </div>
              <button
                type="button"
                onClick={handleBooking}
                className="btn-swiss-primary min-h-10 flex-1 px-4 text-xs"
              >
                <span>{t.header.bookBtn}</span>
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
