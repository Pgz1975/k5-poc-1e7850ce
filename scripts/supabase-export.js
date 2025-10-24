#!/usr/bin/env node

/**
 * Supabase Data Export Script
 * Exports tables: manual_assessments, profiles, user_roles
 * Uses Supabase JS Client for data extraction
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

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
  log.info('Authenticating as admin...');

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
    // Fetch all data from the table
    const { data, error, count } = await supabase
      .from(tableName)
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (error) {
      log.error(`Failed to export ${tableName}: ${error.message}`);
      return null;
    }

    log.success(`Exported ${data ? data.length : 0} records from ${tableName}`);
    return data;
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
  sql += `-- Total records: ${data.length}\n\n`;

  // Generate INSERT statements
  data.forEach((row) => {
    const columns = Object.keys(row);
    const values = columns.map(col => {
      const value = row[col];
      if (value === null) return 'NULL';
      if (typeof value === 'string') {
        // Escape single quotes and handle special characters
        return `'${value.replace(/'/g, "''")}'`;
      }
      if (typeof value === 'boolean') return value ? 'true' : 'false';
      if (typeof value === 'object') {
        return `'${JSON.stringify(value).replace(/'/g, "''")}'::jsonb`;
      }
      return value;
    });

    sql += `INSERT INTO public.${tableName} (${columns.join(', ')}) VALUES\n`;
    sql += `(${values.join(', ')});\n\n`;
  });

  return sql;
}

// Function to generate CREATE TABLE statements (schema)
async function getTableSchema(tableName) {
  // Note: This is a simplified schema export
  // For complete schema with all constraints, use pg_dump

  const schemaSQL = `
-- Table: public.${tableName}
-- Note: This is a simplified schema. For complete DDL with all constraints,
-- use pg_dump or export from Supabase Dashboard

`;

  return schemaSQL;
}

// Main export function
async function exportDatabase() {
  console.log(`${colors.green}╔════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.green}║   Supabase Database Export Tool        ║${colors.reset}`);
  console.log(`${colors.green}╚════════════════════════════════════════╝${colors.reset}\n`);

  // Authenticate
  const authenticated = await authenticate();
  if (!authenticated) {
    log.error('Export aborted due to authentication failure');
    process.exit(1);
  }

  // Tables to export
  const tables = ['manual_assessments', 'profiles', 'user_roles'];
  const exportData = {};

  // Export each table
  for (const table of tables) {
    const data = await exportTable(table);
    if (data) {
      exportData[table] = data;
    }
  }

  // Generate SQL file
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  const outputDir = path.join(process.cwd(), 'database_backups');
  const outputFile = path.join(outputDir, `supabase_backup_${timestamp}.sql`);

  // Create backup directory
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Generate SQL content
  let sqlContent = `-- Supabase Database Backup
-- Generated: ${new Date().toISOString()}
-- Project: meertwtenhlmnlpwxhyz
-- Tables: manual_assessments, profiles, user_roles
-- Excluded: voice_sessions, pdf_text_content

BEGIN;

`;

  // Add data for each table
  for (const [tableName, data] of Object.entries(exportData)) {
    sqlContent += await getTableSchema(tableName);
    sqlContent += dataToSQL(tableName, data);
    sqlContent += '\n';
  }

  sqlContent += 'COMMIT;\n';

  // Write SQL file
  fs.writeFileSync(outputFile, sqlContent);
  log.success(`Backup saved to: ${outputFile}`);

  // Also save as JSON for easier manipulation
  const jsonFile = path.join(outputDir, `supabase_backup_${timestamp}.json`);
  fs.writeFileSync(jsonFile, JSON.stringify(exportData, null, 2));
  log.success(`JSON backup saved to: ${jsonFile}`);

  // Generate summary
  console.log(`\n${colors.yellow}═══ Backup Summary ═══${colors.reset}`);
  for (const [tableName, data] of Object.entries(exportData)) {
    log.data(`${tableName}: ${data.length} records`);
  }

  // Calculate file sizes
  const sqlSize = (fs.statSync(outputFile).size / 1024).toFixed(2);
  const jsonSize = (fs.statSync(jsonFile).size / 1024).toFixed(2);

  console.log(`\n${colors.blue}File Sizes:${colors.reset}`);
  console.log(`  SQL:  ${sqlSize} KB`);
  console.log(`  JSON: ${jsonSize} KB`);

  // Sign out
  await supabase.auth.signOut();
  log.success('Signed out from Supabase');

  console.log(`\n${colors.green}Export completed successfully!${colors.reset}`);
}

// Error handler
process.on('unhandledRejection', (error) => {
  log.error(`Unhandled error: ${error.message}`);
  process.exit(1);
});

// Run the export
exportDatabase().catch((error) => {
  log.error(`Export failed: ${error.message}`);
  process.exit(1);
});