import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, MapPin } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

export const CulturalContentShowcase = () => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const culturalTopics = [
    {
      id: "el-yunque",
      name: "El Yunque",
      nameEs: "El Yunque",
      icon: "🌴",
      description: "National rainforest",
      descriptionEs: "Bosque nacional lluvioso",
      wordsLearned: 12,
      totalWords: 15,
      lessonsCompleted: 3,
      totalLessons: 4,
    },
    {
      id: "coqui",
      name: "Coquí Frog",
      nameEs: "El Coquí",
      icon: "🐸",
      description: "Puerto Rico's iconic frog",
      descriptionEs: "La rana icónica de Puerto Rico",
      wordsLearned: 15,
      totalWords: 15,
      lessonsCompleted: 5,
      totalLessons: 5,
    },
    {
      id: "plena",
      name: "Plena Music",
      nameEs: "Música de Plena",
      icon: "🎵",
      description: "Traditional Puerto Rican music",
      descriptionEs: "Música tradicional puertorriqueña",
      wordsLearned: 4,
      totalWords: 12,
      lessonsCompleted: 1,
      totalLessons: 3,
    },
    {
      id: "three-kings",
      name: "Three Kings Day",
      nameEs: "Día de Reyes",
      icon: "👑",
      description: "Puerto Rican Christmas tradition",
      descriptionEs: "Tradición navideña puertorriqueña",
      wordsLearned: 10,
      totalWords: 10,
      lessonsCompleted: 2,
      totalLessons: 2,
    },
    {
      id: "old-san-juan",
      name: "Old San Juan",
      nameEs: "Viejo San Juan",
      icon: "🏰",
      description: "Historic colonial city",
      descriptionEs: "Ciudad colonial histórica",
      wordsLearned: 7,
      totalWords: 12,
      lessonsCompleted: 2,
      totalLessons: 4,
    },
    {
      id: "vejigante",
      name: "Vejigante Masks",
      nameEs: "Máscaras de Vejigante",
      icon: "🎭",
      description: "Traditional carnival masks",
      descriptionEs: "Máscaras tradicionales de carnaval",
      wordsLearned: 3,
      totalWords: 10,
      lessonsCompleted: 1,
      totalLessons: 3,
    },
  ];

  const totalWordsLearned = culturalTopics.reduce((sum, topic) => sum + topic.wordsLearned, 0);
  const totalWords = culturalTopics.reduce((sum, topic) => sum + topic.totalWords, 0);
  const overallProgress = (totalWordsLearned / totalWords) * 100;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="rounded-3xl border-4 border-[hsl(176,84%,65%)] bg-gradient-to-br from-[hsl(176,84%,95%)] to-[hsl(176,84%,85%)] p-6 shadow-[0_6px_0_hsl(176,84%,65%)]">
        <CollapsibleTrigger className="w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-[hsl(176,84%,71%)] to-[hsl(176,84%,55%)] rounded-2xl p-4 border-4 border-[hsl(176,84%,65%)] shadow-[0_4px_0_hsl(176,84%,65%)]">
                <MapPin className="h-7 w-7 text-white" />
              </div>
              <div className="text-left">
                <h2 className="text-2xl font-black text-[hsl(176,84%,25%)]">
                  {t("Explorando Puerto Rico", "Exploring Puerto Rico")}
                </h2>
                <p className="text-sm font-bold text-gray-700">
                  {t("Contenido cultural aprendido", "Cultural content learned")}
                </p>
              </div>
            </div>
            <ChevronDown 
              className={`h-6 w-6 text-[hsl(176,84%,25%)] transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="mt-6 space-y-6">
            {/* Overall cultural progress */}
            <div className="rounded-2xl border-4 border-white bg-white p-6 shadow-[0_4px_0_rgba(255,255,255,0.5)]">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-xl font-black text-[hsl(176,84%,25%)]">
                    {t("Progreso Cultural Total", "Total Cultural Progress")}
                  </h3>
                  <p className="text-sm font-bold text-gray-600">
                    {totalWordsLearned} / {totalWords} {t("palabras culturales", "cultural words")}
                  </p>
                </div>
                <div className="text-4xl font-black text-[hsl(176,84%,35%)]">
                  {Math.round(overallProgress)}%
                </div>
              </div>
              <Progress value={overallProgress} className="h-4" />
            </div>

            {/* Cultural topics grid */}
            <div className="grid md:grid-cols-2 gap-4">
              {culturalTopics.map((topic) => {
                const wordProgress = (topic.wordsLearned / topic.totalWords) * 100;
                const lessonProgress = (topic.lessonsCompleted / topic.totalLessons) * 100;
                const isComplete = topic.wordsLearned === topic.totalWords && topic.lessonsCompleted === topic.totalLessons;

                return (
                  <div
                    key={topic.id}
                    className="rounded-2xl border-3 border-[hsl(176,84%,65%)] bg-white p-5 shadow-[0_3px_0_hsl(176,84%,65%)] hover:shadow-[0_5px_0_hsl(176,84%,65%)] hover:-translate-y-0.5 transition-all"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="text-4xl">{topic.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-lg font-black text-[hsl(176,84%,25%)]">
                            {t(topic.nameEs, topic.name)}
                          </h3>
                          {isComplete && (
                            <Badge className="bg-[hsl(125,100%,95%)] border-2 border-[hsl(125,100%,65%)] text-[hsl(125,100%,35%)]">
                              ✓ {t("Completo", "Complete")}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm font-bold text-gray-600">
                          {t(topic.descriptionEs, topic.description)}
                        </p>
                      </div>
                    </div>

                    {/* Vocabulary progress */}
                    <div className="mb-3">
                      <div className="flex justify-between text-xs font-bold text-gray-700 mb-1">
                        <span>{t("Vocabulario", "Vocabulary")}</span>
                        <span>{topic.wordsLearned}/{topic.totalWords}</span>
                      </div>
                      <Progress value={wordProgress} className="h-3" />
                    </div>

                    {/* Lessons progress */}
                    <div>
                      <div className="flex justify-between text-xs font-bold text-gray-700 mb-1">
                        <span>{t("Lecciones", "Lessons")}</span>
                        <span>{topic.lessonsCompleted}/{topic.totalLessons}</span>
                      </div>
                      <Progress value={lessonProgress} className="h-3" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Cultural achievement message */}
            <div className="rounded-2xl border-4 border-[hsl(45,100%,65%)] bg-[hsl(45,100%,95%)] p-6 text-center">
              <p className="text-lg font-black text-[hsl(45,100%,25%)]">
                🏝️ {t(
                  "¡Sigue aprendiendo sobre Puerto Rico! Completa todos los temas para ganar la medalla de 'Experto en Puerto Rico'.",
                  "Keep learning about Puerto Rico! Complete all topics to earn the 'Puerto Rico Expert' badge."
                )}
              </p>
            </div>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};
