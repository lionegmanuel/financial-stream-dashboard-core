# Especificacion Tecnica: financial-stream-dashboard-core

Este documento define la arquitectura de software, los esquemas de datos con Zod, las formulas matematicas financieras y la jerarquia de componentes para **`financial-stream-dashboard-core`**.

---

## 1. Principios de Arquitectura Frontend

1. **Server Components por Defecto**: Las metricas iniciales, el layout y las tarjetas estructurales se generan en el servidor (RSC) con soporte de `Suspense` para streaming progresivo de carga (cero pantallas en blanco).
2. **React 19 & TypeScript Estricto**: Cero uso de `any`. Tipado inmutable para todos los registros contables y de tesoreria.
3. **Simulacion de Escenarios en el Cliente**: El switch de escenarios (Base, Best, Worst) recalcula las curvas de flujo de caja en memoria en tiempo real (<16ms, 60fps) mediante hooks reactivos optimizados.
4. **AI Copilot con Streaming Nativo**: Integracion del panel lateral Drawer con Server-Sent Events (SSE) a traves de Next.js Route Handlers y Vercel AI SDK.
5. **Independencia de Backend**: Cuenta con un `MockDataEngine` deterministico con seed configurable que permite que el proyecto se ejecute de inmediato en Vercel sin requerir credenciales externas.

---

## 2. Esquemas de Datos y Contratos Zod (`src/lib/schemas.ts`)

```typescript
import { z } from "zod";

// Divisas soportadas
export const CurrencyCodeSchema = z.enum(["USD", "EUR", "GBP", "ARS", "PEN"]);
export type CurrencyCode = z.infer<typeof CurrencyCodeSchema>;

// Estado de KPI Financiero
export const MetricTrendSchema = z.object({
  percentageChange: z.number(),
  isPositive: z.boolean(),
  timeframeLabel: z.string()
});
export type MetricTrend = z.infer<typeof MetricTrendSchema>;

export const FinancialKpiSchema = z.object({
  id: z.string(),
  title: z.string(),
  currentValue: z.number(),
  formattedValue: z.string(),
  currency: CurrencyCodeSchema,
  trend: MetricTrendSchema,
  status: z.enum(["healthy", "warning", "critical"]),
  description: z.string()
});
export type FinancialKpi = z.infer<typeof FinancialKpiSchema>;

// Proyeccion de Flujo de Caja
export const CashflowScenarioSchema = z.enum(["base", "optimistic", "pessimistic"]);
export type CashflowScenario = z.infer<typeof CashflowScenarioSchema>;

export const CashflowDataPointSchema = z.object({
  date: z.string(), // ISO YYYY-MM-DD
  inflows: z.number().nonnegative(),
  outflows: z.number().nonnegative(),
  netCashflow: z.number(),
  closingBalance: z.number(),
  scenario: CashflowScenarioSchema
});
export type CashflowDataPoint = z.infer<typeof CashflowDataPointSchema>;

// Transaccion Contable Individual
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

// Mensaje de Copiloto Financiero
export const CopilotMessageSchema = z.object({
  id: z.string(),
  role: z.enum(["user", "assistant", "system"]),
  content: z.string(),
  timestamp: z.string().datetime(),
  suggestedAction: z.object({
    label: z.string(),
    scenarioToApply: CashflowScenarioSchema.optional()
  }).optional()
});
export type CopilotMessage = z.infer<typeof CopilotMessageSchema>;
```

---

## 3. Formulas Matematicas Financieras (`src/lib/financial-math.ts`)

1. **Net Burn Rate (Tasa de Quema Neta Mensual)**:
   $$\text{Net Burn Rate} = \text{Total Gastos Operativos del Mes} - \text{Total Ingresos Operativos del Mes}$$
   Si los ingresos superan a los gastos, el Net Burn Rate es cero (flujo de caja positivo / default alive).

2. **Runway (Meses de Vida Operativa Restante)**:
   $$\text{Runway (Meses)} = \frac{\text{Saldo de Caja Disponible y Liquido}}{\text{Net Burn Rate Promedio de Ultimos 3 Meses}}$$
   Si el Burn Rate es menor o igual a cero, el Runway se define matematicamente como infinito (`Infinity` / Autosustentable).

3. **Multiplicadores de Escenario de Proyeccion**:
   - **Base Case**: Cobranzas esperadas al 100% de contratos recurrentes + gastos proyectados promedio.
   - **Optimistic Case (Best)**: Cobranzas recurrentes + 20% incremento de nuevos cierres, cobranza anticipada (-10 dias DSO).
   - **Pessimistic Case (Worst)**: Reduccion del 25% en ingresos variables + retraso de 30 dias en cobranzas + 10% de inflacion en costos de infraestructura.

---

## 4. Jerarquia de Componentes y Responsabilidades

```text
<RootLayout>
  ├── <DashboardHeader>
  │     ├── <CompanySelector>
  │     ├── <DateRangeFilter>
  │     └── <ThemeToggle>
  │
  ├── <StreamingMetricsSection> (RSC + Suspense)
  │     ├── <KpiMetricCard id="mrr" />
  │     ├── <KpiMetricCard id="runway" />
  │     ├── <KpiMetricCard id="net_burn" />
  │     └── <KpiMetricCard id="cash_balance" />
  │
  ├── <CashflowAnalyticsGrid>
  │     ├── <InteractiveCashflowChart>
  │     │     ├── <ScenarioSelector (Client Component)>
  │     │     └── <RechartsResponsiveContainer>
  │     └── <BurnRateBreakdownChart>
  │
  ├── <RecentTransactionsTable (Pagination & Filter)>
  │
  └── <AICopilotDrawer (Client Component)>
        ├── <AnomalyAlertPill>
        ├── <ChatStreamingContainer (Vercel AI SDK)>
        └── <QuickPromptSuggestions>
```

---

## 5. Especificacion del Endpoint SSE (`src/app/api/copilot/route.ts`)

- Recibe via `POST` un payload con `{ messages, currentMetrics, selectedScenario }`.
- Si existe una clave `OPENAI_API_KEY` o `ANTHROPIC_API_KEY` en `.env.local`, despacha streaming real con el Vercel AI SDK.
- Si no existe API key, conmuta de forma transparente y deterministica a un **Mock Streaming Generator** con retraso artificial por token (30ms) que analiza el estado financiero recibido y emite recomendaciones reales (ej. "Detectamos un incremento del 35% en costos de infraestructura en el escenario pesimista...").
- Esto garantiza que el evaluador tecnico o reclutador que ejecute `npm run dev` o abra la URL de Vercel vea la experiencia de streaming completa con cero configuracion.
