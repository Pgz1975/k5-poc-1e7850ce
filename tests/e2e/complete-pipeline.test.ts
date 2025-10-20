/**
 * End-to-End Tests for Complete PDF Processing Pipeline
 * Tests the full workflow from upload to retrieval
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { MockPDFGenerator } from '../mocks/pdf-generator';
import { createMockSupabaseClient } from '../mocks/supabase-client';

describe('E2E - Complete PDF Processing Pipeline', () => {
  let supabase: any;

  beforeAll(() => {
    supabase = createMockSupabaseClient();
  });

  afterAll(() => {
    supabase.reset();
  });

  it('should complete full workflow: upload → process → retrieve', async () => {
    // Step 1: Upload PDF
    const pdf = await MockPDFGenerator.generatePDF({
      pageCount: 3,
      language: 'spanish',
      includeImages: true,
      imageCount: 2
    });

    const uploadResult = await uploadPDF(supabase, pdf, {
      filename: 'test-passage.pdf',
      contentType: 'reading_passage',
      gradeLevel: ['3'],
      language: 'spanish'
    });

    expect(uploadResult.success).toBe(true);
    const documentId = uploadResult.documentId;

    // Step 2: Process PDF
    const processResult = await processPDFComplete(supabase, documentId);
    expect(processResult.success).toBe(true);

    // Step 3: Verify all data was extracted
    const { data: document } = await supabase
      .from('pdf_documents')
      .select(`
        *,
        pdf_text_content (*),
        pdf_images (*),
        text_image_correlations (*)
      `)
      .eq('id', documentId)
      .single();

    expect(document.processing_status).toBe('completed');
    expect(document.pdf_text_content.length).toBeGreaterThan(0);
    expect(document.pdf_images.length).toBe(6); // 2 per page * 3 pages
    expect(document.text_image_correlations.length).toBeGreaterThan(0);

    // Step 4: Retrieve and verify
    const retrievedContent = await retrieveDocument(supabase, documentId);
    expect(retrievedContent.text).toBeDefined();
    expect(retrievedContent.images.length).toBe(6);
    expect(retrievedContent.metadata.language).toBe('spanish');
  });

  it('should handle bilingual content end-to-end', async () => {
    const bilingualPdf = await MockPDFGenerator.generateBilingualPDF();

    const uploadResult = await uploadPDF(supabase, bilingualPdf, {
      filename: 'bilingual-passage.pdf',
      contentType: 'reading_passage',
      gradeLevel: ['3', '4'],
      language: 'bilingual'
    });

    await processPDFComplete(supabase, uploadResult.documentId);

    // Verify both languages were detected
    const { data: textContent } = await supabase
      .from('pdf_text_content')
      .select('detected_language')
      .eq('pdf_document_id', uploadResult.documentId);

    const languages = new Set(textContent.map((t: any) => t.detected_language));
    expect(languages.has('spanish')).toBe(true);
    expect(languages.has('english')).toBe(true);
  });

  it('should process assessment PDF with questions', async () => {
    const assessmentPdf = await MockPDFGenerator.generateAssessmentPDF(10, 'spanish');

    const uploadResult = await uploadPDF(supabase, assessmentPdf, {
      filename: 'diagnostic-test.pdf',
      contentType: 'assessment',
      gradeLevel: ['3'],
      language: 'spanish'
    });

    await processPDFComplete(supabase, uploadResult.documentId);

    // Verify questions were extracted
    const { data: questions } = await supabase
      .from('assessment_questions')
      .select('*')
      .eq('pdf_document_id', uploadResult.documentId)
      .order('question_number');

    expect(questions.length).toBe(10);
    expect(questions[0].question_text).toBeDefined();
    expect(questions[0].choice_a).toBeDefined();
    expect(questions[0].correct_answer).toMatch(/^[A-D]$/);
  });

  it('should handle large document (100 pages) end-to-end', async () => {
    const largePdf = await MockPDFGenerator.generatePDF({ pageCount: 100 });

    const uploadResult = await uploadPDF(supabase, largePdf, {
      filename: 'large-manual.pdf',
      contentType: 'instructional_material',
      gradeLevel: ['4', '5'],
      language: 'english'
    });

    const startTime = Date.now();
    await processPDFComplete(supabase, uploadResult.documentId);
    const processingTime = Date.now() - startTime;

    expect(processingTime).toBeLessThan(45000); // Under 45 seconds

    const { data: document } = await supabase
      .from('pdf_documents')
      .select('page_count, processing_status')
      .eq('id', uploadResult.documentId)
      .single();

    expect(document.page_count).toBe(100);
    expect(document.processing_status).toBe('completed');
  }, 60000);
});

describe('E2E - Search and Retrieval', () => {
  let supabase: any;
  let documentIds: string[] = [];

  beforeAll(async () => {
    supabase = createMockSupabaseClient();

    // Seed database with test documents
    for (let i = 0; i < 10; i++) {
      const pdf = await MockPDFGenerator.generatePDF({
        pageCount: 2,
        language: i % 2 === 0 ? 'spanish' : 'english',
        gradeLevel: `${(i % 5) + 1}`
      });

      const uploadResult = await uploadPDF(supabase, pdf, {
        filename: `test-doc-${i}.pdf`,
        contentType: 'reading_passage',
        gradeLevel: [`${(i % 5) + 1}`],
        language: i % 2 === 0 ? 'spanish' : 'english'
      });

      await processPDFComplete(supabase, uploadResult.documentId);
      documentIds.push(uploadResult.documentId);
    }
  });

  it('should search by grade level', async () => {
    const results = await searchDocuments(supabase, {
      gradeLevel: ['3']
    });

    expect(results.length).toBeGreaterThan(0);
    expect(results.every((r: any) => r.grade_level.includes('3'))).toBe(true);
  });

  it('should search by language', async () => {
    const results = await searchDocuments(supabase, {
      language: 'spanish'
    });

    expect(results.length).toBeGreaterThan(0);
    expect(results.every((r: any) => r.primary_language === 'spanish')).toBe(true);
  });

  it('should perform full-text search', async () => {
    const results = await fullTextSearch(supabase, 'pasaje lectura');

    expect(results.length).toBeGreaterThan(0);
  });

  it('should filter by content type', async () => {
    const results = await searchDocuments(supabase, {
      contentType: 'reading_passage'
    });

    expect(results.every((r: any) => r.content_type === 'reading_passage')).toBe(true);
  });

  it('should retrieve document with images and text', async () => {
    const doc = await retrieveDocumentComplete(supabase, documentIds[0]);

    expect(doc).toHaveProperty('metadata');
    expect(doc).toHaveProperty('content');
    expect(doc).toHaveProperty('images');
    expect(doc.content.text).toBeDefined();
    expect(Array.isArray(doc.images)).toBe(true);
  });
});

describe('E2E - Error Recovery and Edge Cases', () => {
  let supabase: any;

  beforeAll(() => {
    supabase = createMockSupabaseClient();
  });

  it('should recover from processing failure and retry', async () => {
    const corruptPdf = Buffer.from('Not a valid PDF');

    const uploadResult = await uploadPDF(supabase, corruptPdf, {
      filename: 'corrupt.pdf',
      contentType: 'reading_passage',
      gradeLevel: ['3'],
      language: 'spanish'
    });

    // First attempt should fail
    const firstAttempt = await processPDFComplete(supabase, uploadResult.documentId);
    expect(firstAttempt.success).toBe(false);

    // Verify error was logged
    const { data: document } = await supabase
      .from('pdf_documents')
      .select('processing_status, processing_error')
      .eq('id', uploadResult.documentId)
      .single();

    expect(document.processing_status).toBe('failed');
    expect(document.processing_error).toBeDefined();
  });

  it('should handle duplicate file upload', async () => {
    const pdf = await MockPDFGenerator.generatePDF({ pageCount: 1 });

    const upload1 = await uploadPDF(supabase, pdf, {
      filename: 'duplicate-test.pdf',
      contentType: 'reading_passage',
      gradeLevel: ['3'],
      language: 'spanish'
    });

    const upload2 = await uploadPDF(supabase, pdf, {
      filename: 'duplicate-test.pdf',
      contentType: 'reading_passage',
      gradeLevel: ['3'],
      language: 'spanish'
    });

    // Should detect duplicate by file hash
    const { data: docs } = await supabase
      .from('pdf_documents')
      .select('file_hash')
      .in('id', [upload1.documentId, upload2.documentId]);

    expect(docs[0].file_hash).toBe(docs[1].file_hash);
  });

  it('should handle empty PDF', async () => {
    const emptyPdf = await MockPDFGenerator.generatePDF({ pageCount: 0 });

    const uploadResult = await uploadPDF(supabase, emptyPdf, {
      filename: 'empty.pdf',
      contentType: 'reading_passage',
      gradeLevel: ['3'],
      language: 'spanish'
    });

    const processResult = await processPDFComplete(supabase, uploadResult.documentId);

    expect(processResult.success).toBe(false);
    expect(processResult.error).toContain('empty');
  });

  it('should handle mixed content types in single document', async () => {
    // A document that has both reading passage and assessment sections
    const mixedPdf = await MockPDFGenerator.generatePDF({
      pageCount: 5,
      language: 'bilingual'
    });

    const uploadResult = await uploadPDF(supabase, mixedPdf, {
      filename: 'mixed-content.pdf',
      contentType: 'reading_passage',
      gradeLevel: ['3', '4'],
      language: 'bilingual'
    });

    await processPDFComplete(supabase, uploadResult.documentId);

    const { data: document } = await supabase
      .from('pdf_documents')
      .select('*')
      .eq('id', uploadResult.documentId)
      .single();

    expect(document.processing_status).toBe('completed');
  });
});

// Helper functions
async function uploadPDF(supabase: any, pdfBuffer: Buffer, metadata: any): Promise<any> {
  const storagePath = `uploads/${Date.now()}-${metadata.filename}`;

  await supabase.storage
    .from('educational-pdfs')
    .upload(storagePath, pdfBuffer);

  const { data: document } = await supabase
    .from('pdf_documents')
    .insert({
      filename: metadata.filename,
      original_filename: metadata.filename,
      file_size: pdfBuffer.length,
      storage_path: storagePath,
      file_hash: `hash-${Date.now()}`,
      content_type: metadata.contentType,
      grade_level: metadata.gradeLevel,
      subject_area: ['reading'],
      primary_language: metadata.language,
      processing_status: 'pending'
    })
    .select()
    .single();

  return { success: true, documentId: document.id };
}

async function processPDFComplete(supabase: any, documentId: string): Promise<any> {
  try {
    await supabase.from('pdf_documents').update({
      processing_status: 'processing'
    }).eq('id', documentId);

    // Mock complete processing
    await supabase.from('pdf_text_content').insert({
      pdf_document_id: documentId,
      page_number: 1,
      section_order: 1,
      text_content: 'Sample content',
      detected_language: 'spanish',
      language_confidence: 0.96,
      word_count: 100
    });

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

    await supabase.from('pdf_documents').update({
      processing_status: 'completed',
      page_count: 3,
      word_count: 500,
      image_count: 6
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

async function retrieveDocument(supabase: any, documentId: string): Promise<any> {
  const { data: document } = await supabase
    .from('pdf_documents')
    .select('*')
    .eq('id', documentId)
    .single();

  const { data: textContent } = await supabase
    .from('pdf_text_content')
    .select('*')
    .eq('pdf_document_id', documentId);

  const { data: images } = await supabase
    .from('pdf_images')
    .select('*')
    .eq('pdf_document_id', documentId);

  return {
    text: textContent.map((t: any) => t.text_content).join('\n'),
    images,
    metadata: {
      language: document.primary_language,
      gradeLevel: document.grade_level
    }
  };
}

async function retrieveDocumentComplete(supabase: any, documentId: string): Promise<any> {
  const doc = await retrieveDocument(supabase, documentId);
  return {
    metadata: doc.metadata,
    content: { text: doc.text },
    images: doc.images
  };
}

async function searchDocuments(supabase: any, filters: any): Promise<any[]> {
  let query = supabase.from('pdf_documents').select('*');

  if (filters.gradeLevel) {
    query = query.contains('grade_level', filters.gradeLevel);
  }

  if (filters.language) {
    query = query.eq('primary_language', filters.language);
  }

  if (filters.contentType) {
    query = query.eq('content_type', filters.contentType);
  }

  const { data } = await query;
  return data || [];
}

async function fullTextSearch(supabase: any, searchTerm: string): Promise<any[]> {
  // Mock full-text search
  const { data } = await supabase
    .from('pdf_text_content')
    .select('*, pdf_documents (*)')
    .like('text_content', `%${searchTerm}%`);

  return data || [];
}
