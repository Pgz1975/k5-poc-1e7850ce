#!/bin/bash

# Supabase Database Export Script
# This script exports specific tables from your Supabase database
# Tables to export: manual_assessments, profiles, user_roles

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Supabase Database Export Tool${NC}"
echo -e "${YELLOW}================================${NC}\n"

# Check if DATABASE_URL is provided
if [ -z "$1" ]; then
    echo -e "${RED}Error: Please provide your Supabase database URL${NC}"
    echo -e "Usage: ./export_database.sh \"postgresql://[USER]:[PASSWORD]@[HOST]:[PORT]/[DATABASE]\""
    echo -e "\nYou can find your database URL in:"
    echo -e "  1. Supabase Dashboard > Settings > Database"
    echo -e "  2. Connection string (URI) section"
    echo -e "  3. Make sure to use the correct password\n"
    exit 1
fi

DATABASE_URL=$1
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
OUTPUT_DIR="./database_backups"
OUTPUT_FILE="$OUTPUT_DIR/supabase_backup_${TIMESTAMP}.sql"

# Create backup directory if it doesn't exist
mkdir -p $OUTPUT_DIR

echo -e "${YELLOW}Starting database export...${NC}"
echo -e "Exporting tables: manual_assessments, profiles, user_roles\n"

# Export specific tables using pg_dump
# --no-owner: Don't output commands to set ownership
# --no-acl: Don't output commands to set access privileges
# --clean: Output commands to drop database objects before creating them
# --if-exists: Use IF EXISTS when dropping objects
pg_dump "$DATABASE_URL" \
    --no-owner \
    --no-acl \
    --clean \
    --if-exists \
    --table=public.manual_assessments \
    --table=public.profiles \
    --table=public.user_roles \
    --file="$OUTPUT_FILE"

# Check if export was successful
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Export completed successfully!${NC}"
    echo -e "Backup saved to: ${OUTPUT_FILE}"

    # Display file size
    FILE_SIZE=$(ls -lh "$OUTPUT_FILE" | awk '{print $5}')
    echo -e "File size: ${FILE_SIZE}"

    # Count records in each table (optional - requires psql)
    echo -e "\n${YELLOW}Backup Summary:${NC}"
    echo "- manual_assessments table"
    echo "- profiles table"
    echo "- user_roles table"
else
    echo -e "${RED}✗ Export failed!${NC}"
    echo -e "Please check your database URL and try again."
    exit 1
fi

echo -e "\n${GREEN}Backup completed!${NC}"