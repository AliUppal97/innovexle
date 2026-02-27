import { describe, it, expect } from "vitest";
import {
  regions,
  getDefaultRegion,
  getRegionById,
  convertSalary,
  formatRegionalSalary,
} from "@/lib/regions";

describe("regions", () => {
  it("has all expected regions", () => {
    expect(regions).toHaveLength(6);
    expect(regions.map((r) => r.id)).toEqual([
      "global",
      "europe",
      "uk",
      "india",
      "canada",
      "pakistan",
    ]);
  });

  it("returns default region as global/USD", () => {
    const def = getDefaultRegion();
    expect(def.id).toBe("global");
    expect(def.currency).toBe("USD");
    expect(def.exchangeRate).toBe(1);
  });

  it("finds region by ID", () => {
    const europe = getRegionById("europe");
    expect(europe).toBeDefined();
    expect(europe!.currency).toBe("EUR");
  });

  it("returns undefined for unknown region", () => {
    expect(getRegionById("mars")).toBeUndefined();
  });
});

describe("convertSalary", () => {
  it("converts USD to EUR", () => {
    const europe = getRegionById("europe")!;
    const converted = convertSalary(100000, europe);
    expect(converted).toBe(Math.round(100000 * europe.exchangeRate));
  });

  it("keeps USD unchanged for global region", () => {
    const global = getDefaultRegion();
    expect(convertSalary(150000, global)).toBe(150000);
  });
});

describe("formatRegionalSalary", () => {
  it("formats salary range", () => {
    const global = getDefaultRegion();
    const formatted = formatRegionalSalary(100000, 150000, global);
    expect(formatted).toContain("100,000");
    expect(formatted).toContain("150,000");
  });
});
