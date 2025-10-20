# Supabase Edge Functions Deployment Guide

## Prerequisites

1. **Install Supabase CLI**
```bash
npm install -g supabase
```

2. **Login to Supabase**
```bash
supabase login
```

3. **Link Project**
```bash
supabase link --project-ref <your-project-ref>
```

## Environment Variables

Set these secrets in your Supabase project:

```bash
# Required for all functions
supabase secrets set SUPABASE_URL=https://your-project.supabase.co
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Optional: For production monitoring
supabase secrets set SENTRY_DSN=your-sentry-dsn
```

## Deployment

### Deploy All Functions at Once

```bash
# From the project root
cd /workspaces/k5-poc-1e7850ce/src/edge-functions

# Deploy all functions
supabase functions deploy pdf-upload
supabase functions deploy pdf-processor
supabase functions deploy text-extractor
supabase functions deploy image-extractor
supabase functions deploy language-detector
supabase functions deploy content-correlator
supabase functions deploy quality-validator
supabase functions deploy assessment-generator
```

### Deploy Individual Functions

```bash
# Deploy a specific function
supabase functions deploy pdf-upload

# Deploy with custom environment
supabase functions deploy pdf-upload --env-file .env.production
```

### Batch Deployment Script

Create a deployment script:

```bash
#!/bin/bash
# deploy-all.sh

FUNCTIONS=(
  "pdf-upload"
  "pdf-processor"
  "text-extractor"
  "image-extractor"
  "language-detector"
  "content-correlator"
  "quality-validator"
  "assessment-generator"
)

for func in "${FUNCTIONS[@]}"; do
  echo "Deploying $func..."
  supabase functions deploy $func

  if [ $? -eq 0 ]; then
    echo "✅ $func deployed successfully"
  else
    echo "❌ $func deployment failed"
    exit 1
  fi
done

echo "🎉 All functions deployed successfully!"
```

Make it executable:
```bash
chmod +x deploy-all.sh
./deploy-all.sh
```

## Local Development

### Start Supabase Locally

```bash
# Start all Supabase services
supabase start

# This will start:
# - PostgreSQL database
# - Storage API
# - Auth API
# - Edge Functions runtime
```

### Serve Functions Locally

```bash
# Serve all functions
supabase functions serve

# Serve specific function with environment variables
supabase functions serve pdf-upload --env-file .env.local --debug
```

### Test Functions Locally

```bash
# Test pdf-upload function
curl -X POST http://localhost:54321/functions/v1/pdf-upload \
  -H "Authorization: Bearer eyJhbGc..." \
  -F "file=@test-files/sample.pdf" \
  -F 'metadata={"contentType":"reading_passage","gradeLevel":["3"],"subjectArea":["reading"],"primaryLanguage":"spanish"}'

# Test with curl verbose mode
curl -v -X POST http://localhost:54321/functions/v1/pdf-upload \
  -H "Authorization: Bearer eyJhbGc..." \
  -F "file=@test-files/sample.pdf" \
  -F 'metadata={"contentType":"assessment","gradeLevel":["5"],"subjectArea":["comprehension"],"primaryLanguage":"english"}'
```

### View Function Logs

```bash
# View logs for all functions
supabase functions logs

# View logs for specific function
supabase functions logs pdf-upload

# Follow logs in real-time
supabase functions logs pdf-upload --follow

# Filter by log level
supabase functions logs pdf-upload --level error
```

## Database Setup

Before deploying, ensure your database schema is set up:

```bash
# Apply migrations
supabase db push

# Or run SQL directly
supabase db execute < database/schema.sql
```

## Storage Buckets

Create required storage buckets:

```sql
-- Run in Supabase SQL Editor or via CLI

-- Create educational-pdfs bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('educational-pdfs', 'educational-pdfs', false);

-- Create educational-images bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('educational-images', 'educational-images', true);

-- Set up storage policies
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'educational-pdfs');

CREATE POLICY "Allow public reads on images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'educational-images');

CREATE POLICY "Allow service role full access"
ON storage.objects FOR ALL
TO service_role
USING (true);
```

## Monitoring and Debugging

### Enable Function Logs

All functions include comprehensive logging. View logs in:
- Supabase Dashboard → Edge Functions → Logs
- CLI: `supabase functions logs <function-name>`

### Check Function Status

```bash
# List all deployed functions
supabase functions list

# Get function details
supabase functions inspect pdf-upload
```

### Performance Monitoring

Check processing logs in the database:

```sql
-- View recent processing jobs
SELECT
  pd.id,
  pd.filename,
  pd.processing_status,
  pd.processing_started_at,
  pd.processing_completed_at,
  EXTRACT(EPOCH FROM (pd.processing_completed_at - pd.processing_started_at)) as processing_seconds
FROM pdf_documents pd
ORDER BY pd.created_at DESC
LIMIT 20;

-- View processing errors
SELECT
  pl.pdf_document_id,
  pl.processing_step,
  pl.log_level,
  pl.log_message,
  pl.created_at
FROM pdf_processing_logs pl
WHERE pl.log_level = 'error'
ORDER BY pl.created_at DESC
LIMIT 50;
```

## Production Checklist

- [ ] All environment variables set via `supabase secrets set`
- [ ] Database schema deployed and migrations applied
- [ ] Storage buckets created with correct policies
- [ ] Functions deployed and verified
- [ ] Test upload and processing pipeline end-to-end
- [ ] Monitor function execution times
- [ ] Set up error alerting (e.g., Sentry integration)
- [ ] Configure CORS for your frontend domains
- [ ] Enable rate limiting if needed
- [ ] Document API endpoints for frontend team

## Rollback

If you need to rollback a deployment:

```bash
# Redeploy previous version
git checkout <previous-commit>
supabase functions deploy <function-name>

# Or restore from backup
supabase functions deploy <function-name> --legacy-bundle
```

## CI/CD Integration

### GitHub Actions Example

```yaml
# .github/workflows/deploy-functions.yml
name: Deploy Edge Functions

on:
  push:
    branches: [main]
    paths:
      - 'src/edge-functions/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Supabase CLI
        uses: supabase/setup-cli@v1
        with:
          version: latest

      - name: Deploy Functions
        env:
          SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
          PROJECT_ID: ${{ secrets.SUPABASE_PROJECT_ID }}
        run: |
          supabase link --project-ref $PROJECT_ID
          cd src/edge-functions
          ./deploy-all.sh
```

## Troubleshooting

### Common Issues

**1. Function timeout**
- Increase timeout in function config
- Optimize processing (batch operations, parallel execution)
- Use chunking for large files

**2. Memory errors**
- Process PDFs in smaller chunks
- Clear large variables after use
- Use streaming where possible

**3. CORS errors**
- Verify CORS headers in function responses
- Check allowed origins in Supabase settings

**4. Authentication errors**
- Verify JWT is being passed correctly
- Check `verify_jwt` setting in config
- Ensure service role key is set for internal functions

**5. Storage errors**
- Verify bucket exists
- Check storage policies
- Ensure service role key has storage access

## Support

- Supabase Docs: https://supabase.com/docs/guides/functions
- Deno Runtime: https://deno.land/manual
- PDF.js: https://mozilla.github.io/pdf.js/

## Version History

- v1.0.0 (2025-10-20): Initial deployment of all 8 edge functions
