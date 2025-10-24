import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { CoquiMascot } from '@/components/CoquiMascot';
import { Star } from 'lucide-react';
import confetti from 'canvas-confetti';

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
      <div className="text-center space-y-4">
        <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          {t('🎉 ¡Lección Completada! 🎉', '🎉 Lesson Complete! 🎉')}
        </h1>
        <p className="text-xl text-muted-foreground">
          {t('¡Excelente trabajo!', 'Excellent work!')}
        </p>
      </div>

      {/* Lesson Content Review */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{lesson.title}</CardTitle>
        </CardHeader>
        <CardContent>
          {renderContent()}
        </CardContent>
      </Card>

      {/* Exercises Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">
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
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <span className="font-medium">{ex.title}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-primary">
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
        <CoquiMascot state="celebration" size="large" position="inline" />
      </div>

      {/* Return Button */}
      <div className="flex justify-center">
        <Button onClick={onReturn} size="lg" className="text-lg px-8">
          {t('Volver al Dashboard', 'Back to Dashboard')}
        </Button>
      </div>
    </div>
  );
}
