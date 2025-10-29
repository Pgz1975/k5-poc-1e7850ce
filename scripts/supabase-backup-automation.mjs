#!/usr/bin/env node

/**
 * Supabase Backup Automation Script
 * Automated backup with retention policies, compression, and monitoring
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CONFIG = {
  SUPABASE_URL: 'https://meertwtenhlmnlpwxhyz.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lZXJ0d3RlbmhsbG5scHd4aHl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3NjE2NzcsImV4cCI6MjA3NjMzNzY3N30.HMMie6aqj64R_-p6w5LaVNeAN7hIHpagqCRPdYXx_ic',
  ADMIN_EMAIL: 'admin@demo.com',
  ADMIN_PASSWORD: 'demo1234',
  BACKUP_DIR: path.join(__dirname, '..', 'database_backups'),
  RETENTION_DAYS: 30, // Keep backups for 30 days
  MAX_BACKUPS: 50,    // Keep maximum 50 backups
  COMPRESS: true,     // Compress old backups
  ALERT_THRESHOLD: 10000, // Alert if records exceed this count
};

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  critical: (msg) => console.log(`${colors.bgRed}${colors.white} CRITICAL ${colors.reset} ${msg}`),
  header: (msg) => console.log(`\n${colors.cyan}═══ ${msg} ═══${colors.reset}\n`),
};

// Initialize Supabase client
const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);

/**
 * Clean old backups based on retention policy
 */
async function cleanOldBackups() {
  log.header('Backup Cleanup');

  if (!fs.existsSync(CONFIG.BACKUP_DIR)) {
    fs.mkdirSync(CONFIG.BACKUP_DIR, { recursive: true });
    return;
  }

  const files = fs.readdirSync(CONFIG.BACKUP_DIR);
  const backupFiles = files.filter(f => f.includes('supabase') && (f.endsWith('.sql') || f.endsWith('.json') || f.endsWith('.gz')));

  const now = new Date();
  const cutoffDate = new Date(now.getTime() - (CONFIG.RETENTION_DAYS * 24 * 60 * 60 * 1000));

  let deletedCount = 0;
  let compressedCount = 0;

  for (const file of backupFiles) {
    const filePath = path.join(CONFIG.BACKUP_DIR, file);
    const stats = fs.statSync(filePath);

    // Delete files older than retention period
    if (stats.mtime < cutoffDate) {
      fs.unlinkSync(filePath);
      deletedCount++;
      log.info(`Deleted old backup: ${file}`);
    }
    // Compress files older than 7 days but within retention period
    else if (CONFIG.COMPRESS && !file.endsWith('.gz') && stats.mtime < new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000))) {
      try {
        await execAsync(`gzip -9 "${filePath}"`);
        compressedCount++;
        log.info(`Compressed: ${file}`);
      } catch (err) {
        log.warning(`Failed to compress ${file}: ${err.message}`);
      }
    }
  }

  // Keep only MAX_BACKUPS most recent files
  const remainingFiles = fs.readdirSync(CONFIG.BACKUP_DIR)
    .filter(f => f.includes('supabase_COMPLETE_backup'))
    .sort((a, b) => {
      const aStats = fs.statSync(path.join(CONFIG.BACKUP_DIR, a));
      const bStats = fs.statSync(path.join(CONFIG.BACKUP_DIR, b));
      return bStats.mtime - aStats.mtime;
    });

  if (remainingFiles.length > CONFIG.MAX_BACKUPS * 2) { // *2 for SQL and JSON
    const filesToDelete = remainingFiles.slice(CONFIG.MAX_BACKUPS * 2);
    for (const file of filesToDelete) {
      fs.unlinkSync(path.join(CONFIG.BACKUP_DIR, file));
      deletedCount++;
      log.info(`Deleted excess backup: ${file}`);
    }
  }

  log.success(`Cleanup complete: ${deletedCount} deleted, ${compressedCount} compressed`);
}

