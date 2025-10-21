#!/bin/bash

echo "Fixing Edge Functions..."

# Fix all Edge Functions to use proper Supabase client version
find /workspaces/k5-poc-1e7850ce/supabase/functions -name "*.ts" -type f -exec sed -i 's|@supabase/supabase-js@2"|@supabase/supabase-js@2.39.3"|g' {} \;

echo "✅ Updated Supabase client version in all Edge Functions"

# List all fixed files
echo "Fixed files:"
find /workspaces/k5-poc-1e7850ce/supabase/functions -name "*.ts" -type f | while read file; do
  if grep -q "@supabase/supabase-js@2.39.3" "$file"; then
    echo "  - $file"
  fi
done

echo ""
echo "✅ All Edge Functions have been fixed!"
echo ""
echo "To deploy the Edge Functions, run:"
echo "  supabase functions deploy"
echo ""
echo "Or deploy individual functions:"
echo "  supabase functions deploy assessment-generator"
echo "  supabase functions deploy process-pdf"
echo "  supabase functions deploy pdf-text-extractor"
echo "  supabase functions deploy pdf-image-extractor"
echo "  supabase functions deploy text-image-correlator"
echo "  supabase functions deploy language-detector"
echo "  supabase functions deploy batch-processor"