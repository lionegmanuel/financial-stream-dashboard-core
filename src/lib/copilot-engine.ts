import { formatCurrency } from "@/lib/financial-math";
import type { CashflowScenario, FinancialKpi } from "@/lib/schemas";

const SCENARIO_LABEL: Record<CashflowScenario, string> = {
  base: "base",
  optimistic: "optimista (Best Case)",
  pessimistic: "pesimista (Worst Case)"
};

export interface CopilotAnomaly {
  id: string;
  severity: "info" | "warning" | "critical";
  message: string;
}

export function detectAnomalies(metrics: readonly FinancialKpi[]): CopilotAnomaly[] {
  const anomalies: CopilotAnomaly[] = [];

  const runway = metrics.find((m) => m.id === "runway");
  if (runway && runway.status !== "healthy") {
    anomalies.push({
      id: "runway-risk",
      severity: runway.status === "critical" ? "critical" : "warning",
      message: `Runway en ${runway.formattedValue}: revisar el plan de reduccion de gasto operativo.`
    });
  }

  const netBurn = metrics.find((m) => m.id === "net_burn");
  if (netBurn && netBurn.status === "critical") {
    anomalies.push({
      id: "burn-spike",
      severity: "critical",
      message: `Net Burn Rate elevado (${netBurn.formattedValue}): los gastos superan holgadamente los ingresos del mes.`
    });
  }

  const cashBalance = metrics.find((m) => m.id === "cash_balance");
  if (cashBalance && cashBalance.status === "critical") {
    anomalies.push({
      id: "cash-negative",
      severity: "critical",
      message: "El saldo de caja proyectado cae por debajo de cero en el periodo analizado."
    });
  }

  return anomalies;
}

export function buildCopilotAnalysis(
  metrics: readonly FinancialKpi[],
  scenario: CashflowScenario,
  userQuery: string
): string {
  const mrr = metrics.find((m) => m.id === "mrr");
  const runway = metrics.find((m) => m.id === "runway");
  const netBurn = metrics.find((m) => m.id === "net_burn");
  const cashBalance = metrics.find((m) => m.id === "cash_balance");
  const anomalies = detectAnomalies(metrics);

  const parts: string[] = [];

  parts.push(
    `Analizando el escenario ${SCENARIO_LABEL[scenario]}: el MRR actual es ${mrr?.formattedValue ?? "N/D"} con una variacion de ${mrr?.trend.percentageChange.toFixed(1) ?? "0"}% respecto al mes anterior.`
  );

  if (netBurn) {
    parts.push(
      netBurn.currentValue > 0
        ? `El Net Burn Rate mensual es ${netBurn.formattedValue}, lo que implica un consumo activo de caja.`
        : "El flujo de caja del mes es positivo (default alive): los ingresos superan a los gastos operativos."
    );
  }

  if (runway) {
    parts.push(`Con el ritmo de quema promedio de los ultimos 3 meses, el Runway proyectado es de ${runway.formattedValue}.`);
  }

  if (cashBalance) {
    parts.push(`El saldo de caja proyectado al cierre del periodo es ${cashBalance.formattedValue}.`);
  }

  if (anomalies.length > 0) {
    parts.push(`Detectamos ${anomalies.length} alerta(s): ${anomalies.map((a) => a.message).join(" ")}`);
  } else {
    parts.push("No se detectaron anomalias criticas en los indicadores actuales.");
  }

  if (scenario === "pessimistic") {
    parts.push(
      "Recomendacion: en el escenario pesimista, considera renegociar plazos de pago con proveedores de infraestructura y priorizar cobranza de cuentas vencidas."
    );
  } else if (scenario === "optimistic") {
    parts.push(
      "Recomendacion: en el escenario optimista, evalua reinvertir el excedente de caja en adquisicion (marketing_ads) para acelerar el crecimiento de MRR."
    );
  } else {
    parts.push("Recomendacion: mantener el monitoreo mensual del burn rate y revisar la concentracion de gastos en infraestructura y nomina.");
  }

  if (userQuery.trim().length > 0) {
    parts.push(`Respecto a tu consulta ("${userQuery.trim()}"): los datos anteriores reflejan el estado financiero mas reciente disponible para responderla.`);
  }

  return parts.join(" ");
}

export function formatMetricsSummary(metrics: readonly FinancialKpi[]): string {
  return metrics.map((m) => `${m.title}: ${formatCurrency(m.currentValue, m.currency)}`).join(" | ");
}
