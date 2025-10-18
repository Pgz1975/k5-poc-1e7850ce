import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Star, Sparkles, Mic } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Helmet } from "react-helmet";
import { AIMentorChat } from "@/components/StudentDashboard/AIMentorChat";
import CoquiMascot from "@/components/CoquiMascot";
import { Link } from "react-router-dom";
import { useState } from "react";

const StudentDashboard = () => {
  const { t } = useLanguage();
  const [mascotState, setMascotState] = useState("happy");

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
            {/* Welcome Section with Mascot */}
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
                <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-hero bg-clip-text text-transparent">
                  {t("¡Hola, María! 👋", "Hello, María! 👋")}
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground">
                  {t("¿Qué quieres hacer hoy?", "What do you want to do today?")}
                </p>
              </div>
            </div>

            {/* Big Action Cards */}
            <div className="grid md:grid-cols-2 gap-6 md:gap-8">
              {/* Practice Reading */}
              <Link to="/reading-exercise">
                <Card className="group cursor-pointer transition-all hover:scale-105 hover:shadow-xl border-2 hover:border-primary bg-gradient-to-br from-primary/5 to-primary/10 h-full">
                  <CardContent className="p-8 md:p-10 flex flex-col items-center text-center space-y-4">
                    <div className="h-20 w-20 md:h-24 md:w-24 rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                      <BookOpen className="h-10 w-10 md:h-12 md:w-12 text-primary" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold">
                      {t("Practicar Lectura", "Practice Reading")}
                    </h2>
                    <p className="text-muted-foreground text-base md:text-lg">
                      {t("Cuentos y actividades divertidas 📚", "Fun stories and activities 📚")}
                    </p>
                  </CardContent>
                </Card>
              </Link>

              {/* Pronunciation Practice */}
              <Link to="/activities">
                <Card className="group cursor-pointer transition-all hover:scale-105 hover:shadow-xl border-2 hover:border-secondary bg-gradient-to-br from-secondary/5 to-accent/10 h-full">
                  <CardContent className="p-8 md:p-10 flex flex-col items-center text-center space-y-4">
                    <div className="h-20 w-20 md:h-24 md:w-24 rounded-full bg-secondary/20 flex items-center justify-center group-hover:bg-secondary/30 transition-colors">
                      <Mic className="h-10 w-10 md:h-12 md:w-12 text-secondary" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold">
                      {t("Práctica de Pronunciación", "Pronunciation Practice")}
                    </h2>
                    <p className="text-muted-foreground text-base md:text-lg">
                      {t("Mejora tu fluidez y claridad 🎤", "Improve your fluency and clarity 🎤")}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </div>

            {/* Fun Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              <Card className="bg-gradient-to-br from-success/10 to-success/5 border-success/20">
                <CardContent className="p-4 md:p-6 text-center space-y-2">
                  <div className="flex justify-center">
                    <Star className="h-8 w-8 md:h-10 md:w-10 text-success fill-success" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-success">24</div>
                  <p className="text-xs md:text-sm text-muted-foreground font-medium">
                    {t("Actividades", "Activities")}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                <CardContent className="p-4 md:p-6 text-center space-y-2">
                  <div className="flex justify-center">
                    <Sparkles className="h-8 w-8 md:h-10 md:w-10 text-primary" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-primary">7</div>
                  <p className="text-xs md:text-sm text-muted-foreground font-medium">
                    {t("Días Seguidos", "Day Streak")}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20">
                <CardContent className="p-4 md:p-6 text-center space-y-2">
                  <div className="flex justify-center">
                    <BookOpen className="h-8 w-8 md:h-10 md:w-10 text-secondary" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-secondary">3.2</div>
                  <p className="text-xs md:text-sm text-muted-foreground font-medium">
                    {t("Nivel", "Level")}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
                <CardContent className="p-4 md:p-6 text-center space-y-2">
                  <div className="flex justify-center">
                    <Star className="h-8 w-8 md:h-10 md:w-10 text-accent" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-accent">12</div>
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

            {/* AI Mentor Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 justify-center">
                <h2 className="text-2xl md:text-3xl font-bold text-center">
                  {t("Chatea con Coquí 🐸", "Chat with Coquí 🐸")}
                </h2>
              </div>
              <AIMentorChat />
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default StudentDashboard;
