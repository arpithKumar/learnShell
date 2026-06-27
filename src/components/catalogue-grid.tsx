"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import Masonry from "react-masonry-css";
import { CommandCard } from "@/components/command-card";
import { FilterRow } from "@/components/filter-row";
import { isFeatured } from "@/lib/bento";
import { useQueryFilter } from "@/lib/use-query-filter";
import { DIFFICULTY_DOT_HEX } from "@/lib/difficulty";
import type { CommandEntry, Difficulty } from "@/lib/content/schema";

const MASONRY_BREAKPOINTS = { default: 4, 1024: 3, 640: 2, 0: 1 };

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

  return (
    <div>
      <div className="mb-8 space-y-3">
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
        <Masonry
          breakpointCols={MASONRY_BREAKPOINTS}
          className="-ml-4 flex w-auto"
          columnClassName="pl-4"
        >
          {filtered.map((cmd, i) => (
            <motion.div
              key={cmd.slug}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: i * 0.02 }}
              className="mb-4"
            >
              <CommandCard command={cmd} featured={isFeatured(i)} />
            </motion.div>
          ))}
        </Masonry>
      )}
    </div>
  );
}
