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
import type { SearchableEntry } from "@/lib/content/search-index";

export function CommandPalette({ entries }: { entries: SearchableEntry[] }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  const fuse = useMemo(
    () =>
      new Fuse(entries, {
        keys: ["name", "summary", "category"],
        threshold: 0.35,
      }),
    [entries],
  );

  const results = query
    ? fuse.search(query).map((r) => r.item)
    : entries.slice(0, 8);

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
        variant="outline"
        size="sm"
        className="text-muted-foreground gap-2"
        onClick={() => setOpen(true)}
        aria-label="Search commands and concepts"
      >
        <Search className="size-3.5" aria-hidden="true" />
        <span className="hidden sm:inline">Search…</span>
        <kbd className="bg-muted ml-2 hidden rounded px-1.5 py-0.5 text-xs sm:inline">
          ⌘K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search commands, flags, concepts…"
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
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
