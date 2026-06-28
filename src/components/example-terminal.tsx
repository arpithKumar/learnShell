import Link from "next/link";
import { Play } from "lucide-react";
import { CopyButton } from "@/components/copy-button";
import { isPlaygroundSupported } from "@/lib/playground/supported";

export function ExampleTerminal({
  description,
  input,
  output,
}: {
  description: string;
  input: string;
  output?: string;
}) {
  const runnable = isPlaygroundSupported(input);

  return (
    <div className="bg-card overflow-hidden rounded-lg border">
      <div className="bg-muted/40 flex items-center gap-2 border-b px-3 py-2">
        <span className="size-2 rounded-full bg-red-400/70" />
        <span className="size-2 rounded-full bg-yellow-400/70" />
        <span className="size-2 rounded-full bg-green-400/70" />
        <span className="text-muted-foreground ml-1 text-xs font-medium">
          {description}
        </span>
        {runnable && (
          <Link
            href={`/playground?cmd=${encodeURIComponent(input)}`}
            className="text-primary ml-auto flex items-center gap-1 text-xs font-medium hover:underline"
          >
            <Play className="size-3" aria-hidden="true" />
            Run in playground
          </Link>
        )}
      </div>
      <div className="bg-card px-4 py-3 font-mono text-sm">
        <div className="flex items-start justify-between gap-2">
          <p className="min-w-0 break-all">
            <span className="text-primary">$</span> {input}
          </p>
          <CopyButton text={input} />
        </div>
        {output && (
          <pre className="text-muted-foreground mt-2 overflow-x-auto whitespace-pre-wrap">
            {output}
          </pre>
        )}
      </div>
    </div>
  );
}
