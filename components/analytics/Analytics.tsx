"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * Privacy-aware analytics component
 *
 * This component provides a foundation for analytics that respects user privacy.
 * It can be configured to work with various analytics providers:
 * - Plausible (privacy-focused, GDPR compliant)
 * - Fathom (privacy-focused)
 * - Google Analytics (with consent)
 * - PostHog (self-hosted option available)
 *
 * The component tracks:
 * - Page views
 * - Custom events (via trackEvent function)
 *
 * To enable analytics:
 * 1. Set NEXT_PUBLIC_ANALYTICS_ID in your environment
 * 2. Uncomment and configure your preferred provider below
 */

declare global {
  interface Window {
    plausible?: (
      event: string,
      options?: { props?: Record<string, string | number | boolean> }
    ) => void;
    gtag?: (
      command: string,
      targetId: string,
      config?: Record<string, unknown>
    ) => void;
    fathom?: {
      trackPageview: () => void;
      trackEvent: (name: string, value?: number) => void;
    };
  }
}

// Event types for type safety
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

/**
 * Track a custom event
 * Call this function from anywhere in your app to track user interactions
 */
export function trackEvent(event: AnalyticsEvent, properties?: EventProperties) {
  // Skip in development unless explicitly enabled
  if (
    process.env.NODE_ENV === "development" &&
    !process.env.NEXT_PUBLIC_ANALYTICS_DEBUG
  ) {
    console.log("[Analytics Debug]", event, properties);
    return;
  }

  // Plausible
  if (typeof window !== "undefined" && window.plausible) {
    window.plausible(event, { props: properties });
  }

  // Google Analytics
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", event, properties);
  }

  // Fathom
  if (typeof window !== "undefined" && window.fathom) {
    window.fathom.trackEvent(event);
  }
}

/**
 * Hook to track page views automatically
 */
function usePageTracking() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname) return;

    const url = searchParams?.toString()
      ? `${pathname}?${searchParams.toString()}`
      : pathname;

    // Plausible auto-tracks, but we can add custom properties
    if (typeof window !== "undefined" && window.plausible) {
      window.plausible("pageview", {
        props: { path: url },
      });
    }

    // Google Analytics
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("config", process.env.NEXT_PUBLIC_GA_ID || "", {
        page_path: url,
      });
    }

    // Fathom
    if (typeof window !== "undefined" && window.fathom) {
      window.fathom.trackPageview();
    }

    // Development logging
    if (
      process.env.NODE_ENV === "development" ||
      process.env.NEXT_PUBLIC_ANALYTICS_DEBUG
    ) {
      console.log("[Analytics Debug] Page view:", url);
    }
  }, [pathname, searchParams]);
}

/**
 * Analytics Provider Component
 * Renders the necessary scripts for your chosen analytics provider
 */
export function Analytics() {
  usePageTracking();

  const analyticsId = process.env.NEXT_PUBLIC_ANALYTICS_ID;

  // Don't render scripts if no analytics ID is configured
  if (!analyticsId) {
    return null;
  }

  // Detect which provider to use based on the ID format
  const isPlausible = analyticsId.includes(".");
  const isGoogleAnalytics = analyticsId.startsWith("G-");
  const isFathom = analyticsId.length === 8;

  return (
    <>
      {/* Plausible Analytics - Privacy-focused, GDPR compliant */}
      {isPlausible && (
        <script
          defer
          data-domain={analyticsId}
          src="https://plausible.io/js/script.js"
        />
      )}

      {/* Google Analytics - Requires consent in EU */}
      {isGoogleAnalytics && (
        <>
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${analyticsId}`}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${analyticsId}', {
                  anonymize_ip: true,
                  cookie_flags: 'SameSite=None;Secure'
                });
              `,
            }}
          />
        </>
      )}

      {/* Fathom Analytics - Privacy-focused */}
      {isFathom && (
        <script
          src="https://cdn.usefathom.com/script.js"
          data-site={analyticsId}
          defer
        />
      )}
    </>
  );
}

export default Analytics;
