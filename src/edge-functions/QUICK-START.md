# Edge Functions Quick Start Guide

## 🚀 5-Minute Deployment

### 1. Install CLI
```bash
npm install -g supabase
```

### 2. Login & Link
```bash
supabase login
supabase link --project-ref <your-project-ref>
```

### 3. Set Secrets
```bash
supabase secrets set SUPABASE_URL=https://your-project.supabase.co
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 4. Deploy All Functions
```bash
cd /workspaces/k5-poc-1e7850ce/src/edge-functions

# Deploy each function
for func in pdf-upload pdf-processor text-extractor image-extractor language-detector content-correlator quality-validator assessment-generator; do
  supabase functions deploy $func
done
```

### 5. Create Storage Buckets
```sql
-- Run in Supabase SQL Editor

INSERT INTO storage.buckets (id, name, public)
VALUES
  ('educational-pdfs', 'educational-pdfs', false),
  ('educational-images', 'educational-images', true);

-- Set policies
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'educational-pdfs');

CREATE POLICY "Allow public reads on images"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'educational-images');

CREATE POLICY "Service role full access"
ON storage.objects FOR ALL TO service_role
USING (true);
```

## 📝 Test Upload

```bash
# Upload a PDF
curl -X POST https://your-project.supabase.co/functions/v1/pdf-upload \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -F "file=@sample.pdf" \
  -F 'metadata={"contentType":"reading_passage","gradeLevel":["3"],"subjectArea":["reading"],"primaryLanguage":"spanish"}'
```

## 📊 Monitor Processing

```sql
-- Check processing status
SELECT
  filename,
  processing_status,
  page_count,
  word_count,
  image_count,
  quality_score,
  processing_completed_at - processing_started_at as duration
FROM pdf_documents
ORDER BY created_at DESC
LIMIT 10;

-- View errors
SELECT * FROM pdf_processing_logs
WHERE log_level = 'error'
ORDER BY created_at DESC;
```

## 🎯 Function Overview

| Function | Purpose | Endpoint |
|----------|---------|----------|
| pdf-upload | Upload & validate PDFs | `/functions/v1/pdf-upload` |
| pdf-processor | Orchestrate processing | `/functions/v1/pdf-processor` |
| text-extractor | Extract text with positions | `/functions/v1/text-extractor` |
| image-extractor | Extract & optimize images | `/functions/v1/image-extractor` |
| language-detector | Detect Spanish/English | `/functions/v1/language-detector` |
| content-correlator | Link text & images | `/functions/v1/content-correlator` |
| quality-validator | Validate quality | `/functions/v1/quality-validator` |
| assessment-generator | Parse questions | `/functions/v1/assessment-generator` |

## 🔧 Troubleshooting

**Function timeout?**
- Check logs: `supabase functions logs <function-name>`
- Increase timeout in config

**Storage errors?**
- Verify buckets exist
- Check storage policies
- Ensure service role key is set

**Processing stuck?**
- Check `pdf_processing_logs` table
- Verify all functions are deployed
- Check function status: `supabase functions list`

## 📚 Documentation

- Full README: `./README.md`
- Deployment Guide: `./DEPLOYMENT.md`
- Implementation Details: `/docs/technical/EDGE-FUNCTIONS-IMPLEMENTATION.md`
- Database Schema: `/docs/plan/PDF-PARSING-IMPLEMENTATION-PLAN.md`

## ✅ Checklist

- [ ] CLI installed
- [ ] Project linked
- [ ] Secrets set
- [ ] All 8 functions deployed
- [ ] Storage buckets created
- [ ] Policies configured
- [ ] Test upload successful
- [ ] Processing pipeline verified

---

**Ready to deploy?** Follow the checklist above and you'll be processing PDFs in minutes!
