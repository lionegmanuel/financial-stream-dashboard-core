import { KpiMetricCardSkeleton } from "@/components/dashboard/kpi-metric-card-skeleton";

export function StreamingMetricsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <KpiMetricCardSkeleton key={index} />
      ))}
    </div>
  );
}
