"use client";

import Image from "next/image";
import { useTheme } from "@/components/providers/ThemeProvider";
import { cn } from "@/lib/utils";

/** Horizontal logo ~4:1 ratio (icon + text). Use min 48px height for readability. */
const LOGO_SIZES = {
  horizontal: { width: 320, height: 80 }, // 4:1 – scales to any height
  vertical: { width: 120, height: 140 },  // stacked: icon above text
  icon: { width: 32, height: 32 },
} as const;

export type LogoVariant = keyof typeof LOGO_SIZES;

interface LogoProps {
  variant?: LogoVariant;
  className?: string;
  /** Only for variant="icon" – use icon-only logo elsewhere (e.g. favicon) */
  iconOnly?: boolean;
}

export function Logo({
  variant = "horizontal",
  className,
  iconOnly = false,
}: LogoProps) {
  const { resolvedTheme } = useTheme();
  const resolvedVariant = iconOnly ? "icon" : variant;

  if (resolvedVariant === "icon") {
    return (
      <Image
        src="/logo-icon.png"
        alt="Innovexle"
        width={LOGO_SIZES.icon.width}
        height={LOGO_SIZES.icon.height}
        className={cn("shrink-0 object-contain", className)}
        priority
      />
    );
  }

  if (resolvedVariant === "vertical") {
    return (
      <Image
        src="/logo-stacked.png"
        alt="Innovexle"
        width={LOGO_SIZES.vertical.width}
        height={LOGO_SIZES.vertical.height}
        className={cn("shrink-0 object-contain", className)}
        priority
      />
    );
  }

  // horizontal (default) – dark logo on light theme, light logo on dark theme
  const horizontalSrc =
    resolvedTheme === "dark" ? "/logo-horizontal-light.png" : "/logo-horizontal-dark.png";
  const isDark = resolvedTheme === "dark";

  return (
    <span
      className={cn(
        "inline-block shrink-0",
        isDark && "[mix-blend-mode:screen]",
        className
      )}
    >
      <Image
        src={horizontalSrc}
        alt="Innovexle"
        width={LOGO_SIZES.horizontal.width}
        height={LOGO_SIZES.horizontal.height}
        className="block size-full object-contain"
        priority
      />
    </span>
  );
}
