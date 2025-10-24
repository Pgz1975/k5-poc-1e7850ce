import { useState } from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerFooter,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings2, Save } from 'lucide-react';
import { useLessonOrdering } from '@/hooks/useLessonOrdering';
import { LessonOrderingList } from './LessonOrderingList';
import { LessonWithOrder, LessonOrder } from '@/types/lessonOrdering';
import { useLanguage } from '@/contexts/LanguageContext';

const GRADES = [
  { value: '0', label: 'K' },
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4', label: '4' },
  { value: '5', label: '5' },
];

export const ManageLessonsDrawer = () => {
  const { t } = useLanguage();
  const [selectedGrade, setSelectedGrade] = useState<string>('1');
  const [reorderedLessons, setReorderedLessons] = useState<LessonWithOrder[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const { lessonsWithOrder, updateOrdering, isUpdating } = useLessonOrdering(
    parseInt(selectedGrade)
  );

  const handleReorder = (lessons: LessonWithOrder[]) => {
    setReorderedLessons(lessons);
  };

  const handleSave = () => {
    const updates: Partial<LessonOrder>[] = reorderedLessons
      .filter(lesson => !lesson.parent_lesson_id) // Only parent lessons
      .map((lesson, index) => ({
        grade_level: parseInt(selectedGrade),
        assessment_id: lesson.id,
        display_order: index,
        domain_name: lesson.domain_name,
        domain_order: lesson.domain_order,
        parent_lesson_id: null,
      }));

    updateOrdering(updates);
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Settings2 className="h-4 w-4" />
          {t("Gestionar Lecciones", "Manage Lessons")}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[90vh]">
        <DrawerHeader>
          <DrawerTitle>
            {t("Gestionar Orden de Lecciones", "Manage Lesson Order")}
          </DrawerTitle>
          <DrawerDescription>
            {t(
              "Arrastra las lecciones para cambiar su orden de visualización para los estudiantes",
              "Drag lessons to change their display order for students"
            )}
          </DrawerDescription>
        </DrawerHeader>

        <div className="px-4 pb-4 overflow-y-auto flex-1">
          <Tabs value={selectedGrade} onValueChange={setSelectedGrade}>
            <TabsList className="grid w-full grid-cols-6 mb-4">
              {GRADES.map((grade) => (
                <TabsTrigger key={grade.value} value={grade.value}>
                  {t(`Grado ${grade.label}`, `Grade ${grade.label}`)}
                </TabsTrigger>
              ))}
            </TabsList>

            {GRADES.map((grade) => (
              <TabsContent key={grade.value} value={grade.value} className="mt-0">
                {lessonsWithOrder && lessonsWithOrder.length > 0 ? (
                  <LessonOrderingList
                    lessons={lessonsWithOrder}
                    onReorder={handleReorder}
                  />
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    {t(
                      "No hay lecciones para este grado",
                      "No lessons available for this grade"
                    )}
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>

        <DrawerFooter className="border-t">
          <div className="flex gap-2 justify-end w-full">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isUpdating}
            >
              {t("Cancelar", "Cancel")}
            </Button>
            <Button
              onClick={handleSave}
              disabled={isUpdating || reorderedLessons.length === 0}
              className="gap-2"
            >
              <Save className="h-4 w-4" />
              {isUpdating 
                ? t("Guardando...", "Saving...") 
                : t("Guardar Orden", "Save Order")}
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
