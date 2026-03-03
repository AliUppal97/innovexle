import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/MotionWrapper";
import { TrustLogosStrip } from "@/components/sections/TrustLogosStrip";

export async function Hero() {
  const t = await getTranslations("home");

  return (
    <section className="section-hero -mt-16 relative overflow-hidden h-screen max-h-screen flex flex-col min-h-0 pb-6 sm:pb-8 lg:pb-10">
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

      <Container className="flex flex-1 flex-col justify-between min-h-0">
        <div className="min-h-0 shrink-0 mt-6 sm:mt-8 lg:mt-10">
          <div className="mx-auto max-w-3xl text-center">
            <Reveal variant="fade-up">
              <h1 className="text-h2 sm:text-h1 lg:text-display font-bold tracking-tight text-foreground leading-[1.15]">
                {t("heroTitle")}
              </h1>
            </Reveal>
            <Reveal variant="fade-up" delay={0.1}>
              <p className="mt-8 text-body sm:text-h3 lg:text-h3 font-normal text-muted max-w-2xl mx-auto leading-relaxed">
                {t("heroSubtitle")}
              </p>
            </Reveal>
            <Reveal variant="fade-up" delay={0.2}>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button asChild size="lg">
                  <Link href="/contact">{t("heroCta")}</Link>
                </Button>
                <Button asChild variant="secondary" size="lg">
                  <Link href="/case-studies">{t("heroSecondaryCta")}</Link>
                </Button>
              </div>
            </Reveal>
          </div>

          <Reveal variant="fade-in" delay={0.3}>
            <div className="mt-12 lg:mt-14 flex justify-center" aria-hidden="true">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-accent/10 via-accent-secondary/5 to-transparent blur-3xl" aria-hidden="true" />
                <svg
                  className="h-28 w-28 sm:h-40 sm:w-40 lg:h-48 lg:w-48 text-foreground/10"
                  viewBox="0 0 200 200"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g stroke="currentColor" strokeWidth="1">
                    <path d="M100 20L140 45V95L100 120L60 95V45L100 20Z" />
                    <path d="M100 45L125 60V90L100 105L75 90V60L100 45Z" />
                    <path d="M60 95L100 120L100 170L60 145V95Z" />
                    <path d="M140 95L100 120L100 170L140 145V95Z" />
                    <path d="M20 70L60 95V145L20 120V70Z" />
                    <path d="M180 70L140 95V145L180 120V70Z" />
                  </g>
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
          </Reveal>
        </div>

        <TrustLogosStrip />
      </Container>
    </section>
  );
}
