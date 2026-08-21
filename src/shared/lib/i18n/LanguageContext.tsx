"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Language } from "./types";
import { translations } from "./translations";

interface LanguageContextValue {
  lang: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: typeof translations.ru;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

const STORAGE_KEY = "mdrift_preferred_lang";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>("ru");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem(STORAGE_KEY) as Language | null;
      if (savedLang === "ru" || savedLang === "en") {
        setLangState(savedLang);
        document.documentElement.lang = savedLang;
      }
    } catch {
      // ignore
    }
    setMounted(true);
  }, []);

  const setLanguage = (newLang: Language) => {
    setLangState(newLang);
    try {
      localStorage.setItem(STORAGE_KEY, newLang);
      document.documentElement.lang = newLang;
    } catch {
      // ignore
    }
  };

  const toggleLanguage = () => {
    setLanguage(lang === "ru" ? "en" : "ru");
  };

  const value: LanguageContextValue = {
    lang,
    setLanguage,
    toggleLanguage,
    t: translations[lang],
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) {
    // Fallback for SSR or non-wrapped cases
    return {
      lang: "ru",
      setLanguage: () => {},
      toggleLanguage: () => {},
      t: translations.ru,
    };
  }
  return context;
}
