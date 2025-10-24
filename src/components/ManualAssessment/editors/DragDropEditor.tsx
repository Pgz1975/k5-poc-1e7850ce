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

interface DragDropMatchContent {
  mode: 'match';
  question: string;
  questionImage?: string;
  draggableItems: Array<{
    id: string;
    content: string | { type: 'image'; url: string };
    correctZone: string;
  }>;
  dropZones: Array<{
    id: string;
    label: string;
  }>;
  allowMultiplePerZone: boolean;
}

type DragDropContent = DragDropLettersContent | DragDropMatchContent;

interface DragDropEditorProps {
  content: DragDropContent;
  onChange: (content: DragDropContent) => void;
  language: 'es' | 'en';
}

export function DragDropEditor({ content, onChange, language }: DragDropEditorProps) {
  const { t } = useLanguage();
  const [newLetter, setNewLetter] = useState('');
  const [newItemText, setNewItemText] = useState('');

  const isSpanish = language === 'es';

  const handleModeChange = (mode: 'letters' | 'match') => {
    if (mode === 'letters') {
      onChange({
        mode: 'letters',
        question: content.question,
        questionImage: content.questionImage,
        targetWord: '',
        availableLetters: [],
        autoShuffle: true,
      });
    } else {
      onChange({
        mode: 'match',
        question: content.question,
        questionImage: content.questionImage,
        draggableItems: [],
        dropZones: [],
        allowMultiplePerZone: false,
      });
    }
  };

  const handleQuestionChange = (question: string) => {
    onChange({ ...content, question });
  };

  const handleTargetChange = (target: string) => {
    if (content.mode !== 'letters') return;
    // Only allow letters (including Spanish accents)
    const sanitized = target.replace(/[^a-zA-Záéíóúüñ]/gi, '');
    onChange({ ...content, targetWord: sanitized });
  };

  const handleAutoGenerate = () => {
    if (content.mode !== 'letters' || !content.targetWord) return;

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
    if (content.mode !== 'letters') return;
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
    if (content.mode !== 'letters') return;
    const newLetters = content.availableLetters.filter((_, i) => i !== index);
    onChange({ ...content, availableLetters: newLetters });
  };

  const validateLetters = () => {
    if (content.mode !== 'letters' || !content.targetWord) return true;
    const targetChars = [...content.targetWord.toLowerCase()];
    return targetChars.every(char => content.availableLetters.includes(char.toLowerCase()));
  };

  const isValid = validateLetters();

  // Match Mode Handlers
  const handleAddZone = () => {
    if (content.mode !== 'match') return;
    const newZone = {
      id: `zone-${Date.now()}`,
      label: '',
    };
    onChange({
      ...content,
      dropZones: [...content.dropZones, newZone],
    });
  };

  const handleUpdateZone = (index: number, label: string) => {
    if (content.mode !== 'match') return;
    const newZones = [...content.dropZones];
    newZones[index] = { ...newZones[index], label };
    onChange({ ...content, dropZones: newZones });
  };

  const handleRemoveZone = (index: number) => {
    if (content.mode !== 'match') return;
    const zoneId = content.dropZones[index].id;
    onChange({
      ...content,
      dropZones: content.dropZones.filter((_, i) => i !== index),
      draggableItems: content.draggableItems.map(item => 
        item.correctZone === zoneId ? { ...item, correctZone: '' } : item
      ),
    });
  };

  const handleAddItem = (type: 'text' | 'image', value: string) => {
    if (content.mode !== 'match') return;
    const newItem = {
      id: `item-${Date.now()}`,
      content: type === 'text' ? value : { type: 'image' as const, url: value },
      correctZone: content.dropZones[0]?.id || '',
    };
    onChange({
      ...content,
      draggableItems: [...content.draggableItems, newItem],
    });
    setNewItemText('');
  };

  const handleUpdateItemZone = (index: number, zoneId: string) => {
    if (content.mode !== 'match') return;
    const newItems = [...content.draggableItems];
    newItems[index] = { ...newItems[index], correctZone: zoneId };
    onChange({ ...content, draggableItems: newItems });
  };

  const handleRemoveItem = (index: number) => {
    if (content.mode !== 'match') return;
    onChange({
      ...content,
      draggableItems: content.draggableItems.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-4">
      {/* Mode Selection */}
      <div className="space-y-2">
        <Label>{t('Modo de Ejercicio', 'Exercise Mode')}</Label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer p-3 border-2 rounded-md transition-colors hover:bg-accent/50" style={{ borderColor: content.mode === 'letters' ? 'hsl(var(--primary))' : 'hsl(var(--border))' }}>
            <input
              type="radio"
              name="dragDropMode"
              value="letters"
              checked={content.mode === 'letters'}
              onChange={() => handleModeChange('letters')}
              className="w-4 h-4 accent-primary cursor-pointer"
            />
            <span className="font-medium">{t('Letras (Formar Palabra)', 'Letters (Form Word)')}</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer p-3 border-2 rounded-md transition-colors hover:bg-accent/50" style={{ borderColor: content.mode === 'match' ? 'hsl(var(--primary))' : 'hsl(var(--border))' }}>
            <input
              type="radio"
              name="dragDropMode"
              value="match"
              checked={content.mode === 'match'}
              onChange={() => handleModeChange('match')}
              className="w-4 h-4 accent-primary cursor-pointer"
            />
            <span className="font-medium">{t('Emparejar (Arrastrar a Zonas)', 'Match (Drag to Zones)')}</span>
          </label>
        </div>
      </div>
      {/* Question */}
      <div>
        <Label htmlFor="question">
          {t('Pregunta *', 'Question *')}
        </Label>
        <Textarea
          id="question"
          value={content.question}
          onChange={(e) => handleQuestionChange(e.target.value)}
          placeholder={t(
            'Forma la palabra para esta imagen:', 
            'Form the word for this image:')}
          className="min-h-20"
        />
        <p className="text-sm text-muted-foreground mt-1">
          {content.question.length}/500
        </p>
      </div>

      {/* Optional Image */}
      <div>
        <Label>
          {t('Imagen (Opcional)', 'Image (Optional)')}
        </Label>
        <ImagePasteZone
          onImageUploaded={(imageUrl) => onChange({ ...content, questionImage: imageUrl })}
          currentImage={content.questionImage}
        />
      </div>

      {/* Letters Mode Content */}
      {content.mode === 'letters' && (
        <>
          {/* Target Word */}
          <div>
            <Label htmlFor="targetWord">
              {t('Palabra Objetivo *', 'Target Word *')}
            </Label>
            <Input
              id="targetWord"
              value={content.targetWord}
              onChange={(e) => handleTargetChange(e.target.value)}
              placeholder={t('mesa', 'table')}
              maxLength={20}
              className="text-lg"
            />
            <p className="text-sm text-muted-foreground mt-1">
              {t('Solo letras (sin espacios ni números)', 'Letters only (no spaces or numbers)')}
            </p>
          </div>

          {/* Available Letters Pool */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>
                {t('Letras Disponibles *', 'Available Letters *')}
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAutoGenerate}
                disabled={!content.targetWord}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                {t('Auto-generar', 'Auto-generate')}
              </Button>
            </div>

            {/* Display current letters */}
            <div className="flex flex-wrap gap-2 mb-3 p-3 border rounded-md min-h-16 bg-muted/30">
              {content.availableLetters.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  {t(
                    'No hay letras. Usa auto-generar o añade manualmente.', 
                    'No letters yet. Use auto-generate or add manually.')}
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
                placeholder={t('Añadir letra', 'Add letter')}
                maxLength={1}
                className="w-20 text-center text-lg"
              />
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleAddLetter}
                disabled={!newLetter || newLetter.length !== 1}
              >
                {t('Añadir', 'Add')}
              </Button>
            </div>

            {/* Validation message */}
            {!isValid && content.targetWord && content.availableLetters.length > 0 && (
              <p className="text-sm text-destructive mt-2">
                {t(
                  '⚠️ Las letras disponibles deben contener todas las letras de la palabra objetivo', 
                  '⚠️ Available letters must contain all letters from the target word')}
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
              {t(
                'Mezclar letras automáticamente al cargar', 
                'Shuffle letters automatically on load')}
            </Label>
          </div>
        </>
      )}

      {/* Match Mode Content */}
      {content.mode === 'match' && (
        <>
          {/* Drop Zones */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>{t('Zonas de Destino *', 'Drop Zones *')}</Label>
              <Button type="button" variant="outline" size="sm" onClick={handleAddZone}>
                {t('+ Añadir Zona', '+ Add Zone')}
              </Button>
            </div>
            <div className="space-y-2">
              {content.dropZones.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  {t('No hay zonas. Añade al menos 2 zonas.', 'No zones. Add at least 2 zones.')}
                </p>
              ) : (
                content.dropZones.map((zone, i) => (
                  <div key={zone.id} className="flex gap-2">
                    <Input
                      value={zone.label}
                      onChange={(e) => handleUpdateZone(i, e.target.value)}
                      placeholder={t(`Zona ${i + 1} (ej: Bosque)`, `Zone ${i + 1} (e.g., Forest)`)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveZone(i)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Draggable Items */}
          <div>
            <Label className="mb-2 block">{t('Elementos Arrastrables *', 'Draggable Items *')}</Label>
            <div className="space-y-3">
              {content.draggableItems.map((item, i) => (
                <div key={item.id} className="flex gap-2 items-start p-3 border rounded-md">
                  <div className="flex-1 space-y-2">
                    {typeof item.content === 'string' ? (
                      <div className="font-medium">{item.content}</div>
                    ) : (
                      <img src={item.content.url} alt="Item" className="h-20 w-20 object-cover rounded" />
                    )}
                    <div>
                      <Label className="text-xs">{t('Zona Correcta:', 'Correct Zone:')}</Label>
                      <select
                        value={item.correctZone}
                        onChange={(e) => handleUpdateItemZone(i, e.target.value)}
                        className="w-full mt-1 p-2 border rounded bg-background"
                      >
                        <option value="">{t('Seleccionar...', 'Select...')}</option>
                        {content.dropZones.map(zone => (
                          <option key={zone.id} value={zone.id}>{zone.label || zone.id}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveItem(i)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Add New Item */}
            <div className="mt-3 space-y-2 p-3 border rounded-md bg-muted/30">
              <Label className="text-sm font-semibold">{t('Añadir Elemento', 'Add Item')}</Label>
              <div className="flex gap-2">
                <Input
                  value={newItemText}
                  onChange={(e) => setNewItemText(e.target.value)}
                  placeholder={t('Texto del elemento...', 'Item text...')}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleAddItem('text', newItemText)}
                  disabled={!newItemText.trim() || content.dropZones.length === 0}
                >
                  {t('+ Texto', '+ Text')}
                </Button>
              </div>
              <div>
                <Label className="text-xs">{t('O añadir imagen:', 'Or add image:')}</Label>
                <ImagePasteZone
                  onImageUploaded={(url) => handleAddItem('image', url)}
                  currentImage={undefined}
                />
              </div>
            </div>
          </div>

          {/* Allow Multiple Per Zone */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="allowMultiple"
              checked={content.allowMultiplePerZone}
              onCheckedChange={(checked) =>
                onChange({ ...content, allowMultiplePerZone: checked as boolean })
              }
            />
            <Label htmlFor="allowMultiple" className="cursor-pointer">
              {t(
                'Permitir múltiples elementos por zona',
                'Allow multiple items per zone')}
            </Label>
          </div>
        </>
      )}
    </div>
  );
}
