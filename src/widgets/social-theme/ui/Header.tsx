"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
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

function LanguageSwitcher({
  activeLanguage,
  label,
  onChange,
}: LanguageSwitcherProps) {
  return (
    <div
      role="group"
      aria-label={label}
      className="inline-flex h-8 sm:h-10 items-center rounded-lg sm:rounded-xl border border-white/15 bg-white/[0.06] p-[2px] sm:p-[3px] text-xs uppercase tracking-wider backdrop-blur-xl lg:h-11"
    >
      {(["ru", "en"] as const).map((language) => {
        const isActive = activeLanguage === language;

        return (
          <button
            key={language}
            type="button"
            onClick={() => onChange(language)}
            aria-pressed={isActive}
            className={`flex h-full min-w-8 sm:min-w-10 cursor-pointer items-center justify-center rounded-md sm:rounded-lg border px-2 sm:px-2.5 text-[11px] sm:text-xs font-bold tracking-wider transition-all duration-200 lg:min-w-11 ${
              isActive
                ? "border-white/20 bg-white/20 text-white shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
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
  const { lang, setLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[padding,background-color,border-color,box-shadow] duration-500 ${
        scrolled
          ? "border-b border-white/15 bg-black/92 pt-[max(0.9rem,calc(env(safe-area-inset-top)+0.5rem))] pb-3 sm:py-4 shadow-[0_12px_36px_rgba(0,0,0,0.85)] backdrop-blur-2xl"
          : isRevealed
            ? "border-b border-white/10 bg-gradient-to-b from-black/95 via-black/60 to-transparent pt-[max(1.25rem,calc(env(safe-area-inset-top)+0.75rem))] pb-4 sm:py-6 backdrop-blur-[3px]"
            : "border-b border-transparent bg-transparent pt-[max(1.25rem,calc(env(safe-area-inset-top)+0.75rem))] pb-4 sm:py-6 pointer-events-none"
      }`}
    >
      <div className="relative mx-auto flex w-full max-w-[1920px] items-center justify-between gap-3 px-4 sm:gap-5 sm:px-6 lg:px-10 xl:px-12 min-h-[40px]">
        {/* Left: Official BMW M Drift School Logo */}
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
            className="h-[26px] sm:h-[30px] lg:h-[34px] w-auto object-contain transition-transform duration-200 group-hover:scale-[1.03]"
          />
        </motion.a>

        {/* Center: Desktop Navigation */}
        <motion.nav
          aria-label={t.header.navLabel}
          initial={{ opacity: 0, y: -15 }}
          animate={
            isRevealed
              ? { opacity: 1, y: 0 }
              : { opacity: 0, y: -15 }
          }
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="hidden xl:block"
        >
          <ul className="flex items-center justify-center gap-6 xl:gap-8">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="whitespace-nowrap text-xs font-bold uppercase tracking-[0.08em] text-[#8e8e93] transition-colors duration-200 hover:text-white"
                >
                  {t.header.nav[item.label]}
                </a>
              </li>
            ))}
          </ul>
        </motion.nav>

        {/* Right: Language Switcher + Desktop Booking Button */}
        <motion.div
          initial={{ opacity: 0, y: -15, filter: "blur(6px)" }}
          animate={
            isRevealed
              ? { opacity: 1, y: 0, filter: "blur(0px)" }
              : { opacity: 0, y: -15, filter: "blur(6px)" }
          }
          transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="flex shrink-0 items-center justify-end gap-2.5 sm:gap-3.5"
        >
          <LanguageSwitcher
            activeLanguage={lang}
            label={t.header.languageLabel}
            onChange={setLanguage}
          />

          <div className="hidden xl:block">
            <button
              type="button"
              onClick={onOpenBooking}
              className="btn-swiss-primary h-10 lg:h-11 whitespace-nowrap px-5 text-xs cursor-pointer active:scale-95"
            >
              <span>{t.header.bookBtn}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </header>
  );
}
