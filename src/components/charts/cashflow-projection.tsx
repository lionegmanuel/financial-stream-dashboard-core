"use client";

import { useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScenarioSelector } from "@/components/dashboard/scenario-selector";
import { DateRangeFilter } from "@/components/dashboard/date-range-filter";
import { formatCurrency, projectScenarioCashflow } from "@/lib/financial-math";
import type { CashflowDataPoint, CashflowScenario, DateRangePreset } from "@/lib/schemas";

const RANGE_TO_DAYS: Record<DateRangePreset, number> = {
  "30d": 30,
  "60d": 60,
  "90d": 90
};

interface CashflowTooltipPayloadItem {
  dataKey: string;
  value: number;
  color: string;
  name: string;
}

function CashflowTooltip({
  active,
  payload,
  label
}: {
  active?: boolean;
  payload?: CashflowTooltipPayloadItem[];
  label?: string;
}) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  return (
    <div className="rounded-xl border border-white/[0.08] bg-[#0f172a]/95 p-3 text-xs shadow-xl shadow-black/60 backdrop-blur-md">
      <p className="mb-2 font-semibold text-[#f8fafc]">{label}</p>
      <div className="flex flex-col gap-1.5">
        {payload.map((item) => (
          <div key={item.dataKey} className="flex items-center justify-between gap-5 font-mono tabular-nums">
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
              {item.name}
            </span>
            <span className="font-semibold text-[#f8fafc]">{formatCurrency(item.value, "USD")}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CashflowProjectionChart({ baseCashflow }: { baseCashflow: CashflowDataPoint[] }) {
  const [scenario, setScenario] = useState<CashflowScenario>("base");
  const [range, setRange] = useState<DateRangePreset>("90d");

  const chartData = useMemo(() => {
    const projected = projectScenarioCashflow(baseCashflow, scenario);
    const days = RANGE_TO_DAYS[range];
    return projected.slice(0, days);
  }, [baseCashflow, scenario, range]);

  const endingBalance = chartData[chartData.length - 1]?.closingBalance ?? 0;

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="text-base font-bold tracking-tight text-[#f8fafc]">Proyección de Flujo de Caja</CardTitle>
          <p className="mt-1 font-mono text-3xl font-bold tracking-tight text-[#f8fafc] tabular-nums">
            {formatCurrency(endingBalance, "USD")}
          </p>
          <p className="mt-0.5 text-xs text-slate-400">Saldo proyectado al final del período seleccionado</p>
        </div>
        <div className="flex flex-col items-start gap-2 sm:items-end">
          <ScenarioSelector value={scenario} onChange={setScenario} />
          <DateRangeFilter value={range} onChange={setRange} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="inflowsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="outflowsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.06)" vertical={false} />
              <XAxis
                dataKey="date"
                tickFormatter={(value: string) => value.slice(5)}
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                tickLine={false}
                axisLine={false}
                minTickGap={32}
              />
              <YAxis
                tickFormatter={(value: number) => `${Math.round(value / 1000)}k`}
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                tickLine={false}
                axisLine={false}
                width={48}
              />
              <Tooltip content={<CashflowTooltip />} />
              <Area
                type="monotone"
                dataKey="closingBalance"
                name="Saldo Proyectado"
                stroke="#38bdf8"
                fill="url(#balanceGradient)"
                strokeWidth={2.5}
              />
              <Area
                type="monotone"
                dataKey="inflows"
                name="Cobranzas"
                stroke="#10b981"
                fill="url(#inflowsGradient)"
                strokeWidth={1.75}
              />
              <Area
                type="monotone"
                dataKey="outflows"
                name="Egresos"
                stroke="#ef4444"
                fill="url(#outflowsGradient)"
                strokeWidth={1.75}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <ChartLegend />
      </CardContent>
    </Card>
  );
}

function ChartLegend() {
  const items = [
    { label: "Saldo Proyectado", color: "#38bdf8" },
    { label: "Cobranzas", color: "#10b981" },
    { label: "Egresos", color: "#ef4444" }
  ];

  return (
    <div className="mt-4 flex items-center gap-5 text-xs text-slate-400">
      {items.map((item) => (
        <span key={item.label} className="flex items-center gap-1.5 font-medium">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
          {item.label}
        </span>
      ))}
    </div>
  );
}
