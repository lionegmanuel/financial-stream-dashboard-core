"use client";

import { cn } from "@/lib/utils";
import type { CashflowScenario } from "@/lib/schemas";

const SCENARIOS: { value: CashflowScenario; label: string }[] = [
  { value: "pessimistic", label: "Worst" },
  { value: "base", label: "Base" },
  { value: "optimistic", label: "Best" }
];

const ACTIVE_CLASS: Record<CashflowScenario, string> = {
  base: "bg-primary text-primary-foreground",
  optimistic: "bg-success text-success-foreground",
  pessimistic: "bg-destructive text-destructive-foreground"
};

interface ScenarioSelectorProps {
  value: CashflowScenario;
  onChange: (scenario: CashflowScenario) => void;
}

export function ScenarioSelector({ value, onChange }: ScenarioSelectorProps) {
  return (
    <div className="inline-flex items-center rounded-md border border-border bg-muted/50 p-1" role="group" aria-label="Selector de escenario">
      {SCENARIOS.map((scenario) => (
        <button
          key={scenario.value}
          type="button"
          onClick={() => onChange(scenario.value)}
          className={cn(
            "rounded-sm px-3 py-1.5 text-xs font-medium transition-colors",
            value === scenario.value ? ACTIVE_CLASS[scenario.value] : "text-muted-foreground hover:text-foreground"
          )}
          aria-pressed={value === scenario.value}
        >
          {scenario.label}
        </button>
      ))}
    </div>
  );
}
