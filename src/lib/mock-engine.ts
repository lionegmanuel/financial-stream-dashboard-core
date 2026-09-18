import type {
  BurnRateCategoryBreakdown,
  CashflowDataPoint,
  FinancialKpi,
  TransactionCategory,
  TransactionRecord
} from "@/lib/schemas";
import {
  calculateAverageMonthlyBurn,
  calculateMoM,
  calculateNetBurnRate,
  calculateRunway,
  formatCurrency,
  formatRunwayMonths
} from "@/lib/financial-math";

const DEFAULT_SEED = 424242;

function mulberry32(seed: number): () => number {
  let state = seed;
  return function random(): number {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const EXPENSE_CATEGORIES: TransactionCategory[] = [
  "payroll",
  "infrastructure_servers",
  "marketing_ads",
  "software_licenses",
  "office_and_operations"
];

const CATEGORY_LABELS: Record<TransactionCategory, string> = {
  revenue_subscription: "Ingresos por Suscripcion",
  revenue_services: "Ingresos por Servicios",
  payroll: "Nomina",
  infrastructure_servers: "Infraestructura y Servidores",
  marketing_ads: "Marketing y Publicidad",
  software_licenses: "Licencias de Software",
  office_and_operations: "Oficina y Operaciones"
};

const COUNTERPARTIES: Record<TransactionCategory, string[]> = {
  revenue_subscription: ["Acme Corp", "Nimbus Labs", "Vertex Studio", "Orbital Systems"],
  revenue_services: ["Quantum Retail", "Helix Media", "Northgate Finance"],
  payroll: ["Nomina Interna"],
  infrastructure_servers: ["AWS", "Vercel", "Cloudflare"],
  marketing_ads: ["Google Ads", "Meta Ads", "LinkedIn Ads"],
  software_licenses: ["Figma", "Linear", "Notion", "GitHub"],
  office_and_operations: ["WeWork", "Staples", "Utilities Co."]
};

function pickFrom<T>(random: () => number, items: readonly T[]): T {
  const index = Math.floor(random() * items.length);
  return items[Math.min(index, items.length - 1)]!;
}

function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function uuidFromRandom(random: () => number): string {
  const hex = () => Math.floor(random() * 16).toString(16);
  const segment = (length: number) => Array.from({ length }, hex).join("");
  return `${segment(8)}-${segment(4)}-4${segment(3)}-a${segment(3)}-${segment(12)}`;
}

export function generateTransactionHistory(seed: number = DEFAULT_SEED): TransactionRecord[] {
  const random = mulberry32(seed);
  const transactions: TransactionRecord[] = [];
  const today = new Date();
  const monthsOfHistory = 12;

  for (let monthOffset = monthsOfHistory - 1; monthOffset >= 0; monthOffset -= 1) {
    const monthDate = new Date(today.getFullYear(), today.getMonth() - monthOffset, 1);
    const growthFactor = 1 + (monthsOfHistory - monthOffset) * 0.045;

    const subscriptionCount = 6 + Math.floor(random() * 4);
    for (let i = 0; i < subscriptionCount; i += 1) {
      const day = 1 + Math.floor(random() * 27);
      const amount = round2((800 + random() * 4200) * growthFactor);
      transactions.push({
        id: uuidFromRandom(random),
        date: toIsoDate(new Date(monthDate.getFullYear(), monthDate.getMonth(), day)),
        description: "Cobro de suscripcion recurrente",
        category: "revenue_subscription",
        amount,
        type: "income",
        currency: "USD",
        isRecurring: true,
        counterparty: pickFrom(random, COUNTERPARTIES.revenue_subscription)
      });
    }

    const servicesCount = 1 + Math.floor(random() * 3);
    for (let i = 0; i < servicesCount; i += 1) {
      const day = 1 + Math.floor(random() * 27);
      const amount = round2((1500 + random() * 6000) * growthFactor);
      transactions.push({
        id: uuidFromRandom(random),
        date: toIsoDate(new Date(monthDate.getFullYear(), monthDate.getMonth(), day)),
        description: "Proyecto de servicios profesionales",
        category: "revenue_services",
        amount,
        type: "income",
        currency: "USD",
        isRecurring: false,
        counterparty: pickFrom(random, COUNTERPARTIES.revenue_services)
      });
    }

    for (const category of EXPENSE_CATEGORIES) {
      const baseAmount = expenseBaseAmount(category);
      const occurrences = category === "payroll" ? 1 : 1 + Math.floor(random() * 2);
      for (let i = 0; i < occurrences; i += 1) {
        const day = 1 + Math.floor(random() * 27);
        const amount = round2((baseAmount / occurrences) * growthFactor * (0.85 + random() * 0.3));
        transactions.push({
          id: uuidFromRandom(random),
          date: toIsoDate(new Date(monthDate.getFullYear(), monthDate.getMonth(), day)),
          description: CATEGORY_LABELS[category],
          category,
          amount,
          type: "expense",
          currency: "USD",
          isRecurring: category === "payroll" || category === "infrastructure_servers" || category === "software_licenses",
          counterparty: pickFrom(random, COUNTERPARTIES[category])
        });
      }
    }
  }

  return transactions.sort((a, b) => a.date.localeCompare(b.date));
}

function expenseBaseAmount(category: TransactionCategory): number {
  switch (category) {
    case "payroll":
      return 42000;
    case "infrastructure_servers":
      return 6500;
    case "marketing_ads":
      return 9000;
    case "software_licenses":
      return 2200;
    case "office_and_operations":
      return 4800;
    default:
      return 1000;
  }
}

export function generateBaseCashflowSeries(
  transactions: readonly TransactionRecord[],
  seed: number = DEFAULT_SEED,
  projectionDays = 90
): CashflowDataPoint[] {
  const random = mulberry32(seed + 1);
  const monthlyIncome = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
  const monthlyExpense = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);
  const avgDailyInflow = monthlyIncome / 365;
  const avgDailyOutflow = monthlyExpense / 365;

  const series: CashflowDataPoint[] = [];
  let closingBalance = 185000;
  const today = new Date();

  for (let dayOffset = 0; dayOffset < projectionDays; dayOffset += 1) {
    const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() + dayOffset);
    const weekday = date.getDay();
    const weekdayFactor = weekday === 0 || weekday === 6 ? 0.4 : 1.05;
    const inflows = round2(avgDailyInflow * weekdayFactor * (0.8 + random() * 0.4));
    const outflows = round2(avgDailyOutflow * weekdayFactor * (0.85 + random() * 0.3));
    const netCashflow = round2(inflows - outflows);
    closingBalance = round2(closingBalance + netCashflow);

    series.push({
      date: toIsoDate(date),
      inflows,
      outflows,
      netCashflow,
      closingBalance,
      scenario: "base"
    });
  }

  return series;
}

