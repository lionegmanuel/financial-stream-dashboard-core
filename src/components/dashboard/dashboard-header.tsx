import { Activity } from "lucide-react";

import { CompanySelector } from "@/components/dashboard/company-selector";
import { ThemeToggle } from "@/components/dashboard/theme-toggle";

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/[0.08] bg-[#0b0f17]/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 shadow-sm shadow-emerald-950/20">
            <Activity className="h-4.5 w-4.5 text-[#10b981]" aria-hidden />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-[#f8fafc]">Financial Stream Dashboard</span>
            <span className="text-[11px] font-medium text-slate-400">Velinex UI Standard</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <CompanySelector />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
