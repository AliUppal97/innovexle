"use client";

import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/MotionWrapper";

const clients = [
  "Series B Fintech",
  "Healthcare Platform",
  "E-commerce Scale-up",
  "SaaS Enterprise",
  "AdTech Leader",
  "Cloud Startup",
];

export function ClientLogos() {
  const t = useTranslations("home");

  return (
    <section className="py-12 border-b border-border" aria-label="Trusted by">
      <Container>
        <Reveal variant="fade-in">
          <p className="text-center text-small font-medium text-muted uppercase tracking-wider mb-8">
            {t("clientLogosTitle")}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-4 sm:gap-x-8 sm:gap-y-6 lg:gap-x-12">
            {clients.map((name) => (
              <div
                key={name}
                className="flex items-center gap-2 text-muted/60 hover:text-muted transition-colors"
              >
                <div className="h-8 w-8 rounded-md bg-muted/10 flex items-center justify-center text-small font-bold">
                  {name.charAt(0)}
                </div>
                <span className="text-small font-medium whitespace-nowrap">
                  {name}
                </span>
              </div>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
