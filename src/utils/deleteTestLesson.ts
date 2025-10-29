import { supabase } from "@/integrations/supabase/client";

export async function deleteTestLessonAndExercises() {
  try {
    // Step 1: Find all exercises with "TEST G1 Exercise" in title
    const { data: exercisesToDelete, error: fetchError } = await supabase
      .from('manual_assessments')
      .select('id')
      .ilike('title', '%TEST G1 Exercise%');

    if (fetchError) throw fetchError;

    const exerciseIds = exercisesToDelete?.map(e => e.id) || [];
    const allIdsToDelete = [...exerciseIds, 'b8edf8f2-63ce-4479-832c-7801c6d9785f'];

    console.log('Deleting activities:', allIdsToDelete);

    // Step 2: Delete related records
    await supabase
      .from('voice_interactions')
      .delete()
      .in('assessment_id', allIdsToDelete);

    await supabase
      .from('voice_sessions')
      .delete()
      .in('assessment_id', allIdsToDelete);

    await supabase
      .from('completed_activity')
      .delete()
      .in('activity_id', allIdsToDelete);

    await supabase
      .from('lesson_ordering')
      .delete()
      .in('assessment_id', allIdsToDelete);

    // Step 3: Delete exercises
    const { error: exerciseDeleteError } = await supabase
      .from('manual_assessments')
      .delete()
      .ilike('title', '%TEST G1 Exercise%');

    if (exerciseDeleteError) throw exerciseDeleteError;

    // Step 4: Delete the main lesson
    const { error: lessonDeleteError } = await supabase
      .from('manual_assessments')
      .delete()
      .eq('id', 'b8edf8f2-63ce-4479-832c-7801c6d9785f');

    if (lessonDeleteError) throw lessonDeleteError;

    console.log('Successfully deleted test lesson and exercises');
    return { success: true };
  } catch (error) {
    console.error('Error deleting:', error);
    return { success: false, error };
  }
}
