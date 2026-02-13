import type { Metadata } from "next";
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

export default function PrivacyPage() {
  return (
    <>
      <JsonLd
        data={getBreadcrumbSchema([
          { name: "Home", url: siteConfig.url },
          { name: "Privacy Policy" },
        ])}
      />
      <section className="section-padding">
        <Container size="sm">
          <article className="prose prose-neutral dark:prose-invert max-w-none">
            <header className="mb-12">
              <h1 className="text-h1 font-bold text-foreground">Privacy Policy</h1>
            <p className="text-muted mt-4">Last updated: February 1, 2026</p>
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
                <li>
                  Contact information (name, email address, company name) when you
                  fill out our contact form
                </li>
                <li>
                  Communications you send to us via email or through our website
                </li>
                <li>
                  Any other information you choose to provide
                </li>
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
                Information Sharing
              </h2>
              <p>
                We do not sell, trade, or otherwise transfer your personal
                information to third parties. We may share your information with
                trusted service providers who assist us in operating our website
                and conducting our business, provided they agree to keep your
                information confidential.
              </p>
            </section>

            <section>
              <h2 className="text-h2 font-semibold text-foreground mb-4">
                Data Security
              </h2>
              <p>
                We implement appropriate technical and organizational measures to
                protect your personal data against unauthorized access, alteration,
                disclosure, or destruction. However, no method of transmission over
                the Internet or electronic storage is 100% secure.
              </p>
            </section>

            <section>
              <h2 className="text-h2 font-semibold text-foreground mb-4">
                Your Rights
              </h2>
              <p className="mb-4">You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access the personal data we hold about you</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Object to processing of your data</li>
                <li>Request data portability</li>
              </ul>
            </section>

            <section>
              <h2 className="text-h2 font-semibold text-foreground mb-4">
                Cookies
              </h2>
              <p>
                Our website uses cookies to enhance your experience. You can set
                your browser to refuse cookies or alert you when cookies are being
                sent. However, some parts of our website may not function properly
                without cookies.
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
                If you have any questions about this privacy policy, please contact
                us at{" "}
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
