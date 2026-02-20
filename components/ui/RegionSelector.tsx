"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { regions, getDefaultRegion, getRegionById, type Region } from "@/lib/regions";
import { cn } from "@/lib/utils";

const REGION_KEY = "innovexle-region";

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

export function RegionSelector() {
  const t = useTranslations("region");
  const { region, setRegion } = useRegion();

  return (
    <select
      value={region.id}
      onChange={(e) => {
        const found = getRegionById(e.target.value);
        if (found) setRegion(found);
      }}
      className="h-8 rounded-md border border-border bg-background px-2 text-small text-muted hover:text-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-colors"
      aria-label={t("label")}
    >
      {regions.map((r) => (
        <option key={r.id} value={r.id}>
          {t(r.id as "global" | "europe" | "uk" | "india" | "canada")}
        </option>
      ))}
    </select>
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
