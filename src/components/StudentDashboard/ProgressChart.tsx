import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

export const ProgressChart = () => {
  const { t } = useLanguage();

  const readingProgressData = [
    { week: t("Sem 1", "Week 1"), score: 65 },
    { week: t("Sem 2", "Week 2"), score: 72 },
    { week: t("Sem 3", "Week 3"), score: 78 },
    { week: t("Sem 4", "Week 4"), score: 85 },
    { week: t("Sem 5", "Week 5"), score: 88 },
    { week: t("Sem 6", "Week 6"), score: 92 },
  ];

  const skillsData = [
    { skill: t("Comprensión", "Comprehension"), score: 88 },
    { skill: t("Fluidez", "Fluency"), score: 85 },
    { skill: t("Vocabulario", "Vocabulary"), score: 90 },
    { skill: t("Pronunciación", "Pronunciation"), score: 82 },
  ];

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("Progreso Semanal", "Weekly Progress")}</CardTitle>
          <CardDescription>
            {t("Tu mejora en comprensión lectora", "Your reading comprehension improvement")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={readingProgressData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="week" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--primary))', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("Habilidades de Lectura", "Reading Skills")}</CardTitle>
          <CardDescription>
            {t("Evaluación por categoría", "Assessment by category")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={skillsData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="skill" className="text-xs" angle={-45} textAnchor="end" height={80} />
              <YAxis className="text-xs" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="score" fill="hsl(var(--success))" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
