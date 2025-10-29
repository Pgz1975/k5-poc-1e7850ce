import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer } from "recharts";
import { mockComparativeData } from "@/data/teacherComparisons";

export const ComparativeAnalyticsRadar = () => {
  const { t } = useLanguage();

  const radarData = [
    {
      skill: t("Comprensión", "Comprehension"),
      myClass: mockComparativeData.skillsComparison.comprehension.thisClass,
      school: mockComparativeData.skillsComparison.comprehension.schoolAvg,
      region: mockComparativeData.skillsComparison.comprehension.regionalAvg,
      island: mockComparativeData.skillsComparison.comprehension.islandAvg,
    },
    {
      skill: t("Fluidez", "Fluency"),
      myClass: mockComparativeData.skillsComparison.fluency.thisClass,
      school: mockComparativeData.skillsComparison.fluency.schoolAvg,
      region: mockComparativeData.skillsComparison.fluency.regionalAvg,
      island: mockComparativeData.skillsComparison.fluency.islandAvg,
    },
    {
      skill: t("Vocabulario", "Vocabulary"),
      myClass: mockComparativeData.skillsComparison.vocabulary.thisClass,
      school: mockComparativeData.skillsComparison.vocabulary.schoolAvg,
      region: mockComparativeData.skillsComparison.vocabulary.regionalAvg,
      island: mockComparativeData.skillsComparison.vocabulary.islandAvg,
    },
    {
      skill: t("Pronunciación", "Pronunciation"),
      myClass: mockComparativeData.skillsComparison.pronunciation.thisClass,
      school: mockComparativeData.skillsComparison.pronunciation.schoolAvg,
      region: mockComparativeData.skillsComparison.pronunciation.regionalAvg,
      island: mockComparativeData.skillsComparison.pronunciation.islandAvg,
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
              dataKey="myClass"
              stroke="hsl(125, 100%, 71%)"
              fill="hsl(125, 100%, 71%)"
              fillOpacity={0.6}
            />
            <Radar
              name={t("Escuela", "School")}
              dataKey="school"
              stroke="hsl(176, 84%, 71%)"
              fill="hsl(176, 84%, 71%)"
              fillOpacity={0.4}
            />
            <Radar
              name={t("Región", "Region")}
              dataKey="region"
              stroke="hsl(27, 100%, 71%)"
              fill="hsl(27, 100%, 71%)"
              fillOpacity={0.3}
            />
            <Radar
              name={t("Isla", "Island")}
              dataKey="island"
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
