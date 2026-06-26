"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Check, Lock } from "lucide-react";
import { useLibraryStore } from "@/lib/library-store";
import { cn } from "@/lib/utils";

type StepEntry = { slug: string; name: string; summary: string };

export function LearningPath({ steps }: { steps: StepEntry[] }) {
  const visited = useLibraryStore((s) => s.visited);
  const visitedSet = new Set(visited);

  return (
    <div>
      {steps.map((step, i) => {
        const completed = visitedSet.has(step.slug);
        const unlocked = i === 0 || visitedSet.has(steps[i - 1].slug);
        const isLast = i === steps.length - 1;

        const row = (
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex size-10 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors",
                  completed &&
                    "border-primary bg-primary text-primary-foreground",
                  !completed &&
                    unlocked &&
                    "border-primary bg-card text-primary",
                  !unlocked &&
                    "border-foreground/15 bg-muted text-muted-foreground",
                )}
              >
                {completed ? (
                  <Check className="size-4" />
                ) : !unlocked ? (
                  <Lock className="size-3.5" />
                ) : (
                  i + 1
                )}
              </div>
              {!isLast && (
                <div
                  className={cn(
                    "mt-1 w-0.5 flex-1",
                    completed ? "bg-primary" : "bg-foreground/15",
                  )}
                />
              )}
            </div>

            <div
              className={cn(
                "flex-1 rounded-lg border p-4 pb-6 transition-colors",
                unlocked && "hover:border-primary/50",
                !unlocked && "opacity-60",
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono font-semibold">{step.name}</span>
                {unlocked && (
                  <ArrowRight
                    className="text-muted-foreground size-4 shrink-0"
                    aria-hidden="true"
                  />
                )}
              </div>
              <p className="text-muted-foreground mt-1 text-sm">
                {step.summary}
              </p>
            </div>
          </div>
        );

        return (
          <motion.div
            key={step.slug}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
          >
            {unlocked ? (
              <Link href={`/command/${step.slug}`} className="block">
                {row}
              </Link>
            ) : (
              row
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
