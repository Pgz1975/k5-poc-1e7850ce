import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

export const useResetProgress = () => {
  const queryClient = useQueryClient();
  const { t } = useLanguage();

  return useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Not authenticated");
      }

      const { error } = await supabase
        .from("completed_activity")
        .delete()
        .eq("student_id", user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: t("Progreso reiniciado exitosamente", "Progress reset successfully"),
        description: t(
          "Todas tus actividades completadas han sido eliminadas",
          "All your completed activities have been deleted"
        ),
      });
      
      // Invalidate all relevant queries to refresh UI
      queryClient.invalidateQueries({ queryKey: ["student-progress"] });
      queryClient.invalidateQueries({ queryKey: ["completed-activities"] });
      queryClient.invalidateQueries({ queryKey: ["completed-exercises"] });
      queryClient.invalidateQueries({ queryKey: ["lesson-exercise-progress"] });
      queryClient.invalidateQueries({ queryKey: ["lesson-lock-status"] });
    },
    onError: (error) => {
      console.error("Error resetting progress:", error);
      toast({
        title: t("Error al reiniciar progreso", "Error resetting progress"),
        description: t(
          "No se pudo reiniciar tu progreso. Intenta de nuevo.",
          "Could not reset your progress. Please try again."
        ),
        variant: "destructive",
      });
    },
  });
};
