import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Blocks, Grid2x2, Layers, Target } from "lucide-react";
import { AIToolTabs } from "@/components/ai-tool-tabs";
import { AIToolRecommendations } from "@/components/ai-tool-recommendations";
import { AIToolComparisonTable } from "@/components/ai-tool-comparison-table";
import { AIToolsHeroMockup } from "@/components/ai-tools-hero-mockup";
import { SectionHeading } from "@/components/section-heading";
import { AI_TOOLS } from "@/lib/content/ai-tools";
import { TASK_RECOMMENDATIONS } from "@/lib/content/ai-tool-recommendations";
import { CATEGORY_LABEL } from "@/lib/ai-tool-category";

export const metadata: Metadata = {
  title: "AI Tools",
  description:
    "Config files and folder structures for Claude Code, Gemini CLI, Cursor, GitHub Copilot, ChatGPT, and Grok — how to set each one up to work effectively on your project.",
};

export default function AIToolsPage() {
  const categoryCount = new Set(AI_TOOLS.map((t) => t.category)).size;
  const mcpCount = AI_TOOLS.filter((t) =>
    t.features.some((f) => f.toLowerCase().includes("mcp")),
  ).length;

  const stats = [
    { icon: Blocks, value: `${AI_TOOLS.length}`, label: "AI tools covered" },
    { icon: Layers, value: `${categoryCount}`, label: "Categories" },
    { icon: Grid2x2, value: `${mcpCount}`, label: "Support MCP" },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Tools</h1>
          <p className="text-muted-foreground mt-3">
            What each AI coding tool reads from your project, and how to
            structure it for best results. Conventions here move fast — treat
            this as a starting point and check each vendor&rsquo;s current docs.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2">
            {stats.map((stat) => (
              <div key={stat.label} className="flex items-center gap-2">
                <stat.icon className="text-primary size-4" aria-hidden="true" />
                <span className="text-base font-semibold">{stat.value}</span>
                <span className="text-muted-foreground text-sm">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-center lg:justify-end">
          <AIToolsHeroMockup />
        </div>
      </div>

      <div className="mt-14">
        <SectionHeading
          icon={Target}
          title="Which tool for which task?"
          description="A quick starting point — most people end up using more than one of these for different parts of their workflow."
        />
        <div className="mt-4">
          <AIToolRecommendations recommendations={TASK_RECOMMENDATIONS} />
        </div>
      </div>

      <div className="mt-14">
        <SectionHeading
          icon={Grid2x2}
          title="At a glance"
          description="A quick side-by-side comparison. Click a tool name to open its full reference below."
        />
        <div className="mt-4">
          <AIToolComparisonTable tools={AI_TOOLS} />
        </div>
      </div>

      <div id="full-reference" className="mt-14 scroll-mt-24">
        <SectionHeading
          icon={Layers}
          title="Full reference"
          description={`Config files, folder structure, and best practices for each tool — grouped as ${Object.values(
            CATEGORY_LABEL,
          ).join(", ")}.`}
        />
        <div className="mt-4">
          <Suspense fallback={null}>
            <AIToolTabs tools={AI_TOOLS} />
          </Suspense>
        </div>
      </div>

      <Link
        href="/prompt-engineering"
        className="bg-card mt-10 flex items-center justify-between gap-4 rounded-xl border p-5 transition-colors hover:border-primary/40"
      >
        <div>
          <h2 className="font-semibold">Prompt engineering guide</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Tool-agnostic best practices for getting better results out of any
            AI assistant.
          </p>
        </div>
        <ArrowRight
          className="text-muted-foreground size-5 shrink-0"
          aria-hidden="true"
        />
      </Link>
    </div>
  );
}
