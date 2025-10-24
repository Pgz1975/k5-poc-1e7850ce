import { useLanguage } from "@/contexts/LanguageContext";
import { useStudentProfile } from "@/hooks/useStudentProfile";
import { useStudentProgress } from "@/hooks/useStudentProgress";
import { useLessonOrdering } from "@/hooks/useLessonOrdering";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { LessonCard } from "@/components/StudentDashboard/LessonCard";
import { DomainGroup } from "@/types/lessonOrdering";
import { useMemo } from "react";
import { getLessonLockingStatus } from "@/utils/lessonUnlocking";

export default function StudentLessonsProgress() {
  const { t, language } = useLanguage();
  const { data: profile, isLoading: profileLoading } = useStudentProfile();

  const { data: progress, isLoading: progressLoading } = useStudentProgress({
    activityType: "lesson",
    gradeLevel: profile?.gradeLevel ?? 0,
    learningLanguages: profile?.learningLanguages ?? ["es", "en"],
  });

  const { lessonsWithOrder } = useLessonOrdering(profile?.gradeLevel ?? 0);

  // Group lessons by domain
  const domainGroups: DomainGroup[] = useMemo(() => {
    if (!lessonsWithOrder) return [];

    const groups = new Map<string, DomainGroup>();
    
    lessonsWithOrder.forEach(lesson => {
      const domainName = lesson.domain_name || t("Sin categoría", "Uncategorized");
      
      if (!groups.has(domainName)) {
        groups.set(domainName, {
          domain_name: domainName,
          domain_order: lesson.domain_order ?? 999,
          lessons: [],
        });
      }
      
      groups.get(domainName)!.lessons.push(lesson);
    });

    return Array.from(groups.values()).sort((a, b) => a.domain_order - b.domain_order);
  }, [lessonsWithOrder, t]);

  // Create completion map
  const completedMap = useMemo(() => {
    const map = new Map();
    progress?.completedActivities.forEach(activity => {
      map.set(activity.activity_id, {
        score: activity.score,
        completedAt: activity.completed_at,
      });
    });
    return map;
  }, [progress]);

  // Calculate locking status for all lessons
  const lockingMap = useMemo(() => {
    if (!lessonsWithOrder || !progress?.completedActivities) {
      return new Map<string, boolean>();
    }

    const orderedLessons = lessonsWithOrder.map(lesson => ({
      id: lesson.id,
      display_order: lesson.display_order ?? 999,
      assessment_id: lesson.id,
    }));

    return getLessonLockingStatus(orderedLessons, progress.completedActivities);
  }, [lessonsWithOrder, progress?.completedActivities]);

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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-secondary/5">
      <Helmet>
        <title>{t("Mis Lecciones - LecturaPR", "My Lessons - LecturaPR")}</title>
      </Helmet>

      <Header />

      <main className="flex-1 container mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            {t("Mis Lecciones", "My Lessons")}
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
                <span>{t("Lecciones Completadas", "Lessons Completed")}</span>
                <span className="font-bold">
                  {progress?.completedCount}/{progress?.totalActivities}
                </span>
              </div>
              <Progress value={progress?.progressPercentage ?? 0} className="h-3" />
            </div>
          </CardContent>
        </Card>

        {/* All Lessons by Domain */}
        {domainGroups.map((domain) => (
          <div key={domain.domain_name} className="space-y-4">
            <h2 className="text-2xl font-bold text-primary">
              {domain.domain_name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {domain.lessons.map((lesson) => {
                const isCompleted = completedMap.has(lesson.id);
                const isLocked = lockingMap.get(lesson.id) ?? false;
                
                return (
                  <LessonCard
                    key={lesson.id}
                    id={lesson.id}
                    title={lesson.title}
                    description={lesson.description}
                    estimatedDuration={lesson.estimated_duration_minutes || 5}
                    isLocked={isLocked}
                    isCompleted={isCompleted}
                    completionData={completedMap.get(lesson.id)}
                  />
                );
              })}
            </div>
          </div>
        ))}

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
