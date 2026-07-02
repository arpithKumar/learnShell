"use client";

import { SpotlightCard } from "@/components/spotlight-card";
import type { PromptTip } from "@/lib/content/prompt-tips";

export function PromptTipCard({
  tip,
  index,
}: {
  tip: PromptTip;
  index: number;
}) {
  return (
    <SpotlightCard className="p-4" index={index}>
      <h3 className="text-sm font-semibold">{tip.title}</h3>
      <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
        {tip.description}
      </p>
      {tip.example && (
        <code className="bg-muted mt-3 block rounded-md px-2.5 py-1.5 font-mono text-xs leading-relaxed text-foreground/80">
          {tip.example}
        </code>
      )}
    </SpotlightCard>
  );
}
