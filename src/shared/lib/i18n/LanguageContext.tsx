"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";
import type { Language } from "./types";
import { translations } from "./translations";

interface LanguageContextValue {
  lang: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.ru;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

const STORAGE_KEY = "mdrift_preferred_lang";

const readStoredLanguage = (): Language | null => {
  try {
    const savedLanguage = localStorage.getItem(STORAGE_KEY);
    return savedLanguage === "ru" || savedLanguage === "en" ? savedLanguage : null;
  } catch {
    return null;
  }
};

const storeLanguage = (language: Language) => {
  try {
    localStorage.setItem(STORAGE_KEY, language);
  } catch {
    return;
  }
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>("ru");

  useEffect(() => {
    const savedLanguage = readStoredLanguage();
    if (savedLanguage) {
      setLangState(savedLanguage);
      document.documentElement.lang = savedLanguage;
    }
  }, []);

  const setLanguage = (newLang: Language) => {
    setLangState(newLang);
    document.documentElement.lang = newLang;
    storeLanguage(newLang);
  };

  const value: LanguageContextValue = {
    lang,
    setLanguage,
    t: translations[lang],
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
