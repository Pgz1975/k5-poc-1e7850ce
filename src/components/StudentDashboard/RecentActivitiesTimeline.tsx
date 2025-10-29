import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, BookOpen, Target, ClipboardCheck, Star, Clock } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { mockActivitiesHistory } from "@/data/studentActivitiesHistory";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

export const RecentActivitiesTimeline = () => {
  const { t, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const typeIcons = {
    lesson: BookOpen,
    exercise: Target,
    assessment: ClipboardCheck,
  };

  const typeColors = {
    lesson: { border: "hsl(329,100%,65%)", bg: "hsl(329,100%,95%)", text: "hsl(329,100%,35%)" },
    exercise: { border: "hsl(11,100%,65%)", bg: "hsl(11,100%,95%)", text: "hsl(11,100%,35%)" },
    assessment: { border: "hsl(27,100%,65%)", bg: "hsl(27,100%,95%)", text: "hsl(27,100%,35%)" },
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-700 bg-green-100";
    if (score >= 70) return "text-yellow-700 bg-yellow-100";
    return "text-orange-700 bg-orange-100";
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="rounded-3xl border-4 border-[hsl(11,100%,65%)] bg-white p-6 shadow-[0_6px_0_hsl(11,100%,65%)]">
        <CollapsibleTrigger className="w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-[hsl(11,100%,71%)] rounded-2xl p-4 border-4 border-[hsl(11,100%,65%)] shadow-[0_4px_0_hsl(11,100%,65%)]">
                <Clock className="h-7 w-7 text-white" />
              </div>
              <div className="text-left">
                <h2 className="text-2xl font-black text-[hsl(11,100%,35%)]">
                  {t("Actividades Recientes", "Recent Activities")}
                </h2>
                <p className="text-sm font-bold text-gray-600">
                  {t("Tu historial de aprendizaje", "Your learning history")}
                </p>
              </div>
            </div>
            <ChevronDown 
              className={`h-6 w-6 text-[hsl(11,100%,35%)] transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="mt-6 space-y-3">
            {mockActivitiesHistory.map((activity, index) => {
              const Icon = typeIcons[activity.type];
              const colors = typeColors[activity.type];
              const timeAgo = formatDistanceToNow(new Date(activity.completedAt), {
                addSuffix: true,
                locale: language === "es" ? es : undefined,
              });

              return (
                <div
                  key={activity.id}
                  className="rounded-2xl border-3 p-4 transition-all hover:shadow-md"
                  style={{
                    borderColor: colors.border,
                    backgroundColor: colors.bg,
                  }}
                >
                  <div className="flex gap-4">
                    {/* Icon */}
                    <div
                      className="rounded-xl p-3 border-3 flex-shrink-0 h-fit"
                      style={{
                        backgroundColor: colors.border,
                        borderColor: colors.border,
                      }}
                    >
                      <Icon className="h-6 w-6 text-white" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <h3 className="text-lg font-black" style={{ color: colors.text }}>
                            {t(activity.titleEs, activity.title)}
                          </h3>
                          <p className="text-xs font-bold text-gray-600">{timeAgo}</p>
                        </div>
                        {/* Score */}
                        <div className={`rounded-lg px-3 py-1 font-black ${getScoreColor(activity.score)}`}>
                          {activity.score}%
                        </div>
                      </div>

                      {/* Skills practiced */}
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        {(language === "es" ? activity.skillsPracticedEs : activity.skillsPracticed).map((skill, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {activity.culturalContent && (
                          <Badge className="bg-[hsl(176,84%,95%)] border-2 border-[hsl(176,84%,65%)] text-[hsl(176,84%,35%)] text-xs">
                            🏝️ {t("Cultural", "Cultural")}
                          </Badge>
                        )}
                      </div>

                      {/* Badge earned & time */}
                      <div className="flex items-center gap-4 text-xs font-bold text-gray-700">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {activity.timeSpent} {t("min", "min")}
                        </span>
                        {activity.badge && (
                          <span className="flex items-center gap-1 text-yellow-700">
                            <Star className="h-3 w-3 fill-current" />
                            {t(activity.badgeEs || activity.badge, activity.badge)}
                          </span>
                        )}
                      </div>
                    </div>
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
