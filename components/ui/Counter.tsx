"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

interface CounterProps {
  value: string;
  className?: string;
}

function parseNumeric(val: string): { prefix: string; num: number; suffix: string } | null {
  const match = val.match(/^([^\d]*?)([\d,.]+)(.*)$/);
  if (!match) return null;
  return {
    prefix: match[1],
    num: parseFloat(match[2].replace(/,/g, "")),
    suffix: match[3],
  };
}

export function Counter({ value, className }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-48px" });
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (!inView) return;

    const parsed = parseNumeric(value);
    if (!parsed) {
      setDisplay(value);
      return;
    }

    const { prefix, num, suffix } = parsed;
    const duration = 1200;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * num);

      const formatted =
        num >= 1000
          ? current.toLocaleString("en-US")
          : String(current);
      setDisplay(`${prefix}${formatted}${suffix}`);

      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [inView, value]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
