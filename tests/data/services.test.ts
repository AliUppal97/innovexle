import { describe, it, expect } from "vitest";
import { services } from "@/lib/data/services";

describe("services data", () => {
  it("has all 6 services", () => {
    expect(services).toHaveLength(6);
  });

  it("each service has required fields", () => {
    for (const service of services) {
      expect(service.id).toBeTruthy();
      expect(service.title).toBeTruthy();
      expect(service.description).toBeTruthy();
      expect(service.outcomes.length).toBeGreaterThan(0);
      expect(service.technologies.length).toBeGreaterThan(0);
    }
  });

  it("has unique IDs", () => {
    const ids = services.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
