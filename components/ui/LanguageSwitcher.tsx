"use client";

import { useState, useRef, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import { GlobeAltIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { locales, localeNames, type Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";

const DROPDOWN_MAX_HEIGHT = 280;
const VIEWPORT_PADDING = 16;
const DROPDOWN_GAP = 8;

/** Shared with RegionSelector — industry-standard dropdown design */
const TRIGGER_CLASSES =
  "flex h-9 min-w-[5rem] shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-[0.875rem] font-medium leading-tight text-muted hover:bg-muted/10 hover:text-foreground transition-colors duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background active:bg-muted/15";
const DROPDOWN_BASE_CLASSES =
  "absolute w-[200px] min-w-[200px] max-w-[min(220px,100vw-2rem)] rounded-xl border border-border bg-card py-1.5 shadow-lg ring-1 ring-black/5 z-[100] overflow-y-auto scrollbar-thin";
const OPTION_BASE_CLASSES =
  "flex min-h-[2.75rem] w-full items-center gap-3 px-4 py-2.5 text-[0.875rem] leading-snug transition-colors duration-150 ease-out text-left rounded-lg mx-1";
const OPTION_SELECTED_CLASSES =
  "bg-accent/10 text-accent font-semibold hover:bg-accent/15";
const OPTION_DEFAULT_CLASSES =
  "text-muted-foreground hover:bg-muted/10 hover:text-foreground active:bg-muted/15";

interface LanguageSwitcherProps {
  inMobileMenu?: boolean;
}

export function LanguageSwitcher({ inMobileMenu = false }: LanguageSwitcherProps) {
  const locale = useLocale() as Locale;
  const t = useTranslations("a11y");
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<{
    openAbove: boolean;
    maxHeight: number;
    alignRight: boolean;
  }>({
    openAbove: false,
    maxHeight: DROPDOWN_MAX_HEIGHT,
    alignRight: true,
  });
  const ref = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (!open) return;
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  useEffect(() => {
    if (!open || !buttonRef.current || typeof window === "undefined") return;

    const updatePosition = () => {
      const rect = buttonRef.current!.getBoundingClientRect();
      const spaceAbove = rect.top - VIEWPORT_PADDING;
      const spaceBelow = window.innerHeight - rect.bottom - VIEWPORT_PADDING;
      const DROPDOWN_WIDTH = 200;

      let openAbove: boolean;
      let maxHeight: number;
      let alignRight: boolean;

      if (inMobileMenu) {
        openAbove = true;
        maxHeight = Math.min(DROPDOWN_MAX_HEIGHT, Math.max(spaceAbove - DROPDOWN_GAP, 0));
        alignRight = false;
      } else {
        openAbove = spaceAbove > spaceBelow;
        const availableSpace = openAbove ? spaceAbove - DROPDOWN_GAP : spaceBelow - DROPDOWN_GAP;
        maxHeight = Math.min(DROPDOWN_MAX_HEIGHT, Math.max(availableSpace, 0));
        const dropdownLeftIfRightAligned = rect.right - DROPDOWN_WIDTH;
        alignRight = dropdownLeftIfRightAligned >= VIEWPORT_PADDING;
      }

      setPosition({ openAbove, maxHeight, alignRight });
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open, inMobileMenu]);

  const handleChange = (newLocale: Locale) => {
    router.replace(pathname, { locale: newLocale });
    setOpen(false);
  };

  const dropdownPlacement = position.openAbove ? "bottom-full mb-2" : "top-full mt-2";
  const dropdownAlignment =
    inMobileMenu || !position.alignRight ? "left-0 right-auto" : "right-0 left-auto";

  return (
    <div ref={ref} className="relative">
      <button
        ref={buttonRef}
        onClick={() => setOpen(!open)}
        className={TRIGGER_CLASSES}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={t("selectLanguage")}
      >
        <GlobeAltIcon className="h-4 w-4 shrink-0" aria-hidden />
        <span className="uppercase">{locale}</span>
        <ChevronDownIcon className={cn("h-3.5 w-3.5 shrink-0 transition-transform duration-200", open && "rotate-180")} aria-hidden />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label={t("selectLanguage")}
          className={cn(DROPDOWN_BASE_CLASSES, dropdownPlacement, dropdownAlignment)}
          style={{ maxHeight: position.maxHeight }}
        >
          {locales.map((l) => (
            <button
              key={l}
              role="option"
              aria-selected={l === locale}
              onClick={() => handleChange(l)}
              className={cn(
                OPTION_BASE_CLASSES,
                l === locale ? OPTION_SELECTED_CLASSES : OPTION_DEFAULT_CLASSES
              )}
            >
              <span className="w-6 uppercase font-medium">{l}</span>
              <span>{localeNames[l]}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
