export type AIToolCategory =
  | "cli-agent"
  | "ide-integrated"
  | "chat-assistant"
  | "personal-assistant"
  | "local-runtime";

export type AIToolEntry = {
  slug: string;
  name: string;
  category: AIToolCategory;
  website: string;
  summary: string;
  configFiles: { path: string; description: string }[];
  recommendedStructure?: string;
  // For tools with no project-level config file (configFiles is empty) —
  // how they're actually set up/configured instead (onboarding flow,
  // account settings, skill marketplace, etc.).
  setupNotes?: { label: string; description: string }[];
  // Only populated for CLI-shaped tools where "how do I install this"
  // varies meaningfully by platform/package manager.
  installMethods?: { label: string; command: string }[];
  // Only populated for CLI-shaped tools with their own subcommands worth
  // knowing at a glance (distinct from configFiles/setupNotes, which cover
  // project-level config rather than day-to-day CLI usage).
  commonCommands?: { command: string; description: string }[];
  features: string[];
  bestPractices: string[];
  caveat?: string;
};

export const AI_TOOLS: AIToolEntry[] = [
  {
    slug: "claude-code",
    name: "Claude Code",
    category: "cli-agent",
    website: "https://claude.com/product/claude-code",
    summary:
      "Anthropic's terminal-based coding agent. Reads project-level instructions automatically at session start and can be extended with custom commands, subagents, and MCP servers.",
    configFiles: [
      {
        path: "CLAUDE.md",
        description:
          "Project-level instructions loaded into every session automatically — conventions, architecture notes, commands to run, things to avoid.",
      },
      {
        path: "AGENTS.md",
        description:
          "Cross-tool convention (also read by other agents like Codex). CLAUDE.md can simply `@import` this file so you only maintain one source of truth.",
      },
      {
        path: ".claude/settings.json",
        description:
          "Project settings: permissions, hooks, environment variables — checked into the repo and shared with the team.",
      },
      {
        path: ".claude/commands/*.md",
        description:
          "Custom slash commands scoped to the project, invoked with /command-name.",
      },
      {
        path: ".claude/agents/*.md",
        description:
          "Subagent definitions — specialized agents with their own system prompt and tool access.",
      },
      {
        path: ".mcp.json",
        description:
          "Model Context Protocol server configuration, shared across the team via the repo.",
      },
    ],
    recommendedStructure: `.
├── CLAUDE.md
├── AGENTS.md
├── .mcp.json
└── .claude/
    ├── settings.json
    ├── commands/
    │   └── deploy.md
    └── agents/
        └── code-reviewer.md`,
    features: ["MCP support", "Subagents", "Hooks", "Custom slash commands"],
    bestPractices: [
      "Keep CLAUDE.md focused on what can't be derived from reading the code — conventions, commands, and constraints, not a restated file tree.",
      "Commit .claude/settings.json so the whole team shares the same permissions and hooks instead of each person configuring it locally.",
      "Use subagents for isolated, well-scoped subtasks (e.g. code review, exploration) rather than cramming everything into one long-running session.",
    ],
  },
  {
    slug: "gemini-cli",
    name: "Gemini CLI",
    category: "cli-agent",
    website: "https://github.com/google-gemini/gemini-cli",
    summary:
      "Google's open-source terminal AI agent. Reads a project-level Markdown file for context and supports extensions for additional tools.",
    configFiles: [
      {
        path: "GEMINI.md",
        description:
          "Project-level instructions file, analogous to CLAUDE.md — conventions, context, and standing instructions for the session.",
      },
      {
        path: ".gemini/settings.json",
        description:
          "Project or user-level settings, including MCP server definitions and tool permissions.",
      },
    ],
    recommendedStructure: `.
├── GEMINI.md
└── .gemini/
    └── settings.json`,
    features: ["MCP support", "Extensions", "Web search"],
    bestPractices: [
      "Keep GEMINI.md close in spirit to a README for the agent — short, current, and focused on what a new contributor (human or AI) wouldn't already know.",
      "Use .gemini/settings.json at the project level for anything the whole team should share, and user-level settings for personal preferences only.",
    ],
  },
  {
    slug: "cursor",
    name: "Cursor",
    category: "ide-integrated",
    website: "https://cursor.com",
    summary:
      "AI-native IDE (a VS Code fork) with project rules that scope instructions to specific paths or file types, plus MCP support.",
    configFiles: [
      {
        path: ".cursor/rules/*.mdc",
        description:
          "Project rules — Markdown files with metadata that can scope instructions to specific globs (e.g. only *.tsx files), the modern replacement for a single flat rules file.",
      },
      {
        path: ".cursorrules",
        description:
          "Legacy single-file project instructions format. Still read for backward compatibility, but new projects should prefer .cursor/rules/.",
      },
      {
        path: ".cursor/mcp.json",
        description: "MCP server configuration for the project.",
      },
    ],
    recommendedStructure: `.
└── .cursor/
    ├── mcp.json
    └── rules/
        ├── general.mdc
        └── frontend.mdc`,
    features: ["MCP support", "Path-scoped rules", "IDE-integrated"],
    bestPractices: [
      "Split rules by concern (e.g. general.mdc, frontend.mdc, testing.mdc) with glob scoping instead of one large file — the agent only loads what's relevant to the files it's touching.",
      "Migrate off .cursorrules to .cursor/rules/ for new projects; the flat file doesn't support path scoping.",
    ],
  },
  {
    slug: "github-copilot",
    name: "GitHub Copilot",
    category: "ide-integrated",
    website: "https://github.com/features/copilot",
    summary:
      "IDE-integrated assistant (VS Code, JetBrains, etc.) with repo-level custom instructions and path-scoped instruction files.",
    configFiles: [
      {
        path: ".github/copilot-instructions.md",
        description:
          "Repository-wide custom instructions, automatically included in every Copilot Chat request for the repo.",
      },
      {
        path: ".github/instructions/*.instructions.md",
        description:
          "Path-scoped instruction files (via frontmatter applyTo glob) — narrower instructions for specific directories or file types.",
      },
    ],
    recommendedStructure: `.
└── .github/
    ├── copilot-instructions.md
    └── instructions/
        └── tests.instructions.md`,
    features: ["IDE-integrated", "Path-scoped instructions"],
    bestPractices: [
      "Keep copilot-instructions.md short — it's injected into every request, so verbose instructions add cost and dilution to unrelated queries.",
      "Push anything specific to one part of the codebase (e.g. test conventions) into a scoped .instructions.md file rather than the repo-wide one.",
    ],
  },
  {
    slug: "chatgpt",
    name: "ChatGPT",
    category: "chat-assistant",
    website: "https://chatgpt.com",
    summary:
      "OpenAI's general chat assistant. Unlike terminal/IDE coding agents, it doesn't read files from your repository — context comes from what you paste into the conversation or account-level settings.",
    configFiles: [],
    features: ["Custom instructions", "Memory", "Web browsing"],
    bestPractices: [
      "Use account-level Custom Instructions for standing preferences (tone, stack, output format) instead of repeating them in every conversation.",
      "Since it can't read your repo directly, paste in the minimum relevant context (the function, the error, the schema) rather than describing the codebase from memory.",
    ],
    caveat:
      "ChatGPT doesn't have a standardized repo-level config file the way terminal/IDE agents do — it works from conversation context and account-level custom instructions. (If you're using OpenAI's Codex CLI/agent specifically, that does read an AGENTS.md file, same convention as Claude Code's.)",
  },
  {
    slug: "grok",
    name: "Grok",
    category: "chat-assistant",
    website: "https://x.ai/grok",
    summary:
      "xAI's chat assistant, available standalone at grok.com, inside the X app, and as an API for developers. Like ChatGPT, the chat product works from conversation context rather than reading project files — its standout feature is live access to real-time data (X posts, current events, search) while reasoning, which general-purpose chat assistants without web access don't have.",
    configFiles: [],
    setupNotes: [
      {
        label: "Custom instructions",
        description:
          "Account-level personalization (tone, background, standing preferences) in grok.com/X settings, the same idea as ChatGPT's Custom Instructions.",
      },
      {
        label: "xAI API",
        description:
          "Developers can call Grok models directly via xAI's API — this is how Grok ends up powering repo-aware coding tools (e.g. as a selectable model backend in a third-party IDE or agent) rather than the chat product itself reading your project.",
      },
    ],
    features: [
      "Real-time data access",
      "Conversation memory",
      "Custom instructions",
      "Developer API",
    ],
    bestPractices: [
      "Treat it the same way as any chat-based assistant without repo access: give it self-contained context in the prompt rather than assuming it can see your project.",
      "Use account-level custom instructions for standing preferences (stack, tone, output format) instead of repeating them every conversation.",
      "If you want Grok acting as a repo-aware coding agent rather than a chat assistant, look for a tool that lets you plug in a Grok model via the xAI API, rather than pasting code into the chat UI.",
    ],
    caveat:
      "As of writing, Grok's own chat product doesn't have a publicly standardized repo-level config file convention — it's primarily a conversational tool rather than a repo-aware agent. Check xAI's current docs, since this is an area that moves fast.",
  },
  {
    slug: "openclaw",
    name: "OpenClaw",
    category: "personal-assistant",
    website: "https://openclaw.ai",
    summary:
      "A personal AI assistant framework that runs locally on your own machine (Mac, Windows, Linux) and connects to chat apps you already use (WhatsApp, Telegram, Discord, Slack, Signal, iMessage, and others). Broader than a coding tool — it's built to automate tasks across your whole digital life, not a specific project: reading/writing files, running shell commands, controlling apps, and automating the browser (filling forms, extracting data, navigating sites) on your behalf.",
    configFiles: [],
    setupNotes: [
      {
        label: "openclaw onboard",
        description:
          "CLI setup wizard that walks you through connecting your chat platforms and message channels.",
      },
      {
        label: "Chat-based skill creation",
        description:
          "Describe an automation you want in natural language and it builds a custom skill for you, rather than writing config by hand.",
      },
      {
        label: "ClawHub",
        description:
          "A marketplace for installing community-built skills instead of building every automation from scratch.",
      },
    ],
    features: [
      "Multi-platform chat",
      "Persistent memory",
      "Browser automation",
      "System/shell access",
      "Custom skills",
      "Integrates with Gmail, GitHub, Obsidian",
    ],
    bestPractices: [
      "Since it isn't scoped to a single repo, keep instructions task-oriented (\"check my GitHub notifications every morning\") rather than expecting it to infer project conventions the way a repo-aware coding agent does.",
      "Use its skill/plugin system for repeatable automations instead of re-explaining the same multi-step task in chat each time.",
      "It has real system access (files, shell, apps) — review what a community ClawHub skill actually does before installing it, the same way you'd review a browser extension's permissions.",
    ],
    caveat:
      "OpenClaw doesn't read a project-level config file — it's a general-purpose personal assistant configured via onboarding and chat-described skills, not a repo-aware coding agent. No confirmed MCP support as of writing.",
  },
  {
    slug: "hermes-agent",
    name: "Hermes Agent",
    category: "personal-assistant",
    website: "https://hermes-agent.nousresearch.com",
    summary:
      "An open-source (MIT-licensed) general-purpose AI agent by Nous Research that operates across chat platforms (Telegram, Discord, Slack, WhatsApp, Signal, Email, CLI) and a choice of sandboxed execution backends (local, Docker, SSH, Singularity, Modal). It can run shell commands and handle coding tasks via Python RPC scripts and terminal access, but it's built for broad automation and research delegation across many domains, not project-scoped development.",
    configFiles: [],
    setupNotes: [
      {
        label: "Backend selection",
        description:
          "Choose a sandbox backend (local, Docker, SSH, Singularity, Modal) for how it executes code and tasks, trading off convenience against isolation.",
      },
      {
        label: "Subagent delegation",
        description:
          "Spins off isolated subagents with independent workflows for parallel or long-running tasks, rather than doing everything in one linear session.",
      },
      {
        label: "Self-hosted",
        description:
          "MIT-licensed and open-source — you run your own instance rather than depending on a hosted product.",
      },
    ],
    features: [
      "Multi-platform chat",
      "Persistent memory",
      "Sandboxed execution",
      "Task delegation",
      "Web search & browser automation",
      "Vision & image generation",
      "Open-source (MIT)",
    ],
    bestPractices: [
      "Give it self-contained task descriptions rather than assuming it has read your repo's conventions — it isn't a project-aware coding agent by default.",
      "Use its sandboxing backends (Docker/SSH) when letting it execute code, rather than running arbitrary agent-generated commands directly on your machine.",
      "Lean on subagent delegation for tasks that can run independently in parallel, instead of queuing everything through one session.",
    ],
    caveat:
      "Hermes Agent doesn't read a project-level config file the way Claude Code/Cursor/Copilot do — it's a general-purpose automation agent, not scoped to \"reads your project and follows its conventions.\" No confirmed MCP support or documented repo-config convention as of writing.",
  },
  {
    slug: "ollama",
    name: "Ollama",
    category: "local-runtime",
    website: "https://ollama.com",
    summary:
      "An open-source tool for running LLMs (Llama, Mistral, DeepSeek, and others) entirely on your own machine. Ollama itself isn't a coding agent — it's a model-serving runtime that repo-aware tools point at as their backend when you want inference to stay fully offline/local instead of calling a hosted API.",
    configFiles: [],
    setupNotes: [
      {
        label: "Modelfile",
        description:
          "A Dockerfile-like file defining a custom model's system prompt and parameters, built with `ollama create` — this is model-level configuration, not project-level.",
      },
      {
        label: "OpenAI-compatible local API",
        description:
          "Ollama runs a local server (default localhost:11434) exposing an OpenAI-compatible API — this is how coding tools that support a custom/local model endpoint plug into it.",
      },
    ],
    installMethods: [
      {
        label: "macOS (Homebrew)",
        command: "brew install ollama",
      },
      {
        label: "macOS / Linux (install script)",
        command: "curl -fsSL https://ollama.com/install.sh | sh",
      },
      {
        label: "Docker",
        command: "docker run -d -p 11434:11434 --name ollama ollama/ollama",
      },
      {
        label: "Windows / other platforms",
        command: "Download the installer from ollama.com/download",
      },
    ],
    commonCommands: [
      {
        command: "ollama run llama3",
        description:
          "Run a model interactively — pulls it first if not already downloaded.",
      },
      {
        command: "ollama pull llama3",
        description: "Download a model without running it yet.",
      },
      {
        command: "ollama list",
        description: "List models already downloaded locally.",
      },
      {
        command: "ollama ps",
        description: "Show models currently loaded in memory.",
      },
      {
        command: "ollama rm llama3",
        description: "Delete a downloaded model to free up disk space.",
      },
      {
        command: "ollama create mymodel -f Modelfile",
        description: "Build a custom model from a Modelfile.",
      },
    ],
    features: [
      "Runs fully offline",
      "OpenAI-compatible local API",
      "Custom Modelfiles",
      "Open-source",
    ],
    bestPractices: [
      "Point an existing repo-aware coding tool that supports a custom/local model endpoint at your local Ollama server, rather than expecting Ollama itself to read your project — it's a model runtime, not an agent.",
      "Use a Modelfile to pin a system prompt and parameters for a recurring task instead of repeating the same instructions in every prompt.",
      "Match the model size to your hardware — larger/less-quantized models are more capable but need more RAM/VRAM and run slower locally.",
    ],
    caveat:
      "Ollama doesn't read project files or act as a coding agent itself — it's a local model-serving runtime other tools connect to. Pair it with a repo-aware tool that supports a custom local endpoint if you want project-aware assistance running fully offline.",
  },
];
