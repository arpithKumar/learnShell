import { z } from "zod";
import { difficultySchema, exampleSchema } from "./schema";

export const conceptCategorySchema = z.enum([
  "fundamentals",
  "expansions-and-substitution",
  "control-flow",
  "io-and-pipelines",
  "process-control",
  "shell-environment",
]);

export const conceptFrontmatterSchema = z.object({
  slug: z.string(),
  title: z.string(),
  category: conceptCategorySchema,
  difficulty: difficultySchema,
  summary: z.string(),
  examples: z.array(exampleSchema).default([]),
  tips: z.array(z.string()).default([]),
  pitfalls: z.array(z.string()).default([]),
  funFacts: z.array(z.string()).default([]),
  relatedConcepts: z.array(z.string()).default([]),
  relatedCommands: z.array(z.string()).default([]),
});

export type ConceptCategory = z.infer<typeof conceptCategorySchema>;
export type ConceptFrontmatter = z.infer<typeof conceptFrontmatterSchema>;
export type ConceptEntry = ConceptFrontmatter & { body: string };
