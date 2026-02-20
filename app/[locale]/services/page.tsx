import type { Metadata } from "next";
import { Link } from "@/i18n/routing";
import { setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { services } from "@/lib/data/services";
import { CTA } from "@/components/sections/CTA";
import { siteConfig } from "@/lib/constants";
import { JsonLd, getBreadcrumbSchema } from "@/components/seo";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Specialized backend engineering services: API architecture, database design, cloud infrastructure, system integration, performance optimization, and security audits.",
  alternates: {
    canonical: `${siteConfig.url}/services`,
  },
};

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

  return (
    <>
      <JsonLd
        data={getBreadcrumbSchema([
          { name: "Home", url: siteConfig.url },
          { name: "Services" },
        ])}
      />

      {/* Hero */}
      <section className="section-padding">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-h1 font-bold text-foreground">Our Services</h1>
            <p className="mt-4 text-body text-muted">
              Specialized backend engineering services focused on reliability,
              performance, and scale. Every engagement is tailored to your specific needs.
            </p>
          </div>
        </Container>
      </section>

      {/* Services Grid */}
      <section className="section-padding bg-card/50">
        <Container>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {services.map((service) => (
              <Link
                key={service.id}
                href={`/services/${service.id}`}
                className="group"
              >
                <Card className="p-8 h-full card-hover">
                  <CardHeader>
                    <div className="mb-4 text-foreground group-hover:text-accent transition-colors">
                      {serviceIcons[service.id]}
                    </div>
                    <CardTitle className="text-h2 group-hover:text-accent transition-colors">
                      {service.title}
                    </CardTitle>
                  </CardHeader>

                  <CardDescription className="text-body mb-6">
                    {service.description}
                  </CardDescription>

                  <CardContent className="space-y-6">
                    {/* Outcomes */}
                    <div>
                      <h4 className="text-small font-semibold text-foreground uppercase tracking-wider mb-3">
                        What you get
                      </h4>
                      <ul className="space-y-2">
                        {service.outcomes.map((outcome) => (
                          <li key={outcome} className="flex items-start gap-2 text-body text-muted">
                            <svg
                              className="h-5 w-5 text-accent flex-shrink-0 mt-0.5"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            {outcome}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Technologies */}
                    <div className="pt-4 border-t border-border">
                      <h4 className="text-small font-semibold text-foreground uppercase tracking-wider mb-3">
                        Technologies
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
                    <div className="pt-4 flex items-center gap-2 text-body font-medium text-foreground group-hover:text-accent transition-colors">
                      Learn more
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
            ))}
          </div>
        </Container>
      </section>

      {/* Process */}
      <section className="section-padding">
        <Container>
          <div className="mx-auto max-w-2xl text-center mb-12">
            <h2 className="text-h1 font-bold text-foreground">Our Approach</h2>
            <p className="mt-4 text-body text-muted">
              Every project follows a structured approach that ensures predictable outcomes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="space-y-4">
              <h3 className="text-h3 font-semibold text-foreground">
                We don&apos;t do
              </h3>
              <ul className="space-y-3">
                {[
                  "Quick fixes that create technical debt",
                  "Over-engineering for problems that don't exist",
                  "Vendor lock-in without clear justification",
                  "Solutions without documentation",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-body text-muted">
                    <svg
                      className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5"
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
                We always do
              </h3>
              <ul className="space-y-3">
                {[
                  "Document every architectural decision",
                  "Build with observability from day one",
                  "Design for failure and graceful degradation",
                  "Transfer knowledge to your team",
                ].map((item) => (
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
