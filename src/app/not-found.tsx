import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-24 text-center">
      <div className="w-full max-w-md overflow-hidden rounded-lg border text-left shadow-sm">
        <div className="bg-muted/40 flex items-center gap-2 border-b px-3 py-2">
          <span className="size-2 rounded-full bg-red-400/70" />
          <span className="size-2 rounded-full bg-yellow-400/70" />
          <span className="size-2 rounded-full bg-green-400/70" />
          <span className="text-muted-foreground ml-1 text-xs font-medium">
            shell
          </span>
        </div>
        <div className="bg-card px-4 py-3 font-mono text-sm">
          <p>
            <span className="text-primary">$</span> cd {`"this page"`}
          </p>
          <p className="text-muted-foreground mt-2">
            bash: cd: this page: No such file or directory
          </p>
        </div>
      </div>

      <h1 className="mt-8 text-3xl font-bold tracking-tight">
        404 — page not found
      </h1>
      <p className="text-muted-foreground mt-3 max-w-md">
        Whatever you were looking for isn&apos;t at this path. It might have
        moved, or the link might just be wrong.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/catalogue"
          className="bg-primary text-primary-foreground inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium outline-none transition-opacity hover:opacity-90 focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <Compass className="size-3.5" aria-hidden="true" />
          Browse the catalogue
        </Link>
        <Link
          href="/"
          className="text-muted-foreground hover:border-primary/50 hover:text-foreground inline-flex items-center gap-1.5 rounded-full border border-foreground/15 px-4 py-2 text-sm font-medium outline-none transition-colors focus-visible:border-primary/50 focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          Back home
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
