"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

const DROPDOWN_MAX_HEIGHT = 280;
const VIEWPORT_PADDING = 16;
const DROPDOWN_GAP = 8;
const DROPDOWN_WIDTH = 224;

/** Matches LanguageSwitcher/RegionSelector navbar standards */
const TRIGGER_CLASSES =
  "flex h-9 w-full min-w-0 items-center justify-between gap-2 rounded-lg px-3 py-2 text-[0.875rem] font-medium leading-tight text-foreground border border-border bg-background hover:bg-muted/10 transition-colors duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background active:bg-muted/15";
const DROPDOWN_BASE_CLASSES =
  "absolute rounded-xl border border-border bg-card px-1.5 py-1.5 shadow-lg ring-1 ring-black/5 z-[100] overflow-x-hidden overflow-y-auto scrollbar-thin";
const OPTION_BASE_CLASSES =
  "flex min-h-[2.75rem] w-full items-center gap-3 px-3 py-2.5 text-[0.875rem] leading-snug transition-colors duration-150 ease-out text-left rounded-lg";
const OPTION_SELECTED_CLASSES =
  "bg-accent/10 text-accent font-semibold hover:bg-accent/15";
const OPTION_DEFAULT_CLASSES =
  "text-muted-foreground hover:bg-muted/10 hover:text-foreground active:bg-muted/15";
const PLACEHOLDER_CLASSES = "text-muted-foreground";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  id?: string;
  name?: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  ariaLabel?: string;
  fullWidth?: boolean;
  required?: boolean;
  /** When false, no empty/placeholder option in the list. Use for filters where a value is always selected. */
  allowEmpty?: boolean;
  className?: string;
}

export function Select({
  id,
  name,
  value,
  onChange,
  options,
  placeholder = "Select an option",
  ariaLabel,
  fullWidth = true,
  required,
  allowEmpty = !required,
  className,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({
    openAbove: false,
    maxHeight: DROPDOWN_MAX_HEIGHT,
    alignRight: true,
  });
  const ref = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const selectedOption = options.find((o) => o.value === value);
  const displayLabel = selectedOption?.label ?? placeholder;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (!open) return;
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  useEffect(() => {
    if (!open || !buttonRef.current || typeof window === "undefined") return;

    const updatePosition = () => {
      const rect = buttonRef.current!.getBoundingClientRect();
      const spaceAbove = rect.top - VIEWPORT_PADDING;
      const spaceBelow = window.innerHeight - rect.bottom - VIEWPORT_PADDING;

      const openAbove = spaceAbove > spaceBelow;
      const availableSpace = openAbove ? spaceAbove - DROPDOWN_GAP : spaceBelow - DROPDOWN_GAP;
      const maxHeight = Math.min(DROPDOWN_MAX_HEIGHT, Math.max(availableSpace, 0));
      const dropdownLeftIfRightAligned = rect.right - DROPDOWN_WIDTH;
      const alignRight = dropdownLeftIfRightAligned >= VIEWPORT_PADDING;

      setPosition({ openAbove, maxHeight, alignRight });
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open]);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setOpen(false);
  };

  const dropdownPlacement = position.openAbove ? "bottom-full mb-2" : "top-full mt-2";
  const dropdownAlignment = !position.alignRight ? "left-0 right-auto" : "right-0 left-auto";

  const triggerWidth = fullWidth ? "w-full" : "min-w-[14rem]";

  return (
    <div ref={ref} className={cn("relative", fullWidth ? "w-full" : "", className)}>
      <input
        type="hidden"
        name={name}
        value={value}
        {...(required && { required })}
      />
      <button
        ref={buttonRef}
        id={id}
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(TRIGGER_CLASSES, triggerWidth)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={ariaLabel ?? placeholder}
      >
        <span className={cn("min-w-0 truncate", !selectedOption && PLACEHOLDER_CLASSES)}>
          {displayLabel}
        </span>
        <ChevronDownIcon
          className={cn("h-3.5 w-3.5 shrink-0 transition-transform duration-200", open && "rotate-180")}
          aria-hidden
        />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label={ariaLabel ?? placeholder}
          className={cn(
            DROPDOWN_BASE_CLASSES,
            dropdownPlacement,
            fullWidth ? "left-0 right-0 min-w-full" : dropdownAlignment
          )}
          style={{
            maxHeight: position.maxHeight,
            ...(fullWidth
              ? {}
              : {
                  width: DROPDOWN_WIDTH,
                  minWidth: DROPDOWN_WIDTH,
                  maxWidth: `min(${DROPDOWN_WIDTH}px, calc(100vw - 2rem))`,
                }),
          }}
        >
          {placeholder && allowEmpty && (
            <button
              role="option"
              aria-selected={!value}
              onClick={() => handleSelect("")}
              className={cn(
                OPTION_BASE_CLASSES,
                !value ? OPTION_SELECTED_CLASSES : OPTION_DEFAULT_CLASSES,
                !value ? "" : PLACEHOLDER_CLASSES
              )}
            >
              <span className="min-w-0 truncate">{placeholder}</span>
            </button>
          )}
          {options.map((opt) => (
            <button
              key={opt.value}
              role="option"
              aria-selected={opt.value === value}
              onClick={() => handleSelect(opt.value)}
              className={cn(
                OPTION_BASE_CLASSES,
                opt.value === value ? OPTION_SELECTED_CLASSES : OPTION_DEFAULT_CLASSES
              )}
            >
              <span className="min-w-0 truncate">{opt.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
