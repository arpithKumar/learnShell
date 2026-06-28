"use client";

import { useEffect, useRef } from "react";
import { useLibraryStore } from "@/lib/library-store";

export function RecentTracker({ slug }: { slug: string }) {
  const addRecent = useLibraryStore((s) => s.addRecent);
  // React Strict Mode (on by default in Next.js dev) intentionally
  // mounts every component twice to surface non-idempotent effects —
  // without this guard, addRecent (and its view count) would double-fire
  // on every page load in development.
  const trackedSlugRef = useRef<string | null>(null);

  useEffect(() => {
    if (trackedSlugRef.current === slug) return;
    trackedSlugRef.current = slug;
    addRecent(slug);
  }, [slug, addRecent]);

  return null;
}
