import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useStudentProfile = () => {
  return useQuery({
    queryKey: ["student-profile"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error("No authenticated user");

      const { data, error } = await supabase
        .from("profiles")
        .select("grade_level, learning_languages, full_name")
        .eq("id", user.id)
        .single();

      if (error) throw error;

      return {
        gradeLevel: data.grade_level ?? 0,
        learningLanguages: data.learning_languages ?? ["es", "en"],
        fullName: data.full_name ?? "",
      };
    },
  });
};
