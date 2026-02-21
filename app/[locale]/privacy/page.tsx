import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/lib/constants";
import { JsonLd, getBreadcrumbSchema } from "@/components/seo";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Privacy Policy for ${siteConfig.name}. Learn how we collect, use, and protect your personal information.`,
  alternates: {
    canonical: `${siteConfig.url}/privacy`,
  },
};

export default async function PrivacyPage({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("privacy");

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
              <p className="text-muted mt-4">{t("lastUpdated")}</p>
            </header>

            <div className="space-y-8 text-body text-muted">
              <section>
                <h2 className="text-h2 font-semibold text-foreground mb-4">
                  {t("introduction")}
                </h2>
                <p>{t("introText", { name: siteConfig.name })}</p>
              </section>

              <section>
                <h2 className="text-h2 font-semibold text-foreground mb-4">
                  {t("infoCollect")}
                </h2>
                <p className="mb-4">{t("infoCollectText")}</p>
                <ul className="list-disc pl-6 space-y-2">
                  {(t.raw("infoItems") as string[]).map((item: string) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <p className="mt-4">{t("autoCollect")}</p>
              </section>

              <section>
                <h2 className="text-h2 font-semibold text-foreground mb-4">
                  {t("howWeUse")}
                </h2>
                <p className="mb-4">{t("howWeUseText")}</p>
                <ul className="list-disc pl-6 space-y-2">
                  {(t.raw("useItems") as string[]).map((item: string) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>

              <section>
                <h2 className="text-h2 font-semibold text-foreground mb-4">
                  {t("rights")}
                </h2>
                <p className="mb-4">{t("rightsText")}</p>
                <ul className="list-disc pl-6 space-y-2">
                  {(t.raw("rightsItems") as string[]).map((item: string) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>

              <section>
                <h2 className="text-h2 font-semibold text-foreground mb-4">
                  {t("cookies")}
                </h2>
                <p>{t("cookiesText")}</p>
              </section>

              <section>
                <h2 className="text-h2 font-semibold text-foreground mb-4">
                  {t("security")}
                </h2>
                <p>{t("securityText")}</p>
              </section>

              <section>
                <h2 className="text-h2 font-semibold text-foreground mb-4">
                  {t("changes")}
                </h2>
                <p>{t("changesText")}</p>
              </section>

              <section>
                <h2 className="text-h2 font-semibold text-foreground mb-4">
                  {t("contactUs")}
                </h2>
                <p>
                  {t("contactUsText")}{" "}
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
