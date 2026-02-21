"use client";

import { useState, type FormEvent, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { Input, Textarea, Label } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/lib/constants";
import { trackEvent } from "@/components/analytics";
import { Accordion, AccordionItem } from "@/components/ui/Accordion";

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
  const t = useTranslations("contact");
  const tErrors = useTranslations("errors");
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
      errors.name = t("nameError");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      errors.email = t("emailError");
    }

    if (!message || message.trim().length < 10) {
      errors.message = t("messageError");
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
        error: error instanceof Error ? error.message : tErrors("submitError"),
      });

      setFormState({
        status: "error",
        message:
          error instanceof Error ? error.message : tErrors("submitError"),
      });
    }
  };

  return (
    <>
      {/* Hero */}
      <section className="section-padding">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-h1 font-bold text-foreground">{t("title")}</h1>
            <p className="mt-4 text-body text-muted">{t("subtitle")}</p>
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
                {t("thankYou")}
              </h2>
              <p className="mt-4 text-body text-muted">
                {formState.message || t("thankYouMessage")}
              </p>
              <div className="mt-8 space-y-4">
                <p className="text-small text-muted">{t("whatHappensNext")}</p>
                <ol className="text-left max-w-md mx-auto space-y-3">
                  <li className="flex items-start gap-3 text-body text-muted">
                    <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-accent/10 text-accent text-small font-medium">
                      1
                    </span>
                    <span>{t("step1")}</span>
                  </li>
                  <li className="flex items-start gap-3 text-body text-muted">
                    <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-accent/10 text-accent text-small font-medium">
                      2
                    </span>
                    <span>{t("step2")}</span>
                  </li>
                  <li className="flex items-start gap-3 text-body text-muted">
                    <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-accent/10 text-accent text-small font-medium">
                      3
                    </span>
                    <span>{t("step3")}</span>
                  </li>
                </ol>
              </div>
              <button
                onClick={() => setFormState({ status: "idle" })}
                className="mt-8 text-small text-accent hover:underline"
              >
                {t("sendAnother")}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              {formState.status === "error" && (
                <div
                  className="p-4 rounded-lg bg-destructive-muted border border-destructive-border text-destructive text-body"
                  role="alert"
                >
                  {formState.message}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name" required>
                    {t("name")}
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder={t("namePlaceholder")}
                    required
                    autoComplete="name"
                    error={!!errors.name}
                    aria-describedby={errors.name ? "name-error" : undefined}
                    onFocus={handleFormStart}
                  />
                  {errors.name && (
                    <p id="name-error" className="mt-1 text-small text-destructive">
                      {errors.name}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="email" required>
                    {t("email")}
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder={t("emailPlaceholder")}
                    required
                    autoComplete="email"
                    error={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                  />
                  {errors.email && (
                    <p id="email-error" className="mt-1 text-small text-destructive">
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="company">{t("company")}</Label>
                <Input
                  id="company"
                  name="company"
                  placeholder={t("companyPlaceholder")}
                  autoComplete="organization"
                />
              </div>

              <div>
                <Label htmlFor="message" required>
                  {t("message")}
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder={t("messagePlaceholder")}
                  required
                  rows={6}
                  error={!!errors.message}
                  aria-describedby={errors.message ? "message-error" : undefined}
                />
                {errors.message && (
                  <p id="message-error" className="mt-1 text-small text-destructive">
                    {errors.message}
                  </p>
                )}
              </div>

              {/* Honeypot field - hidden from users, visible to bots */}
              <div className="absolute -left-[9999px] opacity-0" aria-hidden="true">
                <label htmlFor="website">
                  {t("honeypotLabel")}
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
                      {t("sending")}
                    </span>
                  ) : (
                    t("send")
                  )}
                </Button>
              </div>

              <p className="text-small text-muted">
                {t("preferEmail")}{" "}
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="text-accent hover:underline"
                >
                  {siteConfig.email}
                </a>
                {" · "}
                <a
                  href={siteConfig.phoneHref}
                  className="text-accent hover:underline"
                >
                  {siteConfig.phone}
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
            {t("commonQuestions")}
          </h2>

          <Accordion>
            <AccordionItem title={t("faq1Title")} defaultOpen>
              {t("faq1Content")}
            </AccordionItem>
            <AccordionItem title={t("faq2Title")}>
              {t("faq2Content")}
            </AccordionItem>
            <AccordionItem title={t("faq3Title")}>
              {t("faq3Content")}
            </AccordionItem>
            <AccordionItem title={t("faq4Title")}>
              {t("faq4Content")}
            </AccordionItem>
          </Accordion>
        </Container>
      </section>
    </>
  );
}
