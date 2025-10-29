import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { Play, Zap, BookOpen, Target, TrendingUp } from "lucide-react";

export const QuickActions = () => {
  const { t } = useLanguage();

  const quickActions = [
    {
      id: "continue",
      title: t("Continuar Donde lo Dejaste", "Continue Where You Left Off"),
      description: t("Retoma tu última actividad", "Resume your last activity"),
      route: "/student-dashboard/lessons",
      icon: Play,
      bgColor: "hsl(329,100%,95%)",
      borderColor: "hsl(329,100%,65%)",
      textColor: "hsl(329,100%,35%)",
      iconBg: "hsl(329,100%,71%)",
    },
    {
      id: "quick-practice",
      title: t("Práctica Rápida", "Quick Practice"),
      description: t("5 minutos de práctica de pronunciación", "5-minute pronunciation drill"),
      route: "/student-dashboard/exercises",
      icon: Zap,
      bgColor: "hsl(45,100%,95%)",
      borderColor: "hsl(45,100%,65%)",
      textColor: "hsl(45,100%,35%)",
      iconBg: "hsl(45,100%,71%)",
    },
    {
      id: "daily-story",
      title: t("Historia del Día", "Today's Story"),
      description: t("Lee la historia recomendada de hoy", "Read today's recommended story"),
      route: "/student-dashboard/lessons",
      icon: BookOpen,
      bgColor: "hsl(200,100%,95%)",
      borderColor: "hsl(200,100%,65%)",
      textColor: "hsl(200,100%,35%)",
      iconBg: "hsl(200,100%,71%)",
    },
    {
      id: "challenge",
      title: t("Modo Desafío", "Challenge Mode"),
      description: t("Desafío cronometrado de lectura", "Timed reading challenge"),
      route: "/student-dashboard/exercises",
      icon: Target,
      bgColor: "hsl(11,100%,95%)",
      borderColor: "hsl(11,100%,65%)",
      textColor: "hsl(11,100%,35%)",
      iconBg: "hsl(11,100%,71%)",
    },
    {
      id: "weak-skill",
      title: t("Mejora tu Punto Débil", "Improve Your Weak Spot"),
      description: t("Práctica enfocada en pronunciación", "Focused practice on pronunciation"),
      route: "/student-dashboard/exercises",
      icon: TrendingUp,
      bgColor: "hsl(125,100%,95%)",
      borderColor: "hsl(125,100%,65%)",
      textColor: "hsl(125,100%,35%)",
      iconBg: "hsl(125,100%,71%)",
    },
  ];

  return (
    <div className="rounded-3xl border-4 border-[hsl(176,84%,65%)] bg-gradient-to-br from-white to-[hsl(176,84%,98%)] p-6 shadow-[0_6px_0_hsl(176,84%,65%)]">
      <div className="mb-6">
        <h2 className="text-2xl font-black text-[hsl(176,84%,25%)]">
          {t("Acciones Rápidas", "Quick Actions")}
        </h2>
        <p className="text-sm font-bold text-gray-600">
          {t("Comienza a aprender en un clic", "Start learning in one click")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {quickActions.map((action) => {
          const Icon = action.icon;
          
          return (
            <Link
              key={action.id}
              to={action.route}
              className="group"
            >
              <div
                className="rounded-2xl border-3 p-5 h-full transition-all hover:shadow-[0_6px_0_var(--border-color)] hover:-translate-y-1 active:translate-y-0.5 active:shadow-[0_2px_0_var(--border-color)]"
                style={{
                  backgroundColor: action.bgColor,
                  borderColor: action.borderColor,
                  boxShadow: `0 4px 0 ${action.borderColor}`,
                  // @ts-ignore
                  "--border-color": action.borderColor,
                }}
              >
                {/* Icon */}
                <div className="mb-4">
                  <div
                    className="rounded-xl p-3 border-3 inline-flex"
                    style={{
                      backgroundColor: action.iconBg,
                      borderColor: action.borderColor,
                      boxShadow: `0 3px 0 ${action.borderColor}`,
                    }}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>

                {/* Content */}
                <h3
                  className="text-base font-black mb-2 line-clamp-2"
                  style={{ color: action.textColor }}
                >
                  {action.title}
                </h3>
                <p className="text-xs font-bold text-gray-600 line-clamp-2">
                  {action.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
