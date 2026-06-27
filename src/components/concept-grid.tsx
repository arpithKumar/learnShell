"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { ConceptCard } from "@/components/concept-card";
import { FilterRow } from "@/components/filter-row";
import { useQueryFilter } from "@/lib/use-query-filter";
import { DIFFICULTY_DOT_HEX } from "@/lib/difficulty";
import type { ConceptEntry } from "@/lib/content/concept-schema";
import type { Difficulty } from "@/lib/content/schema";

export function ConceptGrid({
  concepts,
  categories,
  difficulties,
}: {
  concepts: ConceptEntry[];
  categories: { category: string; count: number }[];
  difficulties: { difficulty: string; count: number }[];
}) {
  const [activeCategory, setActiveCategory] = useQueryFilter("category");
  const [activeDifficulty, setActiveDifficulty] = useQueryFilter("difficulty");

  const filtered = useMemo(
    () =>
      concepts.filter((c) => {
        if (activeCategory && c.category !== activeCategory) return false;
        if (activeDifficulty && c.difficulty !== activeDifficulty) return false;
        return true;
      }),
    [concepts, activeCategory, activeDifficulty],
  );

  const matchingDifficulty = useMemo(
    () =>
      activeDifficulty
        ? concepts.filter((c) => c.difficulty === activeDifficulty)
        : concepts,
    [concepts, activeDifficulty],
  );

  const matchingCategory = useMemo(
    () =>
      activeCategory
        ? concepts.filter((c) => c.category === activeCategory)
        : concepts,
    [concepts, activeCategory],
  );

  const categoryOptions = useMemo(() => {
    const counts = new Map<string, number>();
    for (const c of matchingDifficulty) {
      counts.set(c.category, (counts.get(c.category) ?? 0) + 1);
    }
    return categories.map(({ category }) => ({
      value: category,
      count: counts.get(category) ?? 0,
    }));
  }, [categories, matchingDifficulty]);

  const difficultyOptions = useMemo(() => {
    const counts = new Map<string, number>();
    for (const c of matchingCategory) {
      counts.set(c.difficulty, (counts.get(c.difficulty) ?? 0) + 1);
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
          No concepts match these filters yet.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((concept, i) => (
            <motion.div
              key={concept.slug}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: i * 0.02 }}
            >
              <ConceptCard concept={concept} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
