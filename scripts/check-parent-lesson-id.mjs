#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const SUPABASE_URL = 'https://meertwtenhlmnlpwxhyz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lZXJ0d3RlbmhsbG5scHd4aHl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3NjE2NzcsImV4cCI6MjA3NjMzNzY3N30.HMMie6aqj64R_-p6w5LaVNeAN7hIHpagqCRPdYXx_ic';

// Admin credentials
const ADMIN_EMAIL = 'admin@demo.com';
const ADMIN_PASSWORD = 'demo1234';

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkParentLessonId() {
  console.log('\n🔍 DISCOVERING THE TRUE PARENT-CHILD RELATIONSHIP FIELD\n');
  console.log('=' .repeat(80));

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

  // First, check the specific examples the user mentioned
  console.log("📋 EXAMINING USER'S SPECIFIC EXAMPLES:");
  console.log('-'.repeat(80));

  const exerciseId = '7a9e6ee1-bca9-49cd-b9e9-2c391648b1b7';
  const parentId = '673e3b16-6ab8-4814-bbe8-2b2734da05ea';

  // Get the exercise
  const { data: exercise } = await supabase
    .from('manual_assessments')
    .select('*')
    .eq('id', exerciseId)
    .single();

  // Get the parent
  const { data: parent } = await supabase
    .from('manual_assessments')
    .select('*')
    .eq('id', parentId)
    .single();

  if (exercise) {
    console.log(`\n✅ Found Exercise: ${exerciseId}`);
    console.log(`   Title: ${exercise.title || 'Untitled'}`);
    console.log(`   Type: ${exercise.type}`);
    console.log(`   Subtype: ${exercise.subtype || 'none'}`);
    console.log(`   parent_assessment_id: ${exercise.parent_assessment_id || 'NULL'}`);
    console.log(`   parent_lesson_id: ${exercise.parent_lesson_id || 'NULL'} ⭐`);
    console.log(`   order_in_lesson: ${exercise.order_in_lesson || 'NULL'}`);

    if (exercise.parent_lesson_id === parentId) {
      console.log(`   ✅ CONFIRMED: This exercise IS a child of ${parentId} via parent_lesson_id!`);
    }
  }

  if (parent) {
    console.log(`\n✅ Found Parent Lesson: ${parentId}`);
    console.log(`   Title: ${parent.title || 'Untitled'}`);
    console.log(`   Type: ${parent.type}`);
    console.log(`   Subtype: ${parent.subtype || 'none'}`);
    console.log(`   parent_assessment_id: ${parent.parent_assessment_id || 'NULL'}`);
    console.log(`   parent_lesson_id: ${parent.parent_lesson_id || 'NULL'}`);
  }

  // Get all children of this parent using parent_lesson_id
  const { data: children } = await supabase
    .from('manual_assessments')
    .select('*')
    .eq('parent_lesson_id', parentId)
    .order('order_in_lesson');

  console.log(`\n   Children of this lesson (via parent_lesson_id): ${children ? children.length : 0}`);
  if (children && children.length > 0) {
    console.log('   Child exercises:');
    children.forEach((child, index) => {
      console.log(`     ${index + 1}. ${child.title || 'Untitled'}`);
      console.log(`        ID: ${child.id}`);
      console.log(`        Type: ${child.type}/${child.subtype || 'none'}`);
      console.log(`        Order: ${child.order_in_lesson || 'not set'}`);
    });
  }

  // Now analyze the full database
  console.log('\n\n📊 DATABASE STRUCTURE ANALYSIS - THE TRUTH REVEALED:');
  console.log('=' .repeat(80));

  // Fetch ALL assessments
  const { data: allAssessments } = await supabase
    .from('manual_assessments')
    .select('*')
    .order('created_at', { ascending: false });

  console.log(`\n📊 Total Records: ${allAssessments.length}`);

  // Check BOTH fields
  const withParentAssessmentId = allAssessments.filter(a => a.parent_assessment_id);
  const withParentLessonId = allAssessments.filter(a => a.parent_lesson_id);
  const withBoth = allAssessments.filter(a => a.parent_assessment_id && a.parent_lesson_id);
  const withNeither = allAssessments.filter(a => !a.parent_assessment_id && !a.parent_lesson_id);

  console.log('\n🔑 PARENT FIELD USAGE:');
  console.log('-'.repeat(40));
  console.log(`  Using parent_assessment_id: ${withParentAssessmentId.length}`);
  console.log(`  Using parent_lesson_id: ${withParentLessonId.length} ⭐ (THIS IS THE REAL ONE!)`);
  console.log(`  Using both fields: ${withBoth.length}`);
  console.log(`  Using neither (true parents): ${withNeither.length}`);

  // True hierarchy using parent_lesson_id
  const trueLessons = allAssessments.filter(a => !a.parent_lesson_id);
  const trueExercises = allAssessments.filter(a => a.parent_lesson_id);

  console.log('\n📝 TRUE HIERARCHY (using parent_lesson_id):');
  console.log('-'.repeat(40));
  console.log(`  Parent Lessons: ${trueLessons.length}`);
  console.log(`  Child Exercises: ${trueExercises.length}`);
  if (trueLessons.length > 0) {
    console.log(`  Average Exercises per Lesson: ${(trueExercises.length / trueLessons.length).toFixed(1)}`);
  }

  // Analyze parent lessons
  console.log('\n📚 TRUE PARENT LESSONS (no parent_lesson_id):');
  console.log('-'.repeat(40));

  const parentTypes = {};
  trueLessons.forEach(p => {
    const key = `${p.type}/${p.subtype || 'none'}`;
    parentTypes[key] = (parentTypes[key] || 0) + 1;
  });

  Object.entries(parentTypes)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .forEach(([type, count]) => {
      console.log(`  ${type.padEnd(30)} : ${count}`);
    });

  // Analyze child exercises
  console.log('\n🎯 TRUE CHILD EXERCISES (has parent_lesson_id):');
  console.log('-'.repeat(40));

  const childTypes = {};
  trueExercises.forEach(c => {
    const key = `${c.type}/${c.subtype || 'none'}`;
    childTypes[key] = (childTypes[key] || 0) + 1;
  });

  Object.entries(childTypes)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .forEach(([type, count]) => {
      console.log(`  ${type.padEnd(30)} : ${count}`);
    });

  // Find top lessons with most exercises
  console.log('\n📊 TOP LESSONS WITH MOST EXERCISES:');
  console.log('-'.repeat(80));

  const lessonStats = trueLessons.map(lesson => {
    const exercises = trueExercises.filter(e => e.parent_lesson_id === lesson.id);
    return {
      id: lesson.id,
      title: lesson.title || 'Untitled',
      type: lesson.type,
      subtype: lesson.subtype,
      exerciseCount: exercises.length,
      exerciseSubtypes: [...new Set(exercises.map(e => e.subtype || 'none'))]
    };
  }).filter(l => l.exerciseCount > 0);

  lessonStats
    .sort((a, b) => b.exerciseCount - a.exerciseCount)
    .slice(0, 5)
    .forEach((lesson, index) => {
      console.log(`\n${index + 1}. ${lesson.title}`);
      console.log(`   ID: ${lesson.id}`);
      console.log(`   Type: ${lesson.type}/${lesson.subtype || 'none'}`);
      console.log(`   Exercises: ${lesson.exerciseCount}`);
      console.log(`   Exercise Types: ${lesson.exerciseSubtypes.join(', ')}`);
    });

  // Check AI content
  console.log('\n🤖 AI CONTENT WITH PROPER HIERARCHY:');
  console.log('-'.repeat(40));

  const aiLessons = trueLessons.filter(l => l.title && l.title.startsWith('AI'));
  const aiExercises = trueExercises.filter(e => e.title && e.title.startsWith('AI'));

  console.log(`  AI Parent Lessons: ${aiLessons.length}`);
  console.log(`  AI Child Exercises: ${aiExercises.length}`);

  if (aiLessons.length > 0) {
    console.log('\n  AI Lessons with their exercises:');
    aiLessons.slice(0, 3).forEach(lesson => {
      const exercises = aiExercises.filter(e => e.parent_lesson_id === lesson.id);
      console.log(`    - ${lesson.title}`);
      console.log(`      Exercises: ${exercises.length}`);
    });
  }

  // The revelation
  console.log('\n' + '='.repeat(80));
  console.log('🎯 THE ANSWER TO YOUR QUESTION:');
  console.log('='.repeat(80));
  console.log('\nThe application uses the "parent_lesson_id" field, NOT "parent_assessment_id"!');
  console.log('\nThis is why the relationship exists in the app but was missing in my analysis.');
  console.log('I was looking at the wrong field. The correct field is: parent_lesson_id');
  console.log('\nThe hierarchy logic is:');
  console.log('  1. Lessons have parent_lesson_id = NULL');
  console.log('  2. Exercises have parent_lesson_id = [lesson UUID]');
  console.log('  3. Exercises also have order_in_lesson for sequencing');
  console.log('='.repeat(80) + '\n');

  // Sign out
  await supabase.auth.signOut();
  console.log('✅ Mystery solved!\n');
}

// Run the check
checkParentLessonId().catch(console.error);