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

interface FillBlankContent {
  mode: 'single_word';
  prompt: string;
  target: string;
  letters: string[];
  imageUrl?: string;
  autoShuffle: boolean;
}

interface FillBlankEditorProps {
  content: FillBlankContent;
  onChange: (content: FillBlankContent) => void;
  language: 'es' | 'en';
}

export function FillBlankEditor({ content, onChange, language }: FillBlankEditorProps) {
  const { t } = useLanguage();
  const [newLetter, setNewLetter] = useState('');

  const isSpanish = language === 'es';

  const handlePromptChange = (prompt: string) => {
    onChange({ ...content, prompt });
  };

  const handleTargetChange = (target: string) => {
    // Only allow letters (including Spanish accents)
    const sanitized = target.replace(/[^a-zA-Záéíóúüñ]/gi, '');
    onChange({ ...content, target: sanitized });
  };

  const handleAutoGenerate = () => {
    if (!content.target) return;

    const targetLetters = [...content.target.toLowerCase()];
    const distractors = ['a', 'e', 'i', 'o', 'u', 'm', 'n', 's', 't', 'l', 'r'];
    
    // Add 2-3 random distractor letters that aren't already in target
    const availableDistractors = distractors.filter(d => !targetLetters.includes(d));
    const selectedDistractors = availableDistractors
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(3, Math.floor(targetLetters.length * 0.4)));

    const allLetters = [...targetLetters, ...selectedDistractors];
    
    onChange({ 
      ...content, 
      letters: allLetters
    });
  };

  const handleAddLetter = () => {
    if (!newLetter || newLetter.length !== 1) return;
    if (!/^[a-zA-Záéíóúüñ]$/i.test(newLetter)) return;
    
    if (!content.letters.includes(newLetter.toLowerCase())) {
      onChange({ 
        ...content, 
        letters: [...content.letters, newLetter.toLowerCase()] 
      });
    }
    setNewLetter('');
  };

  const handleRemoveLetter = (index: number) => {
    const newLetters = content.letters.filter((_, i) => i !== index);
    onChange({ ...content, letters: newLetters });
  };

  const validateLetters = () => {
    if (!content.target) return true;
    const targetChars = [...content.target.toLowerCase()];
    return targetChars.every(char => content.letters.includes(char.toLowerCase()));
  };

  const isValid = validateLetters();

  return (
    <div className="space-y-4">
      {/* Prompt */}
      <div>
        <Label htmlFor="prompt">
          {isSpanish ? 'Instrucción *' : 'Prompt *'}
        </Label>
        <Textarea
          id="prompt"
          value={content.prompt}
          onChange={(e) => handlePromptChange(e.target.value)}
          placeholder={isSpanish 
            ? 'Arrastra las letras para formar la palabra...' 
            : 'Drag the letters to form the word...'}
          maxLength={400}
          className="min-h-20"
        />
        <p className="text-sm text-muted-foreground mt-1">
          {content.prompt.length}/400
        </p>
      </div>

      {/* Target Word */}
      <div>
        <Label htmlFor="target">
          {isSpanish ? 'Palabra Objetivo *' : 'Target Word *'}
        </Label>
        <Input
          id="target"
          value={content.target}
          onChange={(e) => handleTargetChange(e.target.value)}
          placeholder={isSpanish ? 'coquí' : 'frog'}
          maxLength={20}
          className="text-lg"
        />
        <p className="text-sm text-muted-foreground mt-1">
          {isSpanish ? 'Solo letras (sin espacios ni números)' : 'Letters only (no spaces or numbers)'}
        </p>
      </div>

      {/* Letters Pool */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label>
            {isSpanish ? 'Conjunto de Letras *' : 'Letter Pool *'}
          </Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAutoGenerate}
            disabled={!content.target}
          >
            <Sparkles className="h-4 w-4 mr-2" />
            {isSpanish ? 'Auto-generar' : 'Auto-generate'}
          </Button>
        </div>

        {/* Display current letters */}
        <div className="flex flex-wrap gap-2 mb-3 p-3 border rounded-md min-h-16 bg-muted/30">
          {content.letters.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {isSpanish 
                ? 'No hay letras. Usa auto-generar o añade manualmente.' 
                : 'No letters yet. Use auto-generate or add manually.'}
            </p>
          ) : (
            content.letters.map((letter, index) => (
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
        {!isValid && content.target && content.letters.length > 0 && (
          <p className="text-sm text-destructive mt-2">
            {isSpanish 
              ? '⚠️ El conjunto de letras debe contener todas las letras de la palabra objetivo' 
              : '⚠️ Letter pool must contain all letters from the target word'}
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

      {/* Optional Image */}
      <div>
        <Label>
          {isSpanish ? 'Imagen (Opcional)' : 'Image (Optional)'}
        </Label>
        <ImagePasteZone
          onImageUploaded={(imageUrl) => onChange({ ...content, imageUrl })}
          currentImage={content.imageUrl}
        />
      </div>
    </div>
  );
}
