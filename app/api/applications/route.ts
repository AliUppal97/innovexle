import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import { getJobById } from "@/lib/data/jobs";

// Types for application data
interface ApplicationData {
  jobId: string;
  jobCode: string;
  jobTitle: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  linkedIn?: string;
  portfolio?: string;
  currentCompany?: string;
  currentTitle?: string;
  yearsOfExperience: string;
  expectedSalary?: string;
  noticePeriod: string;
  workAuthorization: string;
  coverLetter?: string;
  heardAbout?: string;
  resumeFileName?: string;
  resumeFileSize?: number;
  submittedAt: string;
  applicationReference: string;
}

// In a production environment, you would:
// 1. Store applications in a database (PostgreSQL, MongoDB, etc.)
// 2. Upload resumes to cloud storage (S3, GCS, etc.)
// 3. Send confirmation emails via a service (SendGrid, AWS SES, etc.)
// 4. Integrate with ATS systems (Greenhouse, Lever, etc.)

// For demo purposes, we'll log the application and return success
const applications: ApplicationData[] = [];

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    // Extract form fields
    const jobId = formData.get("jobId") as string;
    const jobCode = formData.get("jobCode") as string;
    const jobTitle = formData.get("jobTitle") as string;
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const linkedIn = formData.get("linkedIn") as string;
    const portfolio = formData.get("portfolio") as string;
    const currentCompany = formData.get("currentCompany") as string;
    const currentTitle = formData.get("currentTitle") as string;
    const yearsOfExperience = formData.get("yearsOfExperience") as string;
    const expectedSalary = formData.get("expectedSalary") as string;
    const noticePeriod = formData.get("noticePeriod") as string;
    const workAuthorization = formData.get("workAuthorization") as string;
    const coverLetter = formData.get("coverLetter") as string;
    const heardAbout = formData.get("heardAbout") as string;
    const resume = formData.get("resume") as File | null;

    // Validation
    if (!jobId || !firstName || !lastName || !email || !phone) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate job exists and is active
    const job = getJobById(jobId);
    if (!job || !job.isActive) {
      return NextResponse.json(
        { success: false, message: "This position is no longer available" },
        { status: 400 }
      );
    }

    // Check application deadline
    if (job.applicationDeadline) {
      const deadline = new Date(job.applicationDeadline);
      if (deadline < new Date()) {
        return NextResponse.json(
          { success: false, message: "Application deadline has passed" },
          { status: 400 }
        );
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: "Invalid email address" },
        { status: 400 }
      );
    }

    // Generate application reference
    const applicationReference = `${jobCode}-${Date.now().toString(36).toUpperCase()}`;

    // Create application record
    const application: ApplicationData = {
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
      submittedAt: new Date().toISOString(),
      applicationReference,
    };

    // In production, you would:
    // 1. Save to database
    // 2. Upload resume to cloud storage
    // 3. Send confirmation email to applicant
    // 4. Send notification to hiring team
    // 5. Create record in ATS

    // For demo, store in memory (resets on server restart)
    applications.push(application);

    console.log("New application received:", {
      reference: applicationReference,
      job: jobTitle,
      applicant: `${firstName} ${lastName}`,
      email,
    });

    // Return success response
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

// GET endpoint to list applications (would be protected in production)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get("jobId");

    let filteredApplications = applications;

    if (jobId) {
      filteredApplications = applications.filter((app) => app.jobId === jobId);
    }

    // In production, this endpoint would require authentication
    // and would fetch from a database
    return NextResponse.json({
      success: true,
      data: filteredApplications.map((app) => ({
        reference: app.applicationReference,
        jobTitle: app.jobTitle,
        applicant: `${app.firstName} ${app.lastName}`,
        email: app.email,
        submittedAt: app.submittedAt,
      })),
      count: filteredApplications.length,
    });
  } catch (error) {
    console.error("Error fetching applications:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch applications" },
      { status: 500 }
    );
  }
}
