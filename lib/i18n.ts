export type Locale = "pt-BR" | "en-US" | "es-ES";

export const locales: Locale[] = ["pt-BR", "en-US", "es-ES"];

export const defaultLocale: Locale = "pt-BR";

export const localeNames: Record<Locale, string> = {
  "pt-BR": "Português (Brasil)",
  "en-US": "English (US)",
  "es-ES": "Español (España)",
};

export const localeFlags: Record<Locale, string> = {
  "pt-BR": "🇧🇷",
  "en-US": "🇺🇸",
  "es-ES": "🇪🇸",
};

