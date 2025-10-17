import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold transition-all hover:scale-105",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/90 shadow-soft",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-soft",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-soft",
        outline: "text-foreground border-2 border-primary",
        success: "border-transparent bg-success text-success-foreground hover:bg-success/90 shadow-soft",
        warning: "border-transparent bg-warning text-warning-foreground hover:bg-warning/90 shadow-soft",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
