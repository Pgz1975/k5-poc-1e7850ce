-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- FERPA Compliance and Multi-Tenant Data Protection
-- ============================================================================
-- Version: 1.0.0
-- Purpose: Implement comprehensive RLS policies to ensure FERPA compliance
--          and protect student data with fine-grained access control
-- ============================================================================

-- ============================================================================
-- ENABLE RLS ON ALL TABLES
-- ============================================================================

ALTER TABLE pdf_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE pdf_text_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE pdf_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE text_image_correlations ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE processing_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE quality_metrics ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- HELPER FUNCTIONS FOR RLS POLICIES
-- ============================================================================

-- Get current user's organization ID
CREATE OR REPLACE FUNCTION auth.get_user_organization_id()
RETURNS UUID AS $$
BEGIN
    RETURN (auth.jwt() -> 'user_metadata' ->> 'organization_id')::uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Get current user's school ID
CREATE OR REPLACE FUNCTION auth.get_user_school_id()
RETURNS UUID AS $$
BEGIN
    RETURN (auth.jwt() -> 'user_metadata' ->> 'school_id')::uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Get current user's role
CREATE OR REPLACE FUNCTION auth.get_user_role()
RETURNS TEXT AS $$
BEGIN
    RETURN (auth.jwt() -> 'user_metadata' ->> 'role')::text;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Check if user is system admin
CREATE OR REPLACE FUNCTION auth.is_system_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN COALESCE((auth.jwt() -> 'user_metadata' ->> 'role')::text = 'system_admin', false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Check if user is district admin
CREATE OR REPLACE FUNCTION auth.is_district_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN COALESCE((auth.jwt() -> 'user_metadata' ->> 'role')::text IN ('system_admin', 'district_admin'), false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Check if user is school admin
CREATE OR REPLACE FUNCTION auth.is_school_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN COALESCE(
        (auth.jwt() -> 'user_metadata' ->> 'role')::text IN ('system_admin', 'district_admin', 'school_admin'),
        false
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Check if user is teacher
CREATE OR REPLACE FUNCTION auth.is_teacher()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN COALESCE(
        (auth.jwt() -> 'user_metadata' ->> 'role')::text IN ('system_admin', 'district_admin', 'school_admin', 'teacher'),
        false
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Check if user has access to class
CREATE OR REPLACE FUNCTION auth.has_class_access(class_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    user_classes UUID[];
BEGIN
    -- System, district, and school admins have access to all classes
    IF auth.is_school_admin() THEN
        RETURN true;
    END IF;

    -- Get user's class IDs from JWT
    user_classes := ARRAY(
        SELECT jsonb_array_elements_text((auth.jwt() -> 'user_metadata' -> 'class_ids')::jsonb)::uuid
    );

    -- Check if class_id is in user's classes
    RETURN class_id = ANY(user_classes);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ============================================================================
-- RLS POLICIES FOR PDF_DOCUMENTS
-- ============================================================================

-- Policy: System admins can view all documents
CREATE POLICY "System admins can view all documents"
ON pdf_documents FOR SELECT
TO authenticated
USING (auth.is_system_admin());

-- Policy: District admins can view documents in their organization
CREATE POLICY "District admins can view org documents"
ON pdf_documents FOR SELECT
TO authenticated
USING (
    auth.is_district_admin() AND
    organization_id = auth.get_user_organization_id()
);

-- Policy: School admins can view documents in their school
CREATE POLICY "School admins can view school documents"
ON pdf_documents FOR SELECT
TO authenticated
USING (
    auth.is_school_admin() AND
    school_id = auth.get_user_school_id()
);

-- Policy: Teachers can view documents for their classes or public documents
CREATE POLICY "Teachers can view class and public documents"
ON pdf_documents FOR SELECT
TO authenticated
USING (
    auth.is_teacher() AND (
        data_classification = 'public' OR
        auth.has_class_access(class_id) OR
        uploaded_by = auth.uid()
    )
);

-- Policy: Users can view their own uploaded documents
CREATE POLICY "Users can view own documents"
ON pdf_documents FOR SELECT
TO authenticated
USING (uploaded_by = auth.uid());

-- Policy: Teachers can insert documents for their classes
CREATE POLICY "Teachers can insert class documents"
ON pdf_documents FOR INSERT
TO authenticated
WITH CHECK (
    auth.is_teacher() AND
    (class_id IS NULL OR auth.has_class_access(class_id)) AND
    uploaded_by = auth.uid()
);

-- Policy: Users can update their own documents (if not finalized)
CREATE POLICY "Users can update own documents"
ON pdf_documents FOR UPDATE
TO authenticated
USING (
    uploaded_by = auth.uid() AND
    processing_status IN ('pending', 'failed')
)
WITH CHECK (uploaded_by = auth.uid());

-- Policy: System admins can update any document
CREATE POLICY "System admins can update documents"
ON pdf_documents FOR UPDATE
TO authenticated
USING (auth.is_system_admin())
WITH CHECK (auth.is_system_admin());

-- Policy: Users can soft delete their own documents
CREATE POLICY "Users can delete own documents"
ON pdf_documents FOR UPDATE
TO authenticated
USING (uploaded_by = auth.uid())
WITH CHECK (uploaded_by = auth.uid());

-- ============================================================================
-- RLS POLICIES FOR PDF_TEXT_CONTENT
-- ============================================================================

-- Policy: Inherit access from parent document
CREATE POLICY "Text content inherits document access"
ON pdf_text_content FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM pdf_documents
        WHERE pdf_documents.id = pdf_text_content.document_id
        AND (
            auth.is_system_admin() OR
            (auth.is_district_admin() AND organization_id = auth.get_user_organization_id()) OR
            (auth.is_school_admin() AND school_id = auth.get_user_school_id()) OR
            (auth.is_teacher() AND (data_classification = 'public' OR auth.has_class_access(class_id) OR uploaded_by = auth.uid())) OR
            uploaded_by = auth.uid()
        )
    )
);

-- Policy: System can insert text content during processing
CREATE POLICY "System can insert text content"
ON pdf_text_content FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM pdf_documents
        WHERE pdf_documents.id = pdf_text_content.document_id
        AND (uploaded_by = auth.uid() OR auth.is_system_admin())
    )
);

-- Policy: System can update text content
CREATE POLICY "System can update text content"
ON pdf_text_content FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM pdf_documents
        WHERE pdf_documents.id = pdf_text_content.document_id
        AND (uploaded_by = auth.uid() OR auth.is_system_admin())
    )
);

