"use client";

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/financial-math";
import type { BurnRateCategoryBreakdown } from "@/lib/schemas";

const BAR_COLORS = [
  "#10b981", // Verde Esmeralda (Acento Primario)
  "#38bdf8", // Azul Cielo Eléctrico (Acento Secundario)
  "#f59e0b", // Ámbar
  "#ef4444", // Alerta / Negativo
  "#818cf8", // Índigo suave
  "#94a3b8"  // Muted Slate
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
    <div className="rounded-xl border border-white/[0.08] bg-[#0f172a]/95 p-3 text-xs shadow-xl shadow-black/60 backdrop-blur-md">
      <p className="mb-1 font-semibold text-[#f8fafc]">{item.label}</p>
      <p className="font-mono text-base font-bold text-[#f8fafc] tabular-nums">{formatCurrency(item.totalAmount, "USD")}</p>
      <p className="mt-0.5 text-xs text-slate-400">{item.percentageOfTotal.toFixed(1)}% del gasto operativo total</p>
    </div>
  );
}

export function BurnRateBreakdownChart({ breakdown }: { breakdown: BurnRateCategoryBreakdown[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-bold tracking-tight text-[#f8fafc]">Desglose de Quema por Categoría</CardTitle>
        <p className="text-xs text-slate-400">Gasto operativo del último mes cerrado</p>
      </CardHeader>
      <CardContent>
        <div className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={breakdown} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.06)" horizontal={false} />
              <XAxis
                type="number"
                tickFormatter={(value: number) => `${Math.round(value / 1000)}k`}
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                type="category"
                dataKey="label"
                width={140}
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<BreakdownTooltip />} cursor={{ fill: "rgba(255, 255, 255, 0.04)" }} />
              <Bar dataKey="totalAmount" radius={[0, 6, 6, 0]}>
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