/**
 * Verify backup integrity
 */
async function verifyBackup(backupFile) {
  log.header('Backup Verification');

  if (!fs.existsSync(backupFile)) {
    log.error(`Backup file not found: ${backupFile}`);
    return false;
  }

  const stats = fs.statSync(backupFile);
  const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);

  if (stats.size === 0) {
    log.error('Backup file is empty!');
    return false;
  }

  if (backupFile.endsWith('.json')) {
    try {
      const content = fs.readFileSync(backupFile, 'utf8');
      const data = JSON.parse(content);

      let totalRecords = 0;
      let tableCount = 0;

      for (const [table, records] of Object.entries(data.data || {})) {
        if (Array.isArray(records)) {
          totalRecords += records.length;
          tableCount++;
        }
      }

      log.success(`✅ Valid JSON backup: ${tableCount} tables, ${totalRecords} records, ${sizeMB} MB`);

      // Alert if record count is high
      if (totalRecords > CONFIG.ALERT_THRESHOLD) {
        log.warning(`⚠️  High record count: ${totalRecords} (threshold: ${CONFIG.ALERT_THRESHOLD})`);
      }

      return true;
    } catch (err) {
      log.error(`Invalid JSON backup: ${err.message}`);
      return false;
    }
  } else if (backupFile.endsWith('.sql')) {
    // Basic SQL validation
    const content = fs.readFileSync(backupFile, 'utf8');
    const hasCreateTable = content.includes('CREATE TABLE');
    const hasInsert = content.includes('INSERT INTO');

    if (hasCreateTable || hasInsert) {
      log.success(`✅ Valid SQL backup: ${sizeMB} MB`);
      return true;
    } else {
      log.error('SQL backup appears to be incomplete');
      return false;
    }
  }

  return true;
}

/**
 * Generate backup report
 */
async function generateReport(backupStats) {
  const reportPath = path.join(CONFIG.BACKUP_DIR, 'backup_report.md');
  const timestamp = new Date().toISOString();

  let report = `# Backup Report\n\n`;
  report += `**Generated:** ${timestamp}\n\n`;
  report += `## Latest Backup\n\n`;
  report += `- **Date:** ${backupStats.timestamp}\n`;
  report += `- **Tables:** ${backupStats.tableCount}\n`;
  report += `- **Records:** ${backupStats.totalRecords}\n`;
  report += `- **SQL Size:** ${backupStats.sqlSize} MB\n`;
  report += `- **JSON Size:** ${backupStats.jsonSize} MB\n`;
  report += `- **Status:** ${backupStats.success ? '✅ Success' : '❌ Failed'}\n\n`;

  report += `## Table Details\n\n`;
  report += `| Table | Records | Status |\n`;
  report += `|-------|---------|--------|\n`;

  for (const [table, count] of Object.entries(backupStats.tables || {})) {
    const status = count > 0 ? '✅' : '⚠️';
    report += `| ${table} | ${count} | ${status} |\n`;
  }

  report += `\n## Backup History\n\n`;

  // List recent backups
  const backupFiles = fs.readdirSync(CONFIG.BACKUP_DIR)
    .filter(f => f.includes('supabase_COMPLETE_backup') && f.endsWith('.sql'))
    .sort()
    .reverse()
    .slice(0, 10);

  report += `| Date | Size | Compressed |\n`;
  report += `|------|------|------------|\n`;

  for (const file of backupFiles) {
    const filePath = path.join(CONFIG.BACKUP_DIR, file);
    const stats = fs.statSync(filePath);
    const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
    const date = file.match(/\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}/)?.[0] || 'Unknown';
    const compressed = fs.existsSync(`${filePath}.gz`) ? '✅' : '❌';
    report += `| ${date} | ${sizeMB} MB | ${compressed} |\n`;
  }

  report += `\n## Configuration\n\n`;
  report += `- **Retention Days:** ${CONFIG.RETENTION_DAYS}\n`;
  report += `- **Max Backups:** ${CONFIG.MAX_BACKUPS}\n`;
  report += `- **Compression:** ${CONFIG.COMPRESS ? 'Enabled' : 'Disabled'}\n`;
  report += `- **Alert Threshold:** ${CONFIG.ALERT_THRESHOLD} records\n`;

  fs.writeFileSync(reportPath, report);
  log.success(`Report saved to: ${reportPath}`);
}

