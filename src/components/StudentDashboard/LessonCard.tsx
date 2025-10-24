import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lock, CheckCircle, Star, Clock, BookOpen } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";

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

  const handleClick = () => {
    if (isLocked) return;
    navigate(`/lesson/${id}`);
  };

  return (
    <Card
      className={`border-2 bg-primary/10 border-primary/20 hover:bg-primary/20 transition-all duration-300 cursor-pointer ${
        isLocked ? "hover:scale-100" : "hover:scale-105 hover:shadow-xl"
      }`}
      onClick={handleClick}
    >
      <CardContent className="p-6 space-y-4">
        {/* Icon and Status */}
        <div className="flex items-start justify-between gap-3">
          <div className="p-3 rounded-full bg-background/50">
            <BookOpen className="w-6 h-6" />
          </div>
          <div className="flex gap-2">
            {isLocked && <Lock className="w-5 h-5 text-muted-foreground" />}
            {isCompleted && completionData && (
              <div className="flex gap-1">
                {Array.from({ length: getStars(completionData.score) }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
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
          <div className="flex items-center gap-2">
            <div className="relative w-12 h-12">
              <svg className="w-12 h-12 transform -rotate-90">
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  className="text-muted"
                />
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray={`${
                    (exerciseProgress.completed / exerciseProgress.total) * 125.6
                  } 125.6`}
                  className="text-primary transition-all duration-500"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-xs font-bold">
                {exerciseProgress.completed}/{exerciseProgress.total}
              </div>
            </div>
            <span className="text-sm text-muted-foreground">
              {t("Ejercicios completados", "Exercises completed")}
            </span>
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
          {isLocked
            ? t("Bloqueado", "Locked")
            : isCompleted
            ? t("Repasar", "Review")
            : t("Comenzar", "Start")}
        </Button>

        {/* Score Display */}
        {completionData && (
          <div className="text-center text-sm text-muted-foreground">
            {t("Mejor puntaje:", "Best score:")} {Math.round(completionData.score)}%
          </div>
        )}
      </CardContent>
    </Card>
  );
}
