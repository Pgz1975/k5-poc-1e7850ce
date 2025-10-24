import { useState, useMemo } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { DraggableLessonItem } from './DraggableLessonItem';
import { LessonWithOrder, DomainGroup } from '@/types/lessonOrdering';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface LessonOrderingListProps {
  lessons: LessonWithOrder[];
  onReorder: (reorderedLessons: LessonWithOrder[]) => void;
}

export const LessonOrderingList = ({ lessons, onReorder }: LessonOrderingListProps) => {
  const [expandedLessons, setExpandedLessons] = useState<Set<string>>(new Set());

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Group lessons by domain and separate parent lessons from exercises
  const { domainGroups, parentLessons } = useMemo(() => {
    const parents = lessons.filter(l => !l.parent_lesson_id);
    const groups: { [key: string]: DomainGroup } = {};

    parents.forEach(lesson => {
      const domain = lesson.domain_name || 'Ungrouped';
      if (!groups[domain]) {
        groups[domain] = {
          domain_name: domain,
          domain_order: lesson.domain_order || 999,
          lessons: [],
        };
      }
      groups[domain].lessons.push(lesson);
    });

    const sortedGroups = Object.values(groups).sort((a, b) => 
      a.domain_order - b.domain_order
    );

    return { domainGroups: sortedGroups, parentLessons: parents };
  }, [lessons]);

  const getChildExercises = (parentId: string) => {
    return lessons
      .filter(l => l.parent_lesson_id === parentId)
      .sort((a, b) => (a.order_in_lesson || 0) - (b.order_in_lesson || 0));
  };

  const toggleExpanded = (lessonId: string) => {
    setExpandedLessons(prev => {
      const next = new Set(prev);
      if (next.has(lessonId)) {
        next.delete(lessonId);
      } else {
        next.add(lessonId);
      }
      return next;
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = parentLessons.findIndex(l => l.id === active.id);
    const newIndex = parentLessons.findIndex(l => l.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      const reordered = arrayMove(parentLessons, oldIndex, newIndex);
      
      // Update display_order for all reordered lessons
      const updatedLessons = reordered.map((lesson, index) => ({
        ...lesson,
        display_order: index,
      }));

      // Merge back with child exercises
      const allLessons = [
        ...updatedLessons,
        ...lessons.filter(l => l.parent_lesson_id),
      ];

      onReorder(allLessons);
    }
  };

  if (lessons.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No lessons found for this grade level
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {domainGroups.map((domain) => (
        <div key={domain.domain_name}>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <span className="text-primary">Dominio {domain.domain_order}:</span>
            {domain.domain_name}
          </h3>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={domain.lessons.map(l => l.id)}
              strategy={verticalListSortingStrategy}
            >
              {domain.lessons.map((lesson) => {
                const children = getChildExercises(lesson.id);
                const isExpanded = expandedLessons.has(lesson.id);

                return (
                  <div key={lesson.id}>
                    <DraggableLessonItem
                      lesson={lesson}
                      children={children}
                      isExpanded={isExpanded}
                      onToggle={() => toggleExpanded(lesson.id)}
                    />

                    {/* Child Exercises */}
                    {isExpanded && children.length > 0 && (
                      <div className="ml-12 mb-4 space-y-1">
                        {children.map((exercise) => (
                          <Card key={exercise.id} className="p-2 bg-muted/50">
                            <div className="flex items-center gap-2 text-sm">
                              <span className="text-muted-foreground">→</span>
                              <span className="flex-1">{exercise.title}</span>
                              <Badge variant="outline" className="text-xs">
                                Exercise {exercise.order_in_lesson}
                              </Badge>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </SortableContext>
          </DndContext>
        </div>
      ))}
    </div>
  );
};
