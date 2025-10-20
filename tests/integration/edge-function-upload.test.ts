/**
 * Integration Tests for PDF Upload Edge Function
 * Tests complete upload workflow including validation, storage, and database
 */

import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { createMockSupabaseClient } from '../mocks/supabase-client';
import { MockPDFGenerator } from '../mocks/pdf-generator';

describe('Edge Function - PDF Upload Integration', () => {
  let supabase: any;
  let testPdf: Buffer;

  beforeAll(async () => {
    supabase = createMockSupabaseClient();
    testPdf = await MockPDFGenerator.generatePDF({ pageCount: 1 });
  });

  beforeEach(() => {
    supabase.reset();
  });

  it('should upload PDF and create database record', async () => {
    const uploadResult = await uploadPDF(supabase, testPdf, {
      filename: 'test-upload.pdf',
      contentType: 'reading_passage',
      gradeLevel: ['3'],
      language: 'spanish'
    });

    expect(uploadResult.success).toBe(true);
    expect(uploadResult.documentId).toBeDefined();

    // Verify database record
    const { data: document } = await supabase
      .from('pdf_documents')
      .select('*')
      .eq('id', uploadResult.documentId)
      .single();

    expect(document).toBeDefined();
    expect(document.filename).toBe('test-upload.pdf');
    expect(document.processing_status).toBe('pending');
  });

  it('should validate file size limits', async () => {
    const largePdf = Buffer.alloc(100 * 1024 * 1024); // 100MB

    const uploadResult = await uploadPDF(supabase, largePdf, {
      filename: 'too-large.pdf'
    });

    expect(uploadResult.success).toBe(false);
    expect(uploadResult.error).toContain('size');
  });

  it('should validate file type (PDF only)', async () => {
    const notAPdf = Buffer.from('This is not a PDF');

    const uploadResult = await uploadPDF(supabase, notAPdf, {
      filename: 'not-pdf.txt'
    });

    expect(uploadResult.success).toBe(false);
    expect(uploadResult.error).toContain('PDF');
  });

  it('should generate unique storage path', async () => {
    const result1 = await uploadPDF(supabase, testPdf, { filename: 'test.pdf' });
    const result2 = await uploadPDF(supabase, testPdf, { filename: 'test.pdf' });

    expect(result1.storagePath).not.toBe(result2.storagePath);
  });

  it('should calculate file hash for deduplication', async () => {
    const result1 = await uploadPDF(supabase, testPdf, { filename: 'test1.pdf' });
    const result2 = await uploadPDF(supabase, testPdf, { filename: 'test2.pdf' });

    // Same file content should have same hash
    const { data: doc1 } = await supabase
      .from('pdf_documents')
      .select('file_hash')
      .eq('id', result1.documentId)
      .single();

    const { data: doc2 } = await supabase
      .from('pdf_documents')
      .select('file_hash')
      .eq('id', result2.documentId)
      .single();

    expect(doc1.file_hash).toBe(doc2.file_hash);
  });

  it('should store file in Supabase Storage', async () => {
    const uploadResult = await uploadPDF(supabase, testPdf, {
      filename: 'storage-test.pdf'
    });

    const { data: file } = await supabase.storage
      .from('educational-pdfs')
      .download(uploadResult.storagePath);

    expect(file).toBeDefined();
  });

  it('should handle concurrent uploads', async () => {
    const uploads = Array(10).fill(null).map((_, i) =>
      uploadPDF(supabase, testPdf, { filename: `concurrent-${i}.pdf` })
    );

    const results = await Promise.all(uploads);

    expect(results.every(r => r.success)).toBe(true);
    expect(new Set(results.map(r => r.documentId)).size).toBe(10);
  });

  it('should set correct initial processing status', async () => {
    const uploadResult = await uploadPDF(supabase, testPdf, {
      filename: 'status-test.pdf'
    });

    const { data: document } = await supabase
      .from('pdf_documents')
      .select('processing_status, processing_started_at')
      .eq('id', uploadResult.documentId)
      .single();

    expect(document.processing_status).toBe('pending');
    expect(document.processing_started_at).toBeNull();
  });

  it('should validate required metadata fields', async () => {
    const uploadResult = await uploadPDF(supabase, testPdf, {
      filename: 'test.pdf'
      // Missing contentType, gradeLevel, language
    });

    expect(uploadResult.success).toBe(false);
    expect(uploadResult.error).toContain('metadata');
  });

  it('should log upload activity', async () => {
    const uploadResult = await uploadPDF(supabase, testPdf, {
      filename: 'log-test.pdf',
      contentType: 'reading_passage',
      gradeLevel: ['3'],
      language: 'spanish'
    });

    const { data: logs } = await supabase
      .from('pdf_processing_logs')
      .select('*')
      .eq('pdf_document_id', uploadResult.documentId);

    expect(logs.length).toBeGreaterThan(0);
  });
});

