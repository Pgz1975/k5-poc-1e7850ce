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

  // Unit color progression - changes for each unit regardless of domain
  const unitColors = [
    { bg: "bg-gradient-to-br from-emerald-400 to-teal-500", path: "#10b981" },
    { bg: "bg-gradient-to-br from-violet-400 to-purple-500", path: "#8b5cf6" },
    { bg: "bg-gradient-to-br from-rose-400 to-pink-500", path: "#f43f5e" },
    { bg: "bg-gradient-to-br from-amber-400 to-orange-500", path: "#f59e0b" },
    { bg: "bg-gradient-to-br from-sky-400 to-blue-500", path: "#0ea5e9" },
    { bg: "bg-gradient-to-br from-fuchsia-400 to-pink-600", path: "#d946ef" },
    { bg: "bg-gradient-to-br from-lime-400 to-green-500", path: "#84cc16" },
    { bg: "bg-gradient-to-br from-indigo-400 to-blue-600", path: "#6366f1" },
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

  const decorationTypes = [
    "thick-leaf", "forest-leaf", "three-leaves", "oval-leaf", 
    "twin-leaves", "split-leaf", "small-leaves"
  ] as const;

  // Generate curved path positions for nodes
  const generatePathPosition = (index: number, total: number) => {
    const amplitude = 120; // Increased for more dramatic curves
    const frequency = 0.4; // Smoother waves
    const xOffset = Math.sin(index * frequency) * amplitude;
    return xOffset;
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
                const colorScheme = unitColors[groupIndex % unitColors.length];
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
                      color={colorScheme.bg}
                      totalLessons={group.lessons.length}
                      completedLessons={completedInDomain}
                    />

                    {/* Curved path with lesson nodes */}
                    <div className="relative flex flex-col items-center py-8">
                      {/* Lesson nodes positioned along curve */}
                      {group.lessons.map((lesson, lessonIndex) => {
                        const state = getNodeState(lesson.id);
                        const xOffset = generatePathPosition(lessonIndex, group.lessons.length);
                        const decorationType = decorationTypes[lessonIndex % decorationTypes.length];
                        const decorationSide = xOffset > 0 ? "left" : "right";
                        
                        return (
                          <motion.div
                            key={lesson.id}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: groupIndex * 0.1 + lessonIndex * 0.05 }}
                            className="relative"
                            style={{ 
                              transform: `translateX(${xOffset}px)`,
                              marginBottom: lessonIndex < group.lessons.length - 1 ? '140px' : '70px'
                            }}
                          >
                            {/* Nature decoration along path */}
                            {lessonIndex % 2 === 0 && (
                              <PathDecoration
                                type={decorationType}
                                position={decorationSide}
                                size={lessonIndex % 3 === 0 ? "lg" : "md"}
                                className="top-1/2 -translate-y-1/2"
                              />
                            )}
                            
                            {/* Additional scattered leaves */}
                            {lessonIndex % 3 === 1 && (
                              <div 
                                className="absolute opacity-20 pointer-events-none"
                                style={{
                                  [decorationSide === "left" ? "right" : "left"]: "-80px",
                                  top: "50%",
                                  transform: "translateY(-50%) rotate(-25deg)"
                                }}
                              >
                                <img 
                                  src={`/design elements/svgs/reshot-icon-${decorationType}.svg`}
                                  alt=""
                                  className="w-10 h-10"
                                />
                              </div>
                            )}
                            
                            <LessonNode
                              state={state}
                              color={colorScheme.bg}
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
                        className="relative mt-8"
                      >
                        {/* Tree decoration next to milestone */}
                        <div className="absolute -left-20 top-1/2 -translate-y-1/2 opacity-20 pointer-events-none">
                          <img 
                            src="/design elements/svgs/reshot-icon-small-leaves-P4MUEALCWH.svg"
                            alt=""
                            className="w-16 h-16"
                          />
                        </div>
                        <div className="absolute -right-20 top-1/2 -translate-y-1/2 opacity-20 pointer-events-none">
                          <img 
                            src="/design elements/svgs/reshot-icon-split-leaf-GV53AWKBCS.svg"
                            alt=""
                            className="w-16 h-16 rotate-180"
                          />
                        </div>
                        
                        <MilestoneIcon
                          type="shield"
                          number={groupIndex + 1}
                          unlocked={completedInDomain === group.lessons.length}
                          color={colorScheme.bg}
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
