"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, CheckCircle2, Compass } from "lucide-react";
import { useLibraryStore } from "@/lib/library-store";
import { LEARN_TRACKS } from "@/lib/learn-tracks";

export function LearnOverallStats({
  totalCatalogueCount,
}: {
  totalCatalogueCount: number;
}) {
  const visited = useLibraryStore((s) => s.visited);
  const visitedSet = new Set(visited);

  const tracksCompleted = LEARN_TRACKS.filter((t) =>
    t.steps.every((s) => visitedSet.has(s)),
  ).length;

  const stats = [
    {
      icon: Compass,
      label: "Commands explored",
      value: `${visited.length} / ${totalCatalogueCount}`,
    },
    {
      icon: CheckCircle2,
      label: "Tracks completed",
      value: `${tracksCompleted} / ${LEARN_TRACKS.length}`,
    },
    {
      icon: BookOpen,
      label: "Catalogue size",
      value: `${totalCatalogueCount} commands`,
    },
  ];

  return (
    <div className="mt-10 border-t pt-10">
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border p-5">
            <stat.icon className="text-primary size-5" aria-hidden="true" />
            <p className="mt-3 text-2xl font-semibold">{stat.value}</p>
            <p className="text-muted-foreground mt-1 text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      <Link
        href="/catalogue"
        className="group mt-4 flex items-center justify-between gap-4 rounded-xl border p-5 transition-colors hover:border-primary/50"
      >
        <div>
          <p className="font-medium">Looking for something specific?</p>
          <p className="text-muted-foreground mt-1 text-sm">
            Browse the full catalogue, filterable by category and difficulty.
          </p>
        </div>
        <ArrowRight
          className="text-muted-foreground size-5 shrink-0 transition-transform group-hover:translate-x-1 group-hover:text-primary"
          aria-hidden="true"
        />
      </Link>
    </div>
  );
}
