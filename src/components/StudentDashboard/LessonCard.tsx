import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock, CheckCircle, Star, Clock } from "lucide-react";
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

  const getScoreBadgeColor = (score: number) => {
    if (score >= 90) return "bg-yellow-500 text-white";
    if (score >= 75) return "bg-gray-400 text-white";
    if (score >= 60) return "bg-amber-700 text-white";
    return "bg-gray-300 text-gray-700";
  };

  const handleClick = () => {
    if (isLocked) {
      // Shake animation handled by CSS
      return;
    }
    navigate(`/lesson/${id}`);
  };

  return (
    <Card
      className={`relative overflow-hidden transition-all duration-300 cursor-pointer ${
        isLocked
          ? "opacity-60 hover:scale-100"
          : "hover:scale-105 hover:shadow-xl"
      } ${isLocked ? "animate-shake-on-click" : ""}`}
      onClick={handleClick}
    >
      {/* Lock Overlay */}
      {isLocked && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center">
          <Lock className="w-12 h-12 text-muted-foreground" />
        </div>
      )}

      <CardContent className="p-6 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-bold line-clamp-2 flex-1">{title}</h3>
          {isCompleted && (
            <CheckCircle className="w-6 h-6 text-success flex-shrink-0" />
          )}
        </div>

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

        {/* Completion Badge */}
        {completionData && (
          <div className="flex items-center gap-2">
            <Badge className={getScoreBadgeColor(completionData.score)}>
              <Star className="w-3 h-3 mr-1" />
              {Math.round(completionData.score)}%
            </Badge>
          </div>
        )}

        {/* Duration */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>
            {estimatedDuration} {t("min", "min")}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
