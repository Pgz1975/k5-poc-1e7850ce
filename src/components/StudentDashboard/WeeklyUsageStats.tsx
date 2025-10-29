import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Calendar, Clock, Trophy, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";

export const WeeklyUsageStats = () => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  // Mock weekly data
  const weekData = [
    { day: t("Lun", "Mon"), dayFull: t("Lunes", "Monday"), minutes: 35, active: true },
    { day: t("Mar", "Tue"), dayFull: t("Martes", "Tuesday"), minutes: 42, active: true },
    { day: t("Mié", "Wed"), dayFull: t("Miércoles", "Wednesday"), minutes: 28, active: true },
    { day: t("Jue", "Thu"), dayFull: t("Jueves", "Thursday"), minutes: 45, active: true },
    { day: t("Vie", "Fri"), dayFull: t("Viernes", "Friday"), minutes: 38, active: true },
    { day: t("Sáb", "Sat"), dayFull: t("Sábado", "Saturday"), minutes: 52, active: true },
    { day: t("Dom", "Sun"), dayFull: t("Domingo", "Sunday"), minutes: 40, active: true },
  ];

  const totalMinutes = weekData.reduce((sum, day) => sum + day.minutes, 0);
  const avgMinutesPerDay = Math.round(totalMinutes / weekData.length);
  const activeDays = weekData.filter(d => d.active).length;
  const maxMinutes = Math.max(...weekData.map(d => d.minutes));

  const stats = {
    thisWeek: totalMinutes,
    lastWeek: 215,
    avgSession: 23,
    totalSessions: 12,
    schoolUsage: 65, // percentage
    homeUsage: 35,
  };

  const weekChange = ((stats.thisWeek - stats.lastWeek) / stats.lastWeek) * 100;
  const isImproving = weekChange > 0;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="rounded-3xl border-4 border-[hsl(27,100%,65%)] bg-white p-6 shadow-[0_6px_0_hsl(27,100%,65%)]">
        <CollapsibleTrigger className="w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-[hsl(27,100%,71%)] rounded-2xl p-4 border-4 border-[hsl(27,100%,65%)] shadow-[0_4px_0_hsl(27,100%,65%)]">
                <Calendar className="h-7 w-7 text-white" />
              </div>
              <div className="text-left">
                <h2 className="text-2xl font-black text-[hsl(27,100%,35%)]">
                  {t("Mi Semana de Aprendizaje", "My Learning Week")}
                </h2>
                <p className="text-sm font-bold text-gray-600">
                  {totalMinutes} {t("minutos esta semana", "minutes this week")}
                </p>
              </div>
            </div>
            <ChevronDown 
              className={`h-6 w-6 text-[hsl(27,100%,35%)] transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="mt-6 space-y-6">
            {/* Week comparison */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl border-3 border-[hsl(125,100%,65%)] bg-[hsl(125,100%,95%)] p-5">
                <div className="flex items-center gap-2 mb-2">
                  {isImproving ? (
                    <TrendingUp className="h-5 w-5 text-green-700" />
                  ) : (
                    <TrendingUp className="h-5 w-5 text-orange-700 rotate-180" />
                  )}
                  <span className="text-sm font-bold text-gray-700">
                    {t("Esta Semana", "This Week")}
                  </span>
                </div>
                <div className="text-4xl font-black text-[hsl(125,100%,35%)]">
                  {stats.thisWeek}
                </div>
                <div className="text-xs font-bold text-gray-600">
                  {t("minutos totales", "total minutes")}
                </div>
              </div>

              <div className="rounded-2xl border-3 border-[hsl(200,100%,65%)] bg-[hsl(200,100%,95%)] p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="h-5 w-5 text-[hsl(200,100%,35%)]" />
                  <span className="text-sm font-bold text-gray-700">
                    {t("Días Activos", "Active Days")}
                  </span>
                </div>
                <div className="text-4xl font-black text-[hsl(200,100%,35%)]">
                  {activeDays}/7
                </div>
                <div className="text-xs font-bold text-gray-600">
                  {t("días practicados", "days practiced")}
                </div>
              </div>
            </div>

            {/* Daily breakdown chart */}
            <div className="rounded-2xl border-3 border-[hsl(280,100%,65%)] bg-[hsl(280,100%,95%)] p-5">
              <h3 className="text-lg font-black text-[hsl(280,100%,35%)] mb-4">
                {t("Actividad Diaria", "Daily Activity")}
              </h3>
              <div className="space-y-3">
                {weekData.map((day, index) => {
                  const heightPercent = (day.minutes / maxMinutes) * 100;
                  
                  return (
                    <div key={index}>
                      <div className="flex items-center justify-between text-sm font-bold text-gray-700 mb-1">
                        <span>{day.dayFull}</span>
                        <span>{day.minutes} {t("min", "min")}</span>
                      </div>
                      <div className="relative h-8 bg-white rounded-lg overflow-hidden">
                        <div
                          className="absolute top-0 left-0 h-full bg-gradient-to-r from-[hsl(280,100%,71%)] to-[hsl(280,100%,55%)] transition-all"
                          style={{ width: `${heightPercent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Additional stats */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="rounded-2xl border-3 border-[hsl(45,100%,65%)] bg-[hsl(45,100%,95%)] p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="h-5 w-5 text-[hsl(45,100%,35%)]" />
                  <span className="text-sm font-bold text-gray-700">
                    {t("Promedio por Sesión", "Average per Session")}
                  </span>
                </div>
                <div className="text-3xl font-black text-[hsl(45,100%,35%)]">
                  {stats.avgSession} {t("min", "min")}
                </div>
                <div className="text-xs font-bold text-gray-600 mt-1">
                  {stats.totalSessions} {t("sesiones totales", "total sessions")}
                </div>
              </div>

              <div className="rounded-2xl border-3 border-[hsl(176,84%,65%)] bg-[hsl(176,84%,95%)] p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">🏫</span>
                  <span className="text-sm font-bold text-gray-700">
                    {t("Uso por Ubicación", "Usage by Location")}
                  </span>
                </div>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-xs font-bold text-gray-700 mb-1">
                      <span>{t("Escuela", "School")}</span>
                      <span>{stats.schoolUsage}%</span>
                    </div>
                    <Progress value={stats.schoolUsage} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-bold text-gray-700 mb-1">
                      <span>{t("Casa", "Home")}</span>
                      <span>{stats.homeUsage}%</span>
                    </div>
                    <Progress value={stats.homeUsage} className="h-2" />
                  </div>
                </div>
              </div>
            </div>

            {/* Motivational message */}
            {isImproving && (
              <div className="rounded-2xl border-4 border-[hsl(125,100%,65%)] bg-[hsl(125,100%,95%)] p-5 text-center">
                <p className="text-lg font-black text-[hsl(125,100%,25%)]">
                  🎉 {t(
                    `¡Excelente! Practicaste ${Math.abs(Math.round(weekChange))}% más que la semana pasada!`,
                    `Great job! You practiced ${Math.abs(Math.round(weekChange))}% more than last week!`
                  )}
                </p>
              </div>
            )}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};
