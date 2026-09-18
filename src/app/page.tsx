import { Suspense } from "react";

import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { StreamingMetrics } from "@/components/dashboard/streaming-metrics";
import { StreamingMetricsSkeleton } from "@/components/dashboard/streaming-metrics-skeleton";
import { CashflowAnalyticsGrid } from "@/components/dashboard/cashflow-analytics-grid";
import { RecentTransactionsTable } from "@/components/dashboard/recent-transactions-table";
import { CopilotDrawer } from "@/components/ai-drawer/copilot-drawer";
import { generateDashboardSnapshot } from "@/lib/mock-engine";

export default function DashboardPage() {
  const { transactions, baseCashflow, kpis, burnRateBreakdown } = generateDashboardSnapshot();

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container flex flex-col gap-6 py-6">
        <Suspense fallback={<StreamingMetricsSkeleton />}>
          <StreamingMetrics />
        </Suspense>

        <CashflowAnalyticsGrid baseCashflow={baseCashflow} burnRateBreakdown={burnRateBreakdown} />

        <RecentTransactionsTable transactions={transactions} />
      </main>

      <CopilotDrawer metrics={kpis} />
    </div>
  );
}
