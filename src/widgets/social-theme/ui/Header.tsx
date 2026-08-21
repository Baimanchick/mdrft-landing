"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/shared/lib/i18n/LanguageContext";

interface HeaderProps {
  onOpenBooking: () => void;
}

export function Header({ onOpenBooking }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const { lang, setLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-black/90 backdrop-blur-xl py-4 sm:py-5 border-b border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
          : "bg-gradient-to-b from-black/80 via-black/40 to-transparent py-6 sm:py-7"
      }`}
    >
      <div className="w-full max-w-[1920px] mx-auto px-6 sm:px-12 lg:px-16 xl:px-20 relative flex items-center justify-between">
        {/* Left: Brand Logo Image */}
        <a href="#hero" className="flex items-center group shrink-0 z-10">
          <img
            src="/images/logo.webp"
            alt="M-DRIFT"
            className="h-6 sm:h-7 md:h-7.5 w-auto object-contain transition-transform group-hover:scale-105 duration-200"
          />
        </a>

        {/* Center: Perfectly Centered Navigation Menu */}
        <nav className="hidden lg:flex items-center gap-7 xl:gap-10 text-xs sm:text-[13px] font-bold tracking-wider text-[#8e8e93] uppercase absolute left-1/2 -translate-x-1/2">
          <a href="#garage" className="hover:text-white transition-colors duration-200">
            {t.header.nav.garage}
          </a>
          <a href="#about" className="hover:text-white transition-colors duration-200">
            {t.header.nav.about}
          </a>
          <a href="#services" className="hover:text-white transition-colors duration-200">
            {t.header.nav.services}
          </a>
          <a href="#club" className="hover:text-white transition-colors duration-200">
            {t.header.nav.club}
          </a>
          <a href="#tariffs" className="hover:text-white transition-colors duration-200">
            {t.header.nav.tariffs}
          </a>
          <a href="#flagship" className="hover:text-white transition-colors duration-200">
            {t.header.nav.flagship}
          </a>
        </nav>

        {/* Right: Unified Height Language Switcher + CTA Button */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0 z-10">
          {/* Language Switcher */}
          <div className="h-[42px] sm:h-[44px] inline-flex items-center bg-white/[0.06] border border-white/20 rounded-[6px] p-[3px] text-xs uppercase tracking-wider backdrop-blur-md">
            <button
              type="button"
              onClick={() => setLanguage("ru")}
              aria-label="Русский язык"
              className={`h-full px-3 sm:px-3.5 flex items-center justify-center rounded-[4px] text-xs font-bold tracking-wider transition-all duration-200 cursor-pointer ${
                lang === "ru"
                  ? "bg-white/20 text-white border border-white/25 shadow-sm"
                  : "text-[#8e8e93] hover:text-white border border-transparent"
              }`}
            >
              RU
            </button>
            <button
              type="button"
              onClick={() => setLanguage("en")}
              aria-label="English language"
              className={`h-full px-3 sm:px-3.5 flex items-center justify-center rounded-[4px] text-xs font-bold tracking-wider transition-all duration-200 cursor-pointer ${
                lang === "en"
                  ? "bg-white/20 text-white border border-white/25 shadow-sm"
                  : "text-[#8e8e93] hover:text-white border border-transparent"
              }`}
            >
              EN
            </button>
          </div>

          {/* CTA Button */}
          <button
            onClick={onOpenBooking}
            className="btn-swiss-primary h-[42px] sm:h-[44px] text-xs sm:text-sm px-5 sm:px-6"
          >
            <span>{t.header.bookBtn}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
