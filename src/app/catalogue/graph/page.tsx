import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getAllCommands } from "@/lib/content/loader";
import { buildConceptGraph } from "@/lib/concept-graph";
import { ConceptGraph } from "@/components/concept-graph";

export const metadata: Metadata = {
  title: "Concept Graph",
  description:
    "Every command, grouped by category and connected by its related commands, in an explorable graph.",
};

export default function ConceptGraphPage() {
  const commands = getAllCommands();
  const { nodes, edges, categoryLabels } = buildConceptGraph(commands);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Link
        href="/catalogue"
        className="text-muted-foreground mb-6 inline-flex items-center gap-1.5 text-sm hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" aria-hidden="true" />
        Back to catalogue
      </Link>

      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Concept graph</h1>
        <p className="text-muted-foreground mt-2">
          Every command, grouped by category. Hover a command to highlight its
          related commands, drag to pan, scroll to zoom, click to open it.
        </p>
      </div>

      <ConceptGraph
        nodes={nodes}
        edges={edges}
        categoryLabels={categoryLabels}
      />
    </div>
  );
}
