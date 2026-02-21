import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/lib/constants";
import { JsonLd, getBreadcrumbSchema } from "@/components/seo";

export const metadata: Metadata = {
  title: "Accessibility Statement",
  description: `Accessibility statement for ${siteConfig.name}. Our commitment to digital accessibility for all users.`,
  alternates: {
    canonical: `${siteConfig.url}/accessibility`,
  },
};

export default async function AccessibilityPage({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("accessibility");

  const measures = t.raw("measuresItems") as string[];
  const techSpecs = t.raw("techItems") as string[];

  return (
    <>
      <JsonLd
        data={getBreadcrumbSchema([
          { name: "Home", url: siteConfig.url },
          { name: t("title") },
        ])}
      />
      <section className="section-padding">
        <Container size="sm">
          <article className="prose prose-neutral dark:prose-invert max-w-none">
            <header className="mb-12">
              <h1 className="text-h1 font-bold text-foreground">{t("title")}</h1>
              <p className="text-muted mt-4">{t("subtitle")}</p>
            </header>

            <div className="space-y-8 text-body text-muted">
              <section>
                <h2 className="text-h2 font-semibold text-foreground mb-4">
                  {t("commitment")}
                </h2>
                <p>{t("commitmentText")}</p>
              </section>

              <section>
                <h2 className="text-h2 font-semibold text-foreground mb-4">
                  {t("conformance")}
                </h2>
                <p>{t("conformanceText")}</p>
              </section>

              <section>
                <h2 className="text-h2 font-semibold text-foreground mb-4">
                  {t("measures")}
                </h2>
                <ul className="list-disc pl-6 space-y-2">
                  {measures.map((measure: string) => (
                    <li key={measure}>{measure}</li>
                  ))}
                </ul>
              </section>

              <section>
                <h2 className="text-h2 font-semibold text-foreground mb-4">
                  {t("technicalSpecs")}
                </h2>
                <p className="mb-4">{t("technicalSpecsText")}</p>
                <ul className="list-disc pl-6 space-y-2">
                  {techSpecs.map((spec: string) => (
                    <li key={spec}>{spec}</li>
                  ))}
                </ul>
              </section>

              <section>
                <h2 className="text-h2 font-semibold text-foreground mb-4">
                  {t("assessment")}
                </h2>
                <p>{t("assessmentText")}</p>
              </section>

              <section>
                <h2 className="text-h2 font-semibold text-foreground mb-4">
                  {t("feedback")}
                </h2>
                <p>
                  {t("feedbackText")}{" "}
                  <a href={`mailto:${siteConfig.email}`} className="text-accent hover:underline">
                    {siteConfig.email}
                  </a>.
                </p>
              </section>
            </div>
          </article>
        </Container>
      </section>
    </>
  );
}
