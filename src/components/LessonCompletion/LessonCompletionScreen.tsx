import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { CoquiMascot } from '@/components/CoquiMascot';
import { Star } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useUnitColor } from '@/hooks/useUnitColor';
import { cn } from '@/lib/utils';

interface Exercise {
  id: string;
  title: string;
  content: any;
}

interface Lesson {
  id: string;
  title: string;
  description?: string;
  content: any;
}

interface LessonCompletionScreenProps {
  lesson: Lesson;
  exercises: Exercise[];
  exerciseScores: Map<string, number>;
  onReturn: () => void;
}

export function LessonCompletionScreen({
  lesson,
  exercises,
  exerciseScores,
  onReturn,
}: LessonCompletionScreenProps) {
  const { t } = useLanguage();
  const { colorScheme } = useUnitColor(lesson.id);

  useEffect(() => {
    // Trigger confetti on mount
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  const renderContent = () => {
    const content = lesson.content;

    if (typeof content === 'string') {
      return <p className="whitespace-pre-wrap">{content}</p>;
    }

    if (content && typeof content === 'object') {
      // Handle various content structures
      if (content.text) {
        return <p className="whitespace-pre-wrap">{content.text}</p>;
      }
      if (content.description) {
        return <p className="whitespace-pre-wrap">{content.description}</p>;
      }
      if (content.sections && Array.isArray(content.sections)) {
        return (
          <div className="space-y-4">
            {content.sections.map((section: any, idx: number) => (
              <div key={idx}>
                {section.title && <h4 className="font-semibold mb-2">{section.title}</h4>}
                {section.content && <p className="whitespace-pre-wrap">{section.content}</p>}
              </div>
            ))}
          </div>
        );
      }
    }

    return lesson.description ? (
      <p className="whitespace-pre-wrap">{lesson.description}</p>
    ) : null;
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl space-y-6">
      {/* Celebration Header */}
      <div className={cn(
        "text-center p-8 rounded-2xl border-4 mb-6",
        colorScheme?.border,
        colorScheme?.bg,
        "shadow-[0_8px_0_rgba(0,0,0,0.12)]"
      )}>
        <h1 className="text-4xl sm:text-5xl font-black text-white drop-shadow-lg">
          {t('🎉 ¡Lección Completada! 🎉', '🎉 Lesson Complete! 🎉')}
        </h1>
        <p className="text-2xl font-bold text-white/90 mt-2">
          {t('¡Excelente trabajo!', 'Excellent work!')}
        </p>
      </div>

      {/* Lesson Content Review */}
      <Card className={cn(
        "border-4 rounded-2xl",
        colorScheme?.border,
        "bg-white shadow-[0_4px_0_rgba(0,0,0,0.08)]"
      )}>
        <CardHeader>
          <CardTitle className="text-2xl font-black text-gray-800">{lesson.title}</CardTitle>
        </CardHeader>
        <CardContent>
          {renderContent()}
        </CardContent>
      </Card>

      {/* Exercises Summary */}
      <Card className={cn(
        "border-4 rounded-2xl",
        colorScheme?.border,
        "bg-white shadow-[0_4px_0_rgba(0,0,0,0.08)]"
      )}>
        <CardHeader>
          <CardTitle className="text-xl font-black text-gray-800">
            {t('Ejercicios Completados', 'Completed Exercises')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {exercises.map((ex) => {
              const score = exerciseScores.get(ex.id) || 0;
              const stars = score >= 90 ? 3 : score >= 70 ? 2 : score >= 50 ? 1 : 0;

              return (
                <div
                  key={ex.id}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-xl border-3",
                    colorScheme?.border,
                    "bg-white hover:shadow-[0_4px_0_rgba(0,0,0,0.08)] transition-all"
                  )}
                >
                  <span className="font-bold text-gray-800">{ex.title}</span>
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      "text-lg font-black",
                      colorScheme?.text
                    )}>
                      {score}%
                    </span>
                    <div className="flex gap-1">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < stars
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Coquí Mascot */}
      <div className="flex justify-center py-6">
        <div className={cn(
          "p-8 rounded-full border-4",
          colorScheme?.iconBg,
          colorScheme?.border,
          "shadow-[0_6px_0_rgba(0,0,0,0.12)]"
        )}>
          <CoquiMascot state="celebration" size="large" position="inline" />
        </div>
      </div>

      {/* Return Button */}
      <div className="flex justify-center">
        <Button 
          onClick={onReturn} 
          size="lg"
          className={cn(
            "text-lg px-8 py-6 rounded-2xl border-4 font-black",
            colorScheme?.bg,
            colorScheme?.border,
            colorScheme?.shadow,
            "text-white hover:-translate-y-0.5 active:translate-y-1",
            "transition-all duration-200"
          )}
        >
          {t('Volver al Dashboard', 'Back to Dashboard')}
        </Button>
      </div>
    </div>
  );
}
