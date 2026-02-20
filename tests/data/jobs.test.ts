import { describe, it, expect } from "vitest";
import {
  jobs,
  getActiveJobs,
  getJobById,
  getJobsByDepartment,
  formatSalary,
  getRelativeTime,
} from "@/lib/data/jobs";

describe("jobs data", () => {
  it("has job listings", () => {
    expect(jobs.length).toBeGreaterThan(0);
  });

  it("each job has required fields", () => {
    for (const job of jobs) {
      expect(job.id).toBeTruthy();
      expect(job.title).toBeTruthy();
      expect(job.department).toBeTruthy();
      expect(job.description).toBeTruthy();
      expect(job.responsibilities.length).toBeGreaterThan(0);
      expect(job.requirements.length).toBeGreaterThan(0);
    }
  });

  it("returns only active jobs", () => {
    const active = getActiveJobs();
    expect(active.every((j) => j.isActive)).toBe(true);
  });

  it("finds job by ID", () => {
    const job = getJobById("senior-backend-engineer");
    expect(job).toBeDefined();
    expect(job!.title).toBe("Senior Backend Engineer");
  });

  it("returns undefined for unknown job ID", () => {
    expect(getJobById("nonexistent")).toBeUndefined();
  });

  it("filters by department", () => {
    const engineering = getJobsByDepartment("Engineering");
    expect(engineering.every((j) => j.department === "Engineering")).toBe(true);
  });
});

describe("formatSalary", () => {
  it("formats USD salary range", () => {
    const formatted = formatSalary({ min: 150000, max: 200000, currency: "USD", period: "yearly" });
    expect(formatted).toContain("150,000");
    expect(formatted).toContain("200,000");
    expect(formatted).toContain("$");
  });
});

describe("getRelativeTime", () => {
  it("returns recent time for today's date", () => {
    const today = new Date().toISOString().split("T")[0];
    const result = getRelativeTime(today);
    expect(["Today", "Yesterday"]).toContain(result);
  });

  it("returns weeks ago for old dates", () => {
    const threeWeeksAgo = new Date(Date.now() - 21 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];
    expect(getRelativeTime(threeWeeksAgo)).toContain("weeks ago");
  });
});
