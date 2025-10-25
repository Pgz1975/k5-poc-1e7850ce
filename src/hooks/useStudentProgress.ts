import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getLessonLockingStatus } from "@/utils/lessonUnlocking";

interface UseStudentProgressProps {
  activityType: "lesson" | "exercise" | "assessment";
  gradeLevel: number;
  learningLanguages: string[];
}

interface ActivityWithLocking {
  id: string;
  title: string;
  description: string | null;
  estimated_duration_minutes: number | null;
  isLocked: boolean;
  display_order?: number;
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

      // Fetch completed activities
      const { data: completedActivities, error: completedError } = await supabase
        .from("completed_activity")
        .select("activity_id, score, completed_at")
        .eq("student_id", user.id)
        .eq("activity_type", activityType);

      if (completedError) throw completedError;

      // For lessons, fetch ordering data to determine sequence
      if (activityType === "lesson") {
        const { data: ordering, error: orderingError } = await supabase
          .from("lesson_ordering")
          .select(`
            id,
            assessment_id,
            display_order,
            manual_assessments!lesson_ordering_assessment_id_fkey (
              id,
              title,
              description,
              estimated_duration_minutes,
              language
            )
          `)
          .eq("grade_level", gradeLevel)
          .order("display_order");

        if (orderingError) throw orderingError;

        // Filter lessons by student's learning languages
        const filteredOrdering = ordering?.filter(o => {
          const lesson = o.manual_assessments as any;
          return lesson && learningLanguages.includes(lesson.language);
        }) ?? [];

        // Get locking status for all lessons
        const lockingMap = getLessonLockingStatus(
          filteredOrdering.map(o => ({
            id: o.id,
            display_order: o.display_order,
            assessment_id: o.assessment_id,
          })),
          completedActivities ?? []
        );

        // Map lessons with locking status
        const activitiesWithLocking: ActivityWithLocking[] = filteredOrdering.map(o => ({
          id: o.assessment_id,
          title: (o.manual_assessments as any)?.title ?? "Untitled",
          description: (o.manual_assessments as any)?.description,
          estimated_duration_minutes: (o.manual_assessments as any)?.estimated_duration_minutes,
          isLocked: lockingMap.get(o.assessment_id) ?? false,
          display_order: o.display_order,
        }));

        const completedIds = new Set(completedActivities?.map(c => c.activity_id) ?? []);
        const totalActivities = activitiesWithLocking.length;
        const completedCount = completedActivities?.length ?? 0;

        // Calculate average score
        const scores = completedActivities?.map(c => c.score).filter(s => s !== null) ?? [];
        const avgScore = scores.length > 0 
          ? scores.reduce((sum, s) => sum + (s ?? 0), 0) / scores.length
          : null;

        // Find next unlocked activity
        const nextActivity = activitiesWithLocking.find(a => !completedIds.has(a.id) && !a.isLocked);

        return {
          totalActivities,
          completedCount,
          completedActivities: completedActivities ?? [],
          activities: activitiesWithLocking,
          avgScore,
          nextActivity,
          progressPercentage: totalActivities > 0 ? (completedCount / totalActivities) * 100 : 0,
        };
      }

      // For non-lesson activities, fetch with special handling for exercises
      let activities: { id: string; title: string; description: string | null; estimated_duration_minutes: number | null; }[] | null = null;
      let activitiesError: any = null;

      if (activityType === "exercise") {
        // Exercises are child activities; access controlled via parent lesson policies
        const { data, error } = await supabase
          .from("manual_assessments")
          .select("id, title, description, estimated_duration_minutes")
          .eq("type", "exercise")
          .not("parent_lesson_id", "is", null)
          .order("created_at", { ascending: true });
        activities = data;
        activitiesError = error;
      } else {
        // Assessments (non-lesson) remain filtered by grade/language and published status
        const { data, error } = await supabase
          .from("manual_assessments")
          .select("id, title, description, estimated_duration_minutes")
          .eq("status", "published")
          .eq("type", activityType)
          .eq("grade_level", gradeLevel)
          .in("language", learningLanguages as ("es" | "en" | "es-PR")[])
          .is("parent_lesson_id", null)
          .order("created_at", { ascending: true });
        activities = data;
        activitiesError = error;
      }

      if (activitiesError) throw activitiesError;

      const activitiesWithLocking: ActivityWithLocking[] = activities?.map(a => ({
        ...a,
        isLocked: false, // Exercises are not locked
      })) ?? [];

      // Filter completed activities to only count those in the current grade/language
      const availableActivityIds = new Set(activitiesWithLocking.map(a => a.id));
      const relevantCompletedActivities = completedActivities?.filter(c => 
        availableActivityIds.has(c.activity_id)
      ) ?? [];

      const completedIds = new Set(relevantCompletedActivities.map(c => c.activity_id));
      const totalActivities = activitiesWithLocking.length;
      const completedCount = relevantCompletedActivities.length;

      // Calculate average score from relevant completed activities
      const scores = relevantCompletedActivities.map(c => c.score).filter(s => s !== null);
      const avgScore = scores.length > 0 
        ? scores.reduce((sum, s) => sum + (s ?? 0), 0) / scores.length
        : null;

      // Find next uncompleted activity
      const nextActivity = activitiesWithLocking.find(a => !completedIds.has(a.id));

      return {
        totalActivities,
        completedCount,
        completedActivities: relevantCompletedActivities,
        activities: activitiesWithLocking,
        avgScore,
        nextActivity,
        progressPercentage: totalActivities > 0 ? (completedCount / totalActivities) * 100 : 0,
      };
    },
    enabled: learningLanguages.length > 0,
  });
};
