import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { DndContext, DragEndEvent, closestCenter, DragOverlay, DragStartEvent, useDroppable } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface FillBlankContent {
  mode: 'single_word';
  prompt: string;
  target: string;
  letters: string[];
  imageUrl?: string;
  autoShuffle: boolean;
}

interface FillBlankPlayerProps {
  content: FillBlankContent;
  onAnswer: (answer: string, isCorrect: boolean) => void;
  voiceClient?: any;
  colorScheme?: any;
}

// Stable token for each letter instance
interface TokenLetter {
  id: string;
  char: string;
}

interface LetterTileProps {
  letter: string;
  id: string;
  isInSlot?: boolean;
  colorScheme?: any;
}

function LetterTile({ letter, id, isInSlot, colorScheme }: LetterTileProps) {
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
      className={cn(
        "w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-xl sm:text-2xl font-bold rounded-xl",
        "cursor-grab active:cursor-grabbing select-none transition-all touch-none",
        "border-3 shadow-[0_3px_0_rgba(0,0,0,0.08)]",
        "hover:shadow-[0_4px_0_rgba(0,0,0,0.1)] hover:-translate-y-0.5",
        "active:shadow-[0_1px_0_rgba(0,0,0,0.08)] active:translate-y-1",
        isInSlot 
          ? cn(colorScheme?.bg, colorScheme?.border, "text-white")
          : cn(colorScheme?.border, "bg-white", colorScheme?.text, "hover:bg-gray-50")
      )}
      role="button"
      tabIndex={0}
      aria-label={`${letter}`}
      aria-grabbed={isDragging}
    >
      {letter}
    </div>
  );
}

function EmptySlot({ id, colorScheme }: { id: string; colorScheme?: any }) {
  const { setNodeRef, isOver } = useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-xl",
        "border-3 border-dashed transition-colors",
        isOver 
          ? cn(colorScheme?.border, colorScheme?.bg, "opacity-20")
          : cn(colorScheme?.border, "bg-white/50", "opacity-40")
      )}
      role="button"
      aria-label="Empty slot"
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

