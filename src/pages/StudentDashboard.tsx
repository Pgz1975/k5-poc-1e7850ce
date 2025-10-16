import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Brain, Trophy, Calendar, TrendingUp } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Helmet } from "react-helmet";
import { ReadingActivities } from "@/components/StudentDashboard/ReadingActivities";
import { ProgressChart } from "@/components/StudentDashboard/ProgressChart";
import { AIMentorChat } from "@/components/StudentDashboard/AIMentorChat";

const StudentDashboard = () => {
  const { t } = useLanguage();

  return (
    <>
      <Helmet>
        <title>{t("Panel de Estudiante - LecturaPR", "Student Dashboard - LecturaPR")}</title>
        <meta name="description" content={t("Panel de control para estudiantes", "Student control panel")} />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1 py-8">
          <div className="container px-4 md:px-6 space-y-8">
            {/* Welcome Section */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  {t("¡Bienvenido, María!", "Welcome, María!")}
                </h1>
                <p className="text-muted-foreground">
                  {t("3er Grado · Escuela José de Diego", "3rd Grade · José de Diego School")}
                </p>
              </div>
              <Button className="gap-2">
                <Calendar className="h-4 w-4" />
                {t("Evaluación de Hoy", "Today's Assessment")}
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    {t("Nivel de Lectura", "Reading Level")}
                  </CardTitle>
                  <BookOpen className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3.2</div>
                  <p className="text-xs text-muted-foreground">
                    {t("Por encima del promedio", "Above average")}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    {t("Actividades Completadas", "Activities Completed")}
                  </CardTitle>
                  <Trophy className="h-4 w-4 text-success" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24</div>
                  <p className="text-xs text-muted-foreground">
                    {t("Este mes", "This month")}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    {t("Racha Actual", "Current Streak")}
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-secondary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">7 {t("días", "days")}</div>
                  <p className="text-xs text-muted-foreground">
                    {t("¡Sigue así!", "Keep it up!")}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    {t("Sesiones con AI", "AI Sessions")}
                  </CardTitle>
                  <Brain className="h-4 w-4 text-accent" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">
                    {t("Esta semana", "This week")}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Progress Charts */}
            <ProgressChart />

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Reading Activities */}
              <div className="lg:col-span-2">
                <ReadingActivities />
              </div>

              {/* Achievements & Goals */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-success" />
                      {t("Logros Recientes", "Recent Achievements")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center">
                        <Trophy className="h-6 w-6 text-success" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">
                          {t("Racha de 7 Días", "7-Day Streak")}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {t("Hace 2 horas", "2 hours ago")}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <BookOpen className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">
                          {t("10 Lecturas Completas", "10 Readings Complete")}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {t("Hace 1 día", "1 day ago")}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center">
                        <Brain className="h-6 w-6 text-secondary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">
                          {t("Maestro AI", "AI Master")}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {t("Hace 3 días", "3 days ago")}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>{t("Próxima Meta", "Next Goal")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">
                            {t("Completar 30 actividades", "Complete 30 activities")}
                          </span>
                          <Badge variant="secondary">24/30</Badge>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-success transition-all" 
                            style={{ width: '80%' }}
                          />
                        </div>
                      </div>

                      <p className="text-xs text-muted-foreground">
                        {t(
                          "¡Estás muy cerca! Solo 6 actividades más para tu próximo logro.",
                          "You're so close! Just 6 more activities for your next achievement."
                        )}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* AI Mentor Section */}
            <AIMentorChat />
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default StudentDashboard;
