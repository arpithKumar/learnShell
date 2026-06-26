import Link from "next/link";
import {
  ArrowRight,
  ListTree,
  SquareSlash,
  TerminalSquare,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getAllCommands, getCategoryCounts } from "@/lib/content/loader";
import { TerminalWindow } from "@/components/terminal-window";
import { FeaturedCommands } from "@/components/featured-commands";
import { cn } from "@/lib/utils";

const FEATURES = [
  {
    icon: SquareSlash,
    title: "Every flag explained",
    description:
      "Not just the command — every flag, with a plain-English description and a real example you can copy.",
  },
  {
    icon: TerminalSquare,
    title: "Real, runnable examples",
    description:
      "Each entry ships with input/output examples grounded in actual usage, not just abstract syntax.",
  },
  {
    icon: ListTree,
    title: "Related commands, linked",
    description:
      "Jump between grep, find, and sed the way you actually use them together — as a connected toolkit.",
  },
  {
    icon: Zap,
    title: "Built for speed",
    description:
      "⌘K search, instant navigation, and a static-first site that never makes you wait to learn.",
  },
];

export default function Home() {
  const commands = getAllCommands();
  const featured = commands.slice(0, 6);
  const categories = getCategoryCounts();

  return (
    <div>
      <section className="relative">
        <div className="hero-backdrop" />
        <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 lg:grid-cols-2 lg:py-28">
          <div className="flex flex-col items-start gap-6">
            <h1 className="text-4xl font-bold sm:text-5xl">
              Every shell command,
              <br />
              <span className="text-primary">explained and explorable.</span>
            </h1>
            <p className="text-muted-foreground max-w-md text-lg">
              A fast, interactive catalogue of shell scripting — commands,
              flags, shortcuts, and concepts, all in one beautifully searchable
              place.
            </p>
            <div className="flex items-center gap-3">
              <Button
                size="lg"
                nativeButton={false}
                render={<Link href="/catalogue" />}
              >
                Browse the catalogue
                <ArrowRight className="size-4" aria-hidden="true" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                nativeButton={false}
                render={<Link href="/playground" />}
              >
                Try the playground
              </Button>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <TerminalWindow />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature) => (
            <div key={feature.title} className="rounded-lg border p-5">
              <feature.icon
                className="text-primary size-5"
                aria-hidden="true"
              />
              <h2 className="mt-3 text-sm font-semibold">{feature.title}</h2>
              <p className="text-muted-foreground mt-1.5 text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="mb-6 flex items-baseline justify-between">
            <h2 className="text-xl font-semibold">Browse by category</h2>
            <Link
              href="/catalogue"
              className="text-primary text-sm font-medium hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map(({ category, count }) => (
              <Link
                key={category}
                href={`/catalogue/${category}`}
                className={cn(
                  "flex items-center gap-2 rounded-full border border-foreground/15 px-4 py-2 text-sm transition-colors",
                  "hover:border-primary/50 hover:bg-accent/30",
                )}
              >
                <span className="font-medium">{category}</span>
                <Badge variant="secondary" className="text-xs">
                  {count}
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="mb-6 text-xl font-semibold">Featured commands</h2>
          <FeaturedCommands commands={featured} />
        </div>
      </section>
    </div>
  );
}
