import { Building2, ChevronDown } from "lucide-react";

export function CompanySelector() {
  return (
    <button
      type="button"
      className="flex items-center gap-2 rounded-md border border-border bg-muted/50 px-3 py-1.5 text-sm font-medium hover:bg-muted"
    >
      <Building2 className="h-4 w-4 text-primary" aria-hidden />
      Zignum Technologies Inc.
      <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />
    </button>
  );
}
