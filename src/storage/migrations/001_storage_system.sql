-- ============================================
-- K5 POC Storage System - Complete Migration
-- ============================================
-- This migration sets up all storage-related tables, policies, and functions
-- for the K5 PDF parsing system with COPPA compliance.

-- ============================================
-- PART 1: Storage Row Level Security
-- ============================================

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- PDF ORIGINALS BUCKET Policies
CREATE POLICY "pdf_originals_upload_teachers"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'pdf-originals' AND
  (auth.jwt()->>'role')::text IN ('teacher', 'admin')
);

CREATE POLICY "pdf_originals_read_authenticated"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'pdf-originals' AND
  (auth.uid() = owner OR (auth.jwt()->>'role')::text IN ('teacher', 'admin'))
);

CREATE POLICY "pdf_originals_update_admin"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'pdf-originals' AND (auth.jwt()->>'role')::text = 'admin')
WITH CHECK (bucket_id = 'pdf-originals' AND (auth.jwt()->>'role')::text = 'admin');

CREATE POLICY "pdf_originals_delete_admin"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'pdf-originals' AND (auth.jwt()->>'role')::text = 'admin');

-- PDF IMAGES BUCKET Policies
CREATE POLICY "pdf_images_read_public"
ON storage.objects FOR SELECT TO anon, authenticated
USING (bucket_id = 'pdf-images');

CREATE POLICY "pdf_images_upload_authenticated"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'pdf-images');

CREATE POLICY "pdf_images_update_owner"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'pdf-images' AND auth.uid() = owner)
WITH CHECK (bucket_id = 'pdf-images' AND auth.uid() = owner);

CREATE POLICY "pdf_images_delete"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'pdf-images' AND (auth.uid() = owner OR (auth.jwt()->>'role')::text = 'admin'));

-- PDF THUMBNAILS BUCKET Policies
CREATE POLICY "pdf_thumbnails_read_public"
ON storage.objects FOR SELECT TO anon, authenticated
USING (bucket_id = 'pdf-thumbnails');

CREATE POLICY "pdf_thumbnails_upload_system"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'pdf-thumbnails');

-- PDF PROCESSED BUCKET Policies
CREATE POLICY "pdf_processed_read_public"
ON storage.objects FOR SELECT TO anon, authenticated
USING (bucket_id = 'pdf-processed');

CREATE POLICY "pdf_processed_upload_teachers"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'pdf-processed' AND (auth.jwt()->>'role')::text IN ('teacher', 'admin'));

CREATE POLICY "pdf_processed_update"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'pdf-processed' AND (auth.uid() = owner OR (auth.jwt()->>'role')::text = 'admin'))
WITH CHECK (bucket_id = 'pdf-processed' AND (auth.uid() = owner OR (auth.jwt()->>'role')::text = 'admin'));

CREATE POLICY "pdf_processed_delete_admin"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'pdf-processed' AND (auth.jwt()->>'role')::text = 'admin');

-- ASSESSMENT ASSETS BUCKET Policies
CREATE POLICY "assessment_assets_read_public"
ON storage.objects FOR SELECT TO anon, authenticated
USING (bucket_id = 'assessment-assets');

CREATE POLICY "assessment_assets_upload_teachers"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'assessment-assets' AND (auth.jwt()->>'role')::text IN ('teacher', 'admin'));

CREATE POLICY "assessment_assets_update"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'assessment-assets' AND (auth.uid() = owner OR (auth.jwt()->>'role')::text = 'admin'))
WITH CHECK (bucket_id = 'assessment-assets' AND (auth.uid() = owner OR (auth.jwt()->>'role')::text = 'admin'));

CREATE POLICY "assessment_assets_delete_admin"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'assessment-assets' AND (auth.jwt()->>'role')::text = 'admin');

-- ============================================
-- PART 2: Storage Audit and Quota Management
-- ============================================

-- Audit log table
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

ALTER TABLE storage.audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "audit_log_read_admin"
ON storage.audit_log FOR SELECT TO authenticated
USING ((auth.jwt()->>'role')::text = 'admin');

