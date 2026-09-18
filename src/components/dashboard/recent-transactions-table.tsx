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
        <CardTitle className="text-base text-foreground">Transacciones Recientes</CardTitle>
        <div className="flex items-center gap-1">
          {(["all", "income", "expense"] as const).map((option) => (
            <Button
              key={option}
              variant={filter === option ? "secondary" : "ghost"}
              size="sm"
              onClick={() => handleFilterChange(option)}
            >
              {option === "all" ? "Todas" : option === "income" ? "Ingresos" : "Egresos"}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground">
                <th className="pb-2 font-medium">Fecha</th>
                <th className="pb-2 font-medium">Descripcion</th>
                <th className="pb-2 font-medium">Categoria</th>
                <th className="pb-2 font-medium">Contraparte</th>
                <th className="pb-2 text-right font-medium">Monto</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map((transaction) => (
                <tr key={transaction.id} className="border-b border-border/60 last:border-0">
                  <td className="py-2.5 font-mono text-xs tabular-nums text-muted-foreground">{transaction.date}</td>
                  <td className="py-2.5">{transaction.description}</td>
                  <td className="py-2.5">
                    <Badge variant="outline">{CATEGORY_LABELS[transaction.category]}</Badge>
                  </td>
                  <td className="py-2.5 text-muted-foreground">{transaction.counterparty}</td>
                  <td
                    className={cn(
                      "py-2.5 text-right font-mono tabular-nums",
                      transaction.type === "income" ? "text-success" : "text-destructive"
                    )}
                  >
                    {transaction.type === "income" ? "+" : "-"}
                    {formatCurrency(transaction.amount, transaction.currency)}
                  </td>
                </tr>
              ))}
              {pageItems.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-muted-foreground">
                    No hay transacciones para este filtro.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Pagina {currentPage + 1} de {totalPages} ({filtered.length} registros)
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
