import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import { getJobById } from "@/lib/data/jobs";
import { createFileStorage, saveFile } from "@/lib/storage";

interface ApplicationRecord {
  id: string;
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
  resumeStoredAs?: string;
  submittedAt: string;
  applicationReference: string;
}

const applicationStore = createFileStorage<ApplicationRecord>("applications");

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

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

    let resumeStoredAs: string | undefined;
    if (resume && resume.size > 0) {
      const buffer = Buffer.from(await resume.arrayBuffer());
      resumeStoredAs = await saveFile(resume.name, buffer);
    }

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
      resumeStoredAs,
      submittedAt: new Date().toISOString(),
      applicationReference,
    };

    await applicationStore.create(application);

    console.log("New application persisted:", {
      reference: applicationReference,
      job: jobTitle,
      applicant: `${firstName} ${lastName}`,
      email,
      resumeStored: !!resumeStoredAs,
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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get("jobId");

    let applications = await applicationStore.getAll();

    if (jobId) {
      applications = applications.filter((app) => app.jobId === jobId);
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
