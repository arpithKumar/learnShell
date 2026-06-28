"use client";

import { useRef } from "react";
import Link from "next/link";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { DIFFICULTY_DOT_CLASS } from "@/lib/difficulty";
import type { ConceptEntry } from "@/lib/content/concept-schema";

export function ConceptCard({ concept }: { concept: ConceptEntry }) {
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

  return (
    <Link
      href={`/concepts/${concept.slug}`}
      className="group block rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformPerspective: 800 }}
        className="relative overflow-hidden rounded-xl border border-foreground/10 bg-card transition-colors group-hover:border-primary/40 group-focus-visible:border-primary/40"
      >
        <span
          className={cn(
            "absolute inset-y-0 left-0 w-1",
            DIFFICULTY_DOT_CLASS[concept.difficulty],
          )}
          aria-hidden="true"
        />
        <span
          className={cn(
            "absolute right-3 top-3 size-2 rounded-full",
            DIFFICULTY_DOT_CLASS[concept.difficulty],
          )}
          title={`${concept.difficulty} difficulty`}
        >
          <span className="sr-only">{concept.difficulty} difficulty</span>
        </span>
        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{ background: spotlight }}
        />

        <div className="relative px-5 py-4">
          <span className="text-lg font-semibold">{concept.title}</span>
          <p className="text-muted-foreground mt-2 line-clamp-2 text-sm">
            {concept.summary}
          </p>
          <div className="mt-3 flex items-center justify-end">
            <ArrowRight
              className="text-muted-foreground size-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-focus-visible:translate-x-0.5 group-hover:text-primary group-focus-visible:text-primary"
              aria-hidden="true"
            />
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
