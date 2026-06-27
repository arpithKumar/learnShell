import type { Difficulty } from "@/lib/content/schema";

// Single source of truth for difficulty colors — used by the command/concept
// card corner dots, the concept graph, and the catalogue/concepts Level
// filter pills (which double as the legend for what each dot color means).
export const DIFFICULTY_DOT_HEX: Record<Difficulty, string> = {
  beginner: "#10b981",
  intermediate: "#f59e0b",
  advanced: "#f43f5e",
};

export const DIFFICULTY_DOT_CLASS: Record<Difficulty, string> = {
  beginner: "bg-emerald-500",
  intermediate: "bg-amber-500",
  advanced: "bg-rose-500",
};
