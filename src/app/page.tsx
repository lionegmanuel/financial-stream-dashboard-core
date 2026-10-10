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
    <div className="relative min-h-screen bg-[#0b0f17] text-[#f8fafc]">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 flex justify-center overflow-hidden">
        <div className="h-[360px] w-[800px] rounded-full bg-gradient-to-b from-emerald-500/[0.07] via-sky-500/[0.04] to-transparent blur-3xl" />
      </div>

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
