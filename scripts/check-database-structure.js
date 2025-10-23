import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://meertwtenhlmnlpwxhyz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lZXJ0d3RlbmhsbW5scHd4aHl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3NjE2NzcsImV4cCI6MjA3NjMzNzY3N30.HMMie6aqj64R_-p6w5LaVNeAN7hIHpagqCRPdYXx_ic';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDatabase() {
  // Sign in as admin
  const { error: authError } = await supabase.auth.signInWithPassword({
    email: 'admin@demo.com',
    password: 'demo1234'
  });

  if (authError) {
    console.error('Authentication error:', authError.message);
    return;
  }

  console.log('=== Checking for lessons and exercises ===\n');

  // Check lessons table
  const { data: lessons, error: lessonsError } = await supabase
    .from('lessons')
    .select('id, title_english, title_spanish, grade_level, language, lesson_type, passage_text')
    .order('grade_level', { ascending: true })
    .limit(10);

  if (lessonsError) {
    console.log('Lessons table error:', lessonsError.message);
  } else {
    console.log(`Found ${lessons.length} lessons:`);
    lessons.forEach((lesson, idx) => {
      console.log(`\n${idx + 1}. ${lesson.title_english || lesson.title_spanish || 'Untitled'}`);
      console.log(`   Grade: ${lesson.grade_level}, Language: ${lesson.language}`);
      console.log(`   Type: ${lesson.lesson_type}`);
      console.log(`   Text: ${lesson.passage_text ? lesson.passage_text.substring(0, 100) + '...' : 'N/A'}`);
    });
  }

  // Check exercises table
  const { data: exercises, error: exercisesError } = await supabase
    .from('exercises')
    .select('id, lesson_id, exercise_type, content')
    .limit(10);

  if (exercisesError) {
    console.log('\nExercises table error:', exercisesError.message);
  } else {
    console.log(`\n\nFound ${exercises.length} exercises`);
    exercises.forEach((ex, idx) => {
      console.log(`\n${idx + 1}. Type: ${ex.exercise_type}, Lesson: ${ex.lesson_id}`);
      console.log(`   Content: ${JSON.stringify(ex.content).substring(0, 100)}...`);
    });
  }

  // Get sample manual assessment with full details
  console.log('\n\n=== Checking ONE manual assessment in detail ===\n');

  const { data: sampleAssessment, error: sampleError } = await supabase
    .from('manual_assessments')
    .select('*')
    .limit(1)
    .single();

  if (sampleError) {
    console.log('Error:', sampleError.message);
  } else {
    console.log('Sample assessment structure:');
    console.log(JSON.stringify(sampleAssessment, null, 2));
  }

  await supabase.auth.signOut();
}

checkDatabase().catch(console.error);
