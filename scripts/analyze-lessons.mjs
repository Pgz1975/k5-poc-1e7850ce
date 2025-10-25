import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://meertwtenhlmnlpwxhyz.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lZXJ0d3RlbmhsbW5scHd4aHl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3NjE2NzcsImV4cCI6MjA3NjMzNzY3N30.HMMie6aqj64R_-p6w5LaVNeAN7hIHpagqCRPdYXx_ic";

const supabase = createClient(supabaseUrl, supabaseKey);

async function analyzeExistingLessons() {
  console.log('🔍 Analyzing existing lessons in database...\n');

  try {
    // First login as admin
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'admin@demo.com',
      password: 'demo1234'
    });

    if (authError) {
      console.error('❌ Auth error:', authError);
      return;
    }

    console.log('✅ Logged in as admin@demo.com\n');

    // Fetch non-AI lessons (parent lessons)
    const { data: parentLessons, error: parentError } = await supabase
      .from('manual_assessments')
      .select('*')
      .eq('type', 'lesson')
      .not('title', 'like', 'AI%')
      .limit(5);

    if (parentError) {
      console.error('❌ Error fetching parent lessons:', parentError);
      return;
    }

    console.log('📚 PARENT LESSONS (Non-AI):');
    console.log('==========================\n');

    for (const lesson of parentLessons) {
      console.log(`Title: ${lesson.title}`);
      console.log(`Grade: ${lesson.grade_level}`);
      console.log(`Type: ${lesson.type} / ${lesson.subtype}`);
      console.log('Content structure:');
      console.log(JSON.stringify(lesson.content, null, 2));
      console.log('\n---\n');
    }

    // Fetch non-AI exercises
    const { data: exercises, error: exerciseError } = await supabase
      .from('manual_assessments')
      .select('*')
      .eq('type', 'exercise')
      .not('title', 'like', 'AI%')
      .limit(10);

    if (exerciseError) {
      console.error('❌ Error fetching exercises:', exerciseError);
      return;
    }

    console.log('\n📝 EXERCISES (Non-AI):');
    console.log('=====================\n');

    // Group by subtype to see variety
    const exercisesByType = {};
    for (const exercise of exercises) {
      if (!exercisesByType[exercise.subtype]) {
        exercisesByType[exercise.subtype] = [];
      }
      exercisesByType[exercise.subtype].push(exercise);
    }

    for (const [subtype, exs] of Object.entries(exercisesByType)) {
      console.log(`\n🎯 Subtype: ${subtype}`);
      console.log('------------------------');

      for (const ex of exs.slice(0, 2)) {
        console.log(`Title: ${ex.title}`);
        console.log(`Parent ID: ${ex.parent_lesson_id}`);
        console.log('Content structure:');
        console.log(JSON.stringify(ex.content, null, 2));
        console.log('\n');
      }
    }

    // Analyze specific subtypes in detail
    console.log('\n📊 DETAILED ANALYSIS BY EXERCISE TYPE:');
    console.log('======================================\n');

    const typesToAnalyze = ['multiple_choice', 'drag_drop', 'fill_blank', 'true_false', 'write_answer'];

    for (const subtype of typesToAnalyze) {
      const { data: specificExercises, error } = await supabase
        .from('manual_assessments')
        .select('*')
        .eq('type', 'exercise')
        .eq('subtype', subtype)
        .not('title', 'like', 'AI%')
        .limit(1);

      if (!error && specificExercises && specificExercises.length > 0) {
        console.log(`\n✅ ${subtype.toUpperCase()} Example:`);
        console.log('Content keys:', Object.keys(specificExercises[0].content));
        console.log('Full content:');
        console.log(JSON.stringify(specificExercises[0].content, null, 2));
      }
    }

    // Get statistics
    const { count: totalLessons } = await supabase
      .from('manual_assessments')
      .select('*', { count: 'exact', head: true })
      .eq('type', 'lesson')
      .not('title', 'like', 'AI%');

    const { count: totalExercises } = await supabase
      .from('manual_assessments')
      .select('*', { count: 'exact', head: true })
      .eq('type', 'exercise')
      .not('title', 'like', 'AI%');

    console.log('\n📈 STATISTICS:');
    console.log('=============');
    console.log(`Total non-AI lessons: ${totalLessons}`);
    console.log(`Total non-AI exercises: ${totalExercises}`);

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

analyzeExistingLessons();