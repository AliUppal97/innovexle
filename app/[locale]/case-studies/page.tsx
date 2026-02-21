import type { Metadata } from "next";
import { Link } from "@/i18n/routing";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { CaseStudyCard } from "@/components/sections/CaseStudyCard";
import { caseStudies } from "@/lib/data/case-studies";
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
    title: t("caseStudiesTitle"),
    description: t("caseStudiesDescription"),
    alternates: { canonical: `${siteConfig.url}/case-studies` },
  };
}

export default async function CaseStudiesPage({ params }: { params: { locale: string } }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("caseStudies");
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
            <h2 className="text-h3 sm:text-h2 lg:text-h2 font-bold text-foreground text-center mb-12">
              {t("keyTakeaways")}
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
                      {t("problem")}
                    </h4>
                    <p className="text-body text-muted">{caseStudy.problem}</p>
                  </div>

                  {/* Solution */}
                  <div>
                    <h4 className="text-h3 font-semibold text-foreground mb-3">
                      {t("solution")}
                    </h4>
                    <p className="text-body text-muted">{caseStudy.solution}</p>
                  </div>

                  {/* Results */}
                  <div>
                    <h4 className="text-h3 font-semibold text-foreground mb-4">
                      {t("results")}
                    </h4>
                    <div className="grid grid-cols-1 min-[360px]:grid-cols-3 gap-4">
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
                      {t("techUsed")}
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
