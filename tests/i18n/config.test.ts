import { describe, it, expect } from "vitest";
import { locales, defaultLocale, localeNames, localeDirection } from "@/i18n/config";

describe("i18n config", () => {
  it("has en as default locale", () => {
    expect(defaultLocale).toBe("en");
  });

  it("supports 6 locales", () => {
    expect(locales).toHaveLength(6);
    expect(locales).toContain("en");
    expect(locales).toContain("es");
    expect(locales).toContain("de");
    expect(locales).toContain("fr");
    expect(locales).toContain("ar");
    expect(locales).toContain("ur");
  });

  it("has names for all locales", () => {
    for (const locale of locales) {
      expect(localeNames[locale]).toBeTruthy();
    }
  });

  it("has directions for all locales", () => {
    for (const locale of locales) {
      expect(["ltr", "rtl"]).toContain(localeDirection[locale]);
    }
    expect(localeDirection.ar).toBe("rtl");
    expect(localeDirection.ur).toBe("rtl");
    expect(localeDirection.en).toBe("ltr");
  });
});
