import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ArrowLeft, ListChecks, HelpCircle, PenLine, Move, type LucideIcon } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface SubtypeSelectorProps {
  type: 'lesson' | 'exercise' | 'assessment';
  onSelect: (subtype: string) => void;
  onBack: () => void;
}

export function SubtypeSelector({ type, onSelect, onBack }: SubtypeSelectorProps) {
  const { t } = useLanguage();

  // For lessons, auto-select 'lesson' subtype since there's only one option
  if (type === 'lesson') {
    onSelect('lesson');
    return null;
  }

  const subtypes: Array<{
    id: string;
    icon: LucideIcon;
    titleEs: string;
    titleEn: string;
    descriptionEs: string;
    descriptionEn: string;
  }> = [
    {
      id: 'multiple_choice',
      icon: ListChecks,
      titleEs: 'Opción Múltiple',
      titleEn: 'Multiple Choice',
      descriptionEs: 'Seleccionar la respuesta correcta',
      descriptionEn: 'Select the correct answer'
    },
    {
      id: 'true_false',
      icon: CheckCircle2,
      titleEs: 'Verdadero/Falso',
      titleEn: 'True/False',
      descriptionEs: 'Responder verdadero o falso',
      descriptionEn: 'Answer true or false'
    },
    {
      id: 'fill_blank',
      icon: HelpCircle,
      titleEs: 'Completar Espacios',
      titleEn: 'Fill in the Blank',
      descriptionEs: 'Arrastrar letras para formar palabras',
      descriptionEn: 'Drag letters to form words'
    },
    {
      id: 'write_answer',
      icon: PenLine,
      titleEs: 'Escribir Respuesta',
      titleEn: 'Write Answer',
      descriptionEs: 'Escribir la palabra correcta',
      descriptionEn: 'Write the correct word'
    },
    {
      id: 'drag_drop',
      icon: Move,
      titleEs: 'Arrastrar y Soltar',
      titleEn: 'Drag and Drop',
      descriptionEs: 'Arrastrar elementos para responder',
      descriptionEn: 'Drag elements to answer'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <Button onClick={onBack} variant="ghost" className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        {t("Atrás", "Back")}
      </Button>

      <h1 className="text-4xl font-bold text-center mb-8 text-foreground">
        {t("¿Qué tipo de", "What kind of")} {type} {t("quieres?", "do you want?")}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {subtypes.map(subtype => {
          const Icon = subtype.icon;
          return (
            <Card
              key={subtype.id}
              className="p-8 cursor-pointer hover:shadow-xl transition-all hover:scale-105 bg-card"
              onClick={() => onSelect(subtype.id)}
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-center mb-2 text-foreground">
                {t(subtype.titleEs, subtype.titleEn)}
              </h3>
              <p className="text-center text-sm text-muted-foreground">
                {t(subtype.descriptionEs, subtype.descriptionEn)}
              </p>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
