"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const CONSENT_KEY = "innovexle-cookie-consent";

export type ConsentStatus = "pending" | "accepted" | "declined";

export function getConsentStatus(): ConsentStatus {
  if (typeof window === "undefined") return "pending";
  return (localStorage.getItem(CONSENT_KEY) as ConsentStatus) || "pending";
}

export function CookieConsent() {
  const t = useTranslations("consent");
  const tA11y = useTranslations("a11y");
  const [status, setStatus] = useState<ConsentStatus>("pending");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = getConsentStatus();
    setStatus(stored);
    if (stored === "pending") {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(CONSENT_KEY, "accepted");
    setStatus("accepted");
    setVisible(false);
    window.dispatchEvent(new CustomEvent("consent-change", { detail: "accepted" }));
  };

  const handleDecline = () => {
    localStorage.setItem(CONSENT_KEY, "declined");
    setStatus("declined");
    setVisible(false);
    window.dispatchEvent(new CustomEvent("consent-change", { detail: "declined" }));
  };

  if (status !== "pending" || !visible) return null;

  return (
    <div
      role="dialog"
      aria-label={tA11y("cookieConsent")}
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 p-4 transition-transform duration-500",
        visible ? "translate-y-0" : "translate-y-full"
      )}
    >
      <div className="mx-auto max-w-4xl rounded-xl border border-border bg-card p-6 shadow-2xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-small text-muted flex-1">
            {t("message")}{" "}
            <Link href="/privacy" className="text-accent underline underline-offset-2">
              {t("learnMore")}
            </Link>
          </p>
          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={handleDecline}
              className="rounded-lg border border-border px-4 py-2 text-small font-medium text-muted hover:text-foreground hover:border-foreground/30 transition-colors"
            >
              {t("decline")}
            </button>
            <button
              onClick={handleAccept}
              className="rounded-lg bg-accent px-4 py-2 text-small font-medium text-accent-foreground hover:bg-accent/90 transition-colors"
            >
              {t("accept")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
