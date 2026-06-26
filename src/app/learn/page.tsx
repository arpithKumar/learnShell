import type { Metadata } from "next";
import { LEARN_TRACKS } from "@/lib/learn-tracks";
import { TrackCard } from "@/components/track-card";
import { LearnOverallStats } from "@/components/learn-overall-stats";
import { getAllCommands } from "@/lib/content/loader";

export const metadata: Metadata = {
  title: "Learning Tracks",
  description:
    "Curated paths through the catalogue — work through a track in order, or jump around.",
};

export default function LearnPage() {
  const totalCatalogueCount = getAllCommands().length;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Learning tracks</h1>
        <p className="text-muted-foreground mt-2">
          Curated paths through the catalogue — work through a track in order,
          or jump around. Progress is tracked locally as you visit each command.
        </p>
      </div>

      <div className="space-y-4">
        {LEARN_TRACKS.map((track) => (
          <TrackCard key={track.slug} track={track} />
        ))}
      </div>

      <LearnOverallStats totalCatalogueCount={totalCatalogueCount} />
    </div>
  );
}
