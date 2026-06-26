"use client";

import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  CONTEXT_LABELS,
  SHORTCUTS,
  type ShortcutContext,
} from "@/lib/shortcuts-data";
import { useQueryFilter } from "@/lib/use-query-filter";

const CONTEXTS = Object.keys(CONTEXT_LABELS) as ShortcutContext[];

const FOCUS_RING =
  "outline-none focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:border-ring";

export function ShortcutsExplorer() {
  const [active, setActive] = useQueryFilter("context") as [
    ShortcutContext | null,
    (value: ShortcutContext | null) => void,
  ];

  const filtered = useMemo(
    () => (active ? SHORTCUTS.filter((s) => s.context === active) : SHORTCUTS),
    [active],
  );

  return (
    <div>
      <div id="tour-shortcuts-filter" className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setActive(null)}
          className={cn(
            "rounded-full border border-foreground/15 px-3.5 py-1.5 text-sm font-medium transition-colors",
            FOCUS_RING,
            active === null
              ? "border-primary bg-primary text-primary-foreground"
              : "hover:border-primary/50 hover:bg-accent/30",
          )}
        >
          All
        </button>
        {CONTEXTS.map((context) => (
          <button
            key={context}
            type="button"
            onClick={() => setActive(context)}
            className={cn(
              "rounded-full border border-foreground/15 px-3.5 py-1.5 text-sm font-medium transition-colors",
              FOCUS_RING,
              active === context
                ? "border-primary bg-primary text-primary-foreground"
                : "hover:border-primary/50 hover:bg-accent/30",
            )}
          >
            {CONTEXT_LABELS[context]}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((shortcut, i) => (
          <div
            key={`${shortcut.context}-${i}`}
            className="flex items-start gap-3 rounded-lg border px-4 py-3"
          >
            <kbd className="bg-muted shrink-0 rounded px-2 py-1 font-mono text-xs font-medium">
              {shortcut.keys}
            </kbd>
            <div className="min-w-0">
              <p className="text-sm">{shortcut.description}</p>
              <Badge variant="outline" className="mt-2 text-xs capitalize">
                {CONTEXT_LABELS[shortcut.context]}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
