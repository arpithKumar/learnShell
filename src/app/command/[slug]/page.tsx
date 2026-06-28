import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Lightbulb, TriangleAlert } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllCommandSlugs, getCommandBySlug } from "@/lib/content/loader";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { CopyButton } from "@/components/copy-button";
import { ExampleTerminal } from "@/components/example-terminal";
import { CommandSidebar } from "@/components/command-sidebar";
import { FlagExplorer } from "@/components/flag-explorer";
import { PipelineVisualizer } from "@/components/pipeline-visualizer";
import { BookmarkButton } from "@/components/bookmark-button";
import { RecentTracker } from "@/components/recent-tracker";
import { CommandPageTour } from "@/components/command-page-tour";
import { BackButton } from "@/components/back-button";
import { JsonLd } from "@/components/json-ld";
import { cn } from "@/lib/utils";
import { SITE_URL } from "@/lib/site";
import type { Difficulty } from "@/lib/content/schema";

const TAB_TRIGGER_CLASS =
  "flex-none rounded-full border border-foreground/15 px-3.5 py-1.5 hover:border-foreground/30 data-active:border-primary data-active:bg-primary data-active:text-primary-foreground data-active:shadow-none dark:data-active:border-primary dark:data-active:bg-primary";

const DIFFICULTY_STYLES: Record<Difficulty, string> = {
  beginner:
    "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  intermediate:
    "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  advanced:
    "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
};

export function generateStaticParams() {
  return getAllCommandSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const command = getCommandBySlug(slug);

  if (!command) return {};

  return {
    title: command.name,
    description: command.summary,
    openGraph: { title: command.name, description: command.summary },
    twitter: { title: command.name, description: command.summary },
  };
}

