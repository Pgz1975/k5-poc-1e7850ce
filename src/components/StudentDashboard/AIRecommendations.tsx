import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Sparkles, Clock } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { mockAIRecommendations } from "@/data/studentRecommendations";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

export const AIRecommendations = () => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(true);

  const priorityBadgeStyles = {
    high: "bg-[hsl(27,100%,95%)] border-2 border-[hsl(27,100%,65%)] text-[hsl(27,100%,35%)]",
    medium: "bg-[hsl(45,100%,95%)] border-2 border-[hsl(45,100%,65%)] text-[hsl(45,100%,35%)]",
    low: "bg-[hsl(125,100%,95%)] border-2 border-[hsl(125,100%,65%)] text-[hsl(125,100%,35%)]",
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="rounded-3xl border-4 border-[hsl(280,100%,65%)] bg-white p-6 shadow-[0_6px_0_hsl(280,100%,65%)]">
        <CollapsibleTrigger className="w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-[hsl(280,100%,71%)] to-[hsl(280,100%,55%)] rounded-2xl p-4 border-4 border-[hsl(280,100%,65%)] shadow-[0_4px_0_hsl(280,100%,65%)]">
                <Sparkles className="h-7 w-7 text-white" />
              </div>
              <div className="text-left">
                <h2 className="text-2xl font-black text-[hsl(280,100%,35%)]">
                  {t("Recomendaciones del Mentor IA", "AI Mentor Recommendations")}
                </h2>
                <p className="text-sm font-bold text-gray-600">
                  {t("Actividades personalizadas para ti", "Personalized activities for you")}
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
          <div className="mt-6 space-y-4">
            {mockAIRecommendations.map((rec, index) => {
              const cardColors = {
                high: { border: "hsl(329,100%,65%)", bg: "hsl(329,100%,95%)", text: "hsl(329,100%,35%)", iconBg: "hsl(329,100%,71%)" },
                medium: { border: "hsl(45,100%,65%)", bg: "hsl(45,100%,95%)", text: "hsl(45,100%,35%)", iconBg: "hsl(45,100%,71%)" },
                low: { border: "hsl(125,100%,65%)", bg: "hsl(125,100%,95%)", text: "hsl(125,100%,35%)", iconBg: "hsl(125,100%,71%)" },
              };
              
              const colors = cardColors[rec.priority];

              return (
                <Link key={rec.id} to={rec.route} className="block group">
                  <div
                    className="rounded-2xl border-3 p-5 transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_0_var(--border-color)] active:translate-y-0.5 active:shadow-[0_2px_0_var(--border-color)]"
                    style={{
                      borderColor: colors.border,
                      backgroundColor: colors.bg,
                      boxShadow: `0 4px 0 ${colors.border}`,
                      // @ts-ignore
                      "--border-color": colors.border,
                    }}
                  >
                    <div className="flex gap-4">
                      {/* Icon */}
                      <div
                        className="rounded-xl p-3 border-3 flex-shrink-0 h-fit"
                        style={{
                          backgroundColor: colors.iconBg,
                          borderColor: colors.border,
                          boxShadow: `0 3px 0 ${colors.border}`,
                        }}
                      >
                        <span className="text-3xl">{rec.icon}</span>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="text-lg font-black" style={{ color: colors.text }}>
                            {t(rec.titleEs, rec.title)}
                          </h3>
                          {index === 0 && (
                            <Badge className={priorityBadgeStyles[rec.priority]}>
                              {t("Recomendado", "Recommended")}
                            </Badge>
                          )}
                        </div>

                        <p className="text-sm font-bold text-gray-700 mb-3">
                          {t(rec.reasonEs, rec.reason)}
                        </p>

                        <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-gray-600">
                          <span className="flex items-center gap-1">
                            🎯 {t(rec.skillTargetEs, rec.skillTarget)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {rec.estimatedTime} {t("min", "min")}
                          </span>
                          {rec.culturalContent && (
                            <Badge className="bg-[hsl(176,84%,95%)] border-2 border-[hsl(176,84%,65%)] text-[hsl(176,84%,35%)]">
                              🏝️ {t("Cultural", "Cultural")}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};
