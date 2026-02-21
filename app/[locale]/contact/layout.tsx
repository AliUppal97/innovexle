import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { JsonLd, getFAQPageSchema, getBreadcrumbSchema } from "@/components/seo";
import { siteConfig } from "@/lib/constants";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const { setRequestLocale } = await import("next-intl/server");
  setRequestLocale(locale);
  const t = await import("next-intl/server").then((m) => m.getTranslations("meta"));
  return {
    title: t("contactTitle"),
    description: t("contactDescription"),
    alternates: { canonical: `${siteConfig.url}/contact` },
  };
}

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

export default async function ContactLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await import("next-intl/server").then((m) => m.getTranslations("contact"));
  const tMeta = await import("next-intl/server").then((m) => m.getTranslations("meta"));

  return (
    <>
      <JsonLd data={getFAQPageSchema([
        { question: t("faq1Title"), answer: t("faq1Content") },
        { question: t("faq2Title"), answer: t("faq2Content") },
        { question: t("faq3Title"), answer: t("faq3Content") },
        { question: t("faq4Title"), answer: t("faq4Content") },
      ])} />
      <JsonLd
        data={getBreadcrumbSchema([
          { name: tMeta("home"), url: siteConfig.url },
          { name: tMeta("contactTitle") },
        ])}
      />
      {children}
    </>
  );
}
