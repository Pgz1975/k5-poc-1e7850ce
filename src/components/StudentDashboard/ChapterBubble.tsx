import { useLanguage } from "@/contexts/LanguageContext";
import { BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ChapterBubbleProps {
  chapterNumber: number;
  unitNumber: number;
  title: string;
  color: string;
}

export const ChapterBubble = ({ 
  chapterNumber, 
  unitNumber, 
  title, 
  color 
}: ChapterBubbleProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="w-full px-4 mb-4">
      <div className={cn(
        "relative rounded-3xl p-6 shadow-[0_8px_0_rgba(0,0,0,0.12)]",
        color
      )}>
        {/* Chapter/Unit label */}
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="w-5 h-5 text-white" strokeWidth={2.5} />
          <span className="text-sm font-bold text-white/90 uppercase tracking-wider">
            {t("Capítulo", "Chapter")} {chapterNumber}, {t("Unidad", "Unit")} {unitNumber}
          </span>
        </div>
        
        {/* Title */}
        <h2 className="text-2xl font-bold text-white leading-tight">
          {title}
        </h2>
      </div>
    </div>
  );
};
