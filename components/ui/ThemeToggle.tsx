"use client";

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
      className="relative inline-flex h-9 w-9 items-center justify-center rounded-md text-muted hover:text-foreground hover:bg-muted/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      aria-label={`Current theme: ${theme}. Click to cycle.`}
      title={`Theme: ${theme}`}
    >
      {/* Sun */}
      <svg
        className={`h-[18px] w-[18px] transition-all ${
          resolvedTheme === "dark"
            ? "scale-0 rotate-90 opacity-0"
            : "scale-100 rotate-0 opacity-100"
        }`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="5" />
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
      </svg>
      {/* Moon */}
      <svg
        className={`absolute h-[18px] w-[18px] transition-all ${
          resolvedTheme === "dark"
            ? "scale-100 rotate-0 opacity-100"
            : "scale-0 -rotate-90 opacity-0"
        }`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
      </svg>
    </button>
  );
}
