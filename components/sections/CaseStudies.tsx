import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Reveal, StaggerContainer, StaggerItem } from "@/components/ui/MotionWrapper";
import { CaseStudyCard } from "./CaseStudyCard";
import { featuredCaseStudies, caseStudies } from "@/lib/data/case-studies";

interface CaseStudiesProps {
  showAll?: boolean;
}

export function CaseStudies({ showAll = false }: CaseStudiesProps) {
  const displayedStudies = showAll ? caseStudies : featuredCaseStudies;

  return (
    <section className="section-padding bg-card/50" aria-labelledby="case-studies-heading">
      <Container>
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <h2 id="case-studies-heading" className="text-h1 font-bold text-foreground">
              {showAll ? "Case Studies" : "Recent work"}
            </h2>
            <p className="mt-4 text-body text-muted">
              Real problems. Measurable results. No embellishment.
            </p>
          </div>
        </Reveal>

        <StaggerContainer className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {displayedStudies.map((caseStudy) => (
            <StaggerItem key={caseStudy.id}>
              <CaseStudyCard caseStudy={caseStudy} featured />
            </StaggerItem>
          ))}
        </StaggerContainer>

        {!showAll && (
          <div className="mt-12 text-center">
            <Link
              href="/case-studies"
              className="text-body font-medium text-foreground hover:text-accent transition-colors inline-flex items-center gap-2"
            >
              View all case studies
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
