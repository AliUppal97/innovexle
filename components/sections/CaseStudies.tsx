import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Container } from "@/components/ui/Container";
import { Reveal, StaggerContainer, StaggerItem } from "@/components/ui/MotionWrapper";
import { CaseStudyCard } from "./CaseStudyCard";
import { featuredCaseStudies, caseStudies } from "@/lib/data/case-studies";

interface CaseStudiesProps {
  showAll?: boolean;
}

export async function CaseStudies({ showAll = false }: CaseStudiesProps) {
  const t = await getTranslations("caseStudies");
  const displayedStudies = showAll ? caseStudies : featuredCaseStudies;

  return (
    <section className="section-padding bg-card/50" aria-labelledby="case-studies-heading">
      <Container>
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <h2 id="case-studies-heading" className="text-h3 sm:text-h2 lg:text-h1 font-bold text-foreground">
              {t("title")}
            </h2>
            <p className="mt-4 text-body text-muted">
              {t("subtitle")}
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
              {t("viewAll")}
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
