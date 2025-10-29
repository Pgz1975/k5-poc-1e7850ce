import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Star, Trophy, Target } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import CoquiMascot from "@/components/CoquiMascot";

interface ReadingLevelPathProps {
  currentLevel: number;
  currentXP: number;
  nextLevelXP: number;
  gradeLevel: number;
}

export const ReadingLevelPath = ({ 
  currentLevel, 
  currentXP, 
  nextLevelXP,
  gradeLevel 
}: ReadingLevelPathProps) => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(true);

  const xpProgress = (currentXP / nextLevelXP) * 100;
  const xpNeeded = nextLevelXP - currentXP;

  // Calculate reading level representation (e.g., 3.2 = Grade 3, Month 2)
  const readingGrade = Math.floor(currentLevel / 10);
  const readingMonth = currentLevel % 10;
  const readingLevelDisplay = `${readingGrade}.${readingMonth}`;

  const isAboveGrade = readingGrade > gradeLevel;
  const isAtGrade = readingGrade === gradeLevel;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="rounded-3xl border-4 border-[hsl(125,100%,65%)] bg-gradient-to-br from-[hsl(125,100%,95%)] to-[hsl(125,100%,85%)] p-6 shadow-[0_6px_0_hsl(125,100%,65%)]">
        <CollapsibleTrigger className="w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-[hsl(125,100%,71%)] to-[hsl(125,100%,55%)] rounded-2xl p-4 border-4 border-[hsl(125,100%,65%)] shadow-[0_4px_0_hsl(125,100%,65%)]">
                <Trophy className="h-7 w-7 text-white" />
              </div>
              <div className="text-left">
                <h2 className="text-2xl font-black text-[hsl(125,100%,25%)]">
                  {t("Mi Camino de Lectura", "My Reading Journey")}
                </h2>
                <p className="text-sm font-bold text-gray-700">
                  {t("Nivel actual y progreso", "Current level and progress")}
                </p>
              </div>
            </div>
            <ChevronDown 
              className={`h-6 w-6 text-[hsl(125,100%,25%)] transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="mt-6 space-y-6">
            {/* Current Level Display */}
            <div className="rounded-2xl border-4 border-white bg-white p-6 shadow-[0_4px_0_rgba(255,255,255,0.5)]">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-sm font-bold text-gray-600 mb-1">
                    {t("Tu Nivel de Lectura", "Your Reading Level")}
                  </div>
                  <div className="text-5xl font-black text-[hsl(125,100%,35%)]">
                    {readingLevelDisplay}
                  </div>
                  <div className="text-sm font-bold text-gray-700 mt-2">
                    {t(`Grado ${readingGrade}, Mes ${readingMonth}`, `Grade ${readingGrade}, Month ${readingMonth}`)}
                  </div>
                </div>
                <CoquiMascot 
                  state={isAboveGrade ? "celebration" : "happy"}
                  size="medium"
                  position="inline"
                />
              </div>

              {/* Comparison to grade level */}
              {isAboveGrade && (
                <div className="rounded-xl bg-[hsl(125,100%,95%)] border-2 border-[hsl(125,100%,65%)] p-4">
                  <div className="flex items-center gap-2 text-[hsl(125,100%,25%)] font-black">
                    <Star className="h-5 w-5 fill-current" />
                    <span>
                      {t(
                        `¡Estás leyendo por encima del nivel de ${gradeLevel}er grado!`,
                        `You're reading above ${gradeLevel}${gradeLevel === 1 ? 'st' : gradeLevel === 2 ? 'nd' : gradeLevel === 3 ? 'rd' : 'th'} grade level!`
                      )}
                    </span>
                  </div>
                </div>
              )}

              {isAtGrade && (
                <div className="rounded-xl bg-[hsl(45,100%,95%)] border-2 border-[hsl(45,100%,65%)] p-4">
                  <div className="flex items-center gap-2 text-[hsl(45,100%,25%)] font-black">
                    <Target className="h-5 w-5" />
                    <span>
                      {t(
                        `¡Estás en el nivel esperado para ${gradeLevel}er grado!`,
                        `You're at the expected level for ${gradeLevel}${gradeLevel === 1 ? 'st' : gradeLevel === 2 ? 'nd' : gradeLevel === 3 ? 'rd' : 'th'} grade!`
                      )}
                    </span>
                  </div>
                </div>
              )}

              {!isAboveGrade && !isAtGrade && (
                <div className="rounded-xl bg-[hsl(27,100%,95%)] border-2 border-[hsl(27,100%,65%)] p-4">
                  <div className="flex items-center gap-2 text-[hsl(27,100%,25%)] font-black">
                    <Target className="h-5 w-5" />
                    <span>
                      {t(
                        `¡Sigue practicando para alcanzar el nivel de ${gradeLevel}er grado!`,
                        `Keep practicing to reach ${gradeLevel}${gradeLevel === 1 ? 'st' : gradeLevel === 2 ? 'nd' : gradeLevel === 3 ? 'rd' : 'th'} grade level!`
                      )}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* XP Progress to Next Level */}
            <div className="rounded-2xl border-4 border-[hsl(45,100%,65%)] bg-white p-6 shadow-[0_4px_0_hsl(45,100%,65%)]">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-black text-[hsl(45,100%,35%)]">
                    {t("Progreso al Nivel", "Progress to Level")} {currentLevel + 1}
                  </h3>
                  <p className="text-sm font-bold text-gray-600">
                    {t(`${xpNeeded} XP más para subir de nivel`, `${xpNeeded} XP to level up`)}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-black text-[hsl(45,100%,35%)]">
                    {Math.round(xpProgress)}%
                  </div>
                </div>
              </div>
              <Progress value={xpProgress} variant="student-yellow" className="h-6" />
              <div className="mt-2 text-xs font-bold text-gray-600 text-center">
                {currentXP} / {nextLevelXP} XP
              </div>
            </div>

            {/* How to Advance */}
            <div className="rounded-2xl border-4 border-[hsl(176,84%,65%)] bg-[hsl(176,84%,95%)] p-6 shadow-[0_4px_0_hsl(176,84%,65%)]">
              <h3 className="text-lg font-black text-[hsl(176,84%,25%)] mb-3">
                {t("¿Cómo Subir de Nivel?", "How to Level Up?")}
              </h3>
              <ul className="space-y-2 text-sm font-bold text-gray-700">
                <li className="flex items-start gap-2">
                  <span>📖</span>
                  <span>{t("Completa lecciones y ejercicios (+100 XP cada uno)", "Complete lessons and exercises (+100 XP each)")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>⭐</span>
                  <span>{t("Obtén puntuaciones altas en evaluaciones (+150 XP)", "Get high scores on assessments (+150 XP)")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>🔥</span>
                  <span>{t("Mantén tu racha diaria (+50 XP por día)", "Maintain your daily streak (+50 XP per day)")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>🎤</span>
                  <span>{t("Practica pronunciación con el mentor IA (+75 XP)", "Practice pronunciation with AI mentor (+75 XP)")}</span>
                </li>
              </ul>
            </div>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};
