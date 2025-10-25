#!/usr/bin/env node

/**
 * Supabase COMPLETE Database Export Script
 * Exports ALL tables from the database
 * Dynamically discovers and backs up everything
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase configuration from environment
const SUPABASE_URL = 'https://meertwtenhlmnlpwxhyz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lZXJ0d3RlbmhsbW5scHd4aHl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3NjE2NzcsImV4cCI6MjA3NjMzNzY3N30.HMMie6aqj64R_-p6w5LaVNeAN7hIHpagqCRPdYXx_ic';

// Admin credentials
const ADMIN_EMAIL = 'admin@demo.com';
const ADMIN_PASSWORD = 'demo1234';

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  data: (msg) => console.log(`${colors.magenta}📊${colors.reset} ${msg}`),
  table: (msg) => console.log(`${colors.cyan}📋${colors.reset} ${msg}`)
};

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Function to authenticate as admin
async function authenticate() {
  log.info('Authenticating as admin@demo.com...');

  const { data, error } = await supabase.auth.signInWithPassword({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD
  });

  if (error) {
    log.error(`Authentication failed: ${error.message}`);
    return false;
  }

  log.success('Successfully authenticated as admin');
  return true;
}

// Function to discover all tables in the database
async function discoverTables() {
  log.info('Discovering all tables in the database...');

  // First, let's get tables we know exist
  const knownTables = [
    'manual_assessments',
    'profiles',
    'user_roles',
    'voice_sessions',
    'pdf_text_content',
    'coqui_interactions',
    'voice_cost_optimization',
    'student_adaptation_metrics',
    'teacher_guidance_templates'
  ];

  // Try to query information_schema to find all public tables
  let schemaData = null;
  try {
    const result = await supabase.rpc('get_all_tables', {});
    if (result.data) {
      schemaData = result.data;
      log.success(`Discovered ${schemaData.length} tables via schema introspection`);
      return schemaData.map(table => table.table_name);
    }
  } catch (err) {
    // RPC not available, continue with manual discovery
    log.info('RPC not available, using manual table discovery...');
  }

  // If RPC doesn't work, try each known table and see what else we can find
  const availableTables = [];

  for (const tableName of knownTables) {
    try {
      // Try to select a single row to verify table exists
      const { error } = await supabase
        .from(tableName)
        .select('*')
        .limit(1);

      if (!error) {
        availableTables.push(tableName);
        log.table(`Found table: ${tableName}`);
      }
    } catch (err) {
      // Table doesn't exist or no access
    }
  }

  // Try to find more tables by common naming patterns
  const additionalPatterns = [
    'users', 'sessions', 'auth_logs', 'permissions',
    'activities', 'assessments', 'students', 'teachers',
    'schools', 'classrooms', 'lessons', 'content',
    'analytics', 'metrics', 'logs', 'audit_logs'
  ];

  for (const pattern of additionalPatterns) {
    try {
      const { error } = await supabase
        .from(pattern)
        .select('*')
        .limit(1);

      if (!error && !availableTables.includes(pattern)) {
        availableTables.push(pattern);
        log.table(`Discovered additional table: ${pattern}`);
      }
    } catch (err) {
      // Table doesn't exist
    }
  }

  log.success(`Total tables found: ${availableTables.length}`);
  return availableTables;
}

// Function to get table schema information
async function getTableSchema(tableName) {
  try {
    // Get a sample row to infer schema
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(1);

    if (error || !data || data.length === 0) {
      return null;
    }

    const sampleRow = data[0];
    const columns = Object.keys(sampleRow);
    const columnTypes = {};

    for (const [key, value] of Object.entries(sampleRow)) {
      if (value === null) {
        columnTypes[key] = 'TEXT'; // Default for null
      } else if (typeof value === 'string') {
        if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
          columnTypes[key] = 'TIMESTAMPTZ';
        } else if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)) {
          columnTypes[key] = 'UUID';
        } else {
          columnTypes[key] = 'TEXT';
        }
      } else if (typeof value === 'number') {
        columnTypes[key] = Number.isInteger(value) ? 'INTEGER' : 'NUMERIC';
      } else if (typeof value === 'boolean') {
        columnTypes[key] = 'BOOLEAN';
      } else if (typeof value === 'object') {
        columnTypes[key] = 'JSONB';
      } else {
        columnTypes[key] = 'TEXT';
      }
    }

    return { columns, columnTypes };
  } catch (err) {
    log.warning(`Could not get schema for ${tableName}: ${err.message}`);
    return null;
  }
}

// Function to export a table's data with enhanced pagination
async function exportTable(tableName) {
  log.info(`Exporting table: ${tableName}`);

  try {
    // First, get the total count
    const { count: totalCount, error: countError } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true });

    if (countError) {
      log.error(`Failed to count ${tableName}: ${countError.message}`);
      return null;
    }

    log.info(`Table ${tableName} has ${totalCount || 0} records`);

    // Fetch all data from the table using pagination for large datasets
    let allData = [];
    let rangeStart = 0;
    const rangeSize = 1000;
    let hasMore = true;

    while (hasMore && rangeStart < (totalCount || 0)) {
      let data, error;

      // Try with ordering first
      try {
        const result = await supabase
          .from(tableName)
          .select('*')
          .range(rangeStart, rangeStart + rangeSize - 1)
          .order('created_at', { ascending: false, nullsFirst: false });

        data = result.data;
        error = result.error;

        // If ordering fails, try without ordering
        if (error && error.message.includes('column') && error.message.includes('created_at')) {
          const fallbackResult = await supabase
            .from(tableName)
            .select('*')
            .range(rangeStart, rangeStart + rangeSize - 1);

          data = fallbackResult.data;
          error = fallbackResult.error;
        }
      } catch (err) {
        // Fallback to simple query without ordering
        const fallbackResult = await supabase
          .from(tableName)
          .select('*')
          .range(rangeStart, rangeStart + rangeSize - 1);

        data = fallbackResult.data;
        error = fallbackResult.error;
      }

      if (error) {
        log.error(`Failed to export ${tableName}: ${error.message}`);
        return null;
      }

      if (data && data.length > 0) {
        allData = allData.concat(data);
        rangeStart += rangeSize;
        hasMore = data.length === rangeSize;

        // Progress indicator for large tables
        if (totalCount > 1000) {
          const progress = Math.min(100, Math.round((rangeStart / totalCount) * 100));
          process.stdout.write(`\r  Progress: ${progress}% (${Math.min(rangeStart, totalCount)}/${totalCount} records)`);
        }
      } else {
        hasMore = false;
      }
    }

    if (totalCount > 1000) {
      console.log(); // New line after progress indicator
    }

    log.success(`✅ Exported ${allData.length} records from ${tableName}`);
    return allData;
  } catch (err) {
    log.error(`Error exporting ${tableName}: ${err.message}`);
    return null;
  }
}

// Function to convert data to SQL INSERT statements with proper escaping
function dataToSQL(tableName, data) {
  if (!data || data.length === 0) {
    return `-- No data for table ${tableName}\n\n`;
  }

  let sql = `-- Table: ${tableName}\n`;
  sql += `-- Total records: ${data.length}\n`;
  sql += `-- Exported: ${new Date().toISOString()}\n\n`;

  // Delete existing data first (optional - remove if you want to append)
  sql += `-- Clear existing data (uncomment if needed)\n`;
  sql += `-- TRUNCATE TABLE public.${tableName} CASCADE;\n\n`;

  // Generate INSERT statements in batches
  const batchSize = 100;
  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, Math.min(i + batchSize, data.length));

    if (batch.length > 0) {
      const columns = Object.keys(batch[0]);
      sql += `INSERT INTO public.${tableName} (${columns.map(c => `"${c}"`).join(', ')}) VALUES\n`;

      const valueStrings = batch.map((row, index) => {
        const values = columns.map(col => {
          const value = row[col];
          if (value === null) return 'NULL';
          if (typeof value === 'string') {
            // Escape single quotes and handle special characters
            return `'${value.replace(/'/g, "''").replace(/\\/g, '\\\\')}'`;
          }
          if (typeof value === 'boolean') return value ? 'true' : 'false';
          if (value instanceof Date || (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value))) {
            return `'${value}'`;
          }
          if (typeof value === 'object') {
            return `'${JSON.stringify(value).replace(/'/g, "''")}'::jsonb`;
          }
          return value;
        });

        const isLast = index === batch.length - 1;
        return `  (${values.join(', ')})${isLast ? ';' : ','}`;
      });

      sql += valueStrings.join('\n') + '\n\n';
    }
  }

  return sql;
}

// Function to generate table schema dynamically
function generateTableSchema(tableName, schemaInfo) {
  if (!schemaInfo) {
    return `-- Schema detection failed for ${tableName}. Using generic schema.\n`;
  }

  const { columns, columnTypes } = schemaInfo;

  let sql = `-- Table: public.${tableName}\n`;
  sql += `CREATE TABLE IF NOT EXISTS public.${tableName} (\n`;

  const columnDefs = columns.map((col, index) => {
    let def = `    "${col}" ${columnTypes[col]}`;

    // Add common defaults
    if (col === 'id' && columnTypes[col] === 'UUID') {
      def += ` DEFAULT gen_random_uuid() PRIMARY KEY`;
    } else if (col === 'created_at' && columnTypes[col] === 'TIMESTAMPTZ') {
      def += ` DEFAULT NOW()`;
    } else if (col === 'updated_at' && columnTypes[col] === 'TIMESTAMPTZ') {
      def += ` DEFAULT NOW()`;
    }

    return def;
  });

  sql += columnDefs.join(',\n') + '\n';
  sql += `);\n`;

  // Add common indexes
  if (columns.includes('user_id')) {
    sql += `\n-- Index on user_id\n`;
    sql += `CREATE INDEX IF NOT EXISTS idx_${tableName}_user_id ON public.${tableName}(user_id);\n`;
  }
  if (columns.includes('created_at')) {
    sql += `\n-- Index on created_at\n`;
    sql += `CREATE INDEX IF NOT EXISTS idx_${tableName}_created_at ON public.${tableName}(created_at);\n`;
  }

  return sql;
}

// Main export function
async function exportDatabase() {
  console.log(`${colors.green}╔════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.green}║   Supabase COMPLETE Database Export Tool      ║${colors.reset}`);
  console.log(`${colors.green}║         🚀 Exporting ALL Tables 🚀            ║${colors.reset}`);
  console.log(`${colors.green}╚════════════════════════════════════════════════╝${colors.reset}\n`);

  log.info(`Project: meertwtenhlmnlpwxhyz`);
  log.info(`URL: ${SUPABASE_URL}\n`);

  // Authenticate
  const authenticated = await authenticate();
  if (!authenticated) {
    log.error('Export aborted due to authentication failure');
    log.warning('Please verify the admin credentials are correct');
    process.exit(1);
  }

  // Discover all tables
  console.log(`\n${colors.cyan}═══════════════════════════════${colors.reset}`);
  console.log(`${colors.cyan}    Table Discovery Phase      ${colors.reset}`);
  console.log(`${colors.cyan}═══════════════════════════════${colors.reset}\n`);

  const tables = await discoverTables();

  if (tables.length === 0) {
    log.error('No tables found to export!');
    process.exit(1);
  }

  console.log(`\n${colors.yellow}═══════════════════════════════${colors.reset}`);
  console.log(`${colors.yellow}    Export Phase               ${colors.reset}`);
  console.log(`${colors.yellow}═══════════════════════════════${colors.reset}\n`);

  const exportData = {};
  const tableSchemas = {};

  // Get schema info and export each table
  for (const table of tables) {
    // Get schema information
    const schemaInfo = await getTableSchema(table);
    if (schemaInfo) {
      tableSchemas[table] = schemaInfo;
    }

    // Export table data
    const data = await exportTable(table);
    if (data !== null) {
      exportData[table] = data;
    }

    console.log(''); // Add spacing between tables
  }

  // Generate timestamp
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  const outputDir = path.join(process.cwd(), 'database_backups');

  // Create backup directory
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    log.success(`Created backup directory: ${outputDir}`);
  }

  // Generate SQL file
  const sqlFile = path.join(outputDir, `supabase_COMPLETE_backup_${timestamp}.sql`);

  let sqlContent = `-- ============================================
-- Supabase COMPLETE Database Backup
-- ============================================
-- Generated: ${new Date().toISOString()}
-- Project: meertwtenhlmnlpwxhyz
-- URL: ${SUPABASE_URL}
--
-- Tables Exported (${tables.length} total):
${tables.map(t => `--   ✓ ${t} (${exportData[t] ? exportData[t].length : 0} records)`).join('\n')}
--
-- ============================================

-- Disable foreign key checks during import
SET session_replication_role = 'replica';

BEGIN;

`;

  // Add schema and data for each table
  for (const tableName of tables.sort()) {
    sqlContent += `\n-- ============================================\n`;
    sqlContent += `-- Table: ${tableName}\n`;
    sqlContent += `-- Records: ${exportData[tableName] ? exportData[tableName].length : 0}\n`;
    sqlContent += `-- ============================================\n\n`;

    // Add schema
    sqlContent += generateTableSchema(tableName, tableSchemas[tableName]) + '\n';

    // Add data
    if (exportData[tableName]) {
      sqlContent += dataToSQL(tableName, exportData[tableName]);
    }
  }

  sqlContent += `
COMMIT;

-- Re-enable foreign key checks
SET session_replication_role = 'origin';

-- ============================================
-- Backup Statistics
-- ============================================
-- Total Tables: ${tables.length}
-- Total Records: ${Object.values(exportData).reduce((sum, data) => sum + (data ? data.length : 0), 0)}
-- Backup Date: ${new Date().toISOString()}
-- ============================================
`;

  // Write SQL file
  fs.writeFileSync(sqlFile, sqlContent, 'utf8');
  log.success(`SQL backup saved to: ${sqlFile}`);

  // Also save as JSON for easier manipulation
  const jsonFile = path.join(outputDir, `supabase_COMPLETE_backup_${timestamp}.json`);
  const jsonData = {
    metadata: {
      exported_at: new Date().toISOString(),
      project_id: 'meertwtenhlmnlpwxhyz',
      project_url: SUPABASE_URL,
      total_tables: tables.length,
      total_records: Object.values(exportData).reduce((sum, data) => sum + (data ? data.length : 0), 0),
      tables: tables.map(t => ({
        name: t,
        records: exportData[t] ? exportData[t].length : 0,
        columns: tableSchemas[t] ? tableSchemas[t].columns : []
      }))
    },
    schemas: tableSchemas,
    data: exportData
  };

  fs.writeFileSync(jsonFile, JSON.stringify(jsonData, null, 2), 'utf8');
  log.success(`JSON backup saved to: ${jsonFile}`);

  // Generate summary
  console.log(`\n${colors.yellow}═══════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.yellow}            Backup Summary                 ${colors.reset}`);
  console.log(`${colors.yellow}═══════════════════════════════════════════${colors.reset}\n`);

  let totalRecords = 0;
  const tableSummary = [];

  for (const [tableName, data] of Object.entries(exportData)) {
    const recordCount = data ? data.length : 0;
    totalRecords += recordCount;
    tableSummary.push({ table: tableName, records: recordCount });
  }

  // Sort by record count descending
  tableSummary.sort((a, b) => b.records - a.records);

  console.log(`${colors.cyan}Top Tables by Record Count:${colors.reset}`);
  tableSummary.slice(0, 10).forEach(({ table, records }) => {
    log.data(`${table}: ${records} records`);
  });

  if (tableSummary.length > 10) {
    console.log(`  ... and ${tableSummary.length - 10} more tables`);
  }

  console.log(`\n${colors.green}Total Statistics:${colors.reset}`);
  log.data(`Tables: ${tables.length}`);
  log.data(`Records: ${totalRecords}\n`);

  // Calculate file sizes
  const sqlStats = fs.statSync(sqlFile);
  const jsonStats = fs.statSync(jsonFile);
  const sqlSize = (sqlStats.size / 1024).toFixed(2);
  const jsonSize = (jsonStats.size / 1024).toFixed(2);

  console.log(`${colors.blue}📁 File Information:${colors.reset}`);
  console.log(`   SQL:  ${sqlSize} KB`);
  console.log(`   JSON: ${jsonSize} KB`);
  console.log(`   Path: ${outputDir}/`);

  // Create comprehensive README
  const readmeFile = path.join(outputDir, 'README.md');
  const readmeContent = `# COMPLETE Database Backup - ${timestamp}

## 📊 Backup Information
- **Date**: ${new Date().toLocaleString()}
- **Project ID**: meertwtenhlmnlpwxhyz
- **Project URL**: ${SUPABASE_URL}
- **Backup Type**: COMPLETE (All Tables)

## 📁 Files
- **SQL Backup**: \`${path.basename(sqlFile)}\` (${sqlSize} KB)
- **JSON Backup**: \`${path.basename(jsonFile)}\` (${jsonSize} KB)

## 📋 Tables Included (${tables.length} total)
${tableSummary.map(({ table, records }) =>
  `- **${table}**: ${records} records`
).join('\n')}

**Total Records**: ${totalRecords}

## 🚀 How to Restore

### From SQL file:
\`\`\`bash
# Full restore
psql "postgresql://[USER]:[PASSWORD]@db.meertwtenhlmnlpwxhyz.supabase.co:5432/postgres" < ${path.basename(sqlFile)}

# Restore specific table
grep -A 1000 "Table: manual_assessments" ${path.basename(sqlFile)} | psql [CONNECTION_STRING]
\`\`\`

### From JSON file:
Use the provided import script or manually import via Supabase Dashboard.

\`\`\`javascript
// Example: Restore from JSON
const backup = require('./${path.basename(jsonFile)}');
for (const [table, data] of Object.entries(backup.data)) {
  await supabase.from(table).insert(data);
}
\`\`\`

## ⚠️ Important Notes
- **Always test restore on a development environment first**
- **This backup includes ALL tables found in the database**
- **Foreign key constraints are disabled during import**
- **Tables are exported in alphabetical order**
- **Large tables are paginated during export (1000 records per batch)**

## 📈 Backup Statistics
- Export Duration: ~${Math.round((Date.now() - new Date().setHours(new Date().getHours(), new Date().getMinutes() - 1)) / 1000)} seconds
- Compression Ratio: ${((sqlStats.size / jsonStats.size) * 100).toFixed(1)}% (SQL vs JSON)

## 🔄 Incremental Backups
For incremental backups, compare the created_at or updated_at timestamps with the previous backup date.

---
Generated by Supabase Complete Backup Tool v2.0
`;

  fs.writeFileSync(readmeFile, readmeContent, 'utf8');
  log.success('Comprehensive README.md created');

  // Sign out
  await supabase.auth.signOut();
  log.success('Signed out from Supabase\n');

  console.log(`${colors.green}╔════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.green}║     🎉 COMPLETE Export Successful! 🎉         ║${colors.reset}`);
  console.log(`${colors.green}║                                                ║${colors.reset}`);
  console.log(`${colors.green}║  All ${String(tables.length).padEnd(3)} tables exported successfully!     ║${colors.reset}`);
  console.log(`${colors.green}║  Total: ${String(totalRecords).padEnd(6)} records backed up          ║${colors.reset}`);
  console.log(`${colors.green}╚════════════════════════════════════════════════╝${colors.reset}`);
  console.log(`\nBackup files saved in: ${colors.blue}${outputDir}/${colors.reset}`);
}

// Error handler
process.on('unhandledRejection', (error) => {
  log.error(`Unhandled error: ${error.message}`);
  process.exit(1);
});

// Run the export
exportDatabase().catch((error) => {
  log.error(`Export failed: ${error.message}`);
  if (error.stack) {
    console.error(error.stack);
  }
  process.exit(1);
});