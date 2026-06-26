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
}: {
  label: string;
  options: { value: string; count: number }[];
  active: string | null;
  onSelect: (value: string | null) => void;
  totalCount: number;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-muted-foreground w-20 shrink-0 text-xs font-medium uppercase tracking-wide">
        {label}
      </span>
      <button
        type="button"
        onClick={() => onSelect(null)}
        className={cn(
          "rounded-full border border-foreground/15 px-3 py-1 text-sm font-medium transition-colors",
          FOCUS_RING,
          active === null
            ? "border-primary bg-primary text-primary-foreground"
            : "hover:border-primary/50 hover:bg-accent/30",
        )}
      >
        All
        <Badge
          variant="secondary"
          className={cn(
            "ml-1.5 text-xs",
            active === null &&
              "bg-primary-foreground/20 text-primary-foreground",
          )}
        >
          {totalCount}
        </Badge>
      </button>
      {options.map(({ value, count }) => (
        <button
          key={value}
          type="button"
          onClick={() => onSelect(value)}
          className={cn(
            "rounded-full border border-foreground/15 px-3 py-1 text-sm font-medium capitalize transition-colors",
            FOCUS_RING,
            active === value
              ? "border-primary bg-primary text-primary-foreground"
              : "hover:border-primary/50 hover:bg-accent/30",
          )}
        >
          {value.replace(/-/g, " ")}
          <Badge
            variant="secondary"
            className={cn(
              "ml-1.5 text-xs",
              active === value &&
                "bg-primary-foreground/20 text-primary-foreground",
            )}
          >
            {count}
          </Badge>
        </button>
      ))}
    </div>
  );
}
