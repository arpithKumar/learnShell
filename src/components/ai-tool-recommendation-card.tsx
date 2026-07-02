"use client";

import Link from "next/link";
import {
  Bot,
  MessageCircleQuestion,
  Plug,
  Users,
  Workflow,
  Zap,
} from "lucide-react";
import { SpotlightCard } from "@/components/spotlight-card";
import { AI_TOOLS } from "@/lib/content/ai-tools";
import { cn } from "@/lib/utils";
import type { TaskRecommendation } from "@/lib/content/ai-tool-recommendations";

const TASK_ICONS = {
  "large-refactors": Workflow,
  "in-editor-completions": Zap,
  "team-standards": Users,
  "quick-questions": MessageCircleQuestion,
  "mcp-automation": Plug,
  "personal-automation": Bot,
} as const;

export function AIToolRecommendationCard({
  rec,
  index,
}: {
  rec: TaskRecommendation;
  index: number;
}) {
  const Icon = TASK_ICONS[rec.slug as keyof typeof TASK_ICONS] ?? Workflow;

  return (
    <SpotlightCard className="p-4" index={index}>
      <span
        className="bg-primary/10 flex size-9 items-center justify-center rounded-full"
        aria-hidden="true"
      >
        <Icon className="text-primary size-4" />
      </span>
      <h3 className="mt-3 text-sm font-semibold">{rec.task}</h3>
      <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
        {rec.reasoning}
      </p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {rec.recommended.map((slug, i) => {
          const tool = AI_TOOLS.find((t) => t.slug === slug);
          if (!tool) return null;
          const isBestFit = i === 0;
          return (
            <Link
              key={slug}
              href={`/ai-tools?tool=${slug}#full-reference`}
              title={isBestFit ? "Best fit" : undefined}
              className={cn(
                "rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
                isBestFit
                  ? "border-primary/30 bg-primary/10 text-primary hover:bg-primary/20"
                  : "border-foreground/15 bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
              )}
            >
              {tool.name}
            </Link>
          );
        })}
      </div>
    </SpotlightCard>
  );
}
