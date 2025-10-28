import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, Star, Play, ArrowLeft, Award } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import { VoiceTraining } from "./VoiceTraining";

export const ReadingActivitiesV2 = () => {
  const { t } = useLanguage();
  const [showVoiceTraining, setShowVoiceTraining] = useState(false);

  const activities = [
    {
      id: 1,
      titleEs: "El León y el Ratón",
      titleEn: "The Lion and the Mouse",
      level: "2nd Grade",
      duration: "15 min",
      completed: false,
      difficulty: t("Fácil", "Easy"),
      type: t("Fábula", "Fable"),
      bgColor: "bg-[hsl(329,100%,95%)]",
      borderColor: "border-[hsl(329,100%,65%)]",
      iconBg: "bg-[hsl(329,100%,71%)]",
      shadowColor: "shadow-[0_6px_0_hsl(329,100%,65%)]",
      textColor: "text-[hsl(329,100%,35%)]",
    },
    {
      id: 2,
      titleEs: "La Fotosíntesis",
      titleEn: "Photosynthesis",
      level: "3rd Grade",
      duration: "20 min",
      completed: true,
      difficulty: t("Intermedio", "Intermediate"),
      type: t("Ciencia", "Science"),
      bgColor: "bg-[hsl(11,100%,95%)]",
      borderColor: "border-[hsl(11,100%,65%)]",
      iconBg: "bg-[hsl(11,100%,67%)]",
      shadowColor: "shadow-[0_6px_0_hsl(11,100%,65%)]",
      textColor: "text-[hsl(11,100%,35%)]",
    },
    {
      id: 3,
      titleEs: "Aventura en el Bosque",
      titleEn: "Forest Adventure",
      level: "2nd Grade",
      duration: "18 min",
      completed: false,
      difficulty: t("Fácil", "Easy"),
      type: t("Aventura", "Adventure"),
      bgColor: "bg-[hsl(27,100%,95%)]",
      borderColor: "border-[hsl(27,100%,65%)]",
      iconBg: "bg-[hsl(27,100%,71%)]",
      shadowColor: "shadow-[0_6px_0_hsl(27,100%,65%)]",
      textColor: "text-[hsl(27,100%,35%)]",
    },
  ];

  if (showVoiceTraining) {
    return (
      <div className="space-y-4">
        <button 
          onClick={() => setShowVoiceTraining(false)}
          className="flex items-center gap-2 rounded-xl border-4 border-[hsl(176,84%,55%)] bg-white text-[hsl(176,84%,35%)] font-bold text-lg py-3 px-6 shadow-[0_4px_0_hsl(176,84%,55%)] hover:shadow-[0_6px_0_hsl(176,84%,55%)] hover:-translate-y-0.5 active:translate-y-1 active:shadow-[0_1px_0_hsl(176,84%,55%)] transition-all"
        >
          <ArrowLeft className="h-5 w-5" />
          {t("Volver a Actividades", "Back to Activities")}
        </button>
        <VoiceTraining />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {activities.map((activity) => (
        <div 
          key={activity.id} 
          className={`rounded-3xl border-4 ${activity.borderColor} ${activity.bgColor} p-6 md:p-8 ${activity.shadowColor} hover:shadow-[0_8px_0_${activity.borderColor}] hover:-translate-y-0.5 transition-all`}
        >
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            {/* Icon with 3D effect */}
            <div className={`${activity.iconBg} rounded-2xl p-6 border-4 ${activity.borderColor} shadow-[0_4px_0_${activity.borderColor}] shrink-0`}>
              {activity.completed ? (
                <Award className="w-12 h-12 md:w-16 md:h-16 text-white" />
              ) : (
                <BookOpen className="w-12 h-12 md:w-16 md:h-16 text-white" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 w-full">
              <div className="flex flex-col gap-4">
                <div>
                  <h3 className={`text-2xl md:text-3xl font-black ${activity.textColor} mb-3`}>
                    {t(activity.titleEs, activity.titleEn)}
                  </h3>
                  <div className="flex items-center gap-3 flex-wrap">
                    <Badge className={`text-sm px-4 py-2 font-bold ${activity.bgColor} ${activity.borderColor} ${activity.textColor} border-2`}>
                      {activity.type}
                    </Badge>
                    <Badge className={`text-sm px-4 py-2 font-bold ${activity.bgColor} ${activity.borderColor} ${activity.textColor} border-2`}>
                      {activity.level}
                    </Badge>
                    <span className={`flex items-center gap-2 text-sm font-bold ${activity.textColor}`}>
                      <Clock className="h-5 w-5" />
                      {activity.duration}
                    </span>
                  </div>
                </div>

                {/* Action Button */}
                <div className="w-full md:w-auto">
                  {activity.completed ? (
                    <button 
                      disabled
                      className={`w-full md:w-auto rounded-xl border-4 border-[hsl(125,100%,65%)] bg-[hsl(125,100%,71%)] text-white font-black text-lg py-4 px-8 shadow-[0_4px_0_hsl(125,100%,65%)] opacity-70 cursor-not-allowed flex items-center justify-center gap-2`}
                    >
                      <Star className="h-6 w-6 fill-white" />
                      {t("¡Completado! 🎉", "Completed! 🎉")}
                    </button>
                  ) : (
                    <button
                      onClick={() => setShowVoiceTraining(true)}
                      className={`w-full md:w-auto rounded-xl border-4 ${activity.borderColor} ${activity.iconBg} text-white font-black text-lg py-4 px-8 shadow-[0_4px_0_${activity.borderColor}] hover:shadow-[0_6px_0_${activity.borderColor}] hover:-translate-y-0.5 active:translate-y-1 active:shadow-[0_1px_0_${activity.borderColor}] transition-all flex items-center justify-center gap-2`}
                    >
                      <Play className="h-6 w-6" />
                      {t("¡Empezar! 🚀", "Start! 🚀")}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
