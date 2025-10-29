import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Clock, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { Helmet } from 'react-helmet';
import CoquiMascot from '@/components/CoquiMascot';

export default function AvailableAssessments() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [assessments, setAssessments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssessments = async () => {
      if (!user) return;

      // Get user's grade level using the database function
      const { data: userGrade, error: gradeError } = await supabase
        .rpc('get_user_grade_level', { user_id: user.id });

      if (gradeError) {
        console.error('Error fetching grade level:', gradeError);
        setLoading(false);
        return;
      }

      // Fetch published assessments for user's grade
      const { data, error } = await supabase
        .from('manual_assessments')
        .select('*')
        .eq('status', 'published')
        .eq('grade_level', userGrade)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching assessments:', error);
        toast({
          title: t("Error", "Error"),
          description: t("No se pudieron cargar las lecciones", "Could not load lessons"),
          variant: 'destructive'
        });
      } else {
        setAssessments(data || []);
      }
      
      setLoading(false);
    };

    fetchAssessments();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-secondary/5 to-background">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{t("Lecciones Disponibles - FluenxIA", "Available Lessons - FluenxIA")}</title>
        <meta name="description" content={t("Lecciones y actividades de lectura", "Reading lessons and activities")} />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-secondary/5 to-background">
        <Header />
        
        <main className="flex-1 py-8 md:py-12">
          <div className="container px-4 md:px-6 max-w-6xl mx-auto space-y-8">
            {/* Header with Mascot */}
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <CoquiMascot 
                  state="reading"
                  size="medium"
                  position="inline"
                />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-primary">
                {t("Lecciones Disponibles", "Available Lessons")}
              </h1>
              <p className="text-lg text-muted-foreground">
                {t("Selecciona una lección para comenzar", "Select a lesson to begin")}
              </p>
            </div>

            {/* Assessments Grid */}
            {assessments.length === 0 ? (
              <Card className="p-12 text-center">
                <CardContent>
                  <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h2 className="text-2xl font-bold mb-2">
                    {t("No hay lecciones disponibles", "No lessons available")}
                  </h2>
                  <p className="text-muted-foreground">
                    {t("Pronto habrá nuevas lecciones para ti", "New lessons will be available soon")}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {assessments.map((assessment) => (
                  <Card
                    key={assessment.id}
                    className="group cursor-pointer transition-all hover:scale-105 hover:shadow-xl border-2 hover:border-primary"
                    onClick={() => navigate(`/assessment/${assessment.id}`)}
                  >
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-start justify-between">
                        <Badge variant={assessment.language === 'es' ? 'default' : 'secondary'}>
                          {assessment.language === 'es' ? 'Español' : 'English'}
                        </Badge>
                        <Badge variant="outline">
                          {t("Grado", "Grade")} {assessment.grade_level}
                        </Badge>
                      </div>

                      <div>
                        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                          {assessment.title}
                        </h3>
                        {assessment.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {assessment.description}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{assessment.estimated_duration_minutes} {t("min", "min")}</span>
                        </div>
                        <Badge variant="outline" className="capitalize">
                          {assessment.type}
                        </Badge>
                      </div>

                      <div className="pt-2 border-t">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            {assessment.view_count || 0} {t("visitas", "views")}
                          </span>
                          {assessment.enable_voice && (
                            <Badge variant="secondary" className="text-xs">
                              🎤 {t("Con voz", "Voice enabled")}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
