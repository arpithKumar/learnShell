"use client";

import { useRef } from "react";
import Link from "next/link";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { ArrowRight, BookOpen, CheckCircle2, Compass } from "lucide-react";
import { useLibraryStore } from "@/lib/library-store";
import { LEARN_TRACKS } from "@/lib/learn-tracks";

export function LearnOverallStats({
  totalCatalogueCount,
}: {
  totalCatalogueCount: number;
}) {
  const visited = useLibraryStore((s) => s.visited);
  const visitedSet = new Set(visited);

  const tracksCompleted = LEARN_TRACKS.filter((t) =>
    t.steps.every((s) => visitedSet.has(s)),
  ).length;

  const ref = useRef<HTMLDivElement>(null);
  // Off-canvas default — at (0, 0) the spotlight's radial gradient sits
  // anchored in the corner before any hover, showing as a static blotch on
  // every card. Parking it far outside the card's bounds keeps it invisible
  // until the cursor actually moves over the card.
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);
  const rotateX = useSpring(0, { stiffness: 300, damping: 25 });
  const rotateY = useSpring(0, { stiffness: 300, damping: 25 });

  const spotlight = useMotionTemplate`radial-gradient(280px circle at ${mouseX}px ${mouseY}px, color-mix(in oklch, var(--primary) 18%, transparent), transparent 80%)`;

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mouseX.set(x);
    mouseY.set(y);
    rotateY.set(((x - rect.width / 2) / rect.width) * 6);
    rotateX.set(-((y - rect.height / 2) / rect.height) * 6);
  }

  function handleMouseLeave() {
    rotateX.set(0);
    rotateY.set(0);
    // Without this, the spotlight gradient stays frozen wherever the cursor
    // last was inside this card, instead of disappearing when the cursor
    // moves to a different card.
    mouseX.set(-1000);
    mouseY.set(-1000);
  }

  const stats = [
    {
      icon: Compass,
      label: "Commands explored",
      value: `${visited.length} / ${totalCatalogueCount}`,
    },
    {
      icon: CheckCircle2,
      label: "Tracks completed",
      value: `${tracksCompleted} / ${LEARN_TRACKS.length}`,
    },
    {
      icon: BookOpen,
      label: "Catalogue size",
      value: `${totalCatalogueCount} commands`,
    },
  ];

  return (
    <div className="mt-10 border-t pt-10">
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-card rounded-xl border p-5">
            <stat.icon className="text-primary size-5" aria-hidden="true" />
            <p className="mt-3 text-2xl font-semibold">{stat.value}</p>
            <p className="text-muted-foreground mt-1 text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      <Link
        href="/catalogue"
        className="group block rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <motion.div
          ref={ref}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ rotateX, rotateY, transformPerspective: 800 }}
          className="bg-card relative mt-4 flex items-center justify-between gap-4 overflow-hidden rounded-xl border p-5 transition-colors hover:border-primary/50 group-focus-visible:border-primary/50"
        >
          <motion.div
            className="pointer-events-none absolute inset-0"
            style={{ background: spotlight }}
          />
          <div className="relative">
            <p className="font-medium">Looking for something specific?</p>
            <p className="text-muted-foreground mt-1 text-sm">
              Browse the full catalogue, filterable by category and difficulty.
            </p>
          </div>
          <ArrowRight
            className="text-muted-foreground relative size-5 shrink-0 transition-transform group-hover:translate-x-1 group-focus-visible:translate-x-1 group-hover:text-primary group-focus-visible:text-primary"
            aria-hidden="true"
          />
        </motion.div>
      </Link>
    </div>
  );
}
