import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, TrendingUp, BookOpen, AlertCircle, Download, Filter } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Helmet } from "react-helmet";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { ManageLessonsDrawer } from "@/components/TeacherDashboard/ManageLessonsDrawer";

const TeacherDashboardV2 = () => {
  const { t } = useLanguage();

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
    { id: 1, nameEs: "María González", nameEn: "María González", grade: "3.2", activities: 24, lastActive: t("Hoy", "Today"), status: "success" },
    { id: 2, nameEs: "Juan Pérez", nameEn: "Juan Pérez", grade: "2.8", activities: 18, lastActive: t("Hoy", "Today"), status: "success" },
    { id: 3, nameEs: "Sofia Rodríguez", nameEn: "Sofia Rodríguez", grade: "3.5", activities: 28, lastActive: t("Ayer", "Yesterday"), status: "warning" },
    { id: 4, nameEs: "Carlos Martínez", nameEn: "Carlos Martínez", grade: "2.5", activities: 12, lastActive: t("Hace 3 días", "3 days ago"), status: "error" },
    { id: 5, nameEs: "Ana Torres", nameEn: "Ana Torres", grade: "3.0", activities: 20, lastActive: t("Hoy", "Today"), status: "success" },
  ];

  // Unit color palette for data visualization (matching student dashboard colors)
  const unitColors = {
    pink: "hsl(329, 100%, 65%)",
    coral: "hsl(11, 100%, 65%)",
    peach: "hsl(27, 100%, 65%)",
    yellow: "hsl(45, 100%, 65%)",
    lime: "hsl(125, 100%, 65%)",
    cyan: "hsl(190, 100%, 65%)",
    purple: "hsl(270, 100%, 65%)",
  };

  return (
    <>
      <Helmet>
        <title>{t("Panel de Maestro - LecturaPR", "Teacher Dashboard - LecturaPR")}</title>
        <meta name="description" content={t("Panel de control para maestros", "Teacher control panel")} />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/20">
        <Header />
        
        <main className="flex-1 py-8">
          <div className="container px-4 md:px-6 space-y-8">
            {/* Header - Clean Professional */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-4xl font-bold mb-2 text-foreground">
                  {t("Panel del Maestro", "Teacher Dashboard")}
                </h1>
                <p className="text-lg text-muted-foreground">
                  {t("3er Grado · Escuela José de Diego · 25 estudiantes", "3rd Grade · José de Diego School · 25 students")}
                </p>
              </div>
              <div className="flex gap-2">
                <ManageLessonsDrawer />
                <Button variant="outline" className="gap-2 hover:bg-muted transition-colors">
                  <Filter className="h-4 w-4" />
                  {t("Filtros", "Filters")}
                </Button>
                <Button className="gap-2 bg-primary hover:bg-primary/90 transition-colors shadow-md">
                  <Download className="h-4 w-4" />
                  {t("Exportar Reporte", "Export Report")}
                </Button>
              </div>
            </div>

            {/* Quick Stats - Subtle Professional Styling */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="border-2 hover:shadow-lg transition-shadow bg-card">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-semibold">
                    {t("Total Estudiantes", "Total Students")}
                  </CardTitle>
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">25</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t("3 nuevos este mes", "3 new this month")}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:shadow-lg transition-shadow bg-card">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-semibold">
                    {t("Promedio de Clase", "Class Average")}
                  </CardTitle>
                  <div className="p-2 rounded-lg bg-[hsl(125,100%,95%)]">
                    <TrendingUp className="h-5 w-5 text-[hsl(125,100%,35%)]" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">87%</div>
                  <p className="text-xs text-[hsl(125,100%,35%)] mt-1 font-medium">
                    +5% {t("vs mes anterior", "vs last month")}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:shadow-lg transition-shadow bg-card">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-semibold">
                    {t("Actividades Esta Semana", "Activities This Week")}
                  </CardTitle>
                  <div className="p-2 rounded-lg bg-[hsl(190,100%,95%)]">
                    <BookOpen className="h-5 w-5 text-[hsl(190,100%,35%)]" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">342</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t("13.7 por estudiante", "13.7 per student")}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:shadow-lg transition-shadow bg-card">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-semibold">
                    {t("Requieren Atención", "Need Attention")}
                  </CardTitle>
                  <div className="p-2 rounded-lg bg-destructive/10">
                    <AlertCircle className="h-5 w-5 text-destructive" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">3</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t("Estudiantes en riesgo", "Students at risk")}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Charts - Using Unit Colors for Data Visualization */}
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="border-2 shadow-md bg-card">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">{t("Progreso de la Clase", "Class Progress")}</CardTitle>
                  <CardDescription className="text-base">
                    {t("Evolución del promedio mensual", "Monthly average evolution")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={classData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="month" className="text-sm" />
                      <YAxis className="text-sm" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '2px solid hsl(var(--border))',
                          borderRadius: '12px',
                          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                        }}
                      />
                      <Legend wrapperStyle={{ paddingTop: '20px' }} />
                      <Line 
                        type="monotone" 
                        dataKey="promedio" 
                        stroke={unitColors.cyan}
                        strokeWidth={3}
                        name={t("Promedio", "Average")}
                        dot={{ fill: unitColors.cyan, r: 5 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="meta" 
                        stroke={unitColors.lime}
                        strokeWidth={3}
                        strokeDasharray="5 5"
                        name={t("Meta", "Goal")}
                        dot={{ fill: unitColors.lime, r: 5 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border-2 shadow-md bg-card">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">{t("Distribución de Habilidades", "Skills Distribution")}</CardTitle>
                  <CardDescription className="text-base">
                    {t("Nivel de dominio por categoría", "Proficiency level by category")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={skillsDistribution}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="skill" angle={-45} textAnchor="end" height={80} className="text-xs" />
                      <YAxis className="text-sm" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '2px solid hsl(var(--border))',
                          borderRadius: '12px',
                          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                        }}
                      />
                      <Legend wrapperStyle={{ paddingTop: '20px' }} />
                      <Bar dataKey="bajo" fill={unitColors.coral} name={t("Bajo", "Low")} radius={[8, 8, 0, 0]} />
                      <Bar dataKey="medio" fill={unitColors.yellow} name={t("Medio", "Medium")} radius={[8, 8, 0, 0]} />
                      <Bar dataKey="alto" fill={unitColors.lime} name={t("Alto", "High")} radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Student List - Clean Table with Hover States */}
            <Card className="border-2 shadow-md bg-card">
              <CardHeader>
                <CardTitle className="text-xl font-bold">{t("Lista de Estudiantes", "Student List")}</CardTitle>
                <CardDescription className="text-base">
                  {t("Monitoreo individual de progreso y actividad", "Individual progress and activity monitoring")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-b-2">
                      <TableHead className="font-bold text-foreground">{t("Estudiante", "Student")}</TableHead>
                      <TableHead className="font-bold text-foreground">{t("Nivel", "Level")}</TableHead>
                      <TableHead className="font-bold text-foreground">{t("Actividades", "Activities")}</TableHead>
                      <TableHead className="font-bold text-foreground">{t("Última Actividad", "Last Active")}</TableHead>
                      <TableHead className="font-bold text-foreground">{t("Estado", "Status")}</TableHead>
                      <TableHead className="font-bold text-foreground">{t("Acciones", "Actions")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((student) => (
                      <TableRow 
                        key={student.id}
                        className="hover:bg-muted/50 transition-colors cursor-pointer border-b"
                      >
                        <TableCell className="font-semibold">
                          {t(student.nameEs, student.nameEn)}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className="bg-primary/10 text-primary border-primary/30 font-medium"
                          >
                            {student.grade}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">{student.activities}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {student.lastActive}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            className={
                              student.status === "success" 
                                ? "bg-[hsl(125,100%,95%)] text-[hsl(125,100%,35%)] border-[hsl(125,100%,75%)] border-2" 
                                : student.status === "warning" 
                                ? "bg-[hsl(45,100%,95%)] text-[hsl(45,100%,35%)] border-[hsl(45,100%,75%)] border-2"
                                : "bg-[hsl(11,100%,95%)] text-[hsl(11,100%,35%)] border-[hsl(11,100%,75%)] border-2"
                            }
                          >
                            {student.status === "success" && t("Activo", "Active")}
                            {student.status === "warning" && t("Moderado", "Moderate")}
                            {student.status === "error" && t("En Riesgo", "At Risk")}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="hover:bg-primary/10 hover:text-primary transition-colors font-medium"
                          >
                            {t("Ver Detalles", "View Details")}
                          </Button>
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

export default TeacherDashboardV2;
