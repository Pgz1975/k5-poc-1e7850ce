import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Languages } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";

export const BilingualProgressComparison = () => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  // Mock bilingual data
  const bilingualData = {
    spanish: {
      completedActivities: 89,
      totalActivities: 120,
      readingLevel: 3.4,
      averageScore: 87,
      skills: [
        { name: "Comprensión", score: 88 },
        { name: "Fluidez", score: 85 },
        { name: "Vocabulario", score: 92 },
        { name: "Pronunciación", score: 82 },
      ],
    },
    english: {
      completedActivities: 67,
      totalActivities: 120,
      readingLevel: 2.9,
      averageScore: 79,
      skills: [
        { name: "Comprehension", score: 82 },
        { name: "Fluency", score: 75 },
        { name: "Vocabulary", score: 84 },
        { name: "Pronunciation", score: 73 },
      ],
    },
  };

  const spanishProgress = (bilingualData.spanish.completedActivities / bilingualData.spanish.totalActivities) * 100;
  const englishProgress = (bilingualData.english.completedActivities / bilingualData.english.totalActivities) * 100;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="rounded-3xl border-4 border-[hsl(280,100%,65%)] bg-white p-6 shadow-[0_6px_0_hsl(280,100%,65%)]">
        <CollapsibleTrigger className="w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-[hsl(280,100%,71%)] to-[hsl(280,100%,55%)] rounded-2xl p-4 border-4 border-[hsl(280,100%,65%)] shadow-[0_4px_0_hsl(280,100%,65%)]">
                <Languages className="h-7 w-7 text-white" />
              </div>
              <div className="text-left">
                <h2 className="text-2xl font-black text-[hsl(280,100%,35%)]">
                  {t("Progreso Bilingüe", "Bilingual Progress")}
                </h2>
                <p className="text-sm font-bold text-gray-600">
                  {t("Compara tu español e inglés", "Compare your Spanish & English")}
                </p>
              </div>
            </div>
            <ChevronDown 
              className={`h-6 w-6 text-[hsl(280,100%,35%)] transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="mt-6 grid md:grid-cols-2 gap-6">
            {/* Spanish */}
            <div className="rounded-2xl border-4 border-[hsl(329,100%,65%)] bg-[hsl(329,100%,95%)] p-6 shadow-[0_4px_0_hsl(329,100%,65%)]">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">🇵🇷</span>
                <div>
                  <h3 className="text-2xl font-black text-[hsl(329,100%,35%)]">Español</h3>
                  <p className="text-sm font-bold text-gray-600">
                    {t("Lengua principal", "Primary language")}
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-gray-700">
                      {t("Actividades completadas", "Activities completed")}
                    </span>
                    <span className="text-lg font-black text-[hsl(329,100%,35%)]">
                      {bilingualData.spanish.completedActivities}/{bilingualData.spanish.totalActivities}
                    </span>
                  </div>
                  <Progress value={spanishProgress} className="h-3" />
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-gray-700">
                    {t("Nivel de lectura", "Reading level")}
                  </span>
                  <span className="text-2xl font-black text-[hsl(329,100%,35%)]">
                    {bilingualData.spanish.readingLevel}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-gray-700">
                    {t("Puntuación promedio", "Average score")}
                  </span>
                  <span className="text-2xl font-black text-[hsl(329,100%,35%)]">
                    {bilingualData.spanish.averageScore}%
                  </span>
                </div>

                {/* Skills breakdown */}
                <div className="pt-3 border-t-2 border-[hsl(329,100%,65%)]">
                  <p className="text-xs font-bold text-gray-600 mb-3">
                    {t("Habilidades", "Skills")}
                  </p>
                  {bilingualData.spanish.skills.map((skill, i) => (
                    <div key={i} className="mb-2">
                      <div className="flex justify-between text-xs font-bold text-gray-700 mb-1">
                        <span>{skill.name}</span>
                        <span>{skill.score}%</span>
                      </div>
                      <Progress value={skill.score} className="h-2" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* English */}
            <div className="rounded-2xl border-4 border-[hsl(200,100%,65%)] bg-[hsl(200,100%,95%)] p-6 shadow-[0_4px_0_hsl(200,100%,65%)]">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">🇺🇸</span>
                <div>
                  <h3 className="text-2xl font-black text-[hsl(200,100%,35%)]">English</h3>
                  <p className="text-sm font-bold text-gray-600">
                    {t("Segunda lengua", "Second language")}
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-gray-700">
                      {t("Actividades completadas", "Activities completed")}
                    </span>
                    <span className="text-lg font-black text-[hsl(200,100%,35%)]">
                      {bilingualData.english.completedActivities}/{bilingualData.english.totalActivities}
                    </span>
                  </div>
                  <Progress value={englishProgress} className="h-3" />
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-gray-700">
                    {t("Nivel de lectura", "Reading level")}
                  </span>
                  <span className="text-2xl font-black text-[hsl(200,100%,35%)]">
                    {bilingualData.english.readingLevel}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-gray-700">
                    {t("Puntuación promedio", "Average score")}
                  </span>
                  <span className="text-2xl font-black text-[hsl(200,100%,35%)]">
                    {bilingualData.english.averageScore}%
                  </span>
                </div>

                {/* Skills breakdown */}
                <div className="pt-3 border-t-2 border-[hsl(200,100%,65%)]">
                  <p className="text-xs font-bold text-gray-600 mb-3">
                    {t("Habilidades", "Skills")}
                  </p>
                  {bilingualData.english.skills.map((skill, i) => (
                    <div key={i} className="mb-2">
                      <div className="flex justify-between text-xs font-bold text-gray-700 mb-1">
                        <span>{skill.name}</span>
                        <span>{skill.score}%</span>
                      </div>
                      <Progress value={skill.score} className="h-2" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Comparison insight */}
          <div className="mt-6 rounded-2xl border-4 border-[hsl(125,100%,65%)] bg-[hsl(125,100%,95%)] p-6">
            <p className="text-lg font-black text-[hsl(125,100%,25%)] text-center">
              💡 {t(
                "¡Tu español es más fuerte! Sigue practicando inglés para balancear tus habilidades bilingües.",
                "Your Spanish is stronger! Keep practicing English to balance your bilingual skills."
              )}
            </p>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};
