import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatCard } from "@/components/ui/stat-card";
import { Users, TrendingUp, School, Activity, Award, Download, Filter, Brain } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Helmet } from "react-helmet";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { AIInsightCard } from "@/components/TeacherDashboard/AIInsightCard";
import { TrendIndicator } from "@/components/AdminDashboard/TrendIndicator";
import {
  mockExecutiveKPIs,
  mockRegionalPerformance,
  mockProgramComparison,
  mockPolicyMetrics,
  mockDiagnosticResults,
  mockIslandGradePerformance,
  mockExecutiveAIInsights
} from "@/data/deprExecutiveData";

const DEPRExecutiveDashboard = () => {
  const { t } = useLanguage();

  return (
    <>
      <Helmet>
        <title>{t("Panel Ejecutivo DEPR - FluenxIA", "DEPR Executive Dashboard - FluenxIA")}</title>
        <meta name="description" content={t("Panel de control ejecutivo del Departamento de Educación", "Department of Education executive control panel")} />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <Header />
        
        <main className="flex-1 py-8">
          <div className="max-w-7xl mx-auto px-4 md:px-6 space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  {t("Panel Ejecutivo DEPR", "DEPR Executive Dashboard")}
                </h1>
                <p className="text-muted-foreground">
                  {t("Puerto Rico · 7 Regiones · 551 Escuelas K-5", "Puerto Rico · 7 Regions · 551 K-5 Schools")}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  {t("Filtros", "Filters")}
                </Button>
                <Button className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                  <Download className="h-4 w-4" />
                  {t("Exportar Reporte Ejecutivo", "Export Executive Report")}
                </Button>
              </div>
            </div>

            {/* Executive KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <StatCard
                icon={Users}
                value={mockExecutiveKPIs.totalStudents.toLocaleString()}
                label={t("Total Estudiantes", "Total Students")}
                color="lime"
              />
              <StatCard
                icon={TrendingUp}
                value={`${mockExecutiveKPIs.islandAverage}%`}
                label={t("Promedio Isla", "Island Average")}
                color="yellow"
              />
              <StatCard
                icon={School}
                value={mockExecutiveKPIs.totalSchools.toString()}
                label={t("Total Escuelas", "Total Schools")}
                color="peach"
              />
              <StatCard
                icon={Activity}
                value={`${mockExecutiveKPIs.platformUsageRate}%`}
                label={t("Tasa de Uso", "Usage Rate")}
                color="pink"
              />
              <StatCard
                icon={Award}
                value={mockExecutiveKPIs.programHealthScore.toString()}
                label={t("Salud del Programa", "Program Health")}
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
                    {t("Perspectivas Estratégicas Impulsadas por IA", "AI-Powered Strategic Insights")}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {t("Análisis automático a nivel isla", "Automated island-level analysis")}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {mockExecutiveAIInsights.map((insight) => (
                  <AIInsightCard key={insight.id} {...insight} />
                ))}
              </div>
            </div>

            {/* Policy Impact & Grade Performance */}
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="border-2 border-gray-200 shadow-md hover:shadow-lg transition-all">
                <CardHeader>
                  <CardTitle>{t("Impacto de Política - Adopción", "Policy Impact - Adoption")}</CardTitle>
                  <CardDescription>
                    {t("Progreso de implementación (Meta: 50% para Dic)", "Implementation progress (Goal: 50% by Dec)")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={mockPolicyMetrics}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="month" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                      />
                      <Legend />
                      <Line 
                        yAxisId="left"
                        type="monotone" 
                        dataKey="schoolsOnboarded" 
                        stroke="hsl(220, 100%, 65%)" 
                        strokeWidth={3}
                        name={t("Escuelas Activas", "Active Schools")}
                      />
                      <Line 
                        yAxisId="left"
                        type="monotone" 
                        dataKey="targetSchools" 
                        stroke="hsl(125, 100%, 55%)" 
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        name={t("Meta (50%)", "Goal (50%)")}
                      />
                      <Line 
                        yAxisId="right"
                        type="monotone" 
                        dataKey="activeUsers" 
                        stroke="hsl(270, 100%, 65%)" 
                        strokeWidth={2}
                        name={t("Usuarios Activos", "Active Users")}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border-2 border-gray-200 shadow-md hover:shadow-lg transition-all">
                <CardHeader>
                  <CardTitle>{t("Desempeño por Grado (Isla)", "Performance by Grade (Island)")}</CardTitle>
                  <CardDescription>
                    {t("Distribución K-5", "K-5 Distribution")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={mockIslandGradePerformance}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="grade" />
                      <YAxis />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                      />
                      <Legend />
                      <Bar dataKey="average" fill="hsl(220, 100%, 65%)" name={t("Promedio", "Average")} radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Regional Performance Table */}
            <Card className="border-2 border-gray-200 shadow-md hover:shadow-lg transition-all">
              <CardHeader>
                <CardTitle>{t("Desempeño Regional", "Regional Performance")}</CardTitle>
                <CardDescription>
                  {t("Comparación de las 7 regiones educativas", "Comparison of the 7 educational regions")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("Región", "Region")}</TableHead>
                      <TableHead>{t("Promedio", "Average")}</TableHead>
                      <TableHead>{t("Escuelas", "Schools")}</TableHead>
                      <TableHead>{t("Estudiantes", "Students")}</TableHead>
                      <TableHead>{t("Tendencia", "Trend")}</TableHead>
                      <TableHead>{t("Estado", "Status")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockRegionalPerformance.map((region) => (
                      <TableRow key={region.id}>
                        <TableCell className="font-medium">{t(region.region, region.regionEn)}</TableCell>
                        <TableCell>
                          <span className="font-bold text-lg">{region.average}%</span>
                        </TableCell>
                        <TableCell>{region.schools}</TableCell>
                        <TableCell>{region.students.toLocaleString()}</TableCell>
                        <TableCell>
                          <TrendIndicator trend={region.trend} size="lg" />
                        </TableCell>
                        <TableCell>
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: region.color }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Program Comparison & Diagnostic Tests */}
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="border-2 border-gray-200 shadow-md hover:shadow-lg transition-all">
                <CardHeader>
                  <CardTitle>{t("Comparación Programa Español vs Inglés", "Spanish vs English Program Comparison")}</CardTitle>
                  <CardDescription>
                    {t("Métricas clave por idioma", "Key metrics by language")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={mockProgramComparison}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey={t("metric", "metricEn")} />
                      <YAxis />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                      />
                      <Legend />
                      <Bar dataKey="spanish" fill="hsl(125, 100%, 55%)" name={t("Español", "Spanish")} />
                      <Bar dataKey="english" fill="hsl(190, 100%, 65%)" name={t("Inglés", "English")} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border-2 border-gray-200 shadow-md hover:shadow-lg transition-all">
                <CardHeader>
                  <CardTitle>{t("Resultados Pruebas Diagnósticas", "Diagnostic Test Results")}</CardTitle>
                  <CardDescription>
                    {t("Agosto, Diciembre, Mayo", "August, December, May")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={mockDiagnosticResults}>
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
                      <Line type="monotone" dataKey="august" stroke="hsl(11, 100%, 65%)" name={t("Agosto", "August")} />
                      <Line type="monotone" dataKey="december" stroke="hsl(45, 100%, 65%)" name={t("Diciembre", "December")} />
                      <Line type="monotone" dataKey="may" stroke="hsl(125, 100%, 55%)" strokeWidth={3} name={t("Mayo", "May")} />
                    </LineChart>
                  </ResponsiveContainer>
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

export default DEPRExecutiveDashboard;
