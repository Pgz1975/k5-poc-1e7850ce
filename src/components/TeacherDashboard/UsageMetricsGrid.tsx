import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { mockUsageMetrics } from "@/data/teacherUsageMetrics";
import { Clock, Calendar, Users, Home, School } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

export const UsageMetricsGrid = () => {
  const { t } = useLanguage();
  const metrics = mockUsageMetrics;

  const usageLocationData = [
    { 
      name: t("Escuela", "School"), 
      value: metrics.schoolVsHomeUsage.school,
      color: "hsl(var(--primary))"
    },
    { 
      name: t("Casa", "Home"), 
      value: metrics.schoolVsHomeUsage.home,
      color: "hsl(var(--secondary))"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">
          {t("Métricas de Uso", "Usage Metrics")}
        </h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("Sesiones Semanales", "Weekly Sessions")}
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.weeklyFrequency}</div>
              <p className="text-xs text-muted-foreground">
                {t("por estudiante/semana", "per student/week")}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("Duración Promedio", "Avg Duration")}
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.avgSessionDuration}</div>
              <p className="text-xs text-muted-foreground">
                {t("minutos por sesión", "minutes per session")}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("Sesiones Esta Semana", "Sessions This Week")}
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalSessionsThisWeek}</div>
              <p className="text-xs text-muted-foreground">
                {t("sesiones totales", "total sessions")}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("Estudiantes Activos", "Active Students")}
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.activeStudentsPercent}%</div>
              <p className="text-xs text-muted-foreground">
                {t("activos esta semana", "active this week")}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <School className="h-5 w-5" />
            {t("Uso: Escuela vs. Casa", "Usage: School vs. Home")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={usageLocationData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {usageLocationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
