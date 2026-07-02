export type TaskRecommendation = {
  slug: string;
  task: string;
  recommended: string[]; // AIToolEntry slugs, in priority order (first = best fit)
  reasoning: string;
};

export const TASK_RECOMMENDATIONS: TaskRecommendation[] = [
  {
    slug: "large-refactors",
    task: "Large, multi-file refactors or autonomous feature work",
    recommended: ["claude-code", "gemini-cli"],
    reasoning:
      "Terminal-based agents that read your whole repo, keep a persistent CLAUDE.md/GEMINI.md context, and can run for many steps (edit → test → fix) without you babysitting every change.",
  },
  {
    slug: "in-editor-completions",
    task: "Fast, in-editor completions while you type",
    recommended: ["cursor", "github-copilot"],
    reasoning:
      "IDE-integrated tools shine at inline suggestions and small, in-context edits — you stay in the editor rather than switching to a terminal or chat window.",
  },
  {
    slug: "team-standards",
    task: "Team-wide standards enforced automatically",
    recommended: ["github-copilot", "cursor"],
    reasoning:
      "Both read repo-committed instruction files (copilot-instructions.md, .cursor/rules/) so every teammate's assistant follows the same conventions without manual setup per person.",
  },
  {
    slug: "quick-questions",
    task: "One-off code questions, explaining a snippet, brainstorming",
    recommended: ["chatgpt", "grok"],
    reasoning:
      "No repo access needed for these — a chat assistant with paste-in context is faster to reach for than opening a terminal agent for a five-minute question.",
  },
  {
    slug: "mcp-automation",
    task: "Custom automation with MCP-connected tools (databases, APIs, browsers)",
    recommended: ["claude-code", "cursor", "gemini-cli"],
    reasoning:
      "These three support MCP servers, so you can wire up project-specific tools (a database, an internal API, browser automation) that the agent can call directly during a coding session.",
  },
  {
    slug: "personal-automation",
    task: "Automating tasks outside the codebase — email, calendar, chat apps",
    recommended: ["openclaw", "hermes-agent"],
    reasoning:
      "Neither is a repo-aware coding agent — they're built for automating your broader digital life across chat platforms, a different job than the coding-focused tools in this list.",
  },
  {
    slug: "offline-private",
    task: "Fully offline or privacy-sensitive work — nothing leaves your machine",
    recommended: ["ollama"],
    reasoning:
      "Ollama runs models entirely locally, so code never gets sent to a hosted API. Pair it with a tool that supports a custom/local model endpoint (see its setup notes) rather than expecting Ollama alone to read your repo.",
  },
];
