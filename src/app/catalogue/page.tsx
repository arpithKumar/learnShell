import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Share2 } from "lucide-react";
import {
  getAllCommands,
  getCategoryCounts,
  getDifficultyCounts,
} from "@/lib/content/loader";
import { CatalogueGrid } from "@/components/catalogue-grid";

export const metadata: Metadata = {
  title: "Catalogue",
  description:
    "Every shell command in one searchable, filterable catalogue — flags, examples, related commands, and gotchas.",
};

export default function CataloguePage() {
  const commands = getAllCommands();
  const categories = getCategoryCounts();
  const difficulties = getDifficultyCounts();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Catalogue</h1>
          <p className="text-muted-foreground mt-2">
            {commands.length} commands and counting — every flag, example, and
            gotcha in one place.
          </p>
        </div>
        <Link
          href="/catalogue/graph"
          className="bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground flex shrink-0 items-center gap-1.5 rounded-full border border-foreground/15 px-3.5 py-1.5 text-sm transition-colors"
        >
          <Share2 className="size-3.5" aria-hidden="true" />
          View as graph
        </Link>
      </div>

      <Suspense fallback={null}>
        <CatalogueGrid
          commands={commands}
          categories={categories}
          difficulties={difficulties}
        />
      </Suspense>
    </div>
  );
}
