import { describe, it, expect } from "vitest";
import { cn, formatDate } from "@/lib/utils";

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("handles conditional classes", () => {
    expect(cn("base", false && "hidden", "visible")).toBe("base visible");
  });

  it("merges tailwind classes correctly", () => {
    expect(cn("px-4", "px-8")).toBe("px-8");
  });

  it("handles undefined and null", () => {
    expect(cn("base", undefined, null)).toBe("base");
  });
});

describe("formatDate", () => {
  it("formats date correctly", () => {
    const date = new Date("2026-02-20");
    const formatted = formatDate(date);
    expect(formatted).toContain("2026");
    expect(formatted).toContain("February");
  });
});
