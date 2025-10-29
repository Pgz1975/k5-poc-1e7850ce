import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatCard } from "@/components/ui/stat-card";
import { Users, TrendingUp, School, Award, AlertCircle, Download, Filter, Brain, Eye, Mail } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Helmet } from "react-helmet";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { AIInsightCard } from "@/components/TeacherDashboard/AIInsightCard";
import { TrendIndicator } from "@/components/AdminDashboard/TrendIndicator";
import { PerformanceHeatmap } from "@/components/AdminDashboard/PerformanceHeatmap";
import {
  mockRegionalMetrics,
  mockSchoolComparison,
  mockRegionalSkillsHeatmap,
  mockRegionalComparison,
  mockRegionalAIInsights
} from "@/data/regionalDirectorData";

const RegionalDirectorDashboard = () => {
  const { t } = useLanguage();

  const getPerformanceBadge = (level: 'high' | 'medium' | 'low') => {
    if (level === 'high') return <Badge className="bg-green-100 text-green-700 border-green-300">{t("Alto", "High")}</Badge>;
    if (level === 'medium') return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-300">{t("Medio", "Medium")}</Badge>;
    return <Badge className="bg-orange-100 text-orange-700 border-orange-300">{t("Bajo", "Low")}</Badge>;
  };

  return (
    <>
      <Helmet>
        <title>{t("Panel Director Regional - FluenxIA", "Regional Director Dashboard - FluenxIA")}</title>
        <meta name="description" content={t("Panel de control para directores regionales", "Regional director control panel")} />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
        <Header />
        
        <main className="flex-1 py-8">
          <div className="max-w-7xl mx-auto px-4 md:px-6 space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  {t("Panel del Director Regional", "Regional Director Dashboard")}
                </h1>
                <p className="text-muted-foreground">
                  {t("Región Bayamón · 8 Escuelas · K-5", "Bayamón Region · 8 Schools · K-5")}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  {t("Filtros", "Filters")}
                </Button>
                <Button className="gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                  <Download className="h-4 w-4" />
                  {t("Exportar Reporte", "Export Report")}
                </Button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <StatCard
                icon={Users}
                value={mockRegionalMetrics.totalStudents.toLocaleString()}
                label={t("Total Estudiantes", "Total Students")}
                color="lime"
              />
              <StatCard
                icon={TrendingUp}
                value={`${mockRegionalMetrics.regionalAverage}%`}
                label={t("Promedio Regional", "Regional Average")}
                color="yellow"
              />
              <StatCard
                icon={School}
                value={mockRegionalMetrics.totalSchools.toString()}
                label={t("Total Escuelas", "Total Schools")}
                color="peach"
              />
              <StatCard
                icon={Award}
                value={mockRegionalMetrics.topSchool}
                label={t("Mejor Escuela", "Top School")}
                color="pink"
              />
              <StatCard
                icon={AlertCircle}
                value={mockRegionalMetrics.schoolsNeedingSupport.toString()}
                label={t("Necesitan Apoyo", "Need Support")}
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
                    {t("Análisis automático a nivel regional", "Automated regional-level analysis")}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {mockRegionalAIInsights.map((insight) => (
                  <AIInsightCard key={insight.id} {...insight} />
                ))}
              </div>
            </div>

            {/* Regional Comparison */}
            <Card className="border-2 border-gray-200 shadow-md hover:shadow-lg transition-all">
              <CardHeader>
                <CardTitle>{t("Comparación Regional", "Regional Comparison")}</CardTitle>
                <CardDescription>
                  {t("Bayamón vs Otras Regiones", "Bayamón vs Other Regions")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={mockRegionalComparison}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey={t("region", "regionEn")} />
                    <YAxis />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Bar 
                      dataKey="average" 
                      fill="hsl(270, 100%, 65%)" 
                      name={t("Promedio", "Average")}
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Skills Heatmap */}
            <PerformanceHeatmap data={mockRegionalSkillsHeatmap} />

            {/* School Comparison Table */}
            <Card className="border-2 border-gray-200 shadow-md hover:shadow-lg transition-all">
              <CardHeader>
                <CardTitle>{t("Comparación de Escuelas", "School Comparison")}</CardTitle>
                <CardDescription>
                  {t("Desempeño detallado por escuela", "Detailed performance by school")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("Escuela", "School")}</TableHead>
                      <TableHead>{t("Estudiantes", "Students")}</TableHead>
                      <TableHead>{t("Español", "Spanish")}</TableHead>
                      <TableHead>{t("Inglés", "English")}</TableHead>
                      <TableHead>{t("Maestros", "Teachers")}</TableHead>
                      <TableHead>{t("Uso Semanal", "Weekly Usage")}</TableHead>
                      <TableHead>{t("Tendencia", "Trend")}</TableHead>
                      <TableHead>{t("Nivel", "Level")}</TableHead>
                      <TableHead>{t("Acciones", "Actions")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockSchoolComparison.map((school) => (
                      <TableRow key={school.id}>
                        <TableCell className="font-medium">{school.schoolName}</TableCell>
                        <TableCell>{school.students}</TableCell>
                        <TableCell>
                          <span className="font-medium">{school.averageSpanish}%</span>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">{school.averageEnglish}%</span>
                        </TableCell>
                        <TableCell>{school.activeTeachers}</TableCell>
                        <TableCell>{school.weeklyUsage}%</TableCell>
                        <TableCell>
                          <TrendIndicator trend={school.trend} />
                        </TableCell>
                        <TableCell>{getPerformanceBadge(school.performanceLevel)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" className="gap-1">
                              <Eye className="h-3 w-3" />
                              {t("Ver", "View")}
                            </Button>
                            <Button variant="ghost" size="sm" className="gap-1">
                              <Mail className="h-3 w-3" />
                              {t("Contactar", "Contact")}
                            </Button>
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
      </div>
    </>
  );
};

export default RegionalDirectorDashboard;
