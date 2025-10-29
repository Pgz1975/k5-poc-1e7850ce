import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Trophy, Lock } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/contexts/LanguageContext";
import { mockAchievements } from "@/data/studentAchievements";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

export const AchievementGallery = () => {
  const { t, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const earnedCount = mockAchievements.filter((a) => a.earned).length;
  const totalCount = mockAchievements.length;

  const rarityColors = {
    common: { border: "hsl(0,0%,65%)", bg: "hsl(0,0%,95%)", text: "hsl(0,0%,35%)" },
    rare: { border: "hsl(200,100%,65%)", bg: "hsl(200,100%,95%)", text: "hsl(200,100%,35%)" },
    epic: { border: "hsl(280,100%,65%)", bg: "hsl(280,100%,95%)", text: "hsl(280,100%,35%)" },
    legendary: { border: "hsl(45,100%,65%)", bg: "hsl(45,100%,95%)", text: "hsl(45,100%,35%)" },
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="rounded-3xl border-4 border-[hsl(45,100%,65%)] bg-white p-6 shadow-[0_6px_0_hsl(45,100%,65%)]">
        <CollapsibleTrigger className="w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-[hsl(45,100%,71%)] to-[hsl(45,100%,55%)] rounded-2xl p-4 border-4 border-[hsl(45,100%,65%)] shadow-[0_4px_0_hsl(45,100%,65%)]">
                <Trophy className="h-7 w-7 text-white" />
              </div>
              <div className="text-left">
                <h2 className="text-2xl font-black text-[hsl(45,100%,35%)]">
                  {t("Mis Logros", "My Achievements")}
                </h2>
                <p className="text-sm font-bold text-gray-600">
                  {earnedCount}/{totalCount} {t("medallas ganadas", "badges earned")}
                </p>
              </div>
            </div>
            <ChevronDown 
              className={`h-6 w-6 text-[hsl(45,100%,35%)] transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="mt-6">
            {/* Overall progress */}
            <div className="mb-6 rounded-2xl border-3 border-[hsl(125,100%,65%)] bg-[hsl(125,100%,95%)] p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-gray-700">
                  {t("Progreso de colección", "Collection progress")}
                </span>
                <span className="text-lg font-black text-[hsl(125,100%,35%)]">
                  {Math.round((earnedCount / totalCount) * 100)}%
                </span>
              </div>
              <Progress value={(earnedCount / totalCount) * 100} className="h-3" />
            </div>

            {/* Achievement grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {mockAchievements.map((achievement) => {
                const colors = rarityColors[achievement.rarity];
                
                return (
                  <div
                    key={achievement.id}
                    className={`rounded-2xl border-3 p-4 transition-all ${
                      achievement.earned 
                        ? "hover:shadow-lg hover:-translate-y-1" 
                        : "opacity-60"
                    }`}
                    style={{
                      borderColor: colors.border,
                      backgroundColor: colors.bg,
                    }}
                  >
                    {/* Icon */}
                    <div className="text-center mb-3 relative">
                      {achievement.earned ? (
                        <span className="text-5xl">{achievement.icon}</span>
                      ) : (
                        <div className="relative inline-block">
                          <span className="text-5xl filter grayscale opacity-40">
                            {achievement.icon}
                          </span>
                          <Lock 
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8"
                            style={{ color: colors.text }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Name */}
                    <h3 
                      className="text-sm font-black text-center mb-2 line-clamp-2"
                      style={{ color: colors.text }}
                    >
                      {t(achievement.nameEs, achievement.name)}
                    </h3>

                    {/* Description */}
                    <p className="text-xs font-bold text-gray-600 text-center mb-3 line-clamp-2">
                      {t(achievement.descriptionEs, achievement.description)}
                    </p>

                    {/* Progress or earned date */}
                    {achievement.earned ? (
                      <p className="text-xs font-bold text-center" style={{ color: colors.text }}>
                        {formatDistanceToNow(new Date(achievement.earnedAt!), {
                          addSuffix: true,
                          locale: language === "es" ? es : undefined,
                        })}
                      </p>
                    ) : (
                      achievement.progress !== undefined && (
                        <div>
                          <Progress 
                            value={achievement.progress} 
                            className="h-2 mb-1"
                          />
                          <p className="text-xs font-bold text-center text-gray-600">
                            {achievement.progress}%
                          </p>
                        </div>
                      )
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};
