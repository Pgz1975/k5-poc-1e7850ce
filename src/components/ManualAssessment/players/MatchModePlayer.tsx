import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { DndContext, DragEndEvent, closestCenter, DragOverlay, DragStartEvent, useDroppable, useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { useLanguage } from '@/contexts/LanguageContext';

interface DragDropMatchContent {
  mode: 'match';
  question: string;
  questionImage?: string;
  draggableItems: Array<{
    id: string;
    type?: 'image' | 'text';
    label?: string;
    content: string | { type: 'image'; url: string };
    correctZone: string;
  }>;
  dropZones: Array<{
    id: string;
    label: string;
  }>;
  allowMultiplePerZone: boolean;
}

interface MatchModePlayerProps {
  content: DragDropMatchContent;
  onAnswer: (answer: string, isCorrect: boolean) => void;
  voiceClient?: any;
}

export function MatchModePlayer({ content, onAnswer, voiceClient }: MatchModePlayerProps) {
  const { t } = useLanguage();

  // State: map of itemId -> zoneId (or 'pool' for unplaced items)
  const [placements, setPlacements] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    content.draggableItems.forEach(item => {
      initial[item.id] = 'pool';
    });
    return initial;
  });

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

    const itemId = active.id as string;
    const targetZoneId = over.id as string;

    // If not allowing multiple per zone, check if zone already has an item
    if (!content.allowMultiplePerZone && targetZoneId !== 'pool') {
      const itemsInZone = Object.entries(placements).filter(([_, zone]) => zone === targetZoneId);
      if (itemsInZone.length > 0 && itemsInZone[0][0] !== itemId) {
        // Move existing item back to pool
        const existingItemId = itemsInZone[0][0];
        setPlacements(prev => ({
          ...prev,
          [existingItemId]: 'pool',
          [itemId]: targetZoneId,
        }));
        return;
      }
    }

    setPlacements(prev => ({
      ...prev,
      [itemId]: targetZoneId,
    }));
  };

  const handleCheck = () => {
    let correctCount = 0;
    let totalItems = content.draggableItems.length;

    content.draggableItems.forEach(item => {
      if (placements[item.id] === item.correctZone) {
        correctCount++;
      }
    });

    const correct = correctCount === totalItems;
    const score = Math.round((correctCount / totalItems) * 100);

    setIsChecked(true);
    setIsCorrect(correct);
    onAnswer(`${correctCount}/${totalItems}`, correct);

    if (voiceClient) {
      if (correct) {
        voiceClient.sendText(t("¡Perfecto! Todos los elementos están en la zona correcta.", "Perfect! All items are in the correct zone."));
      } else {
        voiceClient.sendText(t(`Tienes ${correctCount} de ${totalItems} correctos. Intenta de nuevo.`, `You have ${correctCount} of ${totalItems} correct. Try again.`));
      }
    }
  };

  const handleReset = () => {
    const resetPlacements: Record<string, string> = {};
    content.draggableItems.forEach(item => {
      resetPlacements[item.id] = 'pool';
    });
    setPlacements(resetPlacements);
    setIsChecked(false);
    setIsCorrect(false);
  };

  const getItemsInZone = (zoneId: string) => {
    return content.draggableItems.filter(item => placements[item.id] === zoneId);
  };

  const getItemsInPool = () => {
    return content.draggableItems.filter(item => placements[item.id] === 'pool');
  };

  const activeItem = content.draggableItems.find(item => item.id === activeId);

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

        {/* Drop Zones */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground mb-3">
            {t('Zonas de destino:', 'Drop zones:')}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {content.dropZones.map(zone => {
              const itemsInZone = getItemsInZone(zone.id);
              return (
                <DropZone
                  key={zone.id}
                  zone={zone}
                  items={itemsInZone}
                  isChecked={isChecked}
                />
              );
            })}
          </div>
        </div>

        {/* Item Pool */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground mb-3">
            {t('Elementos disponibles:', 'Available items:')}
          </p>
          <DropZone
            zone={{ id: 'pool', label: t('Elementos', 'Items') }}
            items={getItemsInPool()}
            isChecked={false}
            isPool
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-center mb-4">
          <Button
            onClick={handleCheck}
            disabled={getItemsInPool().length > 0 || isChecked}
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
                : t('Algunos incorrectos', 'Some incorrect')}
            </AlertTitle>
            {!isCorrect && (
              <AlertDescription>
                {t('Revisa los elementos marcados en rojo.', 'Check the items marked in red.')}
              </AlertDescription>
            )}
          </Alert>
        )}
      </Card>

      <DragOverlay>
        {activeItem && (
          <div className="p-2 rounded-lg border-2 border-primary bg-secondary shadow-lg">
            {activeItem.type === 'image' || (typeof activeItem.content !== 'string' && activeItem.content.type === 'image') ? (
              <img
                src={activeItem.type === 'image' ? activeItem.content as string : (activeItem.content as { type: 'image'; url: string }).url}
                alt={activeItem.label || 'Item'}
                className="h-32 w-32 sm:h-40 sm:w-40 object-cover rounded pointer-events-none select-none"
              />
            ) : (
              <span className="font-medium">
                {typeof activeItem.content === 'string' ? activeItem.content : activeItem.label}
              </span>
            )}
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}

interface DropZoneProps {
  zone: { id: string; label: string };
  items: Array<{
    id: string;
    type?: 'image' | 'text';
    label?: string;
    content: string | { type: 'image'; url: string };
    correctZone: string;
  }>;
  isChecked: boolean;
  isPool?: boolean;
}


function DropZone({ zone, items, isChecked, isPool }: DropZoneProps) {
  const { t } = useLanguage();
  const { setNodeRef, isOver } = useDroppable({ id: zone.id });

  return (
    <div
      ref={setNodeRef}
      className={`
        min-h-32 p-4 border-2 rounded-lg transition-colors
        ${isPool ? 'border-dashed bg-muted/20' : 'bg-card'}
        ${isOver ? 'border-primary bg-primary/10' : ''}
      `}
    >
      <h3 className="font-semibold mb-3 text-center">{zone.label}</h3>
      <div className={`${isPool ? 'grid grid-cols-2 gap-4 max-w-md mx-auto' : 'flex flex-wrap gap-2'} justify-center`}>
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground self-center col-span-2">
            {isPool ? '—' : t('(vacío)', '(empty)')}
          </p>
        ) : (
          items.map(item => (
            <DraggableItem
              key={item.id}
              item={item}
              isCorrect={isChecked ? zone.id === item.correctZone : undefined}
            />
          ))
        )}
      </div>
    </div>
  );
}

