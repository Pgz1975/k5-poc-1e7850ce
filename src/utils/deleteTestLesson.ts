import { supabase } from "@/integrations/supabase/client";

export async function unpublishTestLessonAndExercises() {
  try {
    // Step 1: Unpublish all exercises with "TEST G1 Exercise" in title
    const { error: exerciseUpdateError } = await supabase
      .from('manual_assessments')
      .update({ status: 'draft' })
      .ilike('title', '%TEST G1 Exercise%');

    if (exerciseUpdateError) throw exerciseUpdateError;

    // Step 2: Unpublish the main lesson
    const { error: lessonUpdateError } = await supabase
      .from('manual_assessments')
      .update({ status: 'draft' })
      .eq('id', 'b8edf8f2-63ce-4479-832c-7801c6d9785f');

    if (lessonUpdateError) throw lessonUpdateError;

    console.log('Successfully unpublished test lesson and exercises');
    return { success: true };
  } catch (error) {
    console.error('Error unpublishing:', error);
    return { success: false, error };
  }
}
