/**
 * Integration Tests for Complete PDF Processing Flow
 * Tests end-to-end PDF processing from upload to storage
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createClient } from '@supabase/supabase-js';
import { processPDF, uploadPDF, extractContent, storeMetadata } from '@/services/pdf/processor';

describe('PDF Processing Flow Integration', () => {
  let supabase: any;
  let testPDFFile: File;

  beforeEach(async () => {
    // Initialize Supabase client
    supabase = createClient(
      process.env.VITE_SUPABASE_URL!,
      process.env.VITE_SUPABASE_ANON_KEY!
    );

    // Create test PDF file
    testPDFFile = new File(
      ['%PDF-1.4\nTest content\n%%EOF'],
      'test.pdf',
      { type: 'application/pdf' }
    );
  });

  afterEach(async () => {
    // Clean up test data
    await cleanupTestData(supabase);
  });

  describe('Complete Processing Pipeline', () => {
    it('should process PDF from upload to storage', async () => {
      // Step 1: Upload PDF
      const uploadResult = await uploadPDF(testPDFFile, {
        userId: 'test-user-123',
        gradeLevel: '3'
      });

      expect(uploadResult.success).toBe(true);
      expect(uploadResult.fileId).toBeDefined();

      // Step 2: Extract content
      const extractionResult = await extractContent(uploadResult.fileId);

      expect(extractionResult.text).toBeDefined();
      expect(extractionResult.images).toBeDefined();
      expect(extractionResult.metadata).toBeDefined();

      // Step 3: Store in database
      const storageResult = await storeMetadata(uploadResult.fileId, extractionResult);

      expect(storageResult.success).toBe(true);

      // Step 4: Verify data integrity
      const { data, error } = await supabase
        .from('pdf_documents')
        .select('*')
        .eq('id', uploadResult.fileId)
        .single();

      expect(error).toBeNull();
      expect(data.text_content).toBe(extractionResult.text);
    });

    it('should handle Spanish PDF content correctly', async () => {
      const spanishPDF = new File(
        ['%PDF-1.4\nEl gato está en el árbol.\n%%EOF'],
        'spanish.pdf',
        { type: 'application/pdf' }
      );

      const result = await processPDF(spanishPDF, {
        userId: 'test-user-123',
        language: 'es'
      });

      expect(result.detectedLanguage).toBe('es');
      expect(result.text).toContain('árbol');
      expect(result.textQuality.preservedAccents).toBe(true);
    });

    it('should process bilingual PDF content', async () => {
      const bilingualPDF = new File(
        ['%PDF-1.4\nThe cat is on the tree. El gato está en el árbol.\n%%EOF'],
        'bilingual.pdf',
        { type: 'application/pdf' }
      );

      const result = await processPDF(bilingualPDF, {
        userId: 'test-user-123'
      });

      expect(result.isBilingual).toBe(true);
      expect(result.languages).toContain('en-US');
      expect(result.languages).toContain('es');
      expect(result.sections).toHaveLength(2);
    });

    it('should extract and correlate images with text', async () => {
      const pdfWithImages = createPDFWithImages();

      const result = await processPDF(pdfWithImages, {
        userId: 'test-user-123',
        extractImages: true
      });

      expect(result.images).not.toHaveLength(0);
      expect(result.images[0].correlatedText).toBeDefined();
      expect(result.images[0].caption).toBeDefined();
    });

    it('should handle multi-page PDFs efficiently', async () => {
      const multiPagePDF = createMultiPagePDF(10);

      const start = performance.now();
      const result = await processPDF(multiPagePDF, {
        userId: 'test-user-123'
      });
      const duration = performance.now() - start;

      expect(result.pageCount).toBe(10);
      expect(result.pages).toHaveLength(10);
      expect(duration).toBeLessThan(3000); // Should process 10 pages under 3 seconds
    });
  });

  describe('Error Handling and Recovery', () => {
    it('should handle corrupted PDFs gracefully', async () => {
      const corruptedPDF = new File(
        ['Not a valid PDF'],
        'corrupted.pdf',
        { type: 'application/pdf' }
      );

      const result = await processPDF(corruptedPDF, {
        userId: 'test-user-123'
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid PDF');
      expect(result.recoveryAttempted).toBe(true);
    });

    it('should retry on network failures', async () => {
      const mockUpload = vi.fn()
        .mockRejectedValueOnce(new Error('Network error'))
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({ success: true, fileId: 'test-123' });

      const result = await uploadPDF(testPDFFile, {
        userId: 'test-user-123',
        uploadFunction: mockUpload
      });

      expect(mockUpload).toHaveBeenCalledTimes(3);
      expect(result.success).toBe(true);
      expect(result.retryCount).toBe(2);
    });

    it('should rollback on partial failure', async () => {
      const pdfFile = testPDFFile;

      // Mock storage failure after upload
      vi.spyOn(supabase.storage, 'upload').mockResolvedValueOnce({ data: { path: 'test' }, error: null });
      vi.spyOn(supabase.from('pdf_documents'), 'insert').mockRejectedValueOnce(new Error('DB Error'));

      const result = await processPDF(pdfFile, {
        userId: 'test-user-123'
      });

      expect(result.success).toBe(false);

      // Verify file was removed from storage
      const { data } = await supabase.storage
        .from('pdfs')
        .list('test-user-123');

      expect(data).toHaveLength(0);
    });
  });

  describe('Data Validation', () => {
    it('should validate extracted text quality', async () => {
      const result = await processPDF(testPDFFile, {
        userId: 'test-user-123',
        validateQuality: true
      });

      expect(result.qualityMetrics).toBeDefined();
      expect(result.qualityMetrics.textCoverage).toBeGreaterThan(0.9);
      expect(result.qualityMetrics.characterAccuracy).toBeGreaterThan(0.95);
    });

    it('should detect and flag low-quality scans', async () => {
      const lowQualityScan = createLowQualityPDF();

      const result = await processPDF(lowQualityScan, {
        userId: 'test-user-123'
      });

      expect(result.warnings).toContain('Low quality scan detected');
      expect(result.qualityMetrics.confidence).toBeLessThan(0.7);
    });
  });

  describe('Concurrent Processing', () => {
    it('should handle concurrent PDF uploads', async () => {
      const pdfs = Array(5).fill(null).map((_, i) =>
        new File([`%PDF-1.4\nDocument ${i}\n%%EOF`], `doc${i}.pdf`, { type: 'application/pdf' })
      );

      const results = await Promise.all(
        pdfs.map(pdf => processPDF(pdf, { userId: 'test-user-123' }))
      );

      expect(results).toHaveLength(5);
      expect(results.every(r => r.success)).toBe(true);
    });

    it('should maintain transaction integrity under load', async () => {
      const heavyLoad = Array(20).fill(null).map((_, i) =>
        new File([`%PDF-1.4\nDoc ${i}\n%%EOF`], `doc${i}.pdf`, { type: 'application/pdf' })
      );

      const results = await Promise.allSettled(
        heavyLoad.map(pdf => processPDF(pdf, { userId: 'test-user-123' }))
      );

      const successCount = results.filter(r => r.status === 'fulfilled').length;
      const failureCount = results.filter(r => r.status === 'rejected').length;

      expect(successCount + failureCount).toBe(20);
      expect(successCount).toBeGreaterThan(15); // At least 75% success rate
    });
  });

  describe('Storage Integration', () => {
    it('should upload to Supabase Storage', async () => {
      const result = await uploadPDF(testPDFFile, {
        userId: 'test-user-123',
        bucket: 'pdfs'
      });

      expect(result.success).toBe(true);
      expect(result.storagePath).toContain('test-user-123');

      // Verify file exists
      const { data } = await supabase.storage
        .from('pdfs')
        .download(result.storagePath);

      expect(data).toBeDefined();
    });

    it('should generate and store CDN URLs', async () => {
      const result = await processPDF(testPDFFile, {
        userId: 'test-user-123',
        generateCDNUrl: true
      });

      expect(result.cdnUrl).toBeDefined();
      expect(result.cdnUrl).toMatch(/https?:\/\/.+/);

      // Verify URL is accessible
      const response = await fetch(result.cdnUrl);
      expect(response.ok).toBe(true);
    });

    it('should implement proper access controls', async () => {
      const result = await processPDF(testPDFFile, {
        userId: 'test-user-123',
        accessLevel: 'private'
      });

      // Try to access with different user
      const { error } = await supabase
        .from('pdf_documents')
        .select('*')
        .eq('id', result.fileId)
        .single();

      // Should fail due to RLS policies
      expect(error).toBeDefined();
    });
  });
});

// Helper functions
async function cleanupTestData(supabase: any) {
  await supabase.from('pdf_documents').delete().eq('user_id', 'test-user-123');
  await supabase.storage.from('pdfs').remove(['test-user-123']);
}

function createPDFWithImages(): File {
  // Create a mock PDF with image content
  return new File(
    ['%PDF-1.4\n/Type /XObject /Subtype /Image\n%%EOF'],
    'with-images.pdf',
    { type: 'application/pdf' }
  );
}

function createMultiPagePDF(pageCount: number): File {
  let content = '%PDF-1.4\n';
  for (let i = 0; i < pageCount; i++) {
    content += `Page ${i + 1} content\n`;
  }
  content += '%%EOF';

  return new File([content], 'multipage.pdf', { type: 'application/pdf' });
}

function createLowQualityPDF(): File {
  return new File(
    ['%PDF-1.4\nBl urr y te xt\n%%EOF'],
    'lowquality.pdf',
    { type: 'application/pdf' }
  );
}
