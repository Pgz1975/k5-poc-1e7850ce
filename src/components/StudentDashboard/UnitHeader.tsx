import { cn } from "@/lib/utils";
import { BookOpen } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface UnitHeaderProps {
  unitNumber: number;
  title: string;
  color: string;
  totalLessons: number;
  completedLessons: number;
}

export const UnitHeader = ({ 
  unitNumber, 
  title, 
  color,
  totalLessons,
  completedLessons
}: UnitHeaderProps) => {
  const { t } = useLanguage();
  const progressPercent = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
  
  return (
    <div className="relative mb-8">
      {/* Main header card */}
      <div className={cn(
        "relative rounded-2xl p-4 shadow-[0_6px_0_rgba(0,0,0,0.1)]",
        color
      )}>
        {/* Unit label */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-white" strokeWidth={2.5} />
            <span className="text-sm font-bold text-white/90 uppercase tracking-wide">
              {t("Unidad", "Unit")} {unitNumber}
            </span>
          </div>
          <div className="text-xs font-semibold text-white/90">
            {completedLessons}/{totalLessons}
          </div>
        </div>
        
        {/* Title */}
        <h2 className="text-xl font-bold text-white mb-3">{title}</h2>
        
        {/* Progress bar */}
        <div className="w-full h-3 bg-white/30 rounded-full overflow-hidden">
          <div 
            className="h-full bg-white rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
};
