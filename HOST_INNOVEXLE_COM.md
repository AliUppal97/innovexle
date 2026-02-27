# Host innovexle.com and Set Up Email (hello@innovexle.com)

This guide walks you through deploying the site to **innovexle.com** and making sure emails sent via the contact form are delivered to **hello@innovexle.com**.

**Summary:**
- **Hosting:** Vercel (import from GitHub)
- **Domain:** innovexle.com (DNS at Namecheap or your registrar)
- **Sending (contact form):** Resend (sends from your domain to hello@innovexle.com)
- **Receiving:** Your existing inbox hello@innovexle.com (e.g. Namecheap Private Email)

---

## Part 1  - Deploy the site to Vercel

### 1.1 Import from GitHub

1. Go to [vercel.com](https://vercel.com) and sign in (use **GitHub**).
2. Click **Add New** → **Project**.
3. Import the repo: **AliUppal97/innovexle**.
4. Vercel will detect **Next.js**. Leave:
   - **Framework Preset:** Next.js  
   - **Root Directory:** `./`  
   - **Build Command:** `npm run build`  
   - **Install Command:** `npm install`
5. **Do not deploy yet**  - add environment variables first (Step 1.2).
6. Then click **Deploy**.

### 1.2 Environment variables (required for site + email)

1. In the Vercel project, go to **Settings** → **Environment Variables**.
2. Add these for **Production** (and optionally Preview/Development):

| Name | Value | Notes |
|------|--------|------|
| `NEXT_PUBLIC_SITE_URL` | `https://innovexle.com` | Used for links and email “from” domain |
| `CONTACT_EMAIL` | `hello@innovexle.com` | Where contact form messages are sent |
| `RESEND_API_KEY` | *(from Part 3)* | Resend API key (starts with `re_`) |

3. Save. Redeploy the project (Deployments → … on latest → Redeploy) so the new variables are used.

After deploy you’ll have a URL like `innovexle-xxx.vercel.app`. Next we point **innovexle.com** to it.

---

## Part 2  - Point innovexle.com to Vercel

### 2.1 Add domain in Vercel

1. In your Vercel project: **Settings** → **Domains**.
2. Click **Add** and add:
   - `innovexle.com`
   - `www.innovexle.com`
3. Vercel will show the DNS records you need.

### 2.2 Set DNS at your registrar (e.g. Namecheap)

1. Log in where **innovexle.com** is registered (e.g. [Namecheap](https://www.namecheap.com)).
2. Open the domain → **Manage** → **Advanced DNS** (not “Redirect Domain”). You need **A** and **CNAME** records so Vercel can serve the site; a URL Redirect record for `@` is not enough.
3. **Remove** the existing **URL Redirect** for `@` (if present) and any **A** or **CNAME** for `@` and `www` that conflict with the table below.
4. Add these records in **Advanced DNS**. Use the **exact values Vercel shows** in your project (Settings → Domains); Vercel may show a different A record IP. Typically:

| Type  | Host | Value |
|-------|------|--------|
| A     | `@`  | `216.198.79.1` (or the IP Vercel shows for innovexle.com) |
| CNAME | `www` | `cname.vercel-dns.com` |

If Vercel displays different values, use those -they go in your **registrar’s DNS** (e.g. Namecheap), not in Vercel.

5. **Masked vs unmasked:** If you are asked this for a redirect elsewhere (e.g. “Redirect Domain”), choose **unmasked**. Unmasked = real HTTP redirect (URL bar updates, works with SSL). Masked = frame redirect (can break SSL and SEO); avoid it for your main site.
6. Save. Wait 5–30 minutes for DNS to propagate.

### 2.3 Verify in Vercel

1. In Vercel **Settings** → **Domains**, check that both `innovexle.com` and `www.innovexle.com` show **Valid Configuration** (and get SSL).
2. Open **https://innovexle.com** and **https://www.innovexle.com** in the browser.

Your site is now hosted on **innovexle.com**. Next we make the contact form send to **hello@innovexle.com** reliably.

---

## Part 3  - Email: Resend (sending from innovexle.com)

The app uses [Resend](https://resend.com) to send contact form emails. You need an API key and domain verification so mail is “from” your domain and delivers correctly.

### 3.1 Resend account and API key

1. Go to [resend.com](https://resend.com) and sign up / log in.
2. In the dashboard: **API Keys** → **Create API Key**.
3. Name it (e.g. `innovexle-production`), permission **Sending access**, create.
4. Copy the key (starts with `re_`).
5. In **Vercel** → your project → **Settings** → **Environment Variables**:
   - Add or update `RESEND_API_KEY` with this value.
   - Redeploy so the new key is used.

### 3.2 Verify your domain in Resend (so you can send from @innovexle.com)

1. In Resend: **Domains** → **Add Domain**.
2. Enter: **innovexle.com**.
3. Resend will show DNS records (e.g. **MX**, **TXT** for SPF/DKIM). You only need the ones Resend marks as required for **sending** (not receiving).
4. In your DNS (e.g. Namecheap Advanced DNS), add **only the records Resend shows** for innovexle.com. Do **not** remove your existing **MX** records if you use Namecheap (or another provider) for **receiving** at hello@innovexle.com.
5. In Resend, wait for **Verify** to succeed (can take up to 48 hours, often sooner).
6. After verification, Resend can send from addresses like `noreply@innovexle.com` (which your app uses) to **hello@innovexle.com**.

**Important:**  
- **Sending:** Resend sends contact form emails from your domain.  
- **Receiving:** Your existing mailbox **hello@innovexle.com** (e.g. Namecheap Private Email) stays as is; keep its **MX** records pointing to your email provider.  
Resend’s records are for sending/authentication; your inbox provider’s MX records are for receiving.

---

## Part 4  - Receiving email at hello@innovexle.com

You want messages sent via the site to land in **hello@innovexle.com**.

- **Contact form:** The app sends to `CONTACT_EMAIL` (hello@innovexle.com) via Resend. So the message is **addressed to** hello@innovexle.com. As long as that address is a real mailbox, it will receive the emails.
- **Mailbox:** If you use **Namecheap Private Email** (or similar):
  1. In Namecheap (or your provider), create the mailbox **hello@innovexle.com** if it doesn’t exist.
  2. Keep the **MX** records for innovexle.com pointing to that provider (do not replace them with only Resend’s MX unless you want Resend to receive mail instead).
  3. Log in to the webmail or your mail client and confirm you can receive at hello@innovexle.com.

If you’re not sure about MX:
- For **receiving** at hello@innovexle.com, MX should point to your **email host** (e.g. Namecheap).
- Resend’s DNS is for **sending** and authentication; you can add Resend’s TXT/SPF/DKIM without changing MX for receiving.

---

## Part 5  - Test the full flow

1. **Site:** Open **https://innovexle.com** and **https://innovexle.com/contact** (or your locale, e.g. `/en/contact`).
2. **Contact form:** Submit a test message (use your own email so you can check reply-to).
3. **Inbox:** Check **hello@innovexle.com**; the message should appear within a few minutes.
4. **Resend dashboard:** In Resend → **Emails**, confirm the send is listed and delivered.

If it fails:
- Check Vercel **Environment Variables**: `RESEND_API_KEY` and `CONTACT_EMAIL=hello@innovexle.com`.
- Check Resend: domain verified, no sending errors.
- Check spam folder for hello@innovexle.com.

---

## Checklist

- [ ] Repo **AliUppal97/innovexle** imported and deployed on Vercel  
- [ ] Env vars set: `NEXT_PUBLIC_SITE_URL`, `CONTACT_EMAIL`, `RESEND_API_KEY`  
- [ ] Domain **innovexle.com** (and www) added in Vercel and DNS (A + CNAME) set  
- [ ] Resend: API key created and added to Vercel  
- [ ] Resend: domain **innovexle.com** verified (DNS as shown by Resend)  
- [ ] Mailbox **hello@innovexle.com** exists and MX points to your email provider  
- [ ] Test contact form: message received at hello@innovexle.com  

After this, the site is hosted on **innovexle.com** and emails sent via the site are delivered to **hello@innovexle.com**.
