"use client";

import { useMemo, useState } from "react";
import { CopyButton } from "@/components/copy-button";
import { cn } from "@/lib/utils";
import type { Flag } from "@/lib/content/schema";

const SHORT_FLAG = /^-[a-zA-Z]$/;

function buildPreview(commandName: string, selected: Flag[]): string {
  if (selected.length === 0) return commandName;

  const shortFlags = selected.filter((f) => SHORT_FLAG.test(f.flag));
  const otherFlags = selected.filter((f) => !SHORT_FLAG.test(f.flag));

  const parts = [commandName];
  if (shortFlags.length > 0) {
    parts.push("-" + shortFlags.map((f) => f.flag.slice(1)).join(""));
  }
  for (const f of otherFlags) {
    parts.push(f.flag);
  }
  return parts.join(" ");
}

export function FlagExplorer({
  commandName,
  flags,
}: {
  commandName: string;
  flags: Flag[];
}) {
  const [selectedFlags, setSelectedFlags] = useState<string[]>([]);

  const selected = useMemo(
    () => flags.filter((f) => selectedFlags.includes(f.flag)),
    [flags, selectedFlags],
  );

  const preview = useMemo(
    () => buildPreview(commandName, selected),
    [commandName, selected],
  );

  function toggle(flag: string) {
    setSelectedFlags((prev) =>
      prev.includes(flag) ? prev.filter((f) => f !== flag) : [...prev, flag],
    );
  }

  return (
    <div>
      <div className="bg-card rounded-xl border p-5">
        <h2 className="text-sm font-semibold">Build a command</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Click flags to add them and watch the command update live.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {flags.map((f) => {
            const isSelected = selectedFlags.includes(f.flag);
            return (
              <button
                key={f.flag}
                type="button"
                onClick={() => toggle(f.flag)}
                className={cn(
                  "rounded-md border px-2.5 py-1 font-mono text-xs font-medium transition-colors",
                  isSelected
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-foreground/15 hover:border-primary/50 hover:bg-accent/30",
                )}
              >
                {f.flag}
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex items-start justify-between gap-3 rounded-lg border bg-muted/40 px-4 py-3">
          <code className="min-w-0 break-all font-mono text-sm">
            <span className="text-primary">$</span> {preview}
          </code>
          <CopyButton text={preview} />
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {flags.map((flag) => (
          <div
            key={flag.flag}
            className={cn(
              "bg-card rounded-lg border px-4 py-3 transition-colors",
              // An alpha-blended bg-primary/[x] here would let the page's dot
              // pattern show through, since this div has no opaque ancestor
              // of its own — color-mix against the (opaque) card color keeps
              // the tint fully solid instead.
              selectedFlags.includes(flag.flag) &&
                "border-primary/50 bg-[color-mix(in_oklch,var(--primary)_3%,var(--card))]",
            )}
          >
            <code className="font-mono font-semibold text-primary">
              {flag.flag}
            </code>
            <p className="text-muted-foreground mt-1 text-sm">
              {flag.description}
            </p>
            {flag.example && (
              <code className="mt-2 block rounded bg-muted px-2 py-1 text-xs">
                {flag.example}
              </code>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
