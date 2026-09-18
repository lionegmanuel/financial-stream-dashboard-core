"use client";

import { useMemo, useState } from "react";
import { Bot } from "lucide-react";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerTrigger
} from "@/components/ui/drawer";
import { AnomalyAlertPill } from "@/components/ai-drawer/anomaly-badge";
import { CopilotChat } from "@/components/ai-drawer/copilot-chat";
import { detectAnomalies } from "@/lib/copilot-engine";
import type { FinancialKpi } from "@/lib/schemas";

export function CopilotDrawer({ metrics }: { metrics: FinancialKpi[] }) {
  const [open, setOpen] = useState(false);
  const anomalies = useMemo(() => detectAnomalies(metrics), [metrics]);

  return (
    <Drawer open={open} onOpenChange={setOpen} direction="right">
      <div className="fixed bottom-6 right-6 z-40">
        <DrawerTrigger asChild>
          <div>
            <AnomalyAlertPill anomalies={anomalies} onClick={() => setOpen(true)} />
          </div>
        </DrawerTrigger>
      </div>
      <DrawerContent>
        <DrawerHeader>
          <div className="flex items-center gap-2">
            <Bot className="h-4 w-4 text-primary" aria-hidden />
            <DrawerTitle>AI Financial Copilot</DrawerTitle>
          </div>
          <DrawerDescription>
            Analisis en tiempo real de tus metricas financieras via streaming SSE.
          </DrawerDescription>
        </DrawerHeader>
        <CopilotChat currentMetrics={metrics} selectedScenario="base" />
      </DrawerContent>
    </Drawer>
  );
}
