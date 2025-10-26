#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

// Supabase configuration from .env
const SUPABASE_URL = 'https://meertwtenhlmnlpwxhyz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lZXJ0d3RlbmhsbW5scHd4aHl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3NjE2NzcsImV4cCI6MjA3NjMzNzY3N30.HMMie6aqj64R_-p6w5LaVNeAN7hIHpagqCRPdYXx_ic';

// Admin credentials
const ADMIN_EMAIL = 'admin@demo.com';
const ADMIN_PASSWORD = 'demo1234';

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function runCompleteAnalysis() {
  console.log('\n' + '='.repeat(80));
  console.log('📊 COMPLETE MANUAL ASSESSMENTS DATABASE ANALYSIS');
  console.log('='.repeat(80));
  console.log('Date:', new Date().toISOString());
  console.log('Database:', SUPABASE_URL);

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

  // Fetch ALL assessments
  const { data: assessments, error } = await supabase
    .from('manual_assessments')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('❌ Error fetching assessments:', error);
    process.exit(1);
  }

  console.log('=' .repeat(80));
  console.log('📈 OVERVIEW');
  console.log('=' .repeat(80));
  console.log(`Total Records: ${assessments.length}\n`);

  // Analyze using CORRECT parent_lesson_id field
  const parentLessons = assessments.filter(a => !a.parent_lesson_id);
  const childExercises = assessments.filter(a => a.parent_lesson_id);

  console.log('📝 CORRECT HIERARCHY (using parent_lesson_id):');
  console.log('-'.repeat(40));
  console.log(`  Parent Lessons: ${parentLessons.length}`);
  console.log(`  Child Exercises: ${childExercises.length}`);
  if (parentLessons.length > 0) {
    console.log(`  Average Exercises per Lesson: ${(childExercises.length / parentLessons.length).toFixed(1)}`);
  }

  // Type distribution
  console.log('\n📊 TYPE DISTRIBUTION (All Records):');
  console.log('-'.repeat(40));

  const typeCount = {};
  assessments.forEach(a => {
    typeCount[a.type] = (typeCount[a.type] || 0) + 1;
  });

  Object.entries(typeCount)
    .sort((a, b) => b[1] - a[1])
    .forEach(([type, count]) => {
      const percentage = ((count / assessments.length) * 100).toFixed(1);
      console.log(`  ${type.padEnd(20)} : ${count.toString().padStart(4)} (${percentage}%)`);
    });

  // Subtype distribution
  console.log('\n📊 SUBTYPE DISTRIBUTION (All Records):');
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

  // Parent Lessons Analysis
  console.log('\n=' .repeat(80));
  console.log('📚 PARENT LESSONS ANALYSIS');
  console.log('=' .repeat(80));
  console.log(`Total Parent Lessons: ${parentLessons.length}\n`);

  console.log('Types of Parent Lessons:');
  console.log('-'.repeat(40));

  const parentTypes = {};
  parentLessons.forEach(p => {
    parentTypes[p.type] = (parentTypes[p.type] || 0) + 1;
  });

  Object.entries(parentTypes)
    .sort((a, b) => b[1] - a[1])
    .forEach(([type, count]) => {
      const percentage = ((count / parentLessons.length) * 100).toFixed(1);
      console.log(`  ${type.padEnd(20)} : ${count.toString().padStart(4)} (${percentage}%)`);
    });

  console.log('\nSubtypes of Parent Lessons:');
  console.log('-'.repeat(40));

  const parentSubtypes = {};
  parentLessons.forEach(p => {
    const subtype = p.subtype || 'none';
    parentSubtypes[subtype] = (parentSubtypes[subtype] || 0) + 1;
  });

  Object.entries(parentSubtypes)
    .sort((a, b) => b[1] - a[1])
    .forEach(([subtype, count]) => {
      const percentage = ((count / parentLessons.length) * 100).toFixed(1);
      console.log(`  ${subtype.padEnd(20)} : ${count.toString().padStart(4)} (${percentage}%)`);
    });

  // Child Exercises Analysis
  console.log('\n=' .repeat(80));
  console.log('🎯 CHILD EXERCISES ANALYSIS');
  console.log('=' .repeat(80));
  console.log(`Total Child Exercises: ${childExercises.length}\n`);

  console.log('Types of Child Exercises:');
  console.log('-'.repeat(40));

  const childTypes = {};
  childExercises.forEach(c => {
    childTypes[c.type] = (childTypes[c.type] || 0) + 1;
  });

  Object.entries(childTypes)
    .sort((a, b) => b[1] - a[1])
    .forEach(([type, count]) => {
      const percentage = ((count / childExercises.length) * 100).toFixed(1);
      console.log(`  ${type.padEnd(20)} : ${count.toString().padStart(4)} (${percentage}%)`);
    });

  console.log('\nSubtypes of Child Exercises:');
  console.log('-'.repeat(40));

  const childSubtypes = {};
  childExercises.forEach(c => {
    const subtype = c.subtype || 'none';
    childSubtypes[subtype] = (childSubtypes[subtype] || 0) + 1;
  });

  Object.entries(childSubtypes)
    .sort((a, b) => b[1] - a[1])
    .forEach(([subtype, count]) => {
      const percentage = ((count / childExercises.length) * 100).toFixed(1);
      console.log(`  ${subtype.padEnd(20)} : ${count.toString().padStart(4)} (${percentage}%)`);
    });

  // AI vs Non-AI Content
  console.log('\n=' .repeat(80));
  console.log('🤖 AI vs NON-AI CONTENT ANALYSIS');
  console.log('=' .repeat(80));

  const aiContent = assessments.filter(a => a.title && a.title.startsWith('AI'));
  const nonAiContent = assessments.filter(a => !a.title || !a.title.startsWith('AI'));

  console.log(`Total AI Content: ${aiContent.length} (${((aiContent.length / assessments.length) * 100).toFixed(1)}%)`);
  console.log(`Total Non-AI Content: ${nonAiContent.length} (${((nonAiContent.length / assessments.length) * 100).toFixed(1)}%)\n`);

  // AI breakdown
  const aiParents = parentLessons.filter(p => p.title && p.title.startsWith('AI'));
  const aiChildren = childExercises.filter(c => c.title && c.title.startsWith('AI'));

  console.log('AI Content Breakdown:');
  console.log('-'.repeat(40));
  console.log(`  AI Parent Lessons: ${aiParents.length}`);
  console.log(`  AI Child Exercises: ${aiChildren.length}`);

  // Grade level analysis
  const g1AI = aiContent.filter(a => a.title.includes('G1'));
  const g2AI = aiContent.filter(a => a.title.includes('G2'));

  console.log(`\n  Grade 1 AI: ${g1AI.length}`);
  console.log(`  Grade 2 AI: ${g2AI.length}`);

  // Top parent lessons with most exercises
  console.log('\n=' .repeat(80));
  console.log('📊 TOP 10 PARENT LESSONS BY EXERCISE COUNT');
  console.log('=' .repeat(80));

  const lessonStats = parentLessons.map(lesson => {
    const exercises = childExercises.filter(e => e.parent_lesson_id === lesson.id);
    return {
      id: lesson.id,
      title: lesson.title || 'Untitled',
      type: lesson.type,
      subtype: lesson.subtype,
      exerciseCount: exercises.length,
      exerciseSubtypes: [...new Set(exercises.map(e => e.subtype || 'none'))]
    };
  }).sort((a, b) => b.exerciseCount - a.exerciseCount);

  lessonStats.slice(0, 10).forEach((lesson, index) => {
    console.log(`\n${index + 1}. ${lesson.title}`);
    console.log(`   ID: ${lesson.id}`);
    console.log(`   Type: ${lesson.type} / Subtype: ${lesson.subtype || 'none'}`);
    console.log(`   Exercises: ${lesson.exerciseCount}`);
    if (lesson.exerciseCount > 0) {
      console.log(`   Exercise Types: ${lesson.exerciseSubtypes.join(', ')}`);
    }
  });

  // Lessons without exercises
  const childlessLessons = parentLessons.filter(p =>
    !childExercises.some(c => c.parent_lesson_id === p.id)
  );

  console.log('\n=' .repeat(80));
  console.log('⚠️  LESSONS WITHOUT EXERCISES');
  console.log('=' .repeat(80));
  console.log(`Total: ${childlessLessons.length} lessons have no exercises\n`);

  if (childlessLessons.length > 0 && childlessLessons.length <= 10) {
    childlessLessons.forEach((lesson, index) => {
      console.log(`${index + 1}. ${lesson.title || 'Untitled'} (${lesson.type}/${lesson.subtype || 'none'})`);
    });
  } else if (childlessLessons.length > 10) {
    console.log('Showing first 10:');
    childlessLessons.slice(0, 10).forEach((lesson, index) => {
      console.log(`${index + 1}. ${lesson.title || 'Untitled'} (${lesson.type}/${lesson.subtype || 'none'})`);
    });
  }

  // Recent activity
  console.log('\n=' .repeat(80));
  console.log('📅 RECENT ACTIVITY (Last 7 Days)');
  console.log('=' .repeat(80));

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const recentAssessments = assessments.filter(a =>
    new Date(a.created_at) >= sevenDaysAgo
  );

  console.log(`Total Created in Last 7 Days: ${recentAssessments.length}\n`);

  // Group by day
  const byDay = {};
  recentAssessments.forEach(a => {
    const day = new Date(a.created_at).toLocaleDateString();
    byDay[day] = (byDay[day] || 0) + 1;
  });

  console.log('Daily Breakdown:');
  console.log('-'.repeat(40));
  Object.entries(byDay)
    .sort((a, b) => new Date(b[0]) - new Date(a[0]))
    .forEach(([day, count]) => {
      console.log(`  ${day}: ${count} assessments`);
    });

  // Content Quality Check
  console.log('\n=' .repeat(80));
  console.log('✅ CONTENT QUALITY METRICS');
  console.log('=' .repeat(80));

  let withImages = 0;
  let withQuestions = 0;
  let withAnswers = 0;
  let complete = 0;
  let withVoiceGuidance = 0;

  assessments.forEach(a => {
    if (a.voice_guidance) withVoiceGuidance++;

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

  console.log(`  With Images: ${withImages} (${((withImages / assessments.length) * 100).toFixed(1)}%)`);
  console.log(`  With Questions: ${withQuestions} (${((withQuestions / assessments.length) * 100).toFixed(1)}%)`);
  console.log(`  With Answers: ${withAnswers} (${((withAnswers / assessments.length) * 100).toFixed(1)}%)`);
  console.log(`  With Voice Guidance: ${withVoiceGuidance} (${((withVoiceGuidance / assessments.length) * 100).toFixed(1)}%)`);
  console.log(`  Complete (Q&A): ${complete} (${((complete / assessments.length) * 100).toFixed(1)}%)`);

  // Order in Lesson Analysis
  console.log('\n=' .repeat(80));
  console.log('📐 EXERCISE ORDERING ANALYSIS');
  console.log('=' .repeat(80));

  const withOrder = childExercises.filter(e => e.order_in_lesson !== null && e.order_in_lesson !== undefined);
  const withoutOrder = childExercises.filter(e => e.order_in_lesson === null || e.order_in_lesson === undefined);

  console.log(`  Exercises with order_in_lesson: ${withOrder.length} (${((withOrder.length / childExercises.length) * 100).toFixed(1)}%)`);
  console.log(`  Exercises without order: ${withoutOrder.length} (${((withoutOrder.length / childExercises.length) * 100).toFixed(1)}%)`);

  // Language distribution
  console.log('\n=' .repeat(80));
  console.log('🌐 LANGUAGE DISTRIBUTION');
  console.log('=' .repeat(80));

  const languages = {};
  assessments.forEach(a => {
    const lang = a.language || 'not set';
    languages[lang] = (languages[lang] || 0) + 1;
  });

  Object.entries(languages)
    .sort((a, b) => b[1] - a[1])
    .forEach(([lang, count]) => {
      const percentage = ((count / assessments.length) * 100).toFixed(1);
      console.log(`  ${lang.padEnd(15)} : ${count.toString().padStart(4)} (${percentage}%)`);
    });

  // Data Issues
  console.log('\n=' .repeat(80));
  console.log('⚠️  DATA QUALITY ISSUES');
  console.log('=' .repeat(80));

  // Check for orphaned exercises
  const parentIds = new Set(parentLessons.map(p => p.id));
  const orphaned = childExercises.filter(c => !parentIds.has(c.parent_lesson_id));

  console.log(`  Orphaned Exercises: ${orphaned.length}`);
  if (orphaned.length > 0) {
    console.log('    (Exercises with non-existent parent_lesson_id)');
  }

  // Check for mixed types
  const exerciseTypeParents = parentLessons.filter(p => p.type === 'exercise');
  const lessonTypeChildren = childExercises.filter(c => c.type === 'lesson');

  console.log(`  Parent records with type='exercise': ${exerciseTypeParents.length}`);
  console.log(`  Child records with type='lesson': ${lessonTypeChildren.length}`);

  // Check parent_assessment_id usage
  const usingOldField = assessments.filter(a => a.parent_assessment_id);
  console.log(`  Records using deprecated parent_assessment_id: ${usingOldField.length}`);

  // Final Summary
  console.log('\n' + '='.repeat(80));
  console.log('📊 FINAL SUMMARY');
  console.log('='.repeat(80));
  console.log(`Total Assessments: ${assessments.length}`);
  console.log(`Parent Lessons: ${parentLessons.length}`);
  console.log(`Child Exercises: ${childExercises.length}`);
  console.log(`AI-Generated: ${aiContent.length}`);
  console.log(`Manual Content: ${nonAiContent.length}`);
  console.log(`Lessons with Exercises: ${parentLessons.length - childlessLessons.length}`);
  console.log(`Lessons without Exercises: ${childlessLessons.length}`);
  console.log(`Average Exercises per Lesson (with exercises): ${
    parentLessons.length - childlessLessons.length > 0
      ? (childExercises.length / (parentLessons.length - childlessLessons.length)).toFixed(1)
      : 0
  }`);

  console.log('\nContent Completeness:');
  console.log(`  ${((complete / assessments.length) * 100).toFixed(1)}% fully structured`);
  console.log(`  ${((withImages / assessments.length) * 100).toFixed(1)}% with images`);
  console.log(`  ${((withVoiceGuidance / assessments.length) * 100).toFixed(1)}% with voice guidance`);

  console.log('\n' + '='.repeat(80));
  console.log('Analysis completed:', new Date().toISOString());
  console.log('='.repeat(80) + '\n');

  // Sign out
  await supabase.auth.signOut();
  console.log('✅ Signed out from Supabase\n');
}

// Run the analysis
runCompleteAnalysis().catch(console.error);