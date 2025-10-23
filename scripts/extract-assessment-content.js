import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabaseUrl = 'https://meertwtenhlmnlpwxhyz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lZXJ0d3RlbmhsbW5scHd4aHl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3NjE2NzcsImV4cCI6MjA3NjMzNzY3N30.HMMie6aqj64R_-p6w5LaVNeAN7hIHpagqCRPdYXx_ic';

const supabase = createClient(supabaseUrl, supabaseKey);

async function extractContent() {
  // Sign in as admin
  const { error: authError } = await supabase.auth.signInWithPassword({
    email: 'admin@demo.com',
    password: 'demo1234'
  });

  if (authError) {
    console.error('Authentication error:', authError.message);
    return;
  }

  console.log('Extracting all manual assessments with content...\n');

  // Get all assessments with actual content
  const { data: assessments, error } = await supabase
    .from('manual_assessments')
    .select('*')
    .not('content', 'is', null)
    .order('grade_level', { ascending: true });

  if (error) {
    console.error('Error:', error.message);
    return;
  }

  console.log(`Found ${assessments.length} assessments with content\n`);

  // Group by grade level
  const byGrade = {};

  assessments.forEach(assessment => {
    const grade = assessment.grade_level || 0;
    if (!byGrade[grade]) {
      byGrade[grade] = [];
    }

    byGrade[grade].push({
      id: assessment.id,
      title: assessment.title,
      type: assessment.type,
      subtype: assessment.subtype,
      language: assessment.language,
      grade_level: assessment.grade_level,
      content: assessment.content,
      enable_voice: assessment.enable_voice,
      estimated_duration_minutes: assessment.estimated_duration_minutes,
      created_at: assessment.created_at
    });
  });

  // Display summary
  console.log('=== CONTENT SUMMARY BY GRADE ===\n');
  Object.keys(byGrade).sort().forEach(grade => {
    console.log(`Grade ${grade}: ${byGrade[grade].length} assessments`);
    byGrade[grade].forEach((a, idx) => {
      console.log(`  ${idx + 1}. ${a.title?.substring(0, 50) || 'Untitled'} (${a.language})`);
      if (a.content?.question) {
        console.log(`     Question: ${a.content.question.substring(0, 60)}...`);
      }
      if (a.content?.questionImage) {
        console.log(`     Image: ${a.content.questionImage}`);
      }
    });
    console.log('');
  });

  // Save to file
  const output = {
    extractedAt: new Date().toISOString(),
    totalAssessments: assessments.length,
    byGrade: byGrade,
    allAssessments: assessments
  };

  fs.writeFileSync(
    '/workspaces/k5-poc-1e7850ce/docs/extracted-assessments.json',
    JSON.stringify(output, null, 2)
  );

  console.log('\n✅ Content extracted to: docs/extracted-assessments.json');

  await supabase.auth.signOut();
}

extractContent().catch(console.error);
