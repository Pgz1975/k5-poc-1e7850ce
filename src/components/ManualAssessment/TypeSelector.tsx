import { Card } from '@/components/ui/card';
import { BookOpen, PenTool, ClipboardCheck } from 'lucide-react';
import CoquiMascot from '@/components/CoquiMascot';
import { useLanguage } from '@/contexts/LanguageContext';

interface TypeSelectorProps {
  onSelect: (type: 'lesson' | 'exercise' | 'assessment') => void;
}

export function TypeSelector({ onSelect }: TypeSelectorProps) {
  const { t } = useLanguage();

  const types = [
    {
      id: 'lesson' as const,
      icon: BookOpen,
      titleEs: 'Lección',
      titleEn: 'Lesson',
      descriptionEs: 'Contenido educativo',
      descriptionEn: 'Teaching content',
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'exercise' as const,
      icon: PenTool,
      titleEs: 'Ejercicio',
      titleEn: 'Exercise',
      descriptionEs: 'Actividad de práctica',
      descriptionEn: 'Practice activity',
      color: 'from-green-500 to-green-600'
    },
    {
      id: 'assessment' as const,
      icon: ClipboardCheck,
      titleEs: 'Evaluación',
      titleEn: 'Assessment',
      descriptionEs: 'Evaluar aprendizaje',
      descriptionEn: 'Evaluate learning',
      color: 'from-purple-500 to-purple-600'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-8">
        {t("¿Qué quieres crear?", "What do you want to create?")}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {types.map(type => {
          const Icon = type.icon;
          return (
            <Card
              key={type.id}
              className="p-8 cursor-pointer hover:shadow-xl transition-all hover:scale-105 bg-card"
              onClick={() => onSelect(type.id)}
            >
              <div className={`w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br ${type.color} flex items-center justify-center`}>
                <Icon className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-center mb-2 text-foreground">
                {t(type.titleEs, type.titleEn)}
              </h3>
              <p className="text-center text-muted-foreground">
                {t(type.descriptionEs, type.descriptionEn)}
              </p>
            </Card>
          );
        })}
      </div>

      <Card className="p-6 bg-accent/20 border-accent">
        <p className="text-lg text-foreground">
          💡 <strong>{t("Consejo:", "Tip:")}</strong>{" "}
          {t(
            "Comienza con una Lección para enseñar conceptos nuevos, ¡luego crea Ejercicios para practicar!",
            "Start with a Lesson to teach new concepts, then create Exercises for practice!"
          )}
        </p>
      </Card>

      <div className="flex justify-end mt-8">
        <div className="text-right mr-4">
          <div className="bg-card p-4 rounded-2xl shadow-lg mb-2 border">
            <p className="text-xl font-medium text-foreground">
              {t("¡Vamos a crear algo divertido!", "Let's create something fun!")}
            </p>
          </div>
        </div>
        <CoquiMascot state="thinking" size="large" />
      </div>
    </div>
  );
}