-- ============================================================================
-- RLS POLICIES FOR PDF_IMAGES
-- ============================================================================

-- Policy: Inherit access from parent document
CREATE POLICY "Images inherit document access"
ON pdf_images FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM pdf_documents
        WHERE pdf_documents.id = pdf_images.document_id
        AND (
            auth.is_system_admin() OR
            (auth.is_district_admin() AND organization_id = auth.get_user_organization_id()) OR
            (auth.is_school_admin() AND school_id = auth.get_user_school_id()) OR
            (auth.is_teacher() AND (data_classification = 'public' OR auth.has_class_access(class_id) OR uploaded_by = auth.uid())) OR
            uploaded_by = auth.uid()
        )
    )
);

-- Policy: System can insert images during processing
CREATE POLICY "System can insert images"
ON pdf_images FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM pdf_documents
        WHERE pdf_documents.id = pdf_images.document_id
        AND (uploaded_by = auth.uid() OR auth.is_system_admin())
    )
);

-- Policy: System can update images
CREATE POLICY "System can update images"
ON pdf_images FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM pdf_documents
        WHERE pdf_documents.id = pdf_images.document_id
        AND (uploaded_by = auth.uid() OR auth.is_system_admin())
    )
);

-- ============================================================================
-- RLS POLICIES FOR TEXT_IMAGE_CORRELATIONS
-- ============================================================================

-- Policy: Inherit access from parent document
CREATE POLICY "Correlations inherit document access"
ON text_image_correlations FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM pdf_documents
        WHERE pdf_documents.id = text_image_correlations.document_id
        AND (
            auth.is_system_admin() OR
            (auth.is_district_admin() AND organization_id = auth.get_user_organization_id()) OR
            (auth.is_school_admin() AND school_id = auth.get_user_school_id()) OR
            (auth.is_teacher() AND (data_classification = 'public' OR auth.has_class_access(class_id) OR uploaded_by = auth.uid())) OR
            uploaded_by = auth.uid()
        )
    )
);

