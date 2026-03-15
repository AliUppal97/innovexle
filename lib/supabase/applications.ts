import type { Database } from "./database.types";
import { getSupabaseServerClient, isSupabaseConfigured } from "./server";

/** Supabase Storage bucket for resume uploads */
export const RESUMES_BUCKET = "resumes";

/** Max resume size: 5MB */
const MAX_RESUME_BYTES = 5 * 1024 * 1024;

/** Allowed MIME types for resumes */
const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export interface ApplicationRecord {
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

/** Database row shape (snake_case) - matches Database["public"]["Tables"]["applications"]["Row"] */
type ApplicationRow = Database["public"]["Tables"]["applications"]["Row"];

function rowToRecord(row: ApplicationRow): ApplicationRecord {
  return {
    id: row.id,
    jobId: row.job_id,
    jobCode: row.job_code,
    jobTitle: row.job_title,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    phone: row.phone,
    linkedIn: row.linked_in ?? undefined,
    portfolio: row.portfolio ?? undefined,
    currentCompany: row.current_company ?? undefined,
    currentTitle: row.current_title ?? undefined,
    yearsOfExperience: row.years_of_experience,
    expectedSalary: row.expected_salary ?? undefined,
    noticePeriod: row.notice_period,
    workAuthorization: row.work_authorization,
    coverLetter: row.cover_letter ?? undefined,
    heardAbout: row.heard_about ?? undefined,
    resumeFileName: row.resume_file_name ?? undefined,
    resumeFileSize: row.resume_file_size ?? undefined,
    resumeStoredAs: row.resume_storage_path ?? undefined,
    submittedAt: row.submitted_at,
    applicationReference: row.application_reference,
  };
}

export async function createApplication(
  application: ApplicationRecord,
  resumeFile?: { buffer: Buffer; name: string; size: number; mimeType: string }
): Promise<ApplicationRecord> {
  const supabase = getSupabaseServerClient();

  await ensureResumesBucket();

  // Upload resume to Storage if provided
  let resumeStoragePath: string | undefined;
  if (resumeFile) {
    if (resumeFile.size > MAX_RESUME_BYTES) {
      throw new Error("Resume exceeds 5MB limit");
    }
    if (!ALLOWED_MIME_TYPES.includes(resumeFile.mimeType)) {
      throw new Error("Resume must be PDF or Word document");
    }
    const ext = resumeFile.name.split(".").pop() || "pdf";
    const safeName = `${application.applicationReference}-${Date.now()}.${ext}`.replace(
      /[^a-zA-Z0-9.-]/g,
      "_"
    );

    const { error } = await supabase.storage
      .from(RESUMES_BUCKET)
      .upload(safeName, resumeFile.buffer, {
        contentType: resumeFile.mimeType,
        upsert: false,
      });

    if (error) {
      console.error("[Supabase] Resume upload failed:", error);
      throw new Error("Failed to upload resume");
    }
    resumeStoragePath = safeName;
  }

  const row = {
    id: application.id,
    job_id: application.jobId,
    job_code: application.jobCode,
    job_title: application.jobTitle,
    first_name: application.firstName,
    last_name: application.lastName,
    email: application.email,
    phone: application.phone,
    linked_in: application.linkedIn || null,
    portfolio: application.portfolio || null,
    current_company: application.currentCompany || null,
    current_title: application.currentTitle || null,
    years_of_experience: application.yearsOfExperience,
    expected_salary: application.expectedSalary || null,
    notice_period: application.noticePeriod,
    work_authorization: application.workAuthorization,
    cover_letter: application.coverLetter || null,
    heard_about: application.heardAbout || null,
    resume_file_name: application.resumeFileName || null,
    resume_file_size: application.resumeFileSize || null,
    resume_storage_path: resumeStoragePath || null,
    submitted_at: application.submittedAt,
    application_reference: application.applicationReference,
  };

  const { data, error } = await supabase
    .from("applications")
    .insert(row as any)
    .select()
    .single();

  if (error) {
    console.error("[Supabase] Application insert failed:", error);
    throw new Error("Failed to save application");
  }

  return rowToRecord(data as ApplicationRow);
}

export async function getApplications(
  jobId?: string
): Promise<ApplicationRecord[]> {
  const supabase = getSupabaseServerClient();

  let query = supabase
    .from("applications")
    .select("*")
    .order("submitted_at", { ascending: false });

  if (jobId) {
    query = query.eq("job_id", jobId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("[Supabase] Applications fetch failed:", error);
    throw new Error("Failed to fetch applications");
  }

  return (data as ApplicationRow[]).map(rowToRecord);
}

/**
 * Ensure the resumes bucket exists. Call during app init or first upload.
 * In production, create the bucket via Supabase Dashboard or CLI.
 */
export async function ensureResumesBucket(): Promise<void> {
  const supabase = getSupabaseServerClient();
  const { data: buckets } = await supabase.storage.listBuckets();
  const exists = buckets?.some((b) => b.name === RESUMES_BUCKET);
  if (!exists) {
    const { error } = await supabase.storage.createBucket(RESUMES_BUCKET, {
      public: false,
      fileSizeLimit: "5MB",
      allowedMimeTypes: ALLOWED_MIME_TYPES,
    });
    if (error) {
      console.warn("[Supabase] Could not create resumes bucket:", error.message);
      // Bucket may already exist from Dashboard - continue
    }
  }
}

export { isSupabaseConfigured };
