import { getAllCommands } from "./loader";
import { getAllConcepts } from "./concept-loader";

export type SearchableEntry = {
  slug: string;
  name: string;
  summary: string;
  category: string[];
  type: "command" | "concept";
};

export function buildSearchIndex(): SearchableEntry[] {
  const commands: SearchableEntry[] = getAllCommands().map(
    ({ slug, name, summary, category }) => ({
      slug,
      name,
      summary,
      category,
      type: "command",
    }),
  );

  const concepts: SearchableEntry[] = getAllConcepts().map(
    ({ slug, title, summary, category }) => ({
      slug,
      name: title,
      summary,
      category: [category],
      type: "concept",
    }),
  );

  return [...commands, ...concepts];
}
