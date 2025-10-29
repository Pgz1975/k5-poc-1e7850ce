import { useLanguage } from "@/contexts/LanguageContext";
import { useStudentProfile } from "@/hooks/useStudentProfile";
import { useStudentProgress } from "@/hooks/useStudentProgress";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Star, ArrowLeft, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { AssessmentCardV2 } from "@/components/StudentDashboard/AssessmentCard-v2";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useMemo } from "react";
import { ActivityActions } from "@/components/ActivityManagement/ActivityActions";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function StudentAssessmentsProgressV2() {
  const { t, language } = useLanguage();
  const { data: profile, isLoading: profileLoading } = useStudentProfile();

  const { data: progress, isLoading: progressLoading } = useStudentProgress({
    activityType: "assessment",
    gradeLevel: profile?.gradeLevel ?? 0,
    learningLanguages: profile?.learningLanguages ?? ["es", "en"],
  });

  // Fetch all assessments with domain information
  const { data: allAssessments } = useQuery({
    queryKey: ["all-assessments", profile?.gradeLevel, profile?.learningLanguages],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("manual_assessments")
        .select("*")
        .eq("type", "assessment")
        .in("language", (profile?.learningLanguages ?? ["es", "en"]) as ("es" | "en" | "es-PR")[])
        .order("created_at");

      if (error) throw error;
      return data;
    },
    enabled: !!profile?.gradeLevel && !!profile?.learningLanguages,
  });

  // Fetch lesson ordering to get domain information
  const { data: lessonOrdering } = useQuery({
    queryKey: ["lesson-ordering-assessments", profile?.gradeLevel],
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

  // Group assessments by domain/subject
  const assessmentGroups = useMemo(() => {
    if (!allAssessments) return [];

    const groups = new Map<string, any>();
    
    allAssessments.forEach((assessment, index) => {
      // Use subject_area or default grouping
      const domainName = assessment.subject_area || t("Evaluaciones Generales", "General Assessments");
      const domainOrder = index; // Simple ordering by creation
      
      if (!groups.has(domainName)) {
        groups.set(domainName, {
          domain_name: domainName,
          domain_order: domainOrder,
          assessments: [],
        });
      }
      
      groups.get(domainName)!.assessments.push(assessment);
    });

    return Array.from(groups.values())
      .sort((a, b) => a.domain_order - b.domain_order);
  }, [allAssessments, t]);

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

  // V2 Color schemes for units - matching lessons and exercises
  const unitColorSchemes = [
    {
      bg: "bg-[hsl(329,100%,71%)]",
      border: "border-[hsl(329,100%,65%)]",
      text: "text-[hsl(329,100%,35%)]",
      shadow: "shadow-[0_6px_0_hsl(329,100%,65%)]",
      iconBg: "bg-[hsl(329,100%,71%)]",
      headerBg: "bg-gradient-to-br from-[hsl(329,100%,85%)] to-[hsl(329,100%,71%)]",
    },
    {
      bg: "bg-[hsl(11,100%,67%)]",
      border: "border-[hsl(11,100%,65%)]",
      text: "text-[hsl(11,100%,35%)]",
      shadow: "shadow-[0_6px_0_hsl(11,100%,65%)]",
      iconBg: "bg-[hsl(11,100%,67%)]",
      headerBg: "bg-gradient-to-br from-[hsl(11,100%,85%)] to-[hsl(11,100%,67%)]",
    },
    {
      bg: "bg-[hsl(27,100%,71%)]",
      border: "border-[hsl(27,100%,65%)]",
      text: "text-[hsl(27,100%,35%)]",
      shadow: "shadow-[0_6px_0_hsl(27,100%,65%)]",
      iconBg: "bg-[hsl(27,100%,71%)]",
      headerBg: "bg-gradient-to-br from-[hsl(27,100%,85%)] to-[hsl(27,100%,71%)]",
    },
    {
      bg: "bg-[hsl(125,100%,71%)]",
      border: "border-[hsl(125,100%,65%)]",
      text: "text-[hsl(125,100%,35%)]",
      shadow: "shadow-[0_6px_0_hsl(125,100%,65%)]",
      iconBg: "bg-[hsl(125,100%,71%)]",
      headerBg: "bg-gradient-to-br from-[hsl(125,100%,85%)] to-[hsl(125,100%,71%)]",
    },
    {
      bg: "bg-[hsl(176,84%,71%)]",
      border: "border-[hsl(176,84%,65%)]",
      text: "text-[hsl(176,84%,35%)]",
      shadow: "shadow-[0_6px_0_hsl(176,84%,65%)]",
      iconBg: "bg-[hsl(176,84%,71%)]",
      headerBg: "bg-gradient-to-br from-[hsl(176,84%,85%)] to-[hsl(176,84%,71%)]",
    },
    {
      bg: "bg-[hsl(250,100%,75%)]",
      border: "border-[hsl(250,100%,70%)]",
      text: "text-[hsl(250,100%,35%)]",
      shadow: "shadow-[0_6px_0_hsl(250,100%,70%)]",
      iconBg: "bg-[hsl(250,100%,75%)]",
      headerBg: "bg-gradient-to-br from-[hsl(250,100%,90%)] to-[hsl(250,100%,75%)]",
    },
  ];

  if (profileLoading || progressLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Helmet>
        <title>{t("Mis Evaluaciones - FluenxIA", "My Assessments - FluenxIA")}</title>
      </Helmet>

      <Header />

      <main className="flex-1 py-12">
        <div className="container max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="mb-12 text-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-6 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md mb-4"
            >
              <Sparkles className="w-5 h-5 text-purple-500" />
              <span className="font-bold text-gray-700">
                {t("Demuestra lo Aprendido", "Show What You Know")}
              </span>
            </motion.div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              {t("Evaluaciones", "Assessments")}
            </h1>
            <p className="text-gray-600">
              {profile?.gradeLevel === 0 
                ? t("Kindergarten", "Kindergarten")
                : t(`Grado ${profile?.gradeLevel}`, `Grade ${profile?.gradeLevel}`)}
            </p>
          </div>

          {/* Progress Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border-4 border-white bg-white p-8 shadow-[0_8px_0_rgba(0,0,0,0.1)] mb-12"
          >
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
                <span className="text-gray-700">{t("Evaluaciones Completadas", "Assessments Completed")}</span>
                <span className="text-[hsl(250,100%,55%)]">
                  {progress?.completedCount}/{progress?.totalActivities}
                </span>
              </div>
              <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[hsl(250,100%,65%)] to-[hsl(329,100%,65%)] rounded-full transition-all duration-500"
                  style={{ width: `${progress?.progressPercentage ?? 0}%` }}
                />
              </div>
            </div>
          </motion.div>

          {/* All Assessments by Domain/Category */}
          <div className="space-y-20">
            {assessmentGroups.map((group, groupIndex) => {
              const domainCompletedCount = group.assessments.filter((assessment: any) => 
                completedMap.has(assessment.id)
              ).length;
              
              const colorScheme = unitColorSchemes[groupIndex % unitColorSchemes.length];

              return (
                <motion.div
                  key={group.domain_name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: groupIndex * 0.1 }}
                >
                  {/* Assessment Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-8">
                    {group.assessments.map((assessment: any, assessmentIndex: number) => {
                      const isCompleted = completedMap.has(assessment.id);
                      
                      return (
                        <motion.div
                          key={assessment.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: assessmentIndex * 0.05 }}
                          className="relative"
                        >
                          <div className="absolute top-2 right-2 z-10">
                            <ActivityActions 
                              activity={{ id: assessment.id, title: assessment.title }} 
                              redirectPath="/student-dashboard/assessments"
                              size="sm"
                            />
                          </div>
                          <AssessmentCardV2
                            id={assessment.id}
                            title={assessment.title}
                            description={assessment.description}
                            estimatedDuration={assessment.estimated_duration_minutes}
                            isCompleted={isCompleted}
                            completionData={completedMap.get(assessment.id)}
                            colorScheme={colorScheme}
                          />
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Back Button */}
          <div className="mt-12 flex justify-center">
            <Link to="/student-dashboard">
              <Button
                variant="outline"
                size="lg"
                className="shadow-md"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t("Volver al Panel", "Back to Dashboard")}
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
