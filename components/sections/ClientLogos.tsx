"use client";

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
  return (
    <section className="py-12 border-b border-border" aria-label="Trusted by">
      <Container>
        <Reveal variant="fade-in">
          <p className="text-center text-small font-medium text-muted uppercase tracking-wider mb-8">
            Trusted by engineering teams at
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
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
