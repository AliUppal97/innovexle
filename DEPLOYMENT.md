# Deployment Guide

This guide covers deploying Innovexle to Vercel and connecting a custom domain from Namecheap.

## Prerequisites

- [Vercel account](https://vercel.com/signup)
- [Namecheap account](https://www.namecheap.com/) with your domain registered
- Git repository on GitHub — see **[GITHUB.md](./GITHUB.md)** for creating the repo and first push

## Deploy to Vercel

### Option 1: Deploy via Git (Recommended)

1. **Push your code to GitHub**  
   Follow the full steps (repo creation, commit standards, and push) in **[GITHUB.md](./GITHUB.md)**. Quick version:
   ```bash
   git init
   git add .
   git commit -m "chore: initial commit — Innovexle portfolio"
   git branch -M main
   git remote add origin https://github.com/your-username/innovexle.git
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Click "Import Project"
   - Select your GitHub repository
   - Vercel will auto-detect Next.js settings
   - Click "Deploy"

3. **Automatic Deployments**
   - Every push to `main` triggers a production deployment
   - Pull requests get preview deployments

### Option 2: Deploy via CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   # Preview deployment
   vercel

   # Production deployment
   vercel --prod
   ```

## Connect Namecheap Domain

### Step 1: Add Domain in Vercel

1. Go to your project in the Vercel dashboard
2. Navigate to **Settings** → **Domains**
3. Enter your domain (e.g., `innovexle.com`)
4. Click **Add**
5. Vercel will show you the required DNS records

### Step 2: Configure DNS in Namecheap

1. Log in to [Namecheap](https://www.namecheap.com/)
2. Go to **Domain List** → find your domain → **Manage**
3. Click on **Advanced DNS** tab
4. Delete any existing A, AAAA, or CNAME records for `@` and `www`
5. Add the following records:

**For root domain (innovexle.com):**

| Type | Host | Value | TTL |
|------|------|-------|-----|
| A | @ | 76.76.21.21 | Automatic |

**For www subdomain:**

| Type | Host | Value | TTL |
|------|------|-------|-----|
| CNAME | www | cname.vercel-dns.com | Automatic |

### Step 3: Verify Domain

1. Return to Vercel project settings
2. Wait for DNS propagation (usually 5-30 minutes, sometimes up to 48 hours)
3. Vercel will automatically provision an SSL certificate
4. Your domain will show as "Valid Configuration" when ready

### Alternative: Use Vercel Nameservers

For easier management, you can point your domain's nameservers directly to Vercel:

1. In Namecheap, go to **Domain List** → **Manage**
2. Under **Nameservers**, select **Custom DNS**
3. Add Vercel's nameservers:
   - `ns1.vercel-dns.com`
   - `ns2.vercel-dns.com`
4. In Vercel, the domain will be automatically configured

## Environment Variables

If you need environment variables (e.g., for a contact form API):

1. Go to Vercel project **Settings** → **Environment Variables**
2. Add your variables for Production, Preview, and Development
3. Redeploy to apply changes

Example variables you might need:
```
NEXT_PUBLIC_SITE_URL=https://innovexle.com
CONTACT_EMAIL=hello@innovexle.com
```

## Post-Deployment Checklist

- [ ] All pages load correctly
- [ ] Mobile responsiveness works
- [ ] Contact form functions (if connected to backend)
- [ ] SSL certificate is active (https://)
- [ ] Sitemap is accessible at `/sitemap.xml`
- [ ] Robots.txt is accessible at `/robots.txt`
- [ ] Open Graph images work (test with [opengraph.xyz](https://www.opengraph.xyz/))
- [ ] Google Search Console verified
- [ ] Analytics configured (if applicable)

## Performance Verification

After deployment, run Lighthouse audit:

1. Open your live site in Chrome
2. Open DevTools (F12)
3. Go to "Lighthouse" tab
4. Run audit for Desktop and Mobile

Target scores:
- Performance: ≥95
- Accessibility: ≥95
- Best Practices: ≥95
- SEO: ≥95

## Troubleshooting

### Domain not resolving
- Wait 24-48 hours for DNS propagation
- Verify DNS records are correct in Namecheap
- Check for typos in CNAME values

### SSL certificate not issued
- Ensure domain is properly verified in Vercel
- Check that no conflicting CAA records exist
- Wait a few minutes for automatic provisioning

### Build failures
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Test build locally with `npm run build`

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [Namecheap DNS Guide](https://www.namecheap.com/support/knowledgebase/article.aspx/767/10/how-to-change-dns-for-a-domain/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
