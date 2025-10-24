#!/usr/bin/env node

/**
 * Supabase Database Export Script
 * Exports specific tables: manual_assessments, profiles, user_roles
 * Excludes: voice_sessions, pdf_text_content
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Color output helpers
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`)
};

// Create readline interface for password input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to get connection details
async function getConnectionDetails() {
  console.log(`${colors.green}Supabase Database Export Tool${colors.reset}`);
  console.log('================================\n');

  log.info('To get your database connection details:');
  log.info('1. Go to your Supabase Dashboard');
  log.info('2. Navigate to Settings > Database');
  log.info('3. Find the "Connection string" section\n');

  return new Promise((resolve) => {
    rl.question('Enter your Supabase project URL (e.g., abcdefghijklmnop.supabase.co): ', (projectUrl) => {
      rl.question('Enter the database password: ', (password) => {
        rl.question('Enter the port (default: 5432): ', (port) => {
          rl.close();

          const host = `db.${projectUrl}`;
          const database = 'postgres';
          const user = 'postgres';
          const portNumber = port || '5432';

          const connectionString = `postgresql://${user}:${password}@${host}:${portNumber}/${database}`;

          resolve(connectionString);
        });
      });
    });
  });
}

// Function to export database
function exportDatabase(connectionString) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  const outputDir = path.join(process.cwd(), 'database_backups');
  const outputFile = path.join(outputDir, `supabase_backup_${timestamp}.sql`);

  // Create backup directory
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  log.info('Starting database export...');
  log.info('Tables to export: manual_assessments, profiles, user_roles');

  const pgDumpCommand = `pg_dump "${connectionString}" \
    --no-owner \
    --no-acl \
    --clean \
    --if-exists \
    --schema=public \
    --table=public.manual_assessments \
    --table=public.profiles \
    --table=public.user_roles \
    --file="${outputFile}"`;

  exec(pgDumpCommand, (error, stdout, stderr) => {
    if (error) {
      log.error(`Export failed: ${error.message}`);

      // Provide alternative method if pg_dump is not available
      log.warning('If pg_dump is not installed, you can:');
      log.info('1. Install PostgreSQL client tools:');
      log.info('   Ubuntu/Debian: sudo apt-get install postgresql-client');
      log.info('   macOS: brew install postgresql');
      log.info('2. Or use the Supabase Dashboard to export data');
      return;
    }

    if (stderr && !stderr.includes('Warning')) {
      log.warning(`Warnings: ${stderr}`);
    }

    log.success('Export completed successfully!');
    log.success(`Backup saved to: ${outputFile}`);

    // Check file size
    const stats = fs.statSync(outputFile);
    const fileSizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
    log.info(`File size: ${fileSizeInMB} MB`);

    // Create a README for the backup
    const readmePath = path.join(outputDir, 'README.md');
    const readmeContent = `# Database Backup

## Backup Information
- **Date**: ${new Date().toLocaleString()}
- **File**: ${path.basename(outputFile)}
- **Size**: ${fileSizeInMB} MB

## Tables Included
- manual_assessments
- profiles
- user_roles

## Tables Excluded
- voice_sessions (excluded as requested)
- pdf_text_content (excluded as requested)

## How to Restore

### Using psql:
\`\`\`bash
psql "YOUR_DATABASE_URL" < ${path.basename(outputFile)}
\`\`\`

### Using Supabase Dashboard:
1. Go to SQL Editor in your Supabase Dashboard
2. Copy the contents of the backup file
3. Paste and execute

## Notes
- This backup includes table structure and data
- Foreign key constraints are preserved
- Make sure to test restore on a development environment first
`;

    fs.writeFileSync(readmePath, readmeContent);
    log.success('README.md created in backup directory');
  });
}

// Alternative: Direct SQL export using Supabase client
async function exportUsingSupabaseClient() {
  log.info('\nAlternative method using Supabase CLI:');

  const exportCommands = `
# Method 1: Using Supabase CLI (if you have access to the project)
npx supabase db dump --data-only -f backup.sql

# Method 2: Using SQL Editor in Supabase Dashboard
# Run this query to export data as CSV:

-- Export manual_assessments
COPY (SELECT * FROM public.manual_assessments)
TO STDOUT WITH CSV HEADER;

-- Export profiles
COPY (SELECT * FROM public.profiles)
TO STDOUT WITH CSV HEADER;

-- Export user_roles
COPY (SELECT * FROM public.user_roles)
TO STDOUT WITH CSV HEADER;
`;

  console.log(exportCommands);
}

// Main execution
async function main() {
  try {
    // Check if connection string is provided as argument
    if (process.argv[2]) {
      exportDatabase(process.argv[2]);
    } else {
      const connectionString = await getConnectionDetails();
      exportDatabase(connectionString);
    }
  } catch (error) {
    log.error(`An error occurred: ${error.message}`);
    exportUsingSupabaseClient();
  }
}

// Run the script
main();