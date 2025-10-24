import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, ChevronDown, ChevronRight, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LessonWithOrder } from '@/types/lessonOrdering';
import { useState } from 'react';

interface DraggableLessonItemProps {
  lesson: LessonWithOrder;
  children?: LessonWithOrder[];
  onToggle?: () => void;
  isExpanded?: boolean;
}

export const DraggableLessonItem = ({ 
  lesson, 
  children, 
  onToggle, 
  isExpanded 
}: DraggableLessonItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: lesson.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const hasChildren = children && children.length > 0;

  return (
    <div ref={setNodeRef} style={style}>
      <Card className={`p-3 mb-2 ${isDragging ? 'shadow-lg' : ''}`}>
        <div className="flex items-center gap-2">
          {/* Drag Handle */}
          <Button
            variant="ghost"
            size="sm"
            className="cursor-grab active:cursor-grabbing h-8 w-8 p-0"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </Button>

          {/* Expand/Collapse for lessons with exercises */}
          {hasChildren && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="h-8 w-8 p-0"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          )}

          {/* Lesson Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-medium truncate">{lesson.title}</p>
              {lesson.status !== 'published' && (
                <Badge variant="outline" className="text-xs">
                  {lesson.status}
                </Badge>
              )}
            </div>
            {lesson.description && (
              <p className="text-sm text-muted-foreground truncate">
                {lesson.description}
              </p>
            )}
          </div>

          {/* Type Badge */}
          <Badge variant="secondary" className="ml-2">
            {lesson.type === 'lesson' ? 'Lesson' : 'Exercise'}
          </Badge>

          {/* Display Order */}
          {lesson.display_order !== undefined && (
            <Badge variant="outline" className="ml-2">
              #{lesson.display_order + 1}
            </Badge>
          )}
        </div>
      </Card>
    </div>
  );
};
