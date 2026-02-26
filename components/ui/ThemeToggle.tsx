"use client";

import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";
import { useTheme } from "@/components/providers/ThemeProvider";

export function ThemeToggle() {
  const { resolvedTheme, setTheme, theme } = useTheme();

  const cycle = () => {
    const order: Array<"light" | "dark" | "system"> = [
      "light",
      "dark",
      "system",
    ];
    const next = order[(order.indexOf(theme) + 1) % order.length];
    setTheme(next);
  };

  return (
    <button
      onClick={cycle}
      className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted hover:text-foreground hover:bg-muted/10 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      aria-label={`Current theme: ${theme}. Click to cycle.`}
      title={`Theme: ${theme}`}
    >
      <SunIcon
        className={`h-5 w-5 transition-all ${
          resolvedTheme === "dark"
            ? "scale-0 rotate-90 opacity-0"
            : "scale-100 rotate-0 opacity-100"
        }`}
        aria-hidden
      />
      <MoonIcon
        className={`absolute h-5 w-5 transition-all ${
          resolvedTheme === "dark"
            ? "scale-100 rotate-0 opacity-100"
            : "scale-0 -rotate-90 opacity-0"
        }`}
        aria-hidden
      />
    </button>
  );
}
