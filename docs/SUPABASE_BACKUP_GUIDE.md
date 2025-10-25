# Supabase Database Backup Guide

**Last Updated:** October 25, 2025
**Version:** 2.0 - Complete Database Export

---

## 🚀 Overview

This guide documents the comprehensive Supabase database backup system that exports **ALL tables** from the database automatically. The backup system dynamically discovers and backs up every table, ensuring complete data preservation.

## 📊 Current Database Statistics

As of the latest backup (October 25, 2025):

| Table | Records | Description |
|-------|---------|-------------|
| **voice_sessions** | 271 | Voice interaction session data |
| **manual_assessments** | 180 | Student assessment records |
| **profiles** | 1 | User profile information |
| **user_roles** | 1 | User role assignments |
| **pdf_text_content** | 0 | Extracted PDF content |
| **Total** | **453 records** | Across 5 tables |

## 🛠️ Backup Scripts

### Primary Script: `supabase-full-backup.mjs`

The enhanced backup script that automatically discovers and exports ALL tables.

**Location:** `/scripts/supabase-full-backup.mjs`

**Features:**
- ✅ Dynamic table discovery
- ✅ Automatic schema detection
- ✅ Exports ALL tables (no exclusions)
- ✅ Dual format output (SQL + JSON)
- ✅ Progress indicators for large tables
- ✅ Comprehensive error handling
- ✅ Automatic README generation

### Legacy Script: `supabase-export.mjs`

This script has been updated to use the comprehensive backup approach.

**Location:** `/scripts/supabase-export.mjs`

## 📦 How to Run Backups

### Quick Backup Command

```bash
# Run from project root
node scripts/supabase-full-backup.mjs
```

### Alternative Commands

```bash
# Using the legacy script name (now uses full backup)
node scripts/supabase-export.mjs

# Make script executable and run directly
chmod +x scripts/supabase-full-backup.mjs
./scripts/supabase-full-backup.mjs
```

## 📁 Backup Output

All backups are saved to: `/database_backups/`

### File Naming Convention

```
supabase_COMPLETE_backup_YYYY-MM-DDTHH-mm-ss.sql
supabase_COMPLETE_backup_YYYY-MM-DDTHH-mm-ss.json
README.md
```

### Output Formats

#### 1. SQL Format (.sql)
- Complete SQL dump with INSERT statements
- Includes table schemas (CREATE TABLE)
- Foreign key constraints disabled during import
- Ready for direct PostgreSQL import

#### 2. JSON Format (.json)
- Structured JSON with metadata
- Includes table schemas and column types
- Easier for programmatic manipulation
- Larger file size but more flexible

## 🔄 How to Restore Backups

### From SQL File

```bash
# Full database restore
psql "postgresql://[USER]:[PASSWORD]@db.meertwtenhlmnlpwxhyz.supabase.co:5432/postgres" < supabase_COMPLETE_backup_YYYY-MM-DD.sql

# Restore specific table only
grep -A 1000 "Table: manual_assessments" backup.sql | psql [CONNECTION_STRING]
```

### From JSON File

```javascript
// JavaScript restoration example
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const backup = JSON.parse(fs.readFileSync('backup.json', 'utf8'));
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Restore all tables
for (const [tableName, data] of Object.entries(backup.data)) {
  if (data && data.length > 0) {
    const { error } = await supabase
      .from(tableName)
      .insert(data);

    if (error) {
      console.error(`Failed to restore ${tableName}:`, error);
    } else {
      console.log(`Restored ${data.length} records to ${tableName}`);
    }
  }
}
```

## 🔍 What Gets Backed Up

### Automatically Discovered Tables

The backup script automatically discovers ALL tables including:

- **Core Tables**
  - `manual_assessments` - Student assessment data
  - `profiles` - User profiles
  - `user_roles` - Role assignments

- **Voice/Audio Tables**
  - `voice_sessions` - Voice interaction sessions
  - `coqui_interactions` - Coqui AI interactions (when implemented)
  - `voice_cost_optimization` - Cost tracking (when implemented)

- **Content Tables**
  - `pdf_text_content` - Extracted PDF content
  - `teacher_guidance_templates` - Teaching templates (when implemented)

- **Analytics Tables**
  - `student_adaptation_metrics` - Learning metrics (when implemented)

- **Future Tables**
  - Any new tables added to the database are automatically included

### Data Retention

- All records are exported regardless of age
- No filtering or exclusions applied
- Complete historical data preserved

## 🔐 Security Considerations

