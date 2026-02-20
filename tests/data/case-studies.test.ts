import { describe, it, expect } from "vitest";
import { caseStudies, featuredCaseStudies } from "@/lib/data/case-studies";

describe("case studies data", () => {
  it("has case studies", () => {
    expect(caseStudies.length).toBeGreaterThan(0);
  });

  it("each case study has required fields", () => {
    for (const cs of caseStudies) {
      expect(cs.id).toBeTruthy();
      expect(cs.title).toBeTruthy();
      expect(cs.industry).toBeTruthy();
      expect(cs.problem).toBeTruthy();
      expect(cs.solution).toBeTruthy();
      expect(cs.results.length).toBeGreaterThan(0);
      expect(cs.technologies.length).toBeGreaterThan(0);
    }
  });

  it("has unique IDs", () => {
    const ids = caseStudies.map((cs) => cs.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("featured filter works", () => {
    expect(featuredCaseStudies.every((cs) => cs.featured)).toBe(true);
    expect(featuredCaseStudies.length).toBeLessThanOrEqual(caseStudies.length);
  });
});
