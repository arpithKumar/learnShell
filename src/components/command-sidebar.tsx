import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { CommandEntry } from "@/lib/content/schema";

function StatRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

export function CommandSidebar({
  command,
  relatedCommands,
}: {
  command: CommandEntry;
  relatedCommands: CommandEntry[];
}) {
  return (
    <aside id="tour-sidebar" className="space-y-6">
      <div className="rounded-xl border p-5">
        <h2 className="text-sm font-semibold">At a glance</h2>
        <div className="mt-3 space-y-2.5">
          <StatRow label="Flags documented" value={command.flags.length} />
          <StatRow label="Examples" value={command.examples.length} />
          <StatRow label="Practical tips" value={command.tips.length} />
          <StatRow label="Common pitfalls" value={command.pitfalls.length} />
        </div>
        <div className="mt-4 border-t pt-4">
          <p className="text-muted-foreground mb-2 text-sm">Works in</p>
          <div className="flex flex-wrap gap-1.5">
            {command.shells.map((s) => (
              <Badge key={s} variant="outline" className="font-mono text-xs">
                {s}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {relatedCommands.length > 0 && (
        <div className="rounded-xl border p-5">
          <h2 className="text-sm font-semibold">Related commands</h2>
          <div className="mt-3 space-y-1">
            {relatedCommands.map((related) => (
              <Link
                key={related.slug}
                href={`/command/${related.slug}`}
                className="group flex items-center justify-between gap-2 rounded-md px-2 py-1.5 -mx-2 text-sm transition-colors hover:bg-accent/50"
              >
                <span className="font-mono">{related.name}</span>
                <ArrowRight
                  className="text-muted-foreground size-3.5 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
                  aria-hidden="true"
                />
              </Link>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
