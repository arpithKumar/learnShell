"use client";

import { createContext, useContext, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Background,
  ControlButton,
  Controls,
  Handle,
  MiniMap,
  Position,
  ReactFlow,
  useReactFlow,
  type Node,
  type Edge,
  type NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { ArrowRight, RotateCcw } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CopyButton } from "@/components/copy-button";
import { cn } from "@/lib/utils";
import { DIFFICULTY_DOT_CLASS, DIFFICULTY_DOT_HEX } from "@/lib/difficulty";
import type { CategoryLabel, GraphEdge, GraphNode } from "@/lib/concept-graph";

// Hover state lives in context rather than baked into each node's `data`, so
// the `nodes`/`edges` arrays passed to xyflow stay referentially stable while
// hovering — recreating ~150 node objects on every mouse move was forcing
// xyflow to remeasure the whole graph, which is what caused the constant
// re-renders and nodes briefly disappearing at some zoom levels. Only the
// content inside each already-mounted node updates now, which is much cheaper.
type HoverState = {
  hoveredId: string | null;
  neighbors: Map<string, Set<string>>;
};
const HoverContext = createContext<HoverState>({
  hoveredId: null,
  neighbors: new Map(),
});

function CommandNode({ id, data }: NodeProps & { data: GraphNode["data"] }) {
  const router = useRouter();
  const { hoveredId, neighbors } = useContext(HoverContext);

  const isHovered = id === hoveredId;
  const isNeighbor =
    hoveredId !== null && (neighbors.get(hoveredId)?.has(id) ?? false);
  const dimmed = hoveredId !== null && !isHovered && !isNeighbor;

  return (
    <Popover>
      <PopoverTrigger
        openOnHover
        delay={300}
        closeDelay={100}
        nativeButton={false}
        render={
          <div
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                router.push(`/command/${id}`);
              }
            }}
            className={cn(
              "rounded-full border border-foreground/15 bg-card px-4 py-2.5 font-mono text-base font-medium shadow-sm transition-all duration-150 hover:border-primary/50",
              dimmed && "opacity-20",
              isHovered && "border-primary ring-2 ring-primary/40",
            )}
          />
        }
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
      </PopoverTrigger>
      <PopoverContent align="center" side="top" className="w-80">
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-sm font-semibold">{data.name}</span>
          <span className="text-muted-foreground inline-flex items-center gap-1.5 text-xs capitalize">
            <span
              className={cn(
                "size-1.5 rounded-full",
                DIFFICULTY_DOT_CLASS[data.difficulty],
              )}
              aria-hidden="true"
            />
            {data.difficulty}
          </span>
        </div>
        <p className="text-muted-foreground mt-0.5 text-xs capitalize">
          {data.category.replace(/-/g, " ")}
        </p>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-foreground/90">
          {data.summary}
        </p>
        <div className="bg-muted mt-2 flex items-center justify-between gap-2 rounded-md px-2.5 py-1.5">
          <code className="truncate font-mono text-xs text-foreground/80">
            {data.syntax}
          </code>
          <CopyButton text={data.syntax} />
        </div>
        <Link
          href={`/command/${id}`}
          className="text-primary mt-3 flex items-center gap-1 text-xs font-medium outline-none hover:underline focus-visible:underline"
        >
          View full details
          <ArrowRight className="size-3" aria-hidden="true" />
        </Link>
      </PopoverContent>
    </Popover>
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

function ResetViewButton() {
  const { fitView } = useReactFlow();

  return (
    <ControlButton
      onClick={() => fitView({ minZoom: 0.85 })}
      title="Reset view"
      aria-label="Reset view to the original zoom and position"
    >
      {/* React Flow's stylesheet forces `fill: currentColor` on every
          .react-flow__controls-button svg (to match its own filled icon
          set), which inherits down into lucide's stroke-only paths and
          turns the rotate-arrow into a solid blob — override it back to
          fill: none with an inline style so it actually renders as an
          outline icon. */}
      <RotateCcw
        className="size-3"
        strokeWidth={2.5}
        style={{ fill: "none" }}
      />
    </ControlButton>
  );
}

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

  // "system" is the SSR-safe default — resolvedTheme is undefined until
  // next-themes mounts, and falling back to "dark" in that gap (rather than
  // matching the OS/site preference) is what caused the graph to flash into
  // dark mode on every refresh, even for users on the light theme.
  const colorMode =
    resolvedTheme === "light"
      ? "light"
      : resolvedTheme === "dark"
        ? "dark"
        : "system";

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
      ...graphNodes.map((n) => ({
        id: n.id,
        position: n.position,
        data: n.data,
        type: "command",
      })),
    ],
    [graphNodes, categoryLabels],
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
      <HoverContext.Provider value={{ hoveredId, neighbors }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={NODE_TYPES}
          colorMode={colorMode}
          onNodeMouseEnter={(_, node) => {
            if (node.type === "command") setHoveredId(node.id);
          }}
          onNodeMouseLeave={() => setHoveredId(null)}
          onNodeClick={(_, node) => {
            if (node.type === "command") router.push(`/command/${node.id}`);
          }}
          fitView
          // With ~150 nodes spread across many categories, fitting the
          // *entire* graph into view by default zooms out far enough that
          // node text becomes unreadable. Clamping the initial fit keeps
          // nodes legible — not everything is visible at once, but the
          // minimap and manual zoom-out (still allowed down to 0.2) cover
          // exploring the rest.
          fitViewOptions={{ minZoom: 0.85 }}
          minZoom={0.2}
          proOptions={{ hideAttribution: true }}
        >
          <Background />
          <Controls showInteractive={false}>
            <ResetViewButton />
          </Controls>
          <MiniMap
            pannable
            zoomable
            nodeColor={(node) =>
              node.type === "command"
                ? DIFFICULTY_DOT_HEX[
                    (node.data as GraphNode["data"]).difficulty
                  ]
                : "transparent"
            }
          />
        </ReactFlow>
      </HoverContext.Provider>
    </div>
  );
}
