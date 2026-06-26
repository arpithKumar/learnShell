"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Bookmark } from "lucide-react";
import Masonry from "react-masonry-css";
import { CommandCard } from "@/components/command-card";
import { CopyButton } from "@/components/copy-button";
import { useLibraryStore } from "@/lib/library-store";
import { buildCheatSheetMarkdown } from "@/lib/cheat-sheet";
import type { CommandEntry } from "@/lib/content/schema";

const MASONRY_BREAKPOINTS = { default: 3, 1024: 2, 0: 1 };

export function BookmarksView({ commands }: { commands: CommandEntry[] }) {
  const bookmarks = useLibraryStore((s) => s.bookmarks);

  const bookmarkedCommands = useMemo(
    () => commands.filter((c) => bookmarks.includes(c.slug)),
    [commands, bookmarks],
  );

  const cheatSheet = useMemo(
    () => buildCheatSheetMarkdown(bookmarkedCommands),
    [bookmarkedCommands],
  );

  if (bookmarkedCommands.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border py-20 text-center">
        <Bookmark className="text-muted-foreground size-8" aria-hidden="true" />
        <p className="text-muted-foreground max-w-sm text-sm">
          You haven&apos;t bookmarked anything yet. Browse the{" "}
          <Link href="/catalogue" className="text-primary hover:underline">
            catalogue
          </Link>{" "}
          and click Bookmark on any command to save it here.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-3 rounded-lg border bg-muted/40 px-4 py-3">
        <p className="text-muted-foreground text-sm">
          {bookmarkedCommands.length} command
          {bookmarkedCommands.length === 1 ? "" : "s"} saved
        </p>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-xs">
            Copy as a Markdown cheat sheet
          </span>
          <CopyButton text={cheatSheet} />
        </div>
      </div>

      <Masonry
        breakpointCols={MASONRY_BREAKPOINTS}
        className="-ml-4 flex w-auto"
        columnClassName="pl-4"
      >
        {bookmarkedCommands.map((cmd) => (
          <div key={cmd.slug} className="mb-4">
            <CommandCard command={cmd} />
          </div>
        ))}
      </Masonry>
    </div>
  );
}
