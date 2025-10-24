import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, BookOpen, CircleDot, Mic, FileText, GripVertical } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";

interface ExerciseCardProps {
  id: string;
  title: string;
  description: string | null;
  type: string;
  subtype: string;
  parentLessonTitle?: string;
  isCompleted: boolean;
  completionData?: {
    score: number;
    attempts: number;
  };
  category?: string;
}

const EXERCISE_ICONS: Record<string, any> = {
  "multiple-choice": CircleDot,
  "true-false": BookOpen,
  "write-answer": FileText,
  "drag-drop": GripVertical,
  "fill-blank": FileText,
  "voice": Mic,
};

const CATEGORY_COLORS: Record<string, string> = {
  "Vocabulario": "bg-purple-500/10 border-purple-500/20 hover:bg-purple-500/20",
  "Sílabas": "bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/20",
  "Comprensión": "bg-green-500/10 border-green-500/20 hover:bg-green-500/20",
  "Pronunciación": "bg-orange-500/10 border-orange-500/20 hover:bg-orange-500/20",
  "default": "bg-primary/10 border-primary/20 hover:bg-primary/20",
};

export function ExerciseCard({
  id,
  title,
  description,
  type,
  subtype,
  parentLessonTitle,
  isCompleted,
  completionData,
  category = "default",
}: ExerciseCardProps) {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const Icon = EXERCISE_ICONS[subtype] || CircleDot;
  const cardColor = CATEGORY_COLORS[category] || CATEGORY_COLORS.default;

  const getStars = (score: number) => {
    if (score >= 90) return 5;
    if (score >= 75) return 4;
    if (score >= 60) return 3;
    if (score >= 40) return 2;
    return 1;
  };

  const handleClick = () => {
    navigate(`/view-assessment/${id}`);
  };

  return (
    <Card
      className={`border-2 transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-xl ${cardColor}`}
      onClick={handleClick}
    >
      <CardContent className="p-6 space-y-4">
        {/* Icon and Status */}
        <div className="flex items-start justify-between gap-3">
          <div className="p-3 rounded-full bg-background/50">
            <Icon className="w-6 h-6" />
          </div>
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

        {/* Title */}
        <h3 className="text-lg font-bold line-clamp-2">{title}</h3>

        {/* Description */}
        {description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {description}
          </p>
        )}

        {/* Parent Lesson Badge */}
        {parentLessonTitle && (
          <Badge variant="outline" className="text-xs">
            {t("Parte de:", "Part of:")} {parentLessonTitle}
          </Badge>
        )}

        {/* Action Button */}
        <Button
          variant={isCompleted ? "outline" : "default"}
          className="w-full"
          onClick={(e) => {
            e.stopPropagation();
            handleClick();
          }}
        >
          {isCompleted
            ? t("Practicar de Nuevo", "Practice Again")
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
