"use client";

import { useState, type FormEvent, useRef, useEffect } from "react";
import { Container } from "@/components/ui/Container";
import { Input, Textarea, Label } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/lib/constants";
import { trackEvent } from "@/components/analytics";

interface FormState {
  status: "idle" | "submitting" | "success" | "error";
  message?: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

export default function ContactPage() {
  const [formState, setFormState] = useState<FormState>({ status: "idle" });
  const [errors, setErrors] = useState<FormErrors>({});
  const formStartTracked = useRef(false);

  // Track when user starts filling the form
  const handleFormStart = () => {
    if (!formStartTracked.current) {
      trackEvent("contact_form_start");
      formStartTracked.current = true;
    }
  };

  const validateForm = (formData: FormData): FormErrors => {
    const errors: FormErrors = {};
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const message = formData.get("message") as string;

    if (!name || name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!message || message.trim().length < 10) {
      errors.message = "Message must be at least 10 characters";
    }

    return errors;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    // Track form submission attempt
    trackEvent("contact_form_submit");

    // Client-side validation
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setFormState({ status: "submitting" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          company: formData.get("company"),
          message: formData.get("message"),
          website: formData.get("website"), // Honeypot
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      // Track successful submission
      trackEvent("contact_form_success");

      setFormState({
        status: "success",
        message: data.message,
      });
      form.reset();
    } catch (error) {
      // Track error
      trackEvent("contact_form_error", {
        error: error instanceof Error ? error.message : "Unknown error",
      });

      setFormState({
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <>
      {/* Hero */}
      <section className="section-padding">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-h1 font-bold text-foreground">Get in touch</h1>
            <p className="mt-4 text-body text-muted">
              Tell us about your project. We&apos;ll respond within one business day.
            </p>
          </div>
        </Container>
      </section>

      {/* Contact Form */}
      <section className="section-padding bg-card/50">
        <Container size="sm">
          {formState.status === "success" ? (
            <div className="text-center py-12">
              <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-accent/10 text-accent mb-6">
                <svg
                  className="h-8 w-8"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    d="M5 13l4 4L19 7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h2 className="text-h2 font-bold text-foreground">
                Thanks for reaching out
              </h2>
              <p className="mt-4 text-body text-muted">
                {formState.message ||
                  "We'll review your message and get back to you within one business day."}
              </p>
              <div className="mt-8 space-y-4">
                <p className="text-small text-muted">What happens next?</p>
                <ol className="text-left max-w-md mx-auto space-y-3">
                  <li className="flex items-start gap-3 text-body text-muted">
                    <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-accent/10 text-accent text-small font-medium">
                      1
                    </span>
                    <span>Our team reviews your inquiry within 24 hours</span>
                  </li>
                  <li className="flex items-start gap-3 text-body text-muted">
                    <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-accent/10 text-accent text-small font-medium">
                      2
                    </span>
                    <span>
                      A senior engineer reaches out to discuss your needs
                    </span>
                  </li>
                  <li className="flex items-start gap-3 text-body text-muted">
                    <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-accent/10 text-accent text-small font-medium">
                      3
                    </span>
                    <span>
                      We schedule a discovery call to understand your challenges
                    </span>
                  </li>
                </ol>
              </div>
              <button
                onClick={() => setFormState({ status: "idle" })}
                className="mt-8 text-small text-accent hover:underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              {formState.status === "error" && (
                <div
                  className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-body"
                  role="alert"
                >
                  {formState.message}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name" required>
                    Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Your name"
                    required
                    autoComplete="name"
                    error={!!errors.name}
                    aria-describedby={errors.name ? "name-error" : undefined}
                    onFocus={handleFormStart}
                  />
                  {errors.name && (
                    <p id="name-error" className="mt-1 text-small text-red-500">
                      {errors.name}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="email" required>
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@company.com"
                    required
                    autoComplete="email"
                    error={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                  />
                  {errors.email && (
                    <p id="email-error" className="mt-1 text-small text-red-500">
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  name="company"
                  placeholder="Your company name"
                  autoComplete="organization"
                />
              </div>

              <div>
                <Label htmlFor="message" required>
                  How can we help?
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Tell us about your project, timeline, and any specific challenges you're facing..."
                  required
                  rows={6}
                  error={!!errors.message}
                  aria-describedby={errors.message ? "message-error" : undefined}
                />
                {errors.message && (
                  <p id="message-error" className="mt-1 text-small text-red-500">
                    {errors.message}
                  </p>
                )}
              </div>

              {/* Honeypot field - hidden from users, visible to bots */}
              <div className="absolute -left-[9999px] opacity-0" aria-hidden="true">
                <label htmlFor="website">
                  Website (leave empty)
                  <input
                    type="text"
                    id="website"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </label>
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  size="lg"
                  disabled={formState.status === "submitting"}
                >
                  {formState.status === "submitting" ? (
                    <span className="flex items-center gap-2">
                      <svg
                        className="animate-spin h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    "Send message"
                  )}
                </Button>
              </div>

              <p className="text-small text-muted">
                Prefer email?{" "}
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="text-accent hover:underline"
                >
                  {siteConfig.email}
                </a>
              </p>
            </form>
          )}
        </Container>
      </section>

      {/* FAQ */}
      <section className="section-padding">
        <Container size="sm">
          <h2 className="text-h2 font-bold text-foreground text-center mb-12">
            Common questions
          </h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-h3 font-semibold text-foreground">
                What&apos;s your typical engagement look like?
              </h3>
              <p className="mt-2 text-body text-muted">
                Most engagements start with a discovery phase where we understand
                your current state and constraints. From there, we scope specific
                deliverables with clear timelines. Engagements typically range from
                focused 4-week sprints to multi-month partnerships.
              </p>
            </div>

            <div>
              <h3 className="text-h3 font-semibold text-foreground">
                Do you work with early-stage startups?
              </h3>
              <p className="mt-2 text-body text-muted">
                Yes, we work with companies at various stages. For early-stage
                companies, we often focus on setting up scalable foundations that
                won&apos;t need to be rewritten as you grow. We&apos;re upfront about what
                makes sense to build now vs. later.
              </p>
            </div>

            <div>
              <h3 className="text-h3 font-semibold text-foreground">
                What industries do you work with?
              </h3>
              <p className="mt-2 text-body text-muted">
                We&apos;ve worked across fintech, healthcare, e-commerce, and SaaS.
                The common thread is companies that need reliable, scalable backend
                systems. Industry-specific compliance requirements (HIPAA, PCI,
                SOC 2) are areas we have direct experience with.
              </p>
            </div>

            <div>
              <h3 className="text-h3 font-semibold text-foreground">
                How do you handle ongoing support?
              </h3>
              <p className="mt-2 text-body text-muted">
                Every project includes comprehensive documentation and knowledge
                transfer. For clients who want ongoing support, we offer retainer
                arrangements for continued advisory and maintenance work.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