CREATE POLICY "audit_log_insert_system"
ON storage.audit_log FOR INSERT TO authenticated
WITH CHECK (true);

-- Storage quotas table
CREATE TABLE IF NOT EXISTS storage.quotas (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id),
  quota_bytes BIGINT NOT NULL DEFAULT 1073741824, -- 1GB default
  used_bytes BIGINT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE storage.quotas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "quotas_read_own"
ON storage.quotas FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "quotas_read_admin"
ON storage.quotas FOR SELECT TO authenticated
USING ((auth.jwt()->>'role')::text = 'admin');

-- ============================================
-- PART 3: Lifecycle Management
-- ============================================

CREATE TABLE IF NOT EXISTS storage_lifecycle_policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bucket TEXT NOT NULL,
  rule_id TEXT NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT true,
  config JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(bucket, rule_id)
);

CREATE TABLE IF NOT EXISTS storage_metadata (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bucket TEXT NOT NULL,
  path TEXT NOT NULL,
  storage_class TEXT NOT NULL DEFAULT 'STANDARD',
  transitioned_at TIMESTAMPTZ,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(bucket, path)
);

CREATE TABLE IF NOT EXISTS storage_lifecycle_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bucket TEXT NOT NULL,
  path TEXT NOT NULL,
  action TEXT NOT NULL,
  details TEXT,
  executed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS storage_access_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bucket TEXT NOT NULL,
  path TEXT NOT NULL,
  accessed_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id),
  access_type TEXT
);

CREATE TABLE IF NOT EXISTS bucket_configs (
  bucket TEXT PRIMARY KEY,
  versioning_enabled BOOLEAN DEFAULT false,
  lifecycle_enabled BOOLEAN DEFAULT true,
  encryption_enabled BOOLEAN DEFAULT true,
  config JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PART 4: Backup System
-- ============================================

CREATE TABLE IF NOT EXISTS storage_backups (
  id TEXT PRIMARY KEY,
  bucket TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('full', 'incremental')),
  size BIGINT NOT NULL DEFAULT 0,
  file_count INTEGER NOT NULL DEFAULT 0,
  compressed BOOLEAN NOT NULL DEFAULT false,
  encrypted BOOLEAN NOT NULL DEFAULT true,
  checksum TEXT NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('running', 'completed', 'failed')),
  error TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS storage_backup_schedules (
  id TEXT PRIMARY KEY,
  bucket TEXT NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT true,
  cron_expression TEXT NOT NULL,
  config JSONB NOT NULL,
  last_run TIMESTAMPTZ,
  next_run TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS storage_restore_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  backup_id TEXT NOT NULL REFERENCES storage_backups(id),
  target_bucket TEXT,
  files_restored INTEGER NOT NULL DEFAULT 0,
  bytes_restored BIGINT NOT NULL DEFAULT 0,
  success BOOLEAN NOT NULL DEFAULT false,
  errors TEXT[],
  duration INTEGER,
  restored_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PART 5: COPPA Compliance
-- ============================================

CREATE TABLE IF NOT EXISTS parental_consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL,
  parent_id UUID NOT NULL,
  consent_type TEXT NOT NULL CHECK (consent_type IN ('full', 'limited', 'none')),
  granted_at TIMESTAMPTZ NOT NULL,
  expires_at TIMESTAMPTZ,
  revoked_at TIMESTAMPTZ,
  revocation_reason TEXT,
  permissions JSONB NOT NULL,
  verification_method TEXT NOT NULL,
  ip_address INET NOT NULL,
  user_agent TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS student_data_access_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL,
  accessed_by UUID NOT NULL,
  access_type TEXT NOT NULL CHECK (access_type IN ('view', 'download', 'modify', 'delete')),
  bucket TEXT NOT NULL,
  path TEXT NOT NULL,
  purpose TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL,
  ip_address INET NOT NULL
);

