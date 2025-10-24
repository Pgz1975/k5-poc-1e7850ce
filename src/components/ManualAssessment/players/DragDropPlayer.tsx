import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { DndContext, DragEndEvent, closestCenter, DragOverlay, DragStartEvent } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useLanguage } from '@/contexts/LanguageContext';
import { MatchModePlayer } from './MatchModePlayer';

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

interface DragDropPlayerProps {
  content: DragDropContent;
  onAnswer: (answer: string, isCorrect: boolean) => void;
  voiceClient?: any;
}

interface LetterTileProps {
  letter: string;
  id: string;
  isInSlot?: boolean;
}

function LetterTile({ letter, id, isInSlot }: LetterTileProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        w-12 h-12 flex items-center justify-center text-2xl font-bold rounded-md
        cursor-grab active:cursor-grabbing select-none
        transition-colors
        ${isInSlot 
          ? 'bg-primary text-primary-foreground border-2 border-primary' 
          : 'bg-secondary text-secondary-foreground border-2 border-border hover:bg-secondary/80'
        }
      `}
    >
      {letter}
    </div>
  );
}

function EmptySlot({ id }: { id: string }) {
  const { setNodeRef, isOver } = useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`
        w-12 h-12 flex items-center justify-center rounded-md
        border-2 border-dashed transition-colors
        ${isOver 
          ? 'border-primary bg-primary/10' 
          : 'border-muted-foreground/30 bg-muted/20'
        }
      `}
    >
      <span className="text-muted-foreground">_</span>
    </div>
  );
}

function shuffle<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export function DragDropPlayer({ content, onAnswer, voiceClient }: DragDropPlayerProps) {
  const { t } = useLanguage();

  if (content.mode === 'match') {
    return <MatchModePlayer content={content} onAnswer={onAnswer} voiceClient={voiceClient} />;
  }

  return <LettersModePlayer content={content} onAnswer={onAnswer} voiceClient={voiceClient} />;
}

function LettersModePlayer({ content, onAnswer, voiceClient }: { content: DragDropLettersContent; onAnswer: any; voiceClient?: any }) {
  const { t } = useLanguage();
  
  const [pool, setPool] = useState<string[]>(() => 
    content.autoShuffle ? shuffle(content.availableLetters) : content.availableLetters
  );
  const [slots, setSlots] = useState<(string | null)[]>(
    Array(content.targetWord.length).fill(null)
  );
  const [isChecked, setIsChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Check if dragging from pool to slot
    if (activeId.startsWith('pool-') && overId.startsWith('slot-')) {
      const letterIndex = parseInt(activeId.replace('pool-', ''));
      const slotIndex = parseInt(overId.replace('slot-', ''));
      const letter = pool[letterIndex];

      // Remove from pool
      setPool(pool.filter((_, i) => i !== letterIndex));
      
      // Add to slot (replacing existing if any)
      const newSlots = [...slots];
      if (newSlots[slotIndex]) {
        // Return old letter to pool
        setPool(prev => [...prev, newSlots[slotIndex]!]);
      }
      newSlots[slotIndex] = letter;
      setSlots(newSlots);
    }
    // Check if dragging from slot to pool
    else if (activeId.startsWith('slot-') && overId === 'pool') {
      const slotIndex = parseInt(activeId.replace('slot-', ''));
      const letter = slots[slotIndex];

      if (letter) {
        // Remove from slot
        const newSlots = [...slots];
        newSlots[slotIndex] = null;
        setSlots(newSlots);

        // Add back to pool
        setPool([...pool, letter]);
      }
    }
    // Check if dragging between slots
    else if (activeId.startsWith('slot-') && overId.startsWith('slot-')) {
      const fromIndex = parseInt(activeId.replace('slot-', ''));
      const toIndex = parseInt(overId.replace('slot-', ''));

      const newSlots = [...slots];
      [newSlots[fromIndex], newSlots[toIndex]] = [newSlots[toIndex], newSlots[fromIndex]];
      setSlots(newSlots);
    }
  };

  const handleCheck = () => {
    const userAnswer = slots.join('').toLowerCase();
    const targetAnswer = content.targetWord.toLowerCase();
    const correct = userAnswer === targetAnswer;
    
    setIsChecked(true);
    setIsCorrect(correct);
    onAnswer(userAnswer, correct);

    if (voiceClient) {
      if (correct) {
        voiceClient.sendText(t("¡Correcto! Formaste la palabra perfectamente.", "Correct! You formed the word perfectly."));
      } else {
        voiceClient.sendText(t("Intenta de nuevo. Reorganiza las letras.", "Try again. Rearrange the letters."));
      }
    }
  };

  const handleReset = () => {
    // Return all letters to pool
    const allLetters = [...pool, ...slots.filter(s => s !== null)] as string[];
    setPool(content.autoShuffle ? shuffle(allLetters) : allLetters);
    setSlots(Array(content.targetWord.length).fill(null));
    setIsChecked(false);
    setIsCorrect(false);
  };

  const allPoolIds = pool.map((_, i) => `pool-${i}`);
  const allSlotIds = slots.map((_, i) => `slot-${i}`);
  const allIds = [...allPoolIds, ...allSlotIds, 'pool'];

  return (
    <DndContext 
      collisionDetection={closestCenter} 
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-4">{content.question}</h2>
        
        {content.questionImage && (
          <img 
            src={content.questionImage} 
            alt="Question" 
            className="max-h-64 mx-auto mb-6 rounded-lg border-2 object-contain" 
          />
        )}

        {/* Answer Slots */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground mb-3">
            {t('Arrastra las letras aquí:', 'Drag letters here:')}
          </p>
          <SortableContext items={allSlotIds} strategy={verticalListSortingStrategy}>
            <div className="flex gap-2 justify-center flex-wrap">
              {slots.map((letter, i) => (
                letter ? (
                  <LetterTile 
                    key={`slot-${i}`} 
                    id={`slot-${i}`} 
                    letter={letter} 
                    isInSlot 
                  />
                ) : (
                  <EmptySlot key={`slot-${i}`} id={`slot-${i}`} />
                )
              ))}
            </div>
          </SortableContext>
        </div>

        {/* Letter Pool */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground mb-3">
            {t('Letras disponibles:', 'Available letters:')}
          </p>
          <SortableContext items={allPoolIds} strategy={verticalListSortingStrategy}>
            <div 
              id="pool"
              className="flex flex-wrap gap-2 justify-center min-h-16 p-4 border-2 border-dashed rounded-lg bg-muted/20"
            >
              {pool.length === 0 ? (
                <p className="text-sm text-muted-foreground self-center">
                  {t('No quedan letras', 'No letters left')}
                </p>
              ) : (
                pool.map((letter, i) => (
                  <LetterTile key={`pool-${i}`} id={`pool-${i}`} letter={letter} />
                ))
              )}
            </div>
          </SortableContext>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-center mb-4">
          <Button 
            onClick={handleCheck} 
            disabled={slots.some(s => s === null) || isChecked}
            size="lg"
          >
            {isChecked 
              ? t('✓ Revisado', '✓ Checked') 
              : t('Verificar Respuesta', 'Check Answer')}
          </Button>
          {isChecked && (
            <Button onClick={handleReset} variant="outline" size="lg">
              {t('Intentar de Nuevo', 'Try Again')}
            </Button>
          )}
        </div>

        {/* Feedback */}
        {isChecked && (
          <Alert className={isCorrect ? 'bg-success/10 border-success' : 'bg-destructive/10 border-destructive'}>
            {isCorrect ? (
              <CheckCircle2 className="h-6 w-6 text-success" />
            ) : (
              <XCircle className="h-6 w-6 text-destructive" />
            )}
            <AlertTitle className="text-lg">
              {isCorrect 
                ? t('¡Correcto!', 'Correct!') 
                : t('Incorrecto', 'Incorrect')}
            </AlertTitle>
            {!isCorrect && (
              <AlertDescription>
                {t('La palabra correcta es:', 'The correct word is:')} <strong>{content.targetWord}</strong>
              </AlertDescription>
            )}
          </Alert>
        )}
      </Card>

      <DragOverlay>
        {activeId && activeId.startsWith('pool-') ? (
          <div className="w-12 h-12 flex items-center justify-center text-2xl font-bold rounded-md bg-primary text-primary-foreground border-2 border-primary opacity-80">
            {pool[parseInt(activeId.replace('pool-', ''))]}
          </div>
        ) : activeId && activeId.startsWith('slot-') ? (
          <div className="w-12 h-12 flex items-center justify-center text-2xl font-bold rounded-md bg-primary text-primary-foreground border-2 border-primary opacity-80">
            {slots[parseInt(activeId.replace('slot-', ''))]}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
