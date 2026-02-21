"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

/** Standardized dimensions for tech stack logos across the app */
export const TECH_LOGO_SIZE = 32;

interface TechLogoProps {
  /** Path to the logo SVG (e.g. /logos/aws.svg) */
  src: string;
  /** Technology name for alt text and aria */
  name: string;
  className?: string;
  /** Override size - defaults to TECH_LOGO_SIZE (32px) */
  size?: number;
}

/**
 * Renders official technology logos with standardized dimensions.
 * Logos use currentColor in SVGs and dark:invert for theme compatibility.
 */
export function TechLogo({ src, name, className, size = TECH_LOGO_SIZE }: TechLogoProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center shrink-0 text-muted [&_img]:dark:invert [&_img]:dark:opacity-90",
        className
      )}
      aria-hidden
    >
      <Image
        src={src}
        alt=""
        width={size}
        height={size}
        className="object-contain"
        unoptimized // SVGs don't need Next.js optimization
      />
    </span>
  );
}
