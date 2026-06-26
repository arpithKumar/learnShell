"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const ORIGINAL = "git commit -m 'fix login bug'";

const ACTIONS = [
  { keys: "Ctrl+A", label: "Start of line" },
  { keys: "Ctrl+E", label: "End of line" },
  { keys: "Ctrl+W", label: "Delete word back" },
  { keys: "Ctrl+U", label: "Delete to start" },
  { keys: "Ctrl+K", label: "Delete to end" },
] as const;

function deleteWordBack(text: string, cursor: number) {
  let i = cursor;
  while (i > 0 && text[i - 1] === " ") i--;
  while (i > 0 && text[i - 1] !== " ") i--;
  return { text: text.slice(0, i) + text.slice(cursor), cursor: i };
}

export function ReadlineStage() {
  const [text, setText] = useState(ORIGINAL);
  const [cursor, setCursor] = useState(ORIGINAL.length);

  function run(keys: (typeof ACTIONS)[number]["keys"]) {
    if (keys === "Ctrl+A") {
      setCursor(0);
    } else if (keys === "Ctrl+E") {
      setCursor(text.length);
    } else if (keys === "Ctrl+W") {
      const next = deleteWordBack(text, cursor);
      setText(next.text);
      setCursor(next.cursor);
    } else if (keys === "Ctrl+U") {
      setText(text.slice(cursor));
      setCursor(0);
    } else if (keys === "Ctrl+K") {
      setText(text.slice(0, cursor));
    }
  }

  function reset() {
    setText(ORIGINAL);
    setCursor(ORIGINAL.length);
  }

  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">Try it: readline editing</h2>
        <button
          type="button"
          onClick={reset}
          className="text-muted-foreground text-xs hover:text-foreground"
        >
          Reset
        </button>
      </div>
      <p className="text-muted-foreground mt-1 text-sm">
        Click a shortcut below and watch the cursor and text respond, the way it
        would in a real bash/zsh prompt.
      </p>

      <div className="mt-4 rounded-lg border bg-muted/40 px-4 py-3">
        <div className="relative whitespace-pre font-mono text-sm">
          <span className="text-primary">$ </span>
          <span>{text}</span>
          <motion.span
            className="bg-primary absolute top-0 inline-block h-[1.1em] w-[2px]"
            animate={{ left: `${2 + cursor}ch` }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {ACTIONS.map((action) => (
          <Button
            key={action.keys}
            variant="outline"
            size="sm"
            onClick={() => run(action.keys)}
            className="gap-2"
          >
            <kbd className="bg-muted rounded px-1.5 py-0.5 font-mono text-xs">
              {action.keys}
            </kbd>
            <span className="text-muted-foreground text-xs">
              {action.label}
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
}
