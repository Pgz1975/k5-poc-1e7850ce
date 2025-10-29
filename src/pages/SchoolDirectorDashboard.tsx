import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatCard } from "@/components/ui/stat-card";
import { Users, TrendingUp, BookOpen, GraduationCap, AlertTriangle, Download, Filter, Brain, Eye, Mail } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Helmet } from "react-helmet";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import { AIInsightCard } from "@/components/TeacherDashboard/AIInsightCard";
import { TrendIndicator } from "@/components/AdminDashboard/TrendIndicator";
import {
  mockSchoolMetrics,
  mockGradePerformance,
  mockClassroomPerformance,
  mockSubjectPerformance,
  mockUsageByLocation,
  mockDeviceUsage,
  mockSchoolAIInsights
} from "@/data/schoolDirectorData";

const SchoolDirectorDashboard = () => {
  const { t } = useLanguage();

  const getRiskBadge = (level: 'low' | 'medium' | 'high') => {
    if (level === 'high') return <Badge variant="destructive">{t("Alto", "High")}</Badge>;
    if (level === 'medium') return <Badge className="bg-orange-100 text-orange-700 border-orange-300">{t("Medio", "Medium")}</Badge>;
    return <Badge variant="outline" className="text-green-700 border-green-300">{t("Bajo", "Low")}</Badge>;
  };

  return (
    <>
      <Helmet>
        <title>{t("Panel Director Escolar - LecturaPR", "School Director Dashboard - LecturaPR")}</title>
        <meta name="description" content={t("Panel de control para directores escolares", "School director control panel")} />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-gradient-to-br from-cyan-50 via-teal-50 to-blue-50">
        <Header />
        
        <main className="flex-1 py-8">
          <div className="max-w-7xl mx-auto px-4 md:px-6 space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  {t("Panel del Director Escolar", "School Director Dashboard")}
                </h1>
                <p className="text-muted-foreground">
                  {t("Escuela Julia de Burgos · San Juan · K-5", "Julia de Burgos School · San Juan · K-5")}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  {t("Filtros", "Filters")}
                </Button>
                <Button className="gap-2 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600">
                  <Download className="h-4 w-4" />
                  {t("Exportar Reporte", "Export Report")}
                </Button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <StatCard
                icon={Users}
                value={mockSchoolMetrics.totalStudents.toString()}
                label={t("Total Estudiantes", "Total Students")}
                color="lime"
              />
              <StatCard
                icon={TrendingUp}
                value={`${mockSchoolMetrics.schoolAverage}%`}
                label={t("Promedio Escolar", "School Average")}
                color="yellow"
              />
              <StatCard
                icon={BookOpen}
                value={mockSchoolMetrics.activitiesThisWeek.toString()}
                label={t("Actividades Esta Semana", "Activities This Week")}
                color="peach"
              />
              <StatCard
                icon={GraduationCap}
                value={mockSchoolMetrics.totalTeachers.toString()}
                label={t("Maestros", "Teachers")}
                color="pink"
              />
              <StatCard
                icon={AlertTriangle}
                value={mockSchoolMetrics.classroomsAtRisk.toString()}
                label={t("Aulas en Riesgo", "Classrooms at Risk")}
                color="coral"
              />
            </div>

            {/* AI Insights */}
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
                    {t("Análisis automático a nivel escolar", "Automated school-level analysis")}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {mockSchoolAIInsights.map((insight) => (
                  <AIInsightCard key={insight.id} {...insight} />
                ))}
              </div>
            </div>

            {/* Grade Performance & Subject Comparison */}
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="border-2 border-gray-200 shadow-md hover:shadow-lg transition-all">
                <CardHeader>
                  <CardTitle>{t("Desempeño por Grado", "Performance by Grade")}</CardTitle>
                  <CardDescription>
                    {t("Comparación entre niveles K-5", "Comparison across K-5 levels")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={mockGradePerformance}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey={t("grade", "gradeEn")} />
                      <YAxis />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                      />
                      <Legend />
                      <Bar dataKey="average" fill="hsl(190, 100%, 65%)" name={t("Promedio", "Average")} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border-2 border-gray-200 shadow-md hover:shadow-lg transition-all">
                <CardHeader>
                  <CardTitle>{t("Comparación Español vs Inglés", "Spanish vs English Comparison")}</CardTitle>
                  <CardDescription>
                    {t("Habilidades por materia", "Skills by subject")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={mockSubjectPerformance}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey={t("metric", "metricEn")} />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} />
                      <Radar name={t("Español", "Spanish")} dataKey="spanish" stroke="hsl(125, 100%, 55%)" fill="hsl(125, 100%, 55%)" fillOpacity={0.6} />
                      <Radar name={t("Inglés", "English")} dataKey="english" stroke="hsl(190, 100%, 65%)" fill="hsl(190, 100%, 65%)" fillOpacity={0.6} />
                      <Legend />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Classroom Performance Table */}
            <Card className="border-2 border-gray-200 shadow-md hover:shadow-lg transition-all">
              <CardHeader>
                <CardTitle>{t("Desempeño por Aula", "Classroom Performance")}</CardTitle>
                <CardDescription>
                  {t("Monitoreo de maestros y clases", "Teacher and classroom monitoring")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("Maestro", "Teacher")}</TableHead>
                      <TableHead>{t("Grado/Materia", "Grade/Subject")}</TableHead>
                      <TableHead>{t("Estudiantes", "Students")}</TableHead>
                      <TableHead>{t("Promedio", "Average")}</TableHead>
                      <TableHead>{t("Completación", "Completion")}</TableHead>
                      <TableHead>{t("Riesgo", "Risk")}</TableHead>
                      <TableHead>{t("En Riesgo", "At Risk")}</TableHead>
                      <TableHead>{t("Acciones", "Actions")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockClassroomPerformance.map((classroom) => (
                      <TableRow key={classroom.id}>
                        <TableCell className="font-medium">{classroom.teacherName}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{t(classroom.gradeSubject, classroom.gradeSubjectEn)}</Badge>
                        </TableCell>
                        <TableCell>{classroom.students}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{classroom.average}%</span>
                          </div>
                        </TableCell>
                        <TableCell>{classroom.weeklyCompletion}%</TableCell>
                        <TableCell>{getRiskBadge(classroom.riskLevel)}</TableCell>
                        <TableCell>
                          <span className={classroom.studentsAtRisk > 0 ? "text-red-600 font-medium" : "text-gray-400"}>
                            {classroom.studentsAtRisk}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" className="gap-1">
                              <Eye className="h-3 w-3" />
                              {t("Ver", "View")}
                            </Button>
                            <Button variant="ghost" size="sm" className="gap-1">
                              <Mail className="h-3 w-3" />
                              {t("Mensaje", "Message")}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Usage Analytics */}
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="border-2 border-gray-200 shadow-md hover:shadow-lg transition-all">
                <CardHeader>
                  <CardTitle>{t("Uso por Ubicación", "Usage by Location")}</CardTitle>
                  <CardDescription>
                    {t("Escuela vs Casa", "School vs Home")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">{t("Escuela", "School")}</span>
                        <span className="font-bold text-cyan-600">{mockUsageByLocation.school}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-4">
                        <div 
                          className="bg-gradient-to-r from-cyan-500 to-teal-500 h-4 rounded-full transition-all"
                          style={{ width: `${mockUsageByLocation.school}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">{t("Casa", "Home")}</span>
                        <span className="font-bold text-purple-600">{mockUsageByLocation.home}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-4">
                        <div 
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-4 rounded-full transition-all"
                          style={{ width: `${mockUsageByLocation.home}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-gray-200 shadow-md hover:shadow-lg transition-all">
                <CardHeader>
                  <CardTitle>{t("Dispositivos Usados", "Devices Used")}</CardTitle>
                  <CardDescription>
                    {t("Distribución por tipo", "Distribution by type")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockDeviceUsage.map((device) => (
                      <div key={device.device}>
                        <div className="flex justify-between mb-2">
                          <span className="font-medium">{t(device.device, device.deviceEn)}</span>
                          <span className="text-sm text-muted-foreground">{device.count} ({device.percentage}%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-gradient-to-r from-teal-500 to-cyan-500 h-3 rounded-full transition-all"
                            style={{ width: `${device.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default SchoolDirectorDashboard;
