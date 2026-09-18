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
    <Card className="animate-slide-up">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <CardTitle>{kpi.title}</CardTitle>
        <Badge variant={STATUS_BADGE_VARIANT[kpi.status]}>{STATUS_LABEL[kpi.status]}</Badge>
      </CardHeader>
      <CardContent>
        <div className="font-mono text-2xl font-semibold tabular-nums">{kpi.formattedValue}</div>
        <div className="mt-2 flex items-center gap-1 text-xs">
          <TrendIcon
            className={cn("h-3.5 w-3.5", kpi.trend.isPositive ? "text-success" : "text-destructive")}
            aria-hidden
          />
          <span className={cn("font-mono tabular-nums", kpi.trend.isPositive ? "text-success" : "text-destructive")}>
            {kpi.trend.percentageChange > 0 ? "+" : ""}
            {kpi.trend.percentageChange.toFixed(1)}%
          </span>
          <span className="text-muted-foreground">{kpi.trend.timeframeLabel}</span>
        </div>
        <CardDescription className="mt-3">{kpi.description}</CardDescription>
      </CardContent>
    </Card>
  );
}
