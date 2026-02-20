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
                  Introduction
                </h2>
                <p>
                  {siteConfig.name} (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) respects your privacy and
                  is committed to protecting your personal data. This privacy policy
                  explains how we collect, use, and safeguard your information when
                  you visit our website or use our services.
                </p>
              </section>

              <section>
                <h2 className="text-h2 font-semibold text-foreground mb-4">
                  Information We Collect
                </h2>
                <p className="mb-4">
                  We collect information you provide directly to us, including:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Contact information (name, email address, company name) when you fill out our contact form</li>
                  <li>Communications you send to us via email or through our website</li>
                  <li>Any other information you choose to provide</li>
                </ul>
                <p className="mt-4">
                  We automatically collect certain information when you visit our
                  website, including your IP address, browser type, operating system,
                  and pages viewed. This information is collected through cookies and
                  similar technologies.
                </p>
              </section>

              <section>
                <h2 className="text-h2 font-semibold text-foreground mb-4">
                  How We Use Your Information
                </h2>
                <p className="mb-4">We use the information we collect to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Respond to your inquiries and provide customer support</li>
                  <li>Send you information about our services</li>
                  <li>Improve our website and services</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              <section>
                <h2 className="text-h2 font-semibold text-foreground mb-4">
                  GDPR &amp; International Data Rights
                </h2>
                <p className="mb-4">
                  If you are a resident of the European Economic Area (EEA), United Kingdom, or other jurisdictions with data protection laws, you have additional rights including:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Right to access the personal data we hold about you</li>
                  <li>Right to rectification of inaccurate data</li>
                  <li>Right to erasure (&quot;right to be forgotten&quot;)</li>
                  <li>Right to restrict processing</li>
                  <li>Right to data portability</li>
                  <li>Right to object to processing</li>
                  <li>Right to withdraw consent at any time</li>
                </ul>
                <p className="mt-4">
                  We process personal data under the following legal bases: consent, contractual necessity, and legitimate interests. To exercise any of these rights, please contact us at{" "}
                  <a href={`mailto:${siteConfig.email}`} className="text-accent hover:underline">{siteConfig.email}</a>.
                </p>
              </section>

              <section>
                <h2 className="text-h2 font-semibold text-foreground mb-4">
                  Cookies &amp; Consent
                </h2>
                <p>
                  Our website uses cookies to enhance your experience. We provide a cookie consent banner that allows you to accept or decline non-essential cookies. Essential cookies required for site functionality are always active. You can change your cookie preferences at any time through your browser settings.
                </p>
              </section>

              <section>
                <h2 className="text-h2 font-semibold text-foreground mb-4">
                  Data Security
                </h2>
                <p>
                  We implement appropriate technical and organizational measures to
                  protect your personal data against unauthorized access, alteration,
                  disclosure, or destruction, including encryption in transit and at rest.
                </p>
              </section>

              <section>
                <h2 className="text-h2 font-semibold text-foreground mb-4">
                  Data Retention
                </h2>
                <p>
                  We retain personal data only for as long as necessary to fulfill the purposes for which it was collected, comply with legal obligations, or resolve disputes. Contact form data is retained for 12 months unless you request earlier deletion.
                </p>
              </section>

              <section>
                <h2 className="text-h2 font-semibold text-foreground mb-4">
                  International Data Transfers
                </h2>
                <p>
                  If you are located outside the United States, your personal data may be transferred to and processed in the United States or other countries. We ensure appropriate safeguards are in place for such transfers in compliance with applicable data protection laws.
                </p>
              </section>

              <section>
                <h2 className="text-h2 font-semibold text-foreground mb-4">
                  Changes to This Policy
                </h2>
                <p>
                  We may update this privacy policy from time to time. We will notify
                  you of any changes by posting the new policy on this page and
                  updating the &quot;Last updated&quot; date.
                </p>
              </section>

              <section>
                <h2 className="text-h2 font-semibold text-foreground mb-4">
                  Contact Us
                </h2>
                <p>
                  If you have any questions about this privacy policy or wish to exercise your data rights, please contact us at{" "}
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
