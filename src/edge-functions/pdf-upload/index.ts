/**
 * PDF Upload Edge Function
 * Handles PDF file uploads with validation and initial processing
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';

interface UploadRequest {
  file: File;
  metadata: {
    contentType: 'reading_passage' | 'assessment' | 'instructional_material' | 'activity_sheet' | 'teacher_guide';
    gradeLevel: string[];
    subjectArea: string[];
    primaryLanguage: 'spanish' | 'english' | 'bilingual';
  };
}

interface UploadResponse {
  success: boolean;
  documentId?: string;
  message?: string;
  error?: string;
  validationErrors?: string[];
}

const ALLOWED_MIME_TYPES = ['application/pdf'];
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const MIN_FILE_SIZE = 1024; // 1KB

serve(async (req: Request): Promise<Response> => {
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Parse multipart form data
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const metadataStr = formData.get('metadata') as string;

    if (!file || !metadataStr) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Missing file or metadata',
        } as UploadResponse),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const metadata = JSON.parse(metadataStr);

    // Validate file
    const validationErrors = await validateFile(file, metadata);
    if (validationErrors.length > 0) {
      return new Response(
        JSON.stringify({
          success: false,
          validationErrors,
        } as UploadResponse),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Calculate file hash for deduplication
    const fileBuffer = await file.arrayBuffer();
    const fileHash = await calculateSHA256(fileBuffer);

    // Check for duplicate
    const { data: existingDoc } = await supabase
      .from('pdf_documents')
      .select('id')
      .eq('file_hash', fileHash)
      .single();

    if (existingDoc) {
      return new Response(
        JSON.stringify({
          success: true,
          documentId: existingDoc.id,
          message: 'File already exists (duplicate detected)',
        } as UploadResponse),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const sanitizedName = sanitizeFilename(file.name);
    const storagePath = `${metadata.gradeLevel.join('-')}/${timestamp}-${sanitizedName}`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('educational-pdfs')
      .upload(storagePath, fileBuffer, {
        contentType: 'application/pdf',
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Failed to upload file to storage',
        } as UploadResponse),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Get authenticated user
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user } } = await supabase.auth.getUser(token);

    // Create database record
    const { data: document, error: dbError } = await supabase
      .from('pdf_documents')
      .insert({
        filename: sanitizedName,
        original_filename: file.name,
        file_size: file.size,
        storage_bucket: 'educational-pdfs',
        storage_path: storagePath,
        file_hash: fileHash,
        content_type: metadata.contentType,
        grade_level: metadata.gradeLevel,
        subject_area: metadata.subjectArea,
        primary_language: metadata.primaryLanguage,
        processing_status: 'pending',
        uploaded_by: user?.id || null,
      })
      .select('id')
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      // Cleanup uploaded file
      await supabase.storage.from('educational-pdfs').remove([storagePath]);

      return new Response(
        JSON.stringify({
          success: false,
          error: 'Failed to create database record',
        } as UploadResponse),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Trigger async processing
    const processorUrl = `${supabaseUrl}/functions/v1/pdf-processor`;
    fetch(processorUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseKey}`,
      },
      body: JSON.stringify({ documentId: document.id }),
    }).catch((err) => console.error('Failed to trigger processor:', err));

    return new Response(
      JSON.stringify({
        success: true,
        documentId: document.id,
        message: 'File uploaded successfully and queued for processing',
      } as UploadResponse),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Upload error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      } as UploadResponse),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

async function validateFile(file: File, metadata: any): Promise<string[]> {
  const errors: string[] = [];

  // Check MIME type
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    errors.push(`Invalid file type. Expected PDF, got ${file.type}`);
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    errors.push(`File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB`);
  }

  if (file.size < MIN_FILE_SIZE) {
    errors.push(`File too small. Minimum size is ${MIN_FILE_SIZE} bytes`);
  }

  // Validate metadata
  if (!metadata.contentType) {
    errors.push('Content type is required');
  }

  if (!metadata.gradeLevel || metadata.gradeLevel.length === 0) {
    errors.push('At least one grade level is required');
  }

  if (!metadata.subjectArea || metadata.subjectArea.length === 0) {
    errors.push('At least one subject area is required');
  }

  if (!metadata.primaryLanguage) {
    errors.push('Primary language is required');
  }

  return errors;
}

function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/_{2,}/g, '_')
    .toLowerCase();
}

async function calculateSHA256(buffer: ArrayBuffer): Promise<string> {
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
