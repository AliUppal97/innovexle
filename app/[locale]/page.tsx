import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { Process } from "@/components/sections/Process";
import { CaseStudies } from "@/components/sections/CaseStudies";
import { Trust } from "@/components/sections/Trust";
import { CTA } from "@/components/sections/CTA";
import { ClientLogos } from "@/components/sections/ClientLogos";

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
    title: t("homeTitle"),
    description: t("homeDescription"),
  };
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <ClientLogos />
      <Services />
      <Process />
      <CaseStudies />
      <Trust />
      <CTA />
    </>
  );
}