/**
 * Run the backup process
 */
async function runBackup() {
  const startTime = Date.now();
  const backupStats = {
    timestamp: new Date().toISOString(),
    success: false,
    tableCount: 0,
    totalRecords: 0,
    tables: {},
    sqlSize: 0,
    jsonSize: 0,
  };

  try {
    log.header('Automated Backup Process');

    // Clean old backups first
    await cleanOldBackups();

    // Run the main backup script
    log.header('Running Full Backup');
    const { stdout, stderr } = await execAsync('node scripts/supabase-full-backup.mjs');

    console.log(stdout);
    if (stderr) console.error(stderr);

    // Parse output for statistics
    const recordMatch = stdout.match(/Total: (\d+)\s+records backed up/);
    const tableMatch = stdout.match(/All (\d+)\s+tables exported successfully/);

    if (recordMatch) backupStats.totalRecords = parseInt(recordMatch[1]);
    if (tableMatch) backupStats.tableCount = parseInt(tableMatch[1]);

    // Extract table details from output
    const tableMatches = stdout.matchAll(/✅ Exported (\d+) records from (\w+)/g);
    for (const match of tableMatches) {
      backupStats.tables[match[2]] = parseInt(match[1]);
    }

    // Find the latest backup files
    const timestamp = new Date().toISOString().replace(/:/g, '-').replace(/\..+/, '');
    const backupFiles = fs.readdirSync(CONFIG.BACKUP_DIR)
      .filter(f => f.includes('supabase_COMPLETE_backup'))
      .sort()
      .reverse();

    const latestSql = backupFiles.find(f => f.endsWith('.sql'));
    const latestJson = backupFiles.find(f => f.endsWith('.json'));

    if (latestSql) {
      const sqlPath = path.join(CONFIG.BACKUP_DIR, latestSql);
      const sqlStats = fs.statSync(sqlPath);
      backupStats.sqlSize = (sqlStats.size / (1024 * 1024)).toFixed(2);

      // Verify the backup
      const sqlValid = await verifyBackup(sqlPath);
      backupStats.success = sqlValid;
    }

    if (latestJson) {
      const jsonPath = path.join(CONFIG.BACKUP_DIR, latestJson);
      const jsonStats = fs.statSync(jsonPath);
      backupStats.jsonSize = (jsonStats.size / (1024 * 1024)).toFixed(2);

      // Verify the backup
      const jsonValid = await verifyBackup(jsonPath);
      backupStats.success = backupStats.success && jsonValid;
    }

    // Generate report
    await generateReport(backupStats);

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    log.header('Backup Summary');
    log.success(`✅ Backup completed in ${duration} seconds`);
    log.info(`📊 Tables: ${backupStats.tableCount}`);
    log.info(`📊 Records: ${backupStats.totalRecords}`);
    log.info(`📊 SQL Size: ${backupStats.sqlSize} MB`);
    log.info(`📊 JSON Size: ${backupStats.jsonSize} MB`);

    if (backupStats.totalRecords > CONFIG.ALERT_THRESHOLD) {
      log.critical(`Record count (${backupStats.totalRecords}) exceeds threshold (${CONFIG.ALERT_THRESHOLD})`);
    }

    process.exit(0);
  } catch (error) {
    log.error(`Backup failed: ${error.message}`);
    console.error(error);

    backupStats.success = false;
    await generateReport(backupStats);

    process.exit(1);
  }
}

// Run the backup
runBackup();