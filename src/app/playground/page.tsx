import { Suspense } from "react";
import type { Metadata } from "next";
import { PlaygroundView } from "@/components/playground-view";
import { COMMANDS } from "@/lib/playground/commands";
import { getCommandBySlug } from "@/lib/content/loader";
import { FALLBACK_DESCRIPTIONS } from "@/lib/playground/quickstart";

export const metadata: Metadata = {
  title: "Playground",
  description:
    "A simulated shell — practice commands from the catalogue against a fake filesystem, right in your browser.",
};

function getSupportedCommands() {
  return Object.keys(COMMANDS)
    .sort()
    .map((name) => {
      const entry = getCommandBySlug(name);
      return {
        name,
        description: entry?.summary ?? FALLBACK_DESCRIPTIONS[name] ?? "",
        hasEntry: entry !== null,
      };
    });
}

export default function PlaygroundPage() {
  const supportedCommands = getSupportedCommands();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Playground</h1>
        <p className="text-muted-foreground mt-2">
          A simulated shell — practice the commands from the catalogue against a
          fake filesystem, right in your browser.
        </p>
      </div>

      <Suspense>
        <PlaygroundView supportedCommands={supportedCommands} />
      </Suspense>
    </div>
  );
}
