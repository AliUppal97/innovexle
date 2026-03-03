"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { RegionSelector } from "@/components/ui/RegionSelector";
import { Logo } from "@/components/ui/Logo";
import { siteConfig } from "@/lib/constants";
import { cn } from "@/lib/utils";

const MOBILE_MENU_Z_BACKDROP = 9998;
const MOBILE_MENU_Z_PANEL = 9999;
const HEADER_HEIGHT = 4; // 4rem = 16 (h-16)
const SCROLL_THRESHOLD = 8; // px - Material/Apple-style: subtle threshold for premium feel
/** When scrolled: pt-4 (1rem) + h-16 (4rem) = 5rem */
const ELEVATED_MENU_TOP = 5;

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
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > SCROLL_THRESHOLD);
    };
    handleScroll(); // Set initial state
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
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
    if (!mobileMenuOpen) return;
    const id = requestAnimationFrame(() => {
      firstFocusableRef.current?.focus();
    });
    return () => cancelAnimationFrame(id);
  }, [mobileMenuOpen]);

  const isActive = (href: string) => {
    const cleanPath = pathname.replace(/^\/(en|es|de|fr|ar|ur)/, "") || "/";
    return cleanPath === href || cleanPath.startsWith(href + "/");
  };

  const showElevatedNav = isScrolled;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full">
      {/* Floating wrapper: transparent at top, elevated card on scroll, margins on all sides */}
      <div
        className={cn(
          "transition-all duration-300 ease-out motion-reduce:transition-none",
          showElevatedNav
            ? "pt-4 pb-4 px-4 sm:px-5 lg:px-8 sm:pt-5 sm:pb-5"
            : ""
        )}
      >
        <div
          className={cn(
            "mx-auto w-full transition-all duration-300 ease-out motion-reduce:transition-none",
            "min-w-0 max-w-7xl",
            showElevatedNav
              ? "border border-border bg-background/80 shadow-nav-floating dark:shadow-nav-floating-dark backdrop-blur-xl supports-[backdrop-filter]:bg-background/75 dark:supports-[backdrop-filter]:bg-background/80"
              : "rounded-none border-0 border-transparent bg-transparent shadow-none",
            showElevatedNav && mobileMenuOpen
              ? "rounded-t-2xl rounded-b-none"
              : showElevatedNav
                ? "rounded-2xl"
                : ""
          )}
        >
          <nav
            className="flex h-16 items-center justify-between gap-2 sm:gap-4 min-w-0 px-4 sm:px-6 lg:px-8"
            aria-label={tA11y("mainNav")}
          >
          <Link
            href="/"
            className="flex min-w-0 shrink items-center gap-2 font-semibold text-foreground"
            aria-label={`${siteConfig.name} home`}
          >
            <Logo variant="horizontal" className="h-10 w-auto max-w-[160px] sm:h-11 sm:max-w-[176px] lg:h-12 lg:max-w-[192px]" />
          </Link>

          <div className="hidden lg:flex lg:items-center lg:gap-4 xl:gap-6 lg:min-w-0 lg:flex-1 lg:justify-end">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className={cn(
                  "shrink-0 text-small font-medium transition-colors duration-200 hover:text-foreground whitespace-nowrap",
                  isActive(item.href) ? "text-foreground" : "text-muted"
                )}
              >
                {t(item.key)}
              </Link>
            ))}
            <div className="flex shrink-0 items-center gap-2 pl-2 border-l border-border">
              <LanguageSwitcher />
              <RegionSelector />
              <ThemeToggle />
            </div>
            <Button asChild size="sm" className="shrink-0">
              <Link href="/contact">{t("talkToEngineer")}</Link>
            </Button>
          </div>

          <button
            ref={menuButtonRef}
            type="button"
            className="lg:hidden shrink-0 inline-flex items-center justify-center rounded-lg min-w-[44px] min-h-[44px] p-2 text-foreground hover:bg-muted/10 active:bg-muted/20 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={mobileMenuOpen ? t("closeMenu") : t("openMenu")}
          >
            <span className="sr-only">{mobileMenuOpen ? t("closeMenu") : t("openMenu")}</span>
            {mobileMenuOpen ? (
              <XMarkIcon className="h-6 w-6" aria-hidden />
            ) : (
              <Bars3Icon className="h-6 w-6" aria-hidden />
            )}
          </button>
          </nav>

          {typeof document !== "undefined" &&
            mobileMenuOpen &&
            createPortal(
              <>
                <div
                  className="fixed inset-0 lg:hidden bg-black/50 backdrop-blur-sm"
                  style={{
                    top: `${isScrolled ? ELEVATED_MENU_TOP : HEADER_HEIGHT}rem`,
                    zIndex: MOBILE_MENU_Z_BACKDROP,
                  }}
                  aria-hidden="true"
                  onClick={() => setMobileMenuOpen(false)}
                />
                <div
                  ref={menuRef}
                  id="mobile-menu"
                  role="dialog"
                  aria-modal="true"
                  aria-label={tA11y("mobileNav")}
                  className={cn(
                    "fixed lg:hidden overflow-y-auto scrollbar-thin",
                    "bg-background text-foreground",
                    "animate-[slideUp_0.2s_ease-out]",
                    isScrolled
                      ? "left-4 right-4 sm:left-5 sm:right-5 lg:left-8 lg:right-8 mx-auto max-w-7xl rounded-b-2xl border border-t-0 border-border shadow-lg"
                      : "inset-x-0 left-0 right-0 w-full min-h-0 border-t border-border"
                  )}
                  style={{
                    top: `${isScrolled ? ELEVATED_MENU_TOP : HEADER_HEIGHT}rem`,
                    zIndex: MOBILE_MENU_Z_PANEL,
                    height: isScrolled ? undefined : "auto",
                    maxHeight: `calc(100dvh - ${isScrolled ? ELEVATED_MENU_TOP : HEADER_HEIGHT}rem)`,
                    paddingBottom: "env(safe-area-inset-bottom, 0px)",
                  }}
                >
                  <div className="py-6">
                    <Container size="default">
                      <div className="flex flex-col gap-1">
                        {navItems.map((item, index) => (
                          <Link
                            key={item.key}
                            ref={index === 0 ? firstFocusableRef : undefined}
                            href={item.href}
                            className={cn(
                              "text-body font-medium min-h-[2.75rem] flex items-center px-3 py-2.5 rounded-lg",
                              "transition-colors duration-150 ease-out hover:bg-muted/10 hover:text-foreground active:bg-muted/15",
                              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                              isActive(item.href)
                                ? "text-foreground font-semibold"
                                : "text-muted-foreground"
                            )}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {t(item.key)}
                          </Link>
                        ))}
                      </div>
                      <div className="mt-6 pt-6 border-t border-border flex flex-wrap items-center gap-3 gap-y-4 min-w-0">
                        <LanguageSwitcher inMobileMenu />
                        <RegionSelector inMobileMenu />
                        <ThemeToggle />
                      </div>
                      <div className="mt-6">
                        <Button asChild className="w-full" size="lg">
                          <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
                            {t("talkToEngineer")}
                          </Link>
                        </Button>
                      </div>
                    </Container>
                  </div>
                </div>
              </>,
              document.body
            )}
        </div>
      </div>
    </header>
  );
}
