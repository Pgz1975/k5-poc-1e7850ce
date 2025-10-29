#!/usr/bin/env node

/**
 * Supabase Database Restore Script
 * Restores database from backup files (SQL or JSON)
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CONFIG = {
  SUPABASE_URL: 'https://meertwtenhlmnlpwxhyz.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lZXJ0d3RlbmhsbG5scHd4aHl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3NjE2NzcsImV4cCI6MjA3NjMzNzY3N30.HMMie6aqj64R_-p6w5LaVNeAN7hIHpagqCRPdYXx_ic',
  ADMIN_EMAIL: 'admin@demo.com',
  ADMIN_PASSWORD: 'demo1234',
  BACKUP_DIR: path.join(__dirname, '..', 'database_backups'),
};

// Color codes
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  header: (msg) => console.log(`\n${colors.cyan}═══ ${msg} ═══${colors.reset}\n`),
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Initialize Supabase client
const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);

/**
 * Prompt for user confirmation
 */
function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.toLowerCase());
    });
  });
}

/**
 * List available backups
 */
function listBackups() {
  if (!fs.existsSync(CONFIG.BACKUP_DIR)) {
    log.error('Backup directory does not exist');
    return [];
  }

  const files = fs.readdirSync(CONFIG.BACKUP_DIR);
  const backupGroups = {};

  // Group backups by timestamp
  files.forEach(file => {
    const match = file.match(/supabase.*?(\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2})/);
    if (match) {
      const timestamp = match[1];
      if (!backupGroups[timestamp]) {
        backupGroups[timestamp] = { sql: null, json: null };
      }
      if (file.endsWith('.sql')) backupGroups[timestamp].sql = file;
      if (file.endsWith('.json')) backupGroups[timestamp].json = file;
    }
  });

  // Sort by timestamp (newest first)
  const sortedBackups = Object.entries(backupGroups)
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([timestamp, files], index) => ({
      index: index + 1,
      timestamp,
      ...files,
    }));

  return sortedBackups;
}

/**
 * Authenticate as admin
 */
async function authenticate() {
  log.info('Authenticating as admin...');

  const { data, error } = await supabase.auth.signInWithPassword({
    email: CONFIG.ADMIN_EMAIL,
    password: CONFIG.ADMIN_PASSWORD,
  });

  if (error) {
    log.error(`Authentication failed: ${error.message}`);
    return false;
  }

  log.success('Successfully authenticated');
  return true;
}

/**
 * Clear table data (with confirmation)
 */
async function clearTable(tableName) {
  const { error } = await supabase
    .from(tableName)
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all (using impossible ID)

  if (error && error.message.includes('0 rows')) {
    // Table is already empty or doesn't exist
    return true;
  }

  if (error) {
    log.error(`Failed to clear ${tableName}: ${error.message}`);
    return false;
  }

  log.success(`Cleared table: ${tableName}`);
  return true;
}

/**
 * Restore from JSON backup
 */
async function restoreFromJSON(filePath, options = {}) {
  log.header('Restoring from JSON Backup');

  const content = fs.readFileSync(filePath, 'utf8');
  const backup = JSON.parse(content);

  if (!backup.data) {
    log.error('Invalid backup format');
    return false;
  }

  const tables = Object.keys(backup.data);
  log.info(`Found ${tables.length} tables in backup`);

  for (const tableName of tables) {
    const records = backup.data[tableName];

    if (!Array.isArray(records) || records.length === 0) {
      log.info(`Skipping ${tableName} (no records)`);
      continue;
    }

    log.info(`Restoring ${tableName}: ${records.length} records`);

    // Clear existing data if requested
    if (options.clearFirst) {
      await clearTable(tableName);
    }

    // Insert records in batches
    const batchSize = 100;
    let restored = 0;

    for (let i = 0; i < records.length; i += batchSize) {
      const batch = records.slice(i, i + batchSize);

      const { data, error } = await supabase
        .from(tableName)
        .upsert(batch, { onConflict: 'id' });

      if (error) {
        log.error(`Failed to restore ${tableName}: ${error.message}`);
        if (!options.continueOnError) {
          return false;
        }
      } else {
        restored += batch.length;
        if (records.length > 100) {
          process.stdout.write(`\r   Progress: ${restored}/${records.length} records`);
        }
      }
    }

    if (records.length > 100) {
      console.log(); // New line after progress
    }

    log.success(`✅ Restored ${restored} records to ${tableName}`);
  }

  return true;
}

