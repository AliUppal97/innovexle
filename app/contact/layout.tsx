import type { Metadata } from "next";
import { JsonLd, getFAQPageSchema, getBreadcrumbSchema } from "@/components/seo";
import { siteConfig } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Innovexle. Tell us about your backend engineering challenges and we'll respond within one business day.",
  alternates: {
    canonical: `${siteConfig.url}/contact`,
  },
};

const faqs = [
  {
    question: "What's your typical engagement look like?",
    answer:
      "Most engagements start with a discovery phase where we understand your current state and constraints. From there, we scope specific deliverables with clear timelines. Engagements typically range from focused 4-week sprints to multi-month partnerships.",
  },
  {
    question: "Do you work with early-stage startups?",
    answer:
      "Yes, we work with companies at various stages. For early-stage companies, we often focus on setting up scalable foundations that won't need to be rewritten as you grow. We're upfront about what makes sense to build now vs. later.",
  },
  {
    question: "What industries do you work with?",
    answer:
      "We've worked across fintech, healthcare, e-commerce, and SaaS. The common thread is companies that need reliable, scalable backend systems. Industry-specific compliance requirements (HIPAA, PCI, SOC 2) are areas we have direct experience with.",
  },
  {
    question: "How do you handle ongoing support?",
    answer:
      "Every project includes comprehensive documentation and knowledge transfer. For clients who want ongoing support, we offer retainer arrangements for continued advisory and maintenance work.",
  },
];

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd data={getFAQPageSchema(faqs)} />
      <JsonLd
        data={getBreadcrumbSchema([
          { name: "Home", url: siteConfig.url },
          { name: "Contact" },
        ])}
      />
      {children}
    </>
  );
}