CREATE TABLE IF NOT EXISTS data_export_requests (
  request_id TEXT PRIMARY KEY,
  student_id UUID NOT NULL,
  requested_by UUID NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  format TEXT NOT NULL CHECK (format IN ('json', 'csv', 'pdf')),
  include_files BOOLEAN DEFAULT true,
  download_url TEXT,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS data_deletion_requests (
  request_id TEXT PRIMARY KEY,
  student_id UUID NOT NULL,
  requested_by UUID NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'processing', 'completed', 'rejected')),
  retention_override BOOLEAN DEFAULT false,
  scheduled_for TIMESTAMPTZ,
  files_deleted INTEGER DEFAULT 0,
  bytes_deleted BIGINT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS coppa_compliance_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL,
  event_type TEXT NOT NULL,
  details TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PART 6: Helper Functions
-- ============================================

-- Check if user has teacher role
CREATE OR REPLACE FUNCTION auth.is_teacher()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (auth.jwt()->>'role')::text IN ('teacher', 'admin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if user has admin role
CREATE OR REPLACE FUNCTION auth.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (auth.jwt()->>'role')::text = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check file ownership
CREATE OR REPLACE FUNCTION storage.is_owner(object_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM storage.objects
    WHERE id = object_id AND owner = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Log storage operations
CREATE OR REPLACE FUNCTION storage.log_operation()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO storage.audit_log (
    bucket_id, object_name, operation, user_id, user_role, success
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

-- Check storage quota before upload
CREATE OR REPLACE FUNCTION storage.check_quota()
RETURNS TRIGGER AS $$
DECLARE
  current_usage BIGINT;
  user_quota BIGINT;
  file_size BIGINT;
BEGIN
  file_size := (NEW.metadata->>'size')::BIGINT;

  SELECT used_bytes, quota_bytes
  INTO current_usage, user_quota
  FROM storage.quotas
  WHERE user_id = auth.uid();

  IF NOT FOUND THEN
    INSERT INTO storage.quotas (user_id)
    VALUES (auth.uid())
    RETURNING used_bytes, quota_bytes INTO current_usage, user_quota;
  END IF;

  IF current_usage + file_size > user_quota THEN
    RAISE EXCEPTION 'Storage quota exceeded. Used: %, Quota: %, Attempted: %',
      current_usage, user_quota, file_size;
  END IF;

  UPDATE storage.quotas
  SET used_bytes = used_bytes + file_size, updated_at = NOW()
  WHERE user_id = auth.uid();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Track file access for lifecycle decisions
CREATE OR REPLACE FUNCTION storage.track_access()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO storage_access_log (bucket, path, user_id, access_type)
  VALUES (NEW.bucket_id, NEW.name, auth.uid(), 'READ');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- PART 7: Triggers
-- ============================================

DROP TRIGGER IF EXISTS storage_audit_trigger ON storage.objects;
CREATE TRIGGER storage_audit_trigger
AFTER INSERT OR UPDATE OR DELETE ON storage.objects
FOR EACH ROW EXECUTE FUNCTION storage.log_operation();

DROP TRIGGER IF EXISTS storage_quota_check ON storage.objects;
CREATE TRIGGER storage_quota_check
BEFORE INSERT ON storage.objects
FOR EACH ROW EXECUTE FUNCTION storage.check_quota();

-- ============================================
-- PART 8: Indexes for Performance
-- ============================================

-- Storage objects indexes
CREATE INDEX IF NOT EXISTS idx_storage_objects_bucket_id ON storage.objects(bucket_id);
CREATE INDEX IF NOT EXISTS idx_storage_objects_owner ON storage.objects(owner);
CREATE INDEX IF NOT EXISTS idx_storage_objects_created_at ON storage.objects(created_at);

-- Audit log indexes
CREATE INDEX IF NOT EXISTS idx_audit_log_user_id ON storage.audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON storage.audit_log(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_log_bucket_id ON storage.audit_log(bucket_id);

-- Lifecycle indexes
CREATE INDEX IF NOT EXISTS idx_lifecycle_policies_bucket ON storage_lifecycle_policies(bucket);
CREATE INDEX IF NOT EXISTS idx_storage_metadata_bucket_path ON storage_metadata(bucket, path);
CREATE INDEX IF NOT EXISTS idx_lifecycle_log_bucket ON storage_lifecycle_log(bucket);
CREATE INDEX IF NOT EXISTS idx_lifecycle_log_executed_at ON storage_lifecycle_log(executed_at);
CREATE INDEX IF NOT EXISTS idx_access_log_bucket_path ON storage_access_log(bucket, path);
CREATE INDEX IF NOT EXISTS idx_access_log_accessed_at ON storage_access_log(accessed_at);

-- Backup indexes
CREATE INDEX IF NOT EXISTS idx_backups_bucket ON storage_backups(bucket);
CREATE INDEX IF NOT EXISTS idx_backups_start_time ON storage_backups(start_time);
CREATE INDEX IF NOT EXISTS idx_backups_status ON storage_backups(status);
CREATE INDEX IF NOT EXISTS idx_schedules_bucket ON storage_backup_schedules(bucket);
CREATE INDEX IF NOT EXISTS idx_schedules_enabled ON storage_backup_schedules(enabled);
CREATE INDEX IF NOT EXISTS idx_restore_log_backup_id ON storage_restore_log(backup_id);

-- COPPA indexes
CREATE INDEX IF NOT EXISTS idx_consents_student ON parental_consents(student_id);
CREATE INDEX IF NOT EXISTS idx_consents_parent ON parental_consents(parent_id);
CREATE INDEX IF NOT EXISTS idx_student_access_log_student ON student_data_access_log(student_id);
CREATE INDEX IF NOT EXISTS idx_student_access_log_timestamp ON student_data_access_log(timestamp);
CREATE INDEX IF NOT EXISTS idx_export_requests_student ON data_export_requests(student_id);
CREATE INDEX IF NOT EXISTS idx_deletion_requests_student ON data_deletion_requests(student_id);
CREATE INDEX IF NOT EXISTS idx_deletion_requests_scheduled ON data_deletion_requests(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_compliance_log_student ON coppa_compliance_log(student_id);

-- ============================================
-- PART 9: Comments for Documentation
-- ============================================

COMMENT ON TABLE storage.audit_log IS 'Audit trail for all storage operations';
COMMENT ON TABLE storage.quotas IS 'Storage quota management per user';
COMMENT ON TABLE storage_lifecycle_policies IS 'Lifecycle policies for storage buckets';
COMMENT ON TABLE storage_metadata IS 'Metadata and storage tier information for files';
COMMENT ON TABLE storage_lifecycle_log IS 'Audit log for lifecycle actions';
COMMENT ON TABLE storage_access_log IS 'Tracks file access for lifecycle decisions';
COMMENT ON TABLE storage_backups IS 'Backup metadata and status tracking';
COMMENT ON TABLE storage_backup_schedules IS 'Automated backup schedules';
COMMENT ON TABLE storage_restore_log IS 'Audit log for restore operations';
COMMENT ON TABLE parental_consents IS 'COPPA compliant parental consent tracking';
COMMENT ON TABLE student_data_access_log IS 'Audit log for all student data access';
COMMENT ON TABLE data_export_requests IS 'Student data export requests (right to access)';
COMMENT ON TABLE data_deletion_requests IS 'Student data deletion requests (right to deletion)';
COMMENT ON TABLE coppa_compliance_log IS 'General COPPA compliance event log';

COMMENT ON FUNCTION storage.check_quota() IS 'Validates storage quota before upload';
COMMENT ON FUNCTION storage.log_operation() IS 'Logs storage operations for audit';
COMMENT ON FUNCTION storage.track_access() IS 'Tracks file access for lifecycle management';
COMMENT ON FUNCTION auth.is_teacher() IS 'Check if user has teacher role';
COMMENT ON FUNCTION auth.is_admin() IS 'Check if user has admin role';

-- ============================================
-- Migration Complete
-- ============================================
