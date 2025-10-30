import { Trophy, Award, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface MilestoneIconProps {
  type: "trophy" | "shield" | "target";
  number?: number;
  unlocked: boolean;
  color?: string;
}

export const MilestoneIcon = ({ 
  type, 
  number, 
  unlocked,
  color = "bg-gradient-to-br from-primary to-secondary"
}: MilestoneIconProps) => {
  const Icon = type === "trophy" ? Trophy : type === "shield" ? Award : Target;
  
  return (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      className="relative"
    >
      <div className={cn(
        "w-16 h-16 rounded-full flex items-center justify-center",
        "shadow-[0_6px_0_rgba(0,0,0,0.15)]",
        unlocked ? color : "bg-muted grayscale opacity-50"
      )}>
        <Icon 
          className={cn(
            "w-8 h-8",
            unlocked ? "text-white" : "text-muted-foreground"
          )} 
          strokeWidth={2.5} 
        />
        
        {/* Number badge for shields */}
        {number && type === "shield" && unlocked && (
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-card rounded-full shadow-sm border-2 border-border flex items-center justify-center">
            <span className="text-xs font-bold text-foreground">{number}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};