interface DraggableItemProps {
  item: {
    id: string;
    type?: 'image' | 'text';
    label?: string;
    content: string | { type: 'image'; url: string };
    correctZone: string;
  };
  isCorrect?: boolean;
  isDragging?: boolean;
}

function DraggableItem({ item, isCorrect, isDragging }: DraggableItemProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging: dragging } = useDraggable({
    id: item.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    cursor: dragging ? 'grabbing' : 'grab',
  };

  const borderColor = 
    isCorrect === true ? 'border-success' :
    isCorrect === false ? 'border-destructive' :
    'border-primary';

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`
        p-2 rounded-lg border transition-all
        ${borderColor}
        ${dragging || isDragging ? 'opacity-50 scale-105 shadow-lg' : 'hover:shadow-md'}
        ${isCorrect === true ? 'bg-success/10' : ''}
        ${isCorrect === false ? 'bg-destructive/10' : 'bg-secondary'}
      `}
    >
      {item.type === 'image' || (typeof item.content !== 'string' && item.content.type === 'image') ? (
        <img
          src={item.type === 'image' ? item.content as string : (item.content as { type: 'image'; url: string }).url}
          alt={item.label || 'Item'}
          className="h-32 w-32 sm:h-40 sm:w-40 object-cover rounded pointer-events-none select-none"
        />
      ) : (
        <span className="font-medium">
          {typeof item.content === 'string' ? item.content : item.label}
        </span>
      )}
    </div>
  );
}
