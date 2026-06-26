"use client";

import { useEffect } from "react";
import { useLibraryStore } from "@/lib/library-store";

export function RecentTracker({ slug }: { slug: string }) {
  const addRecent = useLibraryStore((s) => s.addRecent);

  useEffect(() => {
    addRecent(slug);
  }, [slug, addRecent]);

  return null;
}
