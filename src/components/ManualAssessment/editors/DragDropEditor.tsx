import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { X, Sparkles } from 'lucide-react';
import { ImagePasteZone } from '../ImagePasteZone';
import { useLanguage } from '@/contexts/LanguageContext';

interface DragDropLettersContent {
  mode: 'letters';
  question: string;
  questionImage?: string;
  targetWord: string;
  availableLetters: string[];
  autoShuffle: boolean;
}

interface DragDropEditorProps {
  content: DragDropLettersContent;
  onChange: (content: DragDropLettersContent) => void;
  language: 'es' | 'en';
}

export function DragDropEditor({ content, onChange, language }: DragDropEditorProps) {
  const { t } = useLanguage();
  const [newLetter, setNewLetter] = useState('');

  const isSpanish = language === 'es';

  const handleQuestionChange = (question: string) => {
    onChange({ ...content, question });
  };

  const handleTargetChange = (target: string) => {
    // Only allow letters (including Spanish accents)
    const sanitized = target.replace(/[^a-zA-Záéíóúüñ]/gi, '');
    onChange({ ...content, targetWord: sanitized });
  };

  const handleAutoGenerate = () => {
    if (!content.targetWord) return;

    const targetLetters = [...content.targetWord.toLowerCase()];
    const distractors = ['a', 'e', 'i', 'o', 'u', 'm', 'n', 's', 't', 'l', 'r', 'p', 'd', 'b', 'c'];
    
    // Add 3-4 random distractor letters that aren't already in target
    const availableDistractors = distractors.filter(d => !targetLetters.includes(d));
    const selectedDistractors = availableDistractors
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(4, Math.floor(targetLetters.length * 0.5)));

    const allLetters = [...targetLetters, ...selectedDistractors];
    
    onChange({ 
      ...content, 
      availableLetters: allLetters
    });
  };

  const handleAddLetter = () => {
    if (!newLetter || newLetter.length !== 1) return;
    if (!/^[a-zA-Záéíóúüñ]$/i.test(newLetter)) return;
    
    if (!content.availableLetters.includes(newLetter.toLowerCase())) {
      onChange({ 
        ...content, 
        availableLetters: [...content.availableLetters, newLetter.toLowerCase()] 
      });
    }
    setNewLetter('');
  };

  const handleRemoveLetter = (index: number) => {
    const newLetters = content.availableLetters.filter((_, i) => i !== index);
    onChange({ ...content, availableLetters: newLetters });
  };

  const validateLetters = () => {
    if (!content.targetWord) return true;
    const targetChars = [...content.targetWord.toLowerCase()];
    return targetChars.every(char => content.availableLetters.includes(char.toLowerCase()));
  };

  const isValid = validateLetters();

  return (
    <div className="space-y-4">
      {/* Question */}
      <div>
        <Label htmlFor="question">
          {isSpanish ? 'Pregunta *' : 'Question *'}
        </Label>
        <Textarea
          id="question"
          value={content.question}
          onChange={(e) => handleQuestionChange(e.target.value)}
          placeholder={isSpanish 
            ? 'Forma la palabra para esta imagen:' 
            : 'Form the word for this image:'}
          className="min-h-20"
        />
        <p className="text-sm text-muted-foreground mt-1">
          {content.question.length}/500
        </p>
      </div>

      {/* Optional Image */}
      <div>
        <Label>
          {isSpanish ? 'Imagen (Opcional)' : 'Image (Optional)'}
        </Label>
        <ImagePasteZone
          onImageUploaded={(imageUrl) => onChange({ ...content, questionImage: imageUrl })}
          currentImage={content.questionImage}
        />
      </div>

      {/* Target Word */}
      <div>
        <Label htmlFor="targetWord">
          {isSpanish ? 'Palabra Objetivo *' : 'Target Word *'}
        </Label>
        <Input
          id="targetWord"
          value={content.targetWord}
          onChange={(e) => handleTargetChange(e.target.value)}
          placeholder={isSpanish ? 'mesa' : 'table'}
          maxLength={20}
          className="text-lg"
        />
        <p className="text-sm text-muted-foreground mt-1">
          {isSpanish ? 'Solo letras (sin espacios ni números)' : 'Letters only (no spaces or numbers)'}
        </p>
      </div>

      {/* Available Letters Pool */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label>
            {isSpanish ? 'Letras Disponibles *' : 'Available Letters *'}
          </Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAutoGenerate}
            disabled={!content.targetWord}
          >
            <Sparkles className="h-4 w-4 mr-2" />
            {isSpanish ? 'Auto-generar' : 'Auto-generate'}
          </Button>
        </div>

        {/* Display current letters */}
        <div className="flex flex-wrap gap-2 mb-3 p-3 border rounded-md min-h-16 bg-muted/30">
          {content.availableLetters.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {isSpanish 
                ? 'No hay letras. Usa auto-generar o añade manualmente.' 
                : 'No letters yet. Use auto-generate or add manually.'}
            </p>
          ) : (
            content.availableLetters.map((letter, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="text-lg px-3 py-1 cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
                onClick={() => handleRemoveLetter(index)}
              >
                {letter}
                <X className="h-3 w-3 ml-1" />
              </Badge>
            ))
          )}
        </div>

        {/* Add letter manually */}
        <div className="flex gap-2">
          <Input
            value={newLetter}
            onChange={(e) => setNewLetter(e.target.value.slice(0, 1))}
            onKeyDown={(e) => e.key === 'Enter' && handleAddLetter()}
            placeholder={isSpanish ? 'Añadir letra' : 'Add letter'}
            maxLength={1}
            className="w-20 text-center text-lg"
          />
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleAddLetter}
            disabled={!newLetter || newLetter.length !== 1}
          >
            {isSpanish ? 'Añadir' : 'Add'}
          </Button>
        </div>

        {/* Validation message */}
        {!isValid && content.targetWord && content.availableLetters.length > 0 && (
          <p className="text-sm text-destructive mt-2">
            {isSpanish 
              ? '⚠️ Las letras disponibles deben contener todas las letras de la palabra objetivo' 
              : '⚠️ Available letters must contain all letters from the target word'}
          </p>
        )}
      </div>

      {/* Auto-Shuffle */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="autoShuffle"
          checked={content.autoShuffle}
          onCheckedChange={(checked) => 
            onChange({ ...content, autoShuffle: checked as boolean })
          }
        />
        <Label htmlFor="autoShuffle" className="cursor-pointer">
          {isSpanish 
            ? 'Mezclar letras automáticamente al cargar' 
            : 'Shuffle letters automatically on load'}
        </Label>
      </div>
    </div>
  );
}
