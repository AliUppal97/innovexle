# Contact Form Setup

To receive contact form submissions at **hello@innovexle.com** on your published site:

## Checklist

- [ ] **1. Resend API key** – Create at [resend.com](https://resend.com), copy key (starts with `re_`)
- [ ] **2. Vercel env vars** – Add to your Vercel project:
  - `RESEND_API_KEY` = your Resend API key
  - `CONTACT_EMAIL` = `hello@innovexle.com` (optional, this is the default)
  - `NEXT_PUBLIC_SITE_URL` = `https://innovexle.com`
- [ ] **3. Domain verification** – In Resend dashboard, add domain `innovexle.com` and add the DNS records (SPF, DKIM) to your DNS provider
- [ ] **4. Redeploy** – After adding env vars, trigger a new deployment in Vercel

## Verify

1. Submit a test message from your live contact form
2. Check **hello@innovexle.com** inbox (and spam folder)
3. If you see "Contact form is not configured" – `RESEND_API_KEY` is missing in Vercel
4. If Resend returns an error – domain may not be verified; check Resend dashboard

## Local development

Without `RESEND_API_KEY`, submissions are logged to the console and the form shows success. Add the key to `.env.local` to test real delivery.
