import { cn } from "@/lib/utils";

interface LogoMarkProps {
  className?: string;
}

export function LogoMark({ className }: LogoMarkProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-8 w-8", className)}
      aria-hidden="true"
    >
      <path
        d="M50 8L86.4 29v42L50 92l-36.4-21V29z"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="50" cy="30" r="4.5" fill="currentColor" />
      <line
        x1="50"
        y1="42"
        x2="50"
        y2="76"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinecap="round"
      />
    </svg>
  );
}

interface LogoProps {
  className?: string;
  showText?: boolean;
  textClassName?: string;
}

export function Logo({
  className,
  showText = true,
  textClassName,
}: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <LogoMark />
      {showText && (
        <span
          className={cn(
            "text-lg font-semibold tracking-tight text-foreground",
            textClassName
          )}
        >
          Innovexle
        </span>
      )}
    </span>
  );
}
