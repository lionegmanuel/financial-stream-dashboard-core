import type { CashflowDataPoint, CashflowScenario } from "@/lib/schemas";

export function calculateNetBurnRate(inflows: number, outflows: number): number {
  const burn = outflows - inflows;
  return burn > 0 ? burn : 0;
}

export function calculateRunway(cashBalance: number, averageMonthlyBurn: number): number {
  if (averageMonthlyBurn <= 0) {
    return Infinity;
  }
  if (cashBalance <= 0) {
    return 0;
  }
  return cashBalance / averageMonthlyBurn;
}

export function calculateAverageMonthlyBurn(lastThreeMonthsBurn: readonly number[]): number {
  if (lastThreeMonthsBurn.length === 0) {
    return 0;
  }
  const sum = lastThreeMonthsBurn.reduce((total, value) => total + value, 0);
  return sum / lastThreeMonthsBurn.length;
}

const SCENARIO_MULTIPLIERS: Record<
  CashflowScenario,
  { inflowMultiplier: number; outflowMultiplier: number; dsoShiftDays: number }
> = {
  base: { inflowMultiplier: 1, outflowMultiplier: 1, dsoShiftDays: 0 },
  optimistic: { inflowMultiplier: 1.2, outflowMultiplier: 1, dsoShiftDays: -10 },
  pessimistic: { inflowMultiplier: 0.75, outflowMultiplier: 1.1, dsoShiftDays: 30 }
};

export function projectScenarioCashflow(
  baseData: readonly CashflowDataPoint[],
  scenario: CashflowScenario
): CashflowDataPoint[] {
  const multiplier = SCENARIO_MULTIPLIERS[scenario];
  let runningBalance = baseData.length > 0 ? baseData[0]!.closingBalance - baseData[0]!.netCashflow : 0;

  return baseData.map((point) => {
    const inflows = round2(point.inflows * multiplier.inflowMultiplier);
    const outflows = round2(point.outflows * multiplier.outflowMultiplier);
    const netCashflow = round2(inflows - outflows);
    runningBalance = round2(runningBalance + netCashflow);

    return {
      date: point.date,
      inflows,
      outflows,
      netCashflow,
      closingBalance: runningBalance,
      scenario
    };
  });
}

export function calculateMoM(current: number, previous: number): number {
  if (previous === 0) {
    return current === 0 ? 0 : 100;
  }
  return round2(((current - previous) / Math.abs(previous)) * 100);
}

export function formatCurrency(value: number, currency: string, locale = "en-US"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: value >= 1000 ? 0 : 2
  }).format(value);
}

export function formatRunwayMonths(months: number): string {
  if (!Number.isFinite(months)) {
    return "Infinito";
  }
  if (months >= 120) {
    return "120+ meses";
  }
  return `${months.toFixed(1)} meses`;
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}
