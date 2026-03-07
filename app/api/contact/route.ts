import { NextRequest, NextResponse } from "next/server";
import { sendContactEmail, EmailSendError } from "@/lib/email";
import { checkRateLimit } from "@/lib/rate-limit";

function getRateLimitKey(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";
  return `contact:${ip}`;
}

function isSpam(data: ContactFormData): boolean {
  if (data.website && data.website.trim() !== "") {
    return true;
  }

  const message = data.message.toLowerCase();
  const spamPatterns = [
    /\b(viagra|casino|lottery|winner|congratulations)\b/i,
    /https?:\/\/[^\s]+/g,
  ];

  for (const pattern of spamPatterns) {
    const matches = message.match(pattern);
    if (matches && matches.length > 2) {
      return true;
    }
  }

  return false;
}

interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  message: string;
  website?: string;
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

const CONTACT_EMAIL_FALLBACK = "hello@innovexle.com";

export async function POST(request: NextRequest) {
  try {
    const recipient =
      process.env.CONTACT_EMAIL || CONTACT_EMAIL_FALLBACK;
    const isConfigured = !!process.env.RESEND_API_KEY?.trim();
    const isProduction =
      process.env.VERCEL === "1" || process.env.NODE_ENV === "production";

    if (isProduction && !isConfigured) {
      return NextResponse.json(
        {
          error: `Contact form is temporarily unavailable. Please email us directly at ${recipient}.`,
        },
        { status: 503 }
      );
    }

    const rateLimitKey = getRateLimitKey(request);
    const rateLimitResult = await checkRateLimit(rateLimitKey, {
      windowMs: 60_000,
      maxRequests: 3,
    });

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimitResult.retryAfterSeconds),
            "X-RateLimit-Remaining": "0",
          },
        }
      );
    }

    const body = await request.json();
    const data: ContactFormData = {
      name: sanitizeInput(body.name || ""),
      email: sanitizeInput(body.email || ""),
      company: sanitizeInput(body.company || ""),
      message: sanitizeInput(body.message || ""),
      website: body.website || "",
    };

    const errors: string[] = [];

    if (!data.name || data.name.length < 2) {
      errors.push("Name is required (minimum 2 characters)");
    }

    if (!data.email || !validateEmail(data.email)) {
      errors.push("Valid email is required");
    }

    if (!data.message || data.message.length < 10) {
      errors.push("Message is required (minimum 10 characters)");
    }

    if (data.message.length > 5000) {
      errors.push("Message is too long (maximum 5000 characters)");
    }

    if (errors.length > 0) {
      return NextResponse.json({ error: errors.join(". ") }, { status: 400 });
    }

    if (isSpam(data)) {
      return NextResponse.json({ success: true });
    }

    await sendContactEmail({
      name: data.name,
      email: data.email,
      company: data.company?.trim() || undefined,
      message: data.message,
    });

    return NextResponse.json({
      success: true,
      message: "Thank you for reaching out. We'll respond within one business day.",
    });
  } catch (error) {
    const isEmailError = error instanceof EmailSendError;
    console.error("Contact form error:", {
      name: error instanceof Error ? error.name : "Error",
      message: error instanceof Error ? error.message : String(error),
      ...(isEmailError && { code: (error as EmailSendError).code }),
    });
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
