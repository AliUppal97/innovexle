import type { Metadata } from "next";
import { Suspense } from "react";
import { Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import "../globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { ToastProvider } from "@/components/ui/Toast";
import { TopLoader } from "@/components/ui/TopLoader";
import { CookieConsent } from "@/components/ui/CookieConsent";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { Chatbot } from "@/components/ui/Chatbot";
import { RegionProvider } from "@/components/ui/RegionSelector";
import { siteConfig } from "@/lib/constants";
import { JsonLd, getOrganizationSchema, getWebSiteSchema } from "@/components/seo";
import { Analytics } from "@/components/analytics";
import { WebVitals } from "@/components/analytics/WebVitals";
import { locales, localeDirection, type Locale } from "@/i18n/config";
import { routing } from "@/i18n/routing";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | Backend Engineering`,
    template: `%s | ${siteConfig.name}`,
  },
  icons: {
    icon: [
      { url: "/icon", type: "image/png", sizes: "32x32" },
      { url: "/icon.svg", type: "image/svg+xml", sizes: "any" },
    ],
    shortcut: "/favicon.svg",
    apple: "/apple-icon",
  },
  description: siteConfig.description,
  keywords: [
    "backend engineering",
    "API development",
    "cloud infrastructure",
    "system architecture",
    "database design",
    "performance optimization",
    "microservices",
    "distributed systems",
    "scalability",
    "reliability engineering",
  ],
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    creator: "@innovexle",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteConfig.url,
    languages: Object.fromEntries(
      locales.map((l) => [l, l === "en" ? siteConfig.url : `${siteConfig.url}/${l}`])
    ),
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();
  const dir = localeDirection[locale as Locale] || "ltr";

  return (
    <html lang={locale} dir={dir} className={inter.variable} suppressHydrationWarning>
      <head>
        <JsonLd data={[getOrganizationSchema(), getWebSiteSchema()]} />
        {locales.map((l) => (
          <link
            key={l}
            rel="alternate"
            hrefLang={l}
            href={l === "en" ? siteConfig.url : `${siteConfig.url}/${l}`}
          />
        ))}
        <link rel="alternate" hrefLang="x-default" href={siteConfig.url} />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("innovexle-theme");var d=t==="dark"||(t!=="light"&&matchMedia("(prefers-color-scheme:dark)").matches);document.documentElement.classList.toggle("dark",d)}catch(e){}})()`,
          }}
        />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>
            <RegionProvider>
              <ToastProvider>
                <TopLoader />
                <a href="#main-content" className="skip-link">
                  Skip to main content
                </a>
                <Header />
                <main id="main-content" className="pt-16">{children}</main>
                <Footer />
                <CookieConsent />
                <Chatbot />
                <ScrollToTop />
                <Suspense fallback={null}>
                  <Analytics />
                  <WebVitals />
                </Suspense>
              </ToastProvider>
            </RegionProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
