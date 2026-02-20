import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { Process } from "@/components/sections/Process";
import { CaseStudies } from "@/components/sections/CaseStudies";
import { Trust } from "@/components/sections/Trust";
import { CTA } from "@/components/sections/CTA";
import { ClientLogos } from "@/components/sections/ClientLogos";

export const metadata: Metadata = {
  title: "Innovexle | Backend Engineering That Scales",
  description:
    "Backend engineering for companies that can't afford downtime. API architecture, cloud infrastructure, database design, and performance optimization.",
};

export default async function Home({
  params,
}: {
  params: { locale: string };
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
