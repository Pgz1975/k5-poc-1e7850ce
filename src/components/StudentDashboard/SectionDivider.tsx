import { cn } from "@/lib/utils";

interface SectionDividerProps {
  label: string;
  className?: string;
}

export const SectionDivider = ({ label, className }: SectionDividerProps) => {
  return (
    <div className={cn("relative flex items-center justify-center w-full py-8", className)}>
      {/* Line */}
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t-2 border-gray-300/50" />
      </div>
      
      {/* Label */}
      <div className="relative px-6 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm border border-gray-200">
        <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
          {label}
        </span>
      </div>
    </div>
  );
};
