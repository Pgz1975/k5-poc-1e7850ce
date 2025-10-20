import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, TrendingUp, Clock, Star, Lightbulb, Target } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Helmet } from "react-helmet";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const FamilyDashboard = () => {
  const { t } = useLanguage();

  const weeklyProgress = [
    { day: t("Lun", "Mon"), minutes: 25 },
    { day: t("Mar", "Tue"), minutes: 30 },
    { day: t("Mié", "Wed"), minutes: 28 },
    { day: t("Jue", "Thu"), minutes: 35 },
    { day: t("Vie", "Fri"), minutes: 32 },
    { day: t("Sáb", "Sat"), minutes: 0 },
    { day: t("Dom", "Sun"), minutes: 0 },
  ];

  const recommendations = [
    {
      titleEs: "Practicar Pronunciación",
      titleEn: "Practice Pronunciation",
      descriptionEs: "María necesita práctica adicional con palabras que contienen la letra 'r'.",
      descriptionEn: "María needs additional practice with words containing the letter 'r'.",
      icon: Lightbulb,
    },
    {
      titleEs: "Lectura en Voz Alta",
      titleEn: "Read Aloud",
      descriptionEs: "Lean juntos 15 minutos diarios para mejorar la fluidez.",
      descriptionEn: "Read together for 15 minutes daily to improve fluency.",
      icon: BookOpen,
    },
    {
      titleEs: "Vocabulario del Día",
      titleEn: "Word of the Day",
      descriptionEs: "Introduce una palabra nueva cada día durante las comidas.",
      descriptionEn: "Introduce a new word each day during meals.",
      icon: Target,
    },
  ];

  return (
    <>
      <Helmet>
        <title>{t("Portal Familiar - LecturaPR", "Family Portal - LecturaPR")}</title>
        <meta name="description" content={t("Portal para familias", "Family portal")} />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1 py-8">
          <div className="container px-4 md:px-6 space-y-8">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {t("Portal Familiar", "Family Portal")}
              </h1>
              <p className="text-muted-foreground">
                {t("Progreso de María González · 3er Grado", "María González's Progress · 3rd Grade")}
              </p>
            </div>

            {/* Quick Overview */}
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
                  <p className="text-xs text-success">
                    {t("Por encima del promedio", "Above average")}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    {t("Tiempo Esta Semana", "Time This Week")}
                  </CardTitle>
                  <Clock className="h-4 w-4 text-secondary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">150 {t("min", "min")}</div>
                  <p className="text-xs text-muted-foreground">
                    {t("Meta: 120 min", "Goal: 120 min")}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    {t("Actividades Completadas", "Activities Completed")}
                  </CardTitle>
                  <Star className="h-4 w-4 text-success" />
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
                    {t("Progreso General", "Overall Progress")}
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-success" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">88%</div>
                  <p className="text-xs text-success">
                    +12% {t("este trimestre", "this quarter")}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Weekly Activity */}
            <Card>
              <CardHeader>
                <CardTitle>{t("Actividad Semanal", "Weekly Activity")}</CardTitle>
                <CardDescription>
                  {t("Minutos de lectura diarios", "Daily reading minutes")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={weeklyProgress}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="minutes" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      dot={{ fill: 'hsl(var(--primary))', r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Skills Progress */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t("Habilidades de Lectura", "Reading Skills")}</CardTitle>
                  <CardDescription>
                    {t("Evaluación por categoría", "Assessment by category")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">
                        {t("Comprensión", "Comprehension")}
                      </span>
                      <span className="text-sm font-medium text-primary">88%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-success transition-all" 
                        style={{ width: '88%' }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">
                        {t("Fluidez", "Fluency")}
                      </span>
                      <span className="text-sm font-medium text-primary">85%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-success transition-all" 
                        style={{ width: '85%' }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">
                        {t("Vocabulario", "Vocabulary")}
                      </span>
                      <span className="text-sm font-medium text-primary">90%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-success transition-all" 
                        style={{ width: '90%' }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">
                        {t("Pronunciación", "Pronunciation")}
                      </span>
                      <span className="text-sm font-medium text-secondary">82%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-secondary to-accent transition-all" 
                        style={{ width: '82%' }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t("Logros Recientes", "Recent Achievements")}</CardTitle>
                  <CardDescription>
                    {t("Reconocimientos obtenidos", "Achievements earned")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center">
                      <Star className="h-6 w-6 text-success" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">
                        {t("Racha de 7 Días", "7-Day Streak")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {t("Completado hoy", "Completed today")}
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
                      <TrendingUp className="h-6 w-6 text-secondary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">
                        {t("Nivel 3 Alcanzado", "Level 3 Reached")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {t("Hace 3 días", "3 days ago")}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle>{t("Sugerencias para Apoyar en Casa", "Suggestions to Support at Home")}</CardTitle>
                <CardDescription>
                  {t("Actividades recomendadas por el mentor AI", "Activities recommended by AI mentor")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recommendations.map((rec, index) => (
                  <div key={index} className="flex gap-4 p-4 bg-muted/30 rounded-lg">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <rec.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">{t(rec.titleEs, rec.titleEn)}</h4>
                      <p className="text-sm text-muted-foreground">
                        {t(rec.descriptionEs, rec.descriptionEn)}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default FamilyDashboard;
