"use client";

import { useState, type ReactNode } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface AccordionItemProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export function AccordionItem({
  title,
  children,
  defaultOpen = false,
}: AccordionItemProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-border">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-5 text-left text-h3 font-semibold text-foreground hover:text-accent transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset rounded-sm"
        aria-expanded={open}
      >
        {title}
        <ChevronDownIcon
          className={cn(
            "h-5 w-5 flex-shrink-0 text-muted transition-transform duration-200",
            open && "rotate-180"
          )}
          aria-hidden
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pb-5 text-body text-muted">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface AccordionProps {
  children: ReactNode;
  className?: string;
}

export function Accordion({ children, className }: AccordionProps) {
  return <div className={cn("divide-y divide-border", className)}>{children}</div>;
}
