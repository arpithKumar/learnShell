import { z } from "zod";

export const shellSchema = z.enum(["posix", "bash", "zsh", "fish"]);

export const difficultySchema = z.enum(["beginner", "intermediate", "advanced"]);

export const flagSchema = z.object({
  flag: z.string(),
  description: z.string(),
  example: z.string().optional(),
});

export const exampleSchema = z.object({
  description: z.string(),
  input: z.string(),
  output: z.string().optional(),
});

export const shortcutSchema = z.object({
  keys: z.string(),
  description: z.string(),
  context: z.enum(["readline", "vi", "tmux"]),
});

export const commandFrontmatterSchema = z.object({
  slug: z.string(),
  name: z.string(),
  category: z.array(z.string()).min(1),
  difficulty: difficultySchema,
  shells: z.array(shellSchema).min(1),
  summary: z.string(),
  syntax: z.string(),
  flags: z.array(flagSchema).default([]),
  examples: z.array(exampleSchema).default([]),
  shortcuts: z.array(shortcutSchema).default([]),
  tips: z.array(z.string()).default([]),
  related: z.array(z.string()).default([]),
  pitfalls: z.array(z.string()).default([]),
});

export type Shell = z.infer<typeof shellSchema>;
export type Difficulty = z.infer<typeof difficultySchema>;
export type Flag = z.infer<typeof flagSchema>;
export type Example = z.infer<typeof exampleSchema>;
export type Shortcut = z.infer<typeof shortcutSchema>;
export type CommandFrontmatter = z.infer<typeof commandFrontmatterSchema>;

export type CommandEntry = CommandFrontmatter & {
  body: string;
};
