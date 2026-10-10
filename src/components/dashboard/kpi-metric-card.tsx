import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { FinancialKpi } from "@/lib/schemas";

const STATUS_BADGE_VARIANT: Record<FinancialKpi["status"], "success" | "warning" | "destructive"> = {
  healthy: "success",
  warning: "warning",
  critical: "destructive"
};

const STATUS_LABEL: Record<FinancialKpi["status"], string> = {
  healthy: "Saludable",
  warning: "Atencion",
  critical: "Critico"
};

export function KpiMetricCard({ kpi }: { kpi: FinancialKpi }) {
  const TrendIcon = kpi.trend.isPositive ? ArrowUpRight : ArrowDownRight;

  return (
    <Card className="animate-slide-up hover:border-white/[0.15] hover:shadow-xl hover:shadow-black/50">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
        <CardTitle className="text-xs font-semibold tracking-wider text-slate-400">{kpi.title}</CardTitle>
        <Badge variant={STATUS_BADGE_VARIANT[kpi.status]}>{STATUS_LABEL[kpi.status]}</Badge>
      </CardHeader>
      <CardContent>
        <div className="font-mono text-3xl font-bold tracking-tight text-[#f8fafc] tabular-nums">{kpi.formattedValue}</div>
        <div className="mt-2.5 flex items-center gap-1.5 text-xs">
          <TrendIcon
            className={cn("h-4 w-4", kpi.trend.isPositive ? "text-emerald-400" : "text-rose-400")}
            aria-hidden
          />
          <span className={cn("font-mono font-semibold tabular-nums", kpi.trend.isPositive ? "text-emerald-400" : "text-rose-400")}>
            {kpi.trend.percentageChange > 0 ? "+" : ""}
            {kpi.trend.percentageChange.toFixed(1)}%
          </span>
          <span className="text-slate-400">{kpi.trend.timeframeLabel}</span>
        </div>
        <CardDescription className="mt-3 leading-relaxed text-slate-400">{kpi.description}</CardDescription>
      </CardContent>
    </Card>
  );
}
