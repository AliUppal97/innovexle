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

  const measures = [
    "Semantic HTML throughout the application",
    "ARIA labels and roles for interactive components",
    "Keyboard navigation support with visible focus indicators",
    "Skip navigation link to main content",
    "Color contrast ratios meeting WCAG AA standards",
    "Responsive design for all screen sizes",
    "Reduced motion support for users who prefer it",
    "Focus trap management in modal dialogs",
    "Form validation with accessible error messages",
    "Structured headings for screen reader navigation",
  ];

  const techSpecs = ["HTML", "CSS", "JavaScript", "WAI-ARIA"];

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
                  Our Commitment
                </h2>
                <p>
                  Innovexle is committed to ensuring digital accessibility for people with disabilities.
                  We continually improve the user experience for everyone and apply the relevant accessibility standards.
                </p>
              </section>

              <section>
                <h2 className="text-h2 font-semibold text-foreground mb-4">
                  Conformance Status
                </h2>
                <p>
                  We aim to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 at Level AA.
                  These guidelines explain how to make web content more accessible to people with a wide array of disabilities.
                </p>
              </section>

              <section>
                <h2 className="text-h2 font-semibold text-foreground mb-4">
                  Measures Taken
                </h2>
                <ul className="list-disc pl-6 space-y-2">
                  {measures.map((measure) => (
                    <li key={measure}>{measure}</li>
                  ))}
                </ul>
              </section>

              <section>
                <h2 className="text-h2 font-semibold text-foreground mb-4">
                  Technical Specifications
                </h2>
                <p className="mb-4">
                  Accessibility of this website relies on the following technologies:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  {techSpecs.map((spec) => (
                    <li key={spec}>{spec}</li>
                  ))}
                </ul>
              </section>

              <section>
                <h2 className="text-h2 font-semibold text-foreground mb-4">
                  Assessment Approach
                </h2>
                <p>
                  Innovexle assesses the accessibility of this website through self-evaluation using
                  automated testing tools (axe-core) integrated into our CI/CD pipeline, manual testing
                  with screen readers, and keyboard-only navigation testing.
                </p>
              </section>

              <section>
                <h2 className="text-h2 font-semibold text-foreground mb-4">
                  Feedback
                </h2>
                <p>
                  We welcome your feedback on the accessibility of the Innovexle website.
                  Please let us know if you encounter accessibility barriers by contacting us at{" "}
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
