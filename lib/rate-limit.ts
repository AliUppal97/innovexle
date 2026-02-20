import { promises as fs } from "fs";
import path from "path";

const RATE_LIMIT_FILE = path.join(process.cwd(), ".data", "rate-limits.json");

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

type RateLimitStore = Record<string, RateLimitEntry>;

async function readStore(): Promise<RateLimitStore> {
  try {
    const raw = await fs.readFile(RATE_LIMIT_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

async function writeStore(store: RateLimitStore): Promise<void> {
  const dir = path.dirname(RATE_LIMIT_FILE);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(RATE_LIMIT_FILE, JSON.stringify(store), "utf-8");
}

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds?: number;
}

export async function checkRateLimit(
  key: string,
  config: RateLimitConfig = { windowMs: 60_000, maxRequests: 3 }
): Promise<RateLimitResult> {
  const now = Date.now();
  const store = await readStore();
  const entry = store[key];

  if (!entry || now > entry.resetTime) {
    store[key] = { count: 1, resetTime: now + config.windowMs };

    // Prune expired entries
    for (const k of Object.keys(store)) {
      if (store[k].resetTime < now) delete store[k];
    }

    await writeStore(store);
    return { allowed: true, remaining: config.maxRequests - 1 };
  }

  if (entry.count >= config.maxRequests) {
    const retryAfterSeconds = Math.ceil((entry.resetTime - now) / 1000);
    return { allowed: false, remaining: 0, retryAfterSeconds };
  }

  entry.count++;
  await writeStore(store);
  return { allowed: true, remaining: config.maxRequests - entry.count };
}
