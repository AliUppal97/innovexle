import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
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
    title: t("termsTitle"),
    description: `${siteConfig.name}. ${t("termsDescription")}`,
    alternates: { canonical: `${siteConfig.url}/terms` },
  };
}

export default async function TermsPage({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("terms");
  const tMeta = await getTranslations("meta");

  return (
    <>
      <JsonLd
        data={getBreadcrumbSchema([
          { name: tMeta("home"), url: siteConfig.url },
          { name: t("title") },
        ])}
      />
      <section className="section-padding">
        <Container size="sm">
          <article className="prose prose-neutral dark:prose-invert max-w-none">
            <header className="mb-12">
              <h1 className="text-h1 font-bold text-foreground">{t("title")}</h1>
              <p className="text-muted mt-4">{t("lastUpdated")}</p>
            </header>

            <div className="space-y-8 text-body text-muted">
              <section>
                <h2 className="text-h2 font-semibold text-foreground mb-4">{t("agreement")}</h2>
                <p>{t("agreementText", { name: siteConfig.name })}</p>
              </section>

              <section>
                <h2 className="text-h2 font-semibold text-foreground mb-4">{t("services")}</h2>
                <p>{t("servicesText", { name: siteConfig.name })}</p>
              </section>

              <section>
                <h2 className="text-h2 font-semibold text-foreground mb-4">{t("ip")}</h2>
                <p className="mb-4">{t("ipText1", { name: siteConfig.name })}</p>
                <p>{t("ipText2")}</p>
              </section>

              <section>
                <h2 className="text-h2 font-semibold text-foreground mb-4">{t("userResp")}</h2>
                <p className="mb-4">{t("userRespText")}</p>
                <ul className="list-disc pl-6 space-y-2">
                  {(t.raw("userRespItems") as string[]).map((item: string) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>

              <section>
                <h2 className="text-h2 font-semibold text-foreground mb-4">{t("liability")}</h2>
                <p>{t("liabilityText", { name: siteConfig.name })}</p>
              </section>

              <section>
                <h2 className="text-h2 font-semibold text-foreground mb-4">{t("governingLaw")}</h2>
                <p>{t("governingLawText", { name: siteConfig.name })}</p>
              </section>

              <section>
                <h2 className="text-h2 font-semibold text-foreground mb-4">{t("changesToTerms")}</h2>
                <p>{t("changesToTermsText")}</p>
              </section>

              <section>
                <h2 className="text-h2 font-semibold text-foreground mb-4">{t("contactInfo")}</h2>
                <p>
                  {t("contactInfoText")}{" "}
                  <a href={`mailto:${siteConfig.email}`} className="text-accent hover:underline">{siteConfig.email}</a>.
                </p>
              </section>
            </div>
          </article>
        </Container>
      </section>
    </>
  );
}
