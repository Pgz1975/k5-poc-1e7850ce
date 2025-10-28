import { createClient } from '@supabase/supabase-js';
import { writeFileSync } from 'fs';
import { join } from 'path';

// Supabase credentials
const SUPABASE_URL = 'https://meertwtenhlmnlpwxhyz.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lZXJ0d3RlbmhsbW5scHd4aHl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3NjE2NzcsImV4cCI6MjA3NjMzNzY3N30.HMMie6aqj64R_-p6w5LaVNeAN7hIHpagqCRPdYXx_ic';

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function analyzeManualAssessments() {
  console.log('🔍 Starting analysis of manual_assessments table...\n');

  try {
    // Fetch all records from manual_assessments
    const { data: assessments, error } = await supabase
      .from('manual_assessments')
      .select('*')
      .order('type', { ascending: true });

    if (error) {
      throw new Error(`Supabase query error: ${error.message}`);
    }

    if (!assessments || assessments.length === 0) {
      console.log('⚠️  No records found in manual_assessments table');
      return;
    }

    console.log(`✅ Retrieved ${assessments.length} records from manual_assessments\n`);

    // Organize data by type and subtype
    const typeSubtypeMap = new Map();
    const detailedAnalysis = [];

    assessments.forEach((assessment) => {
      const { id, type, subtype, content } = assessment;

      // Initialize type if not exists
      if (!typeSubtypeMap.has(type)) {
        typeSubtypeMap.set(type, new Map());
      }

      // Initialize subtype if not exists
      const subtypeMap = typeSubtypeMap.get(type);
      if (!subtypeMap.has(subtype)) {
        subtypeMap.set(subtype, {
          count: 0,
          ids: [],
          contentStructures: []
        });
      }

      // Update subtype data
      const subtypeData = subtypeMap.get(subtype);
      subtypeData.count++;
      subtypeData.ids.push(id);

      // Analyze content structure
      if (content) {
        try {
          const parsedContent = typeof content === 'string' ? JSON.parse(content) : content;
          const structure = analyzeContentStructure(parsedContent);
          subtypeData.contentStructures.push({
            id,
            structure,
            sample: parsedContent
          });
        } catch (e) {
          subtypeData.contentStructures.push({
            id,
            structure: 'Parse error or non-JSON content',
            sample: content
          });
        }
      }
    });

    // Generate comprehensive report
    const report = {
      summary: {
        totalRecords: assessments.length,
        totalTypes: typeSubtypeMap.size,
        timestamp: new Date().toISOString()
      },
      typeSubtypeCombinations: {},
      detailedBreakdown: []
    };

    // Process each type
    for (const [type, subtypeMap] of typeSubtypeMap.entries()) {
      report.typeSubtypeCombinations[type] = {
        totalSubtypes: subtypeMap.size,
        subtypes: []
      };

      const typeData = {
        type,
        subtypes: []
      };

      // Process each subtype
      for (const [subtype, data] of subtypeMap.entries()) {
        const subtypeInfo = {
          subtype,
          count: data.count,
          percentage: ((data.count / assessments.length) * 100).toFixed(2),
          ids: data.ids,
          contentAnalysis: analyzeContentPatterns(data.contentStructures)
        };

        report.typeSubtypeCombinations[type].subtypes.push({
          subtype,
          count: data.count,
          percentage: subtypeInfo.percentage
        });

        typeData.subtypes.push(subtypeInfo);
      }

      report.detailedBreakdown.push(typeData);
    }

    // Print summary to console
    console.log('═══════════════════════════════════════════════════════════');
    console.log('                 SUBTYPE ANALYSIS SUMMARY');
    console.log('═══════════════════════════════════════════════════════════\n');

    console.log(`📊 Total Records: ${report.summary.totalRecords}`);
    console.log(`📁 Total Types: ${report.summary.totalTypes}\n`);

    for (const [type, data] of Object.entries(report.typeSubtypeCombinations)) {
      console.log(`\n🏷️  TYPE: ${type.toUpperCase()}`);
      console.log('─'.repeat(60));
      console.log(`   Total Subtypes: ${data.totalSubtypes}`);
      console.log('   Subtypes:');

      data.subtypes
        .sort((a, b) => b.count - a.count)
        .forEach((st, idx) => {
          console.log(`   ${idx + 1}. ${st.subtype || '(null)'} - ${st.count} activities (${st.percentage}%)`);
        });
    }

    console.log('\n═══════════════════════════════════════════════════════════\n');

    // Save detailed report to JSON file
    const outputPath = join(process.cwd(), 'subtype-analysis-report.json');
    writeFileSync(outputPath, JSON.stringify(report, null, 2), 'utf-8');
    console.log(`✅ Detailed report saved to: ${outputPath}\n`);

    // Save human-readable summary
    const summaryPath = join(process.cwd(), 'subtype-analysis-summary.txt');
    const summaryText = generateTextSummary(report);
    writeFileSync(summaryPath, summaryText, 'utf-8');
    console.log(`✅ Summary report saved to: ${summaryPath}\n`);

    // Generate flat list of all unique subtypes
    const allSubtypes = new Set();
    for (const [type, subtypeMap] of typeSubtypeMap.entries()) {
      for (const subtype of subtypeMap.keys()) {
        allSubtypes.add(subtype);
      }
    }

    console.log('📋 ALL UNIQUE SUBTYPES FOUND:');
    console.log('─'.repeat(60));
    const sortedSubtypes = Array.from(allSubtypes).sort();
    sortedSubtypes.forEach((subtype, idx) => {
      console.log(`${idx + 1}. ${subtype || '(null)'}`);
    });
    console.log(`\n✅ Total unique subtypes: ${allSubtypes.size}\n`);

    return report;

  } catch (error) {
    console.error('❌ Error during analysis:', error);
    throw error;
  }
}

