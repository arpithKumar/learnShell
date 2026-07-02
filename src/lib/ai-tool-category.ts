import { Bot, MessageCircle, Server, SquareCode, Terminal } from "lucide-react";
import type { AIToolCategory } from "@/lib/content/ai-tools";

// Single source of truth for category colors/icons — used by the tab
// pills, the detail card header, and the comparison table's category
// column, the same "one dot color = one meaning, reused everywhere" idiom
// difficulty.ts already establishes for commands/concepts.
export const CATEGORY_LABEL: Record<AIToolCategory, string> = {
  "cli-agent": "CLI agent",
  "ide-integrated": "IDE-integrated",
  "chat-assistant": "Chat assistant",
  "personal-assistant": "Personal assistant",
  "local-runtime": "Local runtime",
};

export const CATEGORY_DOT_CLASS: Record<AIToolCategory, string> = {
  "cli-agent": "bg-indigo-500",
  "ide-integrated": "bg-sky-500",
  "chat-assistant": "bg-amber-500",
  "personal-assistant": "bg-rose-500",
  "local-runtime": "bg-teal-500",
};

export const CATEGORY_TEXT_CLASS: Record<AIToolCategory, string> = {
  "cli-agent": "text-indigo-600 dark:text-indigo-400",
  "ide-integrated": "text-sky-600 dark:text-sky-400",
  "chat-assistant": "text-amber-600 dark:text-amber-400",
  "personal-assistant": "text-rose-600 dark:text-rose-400",
  "local-runtime": "text-teal-600 dark:text-teal-400",
};

export const CATEGORY_ICON: Record<AIToolCategory, typeof Terminal> = {
  "cli-agent": Terminal,
  "ide-integrated": SquareCode,
  "chat-assistant": MessageCircle,
  "personal-assistant": Bot,
  "local-runtime": Server,
};
