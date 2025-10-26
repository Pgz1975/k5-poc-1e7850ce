#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

// Use environment variables directly
const supabaseUrl = 'https://meertwtenhlmnlpwxhyz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lZXJ0d3RlbmhsbW5scHd4aHl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3NjE2NzcsImV4cCI6MjA3NjMzNzY3N30.HMMie6aqj64R_-p6w5LaVNeAN7hIHpagqCRPdYXx_ic';

// Admin credentials
const ADMIN_EMAIL = 'admin@demo.com';
const ADMIN_PASSWORD = 'demo1234';

async function analyzeManualAssessments() {
  console.log('\n📊 Analyzing Manual Assessments Table\n');
  console.log('=' .repeat(80));

  // Create authenticated client
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  // Sign in as admin
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
  });

  if (authError) {
    console.error('❌ Authentication failed:', authError.message);
    process.exit(1);
  }

  console.log('✅ Authenticated as admin\n');

  // Fetch all manual assessments
  const { data: assessments, error } = await supabase
    .from('manual_assessments')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('❌ Error fetching assessments:', error);
    process.exit(1);
  }

  console.log(`📊 Total Assessments: ${assessments.length}\n`);

  // Analyze by type
  console.log('📈 ANALYSIS BY TYPE:');
  console.log('-'.repeat(40));

  const typeCount = {};
  assessments.forEach(a => {
    const type = a.type || 'unknown';
    typeCount[type] = (typeCount[type] || 0) + 1;
  });

  Object.entries(typeCount)
    .sort((a, b) => b[1] - a[1])
    .forEach(([type, count]) => {
      const percentage = ((count / assessments.length) * 100).toFixed(1);
      console.log(`  ${type.padEnd(20)} : ${count.toString().padStart(4)} (${percentage}%)`);
    });

  // Analyze by subtype
  console.log('\n📊 ANALYSIS BY SUBTYPE:');
  console.log('-'.repeat(40));

  const subtypeCount = {};
  assessments.forEach(a => {
    const subtype = a.subtype || 'none';
    subtypeCount[subtype] = (subtypeCount[subtype] || 0) + 1;
  });

  Object.entries(subtypeCount)
    .sort((a, b) => b[1] - a[1])
    .forEach(([subtype, count]) => {
      const percentage = ((count / assessments.length) * 100).toFixed(1);
      console.log(`  ${subtype.padEnd(20)} : ${count.toString().padStart(4)} (${percentage}%)`);
    });

  // Analyze AI vs Non-AI content
  console.log('\n🤖 AI vs NON-AI CONTENT:');
  console.log('-'.repeat(40));

  const aiContent = assessments.filter(a => a.title && a.title.startsWith('AI'));
  const nonAiContent = assessments.filter(a => !a.title || !a.title.startsWith('AI'));

  console.log(`  AI-Generated   : ${aiContent.length.toString().padStart(4)} (${((aiContent.length / assessments.length) * 100).toFixed(1)}%)`);
  console.log(`  Manual/Other   : ${nonAiContent.length.toString().padStart(4)} (${((nonAiContent.length / assessments.length) * 100).toFixed(1)}%)`);

  // Analyze by grade level (from titles)
  console.log('\n📚 GRADE LEVEL DISTRIBUTION:');
  console.log('-'.repeat(40));

  const gradeCount = {
    'Grade 1': assessments.filter(a => a.title && (a.title.includes('G1') || a.title.includes('Primer Grado'))).length,
    'Grade 2': assessments.filter(a => a.title && (a.title.includes('G2') || a.title.includes('Segundo Grado'))).length,
    'Other': assessments.filter(a => !a.title || (!a.title.includes('G1') && !a.title.includes('G2') && !a.title.includes('Grado'))).length
  };

  Object.entries(gradeCount)
    .forEach(([grade, count]) => {
      const percentage = ((count / assessments.length) * 100).toFixed(1);
      console.log(`  ${grade.padEnd(15)} : ${count.toString().padStart(4)} (${percentage}%)`);
    });

  // Analyze parent lessons vs exercises
  console.log('\n📝 LESSON HIERARCHY:');
  console.log('-'.repeat(40));

  const parents = assessments.filter(a => !a.parent_assessment_id);
  const exercises = assessments.filter(a => a.parent_assessment_id);

  console.log(`  Parent Lessons : ${parents.length.toString().padStart(4)}`);
  console.log(`  Exercises      : ${exercises.length.toString().padStart(4)}`);
  console.log(`  Avg Exercises/Lesson: ${(exercises.length / Math.max(parents.length, 1)).toFixed(1)}`);

  // Sample content structure
  console.log('\n📋 SAMPLE PARENT LESSONS (First 5):');
  console.log('-'.repeat(80));

  parents.slice(0, 5).forEach((lesson, idx) => {
    console.log(`\n${idx + 1}. ${lesson.title || 'Untitled'}`);
    console.log(`   Type: ${lesson.type} | Subtype: ${lesson.subtype || 'none'}`);
    console.log(`   Created: ${new Date(lesson.created_at).toLocaleDateString()}`);

    // Check content structure
    if (lesson.content) {
      const content = typeof lesson.content === 'string' ? JSON.parse(lesson.content) : lesson.content;
      console.log(`   Content Fields: ${Object.keys(content).join(', ')}`);
      if (content.question) {
        console.log(`   Question Preview: "${content.question.substring(0, 100)}..."`);
      }
    }

    // Count exercises
    const childExercises = exercises.filter(e => e.parent_assessment_id === lesson.id);
    console.log(`   Exercises: ${childExercises.length}`);
    if (childExercises.length > 0) {
      const subtypes = [...new Set(childExercises.map(e => e.subtype))];
      console.log(`   Exercise Types: ${subtypes.join(', ')}`);
    }
  });

  // Analyze exercise subtypes distribution
  console.log('\n🎯 EXERCISE SUBTYPES BREAKDOWN:');
  console.log('-'.repeat(40));

  const exerciseSubtypes = {};
  exercises.forEach(e => {
    const subtype = e.subtype || 'unknown';
    exerciseSubtypes[subtype] = (exerciseSubtypes[subtype] || 0) + 1;
  });

  Object.entries(exerciseSubtypes)
    .sort((a, b) => b[1] - a[1])
    .forEach(([subtype, count]) => {
      const percentage = ((count / exercises.length) * 100).toFixed(1);
      console.log(`  ${subtype.padEnd(20)} : ${count.toString().padStart(4)} (${percentage}%)`);
    });

  // Recent activity
  console.log('\n📅 RECENT ACTIVITY (Last 7 days):');
  console.log('-'.repeat(40));

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const recentAssessments = assessments.filter(a =>
    new Date(a.created_at) >= sevenDaysAgo
  );

  console.log(`  Total Created: ${recentAssessments.length}`);

  // Group by day
  const byDay = {};
  recentAssessments.forEach(a => {
    const day = new Date(a.created_at).toLocaleDateString();
    byDay[day] = (byDay[day] || 0) + 1;
  });

  Object.entries(byDay)
    .sort((a, b) => new Date(b[0]) - new Date(a[0]))
    .forEach(([day, count]) => {
      console.log(`  ${day}: ${count} assessments`);
    });

  // Content quality check
  console.log('\n✅ CONTENT QUALITY CHECK:');
  console.log('-'.repeat(40));

  let withImages = 0;
  let withQuestions = 0;
  let withAnswers = 0;
  let complete = 0;

  assessments.forEach(a => {
    if (a.content) {
      const content = typeof a.content === 'string' ? JSON.parse(a.content) : a.content;

      if (content.questionImage || (content.answers && content.answers.some(ans => ans.imageUrl))) {
        withImages++;
      }

      if (content.question && content.question.length > 10) {
        withQuestions++;
      }

      if (content.answers && content.answers.length > 0) {
        withAnswers++;
      }

      if (content.question && content.answers && content.answers.length > 0) {
        complete++;
      }
    }
  });

  console.log(`  With Images    : ${withImages.toString().padStart(4)} (${((withImages / assessments.length) * 100).toFixed(1)}%)`);
  console.log(`  With Questions : ${withQuestions.toString().padStart(4)} (${((withQuestions / assessments.length) * 100).toFixed(1)}%)`);
  console.log(`  With Answers   : ${withAnswers.toString().padStart(4)} (${((withAnswers / assessments.length) * 100).toFixed(1)}%)`);
  console.log(`  Complete       : ${complete.toString().padStart(4)} (${((complete / assessments.length) * 100).toFixed(1)}%)`);

  // Summary
  console.log('\n' + '='.repeat(80));
  console.log('📊 SUMMARY:');
  console.log('='.repeat(80));
  console.log(`Total Assessments: ${assessments.length}`);
  console.log(`Parent Lessons: ${parents.length}`);
  console.log(`Exercises: ${exercises.length}`);
  console.log(`AI-Generated: ${aiContent.length}`);
  console.log(`Manual Content: ${nonAiContent.length}`);
  console.log('='.repeat(80) + '\n');

  // Sign out
  await supabase.auth.signOut();
  console.log('✅ Analysis complete!\n');
}

// Run the analysis
analyzeManualAssessments().catch(console.error);