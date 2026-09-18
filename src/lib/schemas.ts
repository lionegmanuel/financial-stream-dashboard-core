import { z } from "zod";

export const CurrencyCodeSchema = z.enum(["USD", "EUR", "GBP", "ARS", "PEN"]);
export type CurrencyCode = z.infer<typeof CurrencyCodeSchema>;

export const MetricTrendSchema = z.object({
  percentageChange: z.number(),
  isPositive: z.boolean(),
  timeframeLabel: z.string()
});
export type MetricTrend = z.infer<typeof MetricTrendSchema>;

export const KpiStatusSchema = z.enum(["healthy", "warning", "critical"]);
export type KpiStatus = z.infer<typeof KpiStatusSchema>;

export const FinancialKpiSchema = z.object({
  id: z.string(),
  title: z.string(),
  currentValue: z.number(),
  formattedValue: z.string(),
  currency: CurrencyCodeSchema,
  trend: MetricTrendSchema,
  status: KpiStatusSchema,
  description: z.string()
});
export type FinancialKpi = z.infer<typeof FinancialKpiSchema>;

export const CashflowScenarioSchema = z.enum(["base", "optimistic", "pessimistic"]);
export type CashflowScenario = z.infer<typeof CashflowScenarioSchema>;

export const CashflowDataPointSchema = z.object({
  date: z.string(),
  inflows: z.number().nonnegative(),
  outflows: z.number().nonnegative(),
  netCashflow: z.number(),
  closingBalance: z.number(),
  scenario: CashflowScenarioSchema
});
export type CashflowDataPoint = z.infer<typeof CashflowDataPointSchema>;

export const TransactionCategorySchema = z.enum([
  "revenue_subscription",
  "revenue_services",
  "payroll",
  "infrastructure_servers",
  "marketing_ads",
  "software_licenses",
  "office_and_operations"
]);
export type TransactionCategory = z.infer<typeof TransactionCategorySchema>;

export const TransactionRecordSchema = z.object({
  id: z.string().uuid(),
  date: z.string(),
  description: z.string(),
  category: TransactionCategorySchema,
  amount: z.number(),
  type: z.enum(["income", "expense"]),
  currency: CurrencyCodeSchema,
  isRecurring: z.boolean(),
  counterparty: z.string()
});
export type TransactionRecord = z.infer<typeof TransactionRecordSchema>;

export const CopilotMessageSchema = z.object({
  id: z.string(),
  role: z.enum(["user", "assistant", "system"]),
  content: z.string(),
  timestamp: z.string().datetime(),
  suggestedAction: z
    .object({
      label: z.string(),
      scenarioToApply: CashflowScenarioSchema.optional()
    })
    .optional()
});
export type CopilotMessage = z.infer<typeof CopilotMessageSchema>;

export const CopilotRequestSchema = z.object({
  messages: z.array(
    z.object({
      id: z.string(),
      role: z.enum(["user", "assistant", "system"]),
      content: z.string()
    })
  ),
  currentMetrics: z.array(FinancialKpiSchema),
  selectedScenario: CashflowScenarioSchema
});
export type CopilotRequest = z.infer<typeof CopilotRequestSchema>;

export const BurnRateCategoryBreakdownSchema = z.object({
  category: TransactionCategorySchema,
  label: z.string(),
  totalAmount: z.number().nonnegative(),
  percentageOfTotal: z.number()
});
export type BurnRateCategoryBreakdown = z.infer<typeof BurnRateCategoryBreakdownSchema>;

export const DateRangePresetSchema = z.enum(["30d", "60d", "90d"]);
export type DateRangePreset = z.infer<typeof DateRangePresetSchema>;
