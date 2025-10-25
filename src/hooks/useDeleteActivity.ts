import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';

export const useDeleteActivity = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { t } = useLanguage();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async ({ 
      activityId, 
      redirectPath 
    }: { 
      activityId: string; 
      redirectPath: string;
    }) => {
      const { error } = await supabase
        .from('manual_assessments')
        .delete()
        .eq('id', activityId);

      if (error) throw error;
      return { redirectPath };
    },
    onSuccess: (data) => {
      // Invalidate ALL activity-related queries
      queryClient.invalidateQueries({ queryKey: ['lesson'] });
      queryClient.invalidateQueries({ queryKey: ['lessons-with-order'] });
      queryClient.invalidateQueries({ queryKey: ['manual_assessments'] });
      queryClient.invalidateQueries({ queryKey: ['student-progress'] });
      queryClient.invalidateQueries({ queryKey: ['lesson-exercise-progress'] });
      queryClient.invalidateQueries({ queryKey: ['exercises'] });
      queryClient.invalidateQueries({ queryKey: ['assessments'] });
      queryClient.invalidateQueries({ queryKey: ['all-exercises'] });
      queryClient.invalidateQueries({ queryKey: ['all-lessons-exercise-progress'] });
      queryClient.invalidateQueries({ queryKey: ['lesson-exercises'] });
      queryClient.invalidateQueries({ queryKey: ['completed-exercises'] });
      
      toast({
        title: t('Actividad eliminada', 'Activity deleted'),
        description: t('La actividad se eliminó correctamente', 'Activity deleted successfully'),
      });

      navigate(data.redirectPath);
    },
    onError: (error) => {
      console.error('Delete error:', error);
      toast({
        title: t('Error', 'Error'),
        description: t('No se pudo eliminar la actividad', 'Could not delete activity'),
        variant: 'destructive',
      });
    },
  });
};
