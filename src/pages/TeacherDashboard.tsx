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

const TeacherDashboard = () => {
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

  return (
    <>
      <Helmet>
        <title>{t("Panel de Maestro - LecturaPR", "Teacher Dashboard - LecturaPR")}</title>
        <meta name="description" content={t("Panel de control para maestros", "Teacher control panel")} />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1 py-8">
          <div className="container px-4 md:px-6 space-y-8">
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
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    {t("Total Estudiantes", "Total Students")}
                  </CardTitle>
                  <Users className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">25</div>
                  <p className="text-xs text-muted-foreground">
                    {t("3 nuevos este mes", "3 new this month")}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    {t("Promedio de Clase", "Class Average")}
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-success" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">87%</div>
                  <p className="text-xs text-success">
                    +5% {t("vs mes anterior", "vs last month")}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    {t("Actividades Esta Semana", "Activities This Week")}
                  </CardTitle>
                  <BookOpen className="h-4 w-4 text-secondary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">342</div>
                  <p className="text-xs text-muted-foreground">
                    {t("13.7 por estudiante", "13.7 per student")}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    {t("Requieren Atención", "Need Attention")}
                  </CardTitle>
                  <AlertCircle className="h-4 w-4 text-destructive" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3</div>
                  <p className="text-xs text-muted-foreground">
                    {t("Estudiantes en riesgo", "Students at risk")}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
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
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2}
                        name={t("Promedio", "Average")}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="meta" 
                        stroke="hsl(var(--success))" 
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        name={t("Meta", "Goal")}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t("Distribución de Habilidades", "Skills Distribution")}</CardTitle>
                  <CardDescription>
                    {t("Nivel de dominio por categoría", "Proficiency level by category")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={skillsDistribution}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="skill" angle={-45} textAnchor="end" height={80} />
                      <YAxis />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                      />
                      <Legend />
                      <Bar dataKey="bajo" fill="hsl(var(--destructive))" name={t("Bajo", "Low")} />
                      <Bar dataKey="medio" fill="hsl(var(--accent))" name={t("Medio", "Medium")} />
                      <Bar dataKey="alto" fill="hsl(var(--success))" name={t("Alto", "High")} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Student List */}
            <Card>
              <CardHeader>
                <CardTitle>{t("Lista de Estudiantes", "Student List")}</CardTitle>
                <CardDescription>
                  {t("Monitoreo individual de progreso y actividad", "Individual progress and activity monitoring")}
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
                      <TableHead>{t("Estado", "Status")}</TableHead>
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
                        <TableCell className="text-muted-foreground">
                          {student.lastActive}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              student.status === "success" ? "default" : 
                              student.status === "warning" ? "secondary" : 
                              "destructive"
                            }
                          >
                            {student.status === "success" && t("Activo", "Active")}
                            {student.status === "warning" && t("Moderado", "Moderate")}
                            {student.status === "error" && t("En Riesgo", "At Risk")}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
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

export default TeacherDashboard;
