import fs from "node:fs";
import path from "node:path";

const slug = process.argv[2];

if (!slug) {
  console.error("Usage: bun run new-concept <slug>");
  process.exit(1);
}

if (!/^[a-z0-9-]+$/.test(slug)) {
  console.error("Slug must be lowercase letters, numbers, and hyphens only.");
  process.exit(1);
}

const dir = path.join(process.cwd(), "content", "concepts");
const filePath = path.join(dir, `${slug}.mdx`);

if (fs.existsSync(filePath)) {
  console.error(`content/concepts/${slug}.mdx already exists.`);
  process.exit(1);
}

const title = slug
  .split("-")
  .map((word) => word[0].toUpperCase() + word.slice(1))
  .join(" ");

const template = `---
slug: ${slug}
title: ${title}
category: TODO
difficulty: beginner
summary: TODO one-line summary.
examples:
  - description: TODO what this example demonstrates
    input: "TODO"
    output: "TODO"
tips:
  - TODO one practical usage tip.
pitfalls:
  - TODO one common mistake or gotcha.
funFacts:
  - TODO one genuine history/trivia fact, not a restated tip.
relatedConcepts: []
relatedCommands: []
---

TODO: 2 short paragraphs. Lead with what ${title} actually is and the single
most common way it shows up in a real script. Then go a layer deeper — a key
nuance, a common confusion it clears up, or how it relates to a nearby
concept or command.
`;

fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(filePath, template);
console.log(`Created content/concepts/${slug}.mdx`);
console.log("Remember to:");
console.log(
  "  - set a real category: fundamentals | expansions-and-substitution | control-flow | io-and-pipelines | process-control | shell-environment",
);
console.log(
  "  - link it from related concepts'/commands' frontmatter too (it's one-directional)",
);
console.log(
  "  - run `bun run build` to catch broken related-links and schema errors",
);
