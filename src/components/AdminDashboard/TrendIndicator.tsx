import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface TrendIndicatorProps {
  trend: 'up' | 'down' | 'stable';
  size?: 'sm' | 'md' | 'lg';
}

export function TrendIndicator({ trend, size = 'md' }: TrendIndicatorProps) {
  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5"
  };

  if (trend === 'up') {
    return <TrendingUp className={cn(sizeClasses[size], "text-green-600")} />;
  }
  
  if (trend === 'down') {
    return <TrendingDown className={cn(sizeClasses[size], "text-red-600")} />;
  }
  
  return <Minus className={cn(sizeClasses[size], "text-gray-500")} />;
}
