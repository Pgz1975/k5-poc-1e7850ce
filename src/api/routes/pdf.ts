/**
 * K5 Platform PDF API Routes
 * REST endpoints for PDF upload, processing, and retrieval
 */

import { Router } from 'express';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { uploadPDFSchema, documentQuerySchema } from '../validation/schemas';
import { ResponseFormatter, createPaginationMeta } from '../utils/response';
import type {
  UploadPDFRequest,
  PDFDocument,
  ProcessingProgress,
  SearchRequest,
} from '../types';

const router = Router();

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ============================================================================
// POST /api/v1/pdf/upload
// Upload a new PDF document
// ============================================================================

router.post('/upload', async (req, res) => {
  const formatter = new ResponseFormatter(req.headers['x-request-id']);

  try {
    // Validate request body
    const validatedData = uploadPDFSchema.parse(req.body);

    // Check if file was uploaded
    if (!req.files || !req.files.file) {
      return res
        .status(400)
        .json(formatter.error('MISSING_FILE', 'PDF file is required'));
    }

    const file = Array.isArray(req.files.file) ? req.files.file[0] : req.files.file;

    // Validate file type
    if (file.mimetype !== 'application/pdf') {
      return res
        .status(400)
        .json(formatter.error('INVALID_FILE_TYPE', 'File must be a PDF'));
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(7);
    const filename = `${timestamp}_${randomStr}.pdf`;
    const storagePath = `pdfs/${req.auth.userId}/${filename}`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('educational-pdfs')
      .upload(storagePath, file.data, {
        contentType: 'application/pdf',
        upsert: false,
      });

    if (uploadError) {
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    // Calculate file hash for deduplication
    const crypto = require('crypto');
    const fileHash = crypto
      .createHash('sha256')
      .update(file.data)
      .digest('hex');

    // Create database record
    const { data: document, error: dbError } = await supabase
      .from('pdf_documents')
      .insert({
        filename,
        original_filename: file.name,
        file_size: file.size,
        storage_bucket: 'educational-pdfs',
        storage_path: storagePath,
        file_hash: fileHash,
        content_type: validatedData.contentType,
        grade_level: validatedData.gradeLevel,
        subject_area: validatedData.subjectArea,
        primary_language: validatedData.primaryLanguage,
        reading_level: validatedData.readingLevel,
        curriculum_standards: validatedData.curriculumStandards,
        processing_status: 'pending',
        uploaded_by: req.auth.userId,
        metadata: validatedData.metadata,
      })
      .select()
      .single();

    if (dbError) {
      throw new Error(`Database error: ${dbError.message}`);
    }

    // Trigger processing via edge function
    const { error: processingError } = await supabase.functions.invoke(
      'process-pdf',
      {
        body: { documentId: document.id },
      }
    );

    const response = formatter.created(
      {
        documentId: document.id,
        filename: document.filename,
        status: document.processing_status,
        message: 'PDF uploaded successfully. Processing started.',
      },
      `/api/v1/pdf/${document.id}`
    );

    return res.status(response.status).json(response.body);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(422).json(formatter.validationError(error.errors));
    }

    console.error('Upload error:', error);
    return res.status(500).json(formatter.internalError(error));
  }
});

// ============================================================================
// GET /api/v1/pdf/:id
// Get PDF document by ID
// ============================================================================

router.get('/:id', async (req, res) => {
  const formatter = new ResponseFormatter(req.headers['x-request-id']);

  try {
    const { id } = req.params;

    const { data: document, error } = await supabase
      .from('pdf_documents')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !document) {
      return res.status(404).json(formatter.notFound('PDF document'));
    }

    // Check permissions
    if (
      document.uploaded_by !== req.auth.userId &&
      !req.auth.permissions.includes('admin:full_access')
    ) {
      return res.status(403).json(formatter.forbidden('Access denied'));
    }

    const response = formatter.success(document);
    return res.status(response.status).json(response.body);
  } catch (error) {
    console.error('Get PDF error:', error);
    return res.status(500).json(formatter.internalError(error));
  }
});

// ============================================================================
// GET /api/v1/pdf/:id/content
// Get PDF content (text) by page or all
// ============================================================================

router.get('/:id/content', async (req, res) => {
  const formatter = new ResponseFormatter(req.headers['x-request-id']);

  try {
    const { id } = req.params;
    const pageNumber = req.query.page ? parseInt(req.query.page as string) : null;

    // Build query
    let query = supabase
      .from('pdf_content')
      .select('*')
      .eq('document_id', id);

    if (pageNumber) {
      query = query.eq('page_number', pageNumber);
    }

    query = query.order('page_number', { ascending: true });

    const { data: content, error } = await query;

    if (error) {
      throw new Error(`Failed to retrieve content: ${error.message}`);
    }

    const response = formatter.success({
      documentId: id,
      pageCount: content?.length || 0,
      content: pageNumber ? content?.[0] : content,
    });

    return res.status(response.status).json(response.body);
  } catch (error) {
    console.error('Get content error:', error);
    return res.status(500).json(formatter.internalError(error));
  }
});

// ============================================================================
// GET /api/v1/pdf/:id/images
// Get PDF images
// ============================================================================

