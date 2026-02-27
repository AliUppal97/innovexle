# Innovexle

A world-class website for a backend engineering company. Built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- **SEO Optimized**: JSON-LD structured data, dynamic OG images, sitemap, robots.txt
- **Performance**: Static generation, optimized fonts, minimal JavaScript
- **Accessibility**: WCAG 2.1 compliant, focus management, screen reader support
- **Analytics Ready**: Privacy-aware analytics with support for Plausible, GA4, Fathom
- **Contact Form**: Working form with rate limiting, spam protection, and email delivery
- **Security**: HSTS, CSP, XSS protection, and other security headers

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Deployment**: Vercel
- **Font**: Inter (via next/font)

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn

### Installation

```bash
# Clone the repository (replace with your GitHub username or org)
git clone https://github.com/your-username/innovexle.git

# Navigate to the project directory
cd innovexle

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Project Structure

```
innovexle/
├── app/
│   ├── layout.tsx              # Root layout with JSON-LD
│   ├── page.tsx                # Homepage
│   ├── api/
│   │   └── contact/            # Contact form API
│   ├── services/
│   │   ├── page.tsx            # Services listing
│   │   └── [slug]/page.tsx     # Individual service pages
│   ├── case-studies/
│   │   ├── page.tsx            # Case studies listing
│   │   └── [slug]/page.tsx     # Individual case study pages
│   ├── about/page.tsx          # About page
│   ├── contact/page.tsx        # Contact form
│   ├── privacy/page.tsx        # Privacy policy
│   ├── terms/page.tsx          # Terms of service
│   ├── opengraph-image.tsx     # Dynamic OG image
│   ├── twitter-image.tsx       # Dynamic Twitter image
│   ├── icon.tsx                # Dynamic favicon
│   ├── apple-icon.tsx          # Apple touch icon
│   ├── sitemap.ts              # Dynamic sitemap
│   ├── robots.ts               # Robots.txt
│   └── manifest.ts             # PWA manifest
├── components/
│   ├── analytics/              # Privacy-aware analytics
│   ├── layout/                 # Header, Footer
│   ├── seo/                    # JSON-LD components
│   ├── sections/               # Page sections
│   └── ui/                     # Reusable UI components
├── lib/
│   ├── constants.ts            # Site configuration
│   ├── utils.ts                # Utility functions
│   └── data/                   # Content data
├── public/                     # Static assets
└── tailwind.config.ts          # Tailwind configuration
```

## Available Scripts

```bash
# Development
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Run linting
npm run lint
```

## Design System

### Colors

| Token       | Light Mode | Dark Mode | Usage            |
|-------------|------------|-----------|------------------|
| background  | #FAFAFA    | #0A0A0A   | Page background  |
| foreground  | #171717    | #EDEDED   | Primary text     |
| muted       | #737373    | #A3A3A3   | Secondary text   |
| accent      | #3B82F6    | #60A5FA   | CTAs, links      |
| border      | #E5E5E5    | #262626   | Borders          |

### Typography

- **Display**: 4.5rem (72px) - Hero headlines
- **H1**: 3rem (48px) - Page titles
- **H2**: 2.25rem (36px) - Section titles
- **H3**: 1.5rem (24px) - Card titles
- **Body**: 1.125rem (18px) - Paragraph text
- **Small**: 0.875rem (14px) - Captions

## Deployment

- **[DEPLOYMENT.md](./DEPLOYMENT.md)**  - Deploy to Vercel and connect a custom domain (e.g. Namecheap).
- **[GITHUB.md](./GITHUB.md)**  - Create the GitHub repo, commit standards, and push steps for the portfolio.

## Performance

The site is optimized for performance:

- Static generation for all pages
- Optimized fonts via next/font
- Minimal JavaScript bundle (~87KB shared)
- Dynamic image generation (OG, icons)
- Target Lighthouse score: ≥95

## SEO Features

- **Structured Data**: Organization, WebSite, Service, FAQPage, BreadcrumbList schemas
- **Dynamic OG Images**: Auto-generated OpenGraph and Twitter images
- **Canonical URLs**: Proper canonical tags on all pages
- **XML Sitemap**: Dynamic sitemap including all service and case study pages
- **Robots.txt**: Properly configured for search engines

## Accessibility

- Semantic HTML structure
- ARIA labels on interactive elements
- Keyboard navigation support
- Skip to main content link
- Color contrast ratio ≥4.5:1
- Focus indicators and focus trapping in modals
- Screen reader announcements

## Security

Security headers configured in `vercel.json`:

- `Strict-Transport-Security` (HSTS)
- `X-Content-Type-Options`
- `X-Frame-Options`
- `Referrer-Policy`
- `Permissions-Policy`

## Environment Variables

Copy `.env.example` to `.env.local` and configure:

```bash
# Analytics (Plausible, GA4, or Fathom)
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id

# Contact form email delivery
RESEND_API_KEY=your-resend-api-key
CONTACT_EMAIL=hello@innovexle.com
```

## License

Proprietary. Copyright © 2026 Innovexle. All rights reserved. See [LICENSE](./LICENSE).
