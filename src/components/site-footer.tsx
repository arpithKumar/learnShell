import Link from "next/link";
import { Terminal } from "lucide-react";
import { TourReplayButton } from "@/components/tour-replay-button";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-6 sm:flex-row sm:justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-semibold"
        >
          <Terminal className="brand-glow-icon size-4" aria-hidden="true" />
          <span className="brand-glow-text">
            learn<span className="brand-glow-text-dim">shell</span>
          </span>
        </Link>

        <div className="flex items-center gap-5">
          <p className="text-muted-foreground text-sm">
            © {year} learnshell. All rights reserved.
          </p>
          <TourReplayButton />
        </div>
      </div>
    </footer>
  );
}
