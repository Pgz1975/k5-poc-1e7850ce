import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, Star, Play } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const ReadingActivities = () => {
  const { t } = useLanguage();

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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">
          {t("Actividades de Lectura", "Reading Activities")}
        </h2>
        <p className="text-muted-foreground">
          {t("Continúa aprendiendo con estas lecturas adaptadas a tu nivel", "Continue learning with these readings adapted to your level")}
        </p>
      </div>

      <div className="grid gap-4">
        {activities.map((activity) => (
          <Card key={activity.id} className={activity.completed ? "opacity-75" : ""}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg mb-1">
                      {t(activity.titleEs, activity.titleEn)}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 flex-wrap">
                      <Badge variant="secondary">{activity.type}</Badge>
                      <span className="flex items-center gap-1 text-xs">
                        <Clock className="h-3 w-3" />
                        {activity.duration}
                      </span>
                      <span className="text-xs">· {activity.level}</span>
                    </CardDescription>
                  </div>
                </div>
                {activity.completed && (
                  <Star className="h-5 w-5 text-success fill-success" />
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{activity.difficulty}</Badge>
                </div>
                <Button size="sm" className="gap-2" disabled={activity.completed}>
                  {activity.completed ? (
                    <>
                      <Star className="h-4 w-4" />
                      {t("Completado", "Completed")}
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" />
                      {t("Comenzar", "Start")}
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
