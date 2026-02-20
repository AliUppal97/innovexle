// @vitest-environment node
import { describe, it, expect, beforeEach, vi } from "vitest";

vi.mock("fs", async (importOriginal) => {
  const actual = await importOriginal<typeof import("fs")>();
  return {
    ...actual,
    promises: {
      ...actual.promises,
      readFile: vi.fn().mockRejectedValue(new Error("ENOENT")),
      writeFile: vi.fn().mockResolvedValue(undefined),
      mkdir: vi.fn().mockResolvedValue(undefined),
    },
  };
});

import { checkRateLimit } from "@/lib/rate-limit";
import { promises as fs } from "fs";

describe("checkRateLimit", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (fs.readFile as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error("ENOENT")
    );
  });

  it("allows first request", async () => {
    const result = await checkRateLimit("test-key", {
      windowMs: 60000,
      maxRequests: 3,
    });
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(2);
  });

  it("persists rate limit data", async () => {
    await checkRateLimit("test-key");
    expect(fs.writeFile).toHaveBeenCalled();
  });
});
