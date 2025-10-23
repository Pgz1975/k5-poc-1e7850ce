import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface UseStudentProgressProps {
  activityType: "lesson" | "exercise" | "assessment";
  gradeLevel: number;
  learningLanguages: string[];
}

export const useStudentProgress = ({
  activityType,
  gradeLevel,
  learningLanguages,
}: UseStudentProgressProps) => {
  return useQuery({
    queryKey: ["student-progress", activityType, gradeLevel, learningLanguages],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error("No authenticated user");

      // Fetch all published activities for grade and language
      const { data: activities, error: activitiesError } = await supabase
        .from("manual_assessments")
        .select("id, title, description, estimated_duration_minutes")
        .eq("status", "published")
        .eq("type", activityType)
        .eq("grade_level", gradeLevel)
        .in("language", learningLanguages as ("es" | "en" | "es-PR")[])
        .is("parent_lesson_id", null)
        .order("created_at", { ascending: true });

      if (activitiesError) throw activitiesError;

      // Fetch completed activities
      const { data: completedActivities, error: completedError } = await supabase
        .from("completed_activity")
        .select("activity_id, score, completed_at")
        .eq("student_id", user.id)
        .eq("activity_type", activityType);

      if (completedError) throw completedError;

      const completedIds = new Set(completedActivities?.map(c => c.activity_id) ?? []);
      const totalActivities = activities?.length ?? 0;
      const completedCount = completedActivities?.length ?? 0;

      // Calculate average score (dummy data for now)
      const scores = completedActivities?.map(c => c.score).filter(s => s !== null) ?? [];
      const avgScore = scores.length > 0 
        ? scores.reduce((sum, s) => sum + (s ?? 0), 0) / scores.length
        : null;

      // Find next uncompleted activity
      const nextActivity = activities?.find(a => !completedIds.has(a.id));

      return {
        totalActivities,
        completedCount,
        completedActivities: completedActivities ?? [],
        activities: activities ?? [],
        avgScore,
        nextActivity,
        progressPercentage: totalActivities > 0 ? (completedCount / totalActivities) * 100 : 0,
      };
    },
    enabled: learningLanguages.length > 0,
  });
};
