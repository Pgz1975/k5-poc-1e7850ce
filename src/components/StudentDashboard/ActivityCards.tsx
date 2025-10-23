import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Target, ClipboardCheck } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { useStudentProfile } from "@/hooks/useStudentProfile";
import { useStudentProgress } from "@/hooks/useStudentProgress";

export const ActivityCards = () => {
  const { t } = useLanguage();
  const { data: profile } = useStudentProfile();

  const lessonsProgress = useStudentProgress({
    activityType: "lesson",
    gradeLevel: profile?.gradeLevel ?? 0,
    learningLanguages: profile?.learningLanguages ?? ["es", "en"],
  });

  const exercisesProgress = useStudentProgress({
    activityType: "exercise",
    gradeLevel: profile?.gradeLevel ?? 0,
    learningLanguages: profile?.learningLanguages ?? ["es", "en"],
  });

  const assessmentsProgress = useStudentProgress({
    activityType: "assessment",
    gradeLevel: profile?.gradeLevel ?? 0,
    learningLanguages: profile?.learningLanguages ?? ["es", "en"],
  });

  const cards = [
    {
      icon: BookOpen,
      title: t("Lecciones", "Lessons"),
      description: t("¡Sigue Aprendiendo!", "Continue Learning!"),
      progress: `${lessonsProgress.data?.completedCount ?? 0}/${lessonsProgress.data?.totalActivities ?? 0}`,
      route: "/student-dashboard/lessons",
      gradient: "from-primary/20 to-primary/5",
      iconColor: "text-primary",
    },
    {
      icon: Target,
      title: t("Ejercicios", "Exercises"),
      description: t("¡Practica tu Lectura!", "Exercise Your Reading!"),
      progress: `${exercisesProgress.data?.completedCount ?? 0}/${exercisesProgress.data?.totalActivities ?? 0}`,
      route: "/student-dashboard/exercises",
      gradient: "from-secondary/20 to-secondary/5",
      iconColor: "text-secondary",
    },
    {
      icon: ClipboardCheck,
      title: t("Evaluaciones", "Assessments"),
      description: t("¡Demuestra lo Aprendido!", "Show What You Know!"),
      progress: `${assessmentsProgress.data?.completedCount ?? 0}/${assessmentsProgress.data?.totalActivities ?? 0}`,
      route: "/student-dashboard/assessments",
      gradient: "from-accent/20 to-accent/5",
      iconColor: "text-accent",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card) => (
        <Link key={card.route} to={card.route}>
          <Card className={`h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-gradient-to-br ${card.gradient} border-2`}>
            <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
              <div className={`p-4 rounded-full bg-background shadow-md ${card.iconColor}`}>
                <card.icon className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">{card.title}</h3>
                <p className="text-muted-foreground text-sm mb-3">{card.description}</p>
                <div className="text-2xl font-bold text-primary">{card.progress}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {t("Completados", "Completed")}
                </p>
              </div>
              <Button className="w-full mt-auto" variant="default">
                {t("Ver Progreso", "View Progress")}
              </Button>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};
