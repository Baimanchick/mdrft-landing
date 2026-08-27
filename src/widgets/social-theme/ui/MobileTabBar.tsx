"use client";

import { LayoutGroup, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useSmoothScroll } from "@/shared/ui/smooth-scroll/SmoothScrollProvider";

interface MobileTabBarProps {
  isRevealed?: boolean;
}

type TabKey = "hero" | "about" | "services" | "club" | "tariffs" | "flagship";

const SECTIONS_ORDER: TabKey[] = [
  "hero",
  "about",
  "services",
  "club",
  "tariffs",
  "flagship",
];

export function MobileTabBar({ isRevealed = true }: MobileTabBarProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("hero");
  const isNavigatingRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lenis = useSmoothScroll();

  useEffect(() => {
    const handleScroll = () => {
      if (isNavigatingRef.current) return;

      const scrollY = window.scrollY || window.pageYOffset;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;

      // 1. If at the bottom of the document, lock to flagship
      if (scrollY + windowHeight >= docHeight - 80) {
        setActiveTab("flagship");
        return;
      }

      // 2. If at the top of the page, lock to hero
      if (scrollY <= 100) {
        setActiveTab("hero");
        return;
      }

      // 3. Middle probe test
      const probeY = windowHeight * 0.45;

      for (let i = 0; i < SECTIONS_ORDER.length; i++) {
        const sectionId = SECTIONS_ORDER[i];
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= probeY && rect.bottom > probeY) {
            setActiveTab(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  const handleNavClick = (sectionId: string, tabKey: TabKey) => {
    setActiveTab(tabKey);
    isNavigatingRef.current = true;

    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => {
      isNavigatingRef.current = false;
    }, 1200);

    const targetEl = document.getElementById(sectionId);
    if (targetEl) {
      if (lenis) {
        lenis.scrollTo(targetEl, { offset: -60, duration: 1.1 });
      } else {
        const headerOffset = 60;
        const elementPosition = targetEl.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
          top: Math.max(0, elementPosition - headerOffset),
          behavior: "smooth",
        });
      }
    }
  };

  const tabs = [
    {
      id: "hero" as TabKey,
      label: "Главная",
      onClick: () => handleNavClick("hero", "hero"),
      icon: (
        <svg
          viewBox="0 0 24 24"
          className="w-[21px] h-[21px] sm:w-[23px] sm:h-[23px]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.1"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
    },
    {
      id: "about" as TabKey,
      label: "О нас",
      onClick: () => handleNavClick("about", "about"),
      icon: (
        <svg
          viewBox="0 0 24 24"
          className="w-[21px] h-[21px] sm:w-[23px] sm:h-[23px]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.1"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="9.5" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <circle cx="12" cy="8" r="1" fill="currentColor" />
        </svg>
      ),
    },
    {
      id: "services" as TabKey,
      label: "Преимущества",
      onClick: () => handleNavClick("services", "services"),
      icon: (
        <svg
          viewBox="0 0 24 24"
          className="w-[21px] h-[21px] sm:w-[23px] sm:h-[23px]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.1"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3.5" y="3.5" width="7" height="7" rx="2" />
          <rect x="13.5" y="3.5" width="7" height="7" rx="2" />
          <rect x="3.5" y="13.5" width="7" height="7" rx="2" />
          <rect x="13.5" y="13.5" width="7" height="7" rx="2" />
        </svg>
      ),
    },
    {
      id: "club" as TabKey,
      label: "M-Community",
      onClick: () => handleNavClick("club", "club"),
      icon: (
        <svg
          viewBox="0 0 24 24"
          className="w-[21px] h-[21px] sm:w-[23px] sm:h-[23px]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.1"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="7.5" r="3.5" />
          <path d="M6 19c0-3.2 2.7-5.5 6-5.5s6 2.3 6 5.5" />
        </svg>
      ),
    },
    {
      id: "tariffs" as TabKey,
      label: "Тарифы",
      onClick: () => handleNavClick("tariffs", "tariffs"),
      icon: (
        <svg
          viewBox="0 0 24 24"
          className="w-[21px] h-[21px] sm:w-[23px] sm:h-[23px]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.1"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
          <circle cx="7" cy="7" r="1.5" fill="currentColor" />
        </svg>
      ),
    },
    {
      id: "flagship" as TabKey,
      label: "Флагман",
      onClick: () => handleNavClick("flagship", "flagship"),
      icon: (
        <svg
          viewBox="0 0 24 24"
          className="w-[21px] h-[21px] sm:w-[23px] sm:h-[23px]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.1"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m2 5 3.5 12h13L22 5l-6 6.5L12 4 8 11.5 2 5z" />
          <path d="M5 20h14" />
        </svg>
      ),
    },
  ];

  return (
    <motion.nav
      aria-label="Mobile Navigation"
      initial={{ y: 80, opacity: 0 }}
      animate={
        isRevealed
          ? { y: 0, opacity: 1 }
          : { y: 80, opacity: 0 }
      }
      transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="fixed bottom-[max(1.1rem,calc(env(safe-area-inset-bottom)+0.65rem))] inset-x-2.5 sm:inset-x-6 max-w-[580px] mx-auto z-50 block md:hidden pointer-events-auto"
    >
      <div className="w-full p-1.5 sm:p-2 rounded-full bg-[#09090e]/95 backdrop-blur-2xl border border-white/15 shadow-[0_18px_55px_rgba(0,0,0,0.95)]">
        <LayoutGroup id="mobile-tab-navigation">
          <div className="grid grid-cols-6 items-center justify-items-center w-full">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={tab.onClick}
                  aria-label={tab.label}
                  className="relative flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full cursor-pointer select-none active:scale-95"
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTabIndicatorPill"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                        mass: 0.8,
                      }}
                      className="absolute inset-0 rounded-full bg-white shadow-[0_2px_18px_rgba(255,255,255,0.4)]"
                    />
                  )}

                  <span
                    className={`relative z-10 transition-colors duration-200 ${
                      isActive ? "text-black" : "text-[#8e8e93] hover:text-white"
                    }`}
                  >
                    {tab.icon}
                  </span>
                </button>
              );
            })}
          </div>
        </LayoutGroup>
      </div>
    </motion.nav>
  );
}
