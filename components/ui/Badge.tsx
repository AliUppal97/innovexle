import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "accent" | "outline";
}

export function Badge({
  className,
  variant = "default",
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-small font-medium",
        {
          "bg-muted/20 text-foreground": variant === "default",
          "bg-accent/10 text-accent": variant === "accent",
          "border border-border bg-transparent text-muted": variant === "outline",
        },
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
