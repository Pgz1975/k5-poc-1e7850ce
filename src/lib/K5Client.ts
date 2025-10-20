import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type PDFDocument = Database['public']['Tables']['pdf_documents']['Row'];
type PDFTextContent = Database['public']['Tables']['pdf_text_content']['Row'];
type PDFImage = Database['public']['Tables']['pdf_images']['Row'];
type AssessmentQuestion = Database['public']['Tables']['assessment_questions']['Row'];

export interface UploadOptions {
  gradeLevel?: number | number[];
  language?: 'es' | 'en' | 'bilingual';
  contentType?: 'textbook' | 'worksheet' | 'assessment' | 'reading_material' | 'other';
  subjectArea?: string[];
  extractImages?: boolean;
  generateAssessments?: boolean;
}

export interface SearchOptions {
  query: string;
  language?: 'es' | 'en' | 'bilingual';
  gradeLevel?: number[];
  limit?: number;
}

export interface ProcessingProgress {
  documentId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  error?: string;
}

export class K5Client {
  /**
   * Upload and process a PDF document
   */
  async uploadPDF(file: File, options: UploadOptions = {}): Promise<{ documentId: string; status: string }> {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Calculate file hash
      const arrayBuffer = await file.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const fileHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      // Generate storage path
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(7);
      const filename = `${timestamp}_${randomStr}.pdf`;
      const storagePath = `${user.id}/${filename}`;

      console.log('[K5Client] Uploading PDF:', file.name);

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('educational-pdfs')
        .upload(storagePath, file, {
          contentType: 'application/pdf',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Prepare grade level array
      const gradeLevelArray = Array.isArray(options.gradeLevel) 
        ? options.gradeLevel 
        : options.gradeLevel 
          ? [options.gradeLevel]
          : [1, 2, 3, 4, 5];

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
          content_type: options.contentType || 'other',
          grade_level: gradeLevelArray,
          subject_area: options.subjectArea || [],
          primary_language: options.language === 'bilingual' ? 'es' : (options.language || 'es'),
          uploaded_by: user.id,
          processing_status: 'pending'
        })
        .select()
        .single();

      if (dbError) throw dbError;

      console.log('[K5Client] Document created:', document.id);

      // Trigger processing
      const { error: processingError } = await supabase.functions.invoke('process-pdf', {
        body: { documentId: document.id }
      });

      if (processingError) {
        console.error('[K5Client] Processing trigger error:', processingError);
        // Don't throw - processing can be retried
      }

      return {
        documentId: document.id,
        status: document.processing_status
      };

    } catch (error) {
      console.error('[K5Client] Upload error:', error);
      throw error;
    }
  }

  /**
   * Get document by ID
   */
  async getDocument(documentId: string): Promise<PDFDocument | null> {
    const { data, error } = await supabase
      .from('pdf_documents')
      .select('*')
      .eq('id', documentId)
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Get text content from a document
   */
  async getTextContent(
    documentId: string,
    options: { language?: string; page?: number } = {}
  ): Promise<PDFTextContent[]> {
    let query = supabase
      .from('pdf_text_content')
      .select('*')
      .eq('document_id', documentId);

    if (options.language) {
      query = query.eq('detected_language', options.language as any);
    }

    if (options.page) {
      query = query.eq('page_number', options.page);
    }

    query = query.order('page_number', { ascending: true })
      .order('block_index', { ascending: true });

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  /**
   * Get images from a document
   */
  async getImages(documentId: string): Promise<PDFImage[]> {
    const { data, error } = await supabase
      .from('pdf_images')
      .select('*')
      .eq('document_id', documentId)
      .order('page_number', { ascending: true })
      .order('image_index', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  /**
   * Get assessment questions for a document
   */
  async getAssessments(documentId: string, options: { 
    questionType?: string;
    skillAssessed?: string;
    limit?: number;
  } = {}): Promise<AssessmentQuestion[]> {
    let query = supabase
      .from('assessment_questions')
      .select('*')
      .eq('document_id', documentId);

    if (options.questionType) {
      query = query.eq('question_type', options.questionType as any);
    }

    if (options.skillAssessed) {
      query = query.eq('skill_assessed', options.skillAssessed);
    }

    query = query.limit(options.limit || 50);

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  /**
   * Get text-image correlations for a document
   */
  async getCorrelations(documentId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('text_image_correlations')
      .select(`
        *,
        text_content:pdf_text_content(*),
        image:pdf_images(*)
      `)
      .eq('text_content.document_id', documentId);

    if (error) throw error;
    return data || [];
  }

  /**
   * Detect language of text
   */
  async detectLanguage(text: string): Promise<any> {
    const { data, error } = await supabase.functions.invoke('language-detector', {
      body: { text }
    });

    if (error) throw error;
    return data;
  }

  /**
   * Process multiple documents in batch
   */
  async batchProcess(documentIds: string[]): Promise<any> {
    const { data, error } = await supabase.functions.invoke('batch-processor', {
      body: { documentIds }
    });

    if (error) throw error;
    return data;
  }

  /**
   * Search across documents
   */
  async search(options: SearchOptions): Promise<PDFDocument[]> {
    let query = supabase
      .from('pdf_documents')
      .select('*')
      .eq('processing_status', 'completed');

    if (options.gradeLevel && options.gradeLevel.length > 0) {
      query = query.overlaps('grade_level', options.gradeLevel);
    }

    query = query.limit(options.limit || 20);

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  /**
   * Monitor processing progress
   */
  async getProgress(documentId: string): Promise<ProcessingProgress> {
    const { data, error } = await supabase
      .from('pdf_documents')
      .select('processing_status, processing_progress, processing_error')
      .eq('id', documentId)
      .single();

    if (error) throw error;

    return {
      documentId,
      status: data.processing_status,
      progress: data.processing_progress || 0,
      error: data.processing_error || undefined
    };
  }

  /**
   * Subscribe to processing progress updates
   */
  subscribeToProgress(
    documentId: string,
    callback: (progress: ProcessingProgress) => void
  ) {
    const channel = supabase
      .channel(`document-${documentId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'pdf_documents',
          filter: `id=eq.${documentId}`
        },
        (payload) => {
          const doc = payload.new as PDFDocument;
          callback({
            documentId,
            status: doc.processing_status,
            progress: doc.processing_progress || 0,
            error: doc.processing_error || undefined
          });
        }
      )
      .subscribe();

    return {
      unsubscribe: () => channel.unsubscribe()
    };
  }

  /**
   * Wait for document processing to complete
   */
  async waitForCompletion(documentId: string, timeoutMs: number = 60000): Promise<PDFDocument> {
    const startTime = Date.now();

    return new Promise((resolve, reject) => {
      const checkStatus = async () => {
        if (Date.now() - startTime > timeoutMs) {
          reject(new Error('Processing timeout'));
          return;
        }

        const progress = await this.getProgress(documentId);

        if (progress.status === 'completed') {
          const document = await this.getDocument(documentId);
          if (document) {
            resolve(document);
          } else {
            reject(new Error('Document not found'));
          }
        } else if (progress.status === 'failed') {
          reject(new Error(progress.error || 'Processing failed'));
        } else {
          setTimeout(checkStatus, 1000);
        }
      };

      checkStatus();
    });
  }
}

// Export singleton instance
export const k5Client = new K5Client();
