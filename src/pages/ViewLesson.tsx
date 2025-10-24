import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { CoquiMascot } from "@/components/CoquiMascot";
import { CheckCircle, Lock } from "lucide-react";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { Helmet } from "react-helmet";
import { checkLessonLocked } from "@/utils/lessonUnlocking";
import { useStudentProfile } from "@/hooks/useStudentProfile";

export default function ViewLesson() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const { data: profile } = useStudentProfile();

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
    queryKey: ["lesson-lock-status", id, profile?.gradeLevel],
    queryFn: async () => {
      if (!id || !profile?.gradeLevel) return { isLocked: false };

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { isLocked: false };

      // Get ordering for this grade
      const { data: ordering } = await supabase
        .from("lesson_ordering")
        .select("id, assessment_id, display_order")
        .eq("grade_level", profile.gradeLevel)
        .order("display_order");

      // Get completed activities
      const { data: completed } = await supabase
        .from("completed_activity")
        .select("activity_id, score, completed_at")
        .eq("student_id", user.id)
        .eq("activity_type", "lesson");

      if (!ordering || !completed) return { isLocked: false };

      const isLocked = checkLessonLocked(id, ordering, completed);
      return { isLocked };
    },
    enabled: !!id && !!profile?.gradeLevel,
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
        // Has exercises - navigate to exercise flow
        toast.success(t("¡Lección completada! Ahora los ejercicios.", "Lesson completed! Now the exercises."));
        navigate(`/lesson/${id}/exercises`);
      } else {
        // No exercises - show confetti and return to dashboard
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

  // Show locked message if lesson is locked
  if (lockData?.isLocked) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-primary/5">
        <Helmet>
          <title>{t("Lección Bloqueada", "Locked Lesson")} - LecturaPR</title>
        </Helmet>

        <Header />

        <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
          <Card className="max-w-md border-2 shadow-lg">
            <CardContent className="p-8 text-center space-y-6">
              <div className="flex justify-center">
                <div className="p-6 rounded-full bg-muted">
                  <Lock className="w-16 h-16 text-muted-foreground" />
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
          {/* Lesson Header */}
          <Card className="border-2 shadow-lg">
            <CardContent className="p-6">
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">{lesson.title}</h1>
                {lesson.description && (
                  <p className="text-muted-foreground">{lesson.description}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Lesson Content */}
          <Card className="border-2">
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

          {/* Complete Button */}
          <div className="flex justify-center gap-4">
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate("/student-dashboard/lessons")}
            >
              {t("Volver", "Back")}
            </Button>
            <Button
              size="lg"
              className="gap-2"
              onClick={handleComplete}
            >
              <CheckCircle className="w-5 h-5" />
              {t("Marcar como Completada", "Mark as Complete")}
            </Button>
          </div>
        </div>
        
        <div className="absolute bottom-6 right-6 z-40 pointer-events-none">
          <CoquiMascot state="reading" size="small" position="inline" />
        </div>
      </main>

      <Footer />
    </div>
  );
}
