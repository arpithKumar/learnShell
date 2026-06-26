"use client";

import { useLibraryStore } from "@/lib/library-store";

export function TrackProgressBar({ slugs }: { slugs: string[] }) {
  const visited = useLibraryStore((s) => s.visited);
  const visitedSet = new Set(visited);
  const completedCount = slugs.filter((s) => visitedSet.has(s)).length;
  const total = slugs.length;
  const percent = total > 0 ? (completedCount / total) * 100 : 0;
  const done = completedCount === total && total > 0;

  return (
    <div className="mt-6 flex items-center gap-3">
      <div className="bg-muted h-2 w-full max-w-xs overflow-hidden rounded-full">
        <div
          className="bg-primary h-full rounded-full transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="text-muted-foreground shrink-0 text-sm">
        {done ? "Track complete" : `${completedCount} / ${total} visited`}
      </span>
    </div>
  );
}
