import { getDomainTheme } from "@/config/domainThemes";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

interface DomainHeaderProps {
  domainName: string;
  lessonsCount: number;
  completedCount: number;
}

export function DomainHeader({ domainName, lessonsCount, completedCount }: DomainHeaderProps) {
  const theme = getDomainTheme(domainName);
  const Icon = theme.icon;
  const progress = lessonsCount > 0 ? (completedCount / lessonsCount) * 100 : 0;
  
  // Calculate stars (0-5 based on completion percentage)
  const stars = Math.min(5, Math.floor((progress / 100) * 5));

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="flex items-center gap-4 p-4 rounded-lg border-2"
      style={{
        backgroundColor: theme.bgColor,
        borderColor: theme.borderColor,
      }}
    >
      <div
        className="p-3 rounded-full"
        style={{ backgroundColor: theme.color, color: "white" }}
      >
        <Icon className="w-6 h-6" />
      </div>
      
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-2xl font-bold" style={{ color: theme.color }}>
            {domainName}
          </h2>
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="w-5 h-5"
                fill={i < stars ? theme.color : "none"}
                stroke={theme.color}
              />
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <div className="flex-1 h-2 bg-background/50 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="h-full rounded-full"
              style={{ backgroundColor: theme.color }}
            />
          </div>
          <span className="text-sm font-medium" style={{ color: theme.color }}>
            {completedCount}/{lessonsCount}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
