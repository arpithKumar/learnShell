"use client";

import Link from "next/link";
import { Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useLibraryStore } from "@/lib/library-store";
import type { SearchableEntry } from "@/lib/content/search-index";

function EntryList({
  slugs,
  entries,
  emptyText,
}: {
  slugs: string[];
  entries: SearchableEntry[];
  emptyText: string;
}) {
  const resolved = slugs
    .map((slug) => entries.find((e) => e.slug === slug))
    .filter((e): e is SearchableEntry => e !== undefined);

  if (resolved.length === 0) {
    return (
      <p className="text-muted-foreground px-1 py-1.5 text-xs">{emptyText}</p>
    );
  }

  return (
    <div className="space-y-0.5">
      {resolved.map((entry) => (
        <Link
          key={entry.slug}
          href={`/command/${entry.slug}`}
          className="hover:bg-accent/60 flex items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors"
        >
          <span className="font-mono">{entry.name}</span>
        </Link>
      ))}
    </div>
  );
}

export function LibraryPopover({ entries }: { entries: SearchableEntry[] }) {
  const bookmarks = useLibraryStore((s) => s.bookmarks);

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            id="tour-library"
            variant="ghost"
            size="icon"
            aria-label="Bookmarks"
            suppressHydrationWarning
          />
        }
      >
        <Bookmark
          className={bookmarks.length > 0 ? "text-primary size-4" : "size-4"}
          aria-hidden="true"
        />
      </PopoverTrigger>
      <PopoverContent align="end" className="w-64">
        <div>
          <h3 className="px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Bookmarked
          </h3>
          <div className="mt-1">
            <EntryList
              slugs={bookmarks}
              entries={entries}
              emptyText="Nothing bookmarked yet."
            />
          </div>
        </div>
        <div className="mt-2 border-t pt-2">
          <Link
            href="/bookmarks"
            className="hover:bg-accent/60 block rounded-md px-2 py-1.5 text-center text-xs font-medium transition-colors"
          >
            View all bookmarks →
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}
