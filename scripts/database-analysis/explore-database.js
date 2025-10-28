import { createClient } from '@supabase/supabase-js';

// Supabase credentials
const SUPABASE_URL = 'https://meertwtenhlmnlpwxhyz.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lZXJ0d3RlbmhsbW5scHd4aHl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3NjE2NzcsImV4cCI6MjA3NjMzNzY3N30.HMMie6aqj64R_-p6w5LaVNeAN7hIHpagqCRPdYXx_ic';

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function exploreDatabase() {
  console.log('🔍 Exploring database structure...\n');

  try {
    // Try to get table schema information by querying with select *
    console.log('1️⃣ Checking manual_assessments table...');
    const { data: assessments, error: assessmentsError, count } = await supabase
      .from('manual_assessments')
      .select('*', { count: 'exact', head: false })
      .limit(5);

    if (assessmentsError) {
      console.log('   ❌ Error accessing manual_assessments:', assessmentsError.message);
      console.log('   Details:', JSON.stringify(assessmentsError, null, 2));
    } else {
      console.log(`   ✅ Table exists! Total count: ${count}`);
      console.log(`   Sample records: ${assessments?.length || 0}`);
      if (assessments && assessments.length > 0) {
        console.log('   First record structure:', Object.keys(assessments[0]));
        console.log('   Sample:', JSON.stringify(assessments[0], null, 2));
      }
    }

    // Try alternative table names
    console.log('\n2️⃣ Checking alternative table names...');
    const tableNames = [
      'manual_assessment',
      'assessments',
      'assessment',
      'activities',
      'manual_activities',
      'activity'
    ];

    for (const tableName of tableNames) {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .limit(1);

        if (!error && data) {
          console.log(`   ✅ Found table: ${tableName} (${data.length} records sampled)`);
          if (data.length > 0) {
            console.log(`      Columns: ${Object.keys(data[0]).join(', ')}`);
          }
        }
      } catch (e) {
        // Silent fail for non-existent tables
      }
    }

    // Try to query with specific columns if we know the structure
    console.log('\n3️⃣ Attempting structured query...');
    const { data: structured, error: structError } = await supabase
      .from('manual_assessments')
      .select('id, type, subtype')
      .limit(10);

    if (structError) {
      console.log('   ❌ Structured query error:', structError.message);
    } else {
      console.log(`   ✅ Structured query returned ${structured?.length || 0} records`);
      if (structured && structured.length > 0) {
        console.log('   Sample:', JSON.stringify(structured.slice(0, 3), null, 2));
      }
    }

    // Check RPC functions that might list tables
    console.log('\n4️⃣ Checking for available tables using raw query...');
    const { data: rpcData, error: rpcError } = await supabase.rpc('version');
    if (!rpcError) {
      console.log('   ✅ RPC functions available');
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }

  console.log('\n✅ Database exploration completed!');
}

// Run the exploration
exploreDatabase()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Exploration failed:', error);
    process.exit(1);
  });
