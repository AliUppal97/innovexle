import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { siteConfig } from "@/lib/constants";
import { JsonLd, getBreadcrumbSchema } from "@/components/seo";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Join Innovexle — open engineering positions at a remote-first backend consultancy. Build systems that scale.",
  alternates: {
    canonical: `${siteConfig.url}/careers`,
  },
};

export default async function CareersLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <JsonLd
        data={getBreadcrumbSchema([
          { name: "Home", url: siteConfig.url },
          { name: "Careers" },
        ])}
      />
      {children}
    </>
  );
}
