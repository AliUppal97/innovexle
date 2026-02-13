import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { CaseStudyCard } from "@/components/sections/CaseStudyCard";
import { caseStudies } from "@/lib/data/case-studies";
import { CTA } from "@/components/sections/CTA";
import { siteConfig } from "@/lib/constants";
import { JsonLd, getBreadcrumbSchema } from "@/components/seo";

export const metadata: Metadata = {
  title: "Case Studies",
  description:
    "Real engineering projects with measurable results. See how we've helped companies solve complex backend challenges.",
  alternates: {
    canonical: `${siteConfig.url}/case-studies`,
  },
};

export default function CaseStudiesPage() {
  return (
    <>
      <JsonLd
        data={getBreadcrumbSchema([
          { name: "Home", url: siteConfig.url },
          { name: "Case Studies" },
        ])}
      />

      {/* Hero */}
      <section className="section-padding">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-h1 font-bold text-foreground">Case Studies</h1>
            <p className="mt-4 text-body text-muted">
              Real problems. Measurable results. No embellishment.
            </p>
          </div>
        </Container>
      </section>

      {/* Case Studies Grid */}
      <section className="section-padding bg-card/50">
        <Container>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {caseStudies.map((caseStudy) => (
              <Link
                key={caseStudy.id}
                href={`/case-studies/${caseStudy.id}`}
                className="group"
              >
                <CaseStudyCard caseStudy={caseStudy} />
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* Detailed Case Studies */}
      <section className="section-padding">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="text-h2 font-bold text-foreground text-center mb-12">
              In-Depth Analysis
            </h2>

            {caseStudies.slice(0, 3).map((caseStudy, index) => (
              <article
                key={caseStudy.id}
                className={`${index > 0 ? "mt-16 pt-16 border-t border-border" : ""}`}
              >
                <header className="mb-8">
                  <span className="text-small font-medium text-accent uppercase tracking-wider">
                    {caseStudy.industry}
                  </span>
                  <h3 className="text-h2 font-bold text-foreground mt-2">
                    {caseStudy.title}
                  </h3>
                </header>

                <div className="space-y-8">
                  {/* Problem */}
                  <div>
                    <h4 className="text-h3 font-semibold text-foreground mb-3">
                      The Challenge
                    </h4>
                    <p className="text-body text-muted">{caseStudy.problem}</p>
                  </div>

                  {/* Solution */}
                  <div>
                    <h4 className="text-h3 font-semibold text-foreground mb-3">
                      Our Approach
                    </h4>
                    <p className="text-body text-muted">{caseStudy.solution}</p>
                  </div>

                  {/* Results */}
                  <div>
                    <h4 className="text-h3 font-semibold text-foreground mb-4">
                      Results
                    </h4>
                    <div className="grid grid-cols-3 gap-4">
                      {caseStudy.results.map((result) => (
                        <div
                          key={result.metric}
                          className="text-center p-4 rounded-lg border border-border bg-card"
                        >
                          <p className="text-h2 font-bold text-accent">
                            {result.value}
                          </p>
                          <p className="text-small text-muted mt-1">
                            {result.metric}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Technologies */}
                  <div className="pt-4">
                    <h4 className="text-small font-semibold text-foreground uppercase tracking-wider mb-3">
                      Technologies Used
                    </h4>
                    <p className="text-body text-muted">
                      {caseStudy.technologies.join(" • ")}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <CTA />
    </>
  );
}