function analyzeContentStructure(content) {
  if (!content || typeof content !== 'object') {
    return 'Non-object content';
  }

  const structure = {
    topLevelKeys: Object.keys(content),
    keyTypes: {}
  };

  for (const [key, value] of Object.entries(content)) {
    structure.keyTypes[key] = Array.isArray(value)
      ? `array[${value.length}]`
      : typeof value;
  }

  return structure;
}

function analyzeContentPatterns(contentStructures) {
  if (contentStructures.length === 0) {
    return { pattern: 'No content data available' };
  }

  // Find common keys across all content structures
  const allKeys = new Set();
  const keyFrequency = {};

  contentStructures.forEach(({ structure }) => {
    if (structure && structure.topLevelKeys) {
      structure.topLevelKeys.forEach(key => {
        allKeys.add(key);
        keyFrequency[key] = (keyFrequency[key] || 0) + 1;
      });
    }
  });

  return {
    totalSamples: contentStructures.length,
    commonKeys: Array.from(allKeys),
    keyFrequency,
    sampleContent: contentStructures.slice(0, 2).map(cs => ({
      id: cs.id,
      structure: cs.structure
    }))
  };
}

function generateTextSummary(report) {
  let text = '═══════════════════════════════════════════════════════════\n';
  text += '        MANUAL ASSESSMENTS - SUBTYPE ANALYSIS SUMMARY\n';
  text += '═══════════════════════════════════════════════════════════\n\n';
  text += `Generated: ${report.summary.timestamp}\n`;
  text += `Total Records: ${report.summary.totalRecords}\n`;
  text += `Total Types: ${report.summary.totalTypes}\n\n`;

  report.detailedBreakdown.forEach(typeData => {
    text += `\n${'═'.repeat(60)}\n`;
    text += `TYPE: ${typeData.type.toUpperCase()}\n`;
    text += `${'═'.repeat(60)}\n\n`;
    text += `Total Subtypes: ${typeData.subtypes.length}\n\n`;

    typeData.subtypes
      .sort((a, b) => b.count - a.count)
      .forEach((st, idx) => {
        text += `${idx + 1}. SUBTYPE: ${st.subtype || '(null)'}\n`;
        text += `   Activities: ${st.count} (${st.percentage}%)\n`;
        text += `   IDs: ${st.ids.slice(0, 5).join(', ')}${st.ids.length > 5 ? '...' : ''}\n`;

        if (st.contentAnalysis && st.contentAnalysis.commonKeys) {
          text += `   Content Keys: ${st.contentAnalysis.commonKeys.join(', ')}\n`;
        }
        text += '\n';
      });
  });

  text += '\n═══════════════════════════════════════════════════════════\n';
  text += 'ALL UNIQUE SUBTYPES:\n';
  text += '═══════════════════════════════════════════════════════════\n\n';

  const allSubtypes = new Set();
  report.detailedBreakdown.forEach(typeData => {
    typeData.subtypes.forEach(st => allSubtypes.add(st.subtype));
  });

  Array.from(allSubtypes).sort().forEach((subtype, idx) => {
    text += `${idx + 1}. ${subtype || '(null)'}\n`;
  });

  text += `\nTotal Unique Subtypes: ${allSubtypes.size}\n`;

  return text;
}

// Run the analysis
analyzeManualAssessments()
  .then(() => {
    console.log('✅ Analysis completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Analysis failed:', error);
    process.exit(1);
  });
