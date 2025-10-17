import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Trophy, Star, ArrowRight } from "lucide-react";
import CoquiMascot from "@/components/CoquiMascot";

interface CompletionCelebrationProps {
  pronunciationScore: number;
  pointsEarned: number;
  onNext: () => void;
}

export const CompletionCelebration = ({
  pronunciationScore,
  pointsEarned,
  onNext,
}: CompletionCelebrationProps) => {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto px-6 py-8 min-h-screen flex items-center justify-center">
      <Card className="max-w-2xl mx-auto p-12 bg-card shadow-soft text-center relative overflow-hidden">
        {/* Confetti effect */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-fall"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            >
              {["⭐", "🎉", "✨", "🌟"][Math.floor(Math.random() * 4)]}
            </div>
          ))}
        </div>

        <div className="relative z-10">
          <div className="mb-8">
            <CoquiMascot
              state="celebration"
              size="large"
              position="inline"
              className="mx-auto animate-bounce-once"
            />
          </div>

          <h2 className="text-4xl font-bold mb-4 text-primary">
            {t("¡Felicidades!", "Congratulations!")}
          </h2>
          
          <p className="text-xl mb-8 text-muted-foreground">
            {t("¡Completaste este ejercicio!", "You completed this exercise!")}
          </p>

          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="bg-primary/10 rounded-xl p-6">
              <Trophy className="h-12 w-12 mx-auto mb-3 text-primary" />
              <p className="text-sm text-muted-foreground mb-1">
                {t("Pronunciación", "Pronunciation")}
              </p>
              <p className="text-3xl font-bold text-primary">{pronunciationScore}%</p>
            </div>

            <div className="bg-secondary/10 rounded-xl p-6">
              <Star className="h-12 w-12 mx-auto mb-3 text-secondary" />
              <p className="text-sm text-muted-foreground mb-1">
                {t("Puntos Ganados", "Points Earned")}
              </p>
              <p className="text-3xl font-bold text-secondary">+{pointsEarned}</p>
            </div>
          </div>

          <Button
            size="lg"
            onClick={onNext}
            className="gap-2 bg-gradient-to-br from-primary to-green-700 text-lg px-8 py-6"
          >
            {t("Siguiente Ejercicio", "Next Exercise")}
            <ArrowRight className="h-6 w-6" />
          </Button>
        </div>
      </Card>
    </div>
  );
};
