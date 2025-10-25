# Database Backup - 2025-10-25T09-38-31

## Backup Information
- **Date**: 10/25/2025, 9:38:31 AM
- **Project ID**: meertwtenhlmnlpwxhyz
- **Project URL**: https://meertwtenhlmnlpwxhyz.supabase.co

## Files
- **SQL Backup**: `supabase_backup_2025-10-25T09-38-31.sql` (189.34 KB)
- **JSON Backup**: `supabase_backup_2025-10-25T09-38-31.json` (382.31 KB)

## Tables Included
- **manual_assessments**: 193 records
- **profiles**: 1 records
- **user_roles**: 1 records

**Total Records**: 195

## Tables Excluded
- voice_sessions (excluded as requested)
- pdf_text_content (excluded as requested)

## How to Restore

### From SQL file:
```bash
psql "postgresql://[USER]:[PASSWORD]@db.meertwtenhlmnlpwxhyz.supabase.co:5432/postgres" < supabase_backup_2025-10-25T09-38-31.sql
```

### From JSON file:
Use the provided import script or manually import via Supabase Dashboard.

## Notes
- Always test restore on a development environment first
- The SQL file includes basic table schemas
- For complete schema with all constraints, use pg_dump
