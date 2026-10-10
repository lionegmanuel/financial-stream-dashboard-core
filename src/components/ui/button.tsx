import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground font-semibold shadow-md shadow-emerald-950/30 hover:bg-primary/90 hover:shadow-emerald-500/20 active:scale-[0.99]",
        destructive: "bg-destructive text-destructive-foreground font-semibold shadow-md shadow-rose-950/30 hover:bg-destructive/90 hover:shadow-rose-500/20 active:scale-[0.99]",
        outline: "border border-white/[0.08] bg-white/[0.03] text-foreground shadow-sm hover:bg-white/[0.08] hover:border-white/[0.15]",
        secondary: "border border-white/[0.06] bg-white/[0.06] text-foreground shadow-sm hover:bg-white/[0.10]",
        ghost: "text-slate-300 hover:bg-white/[0.06] hover:text-white",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-lg px-3 text-xs",
        lg: "h-10 rounded-xl px-8",
        icon: "h-9 w-9 rounded-xl"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
