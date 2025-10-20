-- ============================================
-- Supabase Storage Row Level Security (RLS)
-- K5 PDF Assessment System
-- ============================================

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PDF ORIGINALS BUCKET
-- ============================================

-- Allow authenticated teachers and admins to upload
CREATE POLICY "pdf_originals_upload_teachers"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'pdf-originals' AND
  (auth.jwt()->>'role')::text IN ('teacher', 'admin')
);

-- Allow authenticated users to read their own or public files
CREATE POLICY "pdf_originals_read_authenticated"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'pdf-originals' AND
  (
    auth.uid() = owner OR
    (auth.jwt()->>'role')::text IN ('teacher', 'admin')
  )
);

-- Allow admins to update metadata
CREATE POLICY "pdf_originals_update_admin"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'pdf-originals' AND
  (auth.jwt()->>'role')::text = 'admin'
)
WITH CHECK (
  bucket_id = 'pdf-originals' AND
  (auth.jwt()->>'role')::text = 'admin'
);

-- Allow admins to delete
CREATE POLICY "pdf_originals_delete_admin"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'pdf-originals' AND
  (auth.jwt()->>'role')::text = 'admin'
);

-- ============================================
-- PDF IMAGES BUCKET
-- ============================================

-- Public read access
CREATE POLICY "pdf_images_read_public"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (bucket_id = 'pdf-images');

-- Authenticated users can upload
CREATE POLICY "pdf_images_upload_authenticated"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'pdf-images'
);

-- Users can update their own images
CREATE POLICY "pdf_images_update_owner"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'pdf-images' AND
  auth.uid() = owner
)
WITH CHECK (
  bucket_id = 'pdf-images' AND
  auth.uid() = owner
);

-- Users can delete their own images, admins can delete any
CREATE POLICY "pdf_images_delete"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'pdf-images' AND
  (
    auth.uid() = owner OR
    (auth.jwt()->>'role')::text = 'admin'
  )
);

-- ============================================
-- PDF THUMBNAILS BUCKET
-- ============================================

-- Public read access
CREATE POLICY "pdf_thumbnails_read_public"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (bucket_id = 'pdf-thumbnails');

-- System and authenticated users can upload
CREATE POLICY "pdf_thumbnails_upload_system"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'pdf-thumbnails'
);

-- Automatic cleanup policy (handled by application)
-- Old thumbnails (>30 days) should be deleted via scheduled function

-- ============================================
-- PDF PROCESSED BUCKET
-- ============================================

-- Public read access for processed content
CREATE POLICY "pdf_processed_read_public"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (bucket_id = 'pdf-processed');

-- Teachers and admins can upload
CREATE POLICY "pdf_processed_upload_teachers"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'pdf-processed' AND
  (auth.jwt()->>'role')::text IN ('teacher', 'admin')
);

-- Teachers can update their own, admins can update any
CREATE POLICY "pdf_processed_update"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'pdf-processed' AND
  (
    auth.uid() = owner OR
    (auth.jwt()->>'role')::text = 'admin'
  )
)
WITH CHECK (
  bucket_id = 'pdf-processed' AND
  (
    auth.uid() = owner OR
    (auth.jwt()->>'role')::text = 'admin'
  )
);

-- Admins can delete
CREATE POLICY "pdf_processed_delete_admin"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'pdf-processed' AND
  (auth.jwt()->>'role')::text = 'admin'
);

-- ============================================
-- ASSESSMENT ASSETS BUCKET
-- ============================================

-- Public read access
CREATE POLICY "assessment_assets_read_public"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (bucket_id = 'assessment-assets');

-- Teachers and admins can upload
CREATE POLICY "assessment_assets_upload_teachers"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'assessment-assets' AND
  (auth.jwt()->>'role')::text IN ('teacher', 'admin')
);

-- Teachers can update their own, admins can update any
CREATE POLICY "assessment_assets_update"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'assessment-assets' AND
  (
    auth.uid() = owner OR
    (auth.jwt()->>'role')::text = 'admin'
  )
)
WITH CHECK (
  bucket_id = 'assessment-assets' AND
  (
    auth.uid() = owner OR
    (auth.jwt()->>'role')::text = 'admin'
  )
);

