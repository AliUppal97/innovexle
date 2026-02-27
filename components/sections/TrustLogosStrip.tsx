"use client";

import { useTranslations } from "next-intl";
import { Reveal } from "@/components/ui/MotionWrapper";

const clients = [
  "Series B Fintech",
  "Healthcare Platform",
  "E-commerce Scale-up",
  "SaaS Enterprise",
  "AdTech Leader",
  "Cloud Startup",
];

/**
 * Trust logos strip for use inside Hero. Renders "Teams who trust us" with
 * client badges. No section/Container - parent provides layout.
 */
export function TrustLogosStrip() {
  const t = useTranslations("home");
  const tA11y = useTranslations("a11y");

  return (
    <Reveal variant="fade-in" delay={0.4}>
      <div
        className="mt-8 pt-8 lg:pt-10 border-t border-border shrink-0"
        aria-label={tA11y("trustedBy")}
      >
        <p className="text-center text-small font-medium text-muted uppercase tracking-wider mb-5">
          {t("clientLogosTitle")}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-4 sm:gap-x-8 sm:gap-y-5 lg:gap-x-10 lg:gap-y-5">
          {clients.map((name) => (
            <div
              key={name}
              className="flex items-center gap-2 text-muted/60 hover:text-muted transition-colors duration-200"
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
      </div>
    </Reveal>
  );
}
