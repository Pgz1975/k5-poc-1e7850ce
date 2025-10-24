#!/usr/bin/env node

/**
 * Supabase Data Export Script
 * Exports tables: manual_assessments, profiles, user_roles
 * Uses Supabase JS Client for data extraction
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
  magenta: '\x1b[35m'
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  data: (msg) => console.log(`${colors.magenta}📊${colors.reset} ${msg}`)
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

// Function to export a table's data
async function exportTable(tableName) {
  log.info(`Exporting table: ${tableName}`);

  try {
    // Fetch all data from the table - using pagination for large datasets
    let allData = [];
    let rangeStart = 0;
    const rangeSize = 1000;
    let hasMore = true;

    while (hasMore) {
      const { data, error, count } = await supabase
        .from(tableName)
        .select('*', { count: 'exact' })
        .range(rangeStart, rangeStart + rangeSize - 1)
        .order('created_at', { ascending: false });

      if (error) {
        log.error(`Failed to export ${tableName}: ${error.message}`);
        return null;
      }

      if (data && data.length > 0) {
        allData = allData.concat(data);
        rangeStart += rangeSize;
        hasMore = data.length === rangeSize;
      } else {
        hasMore = false;
      }
    }

    log.success(`Exported ${allData.length} records from ${tableName}`);
    return allData;
  } catch (err) {
    log.error(`Error exporting ${tableName}: ${err.message}`);
    return null;
  }
}

// Function to convert data to SQL INSERT statements
function dataToSQL(tableName, data) {
  if (!data || data.length === 0) {
    return `-- No data for table ${tableName}\n\n`;
  }

  let sql = `-- Table: ${tableName}\n`;
  sql += `-- Total records: ${data.length}\n`;
  sql += `-- Exported: ${new Date().toISOString()}\n\n`;

  // Delete existing data first (optional - remove if you want to append)
  sql += `-- Clear existing data (optional)\n`;
  sql += `-- DELETE FROM public.${tableName};\n\n`;

  // Generate INSERT statements in batches
  const batchSize = 100;
  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, Math.min(i + batchSize, data.length));

    if (batch.length > 0) {
      const columns = Object.keys(batch[0]);
      sql += `INSERT INTO public.${tableName} (${columns.join(', ')}) VALUES\n`;

      const valueStrings = batch.map((row, index) => {
        const values = columns.map(col => {
          const value = row[col];
          if (value === null) return 'NULL';
          if (typeof value === 'string') {
            // Escape single quotes and handle special characters
            return `'${value.replace(/'/g, "''")}'`;
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

// Function to export table schema
function generateTableSchema(tableName) {
  // Basic schema template - for complete schema use pg_dump
  const schemas = {
    manual_assessments: `
-- Table: public.manual_assessments
CREATE TABLE IF NOT EXISTS public.manual_assessments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    student_name TEXT,
    assessment_data JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);`,
    profiles: `
-- Table: public.profiles
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) UNIQUE,
    name TEXT,
    email TEXT,
    role TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);`,
    user_roles: `
-- Table: public.user_roles
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    role TEXT,
    permissions JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);`
  };

  return schemas[tableName] || `-- Schema for ${tableName} not available. Use pg_dump for complete schema.\n`;
}

// Main export function
async function exportDatabase() {
  console.log(`${colors.green}╔════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.green}║   Supabase Database Export Tool        ║${colors.reset}`);
  console.log(`${colors.green}╚════════════════════════════════════════╝${colors.reset}\n`);

  log.info(`Project: meertwtenhlmnlpwxhyz`);
  log.info(`URL: ${SUPABASE_URL}\n`);

  // Authenticate
  const authenticated = await authenticate();
  if (!authenticated) {
    log.error('Export aborted due to authentication failure');
    log.warning('Please verify the admin credentials are correct');
    process.exit(1);
  }

  // Tables to export
  const tables = ['manual_assessments', 'profiles', 'user_roles'];
  const exportData = {};

  // Export each table
  for (const table of tables) {
    const data = await exportTable(table);
    if (data !== null) {
      exportData[table] = data;
    }
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
  const sqlFile = path.join(outputDir, `supabase_backup_${timestamp}.sql`);

  let sqlContent = `-- ============================================
-- Supabase Database Backup
-- ============================================
-- Generated: ${new Date().toISOString()}
-- Project: meertwtenhlmnlpwxhyz
-- URL: ${SUPABASE_URL}
--
-- Tables Included:
--   ✓ manual_assessments
--   ✓ profiles
--   ✓ user_roles
--
-- Tables Excluded:
--   ✗ voice_sessions
--   ✗ pdf_text_content
-- ============================================

-- Disable foreign key checks during import
SET session_replication_role = 'replica';

BEGIN;

`;

  // Add schema and data for each table
  for (const tableName of tables) {
    sqlContent += `\n-- ============================================\n`;
    sqlContent += `-- Table: ${tableName}\n`;
    sqlContent += `-- ============================================\n`;

    // Add schema
    sqlContent += generateTableSchema(tableName) + '\n\n';

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
-- End of backup
-- ============================================
`;

  // Write SQL file
  fs.writeFileSync(sqlFile, sqlContent, 'utf8');
  log.success(`SQL backup saved to: ${sqlFile}`);

  // Also save as JSON for easier manipulation
  const jsonFile = path.join(outputDir, `supabase_backup_${timestamp}.json`);
  const jsonData = {
    metadata: {
      exported_at: new Date().toISOString(),
      project_id: 'meertwtenhlmnlpwxhyz',
      project_url: SUPABASE_URL,
      tables_included: tables,
      tables_excluded: ['voice_sessions', 'pdf_text_content']
    },
    data: exportData
  };

  fs.writeFileSync(jsonFile, JSON.stringify(jsonData, null, 2), 'utf8');
  log.success(`JSON backup saved to: ${jsonFile}`);

  // Generate summary
  console.log(`\n${colors.yellow}═══════════════════════════════${colors.reset}`);
  console.log(`${colors.yellow}       Backup Summary          ${colors.reset}`);
  console.log(`${colors.yellow}═══════════════════════════════${colors.reset}\n`);

  let totalRecords = 0;
  for (const [tableName, data] of Object.entries(exportData)) {
    const recordCount = data ? data.length : 0;
    totalRecords += recordCount;
    log.data(`${tableName}: ${recordCount} records`);
  }

  log.data(`Total: ${totalRecords} records\n`);

  // Calculate file sizes
  const sqlStats = fs.statSync(sqlFile);
  const jsonStats = fs.statSync(jsonFile);
  const sqlSize = (sqlStats.size / 1024).toFixed(2);
  const jsonSize = (jsonStats.size / 1024).toFixed(2);

  console.log(`${colors.blue}📁 File Information:${colors.reset}`);
  console.log(`   SQL:  ${sqlSize} KB (${sqlFile})`);
  console.log(`   JSON: ${jsonSize} KB (${jsonFile})`);

  // Create README
  const readmeFile = path.join(outputDir, 'README.md');
  const readmeContent = `# Database Backup - ${timestamp}

## Backup Information
- **Date**: ${new Date().toLocaleString()}
- **Project ID**: meertwtenhlmnlpwxhyz
- **Project URL**: ${SUPABASE_URL}

## Files
- **SQL Backup**: \`${path.basename(sqlFile)}\` (${sqlSize} KB)
- **JSON Backup**: \`${path.basename(jsonFile)}\` (${jsonSize} KB)

## Tables Included
${Object.entries(exportData).map(([table, data]) =>
  `- **${table}**: ${data ? data.length : 0} records`
).join('\n')}

**Total Records**: ${totalRecords}

## Tables Excluded
- voice_sessions (excluded as requested)
- pdf_text_content (excluded as requested)

## How to Restore

### From SQL file:
\`\`\`bash
psql "postgresql://[USER]:[PASSWORD]@db.meertwtenhlmnlpwxhyz.supabase.co:5432/postgres" < ${path.basename(sqlFile)}
\`\`\`

### From JSON file:
Use the provided import script or manually import via Supabase Dashboard.

## Notes
- Always test restore on a development environment first
- The SQL file includes basic table schemas
- For complete schema with all constraints, use pg_dump
`;

  fs.writeFileSync(readmeFile, readmeContent, 'utf8');
  log.success('README.md created in backup directory');

  // Sign out
  await supabase.auth.signOut();
  log.success('Signed out from Supabase\n');

  console.log(`${colors.green}╔════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.green}║     Export Completed Successfully!     ║${colors.reset}`);
  console.log(`${colors.green}╚════════════════════════════════════════╝${colors.reset}`);
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