-- Policy: System and teachers can insert correlations
CREATE POLICY "Authorized users can insert correlations"
ON text_image_correlations FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM pdf_documents
        WHERE pdf_documents.id = text_image_correlations.document_id
        AND (uploaded_by = auth.uid() OR auth.is_teacher() OR auth.is_system_admin())
    )
);

-- Policy: Teachers can verify/update correlations
CREATE POLICY "Teachers can update correlations"
ON text_image_correlations FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM pdf_documents
        WHERE pdf_documents.id = text_image_correlations.document_id
        AND (uploaded_by = auth.uid() OR auth.is_teacher() OR auth.is_system_admin())
    )
);

-- ============================================================================
-- RLS POLICIES FOR ASSESSMENT_QUESTIONS
-- ============================================================================

-- Policy: Inherit access from parent document
CREATE POLICY "Questions inherit document access"
ON assessment_questions FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM pdf_documents
        WHERE pdf_documents.id = assessment_questions.document_id
        AND (
            auth.is_system_admin() OR
            (auth.is_district_admin() AND organization_id = auth.get_user_organization_id()) OR
            (auth.is_school_admin() AND school_id = auth.get_user_school_id()) OR
            (auth.is_teacher() AND (data_classification = 'public' OR auth.has_class_access(class_id) OR uploaded_by = auth.uid())) OR
            uploaded_by = auth.uid()
        )
    )
);

-- Policy: System and teachers can insert questions
CREATE POLICY "Authorized users can insert questions"
ON assessment_questions FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM pdf_documents
        WHERE pdf_documents.id = assessment_questions.document_id
        AND (uploaded_by = auth.uid() OR auth.is_teacher() OR auth.is_system_admin())
    )
);

-- Policy: Teachers can update questions
CREATE POLICY "Teachers can update questions"
ON assessment_questions FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM pdf_documents
        WHERE pdf_documents.id = assessment_questions.document_id
        AND (uploaded_by = auth.uid() OR auth.is_teacher() OR auth.is_system_admin())
    )
);

-- ============================================================================
-- RLS POLICIES FOR READING_MATERIALS
-- ============================================================================

-- Policy: Inherit access from parent document
CREATE POLICY "Reading materials inherit document access"
ON reading_materials FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM pdf_documents
        WHERE pdf_documents.id = reading_materials.document_id
        AND (
            auth.is_system_admin() OR
            (auth.is_district_admin() AND organization_id = auth.get_user_organization_id()) OR
            (auth.is_school_admin() AND school_id = auth.get_user_school_id()) OR
            (auth.is_teacher() AND (data_classification = 'public' OR auth.has_class_access(class_id) OR uploaded_by = auth.uid())) OR
            uploaded_by = auth.uid()
        )
    )
);

-- Policy: System and teachers can insert reading materials
CREATE POLICY "Authorized users can insert reading materials"
ON reading_materials FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM pdf_documents
        WHERE pdf_documents.id = reading_materials.document_id
        AND (uploaded_by = auth.uid() OR auth.is_teacher() OR auth.is_system_admin())
    )
);

-- Policy: Teachers can update reading materials
CREATE POLICY "Teachers can update reading materials"
ON reading_materials FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM pdf_documents
        WHERE pdf_documents.id = reading_materials.document_id
        AND (uploaded_by = auth.uid() OR auth.is_teacher() OR auth.is_system_admin())
    )
);

-- ============================================================================
-- RLS POLICIES FOR PROCESSING_QUEUE
-- ============================================================================

-- Policy: System admins can view all queue items
CREATE POLICY "System admins can view processing queue"
ON processing_queue FOR SELECT
TO authenticated
USING (auth.is_system_admin());

-- Policy: Users can view their own documents in queue
CREATE POLICY "Users can view own documents in queue"
ON processing_queue FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM pdf_documents
        WHERE pdf_documents.id = processing_queue.document_id
        AND uploaded_by = auth.uid()
    )
);

-- Policy: System can insert queue items
CREATE POLICY "System can insert queue items"
ON processing_queue FOR INSERT
TO authenticated
WITH CHECK (auth.is_system_admin() OR auth.is_teacher());

-- Policy: System can update queue items
CREATE POLICY "System can update queue items"
ON processing_queue FOR UPDATE
TO authenticated
USING (auth.is_system_admin());

-- ============================================================================
-- RLS POLICIES FOR QUALITY_METRICS
-- ============================================================================

