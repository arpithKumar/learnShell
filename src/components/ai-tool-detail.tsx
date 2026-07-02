import { ExternalLink, FileCode, Info, Lightbulb } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CopyButton } from "@/components/copy-button";
import { cn } from "@/lib/utils";
import {
  CATEGORY_ICON,
  CATEGORY_LABEL,
  CATEGORY_TEXT_CLASS,
} from "@/lib/ai-tool-category";
import type { AIToolEntry } from "@/lib/content/ai-tools";

export function AIToolDetail({ tool }: { tool: AIToolEntry }) {
  const CategoryIcon = CATEGORY_ICON[tool.category];

  return (
    <div className="bg-card rounded-xl border p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span
            className="bg-primary/10 flex size-11 shrink-0 items-center justify-center rounded-full"
            aria-hidden="true"
          >
            <CategoryIcon
              className={cn("size-5", CATEGORY_TEXT_CLASS[tool.category])}
            />
          </span>
          <div>
            <h3 className="text-xl font-bold tracking-tight">{tool.name}</h3>
            <p className="text-muted-foreground mt-0.5 text-sm">
              {CATEGORY_LABEL[tool.category]}
            </p>
          </div>
        </div>
        <a
          href={tool.website}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-primary flex shrink-0 items-center gap-1.5 rounded-full border border-foreground/15 bg-card px-3 py-1.5 text-sm font-medium transition-colors hover:border-primary/50"
        >
          Visit site
          <ExternalLink className="size-3.5" aria-hidden="true" />
        </a>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-foreground/90">
        {tool.summary}
      </p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {tool.features.map((feature) => (
          <Badge key={feature} variant="secondary">
            {feature}
          </Badge>
        ))}
      </div>

      {tool.caveat && (
        <div className="mt-5 flex items-start gap-3 rounded-md border border-sky-500/25 bg-sky-500/[0.07] px-4 py-3">
          <span
            className="flex size-6 shrink-0 items-center justify-center rounded-full bg-sky-500/15"
            aria-hidden="true"
          >
            <Info className="size-3.5 text-sky-600 dark:text-sky-400" />
          </span>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {tool.caveat}
          </p>
        </div>
      )}

      {tool.configFiles.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-semibold">Config files it reads</h4>
          <ul className="mt-3 space-y-2">
            {tool.configFiles.map((file) => (
              <li
                key={file.path}
                className="bg-muted/30 flex gap-2.5 rounded-md px-3 py-2.5"
              >
                <FileCode
                  className="text-muted-foreground mt-0.5 size-4 shrink-0"
                  aria-hidden="true"
                />
                <div>
                  <code className="font-mono text-xs text-foreground/90">
                    {file.path}
                  </code>
                  <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                    {file.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {tool.installMethods && tool.installMethods.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-semibold">Installation</h4>
          <ul className="mt-3 space-y-2">
            {tool.installMethods.map((method) => (
              <li
                key={method.label}
                className="bg-muted/30 flex items-center justify-between gap-2 rounded-md px-3 py-2.5"
              >
                <div className="min-w-0">
                  <p className="text-xs font-medium">{method.label}</p>
                  <code className="mt-0.5 block truncate font-mono text-xs text-foreground/90">
                    {method.command}
                  </code>
                </div>
                <CopyButton text={method.command} />
              </li>
            ))}
          </ul>
        </div>
      )}

      {tool.setupNotes && tool.setupNotes.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-semibold">How it&rsquo;s configured</h4>
          <ul className="mt-3 space-y-3">
            {tool.setupNotes.map((note) => (
              <li key={note.label}>
                <span className="text-sm font-medium">{note.label}</span>
                <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                  {note.description}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {tool.commonCommands && tool.commonCommands.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-semibold">Common commands</h4>
          <ul className="mt-3 space-y-2">
            {tool.commonCommands.map((cmd) => (
              <li
                key={cmd.command}
                className="bg-muted/30 flex items-center justify-between gap-2 rounded-md px-3 py-2.5"
              >
                <div className="min-w-0">
                  <code className="block truncate font-mono text-xs text-foreground/90">
                    {cmd.command}
                  </code>
                  <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                    {cmd.description}
                  </p>
                </div>
                <CopyButton text={cmd.command} />
              </li>
            ))}
          </ul>
        </div>
      )}

      {tool.recommendedStructure && (
        <div className="mt-6">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-sm font-semibold">Recommended structure</h4>
            <CopyButton text={tool.recommendedStructure} />
          </div>
          <pre className="bg-muted mt-2 overflow-x-auto rounded-md px-3.5 py-3">
            <code className="font-mono text-xs leading-relaxed text-foreground/90">
              {tool.recommendedStructure}
            </code>
          </pre>
        </div>
      )}

      {tool.bestPractices.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-semibold">Best practices</h4>
          <div className="mt-3 space-y-2">
            {tool.bestPractices.map((tip) => (
              <div
                key={tip}
                className="border-primary/20 flex items-start gap-3 rounded-md border bg-[color-mix(in_oklch,var(--primary)_5%,var(--card))] px-4 py-3"
              >
                <span
                  className="bg-primary/15 flex size-6 shrink-0 items-center justify-center rounded-full"
                  aria-hidden="true"
                >
                  <Lightbulb className="text-primary size-3.5" />
                </span>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {tip}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
