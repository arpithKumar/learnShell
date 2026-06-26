import { Suspense } from "react";
import type { Metadata } from "next";
import {
  getAllConcepts,
  getConceptCategoryCounts,
  getConceptDifficultyCounts,
} from "@/lib/content/concept-loader";
import { ConceptGrid } from "@/components/concept-grid";

export const metadata: Metadata = {
  title: "Concepts",
  description:
    "Shell scripting ideas — variables, control flow, pipelines, process control, and the environment around the shell — explained on their own.",
};

export default function ConceptsPage() {
  const concepts = getAllConcepts();
  const categories = getConceptCategoryCounts();
  const difficulties = getConceptDifficultyCounts();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold tracking-tight">Concepts</h1>
      <p className="text-muted-foreground mt-2">
        {concepts.length} shell scripting ideas — variables, control flow,
        pipelines, process control, and the environment around the shell itself
        — explained on their own, separate from any single command.
      </p>

      <div className="mt-8">
        <Suspense fallback={null}>
          <ConceptGrid
            concepts={concepts}
            categories={categories}
            difficulties={difficulties}
          />
        </Suspense>
      </div>
    </div>
  );
}
