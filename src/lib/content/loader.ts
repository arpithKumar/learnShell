import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { commandFrontmatterSchema, type CommandEntry } from "./schema";

const COMMANDS_DIR = path.join(process.cwd(), "content", "commands");

function readEntry(slug: string): CommandEntry {
  const filePath = path.join(COMMANDS_DIR, `${slug}.mdx`);
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const frontmatter = commandFrontmatterSchema.parse(data);
  return { ...frontmatter, body: content };
}

export function getAllCommandSlugs(): string[] {
  return fs
    .readdirSync(COMMANDS_DIR)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

export function getAllCommands(): CommandEntry[] {
  const commands = getAllCommandSlugs()
    .map(readEntry)
    .sort((a, b) => a.name.localeCompare(b.name));

  validateRelatedLinks(commands);

  return commands;
}

function validateRelatedLinks(commands: CommandEntry[]): void {
  const knownSlugs = new Set(commands.map((c) => c.slug));
  const errors: string[] = [];

  for (const command of commands) {
    for (const relatedSlug of command.related) {
      if (!knownSlugs.has(relatedSlug)) {
        errors.push(
          `"${command.slug}" lists "${relatedSlug}" as related, but content/commands/${relatedSlug}.mdx doesn't exist.`,
        );
      }
    }
  }

  if (errors.length > 0) {
    throw new Error(
      `Broken related-command links found:\n${errors.map((e) => `  - ${e}`).join("\n")}`,
    );
  }
}

export function getCommandBySlug(slug: string): CommandEntry | null {
  try {
    return readEntry(slug);
  } catch {
    return null;
  }
}

export function getCategoryCounts(): { category: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const command of getAllCommands()) {
    for (const category of command.category) {
      counts.set(category, (counts.get(category) ?? 0) + 1);
    }
  }
  return Array.from(counts, ([category, count]) => ({ category, count })).sort(
    (a, b) => b.count - a.count,
  );
}

const DIFFICULTY_ORDER = ["beginner", "intermediate", "advanced"] as const;

export function getDifficultyCounts(): { difficulty: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const command of getAllCommands()) {
    counts.set(command.difficulty, (counts.get(command.difficulty) ?? 0) + 1);
  }
  return DIFFICULTY_ORDER.filter((d) => counts.has(d)).map((difficulty) => ({
    difficulty,
    count: counts.get(difficulty) ?? 0,
  }));
}
