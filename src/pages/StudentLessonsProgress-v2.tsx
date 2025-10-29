import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { Helmet } from "react-helmet";
import { useStudentProfile } from "@/hooks/useStudentProfile";
import { useLessonOrdering } from "@/hooks/useLessonOrdering";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useMemo } from "react";
import { getLessonLockingStatus } from "@/utils/lessonUnlocking";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Sparkles, Lock, Star, Trophy, BookOpen, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { UnitHeader } from "@/components/StudentDashboard/UnitHeader";
import { MilestoneIcon } from "@/components/StudentDashboard/MilestoneIcon";
import { PathDecoration } from "@/components/StudentDashboard/PathDecoration";
import { motion } from "framer-motion";

const StudentLessonsProgressV2 = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: profile } = useStudentProfile();
  
  const { lessonsWithOrder, isLoading: isLoadingOrdering } = useLessonOrdering(
    profile?.gradeLevel ?? 0,
    profile?.learningLanguages ?? ["es", "en"]
  );

  const { data: completedActivities = [] } = useQuery({
    queryKey: ["completed-activities", user?.id, "lesson"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("completed_activity")
        .select("activity_id, score, completed_at")
        .eq("student_id", user?.id!)
        .eq("activity_type", "lesson");

      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  // Group lessons by domain
  const domainGroups = useMemo(() => {
    if (!lessonsWithOrder) return [];
    
    const groups = lessonsWithOrder.reduce((acc, lesson) => {
      const domain = lesson.domain_name || "Other";
      const domainOrder = lesson.domain_order ?? 999;
      
      if (!acc[domain]) {
        acc[domain] = {
          domain_name: domain,
          domain_order: domainOrder,
          lessons: []
        };
      }
      acc[domain].lessons.push(lesson);
      return acc;
    }, {} as Record<string, { domain_name: string; domain_order: number; lessons: typeof lessonsWithOrder }>);

    return Object.values(groups)
      .sort((a, b) => a.domain_order - b.domain_order)
      .map(group => ({
        domain: group.domain_name,
        domain_order: group.domain_order,
        lessons: group.lessons.sort((a, b) => {
          const aOrder = a.display_order ?? 999;
          const bOrder = b.display_order ?? 999;
          return aOrder - bOrder;
        })
      }));
  }, [lessonsWithOrder]);

  // Get locking status
  const lockingMap = useMemo(() => {
    if (!lessonsWithOrder) return new Map();
    
    // Map lessonsWithOrder to the format expected by getLessonLockingStatus
    const mappedLessons = lessonsWithOrder.map(lesson => ({
      id: lesson.id,
      assessment_id: lesson.id,
      display_order: lesson.display_order ?? 999,
      domain_name: lesson.domain_name
    }));
    
    return getLessonLockingStatus(mappedLessons, completedActivities);
  }, [lessonsWithOrder, completedActivities]);

  // Completed map
  const completedMap = useMemo(() => {
    return new Map(completedActivities.map(a => [a.activity_id, a]));
  }, [completedActivities]);

  // V2 Color schemes for units - consolidated
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

  const getNodeState = (lessonId: string) => {
    const isLocked = lockingMap.get(lessonId);
    const isCompleted = completedMap.has(lessonId);
    
    if (isLocked) return "locked";
    if (isCompleted) return "completed";
    
    // First unlocked lesson is active
    const firstUnlocked = lessonsWithOrder?.find(l => 
      !lockingMap.get(l.id) && !completedMap.has(l.id)
    );
    
    if (firstUnlocked?.id === lessonId) return "active";
    return "unlocked";
  };


  if (isLoadingOrdering) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Helmet>
        <title>{t("Mis Lecciones", "My Lessons")} - FluenxIA</title>
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
                {t("Tu Camino de Aprendizaje", "Your Learning Path")}
              </span>
            </motion.div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              {t("Lecciones", "Lessons")}
            </h1>
          </div>

          {/* Lessons Path */}
          <div className="relative pb-20">
            {/* Subtle scattered background nature decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <img 
                src="/design elements/svgs/reshot-icon-tree-2RGUBYTHQZ.svg" 
                alt=""
                className="absolute -left-24 top-20 w-32 h-32 opacity-[0.08]"
              />
              <img 
                src="/design elements/svgs/reshot-icon-thick-leaf-VRTC7E3JP5.svg" 
                alt=""
                className="absolute right-16 top-[15%] w-20 h-20 opacity-[0.1] rotate-12"
              />
              <img 
                src="/design elements/svgs/reshot-icon-forest-leaf-LSCJ9B4X6H.svg" 
                alt=""
                className="absolute left-12 top-[30%] w-24 h-24 opacity-[0.08] -rotate-6"
              />
              <img 
                src="/design elements/svgs/reshot-icon-three-leaves-KD6UVGSNFP.svg" 
                alt=""
                className="absolute right-20 top-[45%] w-28 h-28 opacity-[0.1]"
              />
              <img 
                src="/design elements/svgs/reshot-icon-oval-leaf-J5NGAV7Q2Y.svg" 
                alt=""
                className="absolute left-16 top-[60%] w-20 h-20 opacity-[0.08] rotate-45"
              />
              <img 
                src="/design elements/svgs/reshot-icon-twin-leaves-258L6V4RY3.svg" 
                alt=""
                className="absolute right-14 top-[75%] w-18 h-18 opacity-[0.1] -rotate-12"
              />
              <img 
                src="/design elements/svgs/reshot-icon-tree-2RGUBYTHQZ.svg" 
                alt=""
                className="absolute -right-28 top-[85%] w-40 h-40 opacity-[0.08]"
              />
              <img 
                src="/design elements/svgs/reshot-icon-small-leaves-P4MUEALCWH.svg" 
                alt=""
                className="absolute left-20 bottom-40 w-16 h-16 opacity-[0.08]"
              />
            </div>

            {/* Path container */}
            <div className="relative space-y-20">
              {domainGroups.map((group, groupIndex) => {
                const colorScheme = group.domain_order && group.domain_order >= 1 && group.domain_order <= 6
                  ? unitColorSchemes[group.domain_order - 1]
                  : unitColorSchemes[0];
                const completedInDomain = group.lessons.filter(l => completedMap.has(l.id)).length;
                
                return (
                  <motion.div
                    key={group.domain}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: groupIndex * 0.1 }}
                  >
              <UnitHeader
                unitNumber={group.domain_order ?? (groupIndex + 1)}
                title={group.domain}
                color={colorScheme.headerBg}
                totalLessons={group.lessons.length}
                completedLessons={completedInDomain}
              />

                    {/* V2 Horizontal Card Layout */}
                    <div className="relative flex flex-col items-stretch py-8 max-w-4xl mx-auto px-4">
                      {/* Lesson cards */}
                      {group.lessons.map((lesson, lessonIndex) => {
                        const state = getNodeState(lesson.id);
                        const isLocked = state === "locked";

                        return (
                          <motion.div
                            key={lesson.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: lessonIndex * 0.05 }}
                            className="mb-4"
                          >
                            <button
                              onClick={() => !isLocked && navigate(`/lesson/${lesson.id}`)}
                              disabled={isLocked}
                              className={cn(
                                "w-full flex items-center gap-4 md:gap-6 p-4 md:p-6 rounded-2xl border-4",
                                colorScheme.shadow,
                                colorScheme.border,
                                "bg-white",
                                "transition-all duration-200",
                                !isLocked && "hover:shadow-[0_8px_0_rgba(0,0,0,0.15)] hover:-translate-y-0.5",
                                !isLocked && "active:shadow-[0_2px_0_rgba(0,0,0,0.15)] active:translate-y-1",
                                isLocked && "opacity-50 cursor-not-allowed grayscale"
                              )}
                            >
                              {/* Left: Lesson Icon */}
                              <div className={cn(
                                "flex-shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-xl border-4 flex items-center justify-center",
                                colorScheme.iconBg,
                                colorScheme.border,
                                "shadow-[0_4px_0_rgba(0,0,0,0.12)]"
                              )}>
                                {state === "completed" && <Check className="w-7 h-7 md:w-8 md:h-8 text-white" />}
                                {state === "active" && <Star className="w-7 h-7 md:w-8 md:h-8 text-white fill-white" />}
                                {state === "locked" && <Lock className="w-7 h-7 md:w-8 md:h-8 text-white" />}
                                {state === "unlocked" && <BookOpen className="w-7 h-7 md:w-8 md:h-8 text-white" />}
                              </div>

                              {/* Right: Lesson Title and Info */}
                              <div className="flex-1 text-left min-w-0">
                                <h3 className="text-lg md:text-xl font-black text-gray-800 truncate">
                                  {lesson.title}
                                </h3>
                                <p className="text-sm font-bold text-gray-600">
                                  {t("Lección", "Lesson")} {lessonIndex + 1}
                                </p>
                              </div>

                              {/* Far Right: Status Badge */}
                              {state === "completed" && (
                                <Badge className="hidden md:flex bg-[hsl(125,100%,55%)] text-white font-bold border-0">
                                  {t("Completado", "Completed")}
                                </Badge>
                              )}
                            </button>
                          </motion.div>
                        );
                      })}
                      
                      {/* V2 Milestone */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: group.lessons.length * 0.05 + 0.2 }}
                        className="relative flex justify-center my-8"
                      >
                        <div className="flex flex-col items-center">
                          <div className="bg-gradient-to-br from-[hsl(45,100%,71%)] to-[hsl(45,100%,55%)] rounded-2xl p-6 border-4 border-[hsl(45,100%,65%)] shadow-[0_6px_0_hsl(45,100%,65%)]">
                            <Trophy className="w-12 h-12 text-white" />
                          </div>
                          
                          <div className="mt-4 bg-white rounded-xl px-6 py-3 border-4 border-[hsl(45,100%,65%)] shadow-[0_4px_0_hsl(45,100%,65%)]">
                            <span className="text-lg font-black text-[hsl(45,100%,35%)]">
                              {t("¡Unidad Completa!", "Unit Complete!")}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                );
              })}
              
              {/* Final trophy - V2 Style */}
              {domainGroups.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: domainGroups.length * 0.1 }}
                  className="flex justify-center"
                >
                  <div className="flex flex-col items-center">
                    <div className="bg-gradient-to-br from-[hsl(45,100%,71%)] to-[hsl(45,100%,55%)] rounded-3xl p-8 border-4 border-[hsl(45,100%,65%)] shadow-[0_8px_0_hsl(45,100%,65%)]">
                      <Trophy className="w-16 h-16 text-white" />
                    </div>
                    
                    <div className="mt-6 bg-white rounded-xl px-8 py-4 border-4 border-[hsl(45,100%,65%)] shadow-[0_4px_0_hsl(45,100%,65%)]">
                      <span className="text-2xl font-black text-[hsl(45,100%,35%)]">
                        {t("¡Campeón!", "Champion!")}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Back button */}
          <div className="mt-12 flex justify-center">
            <Button
              onClick={() => navigate("/student-dashboard")}
              variant="outline"
              size="lg"
              className="shadow-md"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t("Volver al Panel", "Back to Dashboard")}
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default StudentLessonsProgressV2;
