import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatCard } from "@/components/ui/stat-card";
import { Users, TrendingUp, BookOpen, AlertCircle, Download, Filter, Brain, Eye, Target } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Helmet } from "react-helmet";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { ManageLessonsDrawer } from "@/components/TeacherDashboard/ManageLessonsDrawer";
import { AIInsightCard } from "@/components/TeacherDashboard/AIInsightCard";
import { ErrorPatternChart } from "@/components/TeacherDashboard/ErrorPatternChart";
import { ResponseTimeChart } from "@/components/TeacherDashboard/ResponseTimeChart";
import { RiskIndicatorBadge } from "@/components/TeacherDashboard/RiskIndicatorBadge";
import { StudentRecommendationDrawer } from "@/components/TeacherDashboard/StudentRecommendationDrawer";
import { 
  mockAIInsights, 
  mockErrorPatterns, 
  mockResponseTimeData, 
  mockStudentRecommendations 
} from "@/data/teacherAnalytics";

const TeacherDashboard = () => {
  const { t } = useLanguage();
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleViewRecommendation = (studentName: string) => {
    setSelectedStudent(studentName);
    setDrawerOpen(true);
  };

  const classData = [
    { month: t("Ago", "Aug"), promedio: 75, meta: 80 },
    { month: t("Sep", "Sep"), promedio: 78, meta: 80 },
    { month: t("Oct", "Oct"), promedio: 82, meta: 80 },
    { month: t("Nov", "Nov"), promedio: 85, meta: 80 },
    { month: t("Dic", "Dec"), promedio: 87, meta: 80 },
  ];

  const skillsDistribution = [
    { skill: t("Comprensión", "Comprehension"), bajo: 3, medio: 12, alto: 10 },
    { skill: t("Fluidez", "Fluency"), bajo: 5, medio: 10, alto: 10 },
    { skill: t("Vocabulario", "Vocabulary"), bajo: 2, medio: 8, alto: 15 },
    { skill: t("Pronunciación", "Pronunciation"), bajo: 4, medio: 14, alto: 7 },
  ];

  const students = [
    { id: 1, nameEs: "María González", nameEn: "María González", grade: "3.2", activities: 24, lastActive: t("Hoy", "Today"), status: "success", riskLevel: "low" as const, hasRecommendation: false },
    { id: 2, nameEs: "Juan Pérez", nameEn: "Juan Pérez", grade: "2.8", activities: 18, lastActive: t("Hoy", "Today"), status: "success", riskLevel: "low" as const, hasRecommendation: false },
    { id: 3, nameEs: "Sofia Rodríguez", nameEn: "Sofia Rodríguez", grade: "3.5", activities: 28, lastActive: t("Ayer", "Yesterday"), status: "warning", riskLevel: "low" as const, hasRecommendation: false },
    { id: 4, nameEs: "Carlos Torres", nameEn: "Carlos Torres", grade: "2.5", activities: 12, lastActive: t("Hace 3 días", "3 days ago"), status: "error", riskLevel: "high" as const, hasRecommendation: true },
    { id: 5, nameEs: "Ana Díaz", nameEn: "Ana Díaz", grade: "2.9", activities: 16, lastActive: t("Hace 2 días", "2 days ago"), status: "error", riskLevel: "high" as const, hasRecommendation: true },
    { id: 6, nameEs: "Luis Rivera", nameEn: "Luis Rivera", grade: "2.7", activities: 14, lastActive: t("Hace 4 días", "4 days ago"), status: "error", riskLevel: "high" as const, hasRecommendation: true },
  ];

  return (
    <>
      <Helmet>
        <title>{t("Panel de Maestros - FluenxIA", "Teacher Dashboard - FluenxIA")}</title>
        <meta name="description" content={t("Panel de control para maestros", "Teacher control panel")} />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
        <Header />
        
        <main className="flex-1 py-8">
          <div className="max-w-7xl mx-auto px-4 md:px-6 space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  {t("Panel del Maestro", "Teacher Dashboard")}
                </h1>
                <p className="text-muted-foreground">
                  {t("3er Grado · Escuela José de Diego · 25 estudiantes", "3rd Grade · José de Diego School · 25 students")}
                </p>
              </div>
              <div className="flex gap-2">
                <ManageLessonsDrawer />
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  {t("Filtros", "Filters")}
                </Button>
                <Button className="gap-2">
                  <Download className="h-4 w-4" />
                  {t("Exportar Reporte", "Export Report")}
                </Button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <StatCard
                icon={Users}
                value="25"
                label={t("Total Estudiantes", "Total Students")}
                color="lime"
              />
              <StatCard
                icon={TrendingUp}
                value="87%"
                label={t("Promedio de Clase", "Class Average")}
                color="yellow"
              />
              <StatCard
                icon={BookOpen}
                value="342"
                label={t("Actividades Esta Semana", "Activities This Week")}
                color="peach"
              />
              <StatCard
                icon={AlertCircle}
                value="3"
                label={t("Requieren Atención", "Need Attention")}
                color="coral"
              />
            </div>

            {/* AI Insights Hero Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-purple-400 to-purple-500 rounded-lg">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {t("Perspectivas Impulsadas por IA", "AI-Powered Insights")}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {t("Análisis automático para identificar tendencias y oportunidades", "Automated analysis to identify trends and opportunities")}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {mockAIInsights.map((insight) => (
                  <AIInsightCard
                    key={insight.id}
                    {...insight}
                  />
                ))}
              </div>
            </div>

            {/* Analytics Charts */}
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="border-2 border-gray-200 shadow-md hover:shadow-lg transition-all">
                <CardHeader>
                  <CardTitle>{t("Progreso de la Clase", "Class Progress")}</CardTitle>
                  <CardDescription>
                    {t("Evolución del promedio mensual", "Monthly average evolution")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={classData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="promedio" 
                        stroke="hsl(190, 100%, 65%)" 
                        strokeWidth={3}
                        name={t("Promedio", "Average")}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="meta" 
                        stroke="hsl(125, 100%, 55%)" 
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        name={t("Meta", "Goal")}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <ErrorPatternChart data={mockErrorPatterns} />
            </div>

            {/* Response Time Analysis */}
            <ResponseTimeChart data={mockResponseTimeData} />

            {/* Enhanced Student List */}
            <Card className="border-2 border-gray-200 shadow-md hover:shadow-lg transition-all">
              <CardHeader>
                <CardTitle>{t("Lista de Estudiantes", "Student List")}</CardTitle>
                <CardDescription>
                  {t("Monitoreo individual con recomendaciones de IA", "Individual monitoring with AI recommendations")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("Estudiante", "Student")}</TableHead>
                      <TableHead>{t("Nivel", "Level")}</TableHead>
                      <TableHead>{t("Actividades", "Activities")}</TableHead>
                      <TableHead>{t("Última Actividad", "Last Active")}</TableHead>
                      <TableHead>{t("Riesgo", "Risk")}</TableHead>
                      <TableHead>{t("Recomendación IA", "AI Rec.")}</TableHead>
                      <TableHead>{t("Acciones", "Actions")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">
                          {t(student.nameEs, student.nameEn)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{student.grade}</Badge>
                        </TableCell>
                        <TableCell>{student.activities}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {student.lastActive}
                        </TableCell>
                        <TableCell>
                          <RiskIndicatorBadge level={student.riskLevel} />
                        </TableCell>
                        <TableCell>
                          {student.hasRecommendation ? (
                            <Badge className="bg-purple-100 text-purple-700 border-purple-300">
                              <Brain className="h-3 w-3 mr-1" />
                              {t("Disponible", "Available")}
                            </Badge>
                          ) : (
                            <span className="text-gray-400 text-sm">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" className="gap-1">
                              <Eye className="h-3 w-3" />
                              {t("Ver", "View")}
                            </Button>
                            {student.hasRecommendation && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="gap-1 bg-purple-50 hover:bg-purple-100"
                                onClick={() => handleViewRecommendation(t(student.nameEs, student.nameEn))}
                              >
                                <Target className="h-3 w-3" />
                                {t("Plan IA", "AI Plan")}
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </main>

        <Footer />

        {/* Student Recommendation Drawer */}
        <StudentRecommendationDrawer
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
          recommendation={selectedStudent ? mockStudentRecommendations[selectedStudent] : null}
        />
      </div>
    </>
  );
};

export default TeacherDashboard;
