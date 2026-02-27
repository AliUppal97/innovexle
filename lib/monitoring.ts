type ErrorSeverity = "low" | "medium" | "high" | "critical";

interface ErrorReport {
  message: string;
  stack?: string;
  digest?: string;
  severity: ErrorSeverity;
  url?: string;
  userAgent?: string;
  timestamp: string;
  context?: Record<string, unknown>;
}

const errorBuffer: ErrorReport[] = [];
const MAX_BUFFER_SIZE = 100;

export function reportError(
  error: Error & { digest?: string },
  context?: Record<string, unknown>
): void {
  const report: ErrorReport = {
    message: error.message,
    stack: error.stack,
    digest: error.digest,
    severity: determineSeverity(error),
    url: typeof window !== "undefined" ? window.location.href : undefined,
    userAgent:
      typeof navigator !== "undefined" ? navigator.userAgent : undefined,
    timestamp: new Date().toISOString(),
    context,
  };

  errorBuffer.push(report);

  if (errorBuffer.length > MAX_BUFFER_SIZE) {
    errorBuffer.shift();
  }

  if (process.env.NODE_ENV === "development") {
    console.error("[Error Monitor]", report);
  }

  // In production, send to your monitoring service (Sentry, Datadog, etc.)
  if (process.env.NODE_ENV === "production" && process.env.NEXT_PUBLIC_SENTRY_DSN) {
    sendToMonitoringService(report);
  }
}

function determineSeverity(error: Error): ErrorSeverity {
  const message = error.message.toLowerCase();
  if (message.includes("chunk") || message.includes("hydration")) return "low";
  if (message.includes("network") || message.includes("fetch")) return "medium";
  if (message.includes("auth") || message.includes("permission")) return "high";
  return "medium";
}

async function sendToMonitoringService(report: ErrorReport): Promise<void> {
  try {
    const endpoint = process.env.NEXT_PUBLIC_ERROR_ENDPOINT;
    if (!endpoint) return;

    await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(report),
    });
  } catch {
    // Silently fail - don't throw in the error reporter
  }
}

export function getRecentErrors(): ErrorReport[] {
  return [...errorBuffer];
}
