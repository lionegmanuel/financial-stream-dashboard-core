import { CashflowProjectionChart } from "@/components/charts/cashflow-projection";
import { BurnRateBreakdownChart } from "@/components/charts/burn-rate-breakdown";
import type { BurnRateCategoryBreakdown, CashflowDataPoint } from "@/lib/schemas";

interface CashflowAnalyticsGridProps {
  baseCashflow: CashflowDataPoint[];
  burnRateBreakdown: BurnRateCategoryBreakdown[];
}

export function CashflowAnalyticsGrid({ baseCashflow, burnRateBreakdown }: CashflowAnalyticsGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <CashflowProjectionChart baseCashflow={baseCashflow} />
      <BurnRateBreakdownChart breakdown={burnRateBreakdown} />
    </div>
  );
}
