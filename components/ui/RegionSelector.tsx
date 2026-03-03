"use client";

import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { BanknotesIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { regions, getDefaultRegion, getRegionById, type Region } from "@/lib/regions";
import { cn } from "@/lib/utils";

const REGION_KEY = "innovexle-region";
const DROPDOWN_MAX_HEIGHT = 280;
const VIEWPORT_PADDING = 16;
const DROPDOWN_GAP = 8;

/**
 * Region dropdown design - industry standards:
 * - Trigger: 36px min height (WCAG 2.5.5 touch target), 14px font
 * - Options: 44px min height (48dp Material / 44px Apple HIG), 14px font
 * - Hover: 150ms ease-out, subtle bg change
 * - Width: 224px (14rem) - accommodates labels like "United Kingdom (GBP)" / "Vereinigtes Königreich (GBP)"
 */
const DROPDOWN_WIDTH = 224;
const TRIGGER_CLASSES =
  "flex h-9 min-w-[6.5rem] shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-[0.875rem] font-medium leading-tight text-muted hover:bg-muted/10 hover:text-foreground transition-colors duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background active:bg-muted/15";
const DROPDOWN_BASE_CLASSES =
  "absolute rounded-xl border border-border bg-card px-1.5 py-1.5 shadow-lg ring-1 ring-black/5 z-[100] overflow-x-hidden overflow-y-auto scrollbar-thin";
const OPTION_BASE_CLASSES =
  "flex min-h-[2.75rem] w-full items-center gap-3 px-3 py-2.5 text-[0.875rem] leading-snug transition-colors duration-150 ease-out text-left rounded-lg";
const OPTION_SELECTED_CLASSES =
  "bg-accent/10 text-accent font-semibold hover:bg-accent/15";
const OPTION_DEFAULT_CLASSES =
  "text-muted-foreground hover:bg-muted/10 hover:text-foreground active:bg-muted/15";

interface RegionContextValue {
  region: Region;
  setRegion: (region: Region) => void;
}

const RegionContext = createContext<RegionContextValue>({
  region: getDefaultRegion(),
  setRegion: () => {},
});

export function useRegion() {
  return useContext(RegionContext);
}

export function RegionProvider({ children }: { children: ReactNode }) {
  const [region, setRegionState] = useState<Region>(getDefaultRegion());

  useEffect(() => {
    const stored = localStorage.getItem(REGION_KEY);
    if (stored) {
      const found = getRegionById(stored);
      if (found) setRegionState(found);
    }
  }, []);

  const setRegion = (r: Region) => {
    setRegionState(r);
    localStorage.setItem(REGION_KEY, r.id);
  };

  return (
    <RegionContext.Provider value={{ region, setRegion }}>
      {children}
    </RegionContext.Provider>
  );
}

interface RegionSelectorProps {
  className?: string;
  inMobileMenu?: boolean;
}

export function RegionSelector({ className, inMobileMenu = false }: RegionSelectorProps) {
  const t = useTranslations("region");
  const { region, setRegion } = useRegion();
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

      let openAbove: boolean;
      let maxHeight: number;
      let alignRight: boolean;

      if (inMobileMenu) {
        openAbove = true;
        maxHeight = Math.min(DROPDOWN_MAX_HEIGHT, Math.max(spaceAbove - DROPDOWN_GAP, 0));
        const spaceRight = window.innerWidth - VIEWPORT_PADDING - rect.right;
        const spaceLeft = rect.left - VIEWPORT_PADDING;
        const leftAlignFits = window.innerWidth - VIEWPORT_PADDING - rect.left >= DROPDOWN_WIDTH;
        const rightAlignFits = rect.right - VIEWPORT_PADDING >= DROPDOWN_WIDTH;
        alignRight =
          rightAlignFits && !leftAlignFits
            ? true
            : !rightAlignFits && leftAlignFits
              ? false
              : spaceRight >= spaceLeft
                ? false
                : true;
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

  const handleChange = (r: Region) => {
    setRegion(r);
    setOpen(false);
  };

  const dropdownPlacement = position.openAbove ? "bottom-full mb-2" : "top-full mt-2";
  const dropdownAlignment = position.alignRight ? "right-0 left-auto" : "left-0 right-auto";

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        ref={buttonRef}
        onClick={() => setOpen(!open)}
        className={TRIGGER_CLASSES}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={t("label")}
        title={t(region.id as "global" | "europe" | "uk" | "india" | "canada" | "pakistan")}
      >
        <BanknotesIcon className="h-4 w-4 shrink-0" aria-hidden />
        <span className="shrink-0 font-medium tabular-nums">{region.currencySymbol}</span>
        <span className="min-w-0 truncate max-w-[4.5rem]">{region.currency}</span>
        <ChevronDownIcon className={cn("h-3.5 w-3.5 shrink-0 transition-transform duration-200", open && "rotate-180")} aria-hidden />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label={t("label")}
          className={cn(DROPDOWN_BASE_CLASSES, dropdownPlacement, dropdownAlignment)}
          style={{
            maxHeight: position.maxHeight,
            width: DROPDOWN_WIDTH,
            minWidth: DROPDOWN_WIDTH,
            maxWidth: `min(${DROPDOWN_WIDTH}px, calc(100vw - ${VIEWPORT_PADDING * 2}px))`,
          }}
        >
          {regions.map((r) => {
            const label = t(r.id as "global" | "europe" | "uk" | "india" | "canada" | "pakistan");
            return (
              <button
                key={r.id}
                role="option"
                aria-selected={r.id === region.id}
                title={label}
                onClick={() => handleChange(r)}
                className={cn(
                  OPTION_BASE_CLASSES,
                  r.id === region.id ? OPTION_SELECTED_CLASSES : OPTION_DEFAULT_CLASSES
                )}
              >
                <span className="w-6 shrink-0 text-center font-semibold tabular-nums">
                  {r.currencySymbol}
                </span>
                <span className="min-w-0 truncate">
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function RegionalSalary({
  minUSD,
  maxUSD,
  className,
}: {
  minUSD: number;
  maxUSD: number;
  className?: string;
}) {
  const { region } = useRegion();
  const min = Math.round(minUSD * region.exchangeRate);
  const max = Math.round(maxUSD * region.exchangeRate);

  const formatter = new Intl.NumberFormat(region.locale, {
    style: "currency",
    currency: region.currency,
    maximumFractionDigits: 0,
  });

  return (
    <span className={cn(className)}>
      {formatter.format(min)} - {formatter.format(max)}
    </span>
  );
}
