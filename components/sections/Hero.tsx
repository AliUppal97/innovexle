import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export function Hero() {
  return (
    <section className="relative overflow-hidden section-padding">
      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <svg
          className="absolute h-full w-full stroke-border [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="grid-pattern"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path d="M.5 40V.5H40" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" strokeWidth="0" fill="url(#grid-pattern)" />
        </svg>
      </div>

      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-display font-bold tracking-tight text-foreground animate-fade-in">
            We build systems that scale.
          </h1>
          <p className="mt-6 text-h3 font-normal text-muted animate-slide-up animation-delay-100">
            Backend engineering for companies that can&apos;t afford downtime.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up animation-delay-200">
            <Button asChild size="lg">
              <Link href="/contact">Talk to an engineer</Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link href="/case-studies">View our work</Link>
            </Button>
          </div>
        </div>

        {/* Abstract visual element */}
        <div className="mt-16 flex justify-center animate-fade-in animation-delay-300" aria-hidden="true">
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-accent/20 to-transparent blur-3xl" />
            <svg
              className="h-64 w-64 text-foreground/10"
              viewBox="0 0 200 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Hexagonal grid pattern */}
              <g stroke="currentColor" strokeWidth="1">
                <path d="M100 20L140 45V95L100 120L60 95V45L100 20Z" />
                <path d="M100 45L125 60V90L100 105L75 90V60L100 45Z" />
                <path d="M60 95L100 120L100 170L60 145V95Z" />
                <path d="M140 95L100 120L100 170L140 145V95Z" />
                <path d="M20 70L60 95V145L20 120V70Z" />
                <path d="M180 70L140 95V145L180 120V70Z" />
              </g>
              {/* Connection points */}
              <g fill="currentColor">
                <circle cx="100" cy="20" r="3" />
                <circle cx="100" cy="45" r="3" />
                <circle cx="100" cy="120" r="3" />
                <circle cx="60" cy="95" r="3" />
                <circle cx="140" cy="95" r="3" />
              </g>
            </svg>
          </div>
        </div>
      </Container>
    </section>
  );
}
