import type { CommandEntry, Difficulty } from "@/lib/content/schema";

export type GraphNode = {
  id: string;
  position: { x: number; y: number };
  data: { name: string; category: string; difficulty: Difficulty };
};

export type GraphEdge = {
  id: string;
  source: string;
  target: string;
};

export type CategoryLabel = {
  id: string;
  position: { x: number; y: number };
  name: string;
};

const NODE_W = 150;
const NODE_H = 64;
const REGION_PADDING = 90;
const LABEL_OFFSET = 40;
const MAX_ROW_WIDTH = 1700;

export function buildConceptGraph(commands: CommandEntry[]): {
  nodes: GraphNode[];
  edges: GraphEdge[];
  categoryLabels: CategoryLabel[];
} {
  const bySlug = new Map(commands.map((c) => [c.slug, c]));

  const commandsByCategory = new Map<string, CommandEntry[]>();
  for (const command of commands) {
    const category = command.category[0];
    const bucket = commandsByCategory.get(category) ?? [];
    bucket.push(command);
    commandsByCategory.set(category, bucket);
  }

  const regions = Array.from(commandsByCategory, ([category, members]) => {
    const cols = Math.max(1, Math.ceil(Math.sqrt(members.length)));
    const rows = Math.ceil(members.length / cols);
    return {
      category,
      members,
      cols,
      rows,
      width: cols * NODE_W,
      height: rows * NODE_H,
    };
  }).sort((a, b) => b.height - a.height);

  const nodes: GraphNode[] = [];
  const categoryLabels: CategoryLabel[] = [];

  let shelfX = 0;
  let shelfY = 0;
  let shelfRowHeight = 0;

  for (const region of regions) {
    if (shelfX > 0 && shelfX + region.width > MAX_ROW_WIDTH) {
      shelfX = 0;
      shelfY += shelfRowHeight + REGION_PADDING;
      shelfRowHeight = 0;
    }

    categoryLabels.push({
      id: `label::${region.category}`,
      position: { x: shelfX, y: shelfY - LABEL_OFFSET },
      name: region.category,
    });

    region.members.forEach((command, i) => {
      const col = i % region.cols;
      const row = Math.floor(i / region.cols);
      nodes.push({
        id: command.slug,
        position: {
          x: shelfX + col * NODE_W,
          y: shelfY + row * NODE_H,
        },
        data: {
          name: command.name,
          category: region.category,
          difficulty: command.difficulty,
        },
      });
    });

    shelfX += region.width + REGION_PADDING;
    shelfRowHeight = Math.max(shelfRowHeight, region.height);
  }

  const edgeKeys = new Set<string>();
  const edges: GraphEdge[] = [];

  for (const command of commands) {
    for (const relatedSlug of command.related) {
      if (!bySlug.has(relatedSlug)) continue;
      const key = [command.slug, relatedSlug].sort().join("::");
      if (edgeKeys.has(key)) continue;
      edgeKeys.add(key);
      edges.push({
        id: key,
        source: command.slug,
        target: relatedSlug,
      });
    }
  }

  return { nodes, edges, categoryLabels };
}
