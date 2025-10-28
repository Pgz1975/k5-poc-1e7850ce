import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { CoquiLessonAssistantGuard } from "@/components/coqui/CoquiLessonAssistantGuard";
import { CoquiVoiceBridge } from "@/components/coqui/CoquiVoiceBridge";
import { CheckCircle, Lock, BookOpen } from "lucide-react";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { Helmet } from "react-helmet";
import { checkLessonLocked } from "@/utils/lessonUnlocking";
import { useStudentProfile } from "@/hooks/useStudentProfile";
import { useUnitColor } from "@/hooks/useUnitColor";
import { cn } from "@/lib/utils";

export default function ViewLesson() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const queryClient = useQueryClient();
  const { data: profile } = useStudentProfile();
  
  // Get unit color scheme for V2 styling
  const { colorScheme, isLoading: colorLoading } = useUnitColor(id);
  
  // Voice session management for navigation guard
  const endSessionRef = useRef<(() => Promise<void>) | null>(null);

  // Track viewport for responsive assistant (single instance)
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth >= 1024;
  });

  useEffect(() => {
    const handleResize = () => {
      if (typeof window === "undefined") return;
      setIsDesktop(window.innerWidth >= 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  const { data: lesson, isLoading } = useQuery({
    queryKey: ["lesson", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("manual_assessments")
        .select("*")
        .eq("id", id)
        .eq("type", "lesson")
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });

  // Check if lesson is locked
  const { data: lockData, isLoading: lockLoading } = useQuery({
    queryKey: ["lesson-lock-status", id, profile?.gradeLevel, profile?.learningLanguages],
    queryFn: async () => {
      if (!id || !profile?.gradeLevel) return { isLocked: false };

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { isLocked: false };

      // Get ordering for this grade, filtered by student's learning languages
      const { data: ordering } = await supabase
        .from("lesson_ordering")
        .select(`
          id, 
          assessment_id, 
          display_order,
          domain_name,
          manual_assessments!lesson_ordering_assessment_id_fkey (language)
        `)
        .eq("grade_level", profile.gradeLevel)
        .order("display_order");

      // Filter ordering to only include lessons in student's learning languages
      const filteredOrdering = ordering?.filter(o => {
        const lesson = o.manual_assessments as any;
        return lesson && (profile.learningLanguages ?? ["es", "en"]).includes(lesson.language);
      }).map(o => ({
        id: o.id,
        assessment_id: o.assessment_id,
        display_order: o.display_order,
        domain_name: o.domain_name
      })) ?? [];

      // Get completed activities
      const { data: completed } = await supabase
        .from("completed_activity")
        .select("activity_id, score, completed_at")
        .eq("student_id", user.id)
        .eq("activity_type", "lesson");

      if (!filteredOrdering || !completed) return { isLocked: false };

      const isLocked = checkLessonLocked(id, filteredOrdering, completed);
      return { isLocked };
    },
    enabled: !!id && !!profile?.gradeLevel && !!profile?.learningLanguages,
  });

  const handleComplete = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error("No authenticated user");

      const { error } = await supabase.from("completed_activity").insert({
        student_id: user.id,
        activity_id: id!,
        activity_type: "lesson",
        score: null, // Lessons don't have scores
      });

      if (error) throw error;

      // Invalidate queries to refresh lesson list and unlock next lesson
      await queryClient.invalidateQueries({ 
        queryKey: ['student-progress', 'lesson', profile?.gradeLevel, profile?.learningLanguages] 
      });
      await queryClient.invalidateQueries({ 
        queryKey: ['lessons-with-order', profile?.gradeLevel] 
      });

      // Check if lesson has exercises
      const { data: exercises } = await supabase
        .from("manual_assessments")
        .select("id")
        .eq("parent_lesson_id", id)
        .order("order_in_lesson");

      if (exercises && exercises.length > 0) {
        // Has exercises - navigate with voice cleanup guard
        console.log('[ViewLesson] 🚦 Navigating to exercises, cleaning up voice...');
        if (endSessionRef.current) {
          await endSessionRef.current();
        }
        await new Promise(resolve => setTimeout(resolve, 200));
        
        toast.success(t("¡Lección completada! Ahora los ejercicios.", "Lesson completed! Now the exercises."));
        navigate(`/lesson/${id}/exercises`);
      } else {
        // No exercises - show confetti and return to dashboard
        console.log('[ViewLesson] 🚦 Returning to dashboard, cleaning up voice...');
        if (endSessionRef.current) {
          await endSessionRef.current();
        }
        await new Promise(resolve => setTimeout(resolve, 200));
        
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6']
        });

        toast.success(t("¡Lección completada!", "Lesson completed!"));
        
        // Navigate after a short delay to enjoy the confetti
        setTimeout(() => {
          navigate("/student-dashboard/lessons");
        }, 1500);
      }
    } catch (error) {
      console.error("Error marking lesson as complete:", error);
      toast.error(t("Error al completar la lección", "Error completing lesson"));
    }
  };

  if (isLoading || lockLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p>{t("Lección no encontrada", "Lesson not found")}</p>
        </main>
        <Footer />
      </div>
    );
  }

  const defaultLessonGuidance = `Start by greeting the Grade 1 student and summarizing the lesson "${lesson.title}". Read aloud or paraphrase any key instructions from the content, then guide them through the concept using questions and examples. Stay within this lesson and use a Socratic approach—offer hints and prompts before revealing answers.`;

  const lessonVoiceContext = {
    title: lesson.title,
    subtype: lesson.subtype,
    language: lesson.language,
    voiceGuidance: lesson.voice_guidance ?? defaultLessonGuidance,
    coquiDialogue: lesson.coqui_dialogue,
    pronunciationWords: lesson.pronunciation_words,
    content: lesson.content as Record<string, unknown> | null
  };

  // Show locked message if lesson is locked
  if (lockData?.isLocked) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <Helmet>
          <title>{t("Lección Bloqueada", "Locked Lesson")} - LecturaPR</title>
        </Helmet>

        <Header />

        <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
          <Card className="max-w-md border-4 shadow-lg">
            <CardContent className="p-8 text-center space-y-6">
              <div className="flex justify-center">
                <div className={cn(
                  "p-6 rounded-full border-4",
                  colorScheme?.iconBg,
                  colorScheme?.border,
                  "opacity-40"
                )}>
                  <Lock className="w-16 h-16 text-white" />
                </div>
              </div>
              
              <div className="space-y-2">
                <h1 className="text-2xl font-bold">
                  {t("Esta lección está bloqueada", "This lesson is locked")}
                </h1>
                <p className="text-muted-foreground">
                  {t(
                    "Completa la lección anterior para desbloquear esta",
                    "Complete the previous lesson to unlock this one"
                  )}
                </p>
              </div>

              <Button
                size="lg"
                onClick={() => navigate("/student-dashboard/lessons")}
              >
                {t("Ver Mis Lecciones", "View My Lessons")}
              </Button>
            </CardContent>
          </Card>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-primary/5">
      <Helmet>
        <title>{lesson.title} - LecturaPR</title>
      </Helmet>

      <Header />

      <main className="flex-1 container mx-auto px-4 py-8 relative">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Lesson Header - V2 Style */}
          <Card className={cn(
            "border-4 rounded-2xl",
            colorScheme?.border,
            colorScheme?.shadow,
            "bg-white"
          )}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                {/* Unit icon */}
                <div className={cn(
                  "w-16 h-16 rounded-xl border-4 flex items-center justify-center flex-shrink-0",
                  colorScheme?.iconBg,
                  colorScheme?.border,
                  "shadow-[0_4px_0_rgba(0,0,0,0.12)]"
                )}>
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                
                <div className="flex-1">
                  <h1 className="text-3xl font-black text-gray-800 mb-1">{lesson.title}</h1>
                  {lesson.description && (
                    <p className="text-base font-bold text-gray-600">{lesson.description}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lesson Content with Mascot */}
          <div className="flex gap-6 items-start">
            <Card className="border-2 flex-1">
              <CardContent className="p-8 prose prose-lg max-w-none">
                {lesson.content && typeof lesson.content === 'object' && 'text' in lesson.content && lesson.content.text && (
                  <div dangerouslySetInnerHTML={{ __html: String(lesson.content.text) }} />
                )}
                
                {lesson.content && typeof lesson.content === 'object' && !('text' in lesson.content && lesson.content.text) && 'question' in lesson.content && lesson.content.question && (
                  <div className="whitespace-pre-wrap">
                    {String(lesson.content.question)}
                  </div>
                )}
                
                {lesson.content && typeof lesson.content === 'object' && 'questionImage' in lesson.content && lesson.content.questionImage && (
                  <img 
                    src={String(lesson.content.questionImage)} 
                    alt="Lesson content" 
                    className="rounded-lg shadow-md w-full mt-4" 
                  />
                )}
                
                {lesson.content && typeof lesson.content === 'object' && 'images' in lesson.content && Array.isArray(lesson.content.images) && lesson.content.images.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    {lesson.content.images.map((image: any, index: number) => (
                      <img
                        key={index}
                        src={image.url}
                        alt={image.alt || `Lesson image ${index + 1}`}
                        className="rounded-lg shadow-md w-full"
                      />
                    ))}
                  </div>
                )}
                
                {(!lesson.content || (typeof lesson.content === 'object' && !('text' in lesson.content && lesson.content.text) && !('question' in lesson.content && lesson.content.question))) && (
                  <p className="text-muted-foreground italic">
                    {t("Esta lección aún no tiene contenido.", "This lesson has no content yet.")}
                  </p>
                )}
              </CardContent>
          </Card>

          {/* Interactive Coquí Assistant - Single Instance */}
          {lesson && (
            <>
              <div className={isDesktop ? "hidden lg:block flex-shrink-0" : "lg:hidden"}>
                <CoquiLessonAssistantGuard
                  activityId={lesson.id}
                  activityType="lesson"
                  position={isDesktop ? "inline" : "fixed"}
                  voiceContext={lessonVoiceContext}
                  className={isDesktop ? "hidden lg:block flex-shrink-0" : "lg:hidden"}
                  autoConnect={true}
                />
              </div>
              
              {/* Voice session bridge for navigation guard */}
              <CoquiVoiceBridge
                activityId={lesson.id}
                activityType="lesson"
                voiceContext={lessonVoiceContext}
                endSessionRef={endSessionRef}
              />
            </>
          )}
        </div>

          {/* Complete Button - V2 Style */}
          <div className="flex justify-center gap-4">
            <Button
              variant="outline"
              size="lg"
              className={cn(
                "rounded-2xl border-4 font-bold",
                colorScheme?.border,
                "bg-white hover:bg-gray-50"
              )}
              onClick={async () => {
                console.log('[ViewLesson] 🚦 Back button - cleaning up voice...');
                if (endSessionRef.current) {
                  await endSessionRef.current();
                }
                await new Promise(resolve => setTimeout(resolve, 200));
                navigate("/student-dashboard/lessons");
              }}
            >
              {t("Volver", "Back")}
            </Button>
            <Button
              size="lg"
              className={cn(
                "gap-2 rounded-2xl border-4 font-black text-white",
                colorScheme?.bg,
                colorScheme?.border,
                colorScheme?.shadow,
                "hover:shadow-[0_8px_0_rgba(0,0,0,0.15)] hover:-translate-y-0.5",
                "active:shadow-[0_2px_0_rgba(0,0,0,0.15)] active:translate-y-1",
                "transition-all duration-200"
              )}
              onClick={handleComplete}
            >
              <CheckCircle className="w-5 h-5" />
              {t("Marcar como Completada", "Mark as Complete")}
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
