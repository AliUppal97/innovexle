-- Innovexle: Job applications table
-- Run this migration in Supabase SQL Editor or via Supabase CLI: supabase db push

-- Applications table
CREATE TABLE IF NOT EXISTS public.applications (
  id TEXT PRIMARY KEY,
  job_id TEXT NOT NULL,
  job_code TEXT NOT NULL,
  job_title TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  linked_in TEXT,
  portfolio TEXT,
  current_company TEXT,
  current_title TEXT,
  years_of_experience TEXT NOT NULL,
  expected_salary TEXT,
  notice_period TEXT NOT NULL,
  work_authorization TEXT NOT NULL,
  cover_letter TEXT,
  heard_about TEXT,
  resume_file_name TEXT,
  resume_file_size INTEGER,
  resume_storage_path TEXT,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  application_reference TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for filtering by job and listing
CREATE INDEX IF NOT EXISTS idx_applications_job_id ON public.applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_submitted_at ON public.applications(submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_applications_application_reference ON public.applications(application_reference);

-- RLS: Enable so anon/authenticated have no access by default.
-- Service role (used by API routes) bypasses RLS.
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE public.applications IS 'Job applications submitted via careers form. Secured via RLS; API uses service_role.';
