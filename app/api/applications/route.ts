import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

import { getJobById } from "@/lib/data/jobs";
import { createFileStorage, saveFile } from "@/lib/storage";
import {
  createApplication,
  getApplications,
  isSupabaseConfigured,
  type ApplicationRecord,
} from "@/lib/supabase";
import { checkRateLimit } from "@/lib/rate-limit";

function getRateLimitKey(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";
  return `applications:${ip}`;
}

function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

function isAuthorizedForGet(request: NextRequest): boolean {
  const apiKey = process.env.APPLICATIONS_API_KEY;
  if (!apiKey?.trim()) return false;
  const bearer = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const headerKey = request.headers.get("x-api-key");
  return bearer === apiKey || headerKey === apiKey;
}

const applicationStore = createFileStorage<ApplicationRecord>("applications");

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 5 applications per hour per IP
    const rateLimitKey = getRateLimitKey(request);
    const rateLimitResult = await checkRateLimit(rateLimitKey, {
      windowMs: 60 * 60 * 1000,
      maxRequests: 5,
    });

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { success: false, message: "Too many applications. Please try again later." },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimitResult.retryAfterSeconds ?? 3600),
            "X-RateLimit-Remaining": "0",
          },
        }
      );
    }

    const formData = await request.formData();

    const jobId = (formData.get("jobId") as string)?.trim() || "";
    const jobCode = (formData.get("jobCode") as string)?.trim() || "";
    const jobTitle = (formData.get("jobTitle") as string)?.trim() || "";
    const firstName = sanitizeInput((formData.get("firstName") as string) || "");
    const lastName = sanitizeInput((formData.get("lastName") as string) || "");
    const email = sanitizeInput((formData.get("email") as string) || "");
    const phone = sanitizeInput((formData.get("phone") as string) || "");
    const linkedIn = sanitizeInput((formData.get("linkedIn") as string) || "");
    const portfolio = sanitizeInput((formData.get("portfolio") as string) || "");
    const currentCompany = sanitizeInput((formData.get("currentCompany") as string) || "");
    const currentTitle = sanitizeInput((formData.get("currentTitle") as string) || "");
    const yearsOfExperience = (formData.get("yearsOfExperience") as string) || "";
    const expectedSalary = sanitizeInput((formData.get("expectedSalary") as string) || "");
    const noticePeriod = (formData.get("noticePeriod") as string) || "";
    const workAuthorization = (formData.get("workAuthorization") as string) || "";
    const coverLetter = sanitizeInput((formData.get("coverLetter") as string) || "");
    const heardAbout = sanitizeInput((formData.get("heardAbout") as string) || "");
    const resume = formData.get("resume") as File | null;

    if (!jobId || !firstName || !lastName || !email || !phone) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const job = getJobById(jobId);
    if (!job || !job.isActive) {
      return NextResponse.json(
        { success: false, message: "This position is no longer available" },
        { status: 400 }
      );
    }

    if (job.applicationDeadline) {
      const deadline = new Date(job.applicationDeadline);
      if (deadline < new Date()) {
        return NextResponse.json(
          { success: false, message: "Application deadline has passed" },
          { status: 400 }
        );
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: "Invalid email address" },
        { status: 400 }
      );
    }

    const applicationReference = `${jobCode}-${Date.now().toString(36).toUpperCase()}`;

    const application: ApplicationRecord = {
      id: applicationReference,
      jobId,
      jobCode,
      jobTitle,
      firstName,
      lastName,
      email,
      phone,
      linkedIn: linkedIn || undefined,
      portfolio: portfolio || undefined,
      currentCompany: currentCompany || undefined,
      currentTitle: currentTitle || undefined,
      yearsOfExperience,
      expectedSalary: expectedSalary || undefined,
      noticePeriod,
      workAuthorization,
      coverLetter: coverLetter || undefined,
      heardAbout: heardAbout || undefined,
      resumeFileName: resume?.name,
      resumeFileSize: resume?.size,
      resumeStoredAs: undefined,
      submittedAt: new Date().toISOString(),
      applicationReference,
    };

    if (isSupabaseConfigured()) {
      // Supabase: upload resume to Storage, insert into DB
      let resumeFile: { buffer: Buffer; name: string; size: number; mimeType: string } | undefined;
      if (resume && resume.size > 0) {
        if (resume.size > 5 * 1024 * 1024) {
          return NextResponse.json(
            { success: false, message: "Resume must be less than 5MB" },
            { status: 400 }
          );
        }
        const buffer = Buffer.from(await resume.arrayBuffer());
        resumeFile = {
          buffer,
          name: resume.name,
          size: resume.size,
          mimeType: resume.type || "application/octet-stream",
        };
      }
      await createApplication(application, resumeFile);
    } else {
      // Fallback: file-based storage (local dev without Supabase)
      let resumeStoredAs: string | undefined;
      if (resume && resume.size > 0) {
        const buffer = Buffer.from(await resume.arrayBuffer());
        resumeStoredAs = await saveFile(resume.name, buffer);
      }
      application.resumeStoredAs = resumeStoredAs;
      await applicationStore.create(application);
    }

    console.log("New application persisted:", {
      reference: applicationReference,
      job: jobTitle,
      applicant: `${firstName} ${lastName}`,
      email,
      storage: isSupabaseConfigured() ? "supabase" : "file",
    });

    return NextResponse.json({
      success: true,
      message: "Application submitted successfully",
      data: {
        applicationReference,
        jobTitle,
        applicantName: `${firstName} ${lastName}`,
        submittedAt: application.submittedAt,
      },
    });
  } catch (error) {
    console.error("Error processing application:", error);
    return NextResponse.json(
      { success: false, message: "Failed to process application" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Require API key in production to protect PII
    const isProduction = process.env.VERCEL === "1" || process.env.NODE_ENV === "production";
    if (isProduction && !isAuthorizedForGet(request)) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get("jobId");

    let applications: ApplicationRecord[];

    if (isSupabaseConfigured()) {
      applications = await getApplications(jobId ?? undefined);
    } else {
      applications = await applicationStore.getAll();
      if (jobId) {
        applications = applications.filter((app) => app.jobId === jobId);
      }
    }

    return NextResponse.json({
      success: true,
      data: applications.map((app) => ({
        reference: app.applicationReference,
        jobTitle: app.jobTitle,
        applicant: `${app.firstName} ${app.lastName}`,
        email: app.email,
        submittedAt: app.submittedAt,
      })),
      count: applications.length,
    });
  } catch (error) {
    console.error("Error fetching applications:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch applications" },
      { status: 500 }
    );
  }
}