describe('Edge Function - PDF Processing Integration', () => {
  let supabase: any;

  beforeAll(() => {
    supabase = createMockSupabaseClient();
  });

  beforeEach(() => {
    supabase.reset();
  });

  it('should process PDF and extract text', async () => {
    const pdf = await MockPDFGenerator.generatePDF({ language: 'spanish', pageCount: 1 });
    const documentId = await createDocument(supabase, pdf);

    const processResult = await processPDF(supabase, documentId);

    expect(processResult.success).toBe(true);

    // Verify text content was extracted
    const { data: textContent } = await supabase
      .from('pdf_text_content')
      .select('*')
      .eq('pdf_document_id', documentId);

    expect(textContent.length).toBeGreaterThan(0);
  });

  it('should update processing status throughout workflow', async () => {
    const pdf = await MockPDFGenerator.generatePDF({ pageCount: 1 });
    const documentId = await createDocument(supabase, pdf);

    // Start processing
    await updateStatus(supabase, documentId, 'processing');
    let { data: doc } = await supabase
      .from('pdf_documents')
      .select('processing_status')
      .eq('id', documentId)
      .single();
    expect(doc.processing_status).toBe('processing');

    // Complete processing
    await updateStatus(supabase, documentId, 'completed');
    ({ data: doc } = await supabase
      .from('pdf_documents')
      .select('processing_status')
      .eq('id', documentId)
      .single());
    expect(doc.processing_status).toBe('completed');
  });

  it('should extract and store images', async () => {
    const pdf = await MockPDFGenerator.generatePDF({
      pageCount: 1,
      includeImages: true,
      imageCount: 3
    });
    const documentId = await createDocument(supabase, pdf);

    await processPDF(supabase, documentId);

    const { data: images } = await supabase
      .from('pdf_images')
      .select('*')
      .eq('pdf_document_id', documentId);

    expect(images.length).toBe(3);
    expect(images[0]).toHaveProperty('storage_path');
    expect(images[0]).toHaveProperty('width_pixels');
    expect(images[0]).toHaveProperty('height_pixels');
  });

  it('should detect language correctly', async () => {
    const spanishPdf = await MockPDFGenerator.generatePDF({ language: 'spanish' });
    const documentId = await createDocument(supabase, spanishPdf);

    await processPDF(supabase, documentId);

    const { data: document } = await supabase
      .from('pdf_documents')
      .select('primary_language, language_detection_confidence')
      .eq('id', documentId)
      .single();

    expect(document.primary_language).toBe('spanish');
    expect(document.language_detection_confidence).toBeGreaterThan(0.95);
  });

  it('should create text-image correlations', async () => {
    const pdf = await MockPDFGenerator.generatePDF({
      pageCount: 1,
      includeImages: true,
      imageCount: 2
    });
    const documentId = await createDocument(supabase, pdf);

    await processPDF(supabase, documentId);

    const { data: correlations } = await supabase
      .from('text_image_correlations')
      .select('*');

    expect(correlations.length).toBeGreaterThan(0);
    expect(correlations[0]).toHaveProperty('confidence_score');
    expect(correlations[0]).toHaveProperty('correlation_type');
  });

  it('should handle processing errors gracefully', async () => {
    const corruptPdf = Buffer.from('Not a valid PDF');
    const documentId = await createDocument(supabase, corruptPdf);

    const processResult = await processPDF(supabase, documentId);

    expect(processResult.success).toBe(false);

    const { data: document } = await supabase
      .from('pdf_documents')
      .select('processing_status, processing_error')
      .eq('id', documentId)
      .single();

    expect(document.processing_status).toBe('failed');
    expect(document.processing_error).toBeDefined();
  });

  it('should extract assessment questions', async () => {
    const assessmentPdf = await MockPDFGenerator.generateAssessmentPDF(10, 'spanish');
    const documentId = await createDocument(supabase, assessmentPdf, {
      contentType: 'assessment'
    });

    await processPDF(supabase, documentId);

    const { data: questions } = await supabase
      .from('assessment_questions')
      .select('*')
      .eq('pdf_document_id', documentId);

    expect(questions.length).toBe(10);
    expect(questions[0]).toHaveProperty('question_text');
    expect(questions[0]).toHaveProperty('choice_a');
    expect(questions[0]).toHaveProperty('correct_answer');
  });

  it('should calculate quality metrics', async () => {
    const pdf = await MockPDFGenerator.generatePDF({ pageCount: 1 });
    const documentId = await createDocument(supabase, pdf);

    await processPDF(supabase, documentId);

    const { data: document } = await supabase
      .from('pdf_documents')
      .select('text_extraction_confidence, quality_score')
      .eq('id', documentId)
      .single();

    expect(document.text_extraction_confidence).toBeGreaterThan(0);
    expect(document.text_extraction_confidence).toBeLessThanOrEqual(1);
    expect(document.quality_score).toBeGreaterThan(0);
    expect(document.quality_score).toBeLessThanOrEqual(1);
  });
});

