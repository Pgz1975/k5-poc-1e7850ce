#!/bin/bash

# Supabase Database Full Export using pg_dump
# This script connects directly to the Supabase PostgreSQL database

# Configuration
PROJECT_ID="meertwtenhlmnlpwxhyz"
SUPABASE_URL="https://${PROJECT_ID}.supabase.co"
DB_HOST="db.${PROJECT_ID}.supabase.co"
DB_PORT="5432"
DB_NAME="postgres"
DB_USER="postgres"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║   Supabase Database Export (pg_dump)   ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════╝${NC}\n"

echo -e "${BLUE}Project ID:${NC} ${PROJECT_ID}"
echo -e "${BLUE}Database Host:${NC} ${DB_HOST}\n"

# Check if pg_dump is installed
if ! command -v pg_dump &> /dev/null; then
    echo -e "${RED}Error: pg_dump is not installed${NC}"
    echo -e "${YELLOW}Please install PostgreSQL client tools:${NC}"
    echo -e "  Ubuntu/Debian: sudo apt-get install postgresql-client"
    echo -e "  macOS: brew install postgresql"
    echo -e "  Windows: Download from https://www.postgresql.org/download/"
    exit 1
fi

# Get database password
echo -e "${YELLOW}To get your database password:${NC}"
echo -e "1. Go to https://app.supabase.com/project/${PROJECT_ID}/settings/database"
echo -e "2. Find the 'Database Password' section"
echo -e "3. Click 'Reset Database Password' if you don't know it\n"

read -sp "Enter database password: " DB_PASSWORD
echo

# Create backup directory
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="./database_backups"
mkdir -p "$BACKUP_DIR"

# Output files
SQL_FILE="${BACKUP_DIR}/supabase_backup_${TIMESTAMP}.sql"
COMPRESSED_FILE="${BACKUP_DIR}/supabase_backup_${TIMESTAMP}.sql.gz"

# Connection string
DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}"

echo -e "\n${YELLOW}Starting database export...${NC}"
echo -e "Tables to export: manual_assessments, profiles, user_roles"
echo -e "Tables excluded: voice_sessions, pdf_text_content\n"

# Export specific tables with pg_dump
pg_dump "$DATABASE_URL" \
    --verbose \
    --no-owner \
    --no-acl \
    --clean \
    --if-exists \
    --schema=public \
    --table=public.manual_assessments \
    --table=public.profiles \
    --table=public.user_roles \
    --exclude-table=public.voice_sessions \
    --exclude-table=public.pdf_text_content \
    --file="$SQL_FILE" 2>&1 | while IFS= read -r line; do
        if [[ $line == *"dumping"* ]]; then
            echo -e "${BLUE}→${NC} $line"
        elif [[ $line == *"error"* ]] || [[ $line == *"ERROR"* ]]; then
            echo -e "${RED}✗${NC} $line"
        else
            echo "  $line"
        fi
    done

# Check if export was successful
if [ $? -eq 0 ] && [ -f "$SQL_FILE" ]; then
    echo -e "\n${GREEN}✓ Export completed successfully!${NC}"

    # Display file information
    FILE_SIZE=$(ls -lh "$SQL_FILE" | awk '{print $5}')
    echo -e "${BLUE}Backup file:${NC} $SQL_FILE"
    echo -e "${BLUE}File size:${NC} $FILE_SIZE"

    # Count lines for each table (approximate record count)
    echo -e "\n${YELLOW}═══ Backup Contents ═══${NC}"
    echo -e "Analyzing backup file..."

    MANUAL_COUNT=$(grep -c "INSERT INTO public.manual_assessments" "$SQL_FILE" 2>/dev/null || echo "0")
    PROFILES_COUNT=$(grep -c "INSERT INTO public.profiles" "$SQL_FILE" 2>/dev/null || echo "0")
    ROLES_COUNT=$(grep -c "INSERT INTO public.user_roles" "$SQL_FILE" 2>/dev/null || echo "0")

    echo -e "${BLUE}📊${NC} manual_assessments: ~${MANUAL_COUNT} inserts"
    echo -e "${BLUE}📊${NC} profiles: ~${PROFILES_COUNT} inserts"
    echo -e "${BLUE}📊${NC} user_roles: ~${ROLES_COUNT} inserts"

    # Compress the backup
    echo -e "\n${YELLOW}Compressing backup...${NC}"
    gzip -c "$SQL_FILE" > "$COMPRESSED_FILE"

    if [ -f "$COMPRESSED_FILE" ]; then
        COMPRESSED_SIZE=$(ls -lh "$COMPRESSED_FILE" | awk '{print $5}')
        echo -e "${GREEN}✓ Compressed backup created${NC}"
        echo -e "${BLUE}Compressed file:${NC} $COMPRESSED_FILE"
        echo -e "${BLUE}Compressed size:${NC} $COMPRESSED_SIZE"
    fi

    echo -e "\n${GREEN}═══ Export Complete ═══${NC}"
    echo -e "Files created in: ${BACKUP_DIR}/"

else
    echo -e "\n${RED}✗ Export failed!${NC}"
    echo -e "Please check your connection details and try again."
    echo -e "\nCommon issues:"
    echo -e "- Incorrect password"
    echo -e "- Database is in maintenance mode"
    echo -e "- Network connectivity issues"
    echo -e "- IP not whitelisted (if using IP restrictions)"
    exit 1
fi