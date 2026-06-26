import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ConceptEntry } from "@/lib/content/concept-schema";
import type { Difficulty } from "@/lib/content/schema";

const DIFFICULTY_BADGE: Record<Difficulty, string> = {
  beginner:
    "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  intermediate:
    "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  advanced:
    "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
};

export function ConceptCard({ concept }: { concept: ConceptEntry }) {
  return (
    <Link
      href={`/concepts/${concept.slug}`}
      className="group block rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <div className="rounded-xl border border-foreground/10 bg-card px-5 py-4 transition-colors group-hover:border-primary/40 group-focus-visible:border-primary/40">
        <div className="flex items-center justify-between gap-2">
          <span className="text-lg font-semibold">{concept.title}</span>
          <Badge
            variant="outline"
            className={cn(
              "text-xs capitalize",
              DIFFICULTY_BADGE[concept.difficulty],
            )}
          >
            {concept.difficulty}
          </Badge>
        </div>
        <p className="text-muted-foreground mt-2 line-clamp-2 text-sm">
          {concept.summary}
        </p>
        <div className="mt-3 flex items-center justify-end">
          <ArrowRight
            className="text-muted-foreground size-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-focus-visible:translate-x-0.5 group-hover:text-primary group-focus-visible:text-primary"
            aria-hidden="true"
          />
        </div>
      </div>
    </Link>
  );
}
