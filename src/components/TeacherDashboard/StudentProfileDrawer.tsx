import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { mockStudentProfiles } from "@/data/studentProfiles";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Clock, TrendingUp, BookOpen, Brain, MessageSquare, Mail, CheckCircle, Target } from "lucide-react";

interface StudentProfileDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: any | null;
}

export const StudentProfileDrawer = ({ open, onOpenChange, student }: StudentProfileDrawerProps) => {
  const { t } = useLanguage();

  if (!student) return null;

  const profile = mockStudentProfiles[student.id as keyof typeof mockStudentProfiles] || mockStudentProfiles[1];

  const getCommunicationIcon = (method: string) => {
    switch (method) {
      case "email":
        return <Mail className="h-4 w-4" />;
      case "whatsapp":
        return <MessageSquare className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-2xl">
            {t(student.nameEs, student.nameEn)}
          </SheetTitle>
          <SheetDescription>
            {t("Perfil completo y análisis de progreso", "Complete profile and progress analysis")}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-lime-600">{student.grade}</div>
                  <div className="text-sm text-muted-foreground">{t("Nivel Actual", "Current Level")}</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-cyan-600">{student.activities}</div>
                  <div className="text-sm text-muted-foreground">{t("Actividades", "Activities")}</div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="sessions" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="sessions">{t("Sesiones", "Sessions")}</TabsTrigger>
              <TabsTrigger value="skills">{t("Habilidades", "Skills")}</TabsTrigger>
              <TabsTrigger value="assessments">{t("Evaluaciones", "Assessments")}</TabsTrigger>
              <TabsTrigger value="ai">{t("IA", "AI")}</TabsTrigger>
            </TabsList>

            {/* Sessions Tab */}
            <TabsContent value="sessions" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-peach-600" />
                    {t("Historial de Sesiones", "Session History")}
                  </CardTitle>
                  <CardDescription>
                    {t("Últimas 5 sesiones de lectura", "Last 5 reading sessions")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t("Fecha", "Date")}</TableHead>
                        <TableHead>{t("Duración", "Duration")}</TableHead>
                        <TableHead>{t("Actividades", "Activities")}</TableHead>
                        <TableHead>{t("Promedio", "Avg Score")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {profile.sessions.map((session, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{session.date}</TableCell>
                          <TableCell>{session.duration} min</TableCell>
                          <TableCell>{session.activitiesCompleted}</TableCell>
                          <TableCell>
                            <Badge className="bg-lime-100 text-lime-700 border-lime-300">
                              {session.avgScore}%
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Skills Tab */}
            <TabsContent value="skills" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-lime-600" />
                    {t("Progresión de Habilidades", "Skills Progression")}
                  </CardTitle>
                  <CardDescription>
                    {t("Evolución de cada área de competencia", "Evolution of each skill area")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="date" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                      />
                      <Legend />
                      <Line 
                        data={profile.skillProgression.comprehension}
                        type="monotone" 
                        dataKey="score" 
                        stroke="hsl(329, 100%, 71%)" 
                        strokeWidth={2}
                        name={t("Comprensión", "Comprehension")}
                      />
                      <Line 
                        data={profile.skillProgression.fluency}
                        type="monotone" 
                        dataKey="score" 
                        stroke="hsl(176, 84%, 71%)" 
                        strokeWidth={2}
                        name={t("Fluidez", "Fluency")}
                      />
                      <Line 
                        data={profile.skillProgression.vocabulary}
                        type="monotone" 
                        dataKey="score" 
                        stroke="hsl(125, 100%, 71%)" 
                        strokeWidth={2}
                        name={t("Vocabulario", "Vocabulary")}
                      />
                      <Line 
                        data={profile.skillProgression.pronunciation}
                        type="monotone" 
                        dataKey="score" 
                        stroke="hsl(11, 100%, 67%)" 
                        strokeWidth={2}
                        name={t("Pronunciación", "Pronunciation")}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Assessments Tab */}
            <TabsContent value="assessments" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-cyan-600" />
                    {t("Historial de Evaluaciones", "Assessment History")}
                  </CardTitle>
                  <CardDescription>
                    {t("Resultados de pruebas diagnósticas", "Diagnostic test results")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {profile.assessmentHistory.map((assessment, index) => (
                      <div key={index} className="p-4 border rounded-lg bg-card">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <div className="font-semibold">{assessment.type}</div>
                            <div className="text-sm text-muted-foreground">{assessment.date}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-lime-600">{assessment.score}%</div>
                            <div className="text-xs text-muted-foreground">
                              {assessment.standardsCovered} {t("estándares", "standards")}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* AI Recommendations Tab */}
            <TabsContent value="ai" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-purple-600" />
                    {t("Recomendaciones de IA", "AI Recommendations")}
                  </CardTitle>
                  <CardDescription>
                    {t("Planes personalizados generados automáticamente", "Automatically generated personalized plans")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {profile.aiRecommendations.length > 0 ? (
                    <div className="space-y-4">
                      {profile.aiRecommendations.map((rec, index) => (
                        <div key={index} className="p-4 border rounded-lg bg-card">
                          <div className="flex items-start gap-3">
                            <Target className={`h-5 w-5 ${rec.priority === 'high' ? 'text-coral-600' : 'text-cyan-600'}`} />
                            <div className="flex-1">
                              <div className="font-medium mb-1">{rec.recommendation}</div>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                  {rec.date}
                                </Badge>
                                <Badge className={rec.status === 'active' ? 'bg-lime-100 text-lime-700 border-lime-300' : 'bg-gray-100 text-gray-700 border-gray-300'}>
                                  {rec.status === 'active' ? t('Activo', 'Active') : t('Completado', 'Completed')}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground py-8">
                      {t("No hay recomendaciones disponibles", "No recommendations available")}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Parent Communication Log */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-lime-600" />
                    {t("Comunicación con Padres", "Parent Communication")}
                  </CardTitle>
                  <CardDescription>
                    {t("Historial de mensajes enviados", "Sent messages history")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {profile.parentCommunication.map((comm, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 border rounded-lg bg-card">
                        {getCommunicationIcon(comm.method)}
                        <div className="flex-1">
                          <div className="font-medium text-sm">{comm.subject}</div>
                          <div className="text-xs text-muted-foreground">{comm.date}</div>
                        </div>
                        {comm.opened && (
                          <CheckCircle className="h-4 w-4 text-lime-600" />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
};
