-- ============================================================================
-- STORAGE BUCKETS SETUP
-- ============================================================================
-- Create storage buckets for K5 PDF parsing system

-- Bucket 1: educational-pdfs (Private bucket for original PDFs and processed data)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'educational-pdfs',
  'educational-pdfs',
  false,
  104857600, -- 100MB limit
  ARRAY['application/pdf', 'application/json', 'image/jpeg', 'image/png', 'image/webp']::text[]
);

-- Bucket 2: pdf-images (Public bucket for extracted images)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'pdf-images',
  'pdf-images',
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp']::text[]
);

-- Bucket 3: pdf-thumbnails (Public bucket for thumbnails)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'pdf-thumbnails',
  'pdf-thumbnails',
  true,
  2097152, -- 2MB limit
  ARRAY['image/jpeg', 'image/png']::text[]
);

-- ============================================================================
-- STORAGE RLS POLICIES
-- ============================================================================

-- educational-pdfs bucket policies
CREATE POLICY "Users can upload their own PDFs"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'educational-pdfs' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own PDFs"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'educational-pdfs' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update their own PDFs"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'educational-pdfs' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own PDFs"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'educational-pdfs' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- pdf-images bucket policies (public read)
CREATE POLICY "Public can view PDF images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'pdf-images');

CREATE POLICY "Authenticated users can upload PDF images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'pdf-images' AND
    auth.role() = 'authenticated'
  );

-- pdf-thumbnails bucket policies (public read)
CREATE POLICY "Public can view thumbnails"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'pdf-thumbnails');

CREATE POLICY "Authenticated users can upload thumbnails"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'pdf-thumbnails' AND
    auth.role() = 'authenticated'
  );