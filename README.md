# learnshell

An interactive, visually rich catalogue for shell scripting — every command, every flag, and the concepts behind them, explained and explorable.

**Live at [learn-shell-kappa.vercel.app](https://learn-shell-kappa.vercel.app)**

Built with Next.js 16 (App Router), this is a fast, static-first reference site: search, browse, and learn shell scripting without leaving the page.

## What's in here

- **154 commands** — full reference entries with syntax, flags, runnable examples, tips, common pitfalls, and related commands. Browse and filter by category and difficulty at `/catalogue`.
- **77 shell-programming concepts** — variables, quoting, expansions, control flow, pipelines, process control, and shell-environment topics, each with examples and a genuine history/trivia fact. Browse at `/concepts`.
- **Concept graph** — every command plotted as an explorable, zoomable graph, connected by its related commands (`/catalogue/graph`).
- **12 guided learning tracks** — sequential, unlock-gated paths through the catalogue, from Bash Basics to Security & Crypto (`/learn`).
- **In-browser playground** — a simulated shell (real pipes, redirects, tab autocomplete) running against a fake filesystem, persisted in your browser (`/playground`).
- **Keyboard shortcuts explorer** — readline/Emacs bindings, vi mode, and tmux shortcuts (`/shortcuts`).
- **⌘K command palette** — instant fuzzy search across every command and concept.
- **Bookmarks & recents** — saved locally, exportable as a Markdown cheat sheet.
- **AI Tools reference** — config files and recommended folder structure for 9 AI tools (Claude Code, Gemini CLI, Cursor, GitHub Copilot, ChatGPT, Grok, OpenClaw, Hermes Agent, Ollama), a "which tool for which task" recommendation section, a cross-tool comparison table, and a tool-agnostic prompt-engineering guide (`/ai-tools`, `/prompt-engineering`).

## Tech stack

| Layer               | Choice                                                                     |
| ------------------- | -------------------------------------------------------------------------- |
| Framework           | Next.js 16 (App Router, Turbopack) + React 19                              |
| Language            | TypeScript (strict)                                                        |
| Styling             | Tailwind CSS v4                                                            |
| Components          | shadcn/ui on Base UI                                                       |
| Animation           | Framer Motion                                                              |
| Content             | MDX + Zod-validated frontmatter (`content/commands/`, `content/concepts/`) |
| Search              | Fuse.js + cmdk                                                             |
| State               | Zustand (persisted)                                                        |
| Concept graph       | `@xyflow/react`                                                            |
| Playground terminal | `xterm.js`                                                                 |
| Package manager     | bun                                                                        |

## Getting started

```bash
bun install
bun run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

```bash
bun run dev            # start the dev server
bun run build          # production build
bun run start           # serve the production build
bun run lint            # eslint
bun run format          # prettier --write
bun run format:check    # prettier --check
bun run new-command <slug>   # scaffold a new content/commands/<slug>.mdx
bun run new-concept <slug>   # scaffold a new content/concepts/<slug>.mdx
```

## Content model

Each command and concept is a single MDX file with Zod-validated frontmatter — one file per entry, no separate database. Cross-references (`related`, `relatedConcepts`, `relatedCommands`) are validated at build time, so a broken link fails the build instead of 404ing silently.

```text
content/
  commands/   # one .mdx file per command (slug, flags, examples, tips, pitfalls, related)
  concepts/   # one .mdx file per concept (category, examples, tips, pitfalls, funFacts)
```

## Deployment

This is a static-first Next.js app — fully compatible with Vercel's zero-config deploy. Set `NEXT_PUBLIC_SITE_URL` to your production domain (used for the sitemap, robots.txt, OG images, and canonical metadata).
