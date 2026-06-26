"use client";

import Link from "next/link";
import {
  Archive,
  ArrowRight,
  Cpu,
  FileText,
  FolderTree,
  Gauge,
  Network,
  Package,
  ScanText,
  Shield,
  SquareCode,
  Terminal,
  Wifi,
} from "lucide-react";
import { useLibraryStore } from "@/lib/library-store";
import type { LearnTrack } from "@/lib/learn-tracks";

const TRACK_ICONS = {
  "bash-basics": Terminal,
  "text-processing-pro": ScanText,
  "systems-and-networking": Network,
  "shell-scripting-essentials": SquareCode,
  "process-and-job-control": Cpu,
  "system-monitoring": Gauge,
  "networking-toolkit": Wifi,
  "security-and-crypto": Shield,
  "filesystem-deep-dive": FolderTree,
  "archives-and-compression": Archive,
  "package-managers": Package,
  "advanced-text-tools": FileText,
} as const;

export function TrackCard({ track }: { track: LearnTrack }) {
  const visited = useLibraryStore((s) => s.visited);
  const visitedSet = new Set(visited);
  const completedCount = track.steps.filter((s) => visitedSet.has(s)).length;
  const total = track.steps.length;
  const percent = total > 0 ? (completedCount / total) * 100 : 0;
  const Icon = TRACK_ICONS[track.slug as keyof typeof TRACK_ICONS] ?? Terminal;

  return (
    <Link
      href={`/learn/${track.slug}`}
      className="group flex items-center gap-4 rounded-xl border p-5 outline-none transition-colors hover:border-primary/50 focus-visible:border-primary/50 focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <div className="bg-primary/10 flex size-12 shrink-0 items-center justify-center rounded-full">
        <Icon className="text-primary size-5" aria-hidden="true" />
      </div>

      <div className="flex-1">
        <h2 className="font-semibold">{track.title}</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          {track.description}
        </p>
        <div className="mt-3 flex items-center gap-3">
          <div className="bg-muted h-1.5 w-32 overflow-hidden rounded-full">
            <div
              className="bg-primary h-full rounded-full transition-all"
              style={{ width: `${percent}%` }}
            />
          </div>
          <span className="text-muted-foreground text-xs">
            {completedCount} / {total} visited
          </span>
        </div>
      </div>

      <ArrowRight
        className="text-muted-foreground size-5 shrink-0 transition-transform group-hover:translate-x-1 group-focus-visible:translate-x-1 group-hover:text-primary group-focus-visible:text-primary"
        aria-hidden="true"
      />
    </Link>
  );
}
