#!/usr/bin/env node

/**
 * Supabase Backup Monitoring Script
 * Monitors database growth, backup status, and generates alerts
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CONFIG = {
  SUPABASE_URL: 'https://meertwtenhlmnlpwxhyz.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lZXJ0d3RlbmhsbG5scHd4aHl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3NjE2NzcsImV4cCI6MjA3NjMzNzY3N30.HMMie6aqj64R_-p6w5LaVNeAN7hIHpagqCRPdYXx_ic',
  ADMIN_EMAIL: 'admin@demo.com',
  ADMIN_PASSWORD: 'demo1234',
  BACKUP_DIR: path.join(__dirname, '..', 'database_backups'),
  MONITORING_FILE: path.join(__dirname, '..', 'database_backups', 'monitoring.json'),
};

// Alert thresholds
const THRESHOLDS = {
  GROWTH_RATE_DAILY: 10,      // Alert if daily growth > 10%
  GROWTH_RATE_WEEKLY: 50,     // Alert if weekly growth > 50%
  BACKUP_AGE_HOURS: 24,       // Alert if no backup in 24 hours
  TABLE_SIZE_RECORDS: 10000,  // Alert if table exceeds 10k records
  TOTAL_SIZE_RECORDS: 50000,  // Alert if total exceeds 50k records
  BACKUP_SIZE_MB: 100,        // Alert if backup exceeds 100MB
};

// Colors
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  bgRed: '\x1b[41m',
  bgYellow: '\x1b[43m',
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  alert: (msg) => console.log(`${colors.bgYellow} ALERT ${colors.reset} ${msg}`),
  critical: (msg) => console.log(`${colors.bgRed} CRITICAL ${colors.reset} ${msg}`),
  header: (msg) => console.log(`\n${colors.cyan}═══ ${msg} ═══${colors.reset}\n`),
};

// Initialize Supabase client
const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);

/**
 * Load monitoring history
 */
function loadHistory() {
  if (!fs.existsSync(CONFIG.MONITORING_FILE)) {
    return { history: [] };
  }

  try {
    const content = fs.readFileSync(CONFIG.MONITORING_FILE, 'utf8');
    return JSON.parse(content);
  } catch (err) {
    log.warning('Could not load monitoring history');
    return { history: [] };
  }
}

/**
 * Save monitoring data
 */
function saveHistory(data) {
  const history = loadHistory();
  history.history.push(data);

  // Keep only last 30 days of history
  const cutoff = Date.now() - (30 * 24 * 60 * 60 * 1000);
  history.history = history.history.filter(entry =>
    new Date(entry.timestamp).getTime() > cutoff
  );

  fs.writeFileSync(CONFIG.MONITORING_FILE, JSON.stringify(history, null, 2));
}

/**
 * Authenticate as admin
 */
async function authenticate() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: CONFIG.ADMIN_EMAIL,
    password: CONFIG.ADMIN_PASSWORD,
  });

  if (error) {
    log.error(`Authentication failed: ${error.message}`);
    return false;
  }

  return true;
}

/**
 * Get database statistics
 */
async function getDatabaseStats() {
  const stats = {
    tables: {},
    total_records: 0,
    timestamp: new Date().toISOString(),
  };

  const tables = [
    'manual_assessments',
    'profiles',
    'user_roles',
    'voice_sessions',
    'pdf_text_content',
  ];

  for (const table of tables) {
    const { count, error } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true });

    if (!error) {
      stats.tables[table] = count || 0;
      stats.total_records += count || 0;
    }
  }

  return stats;
}

/**
 * Check backup status
 */
function checkBackupStatus() {
  if (!fs.existsSync(CONFIG.BACKUP_DIR)) {
    return { latest: null, count: 0, totalSize: 0 };
  }

  const files = fs.readdirSync(CONFIG.BACKUP_DIR);
  const backups = files.filter(f => f.includes('supabase_COMPLETE_backup'));

  if (backups.length === 0) {
    return { latest: null, count: 0, totalSize: 0 };
  }

  // Get latest backup
  const sortedBackups = backups
    .map(file => ({
      name: file,
      path: path.join(CONFIG.BACKUP_DIR, file),
      stats: fs.statSync(path.join(CONFIG.BACKUP_DIR, file)),
    }))
    .sort((a, b) => b.stats.mtime - a.stats.mtime);

  const latest = sortedBackups[0];
  const totalSize = sortedBackups.reduce((sum, b) => sum + b.stats.size, 0);

  return {
    latest: {
      name: latest.name,
      date: latest.stats.mtime,
      size: latest.stats.size,
      ageHours: (Date.now() - latest.stats.mtime) / (1000 * 60 * 60),
    },
    count: backups.length,
    totalSize,
  };
}

