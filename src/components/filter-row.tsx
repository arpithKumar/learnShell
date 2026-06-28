"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const FOCUS_RING =
  "outline-none focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:border-ring";

export function FilterRow({
  label,
  options,
  active,
  onSelect,
  totalCount,
  orientation = "horizontal",
}: {
  label: string;
  options: { value: string; count: number; dotColor?: string }[];
  active: string | null;
  onSelect: (value: string | null) => void;
  totalCount: number;
  orientation?: "horizontal" | "vertical";
}) {
  const vertical = orientation === "vertical";

  return (
    <div
      className={cn(
        vertical
          ? "bg-card space-y-2 rounded-xl border p-3"
          : "flex flex-wrap items-center gap-2",
      )}
    >
      <span
        className={cn(
          "text-muted-foreground shrink-0 text-xs font-medium uppercase tracking-wide",
          vertical ? "block px-1" : "w-20",
        )}
      >
        {label}
      </span>
      <div className={cn(vertical ? "flex flex-col gap-0.5" : "contents")}>
        <button
          type="button"
          onClick={() => onSelect(null)}
          className={cn(
            "font-medium transition-colors",
            FOCUS_RING,
            vertical
              ? "flex items-start justify-between gap-2 rounded-md px-2 py-1.5 text-left text-sm"
              : "rounded-full border border-foreground/15 bg-card px-3 py-1 text-sm",
            active === null
              ? vertical
                ? "bg-accent text-foreground"
                : "border-primary bg-primary text-primary-foreground"
              : vertical
                ? "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                : "hover:border-primary/50 hover:bg-accent/30",
          )}
        >
          <span>All</span>
          <Badge
            variant="secondary"
            className={cn(
              "ml-1.5 shrink-0 text-xs",
              active === null &&
                !vertical &&
                "bg-primary-foreground/20 text-primary-foreground",
            )}
          >
            {totalCount}
          </Badge>
        </button>
        {options.map(({ value, count, dotColor }) => (
          <button
            key={value}
            type="button"
            onClick={() => onSelect(value)}
            className={cn(
              "flex font-medium capitalize transition-colors",
              FOCUS_RING,
              vertical
                ? "items-start justify-between gap-2 rounded-md px-2 py-1.5 text-left text-sm"
                : "items-center rounded-full border border-foreground/15 bg-card px-3 py-1 text-sm",
              active === value
                ? vertical
                  ? "bg-accent text-foreground"
                  : "border-primary bg-primary text-primary-foreground"
                : vertical
                  ? "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                  : "hover:border-primary/50 hover:bg-accent/30",
            )}
          >
            <span className="inline-flex items-center">
              {dotColor && (
                <span
                  className="mr-1.5 inline-block size-1.5 shrink-0 rounded-full"
                  style={{ backgroundColor: dotColor }}
                  aria-hidden="true"
                />
              )}
              {value.replace(/-/g, " ")}
            </span>
            <Badge
              variant="secondary"
              className={cn(
                "ml-1.5 shrink-0 text-xs",
                active === value &&
                  !vertical &&
                  "bg-primary-foreground/20 text-primary-foreground",
              )}
            >
              {count}
            </Badge>
          </button>
        ))}
      </div>
    </div>
  );
}
