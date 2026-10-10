"use client";

import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/financial-math";
import { cn } from "@/lib/utils";
import type { TransactionRecord } from "@/lib/schemas";

const PAGE_SIZE = 8;

const CATEGORY_LABELS: Record<TransactionRecord["category"], string> = {
  revenue_subscription: "Suscripcion",
  revenue_services: "Servicios",
  payroll: "Nomina",
  infrastructure_servers: "Infraestructura",
  marketing_ads: "Marketing",
  software_licenses: "Licencias",
  office_and_operations: "Oficina"
};

type FilterType = "all" | "income" | "expense";

export function RecentTransactionsTable({ transactions }: { transactions: TransactionRecord[] }) {
  const [filter, setFilter] = useState<FilterType>("all");
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    const sorted = [...transactions].sort((a, b) => b.date.localeCompare(a.date));
    if (filter === "all") return sorted;
    return sorted.filter((t) => t.type === filter);
  }, [transactions, filter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages - 1);
  const pageItems = filtered.slice(currentPage * PAGE_SIZE, currentPage * PAGE_SIZE + PAGE_SIZE);

  function handleFilterChange(next: FilterType) {
    setFilter(next);
    setPage(0);
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base font-bold tracking-tight text-[#f8fafc]">Transacciones Recientes</CardTitle>
        <div className="inline-flex items-center rounded-xl border border-white/[0.08] bg-white/[0.03] p-1">
          {(["all", "income", "expense"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => handleFilterChange(option)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200",
                filter === option
                  ? "border border-white/[0.08] bg-white/10 font-semibold text-[#f8fafc] shadow-sm"
                  : "text-slate-400 hover:text-[#f8fafc]"
              )}
            >
              {option === "all" ? "Todas" : option === "income" ? "Ingresos" : "Egresos"}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.08] text-left text-xs font-semibold text-slate-400">
                <th className="pb-3 font-semibold">Fecha</th>
                <th className="pb-3 font-semibold">Descripción</th>
                <th className="pb-3 font-semibold">Categoría</th>
                <th className="pb-3 font-semibold">Contraparte</th>
                <th className="pb-3 text-right font-semibold">Monto</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map((transaction) => (
                <tr key={transaction.id} className="border-b border-white/[0.05] transition-colors hover:bg-white/[0.02] last:border-0">
                  <td className="py-3 font-mono text-xs tabular-nums text-slate-400">{transaction.date}</td>
                  <td className="py-3 font-medium text-slate-200">{transaction.description}</td>
                  <td className="py-3">
                    <Badge variant="outline">{CATEGORY_LABELS[transaction.category]}</Badge>
                  </td>
                  <td className="py-3 text-slate-400">{transaction.counterparty}</td>
                  <td
                    className={cn(
                      "py-3 text-right font-mono font-bold tabular-nums",
                      transaction.type === "income" ? "text-emerald-400" : "text-rose-400"
                    )}
                  >
                    {transaction.type === "income" ? "+" : "-"}
                    {formatCurrency(transaction.amount, transaction.currency)}
                  </td>
                </tr>
              ))}
              {pageItems.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    No hay transacciones para este filtro.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
          <span>
            Página {currentPage + 1} de {totalPages} ({filtered.length} registros)
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages - 1}
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            >
              Siguiente
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
