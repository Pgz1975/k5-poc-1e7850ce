import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Sparkles } from "lucide-react";

interface GenerateControlsProps {
  selectedCount: number;
  onGenerate: (type: string, options: GenerateOptions) => void;
  isGenerating: boolean;
}

interface GenerateOptions {
  gradeLevel: number;
  language: string;
}

export function GenerateControls({ selectedCount, onGenerate, isGenerating }: GenerateControlsProps) {
  const { t, language } = useLanguage();
  const [type, setType] = useState('reading_exercise');
  const [gradeLevel, setGradeLevel] = useState(1);

  const assessmentTypes = [
    { value: 'reading_exercise', label: t('Ejercicio de Lectura', 'Reading Exercise') },
    { value: 'quiz', label: t('Cuestionario', 'Quiz') },
    { value: 'vocabulary_cards', label: t('Tarjetas de Vocabulario', 'Vocabulary Cards') },
    { value: 'picture_match', label: t('Emparejar Imágenes', 'Picture Match') }
  ];

  const gradeLevels = [
    { value: 0, label: t('Kínder', 'Kindergarten') },
    { value: 1, label: t('1er Grado', 'Grade 1') },
    { value: 2, label: t('2do Grado', 'Grade 2') },
    { value: 3, label: t('3er Grado', 'Grade 3') },
    { value: 4, label: t('4to Grado', 'Grade 4') },
    { value: 5, label: t('5to Grado', 'Grade 5') }
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="text-lg font-medium">
          <span className="text-2xl font-bold text-primary">{selectedCount}</span>{' '}
          {t('elementos seleccionados', 'items selected')}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            {t('Tipo de Evaluación:', 'Assessment Type:')}
          </label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {assessmentTypes.map((at) => (
                <SelectItem key={at.value} value={at.value}>
                  {at.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            {t('Nivel de Grado:', 'Grade Level:')}
          </label>
          <Select value={String(gradeLevel)} onValueChange={(v) => setGradeLevel(Number(v))}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {gradeLevels.map((gl) => (
                <SelectItem key={gl.value} value={String(gl.value)}>
                  {gl.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button
        disabled={selectedCount === 0 || isGenerating}
        onClick={() => onGenerate(type, { gradeLevel, language })}
        className="w-full py-6 text-lg font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600"
        size="lg"
      >
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            {t('Generando...', 'Generating...')}
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-5 w-5" />
            {t('🎨 Generar Evaluación', '🎨 Generate Assessment')}
          </>
        )}
      </Button>
    </div>
  );
}
