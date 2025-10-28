import { Star, BookOpen, CircleDot, Mic, FileText, GripVertical, Play, RotateCcw } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";

interface ExerciseCardV2Props {
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
  domainColor: string;
  domainBgColor: string;
  domainBorderColor: string;
}

const EXERCISE_ICONS: Record<string, any> = {
  "multiple-choice": CircleDot,
  "true-false": BookOpen,
  "write-answer": FileText,
  "drag-drop": GripVertical,
  "fill-blank": FileText,
  "voice": Mic,
};

export function ExerciseCardV2({
  id,
  title,
  description,
  subtype,
  isCompleted,
  completionData,
  domainColor,
  domainBgColor,
  domainBorderColor,
}: ExerciseCardV2Props) {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const Icon = EXERCISE_ICONS[subtype] || CircleDot;

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
    <div
      className="rounded-3xl border-4 p-6 shadow-[0_6px_0_rgba(0,0,0,0.1)] hover:shadow-[0_8px_0_rgba(0,0,0,0.1)] hover:-translate-y-0.5 active:translate-y-1 active:shadow-[0_2px_0_rgba(0,0,0,0.1)] transition-all cursor-pointer"
      style={{
        backgroundColor: domainBgColor,
        borderColor: domainBorderColor,
      }}
      onClick={handleClick}
    >
      {/* Icon and Stars */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div 
          className="p-4 rounded-2xl border-4"
          style={{
            backgroundColor: domainColor,
            borderColor: domainBorderColor,
          }}
        >
          <Icon className="w-8 h-8 text-white" />
        </div>
        {isCompleted && completionData && (
          <div className="flex gap-1">
            {Array.from({ length: getStars(completionData.score) }).map((_, i) => (
              <Star
                key={i}
                className="w-6 h-6 fill-[hsl(45,100%,55%)] text-[hsl(45,100%,55%)]"
              />
            ))}
          </div>
        )}
      </div>

      {/* Title */}
      <h3 className="text-xl font-black mb-3 line-clamp-2" style={{ color: domainColor }}>
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p className="text-sm font-bold text-gray-600 mb-4 line-clamp-2">
          {description}
        </p>
      )}

      {/* Score Display */}
      {completionData && (
        <div className="text-center font-bold text-gray-700 mb-4 text-lg">
          {t("Mejor puntaje:", "Best score:")} {Math.round(completionData.score)}%
        </div>
      )}

      {/* Action Button */}
      <button
        className="w-full rounded-xl border-4 text-white font-black text-lg py-3 px-6 shadow-[0_4px_0_rgba(0,0,0,0.2)] hover:shadow-[0_6px_0_rgba(0,0,0,0.2)] hover:-translate-y-0.5 active:translate-y-1 active:shadow-[0_1px_0_rgba(0,0,0,0.2)] transition-all flex items-center justify-center gap-2"
        style={{
          backgroundColor: isCompleted ? "white" : domainColor,
          borderColor: domainBorderColor,
          color: isCompleted ? domainColor : "white",
        }}
        onClick={(e) => {
          e.stopPropagation();
          handleClick();
        }}
      >
        {isCompleted ? (
          <>
            <RotateCcw className="h-5 w-5" />
            {t("Practicar de Nuevo", "Practice Again")}
          </>
        ) : (
          <>
            <Play className="h-5 w-5" />
            {t("Comenzar", "Start")}
          </>
        )}
      </button>
    </div>
  );
}
