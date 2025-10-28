#!/bin/bash

# Supabase Database Backup Script
# Created: October 28, 2025
# Purpose: Perform immediate full database backup

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔══════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     🔄 Supabase Database Backup Tool 🔄              ║${NC}"
echo -e "${BLUE}║     Project: K5 Educational Platform                 ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════╝${NC}"
echo

# Configuration
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="./database_backups"
PROJECT_ID="meertwtenhlmnlpwxhyz"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

echo -e "${YELLOW}📁 Backup directory: $BACKUP_DIR${NC}"
echo

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js first.${NC}"
    exit 1
fi

# Option 1: Use the existing Node.js script
echo -e "${GREEN}Option 1: Using Node.js export script...${NC}"
echo "========================================="

if [ -f "scripts/supabase-full-backup.mjs" ]; then
    echo -e "${BLUE}Running supabase-full-backup.mjs...${NC}"
    node scripts/supabase-full-backup.mjs

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Node.js backup completed successfully!${NC}"
    else
        echo -e "${YELLOW}⚠️  Node.js backup encountered issues. Trying alternative method...${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  supabase-full-backup.mjs not found. Using alternative...${NC}"

    # Try the legacy script
    if [ -f "scripts/supabase-export.mjs" ]; then
        echo -e "${BLUE}Running supabase-export.mjs...${NC}"
        node scripts/supabase-export.mjs
    else
        echo -e "${RED}❌ No Node.js backup scripts found!${NC}"
    fi
fi

echo

# Option 2: Use Supabase CLI if available
echo -e "${GREEN}Option 2: Checking for Supabase CLI...${NC}"
echo "======================================="

if command -v supabase &> /dev/null || command -v npx &> /dev/null; then
    echo -e "${BLUE}Attempting Supabase CLI backup...${NC}"

    # Create SQL dumps using Supabase CLI
    SCHEMA_FILE="$BACKUP_DIR/schema_backup_$TIMESTAMP.sql"
    DATA_FILE="$BACKUP_DIR/data_backup_$TIMESTAMP.sql"

    # Try with npx if supabase is not installed globally
    if command -v supabase &> /dev/null; then
        SUPABASE_CMD="supabase"
    else
        SUPABASE_CMD="npx supabase"
    fi

    # Export schema
    echo -e "${BLUE}Exporting database schema...${NC}"
    $SUPABASE_CMD db dump --schema-only -f "$SCHEMA_FILE" 2>/dev/null

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Schema exported to: $SCHEMA_FILE${NC}"
    fi

    # Export data
    echo -e "${BLUE}Exporting database data...${NC}"
    $SUPABASE_CMD db dump --data-only -f "$DATA_FILE" 2>/dev/null

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Data exported to: $DATA_FILE${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Supabase CLI not available. Install with: npm install -g supabase${NC}"
fi

echo

# Create a backup summary
SUMMARY_FILE="$BACKUP_DIR/backup_summary_$TIMESTAMP.md"
echo -e "${GREEN}Creating backup summary...${NC}"

cat > "$SUMMARY_FILE" << EOF
# Backup Summary

**Date:** $(date +"%Y-%m-%d %H:%M:%S")
**Project:** K5 Educational Platform
**Database:** $PROJECT_ID.supabase.co

## Backup Files Created

| File | Type | Created |
|------|------|---------|
EOF

# List all backup files created in this session
for file in "$BACKUP_DIR"/*"$TIMESTAMP"*; do
    if [ -f "$file" ]; then
        filename=$(basename "$file")
        filetype="${filename##*.}"
        filesize=$(ls -lh "$file" | awk '{print $5}')
        echo "| $filename | $filetype | $filesize |" >> "$SUMMARY_FILE"
    fi
done

cat >> "$SUMMARY_FILE" << EOF

## Next Steps

1. Verify the backup files are complete
2. Store backups in a secure location
3. Test restoration on a development environment
4. Document this backup in your backup log

## Restoration Commands

### From SQL files:
\`\`\`bash
# Schema restoration
psql [DATABASE_URL] < schema_backup_$TIMESTAMP.sql

# Data restoration
psql [DATABASE_URL] < data_backup_$TIMESTAMP.sql
\`\`\`

### From JSON files:
\`\`\`bash
# Use the Node.js restoration script
node scripts/restore-backup.mjs supabase_COMPLETE_backup_*.json
\`\`\`
EOF

echo -e "${GREEN}✅ Backup summary saved to: $SUMMARY_FILE${NC}"

# Final summary
echo
echo -e "${BLUE}╔══════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║           📊 Backup Complete Summary 📊              ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════╝${NC}"
echo
echo -e "${GREEN}Backup Location: $BACKUP_DIR${NC}"
echo -e "${GREEN}Timestamp: $TIMESTAMP${NC}"
echo

# List all files created
echo -e "${YELLOW}Files created:${NC}"
ls -lah "$BACKUP_DIR" | grep "$TIMESTAMP" | while read -r line; do
    echo "  $line"
done

echo
echo -e "${GREEN}✅ Backup process completed!${NC}"
echo
echo -e "${YELLOW}⚠️  IMPORTANT: Please verify the backup files and store them securely.${NC}"
echo -e "${YELLOW}    Test restoration on a development environment before relying on these backups.${NC}"

# Make the script executable for future use
chmod +x "$0" 2>/dev/null

exit 0