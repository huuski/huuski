"use server";

import { cookies } from "next/headers";
import { Locale, defaultLocale } from "@/lib/i18n";

const LOCALE_COOKIE = "dealdeck-locale";

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const locale = cookieStore.get(LOCALE_COOKIE)?.value;
  if (locale && ["pt-BR", "en-US", "es-ES"].includes(locale)) {
    return locale as Locale;
  }
  return defaultLocale;
}

export async function setLocaleAction(locale: Locale) {
  const cookieStore = await cookies();
  cookieStore.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 year
    sameSite: "lax",
  });
}

