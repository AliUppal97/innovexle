import type { Metadata } from "next";
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

export default function CareersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
