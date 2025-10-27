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
import { ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LessonNode } from "@/components/StudentDashboard/LessonNode";
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
      if (!acc[domain]) {
        acc[domain] = [];
      }
      acc[domain].push(lesson);
      return acc;
    }, {} as Record<string, typeof lessonsWithOrder>);

    return Object.entries(groups).map(([domain, lessons]) => ({
      domain,
      lessons: lessons.sort((a, b) => {
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

  // Domain color mapping
  const domainColors: Record<string, string> = {
    "Alfabeto y Fonética": "bg-gradient-to-br from-purple-400 to-purple-600",
    "Lectura y Comprensión": "bg-gradient-to-br from-pink-400 to-pink-600",
    "Vocabulario": "bg-gradient-to-br from-blue-400 to-blue-600",
    "Expresión": "bg-gradient-to-br from-green-400 to-green-600",
    "TEST_G1_FIXTURES": "bg-gradient-to-br from-orange-400 to-orange-600",
  };

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

  const decorationTypes = [
    "thick-leaf", "forest-leaf", "three-leaves", "oval-leaf", 
    "twin-leaves", "split-leaf", "small-leaves"
  ] as const;

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
        <title>{t("Mis Lecciones", "My Lessons")} - LecturaPR</title>
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
          <div className="relative">
            {/* Background decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
              <img 
                src="/design elements/svgs/reshot-icon-tree-2RGUBYTHQZ.svg" 
                alt=""
                className="absolute -left-20 top-40 w-32 h-32 opacity-50"
              />
              <img 
                src="/design elements/svgs/reshot-icon-tree-2RGUBYTHQZ.svg" 
                alt=""
                className="absolute -right-20 top-[600px] w-32 h-32 opacity-50"
              />
            </div>

            {/* Path container */}
            <div className="relative space-y-16">
              {domainGroups.map((group, groupIndex) => {
                const color = domainColors[group.domain] || "bg-gradient-to-br from-primary to-primary-glow";
                const completedInDomain = group.lessons.filter(l => completedMap.has(l.id)).length;
                
                return (
                  <motion.div
                    key={group.domain}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: groupIndex * 0.1 }}
                  >
                    <UnitHeader
                      unitNumber={groupIndex + 1}
                      title={group.domain}
                      color={color}
                      totalLessons={group.lessons.length}
                      completedLessons={completedInDomain}
                    />

                    {/* Lesson nodes in winding path */}
                    <div className="relative flex flex-col items-center gap-12 py-8">
                      {group.lessons.map((lesson, lessonIndex) => {
                        const state = getNodeState(lesson.id);
                        const position = lessonIndex % 3; // 0 = left, 1 = center, 2 = right
                        const offsetClass = position === 0 ? "-translate-x-16" : position === 2 ? "translate-x-16" : "";
                        const decorationType = decorationTypes[lessonIndex % decorationTypes.length];
                        
                        return (
                          <motion.div
                            key={lesson.id}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: groupIndex * 0.1 + lessonIndex * 0.05 }}
                            className={`relative ${offsetClass}`}
                          >
                            {/* Path decoration */}
                            <PathDecoration
                              type={decorationType}
                              position={position === 0 ? "right" : "left"}
                              size={lessonIndex % 2 === 0 ? "md" : "sm"}
                              className="top-1/2 -translate-y-1/2"
                            />
                            
                            <LessonNode
                              state={state}
                              color={color}
                              lessonNumber={lessonIndex + 1}
                              onClick={() => navigate(`/lesson/${lesson.id}`)}
                            />
                          </motion.div>
                        );
                      })}
                      
                      {/* Milestone at end of unit */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: groupIndex * 0.1 + group.lessons.length * 0.05 }}
                      >
                        <MilestoneIcon
                          type="shield"
                          number={groupIndex + 1}
                          unlocked={completedInDomain === group.lessons.length}
                          color={color}
                        />
                      </motion.div>
                    </div>
                  </motion.div>
                );
              })}
              
              {/* Final trophy */}
              {domainGroups.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: domainGroups.length * 0.1 }}
                  className="flex justify-center"
                >
                  <MilestoneIcon
                    type="trophy"
                    unlocked={completedActivities.length === lessonsWithOrder?.length}
                    color="bg-gradient-to-br from-yellow-400 to-orange-500"
                  />
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
