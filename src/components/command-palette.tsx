"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Fuse from "fuse.js";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useLibraryStore } from "@/lib/library-store";
import type { SearchableEntry } from "@/lib/content/search-index";

export function CommandPalette({ entries }: { entries: SearchableEntry[] }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  // Default to "Ctrl+K" (the SSR/first-paint value, so there's no hydration
  // mismatch) and correct it after mount once navigator.userAgent is
  // actually available — only macOS uses the ⌘ symbol.
  const [shortcutLabel, setShortcutLabel] = useState("Ctrl+K");
  const router = useRouter();

  useEffect(() => {
    // One-time client-only correction, not a subscription — navigator isn't
    // available during SSR, so this can't be computed any earlier without
    // causing a hydration mismatch between server and client markup.
    const isMac = /Mac|iPhone|iPad|iPod/.test(navigator.userAgent);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShortcutLabel(isMac ? "⌘K" : "Ctrl+K");
  }, []);

  const recents = useLibraryStore((s) => s.recents);
  const viewCounts = useLibraryStore((s) => s.viewCounts);

  const fuse = useMemo(
    () =>
      new Fuse(entries, {
        keys: ["name", "summary", "category"],
        threshold: 0.35,
      }),
    [entries],
  );

  const recentEntries = useMemo(
    () =>
      recents
        .map((slug) => entries.find((e) => e.slug === slug))
        .filter((e): e is SearchableEntry => e !== undefined),
    [recents, entries],
  );

  const results = query ? fuse.search(query).map((r) => r.item) : [];
  const commandResults = results.filter((e) => e.type === "command");
  const conceptResults = results.filter((e) => e.type === "concept");

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  function select(entry: SearchableEntry) {
    setOpen(false);
    setQuery("");
    router.push(
      entry.type === "concept"
        ? `/concepts/${entry.slug}`
        : `/command/${entry.slug}`,
    );
  }

  return (
    <>
      <Button
        id="tour-search"
        variant="ghost"
        size="icon"
        className="text-muted-foreground gap-2 sm:h-7 sm:w-64 sm:justify-start sm:rounded-lg sm:border sm:border-border sm:bg-background sm:px-2.5 dark:sm:border-input dark:sm:bg-input/30"
        onClick={() => setOpen(true)}
        aria-label="Search commands and concepts"
      >
        <Search className="size-4 shrink-0 sm:size-3.5" aria-hidden="true" />
        <span className="hidden sm:inline">Search…</span>
        <kbd className="bg-muted ml-auto hidden rounded px-1.5 py-0.5 text-xs sm:inline">
          {shortcutLabel}
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen} className="sm:max-w-xl">
        <CommandInput
          placeholder="Search commands, flags, concepts…"
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          {query ? (
            <CommandEmpty>No results found.</CommandEmpty>
          ) : (
            recentEntries.length === 0 && (
              <p className="text-muted-foreground px-3 py-6 text-center text-sm">
                Start typing to search, or open a command to see it here next
                time.
              </p>
            )
          )}
          {!query && recentEntries.length > 0 && (
            <CommandGroup heading="Recently viewed">
              {recentEntries.map((entry) => {
                const count = viewCounts[entry.slug] ?? 0;
                return (
                  <CommandItem
                    key={entry.slug}
                    value={entry.slug}
                    onSelect={() => select(entry)}
                  >
                    <span
                      className={
                        entry.type === "command" ? "font-mono" : undefined
                      }
                    >
                      {entry.name}
                    </span>
                    <span className="text-muted-foreground ml-2 truncate text-sm">
                      {entry.summary}
                    </span>
                    {count > 1 && (
                      <span className="text-muted-foreground ml-auto shrink-0 text-xs">
                        Viewed {count} times
                      </span>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          )}
          {commandResults.length > 0 && (
            <CommandGroup heading="Commands">
              {commandResults.map((entry) => (
                <CommandItem
                  key={entry.slug}
                  value={entry.slug}
                  onSelect={() => select(entry)}
                >
                  <span className="font-mono">{entry.name}</span>
                  <span className="text-muted-foreground ml-2 truncate text-sm">
                    {entry.summary}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
          {conceptResults.length > 0 && (
            <CommandGroup heading="Concepts">
              {conceptResults.map((entry) => (
                <CommandItem
                  key={entry.slug}
                  value={entry.slug}
                  onSelect={() => select(entry)}
                >
                  <span>{entry.name}</span>
                  <span className="text-muted-foreground ml-2 truncate text-sm">
                    {entry.summary}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