export function FillBlankPlayer({ content, onAnswer, voiceClient, colorScheme }: FillBlankPlayerProps) {
  const { t } = useLanguage();
  
  const tokenIdCounter = useRef(0);
  const createTokenLetter = (char: string): TokenLetter => ({ id: `token-${tokenIdCounter.current++}`, char });

  // Make pool container droppable
  const { setNodeRef: setPoolRef, isOver: isPoolOver } = useDroppable({ id: 'pool' });
  
  const [pool, setPool] = useState<TokenLetter[]>(() => {
    const tokens = content.letters.map(createTokenLetter);
    return content.autoShuffle ? shuffle(tokens) : tokens;
  });
  const [slots, setSlots] = useState<(TokenLetter | null)[]>(
    Array(content.target.length).fill(null)
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

    // Pool → Slot
    if (activeId.startsWith('pool-') && overId.startsWith('slot-')) {
      const tokenId = activeId.replace('pool-', '');
      const slotIndex = parseInt(overId.replace('slot-', ''));

      const draggedToken = pool.find(t => t.id === tokenId);
      if (!draggedToken) return;

      const newSlots = [...slots];
      const replacedToken = newSlots[slotIndex];

      newSlots[slotIndex] = draggedToken;
      setSlots(newSlots);

      const newPool = pool.filter(t => t.id !== tokenId);
      if (replacedToken) newPool.push(replacedToken);
      setPool(newPool);
    }
    // Slot → Pool (drop on pool container or any pool item)
    else if (activeId.startsWith('slot-') && (overId === 'pool' || overId.startsWith('pool-'))) {
      const slotIndex = parseInt(activeId.replace('slot-', ''));
      const slotToken = slots[slotIndex];

      if (slotToken) {
        const newSlots = [...slots];
        newSlots[slotIndex] = null;
        setSlots(newSlots);
        setPool([...pool, slotToken]);
      }
    }
    // Slot ↔ Slot swap
    else if (activeId.startsWith('slot-') && overId.startsWith('slot-')) {
      const fromIndex = parseInt(activeId.replace('slot-', ''));
      const toIndex = parseInt(overId.replace('slot-', ''));

      const newSlots = [...slots];
      [newSlots[fromIndex], newSlots[toIndex]] = [newSlots[toIndex], newSlots[fromIndex]];
      setSlots(newSlots);
    }
  };

const handleCheck = () => {
  const userAnswer = slots.map(t => t?.char || '').join('').toLowerCase();
  const targetAnswer = content.target.toLowerCase();
  const correct = userAnswer === targetAnswer;
  
  setIsChecked(true);
  setIsCorrect(correct);
  onAnswer(userAnswer, correct);

  if (correct) {
    voiceClient?.sendText(t("¡Correcto! Excelente trabajo.", "Correct! Excellent work."));
  } else {
    voiceClient?.sendText(t("Intenta de nuevo. ¡Tú puedes!", "Try again. You can do it!"));
  }
};

const handleReset = () => {
  const allTokens = [...pool, ...slots.filter(s => s !== null)] as TokenLetter[];
  setPool(content.autoShuffle ? shuffle(allTokens) : allTokens);
  setSlots(Array(content.target.length).fill(null));
  setIsChecked(false);
  setIsCorrect(false);
};

const allPoolIds = pool.map((t) => `pool-${t.id}`);
const allSlotIds = slots.map((_, i) => `slot-${i}`);
const allIds = [...allPoolIds, ...allSlotIds, 'pool'];

  return (
    <DndContext 
      collisionDetection={closestCenter} 
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <Card className={cn(
        "p-4 sm:p-6 border-4 rounded-2xl",
        colorScheme?.border,
        "bg-white shadow-[0_4px_0_rgba(0,0,0,0.08)]"
      )}>
        {/* Answer Slots */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground mb-3" id="slots-instruction">
            {t('Arrastra las letras aquí:', 'Drag letters here:')}
          </p>
          <SortableContext items={allSlotIds} strategy={verticalListSortingStrategy}>
            <div 
              className="flex gap-1.5 sm:gap-2 justify-center flex-wrap"
              role="region"
              aria-labelledby="slots-instruction"
            >
{slots.map((token, i) => (
  token ? (
    <LetterTile 
      key={`slot-${i}-${token.id}`} 
      id={`slot-${i}`} 
      letter={token.char} 
      isInSlot
      colorScheme={colorScheme}
    />
  ) : (
    <EmptySlot key={`slot-${i}`} id={`slot-${i}`} colorScheme={colorScheme} />
  )
))}
            </div>
          </SortableContext>
        </div>

        {/* Letter Pool */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground mb-3" id="pool-instruction">
            {t('Letras disponibles:', 'Available letters:')}
          </p>
<SortableContext items={allPoolIds} strategy={verticalListSortingStrategy}>
  <div 
    ref={setPoolRef}
    id="pool"
    className={`flex flex-wrap gap-1.5 sm:gap-2 justify-center min-h-14 sm:min-h-16 p-3 sm:p-4 border-2 border-dashed rounded-lg transition-colors ${
      isPoolOver ? 'bg-primary/10 border-primary' : 'bg-muted/20'
    }`}
    role="region"
    aria-labelledby="pool-instruction"
  >
              {pool.length === 0 ? (
                <p className="text-sm text-muted-foreground self-center">
                  {t('No quedan letras', 'No letters left')}
                </p>
              ) : (
                pool.map((token) => (
                  <LetterTile key={`pool-${token.id}`} id={`pool-${token.id}`} letter={token.char} colorScheme={colorScheme} />
                ))
              )}
            </div>
          </SortableContext>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-4">
          <Button 
            onClick={handleCheck} 
            disabled={slots.some(s => s === null) || isChecked}
            size="lg"
            className={cn(
              "w-full sm:w-auto border-4 rounded-2xl font-black",
              colorScheme?.bg,
              colorScheme?.border,
              colorScheme?.shadow,
              "text-white hover:-translate-y-0.5 active:translate-y-1",
              "transition-all duration-200"
            )}
          >
            {isChecked 
              ? t('✓ Revisado', '✓ Checked') 
              : t('Verificar Respuesta', 'Check Answer')}
          </Button>
          {isChecked && (
            <Button onClick={handleReset} variant="outline" size="lg" className="w-full sm:w-auto">
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
                {t('La palabra correcta es:', 'The correct word is:')} <strong>{content.target}</strong>
              </AlertDescription>
            )}
          </Alert>
        )}
      </Card>

<DragOverlay>
  {activeId && activeId.startsWith('pool-') ? (
    <div className={cn(
      "w-12 h-12 flex items-center justify-center text-2xl font-bold rounded-xl border-3 opacity-80",
      colorScheme?.bg,
      colorScheme?.border,
      "text-white shadow-lg"
    )}>
      {pool.find(t => t.id === activeId.replace('pool-', ''))?.char}
    </div>
  ) : activeId && activeId.startsWith('slot-') ? (
    <div className={cn(
      "w-12 h-12 flex items-center justify-center text-2xl font-bold rounded-xl border-3 opacity-80",
      colorScheme?.bg,
      colorScheme?.border,
      "text-white shadow-lg"
    )}>
      {slots[parseInt(activeId.replace('slot-', ''))]?.char}
    </div>
  ) : null}
</DragOverlay>
    </DndContext>
  );
}
