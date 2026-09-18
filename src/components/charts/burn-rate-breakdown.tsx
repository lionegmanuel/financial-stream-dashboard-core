"use client";

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/financial-math";
import type { BurnRateCategoryBreakdown } from "@/lib/schemas";

const BAR_COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--destructive))",
  "hsl(var(--warning))",
  "hsl(var(--success))",
  "hsl(var(--muted-foreground))"
];

interface BreakdownTooltipPayloadItem {
  payload: BurnRateCategoryBreakdown;
}

function BreakdownTooltip({ active, payload }: { active?: boolean; payload?: BreakdownTooltipPayloadItem[] }) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }
  const item = payload[0]!.payload;

  return (
    <div className="rounded-md border border-border bg-popover p-3 text-xs shadow-md">
      <p className="mb-1 font-medium text-popover-foreground">{item.label}</p>
      <p className="font-mono tabular-nums">{formatCurrency(item.totalAmount, "USD")}</p>
      <p className="text-muted-foreground">{item.percentageOfTotal.toFixed(1)}% del total</p>
    </div>
  );
}

export function BurnRateBreakdownChart({ breakdown }: { breakdown: BurnRateCategoryBreakdown[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base text-foreground">Desglose de Quema por Categoria</CardTitle>
        <p className="text-xs text-muted-foreground">Gasto operativo del ultimo mes cerrado</p>
      </CardHeader>
      <CardContent>
        <div className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={breakdown} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
              <XAxis
                type="number"
                tickFormatter={(value: number) => `${Math.round(value / 1000)}k`}
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                type="category"
                dataKey="label"
                width={140}
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<BreakdownTooltip />} cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }} />
              <Bar dataKey="totalAmount" radius={[0, 4, 4, 0]}>
                {breakdown.map((entry, index) => (
                  <Cell key={entry.category} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
