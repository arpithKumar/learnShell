"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FolderTree, GitMerge, Keyboard, Save, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PlaygroundTerminal } from "@/components/playground-terminal";
import { usePlaygroundStore } from "@/lib/playground/store";
import {
  QUICKSTART_COMMANDS_EMPTY,
  QUICKSTART_COMMANDS_SAMPLE,
} from "@/lib/playground/quickstart";

const FEATURES = [
  {
    icon: Keyboard,
    title: "Tab autocomplete",
    description: "Completes commands, then files and directories, by path.",
  },
  {
    icon: GitMerge,
    title: "Real pipes & redirects",
    description:
      'cat file | grep error | wc -l, echo "x" > notes.txt — all work.',
  },
  {
    icon: Save,
    title: "Persists in this browser",
    description:
      "Close the tab, come back later — your session is still there.",
  },
];

type SupportedCommand = {
  name: string;
  description: string;
  hasEntry: boolean;
};

export function PlaygroundView({
  supportedCommands,
}: {
  supportedCommands: SupportedCommand[];
}) {
  const initialized = usePlaygroundStore((s) => s.initialized);
  const usingStarterFs = usePlaygroundStore((s) => s.usingStarterFs);
  const initialize = usePlaygroundStore((s) => s.initialize);
  const reset = usePlaygroundStore((s) => s.reset);
  const searchParams = useSearchParams();
  const initialCommand = searchParams.get("cmd") ?? undefined;
  const quickstart = usingStarterFs
    ? QUICKSTART_COMMANDS_SAMPLE
    : QUICKSTART_COMMANDS_EMPTY;

  if (!initialized) {
    return (
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <div className="space-y-5">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="flex items-start gap-3">
                <span className="bg-primary/10 flex size-9 shrink-0 items-center justify-center rounded-full">
                  <feature.icon
                    className="text-primary size-4"
                    aria-hidden="true"
                  />
                </span>
                <div>
                  <p className="text-sm font-medium">{feature.title}</p>
                  <p className="text-muted-foreground text-sm">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button onClick={() => initialize(true)} className="gap-2">
              <Sparkles className="size-4" aria-hidden="true" />
              Start with sample files
            </Button>
            <Button
              variant="outline"
              onClick={() => initialize(false)}
              className="gap-2"
            >
              <FolderTree className="size-4" aria-hidden="true" />
              Start empty
            </Button>
          </div>
          <p className="text-muted-foreground mt-3 text-xs">
            You can reset and switch between these any time.
          </p>
        </div>

        <div className="overflow-hidden rounded-xl border bg-card shadow-2xl shadow-primary/10">
          <div className="bg-muted/40 flex items-center gap-2 border-b px-4 py-2.5">
            <span className="size-2.5 rounded-full bg-red-400/70" />
            <span className="size-2.5 rounded-full bg-yellow-400/70" />
            <span className="size-2.5 rounded-full bg-green-400/70" />
            <span className="text-muted-foreground ml-2 text-xs">
              learnshell — playground
            </span>
          </div>
          <div className="space-y-2.5 px-5 py-5 font-mono text-sm leading-relaxed">
            <p>
              <span className="text-primary">/ $</span> ls
            </p>
            <p className="text-muted-foreground">
              README.md logs/ notes.txt package.json src/
            </p>
            <p>
              <span className="text-primary">/ $</span> cat logs/app.log | grep
              ERROR
            </p>
            <p className="text-muted-foreground">
              2024-01-01 10:02:13 ERROR disk full
              <br />
              2024-01-01 10:05:00 ERROR connection timeout
            </p>
            <p className="flex items-center gap-1">
              <span className="text-primary">/ $</span>
              <span className="bg-foreground/80 inline-block h-4 w-1.5 animate-pulse" />
            </p>
          </div>
        </div>

        <div className="col-span-full mt-4 border-t pt-10">
          <h2 className="text-sm font-semibold">Supported commands</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            A deliberately small subset — each one links back to its full
            catalogue entry.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {supportedCommands.map((cmd) => (
              <div key={cmd.name} className="rounded-lg border p-3.5">
                {cmd.hasEntry ? (
                  <Link
                    href={`/command/${cmd.name}`}
                    className="font-mono text-sm font-medium hover:text-primary"
                  >
                    {cmd.name}
                  </Link>
                ) : (
                  <span className="font-mono text-sm font-medium">
                    {cmd.name}
                  </span>
                )}
                {cmd.description && (
                  <p className="text-muted-foreground mt-1 text-xs">
                    {cmd.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_260px]">
      <div>
        <div className="mb-3 flex items-center justify-between">
          <p className="text-muted-foreground text-xs">
            State persists in this browser. Type{" "}
            <code className="bg-muted rounded px-1 py-0.5">help</code> to see
            available commands.
          </p>
          <Button variant="outline" size="sm" onClick={() => reset()}>
            Reset playground
          </Button>
        </div>
        <PlaygroundTerminal
          key={initialCommand ?? "default"}
          initialCommand={initialCommand}
        />

        <div className="mt-6">
          <h2 className="mb-3 text-sm font-semibold">
            Try it{" "}
            <span className="text-muted-foreground font-normal">
              ({usingStarterFs ? "sample files" : "starting from empty"})
            </span>
          </h2>
          <div className="flex flex-wrap gap-2">
            {quickstart.map((suggestion) => (
              <Link
                key={suggestion.cmd}
                href={`/playground?cmd=${encodeURIComponent(suggestion.cmd)}`}
                className="hover:border-primary/50 hover:bg-accent/30 rounded-full border border-foreground/15 px-3.5 py-1.5 text-sm transition-colors"
              >
                {suggestion.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <aside className="rounded-xl border p-5">
        <h2 className="text-sm font-semibold">Supported commands</h2>
        <p className="text-muted-foreground mt-1 text-xs">
          A deliberately small subset — these all link back to the full
          catalogue entry.
        </p>
        <div className="mt-3 space-y-2.5">
          {supportedCommands.map((cmd) =>
            cmd.hasEntry ? (
              <div key={cmd.name}>
                <Link
                  href={`/command/${cmd.name}`}
                  className="font-mono text-sm font-medium hover:text-primary"
                >
                  {cmd.name}
                </Link>
                {cmd.description && (
                  <p className="text-muted-foreground mt-0.5 text-xs">
                    {cmd.description}
                  </p>
                )}
              </div>
            ) : (
              <div key={cmd.name}>
                <span className="font-mono text-sm font-medium">
                  {cmd.name}
                </span>
                {cmd.description && (
                  <p className="text-muted-foreground mt-0.5 text-xs">
                    {cmd.description}
                  </p>
                )}
              </div>
            ),
          )}
        </div>
      </aside>
    </div>
  );
}
