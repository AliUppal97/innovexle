import { NextRequest, NextResponse } from "next/server";

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 3; // Max 3 requests per minute per IP

function getRateLimitKey(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";
  return ip;
}

function checkRateLimit(key: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const record = rateLimitStore.get(key);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return { allowed: true };
  }

  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    const retryAfter = Math.ceil((record.resetTime - now) / 1000);
    return { allowed: false, retryAfter };
  }

  record.count++;
  return { allowed: true };
}

// Honeypot field validation
function isSpam(data: ContactFormData): boolean {
  // If honeypot field is filled, it's a bot
  if (data.website && data.website.trim() !== "") {
    return true;
  }

  // Check for suspicious patterns
  const message = data.message.toLowerCase();
  const spamPatterns = [
    /\b(viagra|casino|lottery|winner|congratulations)\b/i,
    /https?:\/\/[^\s]+/g, // Multiple URLs
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
  website?: string; // Honeypot field
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

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitKey = getRateLimitKey(request);
    const rateLimitResult = checkRateLimit(rateLimitKey);

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimitResult.retryAfter),
          },
        }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const data: ContactFormData = {
      name: sanitizeInput(body.name || ""),
      email: sanitizeInput(body.email || ""),
      company: sanitizeInput(body.company || ""),
      message: sanitizeInput(body.message || ""),
      website: body.website || "", // Honeypot
    };

    // Validation
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

    // Spam check
    if (isSpam(data)) {
      // Return success to not reveal spam detection
      return NextResponse.json({ success: true });
    }

    // In production, integrate with your email service:
    // - Resend (recommended for Next.js)
    // - SendGrid
    // - AWS SES
    // - Nodemailer with SMTP
    //
    // Example with Resend:
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: 'noreply@innovexle.com',
    //   to: process.env.CONTACT_EMAIL,
    //   subject: `New inquiry from ${data.name}`,
    //   html: emailTemplate(data),
    // });

    // For now, log the submission (in production, this would send an email)
    console.log("Contact form submission:", {
      timestamp: new Date().toISOString(),
      name: data.name,
      email: data.email,
      company: data.company,
      message: data.message.substring(0, 100) + "...",
    });

    // Store in database if configured
    // await db.insert(contacts).values(data);

    return NextResponse.json({
      success: true,
      message: "Thank you for reaching out. We'll respond within one business day.",
    });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}

// Reject other methods
export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
