# Supabase Setup for Innovexle

This guide walks you through setting up Supabase for job applications and resume storage. Supabase provides a free tier (500MB database, 1GB storage).

---

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **New Project**
3. Choose organization, name (e.g. `innovexle`), database password, and region
4. Wait for the project to be provisioned (~2 minutes)

---

## 2. Get Your API Keys

1. In the Supabase Dashboard, go to **Settings → API**
2. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **service_role** key (under Project API keys) → `SUPABASE_SERVICE_ROLE_KEY`

⚠️ **Never expose the service_role key in client-side code.** It bypasses Row Level Security.

---

## 3. Run the Database Migration

1. Go to **SQL Editor** in the Supabase Dashboard
2. Create a new query
3. Copy the contents of `supabase/migrations/20240313000000_create_applications.sql`
4. Run the query

Alternatively, if you have [Supabase CLI](https://supabase.com/docs/guides/cli) installed:

```bash
supabase link --project-ref <your-project-ref>
supabase db push
```

---

## 4. Create the Resumes Storage Bucket

The application will automatically create the `resumes` bucket on first upload. If you prefer to create it manually:

1. Go to **Storage** in the Supabase Dashboard
2. Click **New bucket**
3. Name: `resumes`
4. **Public bucket**: Off
5. Optional: set **File size limit** to 5MB and **Allowed MIME types** to `application/pdf`, `application/msword`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document`

---

## 5. Configure Environment Variables

Add to your `.env.local` (and Vercel/env vars for production):

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Optional: Protect the Applications GET Endpoint

In production, the `GET /api/applications` endpoint requires an API key to prevent unauthorized access to applicant PII.

Add to your env:

```env
APPLICATIONS_API_KEY=your-secure-random-string
```

Then call the API with either:

- `Authorization: Bearer your-secure-random-string`
- `X-API-Key: your-secure-random-string`

---

## 6. Verify Setup

1. Start the dev server: `npm run dev`
2. Go to a job page and submit a test application with a resume
3. In Supabase Dashboard:
   - **Table Editor** → `applications` — you should see the new row
   - **Storage** → `resumes` — you should see the uploaded file

---

## Fallback Behavior

If Supabase env vars are **not** set, the app falls back to file-based storage (`.data/` folder). This works for local development but **does not persist on Vercel** (ephemeral filesystem). For production, configure Supabase.

---

## Row Level Security (RLS)

The `applications` table has RLS enabled. No policies are defined for `anon` or `authenticated` roles, so direct client access is denied. The API routes use the service role, which bypasses RLS.

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Missing Supabase env" | Ensure both `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set |
| "relation 'applications' does not exist" | Run the migration SQL in Supabase SQL Editor |
| Resume upload fails | Check Storage bucket exists and RLS allows service_role; ensure file is PDF or Word, ≤5MB |
| GET returns 401 | In production, set `APPLICATIONS_API_KEY` and pass it in the request |
