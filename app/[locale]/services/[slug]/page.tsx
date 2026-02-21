import type { Metadata } from "next";
import { Link } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CTA } from "@/components/sections/CTA";
import { services, type Service } from "@/lib/data/services";
import { siteConfig } from "@/lib/constants";
import { JsonLd, getServiceSchema, getBreadcrumbSchema } from "@/components/seo";
import { locales } from "@/i18n/config";

interface ServicePageProps {
  params: { locale: string; slug: string };
}

function getService(slug: string): Service | undefined {
  return services.find((s) => s.id === slug);
}

export async function generateStaticParams() {
  return locales.flatMap((locale) =>
    services.map((service) => ({ locale, slug: service.id }))
  );
}

export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);

  if (!service) {
    return {
      title: "Service Not Found",
    };
  }

  return {
    title: service.title,
    description: service.description,
    alternates: {
      canonical: `${siteConfig.url}/services/${service.id}`,
    },
    openGraph: {
      title: `${service.title} | ${siteConfig.name}`,
      description: service.description,
      url: `${siteConfig.url}/services/${service.id}`,
    },
  };
}

const serviceIcons: Record<string, JSX.Element> = {
  "api-architecture": (
    <svg className="h-16 w-16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
      <circle cx="8" cy="6" r="1" fill="currentColor" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
      <circle cx="16" cy="18" r="1" fill="currentColor" />
    </svg>
  ),
  "database-design": (
    <svg className="h-16 w-16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <ellipse cx="12" cy="6" rx="8" ry="3" />
      <path d="M4 6v12c0 1.66 3.58 3 8 3s8-1.34 8-3V6" />
      <path d="M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3" />
    </svg>
  ),
  "cloud-infrastructure": (
    <svg className="h-16 w-16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M6.5 19a4.5 4.5 0 01-.42-8.98 6 6 0 0111.84 0A4.5 4.5 0 0117.5 19H6.5z" />
    </svg>
  ),
  "system-integration": (
    <svg className="h-16 w-16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="6" height="6" rx="1" />
      <rect x="15" y="3" width="6" height="6" rx="1" />
      <rect x="3" y="15" width="6" height="6" rx="1" />
      <rect x="15" y="15" width="6" height="6" rx="1" />
      <path d="M9 6h6M9 18h6M6 9v6M18 9v6" />
    </svg>
  ),
  "performance-optimization": (
    <svg className="h-16 w-16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  "security-audits": (
    <svg className="h-16 w-16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2l8 4v6c0 5.5-3.5 10-8 11-4.5-1-8-5.5-8-11V6l8-4z" />
      <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

function getRelatedServices(currentId: string): Service[] {
  const relatedMap: Record<string, string[]> = {
    "api-architecture": ["database-design", "performance-optimization"],
    "database-design": ["api-architecture", "cloud-infrastructure"],
    "cloud-infrastructure": ["system-integration", "security-audits"],
    "system-integration": ["api-architecture", "cloud-infrastructure"],
    "performance-optimization": ["database-design", "cloud-infrastructure"],
    "security-audits": ["cloud-infrastructure", "system-integration"],
  };

  const relatedIds = relatedMap[currentId] || [];
  return services.filter((s) => relatedIds.includes(s.id));
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("services");

  const service = getService(slug);

  if (!service) {
    notFound();
  }

  const relatedServices = getRelatedServices(service.id);

  return (
    <>
      <JsonLd
        data={getServiceSchema(
          service.title,
          service.description,
          "Backend Engineering"
        )}
      />
      <JsonLd
        data={getBreadcrumbSchema([
          { name: "Home", url: siteConfig.url },
          { name: "Services", url: `${siteConfig.url}/services` },
          { name: service.title },
        ])}
      />

      {/* Hero */}
      <section className="section-padding">
        <Container>
          <div className="mx-auto max-w-3xl">
            {/* Breadcrumb */}
            <nav className="mb-8" aria-label="Breadcrumb">
              <ol className="flex items-center gap-2 text-small text-muted">
                <li>
                  <Link href="/" className="hover:text-foreground transition-colors">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                  <Link href="/services" className="hover:text-foreground transition-colors">
                    Services
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li className="text-foreground" aria-current="page">
                  {service.title}
                </li>
              </ol>
            </nav>

            {/* Icon */}
            <div className="mb-6 text-foreground">
              {serviceIcons[service.id]}
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-h1 font-bold text-foreground">{service.title}</h1>
            <p className="mt-4 text-lg sm:text-xl lg:text-h3 font-normal text-muted">
              {service.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-2">
              {service.technologies.map((tech) => (
                <Badge key={tech} variant="default">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Outcomes */}
      <section className="section-padding bg-card/50">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="text-xl sm:text-2xl lg:text-h2 font-bold text-foreground mb-8">
              {t("whatYouGet")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {service.outcomes.map((outcome, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-6 rounded-lg border border-border bg-card"
                >
                  <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-accent/10 text-accent">
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        d="M5 13l4 4L19 7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <p className="text-body text-foreground">{outcome}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Our Approach */}
      <section className="section-padding">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="text-xl sm:text-2xl lg:text-h2 font-bold text-foreground mb-8">
              {t("ourApproach")}
            </h2>
            <div className="space-y-8">
              <div>
                <h3 className="text-h3 font-semibold text-foreground mb-3">
                  1. Assessment
                </h3>
                <p className="text-body text-muted">
                  We begin with a thorough analysis of your current infrastructure,
                  identifying bottlenecks, security gaps, and opportunities for
                  improvement. No assumptions—just data-driven insights.
                </p>
              </div>
              <div>
                <h3 className="text-h3 font-semibold text-foreground mb-3">
                  2. Design
                </h3>
                <p className="text-body text-muted">
                  We architect solutions that balance immediate needs with
                  long-term scalability. Every decision is documented with clear
                  rationale and trade-off analysis.
                </p>
              </div>
              <div>
                <h3 className="text-h3 font-semibold text-foreground mb-3">
                  3. Implementation
                </h3>
                <p className="text-body text-muted">
                  We build with production in mind from day one. Comprehensive
                  testing, monitoring integration, and documentation are
                  non-negotiable parts of every deliverable.
                </p>
              </div>
              <div>
                <h3 className="text-h3 font-semibold text-foreground mb-3">
                  4. Knowledge Transfer
                </h3>
                <p className="text-body text-muted">
                  Your team should be able to maintain and evolve everything we
                  build. We provide thorough documentation, training sessions, and
                  ongoing support options.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Related Services */}
      {relatedServices.length > 0 && (
        <section className="section-padding bg-card/50">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl sm:text-2xl lg:text-h2 font-bold text-foreground mb-8">
                {t("relatedServices")}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relatedServices.map((related) => (
                  <Link
                    key={related.id}
                    href={`/services/${related.id}`}
                    className="group p-6 rounded-lg border border-border bg-card hover:border-accent/30 hover:shadow-lg transition-all"
                  >
                    <div className="mb-3 text-foreground group-hover:text-accent transition-colors">
                      {serviceIcons[related.id] && (
                        <div className="h-8 w-8">
                          {serviceIcons[related.id]}
                        </div>
                      )}
                    </div>
                    <h3 className="text-h3 font-semibold text-foreground group-hover:text-accent transition-colors">
                      {related.title}
                    </h3>
                    <p className="mt-2 text-small text-muted line-clamp-2">
                      {related.description}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* CTA */}
      <section className="section-padding bg-foreground text-background">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-h1 font-bold">
              {t("readyToStart", { service: service.title.toLowerCase() })}
            </h2>
            <div className="mt-8">
              <Button
                asChild
                variant="secondary"
                size="lg"
                className="bg-background text-foreground hover:bg-background/90"
              >
                <Link href="/contact">{t("learnMore")}</Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
