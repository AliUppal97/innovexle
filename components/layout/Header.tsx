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
const SCROLL_THRESHOLD = 12; // px — transition when user scrolls past this

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
    const cleanPath = pathname.replace(/^\/(en|es|de|fr|ar)/, "") || "/";
    return cleanPath === href || cleanPath.startsWith(href + "/");
  };

  const showElevatedNav = isScrolled || mobileMenuOpen;

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300 ease-out",
        showElevatedNav
          ? "border-b border-border bg-background/95 shadow-sm shadow-black/5 backdrop-blur supports-[backdrop-filter]:bg-background/80 dark:shadow-black/20"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <Container className="min-w-0">
        <nav className="flex h-16 items-center justify-between gap-2 sm:gap-4 min-w-0" aria-label={tA11y("mainNav")}>
          <Link
            href="/"
            className="flex min-w-0 shrink items-center gap-2 font-semibold text-foreground overflow-hidden"
            aria-label={`${siteConfig.name} home`}
          >
            <Logo />
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
                  top: `${HEADER_HEIGHT}rem`,
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
                  "fixed inset-x-0 bottom-0 lg:hidden overflow-y-auto scrollbar-thin",
                  "bg-background text-foreground border-t border-border",
                  "animate-[slideUp_0.2s_ease-out]"
                )}
                style={{
                  top: `${HEADER_HEIGHT}rem`,
                  zIndex: MOBILE_MENU_Z_PANEL,
                  maxHeight: `calc(100dvh - ${HEADER_HEIGHT}rem)`,
                  paddingBottom: "env(safe-area-inset-bottom, 0px)",
                }}
              >
                <Container className="py-6">
                  <div className="flex flex-col">
                    {navItems.map((item, index) => (
                      <Link
                        key={item.key}
                        ref={index === 0 ? firstFocusableRef : undefined}
                        href={item.href}
                        className={cn(
                          "py-4 text-body font-medium border-b border-border last:border-b-0",
                          "transition-colors duration-200 hover:bg-muted/20 hover:text-foreground",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                          isActive(item.href) ? "text-foreground" : "text-muted-foreground"
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
            </>,
            document.body
          )}
      </Container>
    </header>
  );
}
