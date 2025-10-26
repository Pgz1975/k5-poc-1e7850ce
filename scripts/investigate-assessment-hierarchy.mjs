#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

// Use environment variables directly
const supabaseUrl = 'https://meertwtenhlmnlpwxhyz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lZXJ0d3RlbmhsbG5scHd4aHl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3NjE2NzcsImV4cCI6MjA3NjMzNzY3N30.HMMie6aqj64R_-p6w5LaVNeAN7hIHpagqCRPdYXx_ic';

// Admin credentials
const ADMIN_EMAIL = 'admin@demo.com';
const ADMIN_PASSWORD = 'demo1234';

async function investigateHierarchy() {
  console.log('\n🔍 INVESTIGATING ASSESSMENT HIERARCHY\n');
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

  // First, let's look at the specific examples the user mentioned
  console.log("📋 EXAMINING USER'S EXAMPLES:");
  console.log('-'.repeat(80));

  // Check the specific exercise
  const { data: exercise, error: exerciseError } = await supabase
    .from('manual_assessments')
    .select('*')
    .eq('id', '7a9e6ee1-bca9-49cd-b9e9-2c391648b1b7')
    .single();

  if (exercise && !exerciseError) {
    console.log('\n✅ Found Exercise: 7a9e6ee1-bca9-49cd-b9e9-2c391648b1b7');
    console.log(`   Title: ${exercise.title || 'Untitled'}`);
    console.log(`   Type: ${exercise.type}`);
    console.log(`   Subtype: ${exercise.subtype || 'none'}`);
    console.log(`   Parent ID: ${exercise.parent_assessment_id || 'NULL'}`);
    console.log(`   Created: ${new Date(exercise.created_at).toLocaleString()}`);
  } else {
    console.log('\n❌ Exercise not found: 7a9e6ee1-bca9-49cd-b9e9-2c391648b1b7');
  }

  // Check the specific parent lesson
  const { data: parent, error: parentError } = await supabase
    .from('manual_assessments')
    .select('*')
    .eq('id', '673e3b16-6ab8-4814-bbe8-2b2734da05ea')
    .single();

  if (parent && !parentError) {
    console.log('\n✅ Found Parent Lesson: 673e3b16-6ab8-4814-bbe8-2b2734da05ea');
    console.log(`   Title: ${parent.title || 'Untitled'}`);
    console.log(`   Type: ${parent.type}`);
    console.log(`   Subtype: ${parent.subtype || 'none'}`);
    console.log(`   Parent ID: ${parent.parent_assessment_id || 'NULL (This is a parent)'}`);
    console.log(`   Created: ${new Date(parent.created_at).toLocaleString()}`);
  } else {
    console.log('\n❌ Parent lesson not found: 673e3b16-6ab8-4814-bbe8-2b2734da05ea');
  }

  // Now let's properly analyze the entire hierarchy
  console.log('\n\n📊 COMPLETE HIERARCHY ANALYSIS:');
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
  const parentLessons = allAssessments.filter(a => !a.parent_assessment_id || a.parent_assessment_id === null);
  const childExercises = allAssessments.filter(a => a.parent_assessment_id && a.parent_assessment_id !== null);

  console.log('\n📝 HIERARCHY BREAKDOWN:');
  console.log('-'.repeat(40));
  console.log(`  Parent Lessons (no parent_id): ${parentLessons.length}`);
  console.log(`  Child Exercises (has parent_id): ${childExercises.length}`);
  console.log(`  Average Exercises per Lesson: ${(childExercises.length / Math.max(parentLessons.length, 1)).toFixed(1)}`);

  // Analyze parent lessons by type/subtype
  console.log('\n📚 PARENT LESSONS ANALYSIS:');
  console.log('-'.repeat(40));

  const parentTypes = {};
  parentLessons.forEach(p => {
    const key = `${p.type}/${p.subtype || 'none'}`;
    parentTypes[key] = (parentTypes[key] || 0) + 1;
  });

  console.log('Type/Subtype combinations:');
  Object.entries(parentTypes)
    .sort((a, b) => b[1] - a[1])
    .forEach(([combo, count]) => {
      console.log(`  ${combo.padEnd(30)} : ${count}`);
    });

  // Analyze child exercises by type/subtype
  console.log('\n🎯 CHILD EXERCISES ANALYSIS:');
  console.log('-'.repeat(40));

  const childTypes = {};
  childExercises.forEach(c => {
    const key = `${c.type}/${c.subtype || 'none'}`;
    childTypes[key] = (childTypes[key] || 0) + 1;
  });

  console.log('Type/Subtype combinations:');
  Object.entries(childTypes)
    .sort((a, b) => b[1] - a[1])
    .forEach(([combo, count]) => {
      console.log(`  ${combo.padEnd(30)} : ${count}`);
    });

  // Find lessons with most children
  console.log('\n📊 TOP PARENT LESSONS BY EXERCISE COUNT:');
  console.log('-'.repeat(80));

  const parentChildCount = {};
  parentLessons.forEach(p => {
    const childCount = childExercises.filter(c => c.parent_assessment_id === p.id).length;
    parentChildCount[p.id] = {
      title: p.title || 'Untitled',
      type: p.type,
      subtype: p.subtype,
      count: childCount
    };
  });

  // Sort and display top 10
  Object.entries(parentChildCount)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 10)
    .forEach(([id, data], index) => {
      console.log(`\n${index + 1}. ${data.title}`);
      console.log(`   ID: ${id}`);
      console.log(`   Type/Subtype: ${data.type}/${data.subtype || 'none'}`);
      console.log(`   Child Exercises: ${data.count}`);

      // Show child exercise types
      if (data.count > 0) {
        const children = childExercises.filter(c => c.parent_assessment_id === id);
        const childSubtypes = [...new Set(children.map(c => c.subtype || 'none'))];
        console.log(`   Exercise Types: ${childSubtypes.join(', ')}`);
      }
    });

  // Check for orphaned exercises (exercises with non-existent parent_ids)
  console.log('\n⚠️  ORPHANED EXERCISES CHECK:');
  console.log('-'.repeat(40));

  const parentIds = new Set(parentLessons.map(p => p.id));
  const orphaned = childExercises.filter(c => !parentIds.has(c.parent_assessment_id));

  if (orphaned.length > 0) {
    console.log(`  Found ${orphaned.length} orphaned exercises!`);
    orphaned.slice(0, 5).forEach(o => {
      console.log(`    - ${o.title || 'Untitled'} (Parent ID: ${o.parent_assessment_id})`);
    });
  } else {
    console.log('  ✅ No orphaned exercises found - all children have valid parents');
  }

  // Analyze AI content hierarchy
  console.log('\n🤖 AI CONTENT HIERARCHY:');
  console.log('-'.repeat(40));

  const aiParents = parentLessons.filter(p => p.title && p.title.startsWith('AI'));
  const aiChildren = childExercises.filter(c => c.title && c.title.startsWith('AI'));

  console.log(`  AI Parent Lessons: ${aiParents.length}`);
  console.log(`  AI Child Exercises: ${aiChildren.length}`);

  if (aiParents.length > 0) {
    console.log('\n  Sample AI Parent Lessons:');
    aiParents.slice(0, 3).forEach(p => {
      const childCount = childExercises.filter(c => c.parent_assessment_id === p.id).length;
      console.log(`    - ${p.title}`);
      console.log(`      Type: ${p.type}/${p.subtype || 'none'}`);
      console.log(`      Children: ${childCount}`);
    });
  }

  // Check the recent Grade 2 content
  console.log('\n📚 GRADE 2 CONTENT ANALYSIS:');
  console.log('-'.repeat(40));

  const g2Content = allAssessments.filter(a => a.title && a.title.includes('G2'));
  const g2Parents = g2Content.filter(a => !a.parent_assessment_id);
  const g2Children = g2Content.filter(a => a.parent_assessment_id);

  console.log(`  Total G2 Content: ${g2Content.length}`);
  console.log(`  G2 Parent Lessons: ${g2Parents.length}`);
  console.log(`  G2 Child Exercises: ${g2Children.length}`);

  if (g2Parents.length > 0) {
    console.log('\n  G2 Parent Lessons:');
    g2Parents.forEach(p => {
      const children = g2Children.filter(c => c.parent_assessment_id === p.id);
      console.log(`    - ${p.title}`);
      console.log(`      Children: ${children.length}`);
      if (children.length > 0) {
        const subtypes = [...new Set(children.map(c => c.subtype || 'none'))];
        console.log(`      Exercise Types: ${subtypes.join(', ')}`);
      }
    });
  }

  // Summary
  console.log('\n' + '='.repeat(80));
  console.log('📊 CORRECTED SUMMARY:');
  console.log('='.repeat(80));
  console.log(`Total Assessments: ${allAssessments.length}`);
  console.log(`Parent Lessons: ${parentLessons.length}`);
  console.log(`Child Exercises: ${childExercises.length}`);
  console.log(`Orphaned Exercises: ${orphaned.length}`);
  console.log(`Average Children per Parent: ${(childExercises.length / Math.max(parentLessons.length, 1)).toFixed(1)}`);

  // Most common patterns
  console.log('\nMost Common Patterns:');
  console.log(`  Parent Type: ${Object.entries(parentTypes)[0]?.[0] || 'N/A'}`);
  console.log(`  Child Type: ${Object.entries(childTypes)[0]?.[0] || 'N/A'}`);

  console.log('='.repeat(80) + '\n');

  // Sign out
  await supabase.auth.signOut();
  console.log('✅ Investigation complete!\n');
}

// Run the investigation
investigateHierarchy().catch(console.error);