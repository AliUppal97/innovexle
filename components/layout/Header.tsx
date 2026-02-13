"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { navigation, siteConfig } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const firstFocusableRef = useRef<HTMLAnchorElement>(null);
  const lastFocusableRef = useRef<HTMLAnchorElement>(null);

  // Close menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Handle escape key
  const handleEscapeKey = useCallback((event: KeyboardEvent) => {
    if (event.key === "Escape" && mobileMenuOpen) {
      setMobileMenuOpen(false);
      menuButtonRef.current?.focus();
    }
  }, [mobileMenuOpen]);

  // Handle click outside
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

  // Focus trap
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

  // Lock body scroll when menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Add event listeners
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

  // Focus first menu item when menu opens
  useEffect(() => {
    if (mobileMenuOpen && firstFocusableRef.current) {
      firstFocusableRef.current.focus();
    }
  }, [mobileMenuOpen]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Container>
        <nav className="flex h-16 items-center justify-between" aria-label="Main navigation">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2 font-semibold text-foreground"
            aria-label={`${siteConfig.name} home`}
          >
            <svg
              className="h-8 w-8"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <rect width="32" height="32" rx="8" fill="currentColor" />
              <path
                d="M8 12L16 8L24 12V20L16 24L8 20V12Z"
                stroke="hsl(var(--background))"
                strokeWidth="2"
                fill="none"
              />
              <path
                d="M16 8V24M8 12L24 20M24 12L8 20"
                stroke="hsl(var(--background))"
                strokeWidth="2"
              />
            </svg>
            <span className="text-lg">{siteConfig.name}</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-foreground",
                  pathname === item.href ? "text-foreground" : "text-muted"
                )}
              >
                {item.name}
              </Link>
            ))}
            <Button asChild size="sm">
              <Link href="/contact">Talk to an engineer</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            ref={menuButtonRef}
            type="button"
            className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-foreground hover:bg-muted/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            <span className="sr-only">{mobileMenuOpen ? "Close menu" : "Open menu"}</span>
            {mobileMenuOpen ? (
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            )}
          </button>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 top-16 bg-background/80 backdrop-blur-sm md:hidden z-40"
              aria-hidden="true"
            />

            {/* Menu Panel */}
            <div
              ref={menuRef}
              id="mobile-menu"
              className="fixed inset-x-0 top-16 bottom-0 md:hidden border-t border-border bg-background z-50 overflow-y-auto"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
            >
              <Container>
                <div className="flex flex-col py-6">
                  {navigation.map((item, index) => (
                    <Link
                      key={item.name}
                      ref={index === 0 ? firstFocusableRef : undefined}
                      href={item.href}
                      className={cn(
                        "text-lg font-medium transition-colors hover:text-foreground py-4 border-b border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset",
                        pathname === item.href ? "text-foreground" : "text-muted"
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                  <div className="mt-6">
                    <Button asChild className="w-full" size="lg">
                      <Link
                        ref={lastFocusableRef}
                        href="/contact"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Talk to an engineer
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
