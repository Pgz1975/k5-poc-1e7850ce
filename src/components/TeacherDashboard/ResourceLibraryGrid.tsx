import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { BookOpen, Clock, Star, ExternalLink } from "lucide-react";
import { mockTeacherResources } from "@/data/teacherResources";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const ResourceLibraryGrid = () => {
  const { t } = useLanguage();
  const [filterSkill, setFilterSkill] = useState<string>("all");
  const [filterLanguage, setFilterLanguage] = useState<string>("all");

  const filteredResources = mockTeacherResources.filter(resource => {
    if (filterSkill !== "all" && resource.skill !== filterSkill) return false;
    if (filterLanguage !== "all" && resource.language !== filterLanguage) return false;
    return true;
  });

  const getSkillColor = (skill: string) => {
    switch (skill) {
      case "comprehension": return "from-pink-400 to-pink-500";
      case "fluency": return "from-cyan-400 to-cyan-500";
      case "vocabulary": return "from-lime-400 to-lime-500";
      case "pronunciation": return "from-coral-400 to-coral-500";
      default: return "from-gray-400 to-gray-500";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "activity": return "🎯";
      case "text": return "📖";
      case "guide": return "📋";
      default: return "📝";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-800">
            {t("Biblioteca de Recursos", "Resource Library")}
          </h3>
          <p className="text-sm text-gray-600">
            {filteredResources.length} {t("recursos disponibles", "resources available")}
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={filterSkill} onValueChange={setFilterSkill}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t("Habilidad", "Skill")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("Todas", "All")}</SelectItem>
              <SelectItem value="comprehension">{t("Comprensión", "Comprehension")}</SelectItem>
              <SelectItem value="fluency">{t("Fluidez", "Fluency")}</SelectItem>
              <SelectItem value="vocabulary">{t("Vocabulario", "Vocabulary")}</SelectItem>
              <SelectItem value="pronunciation">{t("Pronunciación", "Pronunciation")}</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterLanguage} onValueChange={setFilterLanguage}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t("Idioma", "Language")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("Todos", "All")}</SelectItem>
              <SelectItem value="spanish">{t("Español", "Spanish")}</SelectItem>
              <SelectItem value="english">{t("Inglés", "English")}</SelectItem>
              <SelectItem value="bilingual">{t("Bilingüe", "Bilingual")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredResources.map((resource) => (
          <Card key={resource.id} className="border-2 border-gray-200 hover:shadow-lg transition-all">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="text-2xl mb-2">{getTypeIcon(resource.type)}</div>
                {resource.culturallyRelevant && (
                  <Badge className="bg-gradient-to-r from-purple-400 to-purple-500 text-white border-0">
                    <Star className="h-3 w-3 mr-1" />
                    PR
                  </Badge>
                )}
              </div>
              <CardTitle className="text-base">
                {t(resource.titleEs, resource.titleEn)}
              </CardTitle>
              <CardDescription className="text-xs">
                {t(resource.descriptionEs, resource.descriptionEn)}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2 flex-wrap">
                <Badge className={`bg-gradient-to-r ${getSkillColor(resource.skill)} text-white border-0 text-xs`}>
                  {t(
                    resource.skill === "comprehension" ? "Comprensión" :
                    resource.skill === "fluency" ? "Fluidez" :
                    resource.skill === "vocabulary" ? "Vocabulario" : "Pronunciación",
                    resource.skill.charAt(0).toUpperCase() + resource.skill.slice(1)
                  )}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {t("Grado", "Grade")} {resource.grade}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {resource.duration}
                </div>
                <div className="capitalize">{resource.language}</div>
              </div>
              <Button variant="outline" size="sm" className="w-full gap-2">
                <ExternalLink className="h-3 w-3" />
                {t("Abrir Recurso", "Open Resource")}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
