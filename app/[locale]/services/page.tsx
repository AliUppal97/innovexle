import type { Metadata } from "next";
import { Link } from "@/i18n/routing";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { services } from "@/lib/data/services";
import { CTA } from "@/components/sections/CTA";
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
    title: t("servicesTitle"),
    description: t("servicesDescription"),
    alternates: { canonical: `${siteConfig.url}/services` },
  };
}

const serviceIcons: Record<string, JSX.Element> = {
  "api-architecture": (
    <svg className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
      <circle cx="8" cy="6" r="1" fill="currentColor" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
      <circle cx="16" cy="18" r="1" fill="currentColor" />
    </svg>
  ),
  "database-design": (
    <svg className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <ellipse cx="12" cy="6" rx="8" ry="3" />
      <path d="M4 6v12c0 1.66 3.58 3 8 3s8-1.34 8-3V6" />
      <path d="M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3" />
    </svg>
  ),
  "cloud-infrastructure": (
    <svg className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M6.5 19a4.5 4.5 0 01-.42-8.98 6 6 0 0111.84 0A4.5 4.5 0 0117.5 19H6.5z" />
    </svg>
  ),
  "system-integration": (
    <svg className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="6" height="6" rx="1" />
      <rect x="15" y="3" width="6" height="6" rx="1" />
      <rect x="3" y="15" width="6" height="6" rx="1" />
      <rect x="15" y="15" width="6" height="6" rx="1" />
      <path d="M9 6h6M9 18h6M6 9v6M18 9v6" />
    </svg>
  ),
  "performance-optimization": (
    <svg className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  "security-audits": (
    <svg className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2l8 4v6c0 5.5-3.5 10-8 11-4.5-1-8-5.5-8-11V6l8-4z" />
      <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

export default async function ServicesPage({ params }: { params: { locale: string } }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("services");
  const tMeta = await getTranslations("meta");

  return (
    <>
      <JsonLd
        data={getBreadcrumbSchema([
          { name: tMeta("home"), url: siteConfig.url },
          { name: t("title") },
        ])}
      />

      {/* Hero */}
      <section className="section-padding">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-h3 sm:text-h2 lg:text-h1 font-bold text-foreground">{t("title")}</h1>
            <p className="mt-4 text-body text-muted">
              {t("subtitle")}
            </p>
          </div>
        </Container>
      </section>

      {/* Services Grid: responsive, no overlapping on any viewport */}
      <section className="section-padding bg-card/50">
        <Container>
          <div className="grid grid-cols-1 gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-2 min-w-0">
            {services.map((service) => {
              const key = service.id.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
              const outcomes = t.raw(`items.${key}.outcomes`) as string[];
              return (
              <Link
                key={service.id}
                href={`/services/${service.id}`}
                className="group block min-w-0 w-full"
              >
                <Card className="p-5 sm:p-6 lg:p-8 h-full card-hover min-w-0 overflow-hidden">
                  <CardHeader>
                    <div className="mb-5 sm:mb-6 shrink-0 w-10 h-10 flex items-center justify-center overflow-hidden text-foreground group-hover:text-accent transition-colors [&>svg]:size-10 [&>svg]:shrink-0">
                      {serviceIcons[service.id]}
                    </div>
                    <CardTitle className="text-h3 sm:text-h2 group-hover:text-accent transition-colors min-w-0 break-words">
                      {t(`items.${key}.title`)}
                    </CardTitle>
                  </CardHeader>

                  <CardDescription className="text-body mb-4 sm:mb-6 min-w-0 break-words">
                    {t(`items.${key}.description`)}
                  </CardDescription>

                  <CardContent className="space-y-4 sm:space-y-6 min-w-0">
                    {/* Outcomes */}
                    <div className="min-w-0">
                      <h4 className="text-small font-semibold text-foreground uppercase tracking-wider mb-2 sm:mb-3">
                        {t("whatYouGet")}
                      </h4>
                      <ul className="space-y-2">
                        {outcomes.map((outcome) => (
                          <li key={outcome} className="flex items-start gap-2 text-body text-muted min-w-0">
                            <svg
                              className="h-5 w-5 text-accent shrink-0 mt-0.5 flex-shrink-0"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              aria-hidden
                            >
                              <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span className="min-w-0 break-words">{outcome}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Technologies */}
                    <div className="pt-3 sm:pt-4 border-t border-border min-w-0">
                      <h4 className="text-small font-semibold text-foreground uppercase tracking-wider mb-2 sm:mb-3">
                        {t("technologies")}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {service.technologies.map((tech) => (
                          <Badge key={tech} variant="default">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Learn more indicator */}
                    <div className="pt-3 sm:pt-4 flex items-center gap-2 text-body font-medium text-foreground group-hover:text-accent transition-colors shrink-0">
                      {t("learnMore")}
                      <svg
                        className="h-4 w-4 group-hover:translate-x-1 transition-transform"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
            })}
          </div>
        </Container>
      </section>

      {/* Process */}
      <section className="section-padding">
        <Container>
          <div className="mx-auto max-w-2xl text-center mb-12">
            <h2 className="text-h3 sm:text-h2 lg:text-h1 font-bold text-foreground">{t("ourApproach")}</h2>
            <p className="mt-4 text-body text-muted">
              {t("approachSubtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="space-y-4">
              <h3 className="text-h3 font-semibold text-foreground">
                {t("weDontDo")}
              </h3>
              <ul className="space-y-3">
                {(t.raw("weDontDoItems") as string[]).map((item) => (
                  <li key={item} className="flex items-start gap-2 text-body text-muted">
                    <svg
                      className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-h3 font-semibold text-foreground">
                {t("weAlwaysDo")}
              </h3>
              <ul className="space-y-3">
                {(t.raw("weAlwaysDoItems") as string[]).map((item) => (
                  <li key={item} className="flex items-start gap-2 text-body text-muted">
                    <svg
                      className="h-5 w-5 text-accent flex-shrink-0 mt-0.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      <CTA />
    </>
  );
}
