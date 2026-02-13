import type { Metadata } from "next";
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

export default function TermsPage() {
  return (
    <>
      <JsonLd
        data={getBreadcrumbSchema([
          { name: "Home", url: siteConfig.url },
          { name: "Terms of Service" },
        ])}
      />
      <section className="section-padding">
        <Container size="sm">
          <article className="prose prose-neutral dark:prose-invert max-w-none">
            <header className="mb-12">
              <h1 className="text-h1 font-bold text-foreground">Terms of Service</h1>
            <p className="text-muted mt-4">Last updated: February 1, 2026</p>
          </header>

          <div className="space-y-8 text-body text-muted">
            <section>
              <h2 className="text-h2 font-semibold text-foreground mb-4">
                Agreement to Terms
              </h2>
              <p>
                By accessing or using the {siteConfig.name} website and services,
                you agree to be bound by these Terms of Service. If you do not
                agree to these terms, please do not use our website or services.
              </p>
            </section>

            <section>
              <h2 className="text-h2 font-semibold text-foreground mb-4">
                Services
              </h2>
              <p>
                {siteConfig.name} provides backend engineering consulting and
                development services. The specific scope, deliverables, and terms
                for any engagement will be defined in a separate service agreement
                between {siteConfig.name} and the client.
              </p>
            </section>

            <section>
              <h2 className="text-h2 font-semibold text-foreground mb-4">
                Intellectual Property
              </h2>
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
              <h2 className="text-h2 font-semibold text-foreground mb-4">
                User Responsibilities
              </h2>
              <p className="mb-4">When using our website, you agree to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide accurate information when contacting us</li>
                <li>Not use our website for any unlawful purpose</li>
                <li>Not attempt to gain unauthorized access to our systems</li>
                <li>Not interfere with the proper functioning of our website</li>
              </ul>
            </section>

            <section>
              <h2 className="text-h2 font-semibold text-foreground mb-4">
                Limitation of Liability
              </h2>
              <p>
                {siteConfig.name} provides this website and its content &quot;as is&quot;
                without any warranties, express or implied. We shall not be liable
                for any direct, indirect, incidental, consequential, or punitive
                damages arising from your use of this website.
              </p>
            </section>

            <section>
              <h2 className="text-h2 font-semibold text-foreground mb-4">
                Third-Party Links
              </h2>
              <p>
                Our website may contain links to third-party websites. We are not
                responsible for the content or privacy practices of these external
                sites. We encourage you to review the terms and privacy policies of
                any third-party sites you visit.
              </p>
            </section>

            <section>
              <h2 className="text-h2 font-semibold text-foreground mb-4">
                Confidentiality
              </h2>
              <p>
                We treat all client information as confidential. Any information
                shared with us during inquiries or engagements will be handled in
                accordance with our Privacy Policy and any applicable
                confidentiality agreements.
              </p>
            </section>

            <section>
              <h2 className="text-h2 font-semibold text-foreground mb-4">
                Indemnification
              </h2>
              <p>
                You agree to indemnify and hold harmless {siteConfig.name}, its
                officers, directors, employees, and agents from any claims,
                damages, losses, or expenses arising from your use of our website
                or violation of these terms.
              </p>
            </section>

            <section>
              <h2 className="text-h2 font-semibold text-foreground mb-4">
                Governing Law
              </h2>
              <p>
                These Terms of Service shall be governed by and construed in
                accordance with the laws of the jurisdiction in which{" "}
                {siteConfig.name} operates, without regard to its conflict of law
                provisions.
              </p>
            </section>

            <section>
              <h2 className="text-h2 font-semibold text-foreground mb-4">
                Changes to Terms
              </h2>
              <p>
                We reserve the right to modify these terms at any time. Changes
                will be effective immediately upon posting to this website. Your
                continued use of our website after any changes constitutes
                acceptance of the new terms.
              </p>
            </section>

            <section>
              <h2 className="text-h2 font-semibold text-foreground mb-4">
                Contact Information
              </h2>
              <p>
                If you have any questions about these Terms of Service, please
                contact us at{" "}
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="text-accent hover:underline"
                >
                  {siteConfig.email}
                </a>
                .
              </p>
            </section>
          </div>
        </article>
      </Container>
    </section>
    </>
  );
}
