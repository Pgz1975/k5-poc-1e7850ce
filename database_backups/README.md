# Database Backup - 2025-10-24T13-34-17

## Backup Information
- **Date**: 10/24/2025, 1:34:17 PM
- **Project ID**: meertwtenhlmnlpwxhyz
- **Project URL**: https://meertwtenhlmnlpwxhyz.supabase.co

## Files
- **SQL Backup**: `supabase_backup_2025-10-24T13-34-17.sql` (68.60 KB)
- **JSON Backup**: `supabase_backup_2025-10-24T13-34-17.json` (139.81 KB)

## Tables Included
- **manual_assessments**: 75 records
- **profiles**: 1 records
- **user_roles**: 1 records

**Total Records**: 77

## Tables Excluded
- voice_sessions (excluded as requested)
- pdf_text_content (excluded as requested)

## How to Restore

### From SQL file:
```bash
psql "postgresql://[USER]:[PASSWORD]@db.meertwtenhlmnlpwxhyz.supabase.co:5432/postgres" < supabase_backup_2025-10-24T13-34-17.sql
```

### From JSON file:
Use the provided import script or manually import via Supabase Dashboard.

## Notes
- Always test restore on a development environment first
- The SQL file includes basic table schemas
- For complete schema with all constraints, use pg_dump
