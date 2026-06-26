"use client";

import { startTour } from "@/lib/tour";

export function TourReplayButton() {
  return (
    <button
      type="button"
      onClick={() => startTour()}
      className="text-muted-foreground text-sm transition-colors hover:text-foreground"
    >
      Take a tour
    </button>
  );
}
