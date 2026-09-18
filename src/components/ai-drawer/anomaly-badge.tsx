"use client";

import { AlertTriangle, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";
import type { CopilotAnomaly } from "@/lib/copilot-engine";

interface AnomalyAlertPillProps {
  anomalies: CopilotAnomaly[];
  onClick: () => void;
}

export function AnomalyAlertPill({ anomalies, onClick }: AnomalyAlertPillProps) {
  const hasCritical = anomalies.some((a) => a.severity === "critical");
  const hasAnomalies = anomalies.length > 0;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium shadow-lg transition-transform hover:scale-105",
        hasCritical
          ? "border-destructive/40 bg-destructive/10 text-destructive"
          : hasAnomalies
            ? "border-warning/40 bg-warning/10 text-warning"
            : "border-primary/40 bg-primary/10 text-primary"
      )}
    >
      {hasAnomalies ? <AlertTriangle className="h-4 w-4" aria-hidden /> : <Sparkles className="h-4 w-4" aria-hidden />}
      {hasAnomalies ? `${anomalies.length} alerta(s) financiera(s)` : "AI Copilot"}
    </button>
  );
}
