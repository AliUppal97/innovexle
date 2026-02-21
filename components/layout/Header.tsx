"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { RegionSelector } from "@/components/ui/RegionSelector";
import { Logo } from "@/components/ui/Logo";
import { siteConfig } from "@/lib/constants";
import { cn } from "@/lib/utils";

const navItems = [
  { key: "services", href: "/services" },
  { key: "caseStudies", href: "/case-studies" },
  { key: "careers", href: "/careers" },
  { key: "about", href: "/about" },
  { key: "contact", href: "/contact" },
] as const;

export function Header() {
  const t = useTranslations("nav");
  const tA11y = useTranslations("a11y");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const firstFocusableRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleEscapeKey = useCallback((event: KeyboardEvent) => {
    if (event.key === "Escape" && mobileMenuOpen) {
      setMobileMenuOpen(false);
      menuButtonRef.current?.focus();
    }
  }, [mobileMenuOpen]);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      mobileMenuOpen &&
      menuRef.current &&
      !menuRef.current.contains(event.target as Node) &&
      !menuButtonRef.current?.contains(event.target as Node)
    ) {
      setMobileMenuOpen(false);
    }
  }, [mobileMenuOpen]);

  const handleTabKey = useCallback((event: KeyboardEvent) => {
    if (!mobileMenuOpen || event.key !== "Tab") return;

    const focusableElements = menuRef.current?.querySelectorAll(
      'a[href], button:not([disabled]), textarea, input, select'
    );
    
    if (!focusableElements || focusableElements.length === 0) return;

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    if (event.shiftKey) {
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  useEffect(() => {
    document.addEventListener("keydown", handleEscapeKey);
    document.addEventListener("keydown", handleTabKey);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
      document.removeEventListener("keydown", handleTabKey);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleEscapeKey, handleTabKey, handleClickOutside]);

  useEffect(() => {
    if (mobileMenuOpen && firstFocusableRef.current) {
      firstFocusableRef.current.focus();
    }
  }, [mobileMenuOpen]);

  const isActive = (href: string) => {
    const cleanPath = pathname.replace(/^\/(en|es|de|fr|ar)/, "") || "/";
    return cleanPath === href || cleanPath.startsWith(href + "/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Container>
        <nav className="flex h-16 items-center justify-between" aria-label={tA11y("mainNav")}>
          <Link
            href="/"
            className="flex items-center font-semibold text-foreground"
            aria-label={`${siteConfig.name} home`}
          >
            <Logo />
          </Link>

          <div className="hidden md:flex md:items-center md:gap-6">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className={cn(
                  "text-small font-medium transition-colors duration-200 hover:text-foreground",
                  isActive(item.href) ? "text-foreground" : "text-muted"
                )}
              >
                {t(item.key)}
              </Link>
            ))}
            <div className="flex items-center gap-2 pl-2 border-l border-border">
              <LanguageSwitcher />
              <RegionSelector />
              <ThemeToggle />
            </div>
            <Button asChild size="sm">
              <Link href="/contact">{t("talkToEngineer")}</Link>
            </Button>
          </div>

          <button
            ref={menuButtonRef}
            type="button"
            className="md:hidden inline-flex items-center justify-center rounded-lg p-2 text-foreground hover:bg-muted/10 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={mobileMenuOpen ? t("closeMenu") : t("openMenu")}
          >
            <span className="sr-only">{mobileMenuOpen ? t("closeMenu") : t("openMenu")}</span>
            {mobileMenuOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>
        </nav>

        {mobileMenuOpen && (
          <>
            <div className="fixed inset-0 top-16 bg-background/80 backdrop-blur-sm md:hidden z-40" aria-hidden="true" />
            <div
              ref={menuRef}
              id="mobile-menu"
              className="fixed inset-x-0 top-16 bottom-0 md:hidden border-t border-border bg-background z-50 overflow-y-auto"
              role="dialog"
              aria-modal="true"
              aria-label={tA11y("mobileNav")}
            >
              <Container>
                <div className="flex flex-col py-6">
                  {navItems.map((item, index) => (
                    <Link
                      key={item.key}
                      ref={index === 0 ? firstFocusableRef : undefined}
                      href={item.href}
                      className={cn(
                        "text-body font-medium transition-colors duration-200 hover:text-foreground py-4 border-b border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset",
                        isActive(item.href) ? "text-foreground" : "text-muted"
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {t(item.key)}
                    </Link>
                  ))}
                  <div className="mt-6 flex items-center gap-3">
                    <LanguageSwitcher />
                    <RegionSelector />
                  </div>
                  <div className="mt-4">
                    <Button asChild className="w-full" size="lg">
                      <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
                        {t("talkToEngineer")}
                      </Link>
                    </Button>
                  </div>
                </div>
              </Container>
            </div>
          </>
        )}
      </Container>
    </header>
  );
}
