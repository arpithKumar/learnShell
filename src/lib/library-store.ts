import { create } from "zustand";
import { persist } from "zustand/middleware";

const MAX_RECENTS = 8;

type LibraryState = {
  bookmarks: string[];
  recents: string[];
  visited: string[];
  viewCounts: Record<string, number>;
  toggleBookmark: (slug: string) => void;
  addRecent: (slug: string) => void;
};

export const useLibraryStore = create<LibraryState>()(
  persist(
    (set) => ({
      bookmarks: [],
      recents: [],
      visited: [],
      viewCounts: {},
      toggleBookmark: (slug) =>
        set((state) => ({
          bookmarks: state.bookmarks.includes(slug)
            ? state.bookmarks.filter((s) => s !== slug)
            : [...state.bookmarks, slug],
        })),
      addRecent: (slug) =>
        set((state) => ({
          recents: [slug, ...state.recents.filter((s) => s !== slug)].slice(
            0,
            MAX_RECENTS,
          ),
          visited: state.visited.includes(slug)
            ? state.visited
            : [...state.visited, slug],
          viewCounts: {
            ...state.viewCounts,
            [slug]: (state.viewCounts[slug] ?? 0) + 1,
          },
        })),
    }),
    { name: "learnshell-library" },
  ),
);
