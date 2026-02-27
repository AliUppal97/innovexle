# Innovexle  - Complete Production Deployment Guide

**Goal:** Deploy innovexle.com to production and keep it running for **at least 2 years without extra cost** beyond your Namecheap domain and email.

---

## Platform Overview

Your project is a **Next.js 14 full‑stack app** (frontend + API routes in one). Use these platforms to stay free:

| What | Platform | Why |
|------|----------|-----|
| **App hosting** | **Vercel** | Best Next.js support, free Hobby tier |
| **Email (contact form)** | **Resend** | 3,000 emails/month free, send from hello@innovexle.com |
| **Domain DNS** | **Namecheap** | You already own innovexle.com |
| **Email inbox** | **Namecheap Private Email** | You already have hello@innovexle.com |
| **Job applications + resumes** | **Supabase** (optional) | Free Postgres + Storage; needs small code changes |
| **Rate limiting** | **Upstash Redis** (optional) | Free 10K commands/day; needs small code changes |
| **Analytics** | **Plausible** or **Google Analytics** | Both have free tiers |

> **Note on Vercel Hobby:** The free Hobby plan is intended for non-commercial personal use. If Innovexle is a commercial business, Vercel may expect you to use the Pro plan ($20/month). For portfolio/demo use or very low-traffic sites, Hobby is often acceptable. Evaluate based on your usage.

---

## ⚠️ Important: Storage Behavior on Vercel

Your app uses **file-based storage** for job applications and rate limiting. Vercel runs on **serverless functions**, so:

- **Writes to disk are ephemeral**  - data is lost on deploy and often across requests.
- **Job applications**  - Will not persist reliably on Vercel alone.
- **Resume uploads**  - Will not persist on Vercel.

**Options:**

1. **Vercel only**  - Site works; contact form (Resend) works; job applications and resumes won’t persist. Good if you mainly need the marketing site and contact form.
2. **Vercel + Supabase**  - Add Supabase (free) for job applications and resume storage. Requires adding a storage adapter and small API changes.

This guide covers the primary path (Vercel + Resend) and includes the Supabase migration path if you want persistent job applications.

---

# Step-by-Step Deployment

## Phase 1: Prepare Your Repo and Environment

### Step 1.1  - Verify GitHub

1. Ensure code is on GitHub: `https://github.com/YOUR_USERNAME/innovexle`
2. Set default branch to `main`
3. Ensure `.env.local` (or secrets) is **not** committed  - only `.env.example` should be in the repo

### Step 1.2  - List Required Environment Variables

You’ll set these in Vercel:

| Variable | Required | Description | Free source |
|----------|----------|-------------|-------------|
| `NEXT_PUBLIC_SITE_URL` | Yes | `https://innovexle.com` |  - |
| `CONTACT_EMAIL` | Yes | `hello@innovexle.com` | Namecheap |
| `RESEND_API_KEY` | Yes (for contact) | Resend API key | Resend free tier |
| `NEXT_PUBLIC_ANALYTICS_ID` | No | Plausible site / GA4 ID | Plausible / GA4 |
| `NEXT_PUBLIC_SENTRY_DSN` | No | Sentry DSN | Sentry free tier |
| `NEXT_PUBLIC_ERROR_ENDPOINT` | No | Custom error endpoint |  - |
| `NEXT_PUBLIC_VITALS_ENDPOINT` | No | Web Vitals endpoint |  - |

---

## Phase 2: Deploy on Vercel

### Step 2.1  - Create Vercel Project

