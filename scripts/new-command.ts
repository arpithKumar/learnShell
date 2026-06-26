import fs from "node:fs";
import path from "node:path";

const slug = process.argv[2];

if (!slug) {
  console.error("Usage: bun run new-command <slug>");
  process.exit(1);
}

if (!/^[a-z0-9-]+$/.test(slug)) {
  console.error("Slug must be lowercase letters, numbers, and hyphens only.");
  process.exit(1);
}

const dir = path.join(process.cwd(), "content", "commands");
const filePath = path.join(dir, `${slug}.mdx`);

if (fs.existsSync(filePath)) {
  console.error(`content/commands/${slug}.mdx already exists.`);
  process.exit(1);
}

const template = `---
slug: ${slug}
name: ${slug}
category: ["TODO"]
difficulty: beginner
shells: ["posix", "bash", "zsh", "fish"]
summary: TODO one-line summary.
syntax: "${slug} [OPTIONS]"
flags:
  - flag: "-TODO"
    description: TODO what this flag does.
    example: "${slug} -TODO"
examples:
  - description: TODO what this example demonstrates
    input: "${slug}"
    output: ""
shortcuts: []
tips:
  - TODO one practical usage tip.
related: []
pitfalls:
  - TODO one common mistake or gotcha.
---

TODO: 2-3 short paragraphs. Lead with what ${slug} does and the single most
common way people use it. Then go a layer deeper — the syntax shape, the
flag(s) that matter most. Close with how it fits alongside related commands,
or a "why this exists" framing for beginners.
`;

fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(filePath, template);
console.log(`Created content/commands/${slug}.mdx`);
console.log("Remember to:");
console.log("  - set a real category and difficulty");
console.log(
  "  - link it from related commands' frontmatter too (it's one-directional)",
);
console.log(
  "  - run `bun run build` to catch broken related-links and schema errors",
);
