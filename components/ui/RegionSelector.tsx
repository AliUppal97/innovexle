"use client";

import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { regions, getDefaultRegion, getRegionById, type Region } from "@/lib/regions";
import { cn } from "@/lib/utils";

const REGION_KEY = "innovexle-region";
const DROPDOWN_MAX_HEIGHT = 280;
const VIEWPORT_PADDING = 16;
const DROPDOWN_GAP = 8;

/**
 * Region dropdown design — industry standards:
 * - Trigger: 36px min height (WCAG 2.5.5 touch target), 14px font
 * - Options: 44px min height (48dp Material / 44px Apple HIG), 14px font
 * - Hover: 150ms ease-out, subtle bg change
 * - Width: 200px min for readability
 */
const TRIGGER_CLASSES =
  "flex h-9 min-w-[6.5rem] shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-[0.875rem] font-medium leading-tight text-muted hover:bg-muted/10 hover:text-foreground transition-colors duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background active:bg-muted/15";
const DROPDOWN_BASE_CLASSES =
  "absolute w-[200px] min-w-[200px] max-w-[min(220px,100vw-2rem)] rounded-xl border border-border bg-card py-1.5 shadow-lg ring-1 ring-black/5 z-[100] overflow-y-auto scrollbar-thin";
const OPTION_BASE_CLASSES =
  "flex min-h-[2.75rem] w-full items-center gap-3 px-4 py-2.5 text-[0.875rem] leading-snug transition-colors duration-150 ease-out text-left rounded-lg mx-1";
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

  const handleChange = (r: Region) => {
    setRegion(r);
    setOpen(false);
  };

  const dropdownPlacement = position.openAbove ? "bottom-full mb-2" : "top-full mt-2";
  const dropdownAlignment =
    inMobileMenu || !position.alignRight ? "left-0 right-auto" : "right-0 left-auto";

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
        <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM10.5 4.5a.75.75 0 0 1 .75.75v.816a3.836 3.836 0 0 1 1.72.756c.712.566 1.112 1.35 1.112 2.178 0 .829-.4 1.612-1.112 2.178a3.836 3.836 0 0 1-1.72.756v2.608a3.836 3.836 0 0 1 1.72.756c.712.566 1.112 1.35 1.112 2.178 0 .829-.4 1.612-1.112 2.178a3.836 3.836 0 0 1-1.72.756V18a.75.75 0 0 1-1.5 0v-.81a4.124 4.124 0 0 1-1.821-.749c-.745-.559-1.179-1.344-1.179-2.191 0-.847.434-1.632 1.179-2.191a4.122 4.122 0 0 1 1.821-.75V8.354a4.124 4.124 0 0 1-1.821-.749C6.434 6.856 6 6.071 6 5.224c0-.847.434-1.632 1.179-2.191a4.122 4.122 0 0 1 1.821-.75V4.5a.75.75 0 0 1 .75-.75Z" />
        </svg>
        <span className="shrink-0 font-medium tabular-nums">{region.currencySymbol}</span>
        <span className="min-w-0 truncate max-w-[4.5rem]">{region.currency}</span>
        <svg className={cn("h-3 w-3 shrink-0 transition-transform duration-200", open && "rotate-180")} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div
          role="listbox"
          aria-label={t("label")}
          className={cn(DROPDOWN_BASE_CLASSES, dropdownPlacement, dropdownAlignment)}
          style={{ maxHeight: position.maxHeight }}
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
      {formatter.format(min)} – {formatter.format(max)}
    </span>
  );
}