1. Go to [vercel.com](https://vercel.com) and sign up / log in (GitHub recommended)
2. **Add New Project** → import your GitHub repo `innovexle`
3. Vercel will auto-detect Next.js
4. **Framework Preset:** Next.js (default)
5. **Root Directory:** `./` (unless you use a monorepo)
6. **Build Command:** `npm run build`
7. **Output Directory:** leave default
8. **Install Command:** `npm install`

### Step 2.2  - Add Environment Variables

Before first deploy:

1. In Vercel project → **Settings** → **Environment Variables**
2. Add:

   ```
   NEXT_PUBLIC_SITE_URL = https://innovexle.com
   CONTACT_EMAIL = hello@innovexle.com
   RESEND_API_KEY = (from Resend  - Step 3)
   ```

3. Enable for **Production**, **Preview**, and **Development**
4. Save

### Step 2.3  - Deploy

1. Click **Deploy**
2. Wait for the build; note the `*.vercel.app` URL
3. Test:
   - Homepage
   - `/contact`  - form submit
   - `/careers`  - job listings

---

## Phase 3: Configure Resend for hello@innovexle.com

### Step 3.1  - Resend Account

1. Go to [resend.com](https://resend.com) and sign up
2. Verify email

### Step 3.2  - Create API Key

1. **API Keys** → **Create API Key**
2. Name: `innovexle-production`
3. Permission: **Sending access**
4. Copy the key (starts with `re_`) and paste into Vercel `RESEND_API_KEY`

### Step 3.3  - Add and Verify Domain

1. **Domains** → **Add Domain**
2. Enter: `innovexle.com`
3. Resend shows DNS records:
   - MX (2 records)
   - TXT (optional: SPF, DKIM)
4. Add these records in Namecheap (see Phase 5)
5. After DNS propagates, Resend verifies the domain

**Note:** You can use Resend for **sending** (contact form) and keep **receiving** in Namecheap Private Email. In that case, you only need the sending DNS records Resend provides.

### Step 3.4  - Test Contact Form

1. Send a test message via your contact form
2. Check the inbox for `hello@innovexle.com` (Namecheap)
3. Check Resend dashboard for delivery status

**Resend free tier:** 100 emails/day, 3,000/month  - more than enough for a contact form.

---

## Phase 4: Connect Custom Domain (Namecheap → Vercel)

### Step 4.1  - Add Domain in Vercel

1. Vercel project → **Settings** → **Domains**
2. Click **Add**
3. Add:
   - `innovexle.com`
   - `www.innovexle.com`
4. Vercel will suggest DNS records

### Step 4.2  - Configure Namecheap DNS

1. Log in to [Namecheap](https://www.namecheap.com)
2. **Domain List** → **Manage** for `innovexle.com`
3. Open **Advanced DNS**

**Remove old A/CNAME records for root and www** (if any).

**Add:**

| Type | Host | Value | TTL |
|------|------|-------|-----|
| A | @ | 76.76.21.21 | Automatic |
| CNAME | www | cname.vercel-dns.com | Automatic |

Or use Vercel nameservers for easier management:

- `ns1.vercel-dns.com`
- `ns2.vercel-dns.com`

(Set under Namecheap → Domain → Nameservers → Custom DNS)

### Step 4.3  - Wait for SSL

1. After DNS propagates (often 5–30 minutes), Vercel issues an SSL certificate
2. Domains show **Valid Configuration**
3. Test: `https://innovexle.com` and `https://www.innovexle.com`

---

## Phase 5: Namecheap Email (hello@innovexle.com)

You already bought email from Namecheap. Configure it as follows.

### Step 5.1  - Incoming Mail (Inbox)

Namecheap Private Email uses:

- **Incoming:** MX records pointing to Namecheap mail servers
- **Outgoing:** SMTP (Namecheap or Resend)

Follow Namecheap’s setup guide for your domain and create the mailbox `hello@innovexle.com`.

### Step 5.2  - Resend vs Namecheap for Sending

- **Resend:** Used by your contact form API (via `RESEND_API_KEY`). Handles sending from hello@innovexle.com.
- **Namecheap:** Handles receiving email at hello@innovexle.com.

Add Resend’s DNS records as shown in Phase 3 so Resend can send from `hello@innovexle.com` without conflicts. Keep Namecheap’s MX records for receiving.

---

## Phase 6: Optional  - Persistent Job Applications (Supabase)

If you need job applications and resumes to persist, add Supabase on the free tier.

### Step 6.1  - Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up
2. **New Project**:
   - Name: `innovexle`
   - Database password: store securely
   - Region: choose closest to your users

### Step 6.2  - Schema

In Supabase SQL editor, run:

```sql
CREATE TABLE applications (
  id TEXT PRIMARY KEY,
  "jobId" TEXT NOT NULL,
  "jobCode" TEXT NOT NULL,
  "jobTitle" TEXT NOT NULL,
  "firstName" TEXT NOT NULL,
  "lastName" TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  linkedin TEXT,
  portfolio TEXT,
  "currentCompany" TEXT,
  "currentTitle" TEXT,
  "yearsOfExperience" TEXT NOT NULL,
  "expectedSalary" TEXT,
  "noticePeriod" TEXT NOT NULL,
  "workAuthorization" TEXT NOT NULL,
  "coverLetter" TEXT,
  "heardAbout" TEXT,
  "resumeFileName" TEXT,
  "resumeFileSize" INTEGER,
  "resumeStoredAs" TEXT,
  "submittedAt" TIMESTAMPTZ DEFAULT NOW(),
  "applicationReference" TEXT NOT NULL
);

-- Allow API to insert (use RLS in production)
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow insert from service role" ON applications
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow select from service role" ON applications
  FOR SELECT USING (true);
```

Create a Storage bucket for resumes:

1. **Storage** → **New bucket** → `resumes`
2. Make it private; use the Supabase client with service role for upload/read

### Step 6.3  - Environment Variables

In Vercel, add:

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Step 6.4  - Code Changes

You’ll need a Supabase adapter in `lib/storage.ts` that:

- Uses `supabase.from('applications').insert()` instead of file writes
- Uses `supabase.storage.from('resumes').upload()` for resume files
- Implements the same interface as the current file-based adapter

This is a small refactor. The existing file-based implementation can remain as fallback for local dev.

---

## Phase 7: Optional  - Persistent Rate Limiting (Upstash Redis)

If you want rate limiting to persist across serverless invocations:

1. Sign up at [upstash.com](https://upstash.com)
2. Create a Redis database (free plan: 10K commands/day)
3. Copy the REST URL and token
4. Add to Vercel: `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`
5. Replace `lib/rate-limit.ts` with an Upstash-based implementation (e.g. `@upstash/ratelimit`)

---

## Phase 8: Post-Deployment Checklist

- [ ] `https://innovexle.com` loads
- [ ] `https://www.innovexle.com` redirects correctly
- [ ] SSL certificate is active (padlock in browser)
- [ ] Contact form submits and email arrives at `hello@innovexle.com`
- [ ] All main routes work: `/`, `/about`, `/services`, `/case-studies`, `/careers`, `/contact`
- [ ] `/sitemap.xml` and `/robots.txt` load
- [ ] Locale routing works (`/en`, `/es`, `/de`, `/fr`, `/ar`)

---

## Cost Summary (2-Year Target)

| Service | Cost | Notes |
|---------|------|-------|
| **Namecheap domain** | Already paid | innovexle.com |
| **Namecheap Private Email** | Already paid | hello@innovexle.com |
| **Vercel Hobby** | **$0** | 100GB bandwidth, 1M invocations/month |
| **Resend** | **$0** | 3,000 emails/month |
| **Supabase** (optional) | **$0** | 500MB DB, 1GB storage |
| **Upstash** (optional) | **$0** | 10K commands/day |
| **Plausible** (optional) | **$0** | 10K pageviews/month on free trial |

Total recurring: **$0** if you stay within free tiers.

---

## Platform Quick Reference

| Component | Platform | Free tier limits |
|-----------|----------|-------------------|
| **App** | Vercel | 100 GB transfer, 1M invocations/month |
| **Email sending** | Resend | 3,000 emails/month |
| **Email inbox** | Namecheap | Your existing plan |
| **Domain** | Namecheap | Owned by you |
| **DB + storage** | Supabase | 500 MB DB, 1 GB storage |
| **Rate limit** | Upstash Redis | 10K commands/day |
| **Analytics** | Plausible / GA4 | Plausible: 10K views; GA4: free |

---

## Troubleshooting

### Domain not resolving
- Wait 24–48 hours for DNS propagation
- Confirm A record for `@` = `76.76.21.21` and CNAME for `www` = `cname.vercel-dns.com`
- Check [dnschecker.org](https://dnschecker.org)

### Contact form emails not arriving
- Check `RESEND_API_KEY` in Vercel
- Verify domain in Resend dashboard
- Ensure SPF/DKIM records are correct in Namecheap
- Check spam folder

### Build fails on Vercel
- Run `npm run build` locally
- Inspect build logs in Vercel
- Confirm Node >= 18.17 (`engines` in `package.json`)

### Job applications disappearing
- Expected if you only use Vercel (no Supabase). Add Supabase per Phase 6 to persist them.

---

## Summary Timeline

1. **Day 1:** Push to GitHub → import to Vercel → add env vars → deploy
2. **Day 1:** Sign up Resend → create API key → add domain → verify DNS
3. **Day 1–2:** Point Namecheap DNS to Vercel → wait for SSL
4. **Day 2:** Test contact form and full site
5. **Optional:** Add Supabase (Phase 6) and Upstash (Phase 7) later

You can be fully live in 1–2 days with everything staying free for at least 2 years.
