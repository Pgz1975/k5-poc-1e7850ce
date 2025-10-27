import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: LucideIcon;
  value: string | number;
  label: string;
  color: "pink" | "coral" | "peach" | "yellow" | "lime";
  className?: string;
}

const colorStyles = {
  pink: "bg-[hsl(329,100%,95%)] border-[hsl(329,100%,85%)] text-[hsl(329,100%,35%)]",
  coral: "bg-[hsl(11,100%,95%)] border-[hsl(11,100%,85%)] text-[hsl(11,100%,35%)]",
  peach: "bg-[hsl(27,100%,95%)] border-[hsl(27,100%,85%)] text-[hsl(27,100%,35%)]",
  yellow: "bg-[hsl(45,100%,95%)] border-[hsl(45,100%,85%)] text-[hsl(45,100%,35%)]",
  lime: "bg-[hsl(125,100%,95%)] border-[hsl(125,100%,85%)] text-[hsl(125,100%,35%)]",
};

export function StatCard({ icon: Icon, value, label, color, className }: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border-2 p-6 transition-all hover:scale-105",
        colorStyles[color],
        className
      )}
    >
      <div className="flex items-center gap-4">
        <div className="rounded-xl bg-white/50 p-3">
          <Icon className="h-8 w-8" />
        </div>
        <div>
          <div className="text-3xl font-bold">{value}</div>
          <div className="text-sm font-medium opacity-80">{label}</div>
        </div>
      </div>
    </div>
  );
}
