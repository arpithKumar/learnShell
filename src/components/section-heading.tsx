import type { LucideIcon } from "lucide-react";

export function SectionHeading({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span
        className="bg-primary/10 flex size-9 shrink-0 items-center justify-center rounded-full"
        aria-hidden="true"
      >
        <Icon className="text-primary size-4" />
      </span>
      <div>
        <h2 className="text-xl font-bold tracking-tight">{title}</h2>
        <p className="text-muted-foreground mt-1 text-sm">{description}</p>
      </div>
    </div>
  );
}
