# Supabase Database Backup Guide

## Overview
This guide helps you backup specific tables from your Supabase database:
- ✅ **Included**: `manual_assessments`, `profiles`, `user_roles`
- ❌ **Excluded**: `voice_sessions`, `pdf_text_content`

## Method 1: Using the Export Scripts (Recommended)

### Prerequisites
You need PostgreSQL client tools installed:
```bash
# Ubuntu/Debian
sudo apt-get install postgresql-client

# macOS
brew install postgresql

# Check if installed
pg_dump --version
```

### Step 1: Get Your Database Connection String

1. Login to [Supabase Dashboard](https://app.supabase.com) with `admin@demo.com` / `demo1234`
2. Select your Lovable project
3. Go to **Settings** → **Database**
4. Find the **Connection string** section
5. Copy the connection string (it looks like: `postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`)

### Step 2: Run the Export Script

#### Option A: Bash Script
```bash
# Run the export script with your connection string
./scripts/export_database.sh "postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
```

#### Option B: Node.js Script (Interactive)
```bash
# Run the interactive script
node scripts/export_database.js

# Or provide connection string directly
node scripts/export_database.js "postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
```

## Method 2: Using Supabase Dashboard (Manual)

1. Login to Supabase Dashboard
2. Go to **SQL Editor**
3. Run these queries to export each table:

```sql
-- Export manual_assessments as CSV
COPY (
  SELECT * FROM public.manual_assessments
  ORDER BY created_at DESC
) TO '/tmp/manual_assessments.csv' WITH CSV HEADER;

-- Export profiles as CSV
COPY (
  SELECT * FROM public.profiles
  ORDER BY created_at DESC
) TO '/tmp/profiles.csv' WITH CSV HEADER;

-- Export user_roles as CSV
COPY (
  SELECT * FROM public.user_roles
  ORDER BY created_at DESC
) TO '/tmp/user_roles.csv' WITH CSV HEADER;
```

**Note**: The Dashboard method exports to CSV. For SQL format, use Method 1.

## Method 3: Using Supabase CLI

If you have project access configured:

```bash
# Login to Supabase
npx supabase login

# Link to your project
npx supabase link --project-ref [YOUR-PROJECT-REF]

# Export specific tables
npx supabase db dump \
  --include-table public.manual_assessments \
  --include-table public.profiles \
  --include-table public.user_roles \
  -f backup.sql
```

## Method 4: Using pgAdmin or DBeaver

1. **pgAdmin**:
   - Connect using your database credentials
   - Right-click on database → Backup
   - Select only the required tables

2. **DBeaver**:
   - Create connection with Supabase credentials
   - Select tables → Export Data
   - Choose SQL or CSV format

## Backup File Location

All backups are saved in: `./database_backups/`

File naming: `supabase_backup_[TIMESTAMP].sql`

## Restoring the Backup

### To Another Supabase Instance:
```bash
psql "NEW_DATABASE_URL" < database_backups/supabase_backup_[TIMESTAMP].sql
```

### Using SQL Editor:
1. Open the backup file
2. Copy the SQL content
3. Paste in Supabase SQL Editor
4. Execute

## Security Notes

⚠️ **Important Security Considerations**:
- Never commit database passwords to git
- Store connection strings in environment variables
- Use `.gitignore` for backup files containing sensitive data
- Rotate database passwords regularly
- Use read-only credentials when possible for exports

## Troubleshooting

### Error: pg_dump not found
Install PostgreSQL client tools (see Prerequisites)

### Error: Connection refused
- Check if your IP is whitelisted in Supabase
- Verify the connection string is correct
- Ensure the database is not in maintenance mode

### Error: Permission denied
- Verify you're using the correct database user
- Check if the user has SELECT permissions on the tables

## Automated Backups

For regular backups, create a cron job:
```bash
# Add to crontab (daily at 2 AM)
0 2 * * * /path/to/export_database.sh "YOUR_CONNECTION_STRING" >> /var/log/backup.log 2>&1
```

## Questions?

- Check Supabase Docs: https://supabase.com/docs/guides/database/backups
- Database Connection Issues: Check Settings → Database → Connection Pooling