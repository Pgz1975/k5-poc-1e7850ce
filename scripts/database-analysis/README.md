# Database Analysis Scripts

This directory contains scripts for analyzing the Supabase `manual_assessments` table.

## Scripts

### 1. `analyze-subtypes.js`
Comprehensive analysis script that connects to Supabase and analyzes all unique subtypes in the manual_assessments table.

**Usage:**
```bash
npm run analyze
```

**Features:**
- Retrieves all records from manual_assessments
- Identifies unique type/subtype combinations
- Counts activities for each combination
- Analyzes content field structure
- Generates detailed reports

**Output Files:**
- `subtype-analysis-report.json` - Detailed JSON report
- `subtype-analysis-summary.txt` - Human-readable summary

### 2. `explore-database.js`
Database exploration script for checking table structure and accessibility.

**Usage:**
```bash
node explore-database.js
```

**Features:**
- Verifies table existence
- Checks for alternative table names
- Tests query permissions
- Provides diagnostic information

## Installation

```bash
npm install
```

This installs:
- `@supabase/supabase-js` (v2.39.0)

## Configuration

The scripts use the following Supabase credentials (already configured):

```javascript
SUPABASE_URL: "https://meertwtenhlmnlpwxhyz.supabase.co"
SUPABASE_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## Output

All analysis results are saved to:
- `/docs/database-analysis/` - Main reports and documentation
- Current directory - Temporary analysis outputs

## Related Files

- `/docs/database-analysis/SUBTYPE_ANALYSIS_REPORT.md` - Full report
- `/docs/database-analysis/subtypes-summary.json` - JSON data
- `/docs/database-analysis/SUBTYPES_QUICK_REFERENCE.txt` - Quick reference

## Main Analysis Script

The primary analysis script is located at:
```
/scripts/analyze-manual-assessments.mjs
```

Run it with:
```bash
node scripts/analyze-manual-assessments.mjs
```

This script provides the most comprehensive analysis with authentication.
