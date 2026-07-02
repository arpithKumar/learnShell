"use client";

import Link from "next/link";
import { Check, Grid2x2, X } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { CATEGORY_DOT_CLASS, CATEGORY_LABEL } from "@/lib/ai-tool-category";
import type { AIToolEntry } from "@/lib/content/ai-tools";

function SupportBadge({ supported }: { supported: boolean }) {
  return supported ? (
    <Badge className="gap-1">
      <Check className="size-3" aria-hidden="true" />
      Yes
    </Badge>
  ) : (
    <Badge variant="outline" className="text-muted-foreground gap-1">
      <X className="size-3" aria-hidden="true" />
      No
    </Badge>
  );
}

export function AIToolComparisonTable({ tools }: { tools: AIToolEntry[] }) {
  return (
    <div className="bg-card overflow-hidden rounded-xl border">
      <Accordion defaultValue={["comparison-table"]}>
        <AccordionItem value="comparison-table">
          <AccordionTrigger className="rounded-none px-5 py-4 hover:no-underline focus-visible:border-transparent focus-visible:ring-0">
            <span className="flex items-center gap-2.5 text-sm font-semibold">
              <Grid2x2 className="text-primary size-4" aria-hidden="true" />
              Comparison table
              <span className="text-muted-foreground font-normal">
                ({tools.length} tools)
              </span>
            </span>
          </AccordionTrigger>
          <AccordionContent className="px-0 pb-0">
            <div className="overflow-x-auto border-t">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-muted-foreground border-b text-xs tracking-wide uppercase">
                    <th scope="col" className="px-4 py-3 font-medium">
                      Tool
                    </th>
                    <th scope="col" className="px-4 py-3 font-medium">
                      Category
                    </th>
                    <th scope="col" className="px-4 py-3 font-medium">
                      Reads project config?
                    </th>
                    <th scope="col" className="px-4 py-3 font-medium">
                      MCP support
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-border divide-y">
                  {tools.map((tool) => {
                    const hasConfig = tool.configFiles.length > 0;
                    const hasMcp = tool.features.some((f) =>
                      f.toLowerCase().includes("mcp"),
                    );
                    return (
                      <tr
                        key={tool.slug}
                        className="hover:bg-muted/40 transition-colors"
                      >
                        <th scope="row" className="px-4 py-3 font-medium">
                          <Link
                            href={`/ai-tools?tool=${tool.slug}#full-reference`}
                            className="hover:text-primary hover:underline"
                          >
                            {tool.name}
                          </Link>
                        </th>
                        <td className="text-muted-foreground px-4 py-3">
                          <span className="inline-flex items-center gap-1.5">
                            <span
                              className={`size-1.5 shrink-0 rounded-full ${CATEGORY_DOT_CLASS[tool.category]}`}
                              aria-hidden="true"
                            />
                            {CATEGORY_LABEL[tool.category]}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <SupportBadge supported={hasConfig} />
                        </td>
                        <td className="px-4 py-3">
                          <SupportBadge supported={hasMcp} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