-- Admins can delete
CREATE POLICY "assessment_assets_delete_admin"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'assessment-assets' AND
  (auth.jwt()->>'role')::text = 'admin'
);

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function to check if user has teacher role
CREATE OR REPLACE FUNCTION auth.is_teacher()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (auth.jwt()->>'role')::text IN ('teacher', 'admin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user has admin role
CREATE OR REPLACE FUNCTION auth.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (auth.jwt()->>'role')::text = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check file ownership
CREATE OR REPLACE FUNCTION storage.is_owner(object_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM storage.objects
    WHERE id = object_id
    AND owner = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- AUDIT LOGGING
-- ============================================

-- Create audit log table for storage operations
CREATE TABLE IF NOT EXISTS storage.audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bucket_id TEXT NOT NULL,
  object_name TEXT NOT NULL,
  operation TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  user_role TEXT,
  ip_address INET,
  user_agent TEXT,
  success BOOLEAN NOT NULL,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on audit log
ALTER TABLE storage.audit_log ENABLE ROW LEVEL SECURITY;

-- Admins can read audit logs
CREATE POLICY "audit_log_read_admin"
ON storage.audit_log
FOR SELECT
TO authenticated
USING (
  (auth.jwt()->>'role')::text = 'admin'
);

-- System can insert audit logs
CREATE POLICY "audit_log_insert_system"
ON storage.audit_log
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Create function to log storage operations
CREATE OR REPLACE FUNCTION storage.log_operation()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO storage.audit_log (
    bucket_id,
    object_name,
    operation,
    user_id,
    user_role,
    success
  ) VALUES (
    COALESCE(NEW.bucket_id, OLD.bucket_id),
    COALESCE(NEW.name, OLD.name),
    TG_OP,
    auth.uid(),
    (auth.jwt()->>'role')::text,
    true
  );
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach trigger to storage.objects
CREATE TRIGGER storage_audit_trigger
AFTER INSERT OR UPDATE OR DELETE ON storage.objects
FOR EACH ROW EXECUTE FUNCTION storage.log_operation();

-- ============================================
-- STORAGE QUOTAS
-- ============================================

-- Create table for user storage quotas
CREATE TABLE IF NOT EXISTS storage.quotas (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id),
  quota_bytes BIGINT NOT NULL DEFAULT 1073741824, -- 1GB default
  used_bytes BIGINT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on quotas
ALTER TABLE storage.quotas ENABLE ROW LEVEL SECURITY;

-- Users can read their own quota
CREATE POLICY "quotas_read_own"
ON storage.quotas
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Admins can read all quotas
CREATE POLICY "quotas_read_admin"
ON storage.quotas
FOR SELECT
TO authenticated
USING (
  (auth.jwt()->>'role')::text = 'admin'
);

-- Function to check quota before upload
CREATE OR REPLACE FUNCTION storage.check_quota()
RETURNS TRIGGER AS $$
DECLARE
  current_usage BIGINT;
  user_quota BIGINT;
  file_size BIGINT;
BEGIN
  -- Get file size (metadata->>'size')
  file_size := (NEW.metadata->>'size')::BIGINT;

  -- Get current usage and quota
  SELECT used_bytes, quota_bytes
  INTO current_usage, user_quota
  FROM storage.quotas
  WHERE user_id = auth.uid();

  -- Create quota record if doesn't exist
  IF NOT FOUND THEN
    INSERT INTO storage.quotas (user_id)
    VALUES (auth.uid())
    RETURNING used_bytes, quota_bytes INTO current_usage, user_quota;
  END IF;

  -- Check if upload would exceed quota
  IF current_usage + file_size > user_quota THEN
    RAISE EXCEPTION 'Storage quota exceeded. Used: %, Quota: %, Attempted: %',
      current_usage, user_quota, file_size;
  END IF;

  -- Update usage
  UPDATE storage.quotas
  SET used_bytes = used_bytes + file_size,
      updated_at = NOW()
  WHERE user_id = auth.uid();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach quota check trigger
CREATE TRIGGER storage_quota_check
BEFORE INSERT ON storage.objects
FOR EACH ROW EXECUTE FUNCTION storage.check_quota();

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- Index on bucket_id for faster policy checks
CREATE INDEX IF NOT EXISTS idx_storage_objects_bucket_id
ON storage.objects(bucket_id);

-- Index on owner for ownership checks
CREATE INDEX IF NOT EXISTS idx_storage_objects_owner
ON storage.objects(owner);

-- Index on created_at for cleanup operations
CREATE INDEX IF NOT EXISTS idx_storage_objects_created_at
ON storage.objects(created_at);

-- Index on audit log for querying
CREATE INDEX IF NOT EXISTS idx_audit_log_user_id
ON storage.audit_log(user_id);

CREATE INDEX IF NOT EXISTS idx_audit_log_created_at
ON storage.audit_log(created_at);

-- ============================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================

COMMENT ON TABLE storage.audit_log IS 'Audit trail for all storage operations';
COMMENT ON TABLE storage.quotas IS 'Storage quota management per user';
COMMENT ON FUNCTION storage.check_quota() IS 'Validates storage quota before upload';
COMMENT ON FUNCTION storage.log_operation() IS 'Logs storage operations for audit';
