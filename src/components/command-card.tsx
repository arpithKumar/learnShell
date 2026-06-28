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
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { DIFFICULTY_DOT_CLASS } from "@/lib/difficulty";
import type { CommandEntry } from "@/lib/content/schema";

export function CommandCard({
  command,
  featured = false,
}: {
  command: CommandEntry;
  featured?: boolean;
}) {
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

  const firstExample = command.examples[0];
  const firstTip = command.tips[0];

  return (
    <Link
      href={`/command/${command.slug}`}
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
            DIFFICULTY_DOT_CLASS[command.difficulty],
          )}
          aria-hidden="true"
        />
        <span
          className={cn(
            "absolute right-3 top-3 size-2 rounded-full",
            DIFFICULTY_DOT_CLASS[command.difficulty],
          )}
          title={`${command.difficulty} difficulty`}
        >
          <span className="sr-only">{command.difficulty} difficulty</span>
        </span>
        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{ background: spotlight }}
        />

        <div className={cn("relative px-5", featured ? "py-5" : "py-4")}>
          <span
            className={cn(
              "font-mono font-semibold",
              featured ? "text-2xl" : "text-lg",
            )}
          >
            {command.name}
          </span>

          <p
            className={cn(
              "text-muted-foreground mt-2 text-sm",
              featured ? "" : "line-clamp-2",
            )}
          >
            {command.summary}
          </p>

          <code className="mt-4 block truncate rounded-md bg-muted px-2.5 py-1.5 font-mono text-xs text-foreground/80">
            {command.syntax}
          </code>

          {featured && firstExample && (
            <div className="mt-3 rounded-md border border-foreground/10 bg-muted/40 px-3 py-2.5">
              <p className="text-muted-foreground text-xs">
                {firstExample.description}
              </p>
              <code className="mt-1.5 block font-mono text-xs">
                <span className="text-primary">$</span> {firstExample.input}
              </code>
            </div>
          )}

          {featured && firstTip && (
            <p className="text-muted-foreground mt-3 text-xs leading-relaxed">
              <span className="text-primary font-medium">Tip — </span>
              {firstTip}
            </p>
          )}

          <div className="mt-3 flex items-end justify-between">
            <div className="flex flex-wrap gap-1.5">
              {command.category
                .slice(0, featured ? command.category.length : 2)
                .map((c) => (
                  <Badge key={c} variant="secondary" className="text-xs">
                    {c}
                  </Badge>
                ))}
            </div>
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
