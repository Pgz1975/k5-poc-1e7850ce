import { useLanguage } from "@/contexts/LanguageContext";
import { useStudentProfile } from "@/hooks/useStudentProfile";
import { useStudentProgress } from "@/hooks/useStudentProgress";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Star, ClipboardCheck, Clock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

export default function StudentAssessmentsProgress() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { data: profile, isLoading: profileLoading } = useStudentProfile();

  const { data: progress, isLoading: progressLoading } = useStudentProgress({
    activityType: "assessment",
    gradeLevel: profile?.gradeLevel ?? 0,
    learningLanguages: profile?.learningLanguages ?? ["es", "en"],
  });

  const calculateStars = (avgScore: number | null): number => {
    if (!avgScore) return 0;
    if (avgScore >= 90) return 5;
    if (avgScore >= 75) return 4;
    if (avgScore >= 60) return 3;
    if (avgScore >= 40) return 2;
    return 1;
  };

  const getComment = (stars: number) => {
    if (language === "es") {
      if (stars === 5) return "¡Excelente trabajo! Eres una estrella 🌟";
      if (stars === 4) return "¡Muy bien! Sigue así 👍";
      if (stars === 3) return "Buen progreso, ¡sigue practicando! 📚";
      if (stars === 2) return "Vas mejorando, ¡no te rindas! 💪";
      return "¡Empieza tu aventura de aprendizaje! 🚀";
    } else {
      if (stars === 5) return "Excellent work! You're a star 🌟";
      if (stars === 4) return "Great job! Keep it up 👍";
      if (stars === 3) return "Good progress, keep practicing! 📚";
      if (stars === 2) return "You're improving, don't give up! 💪";
      return "Start your learning adventure! 🚀";
    }
  };

  const stars = calculateStars(progress?.avgScore ?? null);

  if (profileLoading || progressLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-accent/5">
      <Helmet>
        <title>{t("Mis Evaluaciones - FluenxIA", "My Assessments - FluenxIA")}</title>
      </Helmet>

      <Header />

      <main className="flex-1 container mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-accent to-accent/60 bg-clip-text text-transparent">
            {t("Mis Evaluaciones", "My Assessments")}
          </h1>
          <p className="text-muted-foreground">
            {profile?.gradeLevel === 0 
              ? t("Kindergarten", "Kindergarten")
              : t(`Grado ${profile?.gradeLevel}`, `Grade ${profile?.gradeLevel}`)}
          </p>
        </div>

        {/* Progress Overview */}
        <Card className="border-2 shadow-lg">
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">{t("Tu Progreso", "Your Progress")}</h2>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-6 h-6 ${
                      star <= stars ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>

            <p className="text-lg text-muted-foreground italic">{getComment(stars)}</p>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{t("Evaluaciones Completadas", "Assessments Completed")}</span>
                <span className="font-bold">
                  {progress?.completedCount}/{progress?.totalActivities}
                </span>
              </div>
              <Progress value={progress?.progressPercentage ?? 0} className="h-3" />
            </div>
          </CardContent>
        </Card>

        {/* Next Goal */}
        <Card className="border-2 border-accent/20 bg-gradient-to-r from-accent/5 to-transparent">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-2">
              {t("Próximo Objetivo", "Next Goal")}
            </h3>
            <p className="text-muted-foreground">
              {t("¡Completa tu próxima actividad!", "Complete your next activity!")}
            </p>
          </CardContent>
        </Card>

        {/* Next Assessment */}
        {progress?.nextActivity && (
          <Card className="border-2 border-primary shadow-lg">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-start gap-4">
                <ClipboardCheck className="w-10 h-10 text-accent flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">
                    {t("Próxima Evaluación", "Next Assessment")}
                  </h3>
                  <p className="text-2xl font-semibold text-accent mb-2">
                    {progress.nextActivity.title}
                  </p>
                  <p className="text-muted-foreground mb-3">
                    {progress.nextActivity.description}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>
                      {progress.nextActivity.estimated_duration_minutes} {t("minutos", "minutes")}
                    </span>
                  </div>
                </div>
              </div>
              <Button
                size="lg"
                className="w-full text-lg"
                onClick={() => navigate(`/view-assessment/${progress.nextActivity?.id}`)}
              >
                {t("¡Empezar Evaluación!", "Start Assessment!")}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Back Button */}
        <div className="text-center">
          <Link to="/student-dashboard">
            <Button variant="outline" size="lg">
              {t("Volver al Panel", "Back to Dashboard")}
            </Button>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
