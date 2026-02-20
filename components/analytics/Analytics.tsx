"use client";

import { useEffect, useState, useCallback } from "react";
import { usePathname, useSearchParams } from "next/navigation";

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Record<string, string | number | boolean> }) => void;
    gtag?: (command: string, targetId: string, config?: Record<string, unknown>) => void;
    fathom?: { trackPageview: () => void; trackEvent: (name: string, value?: number) => void };
  }
}

export type AnalyticsEvent =
  | "contact_form_start"
  | "contact_form_submit"
  | "contact_form_success"
  | "contact_form_error"
  | "cta_click"
  | "service_view"
  | "case_study_view"
  | "external_link_click"
  | "scroll_depth";

interface EventProperties {
  [key: string]: string | number | boolean;
}

function hasConsent(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("innovexle-cookie-consent") === "accepted";
}

export function trackEvent(event: AnalyticsEvent, properties?: EventProperties) {
  if (process.env.NODE_ENV === "development" && !process.env.NEXT_PUBLIC_ANALYTICS_DEBUG) {
    console.log("[Analytics Debug]", event, properties);
    return;
  }

  if (!hasConsent()) return;

  if (typeof window !== "undefined" && window.plausible) {
    window.plausible(event, { props: properties });
  }
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", event, properties);
  }
  if (typeof window !== "undefined" && window.fathom) {
    window.fathom.trackEvent(event);
  }
}

function usePageTracking() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname || !hasConsent()) return;

    const url = searchParams?.toString() ? `${pathname}?${searchParams.toString()}` : pathname;

    if (typeof window !== "undefined" && window.plausible) {
      window.plausible("pageview", { props: { path: url } });
    }
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("config", process.env.NEXT_PUBLIC_GA_ID || "", { page_path: url });
    }
    if (typeof window !== "undefined" && window.fathom) {
      window.fathom.trackPageview();
    }
    if (process.env.NODE_ENV === "development" || process.env.NEXT_PUBLIC_ANALYTICS_DEBUG) {
      console.log("[Analytics Debug] Page view:", url);
    }
  }, [pathname, searchParams]);
}

export function Analytics() {
  usePageTracking();

  const [consent, setConsent] = useState(false);

  const handleConsentChange = useCallback(() => {
    setConsent(hasConsent());
  }, []);

  useEffect(() => {
    setConsent(hasConsent());
    window.addEventListener("consent-change", handleConsentChange);
    return () => window.removeEventListener("consent-change", handleConsentChange);
  }, [handleConsentChange]);

  const analyticsId = process.env.NEXT_PUBLIC_ANALYTICS_ID;

  if (!analyticsId || !consent) return null;

  const isPlausible = analyticsId.includes(".");
  const isGoogleAnalytics = analyticsId.startsWith("G-");
  const isFathom = analyticsId.length === 8;

  return (
    <>
      {isPlausible && (
        <script defer data-domain={analyticsId} src="https://plausible.io/js/script.js" />
      )}
      {isGoogleAnalytics && (
        <>
          <script async src={`https://www.googletagmanager.com/gtag/js?id=${analyticsId}`} />
          <script
            dangerouslySetInnerHTML={{
              __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${analyticsId}',{anonymize_ip:true,cookie_flags:'SameSite=None;Secure'});`,
            }}
          />
        </>
      )}
      {isFathom && <script src="https://cdn.usefathom.com/script.js" data-site={analyticsId} defer />}
    </>
  );
}

export default Analytics;
