import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatCard } from "@/components/ui/stat-card";
import { Users, TrendingUp, BookOpen, AlertCircle, Download, Filter, Brain, Eye, Target, Award, Edit } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Helmet } from "react-helmet";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar } from "recharts";
import { ManageLessonsDrawer } from "@/components/TeacherDashboard/ManageLessonsDrawer";
import { AIInsightCard } from "@/components/TeacherDashboard/AIInsightCard";
import { ErrorPatternChart } from "@/components/TeacherDashboard/ErrorPatternChart";
import { ResponseTimeChart } from "@/components/TeacherDashboard/ResponseTimeChart";
import { RiskIndicatorBadge } from "@/components/TeacherDashboard/RiskIndicatorBadge";
import { StudentRecommendationDrawer } from "@/components/TeacherDashboard/StudentRecommendationDrawer";
import { UsageMetricsGrid } from "@/components/TeacherDashboard/UsageMetricsGrid";
import { ReadingProgressSection } from "@/components/TeacherDashboard/ReadingProgressSection";
import { DeviceAnalyticsChart } from "@/components/TeacherDashboard/DeviceAnalyticsChart";
import { CategoryAnalyticsChart } from "@/components/TeacherDashboard/CategoryAnalyticsChart";
import { SkillDetailCard } from "@/components/TeacherDashboard/SkillDetailCard";
import { SkillsComparisonTable } from "@/components/TeacherDashboard/SkillsComparisonTable";
import { AssessmentResultsSection } from "@/components/TeacherDashboard/AssessmentResultsSection";
import { StandardsAlignmentTable } from "@/components/TeacherDashboard/StandardsAlignmentTable";
import { AdvancedFilterDrawer } from "@/components/TeacherDashboard/AdvancedFilterDrawer";
import { ExportReportDialog } from "@/components/TeacherDashboard/ExportReportDialog";
import { ResourceLibraryGrid } from "@/components/TeacherDashboard/ResourceLibraryGrid";
import { TextRecommendationsSection } from "@/components/TeacherDashboard/TextRecommendationsSection";
import { InterventionGuidesAccordion } from "@/components/TeacherDashboard/InterventionGuidesAccordion";
import { ComparativeAnalyticsRadar } from "@/components/TeacherDashboard/ComparativeAnalyticsRadar";
import { BenchmarkingTable } from "@/components/TeacherDashboard/BenchmarkingTable";
import { ScheduleComparisonSection } from "@/components/TeacherDashboard/ScheduleComparisonSection";
import { GradeSchoolComparison } from "@/components/TeacherDashboard/GradeSchoolComparison";
import { AccommodationsTracker } from "@/components/TeacherDashboard/AccommodationsTracker";
import { CulturalContentTracker } from "@/components/TeacherDashboard/CulturalContentTracker";
import { ParentCommunicationPanel } from "@/components/TeacherDashboard/ParentCommunicationPanel";
import { StudentProfileDrawer } from "@/components/TeacherDashboard/StudentProfileDrawer";
import { StudentNamePill } from "@/components/TeacherDashboard/StudentNamePill";
import { 
  mockAIInsights, 
  mockErrorPatterns, 
  mockResponseTimeData, 
  mockStudentRecommendations 
} from "@/data/teacherAnalytics";
import { mockSkillsData } from "@/data/teacherSkillsData";

