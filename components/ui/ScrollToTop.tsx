"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";

const SCROLL_THRESHOLD_PX = 400;

function usePrefersReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReduced(mql.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  return prefersReduced;
}

export function ScrollToTop() {
  const t = useTranslations("a11y");
  const [visible, setVisible] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  const handleScroll = useCallback(() => {
    setVisible(window.scrollY > SCROLL_THRESHOLD_PX);
  }, []);

  useEffect(() => {
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={scrollToTop}
          aria-label={t("scrollToTop")}
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{
            duration: prefersReducedMotion ? 0.01 : 0.2,
            ease: "easeOut",
          }}
          className="fixed z-[48] flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-lg shadow-black/10 transition-colors hover:bg-muted/10 hover:border-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 dark:shadow-black/30 bottom-[max(1.25rem,env(safe-area-inset-bottom,0px))] end-[max(1.25rem,env(safe-area-inset-inline-end,0px))] sm:bottom-6 sm:end-6 sm:h-11 sm:w-11"
        >
          <svg
            className="h-5 w-5 sm:h-[18px] sm:w-[18px]"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
