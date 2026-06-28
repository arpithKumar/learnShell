"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { CopyButton } from "@/components/copy-button";
import { isPlaygroundSupported } from "@/lib/playground/supported";

export function PipelineVisualizer({
  description,
  input,
  output,
}: {
  description: string;
  input: string;
  output?: string;
}) {
  const stages = input.split("|").map((stage) => stage.trim());
  const runnable = isPlaygroundSupported(input);

  return (
    <div className="bg-card overflow-hidden rounded-lg border">
      <div className="bg-muted/40 flex items-center justify-between gap-2 border-b px-3 py-2">
        <span className="text-muted-foreground text-xs font-medium">
          {description}
        </span>
        <div className="flex items-center gap-3">
          {runnable && (
            <Link
              href={`/playground?cmd=${encodeURIComponent(input)}`}
              className="text-primary flex items-center gap-1 text-xs font-medium hover:underline"
            >
              <Play className="size-3" aria-hidden="true" />
              Run in playground
            </Link>
          )}
          <CopyButton text={input} />
        </div>
      </div>

      <div className="bg-card px-4 py-4">
        <div className="flex flex-wrap items-center gap-2">
          {stages.map((stage, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: i * 0.15 }}
              className="flex items-center gap-2"
            >
              <code className="rounded-md border border-foreground/10 bg-muted/60 px-2.5 py-1.5 font-mono text-xs">
                {i === 0 ? <span className="text-primary">$ </span> : null}
                {stage}
              </code>
              {i < stages.length - 1 && (
                <ArrowRight
                  className="text-muted-foreground size-3.5 shrink-0"
                  aria-hidden="true"
                />
              )}
            </motion.div>
          ))}
        </div>

        {output && (
          <motion.pre
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25, delay: stages.length * 0.15 }}
            className="text-muted-foreground mt-3 overflow-x-auto whitespace-pre-wrap border-t pt-3 text-xs"
          >
            {output}
          </motion.pre>
        )}
      </div>
    </div>
  );
}
