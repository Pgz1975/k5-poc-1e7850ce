import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { mockScheduleComparison } from "@/data/teacherComparisons";
import { Sun, Moon } from "lucide-react";

export const ScheduleComparisonSection = () => {
  const { t } = useLanguage();

  const scheduleData = [
    {
      metric: t("Promedio", "Average"),
      [t("Mañana", "Morning")]: mockScheduleComparison.morning.average,
      [t("Tarde", "Afternoon")]: mockScheduleComparison.afternoon.average,
    },
    {
      metric: t("Asistencia", "Attendance"),
      [t("Mañana", "Morning")]: mockScheduleComparison.morning.attendance,
      [t("Tarde", "Afternoon")]: mockScheduleComparison.afternoon.attendance,
    },
    {
      metric: t("Compromiso", "Engagement"),
      [t("Mañana", "Morning")]: mockScheduleComparison.morning.engagement,
      [t("Tarde", "Afternoon")]: mockScheduleComparison.afternoon.engagement,
    },
    {
      metric: t("Tasa de Finalización", "Completion"),
      [t("Mañana", "Morning")]: mockScheduleComparison.morning.completionRate,
      [t("Tarde", "Afternoon")]: mockScheduleComparison.afternoon.completionRate,
    },
  ];

  return (
    <Card className="border-2 border-gray-200 shadow-md hover:shadow-lg transition-all">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sun className="h-5 w-5 text-yellow-500" />
          {t("Comparación por Horario", "Schedule Comparison")}
          <Moon className="h-5 w-5 text-purple-500" />
        </CardTitle>
        <CardDescription>
          {t("Rendimiento en horario de mañana vs. tarde", "Morning vs. afternoon session performance")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={scheduleData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="metric" />
            <YAxis domain={[0, 100]} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Bar 
              dataKey={t("Mañana", "Morning")} 
              fill="hsl(27, 100%, 71%)" 
              radius={[8, 8, 0, 0]}
            />
            <Bar 
              dataKey={t("Tarde", "Afternoon")} 
              fill="hsl(250, 100%, 75%)" 
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
        
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="p-4 bg-peach-50 rounded-lg border border-peach-200">
            <div className="flex items-center gap-2 mb-2">
              <Sun className="h-4 w-4 text-peach-600" />
              <h4 className="font-semibold text-sm text-gray-700">
                {t("Horario de Mañana", "Morning Session")}
              </h4>
            </div>
            <div className="space-y-1 text-sm text-gray-600">
              <p>{t("Promedio:", "Average:")} <span className="font-bold">{mockScheduleComparison.morning.average}%</span></p>
              <p>{t("Asistencia:", "Attendance:")} <span className="font-bold">{mockScheduleComparison.morning.attendance}%</span></p>
            </div>
          </div>
          
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="flex items-center gap-2 mb-2">
              <Moon className="h-4 w-4 text-purple-600" />
              <h4 className="font-semibold text-sm text-gray-700">
                {t("Horario de Tarde", "Afternoon Session")}
              </h4>
            </div>
            <div className="space-y-1 text-sm text-gray-600">
              <p>{t("Promedio:", "Average:")} <span className="font-bold">{mockScheduleComparison.afternoon.average}%</span></p>
              <p>{t("Asistencia:", "Attendance:")} <span className="font-bold">{mockScheduleComparison.afternoon.attendance}%</span></p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