export function generateFinancialKpis(
  transactions: readonly TransactionRecord[],
  baseCashflow: readonly CashflowDataPoint[]
): FinancialKpi[] {
  const monthlyBuckets = groupByMonth(transactions);
  const months = Object.keys(monthlyBuckets).sort();
  const lastMonth = months[months.length - 1];
  const previousMonth = months[months.length - 2];

  const lastMonthIncome = lastMonth ? sumByType(monthlyBuckets[lastMonth]!, "income") : 0;
  const lastMonthExpense = lastMonth ? sumByType(monthlyBuckets[lastMonth]!, "expense") : 0;
  const previousMonthIncome = previousMonth ? sumByType(monthlyBuckets[previousMonth]!, "income") : 0;

  const mrr = lastMonthIncome;
  const mrrTrend = calculateMoM(mrr, previousMonthIncome);

  const lastThreeMonths = months.slice(-3);
  const lastThreeMonthsBurn = lastThreeMonths.map((month) =>
    calculateNetBurnRate(sumByType(monthlyBuckets[month]!, "income"), sumByType(monthlyBuckets[month]!, "expense"))
  );
  const averageBurn = calculateAverageMonthlyBurn(lastThreeMonthsBurn);
  const netBurn = calculateNetBurnRate(lastMonthIncome, lastMonthExpense);
  const previousBurn = previousMonth
    ? calculateNetBurnRate(previousMonthIncome, sumByType(monthlyBuckets[previousMonth]!, "expense"))
    : netBurn;
  const burnTrend = calculateMoM(netBurn, previousBurn);

  const cashBalance = baseCashflow[baseCashflow.length - 1]?.closingBalance ?? 0;
  const previousBalance = baseCashflow[0]?.closingBalance ?? cashBalance;
  const cashTrend = calculateMoM(cashBalance, previousBalance);

  const runway = calculateRunway(cashBalance, averageBurn);

  return [
    {
      id: "mrr",
      title: "MRR (Ingreso Recurrente Mensual)",
      currentValue: mrr,
      formattedValue: formatCurrency(mrr, "USD"),
      currency: "USD",
      trend: {
        percentageChange: mrrTrend,
        isPositive: mrrTrend >= 0,
        timeframeLabel: "vs mes anterior"
      },
      status: mrrTrend >= 0 ? "healthy" : "warning",
      description: "Ingreso recurrente mensual proveniente de suscripciones activas."
    },
    {
      id: "runway",
      title: "Runway",
      currentValue: Number.isFinite(runway) ? runway : Number.MAX_SAFE_INTEGER,
      formattedValue: formatRunwayMonths(runway),
      currency: "USD",
      trend: {
        percentageChange: 0,
        isPositive: true,
        timeframeLabel: "proyeccion actual"
      },
      status: runwayStatus(runway),
      description: "Meses de operacion restante al ritmo de quema promedio de los ultimos 3 meses."
    },
    {
      id: "net_burn",
      title: "Net Burn Rate",
      currentValue: netBurn,
      formattedValue: formatCurrency(netBurn, "USD"),
      currency: "USD",
      trend: {
        percentageChange: burnTrend,
        isPositive: burnTrend <= 0,
        timeframeLabel: "vs mes anterior"
      },
      status: netBurn <= 0 ? "healthy" : netBurn < mrr * 0.5 ? "warning" : "critical",
      description: "Gasto operativo neto mensual despues de restar ingresos del periodo."
    },
    {
      id: "cash_balance",
      title: "Saldo de Caja",
      currentValue: cashBalance,
      formattedValue: formatCurrency(cashBalance, "USD"),
      currency: "USD",
      trend: {
        percentageChange: cashTrend,
        isPositive: cashTrend >= 0,
        timeframeLabel: "proyeccion 90 dias"
      },
      status: cashBalance > 0 ? "healthy" : "critical",
      description: "Liquidez disponible y proyectada segun el escenario base seleccionado."
    }
  ];
}

