import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LessonOrder, LessonWithOrder } from "@/types/lessonOrdering";
import { toast } from "@/hooks/use-toast";

export const useLessonOrdering = (gradeLevel: number, learningLanguages: string[] = ["es", "en"]) => {
  const queryClient = useQueryClient();

  // Fetch ordering for a specific grade
  const { data: ordering, isLoading } = useQuery({
    queryKey: ['lesson-ordering', gradeLevel],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lesson_ordering')
        .select('*')
        .eq('grade_level', gradeLevel)
        .order('display_order');
      
      if (error) throw error;
      return data as LessonOrder[];
    }
  });

  // Fetch all lessons for a grade with their ordering
  const { data: lessonsWithOrder } = useQuery({
    queryKey: ['lessons-with-order', gradeLevel, learningLanguages],
    queryFn: async () => {
      // First get all published parent lessons for this grade and languages
      const { data: assessments, error: assessError } = await supabase
        .from('manual_assessments')
        .select('id, title, description, type, grade_level, language, status, parent_lesson_id, order_in_lesson, estimated_duration_minutes, created_at')
        .eq('grade_level', gradeLevel)
        .eq('status', 'published')
        .eq('type', 'lesson') // Only lessons, not assessments or exercises
        .is('parent_lesson_id', null) // Only parent lessons, not child exercises
        .in('language', learningLanguages as ("es" | "en" | "es-PR")[])
        .order('created_at');
      
      if (assessError) throw assessError;

      // Then get their ordering
      const { data: ordering, error: orderError } = await supabase
        .from('lesson_ordering')
        .select('*')
        .eq('grade_level', gradeLevel);
      
      if (orderError) throw orderError;

      // Merge ordering info with assessments
      const orderMap = new Map(ordering?.map(o => [o.assessment_id, o]) || []);
      
      const lessonsWithOrderData = assessments?.map(assessment => ({
        ...assessment,
        display_order: orderMap.get(assessment.id)?.display_order,
        domain_name: orderMap.get(assessment.id)?.domain_name,
        domain_order: orderMap.get(assessment.id)?.domain_order,
      })) as LessonWithOrder[];

      // Sort by display_order if available, otherwise by created_at
      return lessonsWithOrderData?.sort((a, b) => {
        if (a.display_order !== undefined && b.display_order !== undefined) {
          return a.display_order - b.display_order;
        }
        return 0;
      });
    }
  });

  // Update ordering (batch upsert)
  const updateOrdering = useMutation({
    mutationFn: async (updates: Array<{
      grade_level: number;
      assessment_id: string;
      display_order: number;
      domain_name?: string | null;
      domain_order?: number | null;
      parent_lesson_id?: string | null;
    }>) => {
      const { error } = await supabase
        .from('lesson_ordering')
        .upsert(updates, { onConflict: 'grade_level,assessment_id' });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lesson-ordering', gradeLevel] });
      queryClient.invalidateQueries({ queryKey: ['lessons-with-order', gradeLevel] });
      toast({
        title: "Order saved",
        description: "Lesson order has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to save order: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  return {
    ordering,
    lessonsWithOrder,
    isLoading,
    updateOrdering: updateOrdering.mutate,
    isUpdating: updateOrdering.isPending,
  };
};
