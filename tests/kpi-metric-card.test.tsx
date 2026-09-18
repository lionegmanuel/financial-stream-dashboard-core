import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { KpiMetricCard } from "@/components/dashboard/kpi-metric-card";
import type { FinancialKpi } from "@/lib/schemas";

const baseKpi: FinancialKpi = {
  id: "mrr",
  title: "MRR (Ingreso Recurrente Mensual)",
  currentValue: 42000,
  formattedValue: "$42,000",
  currency: "USD",
  trend: { percentageChange: 12.5, isPositive: true, timeframeLabel: "vs mes anterior" },
  status: "healthy",
  description: "Ingreso recurrente mensual proveniente de suscripciones activas."
};

describe("KpiMetricCard", () => {
  it("renders the title and formatted value", () => {
    render(<KpiMetricCard kpi={baseKpi} />);
    expect(screen.getByText(baseKpi.title)).toBeInTheDocument();
    expect(screen.getByText(baseKpi.formattedValue)).toBeInTheDocument();
  });

  it("renders the healthy status badge", () => {
    render(<KpiMetricCard kpi={baseKpi} />);
    expect(screen.getByText("Saludable")).toBeInTheDocument();
  });

  it("renders the critical status badge for critical KPIs", () => {
    const criticalKpi: FinancialKpi = { ...baseKpi, status: "critical" };
    render(<KpiMetricCard kpi={criticalKpi} />);
    expect(screen.getByText("Critico")).toBeInTheDocument();
  });

  it("shows a positive trend indicator with the correct sign", () => {
    render(<KpiMetricCard kpi={baseKpi} />);
    expect(screen.getByText("+12.5%")).toBeInTheDocument();
  });
});
