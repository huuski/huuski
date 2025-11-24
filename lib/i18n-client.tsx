"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { type Locale } from "./i18n";

const LOCALE_COOKIE = "dealdeck-locale";

type I18nContextType = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({
  children,
  initialLocale,
}: {
  children: ReactNode;
  initialLocale: Locale;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const [messages, setMessages] = useState<Record<string, unknown>>({});

  useEffect(() => {
    async function loadMessages() {
      try {
        const messagesModule = await import(`@/messages/${locale}.json`);
        setMessages(messagesModule.default as Record<string, unknown>);
      } catch (error) {
        console.error(`Failed to load messages for locale ${locale}:`, error);
      }
    }
    loadMessages();
  }, [locale]);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    document.cookie = `${LOCALE_COOKIE}=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
  };

  const t = (key: string): string => {
    const keys = key.split(".");
    let value: unknown = messages;
    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = (value as Record<string, unknown>)[k];
      } else {
        return key;
      }
      if (value === undefined) return key;
    }
    return typeof value === "string" ? value : key;
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}

