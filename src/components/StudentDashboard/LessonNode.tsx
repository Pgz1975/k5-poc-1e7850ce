import React from "react";
import { motion } from "framer-motion";
import { Check, Lock, Star, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface LessonNodeProps {
  state: "locked" | "unlocked" | "active" | "completed";
  color: string;
  onClick?: () => void;
  lessonNumber?: number;
  isSpecial?: boolean;
  title?: string;
}

export const LessonNode = ({ 
  state, 
  color, 
  onClick, 
  lessonNumber,
  isSpecial = false,
  title
}: LessonNodeProps) => {
  const [showTitle, setShowTitle] = React.useState(false);
  const isInteractive = state !== "locked";
  
  return (
    <div 
      className="relative"
      onMouseEnter={() => setShowTitle(true)}
      onMouseLeave={() => setShowTitle(false)}
    >
      {/* Title tooltip */}
      {title && showTitle && state !== "locked" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="absolute -top-14 left-1/2 -translate-x-1/2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg shadow-lg whitespace-nowrap z-10"
        >
          {title}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45" />
        </motion.div>
      )}
      
      <motion.button
        whileHover={isInteractive ? { scale: 1.05, y: -4 } : {}}
        whileTap={isInteractive ? { scale: 0.95 } : {}}
        onClick={isInteractive ? onClick : undefined}
        disabled={state === "locked"}
        className={cn(
          "relative w-20 h-20 rounded-full transition-all duration-200",
          "flex items-center justify-center",
          "shadow-[0_8px_0_rgba(0,0,0,0.15)]",
          "active:shadow-[0_4px_0_rgba(0,0,0,0.15)] active:translate-y-1",
          state === "locked" && "opacity-50 cursor-not-allowed grayscale",
          state === "completed" && "ring-4 ring-white",
          state === "active" && "animate-pulse",
          color
        )}
      >
        {/* Icon based on state */}
        {state === "completed" && (
          <Check className="w-10 h-10 text-white" strokeWidth={3} />
        )}
        {state === "locked" && (
          <Lock className="w-8 h-8 text-gray-400" strokeWidth={2.5} />
        )}
        {state === "active" && !isSpecial && (
          <Star className="w-10 h-10 text-white fill-white" strokeWidth={2} />
        )}
        {state === "unlocked" && !isSpecial && (
          <BookOpen className="w-8 h-8 text-white" strokeWidth={2.5} />
        )}
        {isSpecial && state !== "locked" && state !== "completed" && (
          <Star className="w-10 h-10 text-white fill-white" strokeWidth={2} />
        )}
        
        {/* Glow effect for active lessons */}
        {state === "active" && (
          <div className={cn(
            "absolute inset-0 rounded-full blur-xl opacity-60 animate-pulse",
            color
          )} />
        )}
        
        {/* Lesson number badge */}
        {lessonNumber && state !== "locked" && (
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full shadow-sm border-2 border-gray-200 flex items-center justify-center">
            <span className="text-xs font-bold text-gray-700">{lessonNumber}</span>
          </div>
        )}
      </motion.button>
      
      {/* "START" button overlay for active lessons */}
      {state === "active" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap"
        >
          <div className="px-4 py-1.5 bg-white rounded-full shadow-md border-2 border-gray-200">
            <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">
              Start
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
};
