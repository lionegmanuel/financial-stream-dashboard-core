import { generateDashboardSnapshot } from "@/lib/mock-engine";
import { KpiMetricCard } from "@/components/dashboard/kpi-metric-card";

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function StreamingMetrics() {
  await delay(400);
  const { kpis } = generateDashboardSnapshot();

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {kpis.map((kpi) => (
        <KpiMetricCard key={kpi.id} kpi={kpi} />
      ))}
    </div>
  );
}
