"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Background,
  Controls,
  Handle,
  MiniMap,
  Position,
  ReactFlow,
  type Node,
  type Edge,
  type NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { cn } from "@/lib/utils";
import { DIFFICULTY_DOT_CLASS, DIFFICULTY_DOT_HEX } from "@/lib/difficulty";
import type { CategoryLabel, GraphEdge, GraphNode } from "@/lib/concept-graph";

type NodeData = GraphNode["data"] & { dimmed: boolean; active: boolean };

function CommandNode({ id, data }: NodeProps & { data: NodeData }) {
  const router = useRouter();

  return (
    <div
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          router.push(`/command/${id}`);
        }
      }}
      className={cn(
        "rounded-full border border-foreground/15 bg-card px-3 py-1.5 font-mono text-xs font-medium shadow-sm transition-all duration-150 hover:border-primary/50",
        data.dimmed && "opacity-20",
        data.active && "border-primary ring-2 ring-primary/40",
      )}
    >
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={false}
        className="!h-0 !w-0 !border-0 !bg-transparent"
      />
      <span
        className={cn(
          "mr-1.5 inline-block size-1.5 rounded-full",
          DIFFICULTY_DOT_CLASS[data.difficulty],
        )}
      />
      {data.name}
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={false}
        className="!h-0 !w-0 !border-0 !bg-transparent"
      />
    </div>
  );
}

function CategoryLabelNode({ data }: NodeProps & { data: { name: string } }) {
  return (
    <span className="text-muted-foreground pointer-events-none text-xs font-semibold uppercase tracking-wide capitalize">
      {data.name}
    </span>
  );
}

const NODE_TYPES = {
  command: CommandNode,
  "category-label": CategoryLabelNode,
};

export function ConceptGraph({
  nodes: graphNodes,
  edges: graphEdges,
  categoryLabels,
}: {
  nodes: GraphNode[];
  edges: GraphEdge[];
  categoryLabels: CategoryLabel[];
}) {
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const neighbors = useMemo(() => {
    const map = new Map<string, Set<string>>();
    for (const e of graphEdges) {
      if (!map.has(e.source)) map.set(e.source, new Set());
      if (!map.has(e.target)) map.set(e.target, new Set());
      map.get(e.source)!.add(e.target);
      map.get(e.target)!.add(e.source);
    }
    return map;
  }, [graphEdges]);

  const activeNeighbors = hoveredId ? neighbors.get(hoveredId) : null;

  const nodes: Node[] = useMemo(
    () => [
      ...categoryLabels.map((label) => ({
        id: label.id,
        position: label.position,
        data: { name: label.name },
        type: "category-label",
        draggable: false,
        selectable: false,
        connectable: false,
      })),
      ...graphNodes.map((n) => {
        const isHovered = n.id === hoveredId;
        const isNeighbor = activeNeighbors?.has(n.id) ?? false;
        return {
          id: n.id,
          position: n.position,
          data: {
            ...n.data,
            dimmed: hoveredId !== null && !isHovered && !isNeighbor,
            active: isHovered,
          },
          type: "command",
        };
      }),
    ],
    [graphNodes, categoryLabels, hoveredId, activeNeighbors],
  );

  const edges: Edge[] = useMemo(
    () =>
      graphEdges.map((e) => {
        const isActive =
          hoveredId !== null &&
          (e.source === hoveredId || e.target === hoveredId);
        return {
          id: e.id,
          source: e.source,
          target: e.target,
          zIndex: isActive ? 1 : 0,
          style: {
            stroke: isActive ? "#a5b4fc" : "#818cf8",
            opacity: hoveredId === null ? 0.12 : isActive ? 0.9 : 0.03,
            strokeWidth: isActive ? 2.5 : 1.5,
          },
        };
      }),
    [graphEdges, hoveredId],
  );

  return (
    <div className="concept-graph h-[70vh] overflow-hidden rounded-xl border">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={NODE_TYPES}
        colorMode={resolvedTheme === "light" ? "light" : "dark"}
        onNodeMouseEnter={(_, node) => {
          if (node.type === "command") setHoveredId(node.id);
        }}
        onNodeMouseLeave={() => setHoveredId(null)}
        onNodeClick={(_, node) => {
          if (node.type === "command") router.push(`/command/${node.id}`);
        }}
        fitView
        proOptions={{ hideAttribution: true }}
      >
        <Background />
        <Controls showInteractive={false} />
        <MiniMap
          pannable
          zoomable
          nodeColor={(node) =>
            node.type === "command"
              ? DIFFICULTY_DOT_HEX[(node.data as NodeData).difficulty]
              : "transparent"
          }
        />
      </ReactFlow>
    </div>
  );
}
