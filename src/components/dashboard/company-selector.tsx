import { Building2, ChevronDown } from "lucide-react";

export function CompanySelector() {
  return (
    <button
      type="button"
      className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-1.5 text-sm font-medium text-slate-200 shadow-sm hover:border-white/[0.15] hover:bg-white/[0.07] hover:text-[#f8fafc] transition-all duration-200"
    >
      <Building2 className="h-4 w-4 text-[#10b981]" aria-hidden />
      <span>Zignum Technologies Inc.</span>
      <ChevronDown className="h-3.5 w-3.5 text-slate-400" aria-hidden />
    </button>
  );
}
