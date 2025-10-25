import { useLanguage } from "@/contexts/LanguageContext";
import { useStudentProfile } from "@/hooks/useStudentProfile";
import { useStudentProgress } from "@/hooks/useStudentProgress";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
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
import { DomainHeader } from "@/components/StudentDashboard/DomainHeader";

export default function StudentLessonsProgress() {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const { data: profile, isLoading: profileLoading } = useStudentProfile();

  const { data: progress, isLoading: progressLoading } = useStudentProgress({
    activityType: "lesson",
    gradeLevel: profile?.gradeLevel ?? 0,
    learningLanguages: profile?.learningLanguages ?? ["es", "en"],
  });

  const { lessonsWithOrder } = useLessonOrdering(
    profile?.gradeLevel ?? 0,
    profile?.learningLanguages ?? ["es", "en"]
  );

  // Fetch exercise progress for all lessons
  const { data: exerciseProgressData } = useQuery({
    queryKey: ['all-lessons-exercise-progress', user?.id],
    queryFn: async () => {
      if (!user?.id || !lessonsWithOrder) return {};

      const lessonIds = lessonsWithOrder.map(l => l.id);
      
      // Get all exercises for these lessons
      const { data: allExercises } = await supabase
        .from('manual_assessments')
        .select('id, parent_lesson_id, language')
        .in('parent_lesson_id', lessonIds)
        .in('language', (profile?.learningLanguages ?? ["es", "en"]) as ("es" | "en" | "es-PR")[])
        .order('order_in_lesson');

      // Get completed exercises
      const exerciseIds = allExercises?.map(e => e.id) || [];
      const { data: completedExercises } = await supabase
        .from('completed_activity')
        .select('activity_id, score')
        .eq('student_id', user.id)
        .eq('activity_type', 'exercise')
        .in('activity_id', exerciseIds);

      // Build progress map by lesson
      const progressMap: Record<string, { total: number; completed: number; scores: any[] }> = {};
      
      lessonsWithOrder.forEach(lesson => {
        const lessonExercises = allExercises?.filter(e => e.parent_lesson_id === lesson.id) || [];
        const completed = completedExercises?.filter(c => 
          lessonExercises.some(e => e.id === c.activity_id)
        ) || [];

        progressMap[lesson.id] = {
          total: lessonExercises.length,
          completed: completed.length,
          scores: completed,
        };
      });

      return progressMap;
    },
    enabled: !!user?.id && !!lessonsWithOrder && lessonsWithOrder.length > 0,
  });

  // Sort lessons by domain_order first, then display_order to ensure visual order matches unlocking order
  const sortedLessons = useMemo(() => {
    if (!lessonsWithOrder) return [];
    
    return [...lessonsWithOrder].sort((a, b) => {
      // Sort by domain_order first
      const domainOrderA = a.domain_order ?? 999;
      const domainOrderB = b.domain_order ?? 999;
      
      if (domainOrderA !== domainOrderB) {
        return domainOrderA - domainOrderB;
      }
      
      // Then sort by display_order within the same domain
      return (a.display_order ?? 999) - (b.display_order ?? 999);
    });
  }, [lessonsWithOrder]);

  // Group lessons by domain (after sorting)
  const domainGroups: DomainGroup[] = useMemo(() => {
    if (!sortedLessons) return [];

    const groups = new Map<string, DomainGroup>();
    
    sortedLessons.forEach(lesson => {
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
  }, [sortedLessons, t]);

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

  // Calculate locking status for all lessons (using sorted lessons)
  const lockingMap = useMemo(() => {
    if (!sortedLessons || !progress?.completedActivities) {
      return new Map<string, boolean>();
    }

    const orderedLessons = sortedLessons.map(lesson => ({
      id: lesson.id,
      display_order: lesson.display_order ?? 999,
      assessment_id: lesson.id,
    }));

    return getLessonLockingStatus(orderedLessons, progress.completedActivities);
  }, [sortedLessons, progress?.completedActivities]);

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

        {/* All Lessons by Domain */}
        {domainGroups.map((domain) => {
          const domainCompletedCount = domain.lessons.filter(lesson => 
            completedMap.has(lesson.id)
          ).length;

          return (
            <div key={domain.domain_name} className="space-y-4">
              <DomainHeader
                domainName={domain.domain_name}
                lessonsCount={domain.lessons.length}
                completedCount={domainCompletedCount}
              />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {domain.lessons.map((lesson) => {
                const isCompleted = completedMap.has(lesson.id);
                const isLocked = lockingMap.get(lesson.id) ?? false;
                const exerciseProgress = exerciseProgressData?.[lesson.id];
                
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
                    exerciseProgress={exerciseProgress}
                  />
                );
              })}
            </div>
          </div>
          );
        })}

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
