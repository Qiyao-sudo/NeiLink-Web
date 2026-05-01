"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { Locale, Translations } from "./types";
import zh from "./zh";
import en from "./en";

const translationsMap: Record<Locale, Translations> = { zh, en };

interface I18nContextValue {
  locale: Locale;
  t: Translations;
  setLocale: (locale: Locale) => void;
}

const I18nContext = createContext<I18nContextValue>({
  locale: "zh",
  t: zh,
  setLocale: () => {},
});

const STORAGE_KEY = "neilink-locale";

function getInitialLocale(): Locale {
  if (typeof window === "undefined") return "zh";
  try {
    const stored = localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (stored === "zh" || stored === "en") return stored;
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith("zh")) return "zh";
    return "en";
  } catch {
    return "zh";
  }
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(getInitialLocale);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    try {
      localStorage.setItem(STORAGE_KEY, newLocale);
    } catch {
      // Ignore storage errors
    }
  }, []);

  const t = translationsMap[locale];

  return (
    <I18nContext.Provider value={{ locale, t, setLocale }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
