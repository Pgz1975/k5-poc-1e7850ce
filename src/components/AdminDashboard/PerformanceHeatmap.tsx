import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

interface HeatmapData {
  school: string;
  comprehension: number;
  fluency: number;
  vocabulary: number;
  pronunciation: number;
}

interface PerformanceHeatmapProps {
  data: HeatmapData[];
}

export function PerformanceHeatmap({ data }: PerformanceHeatmapProps) {
  const { t } = useLanguage();

  const getHeatColor = (value: number) => {
    if (value >= 85) return "bg-green-500";
    if (value >= 75) return "bg-yellow-500";
    if (value >= 65) return "bg-orange-500";
    return "bg-red-500";
  };

  const skills = [
    { key: "comprehension" as const, labelEs: "Comprensión", labelEn: "Comprehension" },
    { key: "fluency" as const, labelEs: "Fluidez", labelEn: "Fluency" },
    { key: "vocabulary" as const, labelEs: "Vocabulario", labelEn: "Vocabulary" },
    { key: "pronunciation" as const, labelEs: "Pronunciación", labelEn: "Pronunciation" }
  ];

  return (
    <Card className="border-2 border-gray-200 shadow-md hover:shadow-lg transition-all">
      <CardHeader>
        <CardTitle>{t("Mapa de Calor de Habilidades", "Skills Heatmap")}</CardTitle>
        <CardDescription>
          {t("Desempeño por escuela y habilidad", "Performance by school and skill")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left p-2 border-b font-medium text-sm">
                  {t("Escuela", "School")}
                </th>
                {skills.map((skill) => (
                  <th key={skill.key} className="text-center p-2 border-b font-medium text-sm">
                    {t(skill.labelEs, skill.labelEn)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.school} className="hover:bg-muted/50">
                  <td className="p-2 border-b font-medium text-sm">{row.school}</td>
                  {skills.map((skill) => {
                    const value = row[skill.key];
                    return (
                      <td key={skill.key} className="p-2 border-b">
                        <div className="flex items-center justify-center">
                          <div
                            className={`w-12 h-8 rounded flex items-center justify-center text-white font-bold text-sm ${getHeatColor(value)}`}
                          >
                            {value}
                          </div>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
          <span>{t("Leyenda:", "Legend:")}</span>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded bg-green-500"></div>
            <span>85-100</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded bg-yellow-500"></div>
            <span>75-84</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded bg-orange-500"></div>
            <span>65-74</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded bg-red-500"></div>
            <span>&lt;65</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
