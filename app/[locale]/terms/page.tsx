import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/lib/constants";
import { JsonLd, getBreadcrumbSchema } from "@/components/seo";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `Terms of Service for ${siteConfig.name}. Read our terms and conditions for using our website and services.`,
  alternates: {
    canonical: `${siteConfig.url}/terms`,
  },
};

export default async function TermsPage({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("terms");

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
                <h2 className="text-h2 font-semibold text-foreground mb-4">Agreement to Terms</h2>
                <p>
                  By accessing or using the {siteConfig.name} website and services,
                  you agree to be bound by these Terms of Service. If you do not
                  agree to these terms, please do not use our website or services.
                </p>
              </section>

              <section>
                <h2 className="text-h2 font-semibold text-foreground mb-4">Services</h2>
                <p>
                  {siteConfig.name} provides backend engineering consulting and
                  development services. The specific scope, deliverables, and terms
                  for any engagement will be defined in a separate service agreement.
                </p>
              </section>

              <section>
                <h2 className="text-h2 font-semibold text-foreground mb-4">Intellectual Property</h2>
                <p className="mb-4">
                  The content on this website, including text, graphics, logos, and
                  images, is the property of {siteConfig.name} and is protected by
                  copyright and other intellectual property laws.
                </p>
                <p>
                  For client engagements, intellectual property rights to
                  deliverables will be specified in the service agreement.
                </p>
              </section>

              <section>
                <h2 className="text-h2 font-semibold text-foreground mb-4">User Responsibilities</h2>
                <p className="mb-4">When using our website, you agree to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide accurate information when contacting us</li>
                  <li>Not use our website for any unlawful purpose</li>
                  <li>Not attempt to gain unauthorized access to our systems</li>
                  <li>Not interfere with the proper functioning of our website</li>
                </ul>
              </section>

              <section>
                <h2 className="text-h2 font-semibold text-foreground mb-4">Limitation of Liability</h2>
                <p>
                  {siteConfig.name} provides this website and its content &quot;as is&quot;
                  without any warranties. We shall not be liable for any damages arising from your use of this website.
                </p>
              </section>

              <section>
                <h2 className="text-h2 font-semibold text-foreground mb-4">Governing Law</h2>
                <p>
                  These Terms of Service shall be governed by and construed in
                  accordance with applicable laws. For international clients, disputes shall be resolved according to the governing law specified in the service agreement.
                </p>
              </section>

              <section>
                <h2 className="text-h2 font-semibold text-foreground mb-4">Changes to Terms</h2>
                <p>
                  We reserve the right to modify these terms at any time. Changes
                  will be effective immediately upon posting.
                </p>
              </section>

              <section>
                <h2 className="text-h2 font-semibold text-foreground mb-4">Contact Information</h2>
                <p>
                  If you have any questions about these Terms of Service, please contact us at{" "}
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