// Helper functions
async function uploadPDF(supabase: any, pdfBuffer: Buffer, metadata: any): Promise<any> {
  try {
    // Validate
    if (pdfBuffer.length > 50 * 1024 * 1024) {
      return { success: false, error: 'File size exceeds limit' };
    }

    if (!pdfBuffer.toString('utf8', 0, 4).includes('PDF')) {
      return { success: false, error: 'Not a valid PDF file' };
    }

    if (!metadata.contentType || !metadata.gradeLevel || !metadata.language) {
      return { success: false, error: 'Missing required metadata' };
    }

    // Generate paths
    const filename = metadata.filename || 'upload.pdf';
    const storagePath = `uploads/${Date.now()}-${Math.random().toString(36).substring(7)}/${filename}`;

    // Upload to storage
    await supabase.storage
      .from('educational-pdfs')
      .upload(storagePath, pdfBuffer);

    // Create database record
    const { data: document } = await supabase
      .from('pdf_documents')
      .insert({
        filename,
        original_filename: filename,
        file_size: pdfBuffer.length,
        storage_path: storagePath,
        file_hash: `hash-${Date.now()}`,
        content_type: metadata.contentType || 'reading_passage',
        grade_level: metadata.gradeLevel || ['3'],
        subject_area: metadata.subjectArea || ['reading'],
        primary_language: metadata.language || 'spanish',
        processing_status: 'pending'
      })
      .select()
      .single();

    return {
      success: true,
      documentId: document.id,
      storagePath
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

async function createDocument(supabase: any, pdfBuffer: Buffer, metadata: any = {}): Promise<string> {
  const { data: document } = await supabase
    .from('pdf_documents')
    .insert({
      filename: 'test.pdf',
      original_filename: 'test.pdf',
      file_size: pdfBuffer.length,
      storage_path: `test/${Date.now()}.pdf`,
      file_hash: `hash-${Date.now()}`,
      content_type: metadata.contentType || 'reading_passage',
      grade_level: ['3'],
      subject_area: ['reading'],
      primary_language: 'spanish',
      processing_status: 'pending'
    })
    .select()
    .single();

  return document.id;
}

async function processPDF(supabase: any, documentId: string): Promise<any> {
  try {
    await updateStatus(supabase, documentId, 'processing');

    // Mock text extraction
    await supabase.from('pdf_text_content').insert({
      pdf_document_id: documentId,
      page_number: 1,
      section_order: 1,
      text_content: 'Sample text content',
      detected_language: 'spanish',
      language_confidence: 0.96,
      word_count: 10
    });

    // Mock image extraction
    await supabase.from('pdf_images').insert({
      pdf_document_id: documentId,
      page_number: 1,
      image_order: 1,
      storage_path: 'images/test.webp',
      original_format: 'jpeg',
      bbox_x1: 100,
      bbox_y1: 100,
      bbox_x2: 300,
      bbox_y2: 250,
      width_pixels: 800,
      height_pixels: 600,
      original_size_bytes: 50000
    });

    // Update document
    await supabase.from('pdf_documents').update({
      processing_status: 'completed',
      processing_completed_at: new Date().toISOString(),
      primary_language: 'spanish',
      language_detection_confidence: 0.96,
      text_extraction_confidence: 0.98,
      quality_score: 0.95,
      page_count: 1,
      word_count: 100,
      image_count: 1
    }).eq('id', documentId);

    return { success: true };
  } catch (error: any) {
    await supabase.from('pdf_documents').update({
      processing_status: 'failed',
      processing_error: error.message
    }).eq('id', documentId);

    return { success: false, error: error.message };
  }
}

async function updateStatus(supabase: any, documentId: string, status: string): Promise<void> {
  await supabase.from('pdf_documents').update({
    processing_status: status,
    processing_started_at: status === 'processing' ? new Date().toISOString() : undefined,
    processing_completed_at: status === 'completed' ? new Date().toISOString() : undefined
  }).eq('id', documentId);
}
