"use client";

import { Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLibraryStore } from "@/lib/library-store";
import { cn } from "@/lib/utils";

export function BookmarkButton({ slug }: { slug: string }) {
  const bookmarks = useLibraryStore((s) => s.bookmarks);
  const toggleBookmark = useLibraryStore((s) => s.toggleBookmark);
  const isBookmarked = bookmarks.includes(slug);

  return (
    <Button
      id="tour-bookmark"
      variant="outline"
      size="sm"
      onClick={() => toggleBookmark(slug)}
      className="gap-1.5"
      suppressHydrationWarning
    >
      <Bookmark
        className={cn("size-3.5", isBookmarked && "fill-primary text-primary")}
        aria-hidden="true"
      />
      {isBookmarked ? "Bookmarked" : "Bookmark"}
    </Button>
  );
}
