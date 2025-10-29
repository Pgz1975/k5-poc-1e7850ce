import { supabase } from "@/integrations/supabase/client";

export async function deleteTestLessonAndExercises() {
  try {
    // Get all assessment IDs that will be deleted
    const { data: assessments, error: fetchError } = await supabase
      .from('manual_assessments')
      .select('id')
      .or(`title.ilike.%TEST G1 Exercise%,id.eq.b8edf8f2-63ce-4479-832c-7801c6d9785f`);

    if (fetchError) throw fetchError;
    
    const assessmentIds = assessments?.map(a => a.id) || [];
    
    if (assessmentIds.length === 0) {
      console.log('No assessments found to delete');
      return { success: true };
    }

    // Step 1: Delete voice_interactions
    const { error: voiceInteractionsError } = await supabase
      .from('voice_interactions')
      .delete()
      .in('assessment_id', assessmentIds);

    if (voiceInteractionsError) throw voiceInteractionsError;

    // Step 2: Delete voice_sessions
    const { error: voiceSessionsError } = await supabase
      .from('voice_sessions')
      .delete()
      .in('assessment_id', assessmentIds);

    if (voiceSessionsError) throw voiceSessionsError;

    // Step 3: Delete completed_activity
    const { error: completedActivityError } = await supabase
      .from('completed_activity')
      .delete()
      .in('activity_id', assessmentIds);

    if (completedActivityError) throw completedActivityError;

    // Step 4: Delete lesson_ordering
    const { error: lessonOrderingError } = await supabase
      .from('lesson_ordering')
      .delete()
      .in('assessment_id', assessmentIds);

    if (lessonOrderingError) throw lessonOrderingError;

    // Step 5: Delete exercises
    const { error: exerciseDeleteError } = await supabase
      .from('manual_assessments')
      .delete()
      .ilike('title', '%TEST G1 Exercise%');

    if (exerciseDeleteError) throw exerciseDeleteError;

    // Step 6: Delete parent lesson
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