/**
 * Verify restoration
 */
async function verifyRestore(expectedCounts) {
  log.header('Verifying Restoration');

  let allMatch = true;

  for (const [tableName, expectedCount] of Object.entries(expectedCounts)) {
    const { count, error } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true });

    if (error) {
      log.warning(`Could not verify ${tableName}: ${error.message}`);
      continue;
    }

    if (count === expectedCount) {
      log.success(`✅ ${tableName}: ${count} records (matches backup)`);
    } else {
      log.error(`❌ ${tableName}: ${count} records (expected ${expectedCount})`);
      allMatch = false;
    }
  }

  return allMatch;
}

/**
 * Main restore process
 */
async function main() {
  console.log(`${colors.cyan}╔════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.cyan}║    Supabase Database Restore Tool             ║${colors.reset}`);
  console.log(`${colors.cyan}╚════════════════════════════════════════════════╝${colors.reset}\n`);

  // List available backups
  const backups = listBackups();

  if (backups.length === 0) {
    log.error('No backups found');
    rl.close();
    process.exit(1);
  }

  console.log('\nAvailable backups:\n');
  backups.forEach(backup => {
    const timestamp = backup.timestamp.replace('T', ' ').replace(/-/g, ':');
    const formats = [];
    if (backup.sql) formats.push('SQL');
    if (backup.json) formats.push('JSON');
    console.log(`  ${backup.index}. ${timestamp} (${formats.join(', ')})`);
  });

  // Get user selection
  const selection = await prompt('\nSelect backup number (or "q" to quit): ');

  if (selection === 'q') {
    console.log('Restore cancelled');
    rl.close();
    process.exit(0);
  }

  const backupIndex = parseInt(selection) - 1;
  if (isNaN(backupIndex) || backupIndex < 0 || backupIndex >= backups.length) {
    log.error('Invalid selection');
    rl.close();
    process.exit(1);
  }

  const selectedBackup = backups[backupIndex];

  // Choose format if both available
  let format = 'json';
  if (selectedBackup.sql && selectedBackup.json) {
    const formatChoice = await prompt('\nRestore from (1) JSON or (2) SQL? ');
    format = formatChoice === '2' ? 'sql' : 'json';
  } else if (selectedBackup.sql && !selectedBackup.json) {
    format = 'sql';
  }

  if (format === 'sql') {
    log.error('SQL restore not yet implemented. Please use JSON format.');
    log.info('To restore from SQL, use: psql [CONNECTION_STRING] < backup.sql');
    rl.close();
    process.exit(1);
  }

  const backupFile = path.join(CONFIG.BACKUP_DIR, selectedBackup.json);

  // Parse backup to show what will be restored
  const content = fs.readFileSync(backupFile, 'utf8');
  const backup = JSON.parse(content);
  const tableCounts = {};

  console.log('\nBackup contents:');
  for (const [table, records] of Object.entries(backup.data || {})) {
    if (Array.isArray(records)) {
      tableCounts[table] = records.length;
      console.log(`  - ${table}: ${records.length} records`);
    }
  }

  // Confirmation
  const clearFirst = await prompt('\nClear existing data before restore? (y/n): ');

  console.log(`\n${colors.yellow}⚠️  WARNING: This will ${clearFirst === 'y' ? 'REPLACE' : 'MERGE WITH'} existing data${colors.reset}`);
  const confirm = await prompt('Are you sure you want to proceed? (yes/no): ');

  if (confirm !== 'yes') {
    console.log('Restore cancelled');
    rl.close();
    process.exit(0);
  }

  // Authenticate
  const authenticated = await authenticate();
  if (!authenticated) {
    rl.close();
    process.exit(1);
  }

  // Perform restore
  const success = await restoreFromJSON(backupFile, {
    clearFirst: clearFirst === 'y',
    continueOnError: true,
  });

  if (success) {
    // Verify the restore
    const verified = await verifyRestore(tableCounts);

    if (verified) {
      log.success('\n🎉 Database successfully restored!');
    } else {
      log.warning('\n⚠️  Restore completed with discrepancies');
    }
  } else {
    log.error('\n❌ Restore failed');
  }

  // Sign out
  await supabase.auth.signOut();
  rl.close();
}

// Handle errors
process.on('unhandledRejection', (error) => {
  log.error(`Unexpected error: ${error.message}`);
  console.error(error);
  rl.close();
  process.exit(1);
});

// Run the restore
main();