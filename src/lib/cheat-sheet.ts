import type { CommandEntry } from "@/lib/content/schema";

function buildCommandMarkdown(c: CommandEntry): string {
  const sections: string[] = [];

  sections.push(`## ${c.name}`);
  sections.push(c.summary);
  sections.push(
    `**Difficulty:** ${c.difficulty} · **Shells:** ${c.shells.join(", ")} · **Category:** ${c.category.join(", ")}`,
  );
  sections.push(`\`\`\`\n${c.syntax}\n\`\`\``);

  if (c.body.trim()) {
    sections.push("### Overview");
    sections.push(c.body.trim());
  }

  if (c.flags.length > 0) {
    sections.push("### Flags");
    sections.push(
      c.flags
        .map((f) => {
          const example = f.example ? `\n  Example: \`${f.example}\`` : "";
          return `- \`${f.flag}\` — ${f.description}${example}`;
        })
        .join("\n"),
    );
  }

  if (c.examples.length > 0) {
    sections.push("### Examples");
    sections.push(
      c.examples
        .map((ex) => {
          const output = ex.output
            ? `\n  Output:\n  \`\`\`\n  ${ex.output.replace(/\n/g, "\n  ")}\n  \`\`\``
            : "";
          return `- ${ex.description}\n  \`\`\`\n  $ ${ex.input}\n  \`\`\`${output}`;
        })
        .join("\n"),
    );
  }

  if (c.tips.length > 0) {
    sections.push("### Tips");
    sections.push(c.tips.map((tip) => `- ${tip}`).join("\n"));
  }

  if (c.shortcuts.length > 0) {
    sections.push("### Shortcuts");
    sections.push(
      c.shortcuts
        .map((s) => `- \`${s.keys}\` (${s.context}) — ${s.description}`)
        .join("\n"),
    );
  }

  if (c.pitfalls.length > 0) {
    sections.push("### Pitfalls");
    sections.push(c.pitfalls.map((p) => `- ${p}`).join("\n"));
  }

  if (c.related.length > 0) {
    sections.push(`**Related:** ${c.related.join(", ")}`);
  }

  return sections.join("\n\n");
}

export function buildCheatSheetMarkdown(commands: CommandEntry[]): string {
  return commands.map(buildCommandMarkdown).join("\n\n---\n\n");
}
