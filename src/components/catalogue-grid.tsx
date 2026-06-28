"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { CommandCard } from "@/components/command-card";
import { FilterRow } from "@/components/filter-row";
import { useQueryFilter } from "@/lib/use-query-filter";
import { DIFFICULTY_DOT_HEX } from "@/lib/difficulty";
import type { CommandEntry, Difficulty } from "@/lib/content/schema";

export function CatalogueGrid({
  commands,
  categories,
  difficulties,
  initialCategory,
}: {
  commands: CommandEntry[];
  categories: { category: string; count: number }[];
  difficulties: { difficulty: string; count: number }[];
  initialCategory?: string;
}) {
  const [activeCategory, setActiveCategory] = useQueryFilter(
    "category",
    initialCategory ?? null,
  );
  const [activeDifficulty, setActiveDifficulty] = useQueryFilter("difficulty");

  const filtered = useMemo(
    () =>
      commands.filter((cmd) => {
        if (activeCategory && !cmd.category.includes(activeCategory))
          return false;
        if (activeDifficulty && cmd.difficulty !== activeDifficulty)
          return false;
        return true;
      }),
    [commands, activeCategory, activeDifficulty],
  );

  const matchingDifficulty = useMemo(
    () =>
      activeDifficulty
        ? commands.filter((cmd) => cmd.difficulty === activeDifficulty)
        : commands,
    [commands, activeDifficulty],
  );

  const matchingCategory = useMemo(
    () =>
      activeCategory
        ? commands.filter((cmd) => cmd.category.includes(activeCategory))
        : commands,
    [commands, activeCategory],
  );

  const categoryOptions = useMemo(() => {
    const counts = new Map<string, number>();
    for (const cmd of matchingDifficulty) {
      for (const category of cmd.category) {
        counts.set(category, (counts.get(category) ?? 0) + 1);
      }
    }
    return categories.map(({ category }) => ({
      value: category,
      count: counts.get(category) ?? 0,
    }));
  }, [categories, matchingDifficulty]);

  const difficultyOptions = useMemo(() => {
    const counts = new Map<string, number>();
    for (const cmd of matchingCategory) {
      counts.set(cmd.difficulty, (counts.get(cmd.difficulty) ?? 0) + 1);
    }
    return difficulties.map(({ difficulty }) => ({
      value: difficulty,
      count: counts.get(difficulty) ?? 0,
      dotColor: DIFFICULTY_DOT_HEX[difficulty as Difficulty],
    }));
  }, [difficulties, matchingCategory]);

  // Only worth carving out a featured row if there's a meaningful "rest of
  // the list" left below it — otherwise it's just the same 1-3 cards twice.
  const FEATURED_COUNT = 3;
  const showFeatured = filtered.length > FEATURED_COUNT;
  const featuredCommands = showFeatured
    ? filtered.slice(0, FEATURED_COUNT)
    : [];
  const restCommands = showFeatured ? filtered.slice(FEATURED_COUNT) : filtered;

  return (
    <div className="lg:grid lg:grid-cols-[220px_1fr] lg:items-start lg:gap-8">
      <aside className="bg-background hidden lg:sticky lg:top-[4.5rem] lg:block lg:max-h-[calc(100vh-5.5rem)] lg:space-y-6 lg:overflow-y-auto lg:pb-8">
        <FilterRow
          label="Category"
          orientation="vertical"
          options={categoryOptions}
          active={activeCategory}
          onSelect={setActiveCategory}
          totalCount={matchingDifficulty.length}
        />
        <FilterRow
          label="Level"
          orientation="vertical"
          options={difficultyOptions}
          active={activeDifficulty}
          onSelect={setActiveDifficulty}
          totalCount={matchingCategory.length}
        />
      </aside>

      <div>
        <div className="mb-8 space-y-3 lg:hidden">
          <FilterRow
            label="Category"
            options={categoryOptions}
            active={activeCategory}
            onSelect={setActiveCategory}
            totalCount={matchingDifficulty.length}
          />
          <FilterRow
            label="Level"
            options={difficultyOptions}
            active={activeDifficulty}
            onSelect={setActiveDifficulty}
            totalCount={matchingCategory.length}
          />
        </div>

        {filtered.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No commands match these filters yet.
          </p>
        ) : (
          <>
            {showFeatured && (
              <div className="mb-8 grid gap-4 sm:grid-cols-3">
                {featuredCommands.map((cmd, i) => (
                  <motion.div
                    key={cmd.slug}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: i * 0.02 }}
                  >
                    <CommandCard command={cmd} featured />
                  </motion.div>
                ))}
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
              {restCommands.map((cmd, i) => (
                <motion.div
                  key={cmd.slug}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.02 }}
                >
                  <CommandCard command={cmd} />
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
