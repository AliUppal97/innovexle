import {
  forwardRef,
  cloneElement,
  isValidElement,
  type ButtonHTMLAttributes,
  type ReactElement,
} from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  asChild?: boolean;
}

function getButtonClasses(
  variant: ButtonProps["variant"] = "primary",
  size: ButtonProps["size"] = "md",
  className?: string
) {
  return cn(
    "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
    {
      "bg-gradient-to-r from-accent to-accent-secondary text-accent-foreground shadow-sm hover:shadow-button-glow transition-shadow duration-300":
        variant === "primary",
      "border border-border bg-transparent text-foreground hover:bg-muted/10 hover:border-accent/30":
        variant === "secondary",
      "bg-transparent text-foreground hover:bg-muted/10": variant === "ghost",
    },
    {
      "h-9 px-4 text-small": size === "sm",
      "h-11 px-6 text-body": size === "md",
      "h-13 px-8 text-body": size === "lg",
    },
    className
  );
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      asChild = false,
      children,
      ...props
    },
    ref
  ) => {
    const classes = getButtonClasses(variant, size, className);

    if (asChild && isValidElement(children)) {
      return cloneElement(children as ReactElement<Record<string, unknown>>, {
        className: cn(
          classes,
          (children as ReactElement<{ className?: string }>).props.className
        ),
        ref,
      });
    }

    return (
      <button className={classes} ref={ref} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
