"use client";

import Image from "next/image";
import { useLanguage } from "@/shared/lib/i18n/LanguageContext";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="w-full bg-black text-white border-t border-white/10 pt-10 sm:pt-20 pb-[max(5rem,calc(env(safe-area-inset-bottom)+4.5rem))] px-4 sm:px-12 lg:px-16 xl:px-20 font-sans">
      <div className="max-w-[1820px] mx-auto space-y-8 sm:space-y-12">
        {/* Mobile Quick Action Tiles */}
        <div className="grid grid-cols-2 gap-2.5 sm:hidden">
          <a
            href="https://t.me/mdrift_school"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 rounded-xl border border-white/10 bg-white/[0.03] active:bg-white/10 flex items-center justify-between transition-colors"
          >
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-mono text-[#8e8e93] font-semibold">TELEGRAM</span>
              <div className="text-xs font-bold text-white">@mdrift_school</div>
            </div>
            <span className="text-sm text-[#ea4043]">↗</span>
          </a>

          <a
            href="tel:+74950000000"
            className="p-3.5 rounded-xl border border-white/10 bg-white/[0.03] active:bg-white/10 flex items-center justify-between transition-colors"
          >
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-mono text-[#8e8e93] font-semibold">ТЕЛЕФОН</span>
              <div className="text-xs font-bold text-white">+7 (495) M-DRIFT</div>
            </div>
            <span className="text-sm text-[#ea4043]">↗</span>
          </a>
        </div>

        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 pb-6 sm:pb-12 border-b border-white/10 text-sm">
          {/* Brand Col with Official Logo */}
          <div className="md:col-span-5 space-y-3 sm:space-y-4">
            <a href="#hero" className="flex items-center">
              <Image
                src="/images/logo.webp"
                alt="M-DRIFT"
                width={1540}
                height={172}
                className="h-5 sm:h-9 w-auto max-w-full object-contain"
              />
            </a>
            <p className="text-[#8e8e93] max-w-sm leading-relaxed text-xs sm:text-sm font-light">
              {t.footer.tagline}
            </p>
          </div>

          {/* Contacts Col */}
          <div className="md:col-span-4 space-y-2">
            <div className="text-white font-bold uppercase tracking-wider text-xs sm:text-sm">
              {t.footer.contactsTitle}
            </div>
            <div className="text-[#8e8e93] space-y-1 text-xs sm:text-sm font-light">
              <div>{t.footer.locationText}</div>
              <div className="text-white font-medium">{t.footer.phone}</div>
              <div className="text-white font-medium">{t.footer.email}</div>
            </div>
          </div>

          {/* Socials / Hours */}
          <div className="md:col-span-3 space-y-2">
            <div className="text-white font-bold uppercase tracking-wider text-xs sm:text-sm">
              {t.footer.hoursTitle}
            </div>
            <div className="text-[#8e8e93] space-y-1 text-xs sm:text-sm font-light">
              <div>{t.footer.hoursDaily}</div>
              <div>{t.footer.hoursSeason}</div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm text-[#8e8e93]">
          <div>{t.footer.copyright.replace("{year}", new Date().getFullYear().toString())}</div>
          <div className="flex flex-wrap items-center gap-x-4 sm:gap-x-6 gap-y-1 font-medium">
            <span className="hover:text-white transition-colors cursor-pointer">{t.footer.privacy}</span>
            <span className="hover:text-white transition-colors cursor-pointer">{t.footer.terms}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
