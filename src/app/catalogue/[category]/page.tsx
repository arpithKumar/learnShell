import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllCommands,
  getCategoryCounts,
  getDifficultyCounts,
} from "@/lib/content/loader";
import { CatalogueGrid } from "@/components/catalogue-grid";

export function generateStaticParams() {
  return getCategoryCounts().map(({ category }) => ({ category }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const title = category.replace(/-/g, " ");

  return {
    title,
    description: `Browse every ${title} command in the catalogue.`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const commands = getAllCommands();
  const categories = getCategoryCounts();
  const difficulties = getDifficultyCounts();

  if (!categories.some((c) => c.category === category)) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Link
        href="/catalogue"
        className="text-muted-foreground text-sm hover:text-foreground"
      >
        ← All categories
      </Link>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">{category}</h1>
      <p className="text-muted-foreground mb-8 mt-2">
        Browsing the <span className="font-medium">{category}</span> category —
        switch to any other category below.
      </p>

      <Suspense fallback={null}>
        <CatalogueGrid
          commands={commands}
          categories={categories}
          difficulties={difficulties}
          initialCategory={category}
        />
      </Suspense>
    </div>
  );
}
