"use client";

import { cn } from "@/lib/utils";
import { useQueryFilter } from "@/lib/use-query-filter";
import { AIToolDetail } from "@/components/ai-tool-detail";
import { CATEGORY_DOT_CLASS } from "@/lib/ai-tool-category";
import type { AIToolEntry } from "@/lib/content/ai-tools";

const FOCUS_RING =
  "outline-none focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:border-ring";

export function AIToolTabs({ tools }: { tools: AIToolEntry[] }) {
  const [active, setActive] = useQueryFilter("tool", tools[0].slug);
  const activeTool = tools.find((t) => t.slug === active) ?? tools[0];

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        {tools.map((tool) => (
          <button
            key={tool.slug}
            type="button"
            onClick={() => setActive(tool.slug)}
            aria-current={activeTool.slug === tool.slug ? "true" : undefined}
            className={cn(
              "rounded-full border border-foreground/15 bg-card px-3.5 py-1.5 text-sm font-medium transition-colors",
              FOCUS_RING,
              activeTool.slug === tool.slug
                ? "border-primary bg-primary text-primary-foreground"
                : "hover:border-primary/50 hover:bg-accent/30",
            )}
          >
            <span
              className={cn(
                "mr-1.5 inline-block size-1.5 rounded-full",
                activeTool.slug === tool.slug
                  ? "bg-primary-foreground"
                  : CATEGORY_DOT_CLASS[tool.category],
              )}
              aria-hidden="true"
            />
            {tool.name}
          </button>
        ))}
      </div>

      <div className="mt-6">
        <AIToolDetail tool={activeTool} />
      </div>
    </div>
  );
}
