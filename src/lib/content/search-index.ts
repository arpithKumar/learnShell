import { getAllCommands } from "./loader";
import { getAllConcepts } from "./concept-loader";
import { AI_TOOLS } from "@/lib/content/ai-tools";

export type SearchableEntry = {
  slug: string;
  name: string;
  summary: string;
  category: string[];
  type: "command" | "concept" | "ai-tool";
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

  const aiTools: SearchableEntry[] = AI_TOOLS.map(
    ({ slug, name, summary, category }) => ({
      slug,
      name,
      summary,
      category: [category],
      type: "ai-tool",
    }),
  );

  return [...commands, ...concepts, ...aiTools];
}
