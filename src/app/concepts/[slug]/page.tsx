import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Lightbulb, Sparkles, TriangleAlert } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";
import {
  getAllConceptSlugs,
  getConceptBySlug,
} from "@/lib/content/concept-loader";
import { getCommandBySlug } from "@/lib/content/loader";
import { Badge } from "@/components/ui/badge";
import { ExampleTerminal } from "@/components/example-terminal";
import { BackButton } from "@/components/back-button";
import { JsonLd } from "@/components/json-ld";
import { cn } from "@/lib/utils";
import { SITE_URL } from "@/lib/site";
import type { Difficulty } from "@/lib/content/schema";

const DIFFICULTY_STYLES: Record<Difficulty, string> = {
  beginner:
    "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  intermediate:
    "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  advanced:
    "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
};

export function generateStaticParams() {
  return getAllConceptSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const concept = getConceptBySlug(slug);

  if (!concept) return {};

  return {
    title: concept.title,
    description: concept.summary,
    openGraph: { title: concept.title, description: concept.summary },
    twitter: { title: concept.title, description: concept.summary },
  };
}

export default async function ConceptPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const concept = getConceptBySlug(slug);

  if (!concept) {
    notFound();
  }

  const relatedConcepts = concept.relatedConcepts
    .map((relatedSlug) => getConceptBySlug(relatedSlug))
    .filter((c): c is NonNullable<typeof c> => c !== null);

  const relatedCommands = concept.relatedCommands
    .map((relatedSlug) => getCommandBySlug(relatedSlug))
    .filter((c): c is NonNullable<typeof c> => c !== null);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "DefinedTerm",
          name: concept.title,
          description: concept.summary,
          url: `${SITE_URL}/concepts/${concept.slug}`,
        }}
      />
      <BackButton />

      <div className="mb-6 flex flex-wrap items-center gap-2">
        <Badge
          variant="outline"
          className={cn("capitalize", DIFFICULTY_STYLES[concept.difficulty])}
        >
          {concept.difficulty}
        </Badge>
        <Badge variant="secondary" className="capitalize">
          {concept.category.replace(/-/g, " ")}
        </Badge>
      </div>

      <h1 className="text-4xl font-bold">{concept.title}</h1>
      <p className="text-muted-foreground mt-3 text-lg">{concept.summary}</p>

      <div
        className={cn(
          "prose prose-neutral dark:prose-invert mt-8 max-w-none",
          "prose-headings:font-heading prose-headings:tracking-tight",
          "prose-p:leading-[1.75] prose-p:text-foreground/90",
          "prose-strong:text-foreground prose-strong:font-semibold",
          "prose-code:rounded prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:font-mono prose-code:text-[0.85em] prose-code:font-medium prose-code:text-primary prose-code:before:content-none prose-code:after:content-none",
        )}
      >
        <MDXRemote source={concept.body} />
      </div>

      {concept.examples.length > 0 && (
        <div className="mt-10">
          <h2 className="mb-3 text-sm font-semibold">Examples</h2>
          <div className="space-y-4">
            {concept.examples.map((ex, i) => (
              <ExampleTerminal
                key={i}
                description={ex.description}
                input={ex.input}
                output={ex.output}
              />
            ))}
          </div>
        </div>
      )}

      {concept.tips.length > 0 && (
        <div className="mt-10">
          <h2 className="mb-3 text-sm font-semibold">Practical tips</h2>
          <div className="space-y-2.5">
            {concept.tips.map((tip, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-lg border border-primary/20 bg-[color-mix(in_oklch,var(--primary)_5%,var(--card))] px-4 py-3"
              >
                <span className="bg-primary/15 flex size-6 shrink-0 items-center justify-center rounded-full">
                  <Lightbulb
                    className="text-primary size-3.5"
                    aria-hidden="true"
                  />
                </span>
                <p className="text-foreground/90 text-sm leading-relaxed">
                  {tip}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {concept.pitfalls.length > 0 && (
        <div className="mt-10">
          <h2 className="mb-3 text-sm font-semibold">Common pitfalls</h2>
          <div className="space-y-2.5">
            {concept.pitfalls.map((p, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-lg border border-amber-500/25 bg-[color-mix(in_oklch,var(--color-amber-500)_7%,var(--card))] px-4 py-3"
              >
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-amber-500/15">
                  <TriangleAlert
                    className="size-3.5 text-amber-600 dark:text-amber-400"
                    aria-hidden="true"
                  />
                </span>
                <p className="text-foreground/90 text-sm leading-relaxed">
                  {p}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {concept.funFacts.length > 0 && (
        <div className="mt-10">
          <h2 className="mb-3 text-sm font-semibold">Fun facts</h2>
          <div className="space-y-2.5">
            {concept.funFacts.map((fact, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-lg border border-violet-500/25 bg-violet-500/[0.07] px-4 py-3"
              >
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-violet-500/15">
                  <Sparkles
                    className="size-3.5 text-violet-600 dark:text-violet-400"
                    aria-hidden="true"
                  />
                </span>
                <p className="text-foreground/90 text-sm leading-relaxed">
                  {fact}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {(relatedConcepts.length > 0 || relatedCommands.length > 0) && (
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {relatedConcepts.length > 0 && (
            <div>
              <h2 className="mb-3 text-sm font-semibold">Related concepts</h2>
              <div className="space-y-1">
                {relatedConcepts.map((related) => (
                  <Link
                    key={related.slug}
                    href={`/concepts/${related.slug}`}
                    className="group -mx-2 flex items-center justify-between gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent/50"
                  >
                    <span>{related.title}</span>
                    <ArrowRight
                      className="text-muted-foreground size-3.5 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
                      aria-hidden="true"
                    />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {relatedCommands.length > 0 && (
            <div>
              <h2 className="mb-3 text-sm font-semibold">Related commands</h2>
              <div className="space-y-1">
                {relatedCommands.map((related) => (
                  <Link
                    key={related.slug}
                    href={`/command/${related.slug}`}
                    className="group -mx-2 flex items-center justify-between gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent/50"
                  >
                    <span className="font-mono">{related.name}</span>
                    <ArrowRight
                      className="text-muted-foreground size-3.5 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
                      aria-hidden="true"
                    />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