/**
 * Calculate growth metrics
 */
function calculateGrowth(current, history) {
  const metrics = {
    daily: null,
    weekly: null,
    trend: 'stable',
  };

  if (history.history.length === 0) {
    return metrics;
  }

  // Daily growth
  const yesterday = history.history.find(entry => {
    const entryDate = new Date(entry.timestamp);
    const hoursDiff = (Date.now() - entryDate) / (1000 * 60 * 60);
    return hoursDiff >= 20 && hoursDiff <= 28;
  });

  if (yesterday) {
    const growth = ((current.total_records - yesterday.total_records) / yesterday.total_records) * 100;
    metrics.daily = growth;
  }

  // Weekly growth
  const lastWeek = history.history.find(entry => {
    const entryDate = new Date(entry.timestamp);
    const daysDiff = (Date.now() - entryDate) / (1000 * 60 * 60 * 24);
    return daysDiff >= 6 && daysDiff <= 8;
  });

  if (lastWeek) {
    const growth = ((current.total_records - lastWeek.total_records) / lastWeek.total_records) * 100;
    metrics.weekly = growth;
  }

  // Determine trend
  if (metrics.daily !== null) {
    if (metrics.daily > 5) metrics.trend = 'rapid_growth';
    else if (metrics.daily > 1) metrics.trend = 'growing';
    else if (metrics.daily < -1) metrics.trend = 'shrinking';
  }

  return metrics;
}

/**
 * Generate alerts
 */
function generateAlerts(stats, backupStatus, growth) {
  const alerts = [];

  // Check backup age
  if (!backupStatus.latest) {
    alerts.push({
      level: 'critical',
      message: 'No backups found!',
    });
  } else if (backupStatus.latest.ageHours > THRESHOLDS.BACKUP_AGE_HOURS) {
    alerts.push({
      level: 'warning',
      message: `Last backup is ${backupStatus.latest.ageHours.toFixed(1)} hours old (threshold: ${THRESHOLDS.BACKUP_AGE_HOURS}h)`,
    });
  }

  // Check backup size
  if (backupStatus.latest && backupStatus.latest.size > THRESHOLDS.BACKUP_SIZE_MB * 1024 * 1024) {
    const sizeMB = (backupStatus.latest.size / (1024 * 1024)).toFixed(2);
    alerts.push({
      level: 'warning',
      message: `Backup size (${sizeMB} MB) exceeds threshold (${THRESHOLDS.BACKUP_SIZE_MB} MB)`,
    });
  }

  // Check table sizes
  for (const [table, count] of Object.entries(stats.tables)) {
    if (count > THRESHOLDS.TABLE_SIZE_RECORDS) {
      alerts.push({
        level: 'warning',
        message: `Table '${table}' has ${count} records (threshold: ${THRESHOLDS.TABLE_SIZE_RECORDS})`,
      });
    }
  }

  // Check total size
  if (stats.total_records > THRESHOLDS.TOTAL_SIZE_RECORDS) {
    alerts.push({
      level: 'critical',
      message: `Total records (${stats.total_records}) exceeds threshold (${THRESHOLDS.TOTAL_SIZE_RECORDS})`,
    });
  }

  // Check growth rates
  if (growth.daily !== null && growth.daily > THRESHOLDS.GROWTH_RATE_DAILY) {
    alerts.push({
      level: 'warning',
      message: `Daily growth rate (${growth.daily.toFixed(1)}%) exceeds threshold (${THRESHOLDS.GROWTH_RATE_DAILY}%)`,
    });
  }

  if (growth.weekly !== null && growth.weekly > THRESHOLDS.GROWTH_RATE_WEEKLY) {
    alerts.push({
      level: 'warning',
      message: `Weekly growth rate (${growth.weekly.toFixed(1)}%) exceeds threshold (${THRESHOLDS.GROWTH_RATE_WEEKLY}%)`,
    });
  }

  return alerts;
}

/**
 * Display monitoring dashboard
 */
