# Contact Form Setup

To receive contact form submissions at **hello@innovexle.com** on your published site:

## Checklist

- [ ] **1. Resend API key** – Sign up at [resend.com](https://resend.com), go to **API Keys**, create a key (starts with `re_`), copy it
- [ ] **2. Vercel env vars** – In Vercel: Project → Settings → Environment Variables, add:
  - `RESEND_API_KEY` = your Resend API key **(required – form returns "temporarily unavailable" without it)**
  - `CONTACT_EMAIL` = `hello@innovexle.com` (optional, this is the default)
  - `NEXT_PUBLIC_SITE_URL` = `https://www.innovexle.com` (or your production URL)
- [ ] **3. Redeploy** – After adding env vars, go to Deployments → ⋮ on latest → Redeploy (or push a new commit)
- [ ] **4. Domain verification** (for custom sender) – In Resend dashboard, add domain `innovexle.com` and add the DNS records (SPF, DKIM). Until then, use `RESEND_FROM_EMAIL=onboarding@resend.dev` (see Quick start below)

## Quick start (before domain verification)

To send emails **immediately** without waiting for domain verification:

1. Add `RESEND_FROM_EMAIL=onboarding@resend.dev` to Vercel env vars
2. **Note:** Resend's onboarding address can only deliver to the email you signed up with. For `hello@innovexle.com`, either use that as your Resend account email, or verify your domain (recommended).
3. Once `innovexle.com` is verified in Resend, remove `RESEND_FROM_EMAIL` to use `noreply@innovexle.com`

## Verify

1. Submit a test message from your live contact form
2. Check **hello@innovexle.com** inbox (and spam folder)
3. If you see "Contact form is not configured" – `RESEND_API_KEY` is missing in Vercel
4. If Resend returns an error – check Vercel logs for `[Email] Send failed:` details; domain may need verification

## Local development

Without `RESEND_API_KEY`, submissions are logged to the console and the form shows success. Add the key to `.env.local` to test real delivery. Use `RESEND_FROM_EMAIL=onboarding@resend.dev` in `.env.local` to test before domain verification.
