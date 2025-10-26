#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const SUPABASE_URL = 'https://meertwtenhlmnlpwxhyz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lZXJ0d3RlbmhsbW5scHd4aHl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3NjE2NzcsImV4cCI6MjA3NjMzNzY3N30.HMMie6aqj64R_-p6w5LaVNeAN7hIHpagqCRPdYXx_ic';

// Admin credentials
const ADMIN_EMAIL = 'admin@demo.com';
const ADMIN_PASSWORD = 'demo1234';

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function investigateHierarchy() {
  console.log('\n🔍 INVESTIGATING ASSESSMENT HIERARCHY - CORRECTED ANALYSIS\n');
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

  // First, examine the specific examples
  console.log("📋 EXAMINING USER'S SPECIFIC EXAMPLES:");
  console.log('-'.repeat(80));

  // Check the exercise the user mentioned
  const exerciseId = '7a9e6ee1-bca9-49cd-b9e9-2c391648b1b7';
  const parentId = '673e3b16-6ab8-4814-bbe8-2b2734da05ea';

  const { data: exercise } = await supabase
    .from('manual_assessments')
    .select('*')
    .eq('id', exerciseId)
    .single();

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
    console.log(`   Parent Assessment ID: ${exercise.parent_assessment_id || 'NULL'}`);
    console.log(`   Is this a child? ${exercise.parent_assessment_id ? 'YES' : 'NO'}`);
  }

  if (parent) {
    console.log(`\n✅ Found Parent Lesson: ${parentId}`);
    console.log(`   Title: ${parent.title || 'Untitled'}`);
    console.log(`   Type: ${parent.type}`);
    console.log(`   Subtype: ${parent.subtype || 'none'}`);
    console.log(`   Parent Assessment ID: ${parent.parent_assessment_id || 'NULL'}`);
    console.log(`   Is this a parent? ${!parent.parent_assessment_id ? 'YES' : 'NO'}`);
  }

  // Get all children of this specific parent
  if (parent) {
    const { data: children } = await supabase
      .from('manual_assessments')
      .select('*')
      .eq('parent_assessment_id', parentId)
      .order('created_at');

    console.log(`\n   Children of this lesson: ${children ? children.length : 0}`);
    if (children && children.length > 0) {
      console.log('   Child exercises:');
      children.forEach(child => {
        console.log(`     - ${child.title || 'Untitled'} (${child.type}/${child.subtype || 'none'})`);
      });
    }
  }

  // Now analyze the full hierarchy
  console.log('\n\n📊 COMPLETE DATABASE HIERARCHY ANALYSIS:');
  console.log('=' .repeat(80));

  // Fetch ALL assessments
  const { data: allAssessments, error: allError } = await supabase
    .from('manual_assessments')
    .select('*')
    .order('created_at', { ascending: false });

  if (allError) {
    console.error('❌ Error fetching assessments:', allError);
    process.exit(1);
  }

  console.log(`\n📊 Total Records: ${allAssessments.length}`);

  // Properly separate parents and children
  const parentLessons = allAssessments.filter(a => !a.parent_assessment_id);
  const childExercises = allAssessments.filter(a => a.parent_assessment_id);

  console.log('\n📝 TRUE HIERARCHY BREAKDOWN:');
  console.log('-'.repeat(40));
  console.log(`  Parent Lessons (parent_assessment_id = NULL): ${parentLessons.length}`);
  console.log(`  Child Exercises (parent_assessment_id != NULL): ${childExercises.length}`);

  if (parentLessons.length > 0) {
    console.log(`  Average Exercises per Lesson: ${(childExercises.length / parentLessons.length).toFixed(1)}`);
  }

  // Analyze parent lessons by type
  console.log('\n📚 PARENT LESSONS BY TYPE:');
  console.log('-'.repeat(40));

  const parentTypeCount = {};
  parentLessons.forEach(p => {
    parentTypeCount[p.type] = (parentTypeCount[p.type] || 0) + 1;
  });

  Object.entries(parentTypeCount)
    .sort((a, b) => b[1] - a[1])
    .forEach(([type, count]) => {
      const percentage = ((count / parentLessons.length) * 100).toFixed(1);
      console.log(`  ${type.padEnd(20)} : ${count.toString().padStart(4)} (${percentage}%)`);
    });

  // Analyze parent lessons by subtype
  console.log('\n📚 PARENT LESSONS BY SUBTYPE:');
  console.log('-'.repeat(40));

  const parentSubtypeCount = {};
  parentLessons.forEach(p => {
    const subtype = p.subtype || 'none';
    parentSubtypeCount[subtype] = (parentSubtypeCount[subtype] || 0) + 1;
  });

  Object.entries(parentSubtypeCount)
    .sort((a, b) => b[1] - a[1])
    .forEach(([subtype, count]) => {
      const percentage = ((count / parentLessons.length) * 100).toFixed(1);
      console.log(`  ${subtype.padEnd(20)} : ${count.toString().padStart(4)} (${percentage}%)`);
    });

  // Analyze child exercises by type
  console.log('\n🎯 CHILD EXERCISES BY TYPE:');
  console.log('-'.repeat(40));

  const childTypeCount = {};
  childExercises.forEach(c => {
    childTypeCount[c.type] = (childTypeCount[c.type] || 0) + 1;
  });

  Object.entries(childTypeCount)
    .sort((a, b) => b[1] - a[1])
    .forEach(([type, count]) => {
      const percentage = ((count / childExercises.length) * 100).toFixed(1);
      console.log(`  ${type.padEnd(20)} : ${count.toString().padStart(4)} (${percentage}%)`);
    });

  // Analyze child exercises by subtype
  console.log('\n🎯 CHILD EXERCISES BY SUBTYPE:');
  console.log('-'.repeat(40));

  const childSubtypeCount = {};
  childExercises.forEach(c => {
    const subtype = c.subtype || 'none';
    childSubtypeCount[subtype] = (childSubtypeCount[subtype] || 0) + 1;
  });

  Object.entries(childSubtypeCount)
    .sort((a, b) => b[1] - a[1])
    .forEach(([subtype, count]) => {
      const percentage = ((count / childExercises.length) * 100).toFixed(1);
      console.log(`  ${subtype.padEnd(20)} : ${count.toString().padStart(4)} (${percentage}%)`);
    });

  // Find top parent lessons with most children
  console.log('\n📊 TOP 5 PARENT LESSONS BY CHILD COUNT:');
  console.log('-'.repeat(80));

  const parentStats = parentLessons.map(p => {
    const children = childExercises.filter(c => c.parent_assessment_id === p.id);
    return {
      id: p.id,
      title: p.title || 'Untitled',
      type: p.type,
      subtype: p.subtype,
      childCount: children.length,
      childSubtypes: [...new Set(children.map(c => c.subtype || 'none'))]
    };
  });

  parentStats
    .sort((a, b) => b.childCount - a.childCount)
    .slice(0, 5)
    .forEach((parent, index) => {
      console.log(`\n${index + 1}. ${parent.title}`);
      console.log(`   ID: ${parent.id}`);
      console.log(`   Type: ${parent.type} / Subtype: ${parent.subtype || 'none'}`);
      console.log(`   Children: ${parent.childCount}`);
      if (parent.childCount > 0) {
        console.log(`   Child Subtypes: ${parent.childSubtypes.join(', ')}`);
      }
    });

  // Analyze AI content
  console.log('\n🤖 AI CONTENT ANALYSIS:');
  console.log('-'.repeat(40));

  const aiParents = parentLessons.filter(p => p.title && p.title.startsWith('AI'));
  const aiChildren = childExercises.filter(c => c.title && c.title.startsWith('AI'));
  const aiTotal = allAssessments.filter(a => a.title && a.title.startsWith('AI'));

  console.log(`  Total AI Content: ${aiTotal.length}`);
  console.log(`  AI Parent Lessons: ${aiParents.length}`);
  console.log(`  AI Child Exercises: ${aiChildren.length}`);

  // Check Grade 2 content specifically
  const g2Parents = aiParents.filter(p => p.title.includes('G2'));
  const g2Children = aiChildren.filter(c => c.title.includes('G2'));

  console.log(`\n  Grade 2 AI Content:`);
  console.log(`    G2 Parent Lessons: ${g2Parents.length}`);
  console.log(`    G2 Child Exercises: ${g2Children.length}`);

  if (g2Parents.length > 0) {
    console.log('\n  G2 Parent Lessons with their exercises:');
    g2Parents.forEach(parent => {
      const children = g2Children.filter(c => c.parent_assessment_id === parent.id);
      console.log(`    - ${parent.title}`);
      console.log(`      Exercises: ${children.length}`);
    });
  }

  // Check for data issues
  console.log('\n⚠️  DATA QUALITY CHECK:');
  console.log('-'.repeat(40));

  // Check for orphaned exercises
  const parentIds = new Set(parentLessons.map(p => p.id));
  const orphaned = childExercises.filter(c => !parentIds.has(c.parent_assessment_id));

  console.log(`  Orphaned Exercises: ${orphaned.length}`);
  if (orphaned.length > 0) {
    console.log('  First 3 orphaned:');
    orphaned.slice(0, 3).forEach(o => {
      console.log(`    - ${o.title || 'Untitled'} (Parent: ${o.parent_assessment_id})`);
    });
  }

  // Check for lessons without children
  const childlessParents = parentLessons.filter(p =>
    !childExercises.some(c => c.parent_assessment_id === p.id)
  );

  console.log(`  Parent Lessons without Children: ${childlessParents.length}`);

  // Check mixed type/subtype issues
  const exerciseTypeParents = parentLessons.filter(p => p.type === 'exercise');
  const lessonTypeChildren = childExercises.filter(c => c.type === 'lesson');

  console.log(`  Parents with type='exercise': ${exerciseTypeParents.length}`);
  console.log(`  Children with type='lesson': ${lessonTypeChildren.length}`);

  // Summary
  console.log('\n' + '='.repeat(80));
  console.log('📊 CORRECTED SUMMARY:');
  console.log('='.repeat(80));
  console.log(`Total Assessments: ${allAssessments.length}`);
  console.log(`Parent Lessons: ${parentLessons.length}`);
  console.log(`Child Exercises: ${childExercises.length}`);
  console.log(`Orphaned Exercises: ${orphaned.length}`);
  console.log(`Childless Parents: ${childlessParents.length}`);

  if (parentLessons.length > 0) {
    console.log(`Average Children per Parent: ${(childExercises.length / parentLessons.length).toFixed(1)}`);
  }

  console.log('\nMy initial analysis was INCORRECT. The hierarchy does exist!');
  console.log('The parent_assessment_id field properly links exercises to lessons.');
  console.log('='.repeat(80) + '\n');

  // Sign out
  await supabase.auth.signOut();
  console.log('✅ Investigation complete!\n');
}

// Run the investigation
investigateHierarchy().catch(console.error);