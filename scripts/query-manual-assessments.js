import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://meertwtenhlmnlpwxhyz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lZXJ0d3RlbmhsbW5scHd4aHl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3NjE2NzcsImV4cCI6MjA3NjMzNzY3N30.HMMie6aqj64R_-p6w5LaVNeAN7hIHpagqCRPdYXx_ic';

const supabase = createClient(supabaseUrl, supabaseKey);

async function queryManualAssessments() {
  console.log('Connecting to Supabase...');

  // First, sign in as admin
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'admin@demo.com',
    password: 'demo1234'
  });

  if (authError) {
    console.error('Authentication error:', authError.message);
    return;
  }

  console.log('Authenticated as:', authData.user.email);

  // Query manual_assessments table
  const { data: assessments, error: assessmentsError } = await supabase
    .from('manual_assessments')
    .select('*')
    .order('grade_level', { ascending: true });

  if (assessmentsError) {
    console.error('Error fetching manual_assessments:', assessmentsError.message);
    return;
  }

  console.log('\n=== MANUAL ASSESSMENTS ===');
  console.log(`Found ${assessments.length} assessments\n`);

  assessments.forEach((assessment, idx) => {
    console.log(`\n--- Assessment ${idx + 1} ---`);
    console.log(`ID: ${assessment.id}`);
    console.log(`Title: ${assessment.title_english || assessment.title_spanish || 'N/A'}`);
    console.log(`Grade: ${assessment.grade_level}`);
    console.log(`Language: ${assessment.language}`);
    console.log(`Type: ${assessment.assessment_type}`);
    console.log(`Text length: ${assessment.passage_text?.length || 0} chars`);
    console.log(`Questions: ${assessment.questions?.length || 0}`);
    console.log(`Created: ${assessment.created_at}`);
  });

  // Also check reading_exercises table
  const { data: exercises, error: exercisesError } = await supabase
    .from('reading_exercises')
    .select('*')
    .order('grade_level', { ascending: true });

  if (exercisesError) {
    console.error('Error fetching reading_exercises:', exercisesError.message);
  } else {
    console.log('\n\n=== READING EXERCISES ===');
    console.log(`Found ${exercises.length} exercises\n`);

    exercises.forEach((exercise, idx) => {
      console.log(`\n--- Exercise ${idx + 1} ---`);
      console.log(`ID: ${exercise.id}`);
      console.log(`Title: ${exercise.title}`);
      console.log(`Grade: ${exercise.grade_level}`);
      console.log(`Language: ${exercise.language}`);
      console.log(`Text length: ${exercise.text?.length || 0} chars`);
      console.log(`Difficulty: ${exercise.difficulty_level}`);
      console.log(`Created: ${exercise.created_at}`);
    });
  }

  // Sign out
  await supabase.auth.signOut();
  console.log('\n\nSigned out.');
}

queryManualAssessments().catch(console.error);
