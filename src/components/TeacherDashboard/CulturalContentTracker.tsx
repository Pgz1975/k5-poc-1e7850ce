import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/contexts/LanguageContext";
import { mockCulturalContent } from "@/data/culturalLocalization";
import { Flag, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

export const CulturalContentTracker = () => {
  const { t } = useLanguage();

  const vocabularyData = mockCulturalContent.culturalVocabulary.map(item => ({
    word: item.word,
    [t("Dominio", "Mastery")]: item.mastery,
    [t("Uso", "Usage")]: item.usage
  }));

  return (
    <div className="space-y-6">
      <Card className="border-2 border-gray-200 shadow-md hover:shadow-lg transition-all">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flag className="h-5 w-5 text-cyan-600" />
            {t("Contenido Cultural Puertorriqueño", "Puerto Rican Cultural Content")}
          </CardTitle>
          <CardDescription>
            {t("Progreso en textos sobre cultura e identidad boricua", "Progress in texts about Puerto Rican culture and identity")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                {t("Contenido Cultural Completado", "Cultural Content Completed")}
              </span>
              <span className="text-2xl font-bold text-cyan-600">
                {mockCulturalContent.totalCompleted}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {mockCulturalContent.byCategory.map((category, index) => {
              const percentage = (category.completed / category.total) * 100;
              return (
                <div key={index}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      {category.category}
                    </span>
                    <span className="text-sm text-gray-500">
                      {category.completed}/{category.total}
                    </span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="border-2 border-gray-200 shadow-md hover:shadow-lg transition-all">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-lime-600" />
            {t("Vocabulario Cultural", "Cultural Vocabulary")}
          </CardTitle>
          <CardDescription>
            {t("Dominio de palabras típicas puertorriqueñas", "Mastery of typical Puerto Rican words")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={vocabularyData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="word" />
              <YAxis domain={[0, 100]} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey={t("Dominio", "Mastery")} fill="hsl(176, 84%, 71%)" radius={[8, 8, 0, 0]} />
              <Bar dataKey={t("Uso", "Usage")} fill="hsl(125, 100%, 71%)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
