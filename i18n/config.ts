export const defaultLocale = "en" as const;

export const locales = ["en", "es", "de", "fr", "ar", "ur"] as const;

export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
  en: "English",
  es: "Español",
  de: "Deutsch",
  fr: "Français",
  ar: "العربية",
  ur: "اردو",
};

export const localeDirection: Record<Locale, "ltr" | "rtl"> = {
  en: "ltr",
  es: "ltr",
  de: "ltr",
  fr: "ltr",
  ar: "rtl",
  ur: "rtl",
};
