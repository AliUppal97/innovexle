import type { Metadata } from "next";
import { Link } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { caseStudies, type CaseStudy } from "@/lib/data/case-studies";
import { CTA } from "@/components/sections/CTA";
import { siteConfig } from "@/lib/constants";
import { JsonLd, getBreadcrumbSchema } from "@/components/seo";
import { locales } from "@/i18n/config";

interface CaseStudyPageProps {
  params: { locale: string; slug: string };
}

function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((cs) => cs.id === slug);
}

export async function generateStaticParams() {
  return locales.flatMap((locale) =>
    caseStudies.map((caseStudy) => ({ locale, slug: caseStudy.id }))
  );
}

export async function generateMetadata({
  params,
}: CaseStudyPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("errors");
  const caseStudy = getCaseStudy(slug);

  if (!caseStudy) {
    return {
      title: t("caseStudyNotFound"),
    };
  }

  const description = `${caseStudy.industry} case study: ${caseStudy.title}. ${caseStudy.results.map((r) => `${r.metric}: ${r.value}`).join(". ")}`;

  return {
    title: `${caseStudy.title} (${caseStudy.industry})`,
    description,
    alternates: {
      canonical: `${siteConfig.url}/case-studies/${caseStudy.id}`,
    },
    openGraph: {
      title: `${caseStudy.title} | ${siteConfig.name}`,
      description,
      url: `${siteConfig.url}/case-studies/${caseStudy.id}`,
    },
  };
}

function getRelatedCaseStudies(current: CaseStudy): CaseStudy[] {
  return caseStudies
    .filter((cs) => cs.id !== current.id)
    .filter(
      (cs) =>
        cs.industry === current.industry ||
        cs.technologies.some((t) => current.technologies.includes(t))
    )
    .slice(0, 2);
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("caseStudies");
  const tMeta = await getTranslations("meta");
  const tA11y = await getTranslations("a11y");

  const caseStudy = getCaseStudy(slug);

  if (!caseStudy) {
    notFound();
  }

  const relatedCaseStudies = getRelatedCaseStudies(caseStudy);

  return (
    <>
      <JsonLd
        data={getBreadcrumbSchema([
          { name: tMeta("home"), url: siteConfig.url },
          { name: t("title"), url: `${siteConfig.url}/case-studies` },
          { name: caseStudy.title },
        ])}
      />

      {/* Hero */}
      <section className="section-padding">
        <Container>
          <div className="mx-auto max-w-3xl">
            {/* Breadcrumb */}
            <nav className="mb-8" aria-label={tA11y("breadcrumb")}>
              <ol className="flex items-center gap-2 text-small text-muted">
                <li>
                  <Link href="/" className="hover:text-foreground transition-colors">
                    {tMeta("home")}
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                  <Link
                    href="/case-studies"
                    className="hover:text-foreground transition-colors"
                  >
                    {t("title")}
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li className="text-foreground" aria-current="page">
                  {caseStudy.title}
                </li>
              </ol>
            </nav>

            <Badge variant="accent" className="mb-4">
              {caseStudy.industry}
            </Badge>

            <h1 className="text-h3 sm:text-h2 lg:text-h1 font-bold text-foreground">{caseStudy.title}</h1>

            {/* Results Summary */}
            <div className="mt-8 grid grid-cols-1 min-[360px]:grid-cols-3 gap-4">
              {caseStudy.results.map((result) => (
                <div
                  key={result.metric}
                  className="text-center p-4 rounded-lg border border-border bg-card"
                >
                  <p className="text-h2 font-bold text-accent">{result.value}</p>
                  <p className="text-small text-muted mt-1">{result.metric}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Challenge */}
      <section className="section-padding bg-card/50">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="text-h3 sm:text-h2 lg:text-h2 font-bold text-foreground mb-6">
              {t("problem")}
            </h2>
            <p className="text-body text-muted leading-relaxed">
              {caseStudy.problem}
            </p>
          </div>
        </Container>
      </section>

      {/* Solution */}
      <section className="section-padding">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="text-h3 sm:text-h2 lg:text-h2 font-bold text-foreground mb-6">
              {t("solution")}
            </h2>
            <p className="text-body text-muted leading-relaxed">
              {caseStudy.solution}
            </p>

            {/* Technologies Used */}
            <div className="mt-8 pt-8 border-t border-border">
              <h3 className="text-small font-semibold text-foreground uppercase tracking-wider mb-4">
                {t("techUsed")}
              </h3>
              <div className="flex flex-wrap gap-2">
                {caseStudy.technologies.map((tech) => (
                  <Badge key={tech} variant="default">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Results Deep Dive */}
      <section className="section-padding bg-card/50">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="text-h3 sm:text-h2 lg:text-h2 font-bold text-foreground mb-8">
              {t("results")}
            </h2>
            <div className="space-y-6">
              {caseStudy.results.map((result, index) => (
                <div
                  key={result.metric}
                  className="flex items-center gap-6 p-6 rounded-lg border border-border bg-card"
                >
                  <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-accent/10 text-accent font-bold text-h3">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-h3 font-bold text-accent">
                      {result.value}
                    </p>
                    <p className="text-body text-muted">{result.metric}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Key Takeaways */}
      <section className="section-padding">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="text-h3 sm:text-h2 lg:text-h2 font-bold text-foreground mb-8">
              {t("keyTakeaways")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-lg border border-border bg-card">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-accent/10 text-accent mb-4">
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3 className="text-h3 font-semibold text-foreground mb-2">
                  Structured Approach
                </h3>
                <p className="text-body text-muted">
                  A methodical discovery and implementation process ensures
                  predictable outcomes and minimizes risk.
                </p>
              </div>
              <div className="p-6 rounded-lg border border-border bg-card">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-accent/10 text-accent mb-4">
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3 className="text-h3 font-semibold text-foreground mb-2">
                  Measurable Impact
                </h3>
                <p className="text-body text-muted">
                  Every improvement is quantified. Data-driven decisions lead to
                  clear ROI and stakeholder alignment.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Related Case Studies */}
      {relatedCaseStudies.length > 0 && (
        <section className="section-padding bg-card/50">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-h3 sm:text-h2 lg:text-h2 font-bold text-foreground mb-8">
                {t("viewAll")}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relatedCaseStudies.map((related) => (
                  <Link
                    key={related.id}
                    href={`/case-studies/${related.id}`}
                    className="group p-6 rounded-lg border border-border bg-card hover:border-accent/30 hover:shadow-lg transition-all"
                  >
                    <Badge variant="outline" className="mb-3">
                      {related.industry}
                    </Badge>
                    <h3 className="text-h3 font-semibold text-foreground group-hover:text-accent transition-colors">
                      {related.title}
                    </h3>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {related.results.slice(0, 2).map((result) => (
                        <span
                          key={result.metric}
                          className="text-small text-muted"
                        >
                          {result.value} {result.metric}
                        </span>
                      ))}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </Container>
        </section>
      )}

      <CTA />
    </>
  );
}
