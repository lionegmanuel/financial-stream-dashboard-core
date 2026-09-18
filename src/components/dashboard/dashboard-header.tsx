import { Activity } from "lucide-react";

import { CompanySelector } from "@/components/dashboard/company-selector";
import { ThemeToggle } from "@/components/dashboard/theme-toggle";

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
            <Activity className="h-4 w-4 text-primary" aria-hidden />
          </div>
          <span className="font-semibold tracking-tight">Financial Stream Dashboard</span>
        </div>
        <div className="flex items-center gap-3">
          <CompanySelector />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
