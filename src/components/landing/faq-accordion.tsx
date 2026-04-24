"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function FaqAccordion({
  items,
}: {
  items: { q: string; a: string }[];
}) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <div className="divide-y divide-border rounded-xl border border-border bg-card">
      {items.map((item, i) => {
        const isOpen = openIdx === i;
        return (
          <button
            key={i}
            type="button"
            onClick={() => setOpenIdx(isOpen ? null : i)}
            className="flex w-full flex-col items-start gap-2 px-5 py-4 text-left transition hover:bg-accent/40"
          >
            <div className="flex w-full items-center gap-3">
              <span className="flex-1 font-medium">{item.q}</span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300",
                  isOpen && "rotate-180 text-primary",
                )}
              />
            </div>
            <div
              className={cn(
                "grid w-full overflow-hidden transition-all duration-300",
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
              )}
            >
              <div className="min-h-0">
                <p className="pt-1 text-sm leading-relaxed text-muted-foreground">
                  {item.a}
                </p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
