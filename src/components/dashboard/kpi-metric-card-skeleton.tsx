import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function KpiMetricCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-28" />
        <Skeleton className="mt-3 h-3 w-24" />
        <Skeleton className="mt-3 h-3 w-full" />
      </CardContent>
    </Card>
  );
}
