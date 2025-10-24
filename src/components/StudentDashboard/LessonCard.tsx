import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lock, CheckCircle, Star, Clock, BookOpen, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { ProgressRing } from "@/components/ui/progress-ring";
import { motion } from "framer-motion";

interface LessonCardProps {
  id: string;
  title: string;
  description: string | null;
  estimatedDuration: number;
  isLocked: boolean;
  isCompleted: boolean;
  completionData?: {
    score: number;
    completedAt: string;
  };
  exerciseProgress?: {
    completed: number;
    total: number;
  };
}

export function LessonCard({
  id,
  title,
  description,
  estimatedDuration,
  isLocked,
  isCompleted,
  completionData,
  exerciseProgress,
}: LessonCardProps) {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const getStars = (score: number) => {
    if (score >= 90) return 5;
    if (score >= 75) return 4;
    if (score >= 60) return 3;
    if (score >= 40) return 2;
    return 1;
  };

  const exerciseCount = exerciseProgress?.total || 0;
  const completedCount = exerciseProgress?.completed || 0;
  const isPartiallyComplete = isCompleted && completedCount > 0 && completedCount < exerciseCount;
  const isFullyComplete = isCompleted && (exerciseCount === 0 || completedCount === exerciseCount);

  // Button text logic
  const buttonText = isLocked
    ? t("Bloqueado", "Locked")
    : isFullyComplete
    ? t("Revisar", "Review")
    : isPartiallyComplete
    ? t("Continuar", "Resume")
    : t("Comenzar", "Start");

  const handleClick = () => {
    if (isLocked) return;
    
    if (isCompleted && exerciseCount > 0) {
      // Has exercises - go to exercise flow
      navigate(`/lesson/${id}/exercises`);
    } else {
      // No exercises or not started - show lesson content
      navigate(`/lesson/${id}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={isLocked ? {} : { scale: 1.05 }}
    >
      <Card
        className={`border-2 transition-all duration-300 cursor-pointer relative overflow-hidden ${
          isLocked 
            ? "opacity-60 bg-muted" 
            : isPartiallyComplete 
              ? "border-orange-300 bg-orange-50/50 hover:bg-orange-50 hover:shadow-xl"
              : "bg-primary/10 border-primary/20 hover:bg-primary/20 hover:shadow-xl"
        }`}
        onClick={handleClick}
      >
        {/* Unlock sparkle effect */}
        {!isLocked && !isCompleted && (
          <motion.div
            className="absolute top-2 right-2"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
          </motion.div>
        )}

        <CardContent className="p-6 space-y-4">
          {/* Icon and Status */}
          <div className="flex items-start justify-between gap-3">
            <div className="p-3 rounded-full bg-background/50">
              <BookOpen className="w-6 h-6" />
            </div>
            <div className="flex gap-2 items-center">
              {isLocked && <Lock className="w-5 h-5 text-muted-foreground" />}
              
              {/* Stars for completed exercises */}
              {exerciseCount > 0 && (
                <div className="flex gap-1">
                  {Array.from({ length: exerciseCount }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < completedCount
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              )}
              
              {/* Legacy score stars (if no exercises) */}
              {exerciseCount === 0 && isCompleted && completionData && (
                <motion.div
                  className="flex gap-1"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  {Array.from({ length: getStars(completionData.score) }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </motion.div>
              )}
            </div>
          </div>

        {/* Title */}
        <h3 className="text-lg font-bold line-clamp-2">{title}</h3>

        {/* Description */}
        {description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {description}
          </p>
        )}

        {/* Progress Ring - if there are exercises */}
        {exerciseProgress && exerciseProgress.total > 0 && (
          <div className="flex items-center gap-3">
            <ProgressRing
              progress={(exerciseProgress.completed / exerciseProgress.total) * 100}
              size={48}
              strokeWidth={4}
              showLabel={false}
            />
            <div className="flex-1">
              <div className="text-sm font-medium">
                {exerciseProgress.completed}/{exerciseProgress.total} {t("ejercicios", "exercises")}
              </div>
              <div className="text-xs text-muted-foreground">
                {t("Completados", "Completed")}
              </div>
            </div>
          </div>
        )}

        {/* Duration */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>
            {estimatedDuration} {t("min", "min")}
          </span>
        </div>

        {/* Action Button */}
        <Button
          variant={isCompleted ? "outline" : "default"}
          className="w-full"
          disabled={isLocked}
          onClick={(e) => {
            e.stopPropagation();
            handleClick();
          }}
        >
          {buttonText}
        </Button>

        {/* Score Display */}
        {completionData && (
          <div className="text-center text-sm text-muted-foreground">
            {t("Mejor puntaje:", "Best score:")} {Math.round(completionData.score)}%
          </div>
        )}
      </CardContent>
    </Card>
    </motion.div>
  );
}
