import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, BookOpen, TrendingUp, Award, Eye, Edit } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Helmet } from "react-helmet";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

const TeacherDashboardV2 = () => {
  const { t } = useLanguage();

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
    { id: 1, name: "María González", grade: "3er Grado", progress: 88, status: "excellent", lastActive: "Hoy" },
    { id: 2, name: "Juan Pérez", grade: "3er Grado", progress: 75, status: "good", lastActive: "Ayer" },
    { id: 3, name: "Ana Rodríguez", grade: "3er Grado", progress: 92, status: "excellent", lastActive: "Hoy" },
    { id: 4, name: "Carlos Torres", grade: "3er Grado", progress: 68, status: "needsWork", lastActive: "Hace 2 días" },
    { id: 5, name: "Sofia Martínez", grade: "3er Grado", progress: 85, status: "good", lastActive: "Hoy" },
  ];

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
              <Button className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all">
                {t("Gestionar Lecciones", "Manage Lessons")}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-12 w-12 rounded-xl bg-teal-100 flex items-center justify-center">
                    <Users className="h-6 w-6 text-teal-600" />
                  </div>
                </div>
                <h3 className="text-sm font-semibold text-gray-600 mb-2">
                  {t("Estudiantes Totales", "Total Students")}
                </h3>
                <div className="text-3xl font-bold text-gray-800">25</div>
              </div>

              <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-12 w-12 rounded-xl bg-cyan-100 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-cyan-600" />
                  </div>
                </div>
                <h3 className="text-sm font-semibold text-gray-600 mb-2">
                  {t("Activos Esta Semana", "Active This Week")}
                </h3>
                <div className="text-3xl font-bold text-gray-800">22</div>
              </div>

              <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-12 w-12 rounded-xl bg-purple-100 flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <h3 className="text-sm font-semibold text-gray-600 mb-2">
                  {t("Lecciones Completadas", "Lessons Completed")}
                </h3>
                <div className="text-3xl font-bold text-gray-800">148</div>
              </div>

              <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-12 w-12 rounded-xl bg-lime-100 flex items-center justify-center">
                    <Award className="h-6 w-6 text-lime-600" />
                  </div>
                </div>
                <h3 className="text-sm font-semibold text-gray-600 mb-2">
                  {t("Promedio de Progreso", "Average Progress")}
                </h3>
                <div className="text-3xl font-bold text-gray-800">82%</div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-md">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">
                  {t("Progreso del Grupo", "Class Progress")}
                </h2>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={classProgressData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '2px solid #e5e7eb',
                        borderRadius: '12px',
                        padding: '12px'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="progress" 
                      stroke={unitColors.teal}
                      strokeWidth={3}
                      dot={{ fill: unitColors.teal, r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-md">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">
                  {t("Distribución de Habilidades", "Skills Distribution")}
                </h2>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={skillsDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="skill" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '2px solid #e5e7eb',
                        borderRadius: '12px',
                        padding: '12px'
                      }}
                    />
                    <Bar dataKey="score" fill={unitColors.cyan} radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-md">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">
                {t("Estudiantes", "Students")}
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-4 px-4 font-bold text-gray-700">{t("Nombre", "Name")}</th>
                      <th className="text-left py-4 px-4 font-bold text-gray-700">{t("Grado", "Grade")}</th>
                      <th className="text-left py-4 px-4 font-bold text-gray-700">{t("Progreso", "Progress")}</th>
                      <th className="text-left py-4 px-4 font-bold text-gray-700">{t("Estado", "Status")}</th>
                      <th className="text-left py-4 px-4 font-bold text-gray-700">{t("Última Actividad", "Last Active")}</th>
                      <th className="text-left py-4 px-4 font-bold text-gray-700">{t("Acciones", "Actions")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => (
                      <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4 font-medium text-gray-800">{student.name}</td>
                        <td className="py-4 px-4 text-gray-600">{student.grade}</td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden max-w-[100px]">
                              <div 
                                className="h-full rounded-full transition-all" 
                                style={{ 
                                  width: `${student.progress}%`, 
                                  backgroundColor: student.status === 'excellent' ? unitColors.lime : student.status === 'good' ? unitColors.cyan : unitColors.coral
                                }}
                              />
                            </div>
                            <span className="text-sm font-bold text-gray-700">{student.progress}%</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">{getStatusBadge(student.status)}</td>
                        <td className="py-4 px-4 text-gray-600">{student.lastActive}</td>
                        <td className="py-4 px-4">
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="rounded-lg border-2">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" className="rounded-lg border-2">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default TeacherDashboardV2;