router.get('/:id/images', async (req, res) => {
  const formatter = new ResponseFormatter(req.headers['x-request-id']);

  try {
    const { id } = req.params;
    const pageNumber = req.query.page ? parseInt(req.query.page as string) : null;

    let query = supabase
      .from('pdf_images')
      .select('*')
      .eq('document_id', id);

    if (pageNumber) {
      query = query.eq('page_number', pageNumber);
    }

    query = query.order('page_number, image_index', { ascending: true });

    const { data: images, error } = await query;

    if (error) {
      throw new Error(`Failed to retrieve images: ${error.message}`);
    }

    // Generate signed URLs for images
    const imagesWithUrls = await Promise.all(
      (images || []).map(async (image) => {
        const { data: urlData } = await supabase.storage
          .from('educational-pdfs')
          .createSignedUrl(image.storage_path, 3600); // 1 hour expiry

        return {
          ...image,
          url: urlData?.signedUrl,
        };
      })
    );

    const response = formatter.success({
      documentId: id,
      imageCount: imagesWithUrls.length,
      images: imagesWithUrls,
    });

    return res.status(response.status).json(response.body);
  } catch (error) {
    console.error('Get images error:', error);
    return res.status(500).json(formatter.internalError(error));
  }
});

// ============================================================================
// GET /api/v1/pdf/:id/progress
// Get processing progress
// ============================================================================

router.get('/:id/progress', async (req, res) => {
  const formatter = new ResponseFormatter(req.headers['x-request-id']);

  try {
    const { id } = req.params;

    const { data: document, error } = await supabase
      .from('pdf_documents')
      .select('processing_status, processing_progress, processing_error, page_count')
      .eq('id', id)
      .single();

    if (error || !document) {
      return res.status(404).json(formatter.notFound('PDF document'));
    }

    const progress: ProcessingProgress = {
      documentId: id,
      status: document.processing_status,
      progress: document.processing_progress || 0,
      currentStep: this.getProcessingStep(document.processing_status),
      stepsCompleted: this.getStepsCompleted(document.processing_status),
      totalSteps: 12,
      error: document.processing_error,
    };

    const response = formatter.success(progress);
    return res.status(response.status).json(response.body);
  } catch (error) {
    console.error('Get progress error:', error);
    return res.status(500).json(formatter.internalError(error));
  }
});

// ============================================================================
// GET /api/v1/pdf/list
// List PDF documents with filtering and pagination
// ============================================================================

router.get('/', async (req, res) => {
  const formatter = new ResponseFormatter(req.headers['x-request-id']);

  try {
    // Validate query parameters
    const query = documentQuerySchema.parse(req.query);

    // Build Supabase query
    let dbQuery = supabase
      .from('pdf_documents')
      .select('*', { count: 'exact' });

    // Apply filters
    if (query.contentType) {
      dbQuery = dbQuery.eq('content_type', query.contentType);
    }
    if (query.gradeLevel && query.gradeLevel.length > 0) {
      dbQuery = dbQuery.contains('grade_level', query.gradeLevel);
    }
    if (query.subjectArea && query.subjectArea.length > 0) {
      dbQuery = dbQuery.contains('subject_area', query.subjectArea);
    }
    if (query.primaryLanguage) {
      dbQuery = dbQuery.eq('primary_language', query.primaryLanguage);
    }
    if (query.processingStatus) {
      dbQuery = dbQuery.eq('processing_status', query.processingStatus);
    }
    if (query.uploadedBy) {
      dbQuery = dbQuery.eq('uploaded_by', query.uploadedBy);
    }

    // Pagination
    const page = query.page || 1;
    const limit = query.limit || 20;
    const offset = (page - 1) * limit;

    dbQuery = dbQuery.range(offset, offset + limit - 1);

    // Execute query
    const { data: documents, error, count } = await dbQuery;

    if (error) {
      throw new Error(`Failed to list documents: ${error.message}`);
    }

    const meta = createPaginationMeta(page, limit, count || 0);

    const response = formatter.success(documents, meta);
    return res.status(response.status).json(response.body);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(422).json(formatter.validationError(error.errors));
    }

    console.error('List PDFs error:', error);
    return res.status(500).json(formatter.internalError(error));
  }
});

// ============================================================================
// DELETE /api/v1/pdf/:id
// Delete a PDF document
// ============================================================================

router.delete('/:id', async (req, res) => {
  const formatter = new ResponseFormatter(req.headers['x-request-id']);

  try {
    const { id } = req.params;

    // Get document to check permissions and get storage path
    const { data: document, error: fetchError } = await supabase
      .from('pdf_documents')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !document) {
      return res.status(404).json(formatter.notFound('PDF document'));
    }

    // Check permissions
    if (
      document.uploaded_by !== req.auth.userId &&
      !req.auth.permissions.includes('admin:full_access')
    ) {
      return res.status(403).json(formatter.forbidden('Access denied'));
    }

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from('educational-pdfs')
      .remove([document.storage_path]);

    if (storageError) {
      console.error('Storage deletion error:', storageError);
    }

    // Delete from database (cascades to content and images)
    const { error: deleteError } = await supabase
      .from('pdf_documents')
      .delete()
      .eq('id', id);

    if (deleteError) {
      throw new Error(`Failed to delete document: ${deleteError.message}`);
    }

    return res.status(204).send();
  } catch (error) {
    console.error('Delete PDF error:', error);
    return res.status(500).json(formatter.internalError(error));
  }
});

// ============================================================================
// Helper Functions
// ============================================================================

function getProcessingStep(status: string): string {
  const steps: Record<string, string> = {
    pending: 'Queued for processing',
    validating: 'Validating PDF file',
    processing: 'Extracting content',
    completed: 'Processing complete',
    failed: 'Processing failed',
  };
  return steps[status] || 'Unknown';
}

function getStepsCompleted(status: string): number {
  const stepMap: Record<string, number> = {
    pending: 0,
    validating: 2,
    processing: 6,
    completed: 12,
    failed: 0,
  };
  return stepMap[status] || 0;
}

export default router;
