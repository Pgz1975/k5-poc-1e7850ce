import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/contexts/LanguageContext";
import { mockSkillsProgress } from "@/data/studentSkillsProgress";
import { useState } from "react";

export const SkillsProgressSection = () => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="rounded-3xl border-4 border-[hsl(200,100%,65%)] bg-white p-6 shadow-[0_6px_0_hsl(200,100%,65%)]">
        <CollapsibleTrigger className="w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-[hsl(200,100%,71%)] rounded-2xl p-4 border-4 border-[hsl(200,100%,65%)] shadow-[0_4px_0_hsl(200,100%,65%)]">
                <span className="text-3xl">📊</span>
              </div>
              <div className="text-left">
                <h2 className="text-2xl font-black text-[hsl(200,100%,35%)]">
                  {t("Mis Habilidades de Lectura", "My Reading Skills")}
                </h2>
                <p className="text-sm font-bold text-gray-600">
                  {t("Progreso en cada área", "Progress in each area")}
                </p>
              </div>
            </div>
            <ChevronDown 
              className={`h-6 w-6 text-[hsl(200,100%,35%)] transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="mt-6 space-y-4">
            {mockSkillsProgress.map((skill) => {
              const isAboveExpectation = skill.currentScore >= skill.gradeExpectation;
              const borderColor = skill.color;
              const bgColor = skill.color.replace("65%", "95%");
              const textColor = skill.color.replace("65%", "35%");

              return (
                <div
                  key={skill.id}
                  className="rounded-2xl border-3 p-5"
                  style={{
                    borderColor: skill.color,
                    backgroundColor: bgColor,
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{skill.icon}</span>
                      <div>
                        <h3 className="text-lg font-black" style={{ color: textColor }}>
                          {t(skill.nameEs, skill.name)}
                        </h3>
                        <div className="flex items-center gap-2 text-sm font-bold text-gray-600">
                          {skill.trend === "up" && (
                            <TrendingUp className="h-4 w-4 text-green-600" />
                          )}
                          {skill.trend === "down" && (
                            <TrendingDown className="h-4 w-4 text-orange-600" />
                          )}
                          {skill.trend === "stable" && (
                            <Minus className="h-4 w-4 text-gray-500" />
                          )}
                          <span>
                            {skill.trend === "up" && t("¡Mejorando!", "Improving!")}
                            {skill.trend === "down" && t("Necesita práctica", "Needs practice")}
                            {skill.trend === "stable" && t("Estable", "Stable")}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-black" style={{ color: textColor }}>
                        {skill.currentScore}%
                      </div>
                      <div className="text-xs font-bold text-gray-600">
                        {t("Meta:", "Goal:")} {skill.gradeExpectation}%
                      </div>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="relative">
                    <Progress 
                      value={skill.currentScore} 
                      className="h-6 bg-white/50"
                      style={{
                        // @ts-ignore - Custom CSS variable
                        "--progress-background": skill.color,
                      }}
                    />
                    {/* Grade expectation marker */}
                    <div
                      className="absolute top-0 bottom-0 w-1 bg-black/30"
                      style={{ left: `${skill.gradeExpectation}%` }}
                    />
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs font-bold text-gray-700">
                    <span>
                      {skill.practiceCount} {t("actividades completadas", "activities completed")}
                    </span>
                    {isAboveExpectation ? (
                      <span className="text-green-700 font-black">
                        {t("¡Por encima del nivel! 🌟", "Above grade level! 🌟")}
                      </span>
                    ) : (
                      <span className="text-orange-700 font-black">
                        {t("Sigue practicando 💪", "Keep practicing 💪")}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};
