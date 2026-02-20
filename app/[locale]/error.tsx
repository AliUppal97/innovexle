"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { reportError } from "@/lib/monitoring";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("errors");

  useEffect(() => {
    reportError(error, { page: window.location.pathname });
  }, [error]);

  return (
    <section className="section-padding min-h-[60vh] flex items-center">
      <Container>
        <div className="mx-auto max-w-lg text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
            <svg
              className="h-8 w-8 text-red-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4M12 16h.01" strokeLinecap="round" />
            </svg>
          </div>
          <h1 className="text-h1 font-bold text-foreground">
            {t("somethingWentWrong")}
          </h1>
          <p className="mt-4 text-body text-muted">
            {t("unexpectedError")}
          </p>
          {error.digest && (
            <p className="mt-2 text-small text-muted">
              Error ID: {error.digest}
            </p>
          )}
          <div className="mt-8 flex items-center justify-center gap-4">
            <Button onClick={reset}>{t("tryAgain")}</Button>
            <Button variant="secondary" asChild>
              <a href="/">{t("backToHome")}</a>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
