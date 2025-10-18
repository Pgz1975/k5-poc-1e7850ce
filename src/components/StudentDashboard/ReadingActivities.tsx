import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, Star, Play, ArrowLeft } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import { VoiceTraining } from "./VoiceTraining";

export const ReadingActivities = () => {
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
    },
  ];

  if (showVoiceTraining) {
    return (
      <div className="space-y-4">
        <Button 
          variant="ghost" 
          onClick={() => setShowVoiceTraining(false)}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("Volver a Actividades", "Back to Activities")}
        </Button>
        <VoiceTraining />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:gap-8">
        {activities.map((activity) => (
          <Card 
            key={activity.id} 
            className={`group cursor-pointer transition-all hover:scale-[1.02] border-2 ${
              activity.completed 
                ? "bg-success/5 border-success/20" 
                : "hover:border-primary hover:shadow-lg"
            }`}
          >
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <div className={`h-16 w-16 md:h-20 md:w-20 rounded-2xl flex items-center justify-center shrink-0 ${
                    activity.completed 
                      ? "bg-success/20" 
                      : "bg-gradient-to-br from-primary/20 to-secondary/20"
                  }`}>
                    {activity.completed ? (
                      <Star className="h-8 w-8 md:h-10 md:w-10 text-success fill-success" />
                    ) : (
                      <BookOpen className="h-8 w-8 md:h-10 md:w-10 text-primary" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-xl md:text-2xl mb-2">
                      {t(activity.titleEs, activity.titleEn)}
                    </CardTitle>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className="text-sm px-3 py-1">{activity.type}</Badge>
                      <span className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {activity.duration}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button 
                size="lg"
                className="w-full text-lg gap-2 h-12 md:h-14" 
                disabled={activity.completed}
                onClick={() => !activity.completed && setShowVoiceTraining(true)}
              >
                {activity.completed ? (
                  <>
                    <Star className="h-5 w-5" />
                    {t("¡Completado! 🎉", "Completed! 🎉")}
                  </>
                ) : (
                  <>
                    <Play className="h-5 w-5" />
                    {t("¡Empezar! 🚀", "Start! 🚀")}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
