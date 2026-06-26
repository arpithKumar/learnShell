import type { Metadata } from "next";
import { getAllCommands } from "@/lib/content/loader";
import { BookmarksView } from "@/components/bookmarks-view";

export const metadata: Metadata = {
  title: "Your Bookmarks",
  robots: { index: false, follow: true },
};

export default function BookmarksPage() {
  const commands = getAllCommands();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Your bookmarks</h1>
        <p className="text-muted-foreground mt-2">
          A personal cheat sheet built from whatever you&apos;ve bookmarked
          across the catalogue.
        </p>
      </div>

      <BookmarksView commands={commands} />
    </div>
  );
}