function displayDashboard(stats, backupStatus, growth, alerts) {
  console.clear();

  console.log(`${colors.cyan}╔════════════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.cyan}║         Supabase Database Monitoring Dashboard        ║${colors.reset}`);
  console.log(`${colors.cyan}╚════════════════════════════════════════════════════════╝${colors.reset}`);

  console.log(`\n📅 ${new Date().toLocaleString()}`);

  // Database Statistics
  log.header('Database Statistics');
  console.log(`Total Records: ${colors.magenta}${stats.total_records}${colors.reset}`);
  console.log('\nTable Breakdown:');

  for (const [table, count] of Object.entries(stats.tables)) {
    const bar = '█'.repeat(Math.floor(count / 100)).padEnd(10);
    const color = count > THRESHOLDS.TABLE_SIZE_RECORDS ? colors.yellow : colors.green;
    console.log(`  ${table.padEnd(25)} ${color}${bar}${colors.reset} ${count}`);
  }

  // Backup Status
  log.header('Backup Status');

  if (backupStatus.latest) {
    const ageColor = backupStatus.latest.ageHours > THRESHOLDS.BACKUP_AGE_HOURS ? colors.red : colors.green;
    console.log(`Latest Backup: ${backupStatus.latest.name}`);
    console.log(`Age: ${ageColor}${backupStatus.latest.ageHours.toFixed(1)} hours${colors.reset}`);
    console.log(`Size: ${(backupStatus.latest.size / (1024 * 1024)).toFixed(2)} MB`);
  } else {
    console.log(`${colors.red}No backups found!${colors.reset}`);
  }

  console.log(`Total Backups: ${backupStatus.count}`);
  console.log(`Total Size: ${(backupStatus.totalSize / (1024 * 1024)).toFixed(2)} MB`);

  // Growth Metrics
  log.header('Growth Metrics');

  if (growth.daily !== null) {
    const dailyColor = Math.abs(growth.daily) > THRESHOLDS.GROWTH_RATE_DAILY ? colors.yellow : colors.green;
    console.log(`Daily Growth: ${dailyColor}${growth.daily > 0 ? '+' : ''}${growth.daily.toFixed(1)}%${colors.reset}`);
  }

  if (growth.weekly !== null) {
    const weeklyColor = Math.abs(growth.weekly) > THRESHOLDS.GROWTH_RATE_WEEKLY ? colors.yellow : colors.green;
    console.log(`Weekly Growth: ${weeklyColor}${growth.weekly > 0 ? '+' : ''}${growth.weekly.toFixed(1)}%${colors.reset}`);
  }

  console.log(`Trend: ${growth.trend}`);

  // Alerts
  if (alerts.length > 0) {
    log.header('⚠️  Alerts');

    for (const alert of alerts) {
      if (alert.level === 'critical') {
        log.critical(alert.message);
      } else if (alert.level === 'warning') {
        log.alert(alert.message);
      } else {
        log.warning(alert.message);
      }
    }
  } else {
    log.header('✅ System Health');
    log.success('All systems operating within normal parameters');
  }

  // Recommendations
  log.header('Recommendations');

  if (backupStatus.latest && backupStatus.latest.ageHours > 12) {
    console.log('• Consider running a backup soon');
  }

  if (stats.total_records > THRESHOLDS.TOTAL_SIZE_RECORDS * 0.8) {
    console.log('• Database approaching size threshold - plan for scaling');
  }

  if (growth.trend === 'rapid_growth') {
    console.log('• Rapid growth detected - monitor closely');
  }

  if (backupStatus.count > 50) {
    console.log('• Consider archiving old backups');
  }
}

/**
 * Main monitoring function
 */
async function monitor() {
  try {
    // Authenticate
    const authenticated = await authenticate();
    if (!authenticated) {
      process.exit(1);
    }

    // Get current stats
    const stats = await getDatabaseStats();
    const backupStatus = checkBackupStatus();
    const history = loadHistory();
    const growth = calculateGrowth(stats, history);
    const alerts = generateAlerts(stats, backupStatus, growth);

    // Display dashboard
    displayDashboard(stats, backupStatus, growth, alerts);

    // Save to history
    saveHistory(stats);

    // Sign out
    await supabase.auth.signOut();

    // Return exit code based on alert status
    const hasErrors = alerts.some(a => a.level === 'critical');
    process.exit(hasErrors ? 1 : 0);

  } catch (error) {
    log.error(`Monitoring failed: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
}

// Run monitoring
monitor();