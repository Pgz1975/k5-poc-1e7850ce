import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Lightbulb, TrendingUp, Users, Heart } from "lucide-react";
import { mockTextRecommendations } from "@/data/teacherResources";

export const TextRecommendationsSection = () => {
  const { t } = useLanguage();

  const getReasonBadge = (reason: string) => {
    switch (reason) {
      case "alignedWithCurriculum":
        return (
          <Badge className="bg-gradient-to-r from-purple-400 to-purple-500 text-white border-0 gap-1">
            <TrendingUp className="h-3 w-3" />
            {t("Alineado con Currículo", "Aligned with Curriculum")}
          </Badge>
        );
      case "matchesClassAverage":
        return (
          <Badge className="bg-gradient-to-r from-cyan-400 to-cyan-500 text-white border-0 gap-1">
            <Users className="h-3 w-3" />
            {t("Nivel de Clase", "Class Level")}
          </Badge>
        );
      case "studentInterest":
        return (
          <Badge className="bg-gradient-to-r from-pink-400 to-pink-500 text-white border-0 gap-1">
            <Heart className="h-3 w-3" />
            {t("Interés Estudiantil", "Student Interest")}
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="border-2 border-gray-200 shadow-md hover:shadow-lg transition-all">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-500" />
          <div>
            <CardTitle>{t("Textos Recomendados", "Recommended Texts")}</CardTitle>
            <CardDescription>
              {t("Selección basada en IA según el nivel y preferencias de la clase", "AI-based selection according to class level and preferences")}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockTextRecommendations.map((rec) => (
            <div key={rec.id} className="p-4 border-2 border-gray-100 rounded-lg hover:border-purple-200 transition-all">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-semibold text-gray-800">
                    {t(rec.titleEs, rec.titleEn)}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {t("Nivel de lectura:", "Reading level:")} {rec.level}
                  </p>
                </div>
                {rec.culturalRelevance && (
                  <Badge variant="outline" className="text-xs">
                    🇵🇷 {t("Cultural PR", "PR Cultural")}
                  </Badge>
                )}
              </div>
              <div className="flex items-center justify-between">
                {getReasonBadge(rec.reason)}
                <Button variant="outline" size="sm">
                  {t("Ver Detalles", "View Details")}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
