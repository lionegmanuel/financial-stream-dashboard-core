"use client";

import { cn } from "@/lib/utils";
import type { CashflowScenario } from "@/lib/schemas";

const SCENARIOS: { value: CashflowScenario; label: string }[] = [
  { value: "pessimistic", label: "Worst" },
  { value: "base", label: "Base" },
  { value: "optimistic", label: "Best" }
];

const ACTIVE_CLASS: Record<CashflowScenario, string> = {
  base: "bg-[#38bdf8] text-[#0b0f17] font-semibold shadow-sm shadow-sky-950/20",
  optimistic: "bg-[#10b981] text-[#0b0f17] font-semibold shadow-sm shadow-emerald-950/20",
  pessimistic: "bg-[#ef4444] text-white font-semibold shadow-sm shadow-rose-950/20"
};

interface ScenarioSelectorProps {
  value: CashflowScenario;
  onChange: (scenario: CashflowScenario) => void;
}

export function ScenarioSelector({ value, onChange }: ScenarioSelectorProps) {
  return (
    <div className="inline-flex items-center rounded-xl border border-white/[0.08] bg-white/[0.03] p-1" role="group" aria-label="Selector de escenario">
      {SCENARIOS.map((scenario) => (
        <button
          key={scenario.value}
          type="button"
          onClick={() => onChange(scenario.value)}
          className={cn(
            "rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200",
            value === scenario.value ? ACTIVE_CLASS[scenario.value] : "text-slate-400 hover:text-[#f8fafc]"
          )}
          aria-pressed={value === scenario.value}
        >
          {scenario.label}
        </button>
      ))}
    </div>
  );
}
