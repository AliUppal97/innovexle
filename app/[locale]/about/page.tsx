import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/Container";
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
    title: t("aboutTitle"),
    description: t("aboutDescription"),
    alternates: { canonical: `${siteConfig.url}/about` },
  };
}

const values = [
  {
    title: "Reliability First",
    description:
      "Every system we build is designed to fail gracefully. We think about edge cases before they become incidents.",
  },
  {
    title: "Clarity Over Cleverness",
    description:
      "We write code that future engineers will thank us for. No unnecessary abstractions, no magic.",
  },
  {
    title: "Measured Outcomes",
    description:
      "We don't guess. Every recommendation is backed by data, and every improvement is measured.",
  },
  {
    title: "Knowledge Transfer",
    description:
      "We're not here to create dependency. Your team should be able to maintain and evolve everything we build.",
  },
];

const principles = [
  "Ship incrementally, not all at once",
  "Observability is not optional",
  "Documentation is part of the deliverable",
  "Test the failure modes, not just the happy path",
  "Simple is harder than complex, but always better",
  "The best code is code you don't have to write",
];

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tMeta = await import("next-intl/server").then((m) => m.getTranslations("meta"));

  return (
    <>
      <JsonLd
        data={getBreadcrumbSchema([
          { name: tMeta("home"), url: siteConfig.url },
          { name: tMeta("aboutTitle") },
        ])}
      />

      <section className="section-padding">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h1 className="text-h1 font-bold text-foreground">About Innovexle</h1>
            <p className="mt-6 text-h3 font-normal text-muted">
              We&apos;re backend engineers who&apos;ve spent years building systems that
              handle millions of requests. Now we help other companies do the same.
            </p>
          </div>
        </Container>
      </section>

      <section className="section-padding bg-card/50">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="text-h2 font-bold text-foreground">What we believe</h2>
            <div className="mt-8 space-y-6">
              <p className="text-body text-muted">
                Most infrastructure problems aren&apos;t technology problems—they&apos;re
                clarity problems. Companies struggle not because the right tools
                don&apos;t exist, but because they haven&apos;t clearly defined what they
                need those tools to do.
              </p>
              <p className="text-body text-muted">
                We start every engagement by understanding constraints. What does
                failure cost? What does success look like? What are the
                non-negotiables? Only then do we design systems.
              </p>
              <p className="text-body text-muted">
                The result is infrastructure that&apos;s not just technically sound, but
                aligned with business reality. Systems that scale when you need them
                to, stay within budget, and don&apos;t require a team of specialists to
                maintain.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="section-padding">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="text-h2 font-bold text-foreground text-center mb-12">
              Our Values
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {values.map((value) => (
                <div key={value.title}>
                  <h3 className="text-h3 font-semibold text-foreground">
                    {value.title}
                  </h3>
                  <p className="mt-2 text-body text-muted">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="section-padding bg-card/50">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="text-h2 font-bold text-foreground text-center mb-12">
              Engineering Principles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {principles.map((principle, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card"
                >
                  <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-accent/10 text-accent text-small font-medium">
                    {index + 1}
                  </span>
                  <p className="text-body text-foreground">{principle}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="section-padding">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-h2 font-bold text-foreground">How we work</h2>
            <div className="mt-8 text-left space-y-6">
              <p className="text-body text-muted">
                We&apos;re a small team by design. Every project gets direct attention
                from senior engineers who&apos;ve shipped production systems at scale.
                No account managers, no junior handoffs.
              </p>
              <p className="text-body text-muted">
                We communicate in plain language, not jargon. You&apos;ll always know
                what we&apos;re doing, why we&apos;re doing it, and what the tradeoffs are.
                We document everything and explain our reasoning.
              </p>
              <p className="text-body text-muted">
                We&apos;re not the right fit for every project. If we don&apos;t think we
                can deliver meaningful value, we&apos;ll tell you upfront. Our
                reputation is built on results, not hours billed.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <CTA />
    </>
  );
}
