import { useLanguage } from "@/contexts/LanguageContext";
import { useStudentProfile } from "@/hooks/useStudentProfile";
import { useStudentProgress } from "@/hooks/useStudentProgress";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { ExerciseCard } from "@/components/StudentDashboard/ExerciseCard";
import { DomainHeader } from "@/components/StudentDashboard/DomainHeader";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useMemo } from "react";
import { ActivityActions } from "@/components/ActivityManagement/ActivityActions";

export default function StudentExercisesProgress() {
  const { t, language } = useLanguage();
  const { data: profile, isLoading: profileLoading } = useStudentProfile();

  const { data: progress, isLoading: progressLoading } = useStudentProgress({
    activityType: "exercise",
    gradeLevel: profile?.gradeLevel ?? 0,
    learningLanguages: profile?.learningLanguages ?? ["es", "en"],
  });

  // Fetch all exercises with their parent lesson domain information
  const { data: allExercises } = useQuery({
    queryKey: ["all-exercises", profile?.gradeLevel, profile?.learningLanguages],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("manual_assessments")
        .select(`
          *,
          parent_lesson:manual_assessments!parent_lesson_id(title)
        `)
        .eq("type", "exercise")
        .not("parent_lesson_id", "is", null)
        .in("language", (profile?.learningLanguages ?? ["es", "en"]) as ("es" | "en" | "es-PR")[])
        .order("order_in_lesson");

      if (error) throw error;
      return data;
    },
    enabled: !!profile?.gradeLevel && !!profile?.learningLanguages,
  });

  // Fetch lesson ordering to get domain information
  const { data: lessonOrdering } = useQuery({
    queryKey: ["lesson-ordering", profile?.gradeLevel],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lesson_ordering")
        .select("assessment_id, domain_name, domain_order, display_order")
        .eq("grade_level", profile?.gradeLevel ?? 0)
        .order("domain_order")
        .order("display_order");

      if (error) throw error;
      return data;
    },
    enabled: !!profile?.gradeLevel,
  });

  // Create completion map
  const completedMap = useMemo(() => {
    const map = new Map();
    progress?.completedActivities.forEach(activity => {
      map.set(activity.activity_id, {
        score: activity.score,
        attempts: 1, // TODO: Track actual attempts
      });
    });
    return map;
  }, [progress]);

  // Group exercises by domain (matching lesson organization)
  const exerciseGroups = useMemo(() => {
    if (!allExercises || !lessonOrdering) return [];

    // Create a map of parent_lesson_id to domain info
    const domainMap = new Map();
    lessonOrdering.forEach(lo => {
      domainMap.set(lo.assessment_id, {
        domain_name: lo.domain_name || t("Sin categoría", "Uncategorized"),
        domain_order: lo.domain_order ?? 999,
        display_order: lo.display_order ?? 999,
      });
    });

    // Group exercises by domain_order first (to prevent duplicates), then by domain_name
    const domainOrderGroups = new Map<number, Map<string, any>>();
    
    allExercises.forEach(exercise => {
      const domainInfo = domainMap.get(exercise.parent_lesson_id);
      if (!domainInfo) return; // Skip exercises without ordering info
      
      const domainOrder = domainInfo.domain_order ?? 999;
      const domainName = domainInfo.domain_name || t("Sin categoría", "Uncategorized");
      
      // Initialize domain_order group if needed
      if (!domainOrderGroups.has(domainOrder)) {
        domainOrderGroups.set(domainOrder, new Map());
      }
      
      const domainGroup = domainOrderGroups.get(domainOrder)!;
      
      // Initialize domain_name group if needed
      if (!domainGroup.has(domainName)) {
        domainGroup.set(domainName, {
          domain_name: domainName,
          domain_order: domainOrder,
          exercises: [],
        });
      }
      
      domainGroup.get(domainName)!.exercises.push({
        ...exercise,
        display_order: domainInfo.display_order ?? 999,
      });
    });

    // Flatten into array and sort
    const result: any[] = [];
    Array.from(domainOrderGroups.entries())
      .sort(([a], [b]) => a - b) // Sort by domain_order
      .forEach(([_, domainGroup]) => {
        Array.from(domainGroup.values()).forEach(group => {
          result.push({
            ...group,
            exercises: group.exercises.sort((a: any, b: any) => 
              (a.display_order ?? 999) - (b.display_order ?? 999) ||
              (a.order_in_lesson ?? 999) - (b.order_in_lesson ?? 999)
            ),
          });
        });
      });

    return result;
  }, [allExercises, lessonOrdering, t]);

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
        <title>{t("Mis Ejercicios - FluenxIA", "My Exercises - FluenxIA")}</title>
      </Helmet>

      <Header />

      <main className="flex-1 container mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-secondary to-secondary/60 bg-clip-text text-transparent">
            {t("Mis Ejercicios", "My Exercises")}
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
                <span>{t("Ejercicios Completados", "Exercises Completed")}</span>
                <span className="font-bold">
                  {progress?.completedCount}/{progress?.totalActivities}
                </span>
              </div>
              <Progress value={progress?.progressPercentage ?? 0} className="h-3" />
            </div>
          </CardContent>
        </Card>

        {/* All Exercises by Domain */}
        {exerciseGroups.map((domain) => {
          const domainCompletedCount = domain.exercises.filter((exercise: any) => 
            completedMap.has(exercise.id)
          ).length;

          return (
            <div key={domain.domain_name} className="space-y-4">
              <DomainHeader
                domainName={domain.domain_name}
                lessonsCount={domain.exercises.length}
                completedCount={domainCompletedCount}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {domain.exercises.map((exercise: any) => {
                  const isCompleted = completedMap.has(exercise.id);
                  
                  return (
                    <div key={exercise.id} className="relative">
                      <div className="absolute top-2 right-2 z-10">
                        <ActivityActions 
                          activity={{ id: exercise.id, title: exercise.title }} 
                          redirectPath="/student-dashboard/exercises"
                          size="sm"
                        />
                      </div>
                      <ExerciseCard
                        id={exercise.id}
                        title={exercise.title}
                        description={exercise.description}
                        type={exercise.type}
                        subtype={exercise.subtype}
                        parentLessonTitle={exercise.parent_lesson?.title}
                        isCompleted={isCompleted}
                        completionData={completedMap.get(exercise.id)}
                        category={exercise.subject_area}
                      />
                    </div>
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
