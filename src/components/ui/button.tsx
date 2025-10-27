import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-base font-bold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-gradient-primary-button text-primary-foreground shadow-soft hover:shadow-medium hover:scale-105 rounded-xl",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-soft hover:shadow-medium rounded-xl",
        outline: "border-2 border-primary bg-background text-primary hover:bg-primary/10 rounded-xl",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-soft hover:shadow-medium rounded-xl",
        ghost: "hover:bg-accent/10 hover:text-accent-foreground rounded-xl",
        link: "text-primary underline-offset-4 hover:underline",
        playful: "bg-gradient-success text-white shadow-soft hover:shadow-hover hover:scale-105 rounded-xl font-bold",
        warning: "bg-warning text-warning-foreground shadow-soft hover:shadow-medium hover:scale-105 rounded-xl",
        
        // Student-facing 3D buttons (Duolingo-style)
        "student-pink": "bg-gradient-student-pink text-white rounded-2xl border-b-4 border-[hsl(329,100%,55%)] shadow-[0_4px_0_hsl(329,100%,55%)] hover:translate-y-1 hover:shadow-[0_2px_0_hsl(329,100%,55%)] active:translate-y-2 active:shadow-none transition-all",
        "student-coral": "bg-gradient-student-coral text-white rounded-2xl border-b-4 border-[hsl(11,100%,51%)] shadow-[0_4px_0_hsl(11,100%,51%)] hover:translate-y-1 hover:shadow-[0_2px_0_hsl(11,100%,51%)] active:translate-y-2 active:shadow-none transition-all",
        "student-peach": "bg-gradient-student-peach text-white rounded-2xl border-b-4 border-[hsl(27,100%,55%)] shadow-[0_4px_0_hsl(27,100%,55%)] hover:translate-y-1 hover:shadow-[0_2px_0_hsl(27,100%,55%)] active:translate-y-2 active:shadow-none transition-all",
        "student-yellow": "bg-gradient-student-yellow text-gray-900 rounded-2xl border-b-4 border-[hsl(45,100%,55%)] shadow-[0_4px_0_hsl(45,100%,55%)] hover:translate-y-1 hover:shadow-[0_2px_0_hsl(45,100%,55%)] active:translate-y-2 active:shadow-none transition-all",
        "student-lime": "bg-gradient-student-lime text-gray-900 rounded-2xl border-b-4 border-[hsl(125,100%,40%)] shadow-[0_4px_0_hsl(125,100%,40%)] hover:translate-y-1 hover:shadow-[0_2px_0_hsl(125,100%,40%)] active:translate-y-2 active:shadow-none transition-all",
      },
      size: {
        default: "h-12 px-6 py-3",
        sm: "h-10 rounded-lg px-4 text-sm",
        lg: "h-14 rounded-xl px-8 text-lg",
        icon: "h-12 w-12 min-h-[48px] min-w-[48px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
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
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