export default async function CommandPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const command = getCommandBySlug(slug);

  if (!command) {
    notFound();
  }

  const relatedCommands = command.related
    .map((relatedSlug) => getCommandBySlug(relatedSlug))
    .filter((c): c is NonNullable<typeof c> => c !== null);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "TechArticle",
          headline: command.name,
          description: command.summary,
          url: `${SITE_URL}/command/${command.slug}`,
          proficiencyLevel: command.difficulty,
          about: command.category,
        }}
      />
      <RecentTracker slug={command.slug} />
      <CommandPageTour />
      <BackButton />

      <div className="grid gap-10 lg:grid-cols-[1fr_280px]">
        <div>
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <Badge
              variant="outline"
              className={cn(
                "capitalize",
                DIFFICULTY_STYLES[command.difficulty],
              )}
            >
              {command.difficulty}
            </Badge>
            {command.category.map((c) => (
              <Badge key={c} variant="secondary">
                {c}
              </Badge>
            ))}
            {command.shells.map((s) => (
              <Badge key={s} variant="outline" className="font-mono">
                {s}
              </Badge>
            ))}
          </div>

          <div className="flex items-start justify-between gap-4">
            <h1 className="text-4xl font-bold">{command.name}</h1>
            <BookmarkButton slug={command.slug} />
          </div>
          <p className="text-muted-foreground mt-3 text-lg">
            {command.summary}
          </p>

          <div className="mt-6 flex items-start justify-between gap-3 rounded-lg border bg-muted/40 px-4 py-3">
            <code className="min-w-0 break-all font-mono text-sm">
              {command.syntax}
            </code>
            <CopyButton text={command.syntax} />
          </div>

          <Tabs defaultValue="overview" className="mt-8">
            <TabsList
              id="tour-tabs"
              className="h-auto w-full justify-start gap-2 overflow-x-auto rounded-none bg-transparent p-0"
            >
              <TabsTrigger value="overview" className={TAB_TRIGGER_CLASS}>
                Overview
              </TabsTrigger>
              <TabsTrigger value="flags" className={TAB_TRIGGER_CLASS}>
                Flags{command.flags.length ? ` (${command.flags.length})` : ""}
              </TabsTrigger>
              <TabsTrigger value="examples" className={TAB_TRIGGER_CLASS}>
                Examples
              </TabsTrigger>
              <TabsTrigger value="shortcuts" className={TAB_TRIGGER_CLASS}>
                Tips & Shortcuts
              </TabsTrigger>
              <TabsTrigger value="related" className={TAB_TRIGGER_CLASS}>
                Related
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value="overview"
              className={cn(
                "prose prose-neutral dark:prose-invert max-w-[40rem] pt-6 pb-2",
                "prose-headings:font-heading prose-headings:tracking-tight",
                "prose-p:leading-[1.75] prose-p:text-foreground/90",
                "prose-strong:text-foreground prose-strong:font-semibold",
                "prose-code:rounded prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:font-mono prose-code:text-[0.85em] prose-code:font-medium prose-code:text-primary prose-code:before:content-none prose-code:after:content-none",
              )}
            >
              <MDXRemote source={command.body} />
            </TabsContent>

            <TabsContent value="flags" className="pt-4">
              {command.flags.length > 0 ? (
                <FlagExplorer
                  commandName={command.name}
                  flags={command.flags}
                />
              ) : (
                <p className="text-muted-foreground text-sm">
                  No flags documented yet.
                </p>
              )}
            </TabsContent>

            <TabsContent value="examples" className="space-y-4 pt-4">
              {command.examples.map((ex, i) =>
                ex.input.includes("|") ? (
                  <PipelineVisualizer
                    key={i}
                    description={ex.description}
                    input={ex.input}
                    output={ex.output}
                  />
                ) : (
                  <ExampleTerminal
                    key={i}
                    description={ex.description}
                    input={ex.input}
                    output={ex.output}
                  />
                ),
              )}
              {command.examples.length === 0 && (
                <p className="text-muted-foreground text-sm">
                  No examples documented yet.
                </p>
              )}
            </TabsContent>

            <TabsContent value="shortcuts" className="space-y-8 pt-4">
              {command.tips.length > 0 && (
                <div>
                  <h2 className="mb-3 text-sm font-semibold">Practical tips</h2>
                  <div className="space-y-2.5">
                    {command.tips.map((tip, i) => (
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

              {command.shortcuts.length > 0 && (
                <div>
                  <h2 className="mb-3 text-sm font-semibold">
                    Keyboard shortcuts
                  </h2>
                  <div className="space-y-2">
                    {command.shortcuts.map((s, i) => (
                      <div
                        key={i}
                        className="bg-card flex items-center gap-3 rounded-lg border px-4 py-2.5"
                      >
                        <kbd className="rounded bg-muted px-2.5 py-1 font-mono text-xs font-medium">
                          {s.keys}
                        </kbd>
                        <span className="text-sm">{s.description}</span>
                        <Badge variant="outline" className="ml-auto capitalize">
                          {s.context}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {command.pitfalls.length > 0 && (
                <div>
                  <h2 className="mb-3 text-sm font-semibold">
                    Common pitfalls
                  </h2>
                  <div className="space-y-2.5">
                    {command.pitfalls.map((p, i) => (
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

              {command.tips.length === 0 &&
                command.shortcuts.length === 0 &&
                command.pitfalls.length === 0 && (
                  <p className="text-muted-foreground text-sm">
                    No tips or shortcuts documented yet.
                  </p>
                )}
            </TabsContent>

            <TabsContent value="related" className="space-y-3 pt-4">
              {relatedCommands.map((related) => (
                <Link key={related.slug} href={`/command/${related.slug}`}>
                  <Card className="transition-colors hover:border-primary/50">
                    <CardContent className="flex items-center justify-between gap-3 pt-6">
                      <div>
                        <span className="font-mono font-semibold">
                          {related.name}
                        </span>
                        <p className="text-muted-foreground mt-1 text-sm">
                          {related.summary}
                        </p>
                      </div>
                      <ArrowRight
                        className="text-muted-foreground size-4 shrink-0"
                        aria-hidden="true"
                      />
                    </CardContent>
                  </Card>
                </Link>
              ))}
              {relatedCommands.length === 0 && (
                <p className="text-muted-foreground text-sm">
                  No related commands linked yet.
                </p>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <CommandSidebar command={command} relatedCommands={relatedCommands} />
      </div>
    </div>
  );
}