const TeacherDashboardV2 = () => {
  const { t } = useLanguage();
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [selectedStudentForProfile, setSelectedStudentForProfile] = useState<any | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [profileDrawerOpen, setProfileDrawerOpen] = useState(false);
  const [filters, setFilters] = useState<any>(null);

  const handleViewRecommendation = (studentName: string) => {
    setSelectedStudent(studentName);
    setDrawerOpen(true);
  };

  const handleViewProfile = (student: any) => {
    setSelectedStudentForProfile(student);
    setProfileDrawerOpen(true);
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  const unitColors = {
    pink: "hsl(329, 100%, 71%)",
    coral: "hsl(11, 100%, 67%)",
    peach: "hsl(27, 100%, 71%)",
    lime: "hsl(125, 100%, 71%)",
    cyan: "hsl(176, 84%, 71%)",
    purple: "hsl(250, 100%, 75%)",
    teal: "hsl(173, 58%, 39%)",
  };

  const classProgressData = [
    { name: t("Semana 1", "Week 1"), progress: 65 },
    { name: t("Semana 2", "Week 2"), progress: 72 },
    { name: t("Semana 3", "Week 3"), progress: 78 },
    { name: t("Semana 4", "Week 4"), progress: 85 },
  ];

  const skillsDistribution = [
    { skill: t("Comprensión", "Comprehension"), score: 88, color: unitColors.pink },
    { skill: t("Fluidez", "Fluency"), score: 85, color: unitColors.cyan },
    { skill: t("Vocabulario", "Vocabulary"), score: 90, color: unitColors.lime },
    { skill: t("Pronunciación", "Pronunciation"), score: 82, color: unitColors.coral },
  ];

  const students = [
    { id: 1, nameEs: "María González", nameEn: "María González", grade: "3.2", activities: 24, lastActive: t("Hoy", "Today"), status: "success", riskLevel: "low" as const, hasRecommendation: false, readingLevel: "3", device: "tablet" },
    { id: 2, nameEs: "Juan Pérez", nameEn: "Juan Pérez", grade: "2.8", activities: 18, lastActive: t("Hoy", "Today"), status: "success", riskLevel: "low" as const, hasRecommendation: false, readingLevel: "2", device: "mobile" },
    { id: 3, nameEs: "Sofia Rodríguez", nameEn: "Sofia Rodríguez", grade: "3.5", activities: 28, lastActive: t("Ayer", "Yesterday"), status: "warning", riskLevel: "low" as const, hasRecommendation: false, readingLevel: "3", device: "computer" },
    { id: 4, nameEs: "Carlos Torres", nameEn: "Carlos Torres", grade: "2.5", activities: 12, lastActive: t("Hace 3 días", "3 days ago"), status: "error", riskLevel: "high" as const, hasRecommendation: true, readingLevel: "2", device: "mobile" },
    { id: 5, nameEs: "Ana Díaz", nameEn: "Ana Díaz", grade: "2.9", activities: 16, lastActive: t("Hace 2 días", "2 days ago"), status: "error", riskLevel: "high" as const, hasRecommendation: true, readingLevel: "2", device: "tablet" },
    { id: 6, nameEs: "Luis Rivera", nameEn: "Luis Rivera", grade: "2.7", activities: 14, lastActive: t("Hace 4 días", "4 days ago"), status: "error", riskLevel: "high" as const, hasRecommendation: true, readingLevel: "3", device: "computer" },
  ];

  const filteredStudents = students.filter(student => {
    if (!filters) return true;
    
    if (filters.riskLevel && filters.riskLevel !== "all" && student.riskLevel !== filters.riskLevel) {
      return false;
    }
    
    if (filters.readingLevel && filters.readingLevel !== "all" && student.readingLevel !== filters.readingLevel) {
      return false;
    }
    
    if (filters.deviceType && filters.deviceType !== "all" && student.device !== filters.deviceType) {
      return false;
    }
    
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "excellent":
        return <Badge className="bg-gradient-to-r from-lime-400 to-lime-500 text-white border-0">{t("Excelente", "Excellent")}</Badge>;
      case "good":
        return <Badge className="bg-gradient-to-r from-cyan-400 to-cyan-500 text-white border-0">{t("Bien", "Good")}</Badge>;
      case "needsWork":
        return <Badge className="bg-gradient-to-r from-coral-400 to-coral-500 text-white border-0">{t("Necesita Apoyo", "Needs Support")}</Badge>;
      default:
        return null;
    }
  };

  return (
    <>
      <Helmet>
        <title>{t("Panel del Maestro - LecturaPR", "Teacher Dashboard - LecturaPR")}</title>
        <meta name="description" content={t("Panel de control para maestros", "Teacher control panel")} />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
        <Header />
        
        <main className="flex-1 py-8">
          <div className="container px-4 md:px-6 space-y-8 max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2 text-gray-800">
                  {t("Panel del Maestro", "Teacher Dashboard")}
                </h1>
                <p className="text-xl text-gray-600">
                  {t("3er Grado - Sección A", "3rd Grade - Section A")}
                </p>
              </div>
              <div className="flex gap-2">
                <ManageLessonsDrawer />
                <AdvancedFilterDrawer onFilterChange={handleFilterChange} />
                <ExportReportDialog />
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

            {/* Usage Metrics Section */}
            <UsageMetricsGrid />

            {/* Reading Progress Section */}
            <ReadingProgressSection />

            {/* Device & Category Analytics */}
            <div className="grid lg:grid-cols-2 gap-6">
              <DeviceAnalyticsChart />
              <CategoryAnalyticsChart />
            </div>

            {/* Skills Breakdown Section */}
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-1">
                  {t("Desglose de Habilidades", "Skills Breakdown")}
                </h2>
                <p className="text-sm text-gray-600">
                  {t("Análisis detallado por área de competencia", "Detailed analysis by skill area")}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <SkillDetailCard skill={mockSkillsData.comprehension} />
                <SkillDetailCard skill={mockSkillsData.fluency} />
                <SkillDetailCard skill={mockSkillsData.vocabulary} />
                <SkillDetailCard skill={mockSkillsData.pronunciation} />
              </div>
            </div>

            {/* Skills Comparison Table */}
            <SkillsComparisonTable onStudentClick={handleViewProfile} />

            {/* Assessment Results Section */}
            <AssessmentResultsSection />

            {/* Standards Alignment */}
            <StandardsAlignmentTable />

            {/* Teacher Resources Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-lime-400 to-lime-500 rounded-lg">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {t("Recursos del Maestro", "Teacher Resources")}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {t("Actividades, textos y guías alineadas con estándares", "Activities, texts and guides aligned with standards")}
                  </p>
                </div>
              </div>

              <ResourceLibraryGrid />

              <div className="grid lg:grid-cols-2 gap-6">
                <TextRecommendationsSection />
                <InterventionGuidesAccordion />
              </div>
            </div>

            {/* Comparative Analytics Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-cyan-400 to-cyan-500 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {t("Análisis Comparativo", "Comparative Analytics")}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {t("Comparaciones con otros grupos y horarios", "Comparisons with other groups and schedules")}
                  </p>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                <ComparativeAnalyticsRadar />
                <BenchmarkingTable />
              </div>

              <ScheduleComparisonSection />

              <GradeSchoolComparison />
            </div>

            {/* Cultural Localization Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-purple-400 to-purple-500 rounded-lg">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {t("Localización Cultural", "Cultural Localization")}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {t("Seguimiento de acomodos, cultura puertorriqueña y comunicación", "Tracking accommodations, Puerto Rican culture and communication")}
                  </p>
                </div>
              </div>

              <AccommodationsTracker students={students} onStudentClick={handleViewProfile} />
              
              <CulturalContentTracker />
              
              <ParentCommunicationPanel students={students} onStudentClick={handleViewProfile} />
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
                    <LineChart data={classProgressData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="name" />
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
                        dataKey="progress" 
                        stroke="hsl(190, 100%, 65%)" 
                        strokeWidth={3}
                        name={t("Promedio", "Average")}
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
                  {filters && (
                    <span className="ml-2 text-purple-600 font-medium">
                      ({filteredStudents.length} {t("de", "of")} {students.length} {t("mostrados", "shown")})
                    </span>
                  )}
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
                    {filteredStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>
                          <StudentNamePill
                            student={{ nameEs: student.nameEs, nameEn: student.nameEn }}
                            onClick={() => handleViewProfile(student)}
                          />
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
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="gap-1"
                              onClick={() => handleViewProfile(student)}
                            >
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

        {/* Student Profile Drawer */}
        <StudentProfileDrawer
          open={profileDrawerOpen}
          onOpenChange={setProfileDrawerOpen}
          student={selectedStudentForProfile}
        />
      </div>
    </>
  );
};

export default TeacherDashboardV2;
