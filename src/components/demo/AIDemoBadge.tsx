import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface AIDemoBadgeProps {
  className?: string;
  children?: React.ReactNode;
}

export function AIDemoBadge({ className, children }: AIDemoBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "inline-flex items-center gap-2 bg-purple-50 border-purple-200 text-purple-700",
        className,
      )}
    >
      <Sparkles className="h-4 w-4" />
      {children ?? "AI Demo"}
    </Badge>
  );
}
