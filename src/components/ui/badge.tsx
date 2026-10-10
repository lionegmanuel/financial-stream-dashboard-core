import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground font-semibold",
        secondary: "border-white/[0.08] bg-white/[0.05] text-slate-300 font-medium",
        destructive: "border-rose-500/30 bg-rose-500/10 text-rose-400 font-medium",
        success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-medium",
        warning: "border-amber-500/30 bg-amber-500/10 text-amber-400 font-medium",
        outline: "border-white/[0.12] bg-white/[0.02] text-slate-300 font-medium"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
