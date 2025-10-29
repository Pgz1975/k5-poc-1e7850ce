import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer } from "recharts";
import { mockComparativeData } from "@/data/teacherComparisons";

export const ComparativeAnalyticsRadar = () => {
  const { t } = useLanguage();

  const radarData = [
    {
      skill: t("Comprensión", "Comprehension"),
      [t("Mi Clase", "My Class")]: mockComparativeData.skillsComparison.comprehension.thisClass,
      [t("Escuela", "School")]: mockComparativeData.skillsComparison.comprehension.schoolAvg,
      [t("Región", "Region")]: mockComparativeData.skillsComparison.comprehension.regionalAvg,
      [t("Isla", "Island")]: mockComparativeData.skillsComparison.comprehension.islandAvg,
    },
    {
      skill: t("Fluidez", "Fluency"),
      [t("Mi Clase", "My Class")]: mockComparativeData.skillsComparison.fluency.thisClass,
      [t("Escuela", "School")]: mockComparativeData.skillsComparison.fluency.schoolAvg,
      [t("Región", "Region")]: mockComparativeData.skillsComparison.fluency.regionalAvg,
      [t("Isla", "Island")]: mockComparativeData.skillsComparison.fluency.islandAvg,
    },
    {
      skill: t("Vocabulario", "Vocabulary"),
      [t("Mi Clase", "My Class")]: mockComparativeData.skillsComparison.vocabulary.thisClass,
      [t("Escuela", "School")]: mockComparativeData.skillsComparison.vocabulary.schoolAvg,
      [t("Región", "Region")]: mockComparativeData.skillsComparison.vocabulary.regionalAvg,
      [t("Isla", "Island")]: mockComparativeData.skillsComparison.vocabulary.islandAvg,
    },
    {
      skill: t("Pronunciación", "Pronunciation"),
      [t("Mi Clase", "My Class")]: mockComparativeData.skillsComparison.pronunciation.thisClass,
      [t("Escuela", "School")]: mockComparativeData.skillsComparison.pronunciation.schoolAvg,
      [t("Región", "Region")]: mockComparativeData.skillsComparison.pronunciation.regionalAvg,
      [t("Isla", "Island")]: mockComparativeData.skillsComparison.pronunciation.islandAvg,
    },
  ];

  return (
    <Card className="border-2 border-gray-200 shadow-md hover:shadow-lg transition-all">
      <CardHeader>
        <CardTitle>{t("Análisis Comparativo por Habilidades", "Comparative Skills Analysis")}</CardTitle>
        <CardDescription>
          {t("Comparación de rendimiento con otros grupos", "Performance comparison with other groups")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="hsl(var(--muted))" />
            <PolarAngleAxis dataKey="skill" />
            <PolarRadiusAxis angle={90} domain={[0, 100]} />
            <Radar
              name={t("Mi Clase", "My Class")}
              dataKey={t("Mi Clase", "My Class")}
              stroke="hsl(125, 100%, 71%)"
              fill="hsl(125, 100%, 71%)"
              fillOpacity={0.6}
            />
            <Radar
              name={t("Escuela", "School")}
              dataKey={t("Escuela", "School")}
              stroke="hsl(176, 84%, 71%)"
              fill="hsl(176, 84%, 71%)"
              fillOpacity={0.4}
            />
            <Radar
              name={t("Región", "Region")}
              dataKey={t("Región", "Region")}
              stroke="hsl(27, 100%, 71%)"
              fill="hsl(27, 100%, 71%)"
              fillOpacity={0.3}
            />
            <Radar
              name={t("Isla", "Island")}
              dataKey={t("Isla", "Island")}
              stroke="hsl(329, 100%, 71%)"
              fill="hsl(329, 100%, 71%)"
              fillOpacity={0.2}
            />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