function runwayStatus(runway: number): "healthy" | "warning" | "critical" {
  if (!Number.isFinite(runway) || runway >= 12) {
    return "healthy";
  }
  if (runway >= 6) {
    return "warning";
  }
  return "critical";
}

export function generateBurnRateBreakdown(transactions: readonly TransactionRecord[]): BurnRateCategoryBreakdown[] {
  const monthlyBuckets = groupByMonth(transactions);
  const months = Object.keys(monthlyBuckets).sort();
  const lastMonth = months[months.length - 1];
  const lastMonthTransactions = lastMonth ? monthlyBuckets[lastMonth]! : [];

  const totals = new Map<TransactionCategory, number>();
  for (const category of EXPENSE_CATEGORIES) {
    totals.set(category, 0);
  }
  for (const transaction of lastMonthTransactions) {
    if (transaction.type !== "expense") continue;
    totals.set(transaction.category, (totals.get(transaction.category) ?? 0) + transaction.amount);
  }

  const grandTotal = Array.from(totals.values()).reduce((sum, value) => sum + value, 0);

  return EXPENSE_CATEGORIES.map((category) => {
    const totalAmount = round2(totals.get(category) ?? 0);
    return {
      category,
      label: CATEGORY_LABELS[category],
      totalAmount,
      percentageOfTotal: grandTotal > 0 ? round2((totalAmount / grandTotal) * 100) : 0
    };
  }).sort((a, b) => b.totalAmount - a.totalAmount);
}

function groupByMonth(transactions: readonly TransactionRecord[]): Record<string, TransactionRecord[]> {
  const buckets: Record<string, TransactionRecord[]> = {};
  for (const transaction of transactions) {
    const monthKey = transaction.date.slice(0, 7);
    if (!buckets[monthKey]) {
      buckets[monthKey] = [];
    }
    buckets[monthKey]!.push(transaction);
  }
  return buckets;
}

function sumByType(transactions: readonly TransactionRecord[], type: "income" | "expense"): number {
  return round2(transactions.filter((t) => t.type === type).reduce((sum, t) => sum + t.amount, 0));
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

export function generateDashboardSnapshot(seed: number = DEFAULT_SEED) {
  const transactions = generateTransactionHistory(seed);
  const baseCashflow = generateBaseCashflowSeries(transactions, seed);
  const kpis = generateFinancialKpis(transactions, baseCashflow);
  const burnRateBreakdown = generateBurnRateBreakdown(transactions);

  return { transactions, baseCashflow, kpis, burnRateBreakdown };
}
