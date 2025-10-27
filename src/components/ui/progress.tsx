import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";

interface ProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  variant?: 'default' | 'student-thick' | 'student-yellow' | 'student-lime';
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, variant = 'default', ...props }, ref) => {
  const variantStyles = {
    'default': {
      root: "h-3 rounded-full bg-muted",
      indicator: "bg-gradient-success"
    },
    'student-thick': {
      root: "h-6 rounded-full bg-gray-700",
      indicator: "bg-gradient-student-yellow rounded-full"
    },
    'student-yellow': {
      root: "h-6 rounded-full bg-gray-700",
      indicator: "bg-student-yellow rounded-full"
    },
    'student-lime': {
      root: "h-6 rounded-full bg-gray-700",
      indicator: "bg-student-lime rounded-full"
    }
  };

  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn("relative w-full overflow-hidden", variantStyles[variant].root, className)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn("h-full w-full flex-1 transition-all duration-500 ease-out", variantStyles[variant].indicator)}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  );
});
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
