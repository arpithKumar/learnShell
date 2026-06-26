import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { LEARN_TRACKS, getTrackBySlug } from "@/lib/learn-tracks";
import { getCommandBySlug } from "@/lib/content/loader";
import { LearningPath } from "@/components/learning-path";
import { TrackProgressBar } from "@/components/track-progress-bar";

export function generateStaticParams() {
  return LEARN_TRACKS.map((t) => ({ track: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ track: string }>;
}): Promise<Metadata> {
  const { track: trackSlug } = await params;
  const track = getTrackBySlug(trackSlug);

  if (!track) return {};

  return {
    title: track.title,
    description: track.description,
    openGraph: { title: track.title, description: track.description },
  };
}

export default async function LearnTrackPage({
  params,
}: {
  params: Promise<{ track: string }>;
}) {
  const { track: trackSlug } = await params;
  const track = getTrackBySlug(trackSlug);

  if (!track) {
    notFound();
  }

  const steps = track.steps
    .map((slug) => getCommandBySlug(slug))
    .filter((c): c is NonNullable<typeof c> => c !== null)
    .map((c) => ({ slug: c.slug, name: c.name, summary: c.summary }));

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <Link
        href="/learn"
        className="text-muted-foreground mb-6 inline-flex items-center gap-1.5 text-sm hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" aria-hidden="true" />
        All tracks
      </Link>

      <h1 className="text-3xl font-bold tracking-tight">{track.title}</h1>
      <p className="text-muted-foreground mt-2 max-w-xl">{track.description}</p>
      <TrackProgressBar slugs={track.steps} />

      <div className="mt-12">
        <LearningPath steps={steps} />
      </div>
    </div>
  );
}