-- Policy: System admins and district admins can view all metrics
CREATE POLICY "Admins can view quality metrics"
ON quality_metrics FOR SELECT
TO authenticated
USING (auth.is_district_admin());

-- Policy: Teachers can view metrics for their documents
CREATE POLICY "Teachers can view own document metrics"
ON quality_metrics FOR SELECT
TO authenticated
USING (
    auth.is_teacher() AND
    EXISTS (
        SELECT 1 FROM pdf_documents
        WHERE pdf_documents.id = quality_metrics.document_id
        AND (uploaded_by = auth.uid() OR auth.has_class_access(class_id))
    )
);

-- Policy: System can insert metrics
CREATE POLICY "System can insert metrics"
ON quality_metrics FOR INSERT
TO authenticated
WITH CHECK (auth.is_system_admin());

-- Policy: System can update metrics
CREATE POLICY "System can update metrics"
ON quality_metrics FOR UPDATE
TO authenticated
USING (auth.is_system_admin());

-- ============================================================================
-- FERPA COMPLIANCE AUDIT LOG
-- ============================================================================

-- Create audit log table for FERPA compliance tracking
CREATE TABLE IF NOT EXISTS ferpa_audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    action VARCHAR(50) NOT NULL, -- SELECT, INSERT, UPDATE, DELETE
    table_name VARCHAR(100) NOT NULL,
    record_id UUID,
    document_id UUID REFERENCES pdf_documents(id),

    -- Access details
    accessed_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    ip_address INET,
    user_agent TEXT,

    -- Context
    organization_id UUID,
    school_id UUID,
    class_id UUID,

    -- Compliance
    purpose TEXT, -- Educational use, administrative, etc.
    authorization_level VARCHAR(50),

    -- Data accessed
    columns_accessed TEXT[],
    contains_pii BOOLEAN DEFAULT false,

    -- Metadata
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Index for audit log queries
CREATE INDEX idx_ferpa_audit_user ON ferpa_audit_log(user_id, accessed_at DESC);
CREATE INDEX idx_ferpa_audit_document ON ferpa_audit_log(document_id, accessed_at DESC);
CREATE INDEX idx_ferpa_audit_table ON ferpa_audit_log(table_name, action);
CREATE INDEX idx_ferpa_audit_accessed_at ON ferpa_audit_log(accessed_at DESC);

-- Enable RLS on audit log
ALTER TABLE ferpa_audit_log ENABLE ROW LEVEL SECURITY;

-- Policy: System admins can view audit logs
CREATE POLICY "System admins can view audit logs"
ON ferpa_audit_log FOR SELECT
TO authenticated
USING (auth.is_system_admin());

-- Policy: District admins can view org audit logs
CREATE POLICY "District admins can view org audit logs"
ON ferpa_audit_log FOR SELECT
TO authenticated
USING (
    auth.is_district_admin() AND
    organization_id = auth.get_user_organization_id()
);

-- ============================================================================
-- DATA RETENTION POLICIES
-- FERPA requires specific retention periods
-- ============================================================================

-- Function to archive old documents (7 year retention for educational records)
CREATE OR REPLACE FUNCTION archive_old_documents()
RETURNS void AS $$
BEGIN
    -- Soft delete documents older than 7 years
    UPDATE pdf_documents
    SET deleted_at = NOW()
    WHERE created_at < NOW() - INTERVAL '7 years'
    AND deleted_at IS NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to purge audit logs (3 year retention for access logs)
CREATE OR REPLACE FUNCTION purge_old_audit_logs()
RETURNS void AS $$
BEGIN
    DELETE FROM ferpa_audit_log
    WHERE accessed_at < NOW() - INTERVAL '3 years';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON TABLE ferpa_audit_log IS 'FERPA compliance audit log tracking all access to student data';
COMMENT ON FUNCTION auth.is_system_admin() IS 'Check if current user has system admin role';
COMMENT ON FUNCTION auth.is_district_admin() IS 'Check if current user has district admin or higher role';
COMMENT ON FUNCTION auth.has_class_access(UUID) IS 'Check if current user has access to specific class';
COMMENT ON FUNCTION archive_old_documents() IS 'Archive documents older than 7 years per FERPA retention requirements';
COMMENT ON FUNCTION purge_old_audit_logs() IS 'Purge audit logs older than 3 years per retention policy';

-- ============================================================================
-- END OF RLS POLICIES
-- ============================================================================
