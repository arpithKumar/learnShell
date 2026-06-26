import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { conceptFrontmatterSchema, type ConceptEntry } from "./concept-schema";
import { getAllCommandSlugs } from "./loader";

const CONCEPTS_DIR = path.join(process.cwd(), "content", "concepts");

function readEntry(slug: string): ConceptEntry {
  const filePath = path.join(CONCEPTS_DIR, `${slug}.mdx`);
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const frontmatter = conceptFrontmatterSchema.parse(data);
  return { ...frontmatter, body: content };
}

export function getAllConceptSlugs(): string[] {
  return fs
    .readdirSync(CONCEPTS_DIR)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

export function getAllConcepts(): ConceptEntry[] {
  const concepts = getAllConceptSlugs()
    .map(readEntry)
    .sort((a, b) => a.title.localeCompare(b.title));

  validateConceptLinks(concepts);

  return concepts;
}

function validateConceptLinks(concepts: ConceptEntry[]): void {
  const knownConceptSlugs = new Set(concepts.map((c) => c.slug));
  const knownCommandSlugs = new Set(getAllCommandSlugs());
  const errors: string[] = [];

  for (const concept of concepts) {
    for (const relatedSlug of concept.relatedConcepts) {
      if (!knownConceptSlugs.has(relatedSlug)) {
        errors.push(
          `"${concept.slug}" lists concept "${relatedSlug}" as related, but content/concepts/${relatedSlug}.mdx doesn't exist.`,
        );
      }
    }
    for (const relatedSlug of concept.relatedCommands) {
      if (!knownCommandSlugs.has(relatedSlug)) {
        errors.push(
          `"${concept.slug}" lists command "${relatedSlug}" as related, but content/commands/${relatedSlug}.mdx doesn't exist.`,
        );
      }
    }
  }

  if (errors.length > 0) {
    throw new Error(
      `Broken concept related-links found:\n${errors.map((e) => `  - ${e}`).join("\n")}`,
    );
  }
}

export function getConceptBySlug(slug: string): ConceptEntry | null {
  try {
    return readEntry(slug);
  } catch {
    return null;
  }
}

export function getConceptCategoryCounts(): {
  category: string;
  count: number;
}[] {
  const counts = new Map<string, number>();
  for (const concept of getAllConcepts()) {
    counts.set(concept.category, (counts.get(concept.category) ?? 0) + 1);
  }
  return Array.from(counts, ([category, count]) => ({ category, count }));
}

const DIFFICULTY_ORDER = ["beginner", "intermediate", "advanced"] as const;

export function getConceptDifficultyCounts(): {
  difficulty: string;
  count: number;
}[] {
  const counts = new Map<string, number>();
  for (const concept of getAllConcepts()) {
    counts.set(concept.difficulty, (counts.get(concept.difficulty) ?? 0) + 1);
  }
  return DIFFICULTY_ORDER.filter((d) => counts.has(d)).map((difficulty) => ({
    difficulty,
    count: counts.get(difficulty) ?? 0,
  }));
}
