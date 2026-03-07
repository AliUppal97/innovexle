# Contact Form – Verification Checklist

Use this checklist to verify your Namecheap, Vercel, and Resend configuration. Fill in the values as you check each item.

---

## 1. Resend Dashboard

**URL:** [resend.com](https://resend.com) → Log in

| Check | What to verify | Your value / status |
|-------|----------------|---------------------|
| API Key exists | Go to **API Keys** → You have at least one key (starts with `re_`) | ☐ Yes / ☐ No |
| API Key copied | You have the full key copied (you can't view it again after creation) | ☐ Yes / ☐ No |
| Account email | **Account** or **Profile** → Note which email you signed up with | `________________@____.com` |
| Domain status | **Domains** → `innovexle.com` → Status | ☐ Verified / ☐ Not Started / ☐ Pending |
| Domain region | If domain added, note the region (e.g. Tokyo ap-northeast-1) | `________________` |

**Important:** With `RESEND_FROM_EMAIL=onboarding@resend.dev`, emails can **only** be delivered to your Resend account email. `CONTACT_EMAIL` must match that email, or you must verify your domain.

---

## 2. Vercel Environment Variables

**URL:** [vercel.com](https://vercel.com) → Your project → **Settings** → **Environment Variables**

| Variable | Required | Expected value | Your value / status |
|----------|----------|----------------|---------------------|
| `RESEND_API_KEY` | **Yes** | `re_` followed by long string | ☐ Set / ☐ Missing |
| `RESEND_FROM_EMAIL` | **Yes** (until domain verified) | `onboarding@resend.dev` | ☐ Set / ☐ Missing |
| `CONTACT_EMAIL` | Optional | `hello@innovexle.com` or your Resend account email | ☐ Set / ☐ Missing |
| `NEXT_PUBLIC_SITE_URL` | Optional | `https://www.innovexle.com` | ☐ Set / ☐ Missing |

**Check:**
- [ ] Variables are enabled for **Production** (toggle on the right)
- [ ] No typos (e.g. `RESEND_API_KEY` not `RESEND_API_KEY `)
- [ ] No extra spaces before/after the value
- [ ] After adding or changing variables, you **redeployed** (Deployments → ⋮ → Redeploy)

---

## 3. Namecheap DNS (only if verifying domain)

**URL:** Namecheap → Domain List → **Manage** → **Advanced DNS**

Only needed if you want to send from `noreply@innovexle.com` (skip if using `onboarding@resend.dev`).

| Record | Type | Host | Value (from Resend) | Status |
|--------|------|------|---------------------|--------|
| DKIM | TXT | `resend._domainkey` | `p=MIGfMA0GCSq...` (full value from Resend) | ☐ Added |
| SPF (MX) | MX | `send` | `feedback-smtp.ap-northeast-1.amazonses.com` (Priority: 10) | ☐ Added |
| SPF (TXT) | TXT | `send` | `v=spf1 include:amazonses.com ~all` | ☐ Added |

**Note:** If MX records aren't available in Namecheap for subdomains, use `RESEND_FROM_EMAIL=onboarding@resend.dev` instead of domain verification.

---

## 4. Quick Test (using onboarding email)

If you're using `onboarding@resend.dev`:

1. **Resend account email** = `________________@____.com`
2. **CONTACT_EMAIL in Vercel** = same as above (or Resend will reject)
3. Submit the contact form at https://www.innovexle.com/contact
4. Check that email's inbox (and spam folder)

---

## 5. Vercel Function Logs (when debugging)

**URL:** Vercel → Your project → **Logs** (or Deployments → latest → **Functions**)

After submitting the form, look for:

| Log message | Meaning |
|-------------|---------|
| `[Email] Resend not configured` | `RESEND_API_KEY` is missing (local dev only) |
| `[Email] Send failed:` | Resend API returned an error – check the `message` and `code` in the log |
| `[Email] Sent successfully:` | Email was sent – check recipient inbox |
| `Contact form error:` | Generic error – check the full error object in the log |

**What to share if you need help:** Copy the full log line for `[Email] Send failed:` or `Contact form error:` (including the error message and code).

---

## 6. Common Issues

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| 503 "temporarily unavailable" | `RESEND_API_KEY` missing | Add it in Vercel, redeploy |
| 500 "unexpected error" | Resend API failed (e.g. domain not verified) | Add `RESEND_FROM_EMAIL=onboarding@resend.dev`, set `CONTACT_EMAIL` to your Resend account email, redeploy |
| Form says success but no email | Using `onboarding@resend.dev` but `CONTACT_EMAIL` ≠ Resend account email | Set `CONTACT_EMAIL` to the email you used to sign up for Resend |
| Domain verification stuck | MX/SPF records not added or wrong | Add all records in Namecheap, wait 15–30 min, click Verify in Resend |

---

## Information to share if the issue persists

If you've gone through this checklist and it still doesn't work, share:

1. **Resend:** Your Resend account email (the one you signed up with)
2. **Vercel:** Screenshot or list of env var **names** (not values) – e.g. `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `CONTACT_EMAIL`
3. **Vercel Logs:** The full `[Email] Send failed:` or `Contact form error:` log line from a failed submission
4. **Resend domain:** Status of `innovexle.com` in Resend (Verified / Not Started / Pending)
