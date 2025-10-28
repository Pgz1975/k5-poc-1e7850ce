#!/usr/bin/env node
/**
 * Comprehensive Activity Type Analysis
 * Queries Supabase to understand all activity types and their structures
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://meertwtenhlmnlpwxhyz.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_KEY) {
  console.error('❌ Missing SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function analyzeActivityTypes() {
  console.log('🔍 Analyzing Activity Types in manual_assessments table...\n');

  try {
    // Get all activities
    const { data: activities, error } = await supabase
      .from('manual_assessments')
      .select('id, title, type, subtype, language, content, voice_guidance, coqui_dialogue, pronunciation_words')
      .order('type', { ascending: true })
      .order('subtype', { ascending: true });

    if (error) throw error;

    console.log(`📊 Total Activities: ${activities.length}\n`);

    // Group by type
    const typeGroups = {};
    const subtypeGroups = {};
    const contentStructures = {};

    activities.forEach(activity => {
      const type = activity.type || 'unknown';
      const subtype = activity.subtype || 'no_subtype';

      // Group by type
      if (!typeGroups[type]) typeGroups[type] = [];
      typeGroups[type].push(activity);

      // Group by subtype
      if (!subtypeGroups[subtype]) subtypeGroups[subtype] = [];
      subtypeGroups[subtype].push(activity);

      // Analyze content structure
      if (activity.content) {
        const contentKeys = Object.keys(activity.content).sort().join(',');
        if (!contentStructures[subtype]) contentStructures[subtype] = new Set();
        contentStructures[subtype].add(contentKeys);
      }
    });

    // Print Type Summary
    console.log('═══════════════════════════════════════════════════════');
    console.log('📁 ACTIVITY TYPES');
    console.log('═══════════════════════════════════════════════════════\n');

    Object.entries(typeGroups).forEach(([type, acts]) => {
      console.log(`${type.toUpperCase()} (${acts.length} activities)`);
    });

    // Print Subtype Summary
    console.log('\n═══════════════════════════════════════════════════════');
    console.log('🏷️  ACTIVITY SUBTYPES');
    console.log('═══════════════════════════════════════════════════════\n');

    const sortedSubtypes = Object.entries(subtypeGroups).sort((a, b) => b[1].length - a[1].length);

    sortedSubtypes.forEach(([subtype, acts]) => {
      console.log(`\n${subtype} (${acts.length} activities)`);
      console.log('─────────────────────────────────────────────────────');

      // Show first 3 examples
      acts.slice(0, 3).forEach(act => {
        console.log(`  • ${act.title} [${act.language || 'no-lang'}]`);
      });

      // Show content structure
      if (contentStructures[subtype] && contentStructures[subtype].size > 0) {
        console.log(`\n  Content Fields: ${Array.from(contentStructures[subtype])[0]}`);
      }

      // Voice guidance info
      const withVoice = acts.filter(a => a.voice_guidance).length;
      const withDialogue = acts.filter(a => a.coqui_dialogue).length;
      const withPronunciation = acts.filter(a => a.pronunciation_words && a.pronunciation_words.length > 0).length;

      console.log(`\n  Voice Features:`);
      console.log(`    - Custom Guidance: ${withVoice}/${acts.length}`);
      console.log(`    - Coqui Dialogue: ${withDialogue}/${acts.length}`);
      console.log(`    - Pronunciation Words: ${withPronunciation}/${acts.length}`);
    });

    // Deep dive into content structures
    console.log('\n\n═══════════════════════════════════════════════════════');
    console.log('🔬 CONTENT STRUCTURE ANALYSIS');
    console.log('═══════════════════════════════════════════════════════\n');

    // Sample one activity from each subtype to show full structure
    for (const [subtype, acts] of Object.entries(subtypeGroups)) {
      console.log(`\n${subtype.toUpperCase()}`);
      console.log('─────────────────────────────────────────────────────');

      const sample = acts[0];
      console.log(`Sample: ${sample.title}`);
      console.log(`ID: ${sample.id}`);

      if (sample.content) {
        console.log('\nContent Structure:');
        console.log(JSON.stringify(sample.content, null, 2).substring(0, 500) + '...');
      }

      if (sample.voice_guidance) {
        console.log(`\nVoice Guidance: ${sample.voice_guidance.substring(0, 200)}...`);
      }

      if (sample.coqui_dialogue) {
        console.log(`\nCoqui Dialogue: ${sample.coqui_dialogue.substring(0, 200)}...`);
      }
    }

    // Print statistics
    console.log('\n\n═══════════════════════════════════════════════════════');
    console.log('📈 STATISTICS');
    console.log('═══════════════════════════════════════════════════════\n');

    const totalWithContent = activities.filter(a => a.content).length;
    const totalWithVoice = activities.filter(a => a.voice_guidance).length;
    const totalWithDialogue = activities.filter(a => a.coqui_dialogue).length;
    const totalWithPronunciation = activities.filter(a => a.pronunciation_words && a.pronunciation_words.length > 0).length;

    console.log(`Total Activities: ${activities.length}`);
    console.log(`With Content: ${totalWithContent} (${(totalWithContent/activities.length*100).toFixed(1)}%)`);
    console.log(`With Voice Guidance: ${totalWithVoice} (${(totalWithVoice/activities.length*100).toFixed(1)}%)`);
    console.log(`With Coqui Dialogue: ${totalWithDialogue} (${(totalWithDialogue/activities.length*100).toFixed(1)}%)`);
    console.log(`With Pronunciation Words: ${totalWithPronunciation} (${(totalWithPronunciation/activities.length*100).toFixed(1)}%)`);

    // Language breakdown
    const byLanguage = {};
    activities.forEach(a => {
      const lang = a.language || 'unknown';
      byLanguage[lang] = (byLanguage[lang] || 0) + 1;
    });

    console.log('\nLanguage Distribution:');
    Object.entries(byLanguage).forEach(([lang, count]) => {
      console.log(`  ${lang}: ${count} (${(count/activities.length*100).toFixed(1)}%)`);
    });

    console.log('\n✅ Analysis Complete!\n');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

analyzeActivityTypes();
