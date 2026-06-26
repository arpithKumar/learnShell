import { Suspense } from "react";
import type { Metadata } from "next";
import { ReadlineStage } from "@/components/readline-stage";
import { ShortcutsExplorer } from "@/components/shortcuts-explorer";
import { ShortcutsPageTour } from "@/components/shortcuts-page-tour";

export const metadata: Metadata = {
  title: "Keyboard Shortcuts",
  description:
    "Readline (Emacs-style) bindings every bash/zsh session already supports, plus vi mode and tmux.",
};

export default function ShortcutsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <ShortcutsPageTour />
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Keyboard shortcuts
        </h1>
        <p className="text-muted-foreground mt-2">
          The readline (Emacs-style) bindings every bash/zsh session already
          supports, plus vi mode and tmux — the muscle memory that makes a
          terminal fast to use.
        </p>
      </div>

      <div id="tour-readline-stage" className="mb-10">
        <ReadlineStage />
      </div>

      <Suspense fallback={null}>
        <ShortcutsExplorer />
      </Suspense>
    </div>
  );
}
