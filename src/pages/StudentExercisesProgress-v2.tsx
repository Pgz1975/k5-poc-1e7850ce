import { useLanguage } from "@/contexts/LanguageContext";
import { useStudentProfile } from "@/hooks/useStudentProfile";
import { useStudentProgress } from "@/hooks/useStudentProgress";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Progress } from "@/components/ui/progress";
import { Star, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { ExerciseCardV2 } from "@/components/StudentDashboard/ExerciseCard-v2";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useMemo } from "react";
import { ActivityActions } from "@/components/ActivityManagement/ActivityActions";
import { getDomainTheme } from "@/config/domainThemes";

export default function StudentExercisesProgressV2() {
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
        attempts: 1,
      });
    });
    return map;
  }, [progress]);

  // Group exercises by domain
  const exerciseGroups = useMemo(() => {
    if (!allExercises || !lessonOrdering) return [];

    const domainMap = new Map();
    lessonOrdering.forEach(lo => {
      domainMap.set(lo.assessment_id, {
        domain_name: lo.domain_name || t("Sin categoría", "Uncategorized"),
        domain_order: lo.domain_order ?? 999,
        display_order: lo.display_order ?? 999,
      });
    });

    const groups = new Map<string, any>();
    
    allExercises.forEach(exercise => {
      const domainInfo = domainMap.get(exercise.parent_lesson_id);
      const domainName = domainInfo?.domain_name || t("Sin categoría", "Uncategorized");
      const domainOrder = domainInfo?.domain_order ?? 999;
      
      if (!groups.has(domainName)) {
        groups.set(domainName, {
          domain_name: domainName,
          domain_order: domainOrder,
          exercises: [],
        });
      }
      
      groups.get(domainName)!.exercises.push({
        ...exercise,
        display_order: domainInfo?.display_order ?? 999,
      });
    });

    return Array.from(groups.values())
      .sort((a, b) => a.domain_order - b.domain_order)
      .map(group => ({
        ...group,
        exercises: group.exercises.sort((a: any, b: any) => 
          (a.display_order ?? 999) - (b.display_order ?? 999) ||
          (a.order_in_lesson ?? 999) - (b.order_in_lesson ?? 999)
        ),
      }));
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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-sky-100 via-green-50 to-yellow-50">
      <Helmet>
        <title>{t("Mis Ejercicios - LecturaPR", "My Exercises - LecturaPR")}</title>
      </Helmet>

      <Header />

      <main className="flex-1 container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-black text-[hsl(176,84%,25%)]">
            {t("Mis Ejercicios", "My Exercises")}
          </h1>
          <p className="text-xl font-bold text-[hsl(176,84%,30%)]">
            {profile?.gradeLevel === 0 
              ? t("Kindergarten", "Kindergarten")
              : t(`Grado ${profile?.gradeLevel}`, `Grade ${profile?.gradeLevel}`)}
          </p>
        </div>

        {/* Progress Overview - Duolingo Style */}
        <div className="rounded-3xl border-4 border-white bg-white p-8 shadow-[0_8px_0_rgba(0,0,0,0.1)]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-6">
            <h2 className="text-3xl font-black text-gray-800">{t("Tu Progreso", "Your Progress")}</h2>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-8 h-8 ${
                    star <= stars ? "fill-[hsl(45,100%,55%)] text-[hsl(45,100%,55%)]" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>

          <p className="text-xl font-bold text-gray-600 mb-6">{getComment(stars)}</p>

          <div className="space-y-3">
            <div className="flex justify-between text-lg font-bold">
              <span className="text-gray-700">{t("Ejercicios Completados", "Exercises Completed")}</span>
              <span className="text-[hsl(176,84%,35%)]">
                {progress?.completedCount}/{progress?.totalActivities}
              </span>
            </div>
            <Progress value={progress?.progressPercentage ?? 0} variant="student-lime" className="h-6" />
          </div>
        </div>

        {/* All Exercises by Domain */}
        {exerciseGroups.map((domain) => {
          const domainCompletedCount = domain.exercises.filter((exercise: any) => 
            completedMap.has(exercise.id)
          ).length;
          const theme = getDomainTheme(domain.domain_name);
          const Icon = theme.icon;
          const domainProgress = domain.exercises.length > 0 
            ? (domainCompletedCount / domain.exercises.length) * 100 
            : 0;

          return (
            <div key={domain.domain_name} className="space-y-6">
              {/* Domain Header - Chunky Style */}
              <div 
                className="rounded-3xl border-4 p-6 shadow-[0_6px_0_rgba(0,0,0,0.1)] transition-all hover:shadow-[0_8px_0_rgba(0,0,0,0.1)] hover:-translate-y-0.5"
                style={{
                  backgroundColor: theme.bgColor,
                  borderColor: theme.borderColor,
                }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className="p-4 rounded-2xl border-4"
                    style={{ 
                      backgroundColor: theme.color,
                      borderColor: theme.borderColor,
                    }}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-3xl font-black" style={{ color: theme.color }}>
                      {domain.domain_name}
                    </h2>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black" style={{ color: theme.color }}>
                      {domainCompletedCount}/{domain.exercises.length}
                    </span>
                  </div>
                </div>
                <div className="h-4 bg-white/50 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ 
                      width: `${domainProgress}%`,
                      backgroundColor: theme.color,
                    }}
                  />
                </div>
              </div>

              {/* Exercise Cards Grid */}
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
                      <ExerciseCardV2
                        id={exercise.id}
                        title={exercise.title}
                        description={exercise.description}
                        type={exercise.type}
                        subtype={exercise.subtype}
                        parentLessonTitle={exercise.parent_lesson?.title}
                        isCompleted={isCompleted}
                        completionData={completedMap.get(exercise.id)}
                        category={exercise.subject_area}
                        domainColor={theme.color}
                        domainBgColor={theme.bgColor}
                        domainBorderColor={theme.borderColor}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Back Button */}
        <div className="flex justify-center">
          <Link to="/student-dashboard">
            <button className="flex items-center gap-2 rounded-xl border-4 border-[hsl(176,84%,55%)] bg-white text-[hsl(176,84%,35%)] font-black text-lg py-4 px-8 shadow-[0_4px_0_hsl(176,84%,55%)] hover:shadow-[0_6px_0_hsl(176,84%,55%)] hover:-translate-y-0.5 active:translate-y-1 active:shadow-[0_1px_0_hsl(176,84%,55%)] transition-all">
              <ArrowLeft className="h-5 w-5" />
              {t("Volver al Panel", "Back to Dashboard")}
            </button>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
