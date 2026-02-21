import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { siteConfig } from "@/lib/constants";
import { JsonLd, getBreadcrumbSchema } from "@/components/seo";

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
    title: t("careersTitle"),
    description: t("careersDescription"),
    alternates: { canonical: `${siteConfig.url}/careers` },
  };
}

export default async function CareersLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await import("next-intl/server").then((m) => m.getTranslations("meta"));

  return (
    <>
      <JsonLd
        data={getBreadcrumbSchema([
          { name: t("home"), url: siteConfig.url },
          { name: t("careersTitle") },
        ])}
      />
      {children}
    </>
  );
}
