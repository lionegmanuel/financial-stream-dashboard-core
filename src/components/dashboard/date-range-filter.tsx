"use client";

import { cn } from "@/lib/utils";
import type { DateRangePreset } from "@/lib/schemas";

const RANGES: { value: DateRangePreset; label: string }[] = [
  { value: "30d", label: "30 dias" },
  { value: "60d", label: "60 dias" },
  { value: "90d", label: "90 dias" }
];

interface DateRangeFilterProps {
  value: DateRangePreset;
  onChange: (range: DateRangePreset) => void;
}

export function DateRangeFilter({ value, onChange }: DateRangeFilterProps) {
  return (
    <div className="inline-flex items-center rounded-md border border-border bg-muted/50 p-1" role="group" aria-label="Selector de periodo">
      {RANGES.map((range) => (
        <button
          key={range.value}
          type="button"
          onClick={() => onChange(range.value)}
          className={cn(
            "rounded-sm px-3 py-1.5 text-xs font-medium transition-colors",
            value === range.value ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
          )}
          aria-pressed={value === range.value}
        >
          {range.label}
        </button>
      ))}
    </div>
  );
}
