import type { Metadata } from "next";
import {
  Check,
  Compass,
  Crosshair,
  LayoutTemplate,
  ListChecks,
  MessageSquare,
  RefreshCw,
  X,
} from "lucide-react";
import { BackButton } from "@/components/back-button";
import { PromptTipCard } from "@/components/prompt-tip-card";
import { SectionHeading } from "@/components/section-heading";
import { PROMPT_TIP_GROUPS } from "@/lib/content/prompt-tips";

export const metadata: Metadata = {
  title: "Prompt Engineering",
  description:
    "Tool-agnostic best practices for structuring prompts and getting better results from any AI coding assistant.",
};

const CATEGORY_ICONS = {
  "Setting context": Compass,
  "Being specific": Crosshair,
  Iterating: RefreshCw,
  "Using examples": LayoutTemplate,
  "Managing large tasks": ListChecks,
  "Giving feedback": MessageSquare,
} as const;

export default function PromptEngineeringPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <BackButton />
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight">
          Prompt Engineering
        </h1>
        <p className="text-muted-foreground mt-2">
          These apply regardless of which AI tool you&rsquo;re using — patterns
          for getting better, more predictable results.
        </p>
      </div>

      <div className="grid items-start gap-3 sm:grid-cols-2">
        <div className="border-rose-500/30 bg-card rounded-xl border-2 p-4">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400">
            <X className="size-3.5" aria-hidden="true" />
            Vague
          </span>
          <code className="text-muted-foreground mt-2 block font-mono text-sm leading-relaxed">
            &ldquo;The login form doesn&rsquo;t work, can you fix it?&rdquo;
          </code>
        </div>
        <div className="border-emerald-500/30 bg-card rounded-xl border-2 p-4">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <Check className="size-3.5" aria-hidden="true" />
            Specific
          </span>
          <code className="mt-2 block font-mono text-sm leading-relaxed text-foreground/90">
            &ldquo;Submitting the login form with an empty password throws a 500
            instead of showing a validation error — see api/login.ts:42.&rdquo;
          </code>
        </div>
      </div>

      <div className="mt-14 space-y-12">
        {PROMPT_TIP_GROUPS.map((group) => (
          <section key={group.category}>
            <SectionHeading
              icon={
                CATEGORY_ICONS[group.category as keyof typeof CATEGORY_ICONS] ??
                Compass
              }
              title={group.category}
              description={`${group.tips.length} tip${group.tips.length === 1 ? "" : "s"}`}
            />
            <div className="mt-4 grid items-start gap-3 sm:grid-cols-2">
              {group.tips.map((tip, i) => (
                <PromptTipCard key={tip.title} tip={tip} index={i} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
