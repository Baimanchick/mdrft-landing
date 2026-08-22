"use client";

import Image from "next/image";
import React from "react";
import { useLanguage } from "@/shared/lib/i18n/LanguageContext";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="w-full bg-black text-white border-t border-white/10 py-16 sm:py-20 px-6 sm:px-12 lg:px-16 xl:px-20 font-sans">
      <div className="max-w-[1820px] mx-auto space-y-12">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-white/10 text-sm">
          {/* Brand Col with Official Logo */}
          <div className="md:col-span-5 space-y-4">
            <a href="#hero" className="flex items-center">
              <Image
                src="/images/logo.webp"
                alt="M-DRIFT"
                width={1540}
                height={172}
                className="h-8 sm:h-9 w-auto object-contain"
              />
            </a>
            <p className="text-[#8e8e93] max-w-sm leading-relaxed text-sm">
              {t.footer.tagline}
            </p>
          </div>

          {/* Contacts Col */}
          <div className="md:col-span-4 space-y-2">
            <div className="text-white font-bold uppercase tracking-wider text-sm">
              {t.footer.contactsTitle}
            </div>
            <div className="text-[#8e8e93] space-y-1 text-sm">
              <div>{t.footer.locationText}</div>
              <div className="text-white font-medium">{t.footer.phone}</div>
              <div className="text-white font-medium">{t.footer.email}</div>
            </div>
          </div>

          {/* Socials / Hours */}
          <div className="md:col-span-3 space-y-2">
            <div className="text-white font-bold uppercase tracking-wider text-sm">
              {t.footer.hoursTitle}
            </div>
            <div className="text-[#8e8e93] space-y-1 text-sm">
              <div>{t.footer.hoursDaily}</div>
              <div>{t.footer.hoursSeason}</div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm text-[#8e8e93]">
          <div>{t.footer.copyright.replace("{year}", new Date().getFullYear().toString())}</div>
          <div className="flex items-center gap-6 font-medium">
            <span className="hover:text-white transition-colors cursor-pointer">{t.footer.privacy}</span>
            <span className="hover:text-white transition-colors cursor-pointer">{t.footer.terms}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
