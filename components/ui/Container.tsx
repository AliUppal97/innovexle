import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: "default" | "sm" | "lg";
}

export function Container({
  className,
  size = "default",
  children,
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-8",
        {
          "max-w-5xl": size === "sm",
          "max-w-7xl": size === "default",
          "max-w-[1400px]": size === "lg",
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
