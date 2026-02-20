import { Link } from "@/i18n/routing";
import { Container } from "@/components/ui/Container";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Reveal, StaggerContainer, StaggerItem } from "@/components/ui/MotionWrapper";
import { services } from "@/lib/data/services";

const serviceIcons: Record<string, JSX.Element> = {
  "api-architecture": (
    <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
      <circle cx="8" cy="6" r="1" fill="currentColor" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
      <circle cx="16" cy="18" r="1" fill="currentColor" />
    </svg>
  ),
  "database-design": (
    <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <ellipse cx="12" cy="6" rx="8" ry="3" />
      <path d="M4 6v12c0 1.66 3.58 3 8 3s8-1.34 8-3V6" />
      <path d="M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3" />
    </svg>
  ),
  "cloud-infrastructure": (
    <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M6.5 19a4.5 4.5 0 01-.42-8.98 6 6 0 0111.84 0A4.5 4.5 0 0117.5 19H6.5z" />
    </svg>
  ),
  "system-integration": (
    <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="6" height="6" rx="1" />
      <rect x="15" y="3" width="6" height="6" rx="1" />
      <rect x="3" y="15" width="6" height="6" rx="1" />
      <rect x="15" y="15" width="6" height="6" rx="1" />
      <path d="M9 6h6M9 18h6M6 9v6M18 9v6" />
    </svg>
  ),
  "performance-optimization": (
    <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  "security-audits": (
    <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2l8 4v6c0 5.5-3.5 10-8 11-4.5-1-8-5.5-8-11V6l8-4z" />
      <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

interface ServicesProps {
  showAll?: boolean;
}

export function Services({ showAll = false }: ServicesProps) {
  const displayedServices = showAll ? services : services.slice(0, 6);

  return (
    <section className="section-padding bg-card/50" aria-labelledby="services-heading">
      <Container>
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <h2 id="services-heading" className="text-h1 font-bold text-foreground">
              What we do
            </h2>
            <p className="mt-4 text-body text-muted">
              Specialized backend engineering services focused on reliability, performance, and scale.
            </p>
          </div>
        </Reveal>

        <StaggerContainer className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {displayedServices.map((service) => (
            <StaggerItem key={service.id}>
              <Card hover className="group h-full">
                <CardHeader>
                  <div className="mb-4 text-foreground group-hover:text-accent transition-colors">
                    {serviceIcons[service.id]}
                  </div>
                  <CardTitle>{service.title}</CardTitle>
                </CardHeader>
                <CardDescription>{service.description}</CardDescription>
              </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {!showAll && (
          <div className="mt-12 text-center">
            <Link
              href="/services"
              className="text-body font-medium text-foreground hover:text-accent transition-colors inline-flex items-center gap-2"
            >
              View all services
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        )}
      </Container>
    </section>
  );
}
