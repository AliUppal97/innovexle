import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          secondary: "hsl(var(--accent-secondary))",
          foreground: "hsl(var(--accent-foreground))",
        },
        border: "hsl(var(--border))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
          muted: "hsl(var(--destructive) / 0.1)",
          border: "hsl(var(--destructive) / 0.2)",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
          muted: "hsl(var(--success) / 0.1)",
          border: "hsl(var(--success) / 0.3)",
        },
      },
      ringOffsetColor: {
        background: "hsl(var(--background))",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        urdu: ["Noto Nastaliq Urdu", "Urdu Typesetting", "Nafees Nastaleeq", "serif"],
      },
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1.4" }],
        display: ["4.5rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        h1: ["3rem", { lineHeight: "1.2", letterSpacing: "-0.02em" }],
        h2: ["2.25rem", { lineHeight: "1.3", letterSpacing: "-0.01em" }],
        h3: ["1.5rem", { lineHeight: "1.4" }],
        body: ["1.125rem", { lineHeight: "1.7" }],
        small: ["0.875rem", { lineHeight: "1.5" }],
      },
      spacing: {
        13: "3.25rem",
        18: "4.5rem",
        22: "5.5rem",
      },
      boxShadow: {
        "card": "0 1px 3px 0 rgb(0 0 0 / 0.04), 0 1px 2px -1px rgb(0 0 0 / 0.04)",
        "card-hover": "0 10px 15px -3px rgb(0 0 0 / 0.05), 0 4px 6px -4px rgb(0 0 0 / 0.05)",
        /* Material elevation 4 / Apple HIG - premium floating nav */
        "nav-floating":
          "0 4px 6px -1px rgb(0 0 0 / 0.07), 0 10px 20px -5px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.04)",
        "nav-floating-dark":
          "0 4px 6px -1px rgb(0 0 0 / 0.3), 0 10px 20px -5px rgb(0 0 0 / 0.25), 0 2px 4px -2px rgb(0 0 0 / 0.2)",
        "button-glow":
          "0 8px 30px -4px hsl(var(--accent-secondary) / 0.35)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out forwards",
        "slide-up": "slideUp 0.5s ease-out forwards",
      },
      transitionDuration: {
        "400": "400ms",
      },
      transitionTimingFunction: {
        "smooth": "cubic-bezier(0.21, 0.47, 0.32, 0.98)",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
