import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Sparkles, BookOpen } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Helmet } from "react-helmet";
import { CoquiVoiceChat } from "@/components/StudentDashboard/CoquiVoiceChat";
import CoquiMascot from "@/components/CoquiMascot";
import { useState } from "react";
import { useStudentProfile } from "@/hooks/useStudentProfile";
import { ActivityCards } from "@/components/StudentDashboard/ActivityCards";

const StudentDashboard = () => {
  const { t } = useLanguage();
  const [mascotState, setMascotState] = useState("happy");
  const { data: profile, isLoading } = useStudentProfile();

  const getGradeLabel = (gradeLevel: number) => {
    if (gradeLevel === 0) return t("Kindergarten", "Kindergarten");
    return t(`${gradeLevel}er Grado`, `Grade ${gradeLevel}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{t("Mi Panel - LecturaPR", "My Dashboard - LecturaPR")}</title>
        <meta name="description" content={t("Panel de estudiante", "Student dashboard")} />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-secondary/5 to-background">
        <Header />
        
        <main className="flex-1 py-6 md:py-12">
          <div className="container px-4 md:px-6 max-w-6xl mx-auto space-y-8 md:space-y-12">
            {/* Welcome Section with Grade Level */}
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <CoquiMascot 
                  state={mascotState}
                  size="large"
                  position="inline"
                  className="animate-bounce-once"
                />
              </div>
              
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-2 text-primary">
                  {t("¡Hola, ", "Hello, ")}{profile?.fullName || t("Estudiante", "Student")}! 👋
                </h1>
                <p className="text-xl md:text-2xl font-semibold text-secondary mb-2">
                  {getGradeLabel(profile?.gradeLevel ?? 0)}
                </p>
                <p className="text-lg md:text-xl text-muted-foreground">
                  {t("¿Qué quieres hacer hoy?", "What do you want to do today?")}
                </p>
              </div>
            </div>

            {/* Activity Cards */}
            <ActivityCards />

            {/* Talk to Coquí Section */}
            <CoquiVoiceChat />

            {/* Fun Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              <Card className="bg-gradient-to-br from-primary/10 to-primary-glow/5 border-primary/20">
                <CardContent className="p-4 md:p-6 text-center space-y-2">
                  <div className="flex justify-center">
                    <div className="h-12 w-12 md:h-14 md:w-14 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
                      <Star className="h-6 w-6 md:h-7 md:w-7 text-white fill-white" />
                    </div>
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-primary">24</div>
                  <p className="text-xs md:text-sm text-muted-foreground font-medium">
                    {t("Actividades", "Activities")}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-primary/10 to-primary-glow/5 border-primary/20">
                <CardContent className="p-4 md:p-6 text-center space-y-2">
                  <div className="flex justify-center">
                    <div className="h-12 w-12 md:h-14 md:w-14 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
                      <Sparkles className="h-6 w-6 md:h-7 md:w-7 text-white" />
                    </div>
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-primary">7</div>
                  <p className="text-xs md:text-sm text-muted-foreground font-medium">
                    {t("Días Seguidos", "Day Streak")}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-primary/10 to-primary-glow/5 border-primary/20">
                <CardContent className="p-4 md:p-6 text-center space-y-2">
                  <div className="flex justify-center">
                    <div className="h-12 w-12 md:h-14 md:w-14 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
                      <BookOpen className="h-6 w-6 md:h-7 md:w-7 text-white" />
                    </div>
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-primary">3.2</div>
                  <p className="text-xs md:text-sm text-muted-foreground font-medium">
                    {t("Nivel", "Level")}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-primary/10 to-primary-glow/5 border-primary/20">
                <CardContent className="p-4 md:p-6 text-center space-y-2">
                  <div className="flex justify-center">
                    <div className="h-12 w-12 md:h-14 md:w-14 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
                      <Star className="h-6 w-6 md:h-7 md:w-7 text-white fill-white" />
                    </div>
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-primary">12</div>
                  <p className="text-xs md:text-sm text-muted-foreground font-medium">
                    {t("Estrellas", "Stars")}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Progress Bar - Next Goal */}
            <Card className="border-2 border-primary/20">
              <CardContent className="p-6 md:p-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl md:text-2xl font-bold">
                    {t("¡Próxima Meta!", "Next Goal!")}
                  </h3>
                  <span className="text-2xl">🎯</span>
                </div>
                <div className="space-y-3">
                  <p className="text-base md:text-lg text-muted-foreground">
                    {t("30 actividades para ganar tu próxima medalla", "30 activities to earn your next medal")}
                  </p>
                  <div className="h-6 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-success transition-all flex items-center justify-end pr-2" 
                      style={{ width: '80%' }}
                    >
                      <span className="text-xs font-bold text-white">24/30</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {t("¡Solo 6 más! 💪", "Just 6 more! 💪")}
                  </p>
                </div>
              </CardContent>
            </Card>

          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default StudentDashboard;