### Authentication
- Uses admin credentials stored in script
- Admin email: `admin@demo.com`
- Password: Configured in script

### Best Practices
1. **Never commit credentials to git**
2. **Store backups securely**
3. **Encrypt sensitive backups**
4. **Test restore on development first**
5. **Rotate admin passwords regularly**

## 📊 Backup Monitoring

### Success Indicators

A successful backup will show:
```
╔════════════════════════════════════════════════╗
║     🎉 COMPLETE Export Successful! 🎉         ║
║                                                ║
║  All X tables exported successfully!           ║
║  Total: Y records backed up                    ║
╚════════════════════════════════════════════════╝
```

### Common Issues and Solutions

| Issue | Solution |
|-------|----------|
| Authentication failed | Verify admin credentials in script |
| Table not found | Table may not exist yet or no access rights |
| Timeout on large tables | Script handles pagination automatically |
| RPC not available | Script falls back to manual discovery |
| Order by 'created_at' fails | Script automatically retries without ordering |

## 🚀 Advanced Features

### Table Discovery Methods

1. **RPC Method** (Primary)
   - Attempts to use `get_all_tables` RPC function
   - Fastest method if available

2. **Manual Discovery** (Fallback)
   - Tests known table names
   - Tries common naming patterns
   - Discovers tables through trial

### Progress Indicators

For tables with >1000 records:
```
Progress: 45% (4500/10000 records)
```

### Automatic Schema Detection

The script infers column types from data:
- UUID detection for IDs
- TIMESTAMPTZ for dates
- JSONB for objects
- INTEGER/NUMERIC for numbers
- BOOLEAN for true/false
- TEXT for strings

## 📈 Performance Metrics

### Typical Backup Times

| Records | Time |
|---------|------|
| <1,000 | <5 seconds |
| 1,000-10,000 | 10-30 seconds |
| 10,000-50,000 | 1-3 minutes |
| 50,000+ | 3-10 minutes |

### File Sizes

| Records | SQL Size | JSON Size |
|---------|----------|-----------|
| 453 (current) | ~250 KB | ~490 KB |
| 1,000 | ~500 KB | ~1 MB |
| 10,000 | ~5 MB | ~10 MB |
| 100,000 | ~50 MB | ~100 MB |

## 🔄 Backup Schedule Recommendations

### Development Environment
- **Frequency:** Before major changes
- **Retention:** Keep last 5 backups

### Staging Environment
- **Frequency:** Daily
- **Retention:** 7 days

### Production Environment
- **Frequency:** Every 4-6 hours
- **Retention:** 30 days
- **Archive:** Monthly backups for 1 year

## 📝 Changelog

### Version 2.0 (October 25, 2025)
- ✅ Complete rewrite for comprehensive backup
- ✅ Dynamic table discovery
- ✅ Exports ALL tables (removed exclusions)
- ✅ Enhanced error handling
- ✅ Progress indicators
- ✅ Automatic schema detection

### Version 1.0
- Basic backup of 3 tables only
- Hardcoded table list
- Limited error handling

## 🆘 Troubleshooting

### Debug Mode

To see detailed debug output:
```javascript
// Add to script
const DEBUG = true;
if (DEBUG) console.log('Debug:', data);
```

### Connection Issues

Test connection:
```bash
# Test Supabase connection
curl https://meertwtenhlmnlpwxhyz.supabase.co/rest/v1/

# Test authentication
curl -H "apikey: YOUR_ANON_KEY" \
     -H "Authorization: Bearer YOUR_ANON_KEY" \
     https://meertwtenhlmnlpwxhyz.supabase.co/rest/v1/profiles
```

### Restore Validation

After restore, verify:
```sql
-- Check record counts
SELECT
  'manual_assessments' as table_name,
  COUNT(*) as count
FROM manual_assessments
UNION ALL
SELECT
  'voice_sessions',
  COUNT(*)
FROM voice_sessions
-- Add more tables as needed
```

## 📚 Related Documentation

- [Coqui Voice Integration Plan](./plan/19-coqui-voice/README.md)
- [Database Schema](./plan/19-coqui-voice/DATABASE-SCHEMA.sql)
- [API Specifications](./plan/19-coqui-voice/API-SPECIFICATIONS.md)

## 🤝 Support

For issues or questions:
1. Check this guide first
2. Review script output for errors
3. Check Supabase dashboard for table access
4. Contact system administrator

---

**Remember:** Always test restore procedures on a development environment before applying to production!