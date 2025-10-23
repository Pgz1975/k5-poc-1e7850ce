import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { CoquiMascot } from "@/components/CoquiMascot";
import { CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { Helmet } from "react-helmet";

export default function ViewLesson() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();

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

      toast.success(t("¡Lección completada!", "Lesson completed!"));
      navigate("/student-dashboard/lessons");
    } catch (error) {
      console.error("Error marking lesson as complete:", error);
      toast.error(t("Error al completar la lección", "Error completing lesson"));
    }
  };

  if (isLoading) {
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

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-primary/5">
      <Helmet>
        <title>{lesson.title} - LecturaPR</title>
      </Helmet>

      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Lesson Header */}
          <Card className="border-2 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <CoquiMascot state="reading_book" size="medium" />
                <div className="flex-1">
                  <h1 className="text-3xl font-bold mb-2">{lesson.title}</h1>
                  {lesson.description && (
                    <p className="text-muted-foreground">{lesson.description}</p>
                  )}
                </div>
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
      </main>

      <Footer />
    </div>
  );
}
