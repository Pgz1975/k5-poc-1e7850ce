/**
 * Unit Tests for PDF Validation Functions
 * Tests PDF validation, format checking, and security validation
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { validatePDF, checkPDFFormat, validateFileSize, validatePDFStructure } from '@/services/pdf/validation';

describe('PDF Validation', () => {
  describe('validatePDF', () => {
    it('should validate a correct PDF file', async () => {
      const mockFile = new File(['%PDF-1.4 content'], 'test.pdf', { type: 'application/pdf' });
      const result = await validatePDF(mockFile);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject non-PDF files', async () => {
      const mockFile = new File(['not a pdf'], 'test.txt', { type: 'text/plain' });
      const result = await validatePDF(mockFile);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid file type');
    });

    it('should reject files without PDF magic number', async () => {
      const mockFile = new File(['Invalid content'], 'test.pdf', { type: 'application/pdf' });
      const result = await validatePDF(mockFile);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Missing PDF magic number');
    });

    it('should reject oversized files', async () => {
      const largeBuffer = new ArrayBuffer(51 * 1024 * 1024); // 51MB
      const mockFile = new File([largeBuffer], 'large.pdf', { type: 'application/pdf' });
      const result = await validatePDF(mockFile);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('File size exceeds maximum');
    });

    it('should reject corrupted PDF structure', async () => {
      const corruptedPDF = new File(['%PDF-1.4\ncorrupted'], 'corrupt.pdf', { type: 'application/pdf' });
      const result = await validatePDF(corruptedPDF);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Corrupted PDF structure');
    });
  });

  describe('checkPDFFormat', () => {
    it('should detect PDF version 1.4', async () => {
      const pdf14 = new File(['%PDF-1.4'], 'test.pdf', { type: 'application/pdf' });
      const result = await checkPDFFormat(pdf14);

      expect(result.version).toBe('1.4');
      expect(result.isSupported).toBe(true);
    });

    it('should detect PDF version 2.0', async () => {
      const pdf20 = new File(['%PDF-2.0'], 'test.pdf', { type: 'application/pdf' });
      const result = await checkPDFFormat(pdf20);

      expect(result.version).toBe('2.0');
      expect(result.isSupported).toBe(true);
    });

    it('should reject unsupported PDF versions', async () => {
      const pdfOld = new File(['%PDF-1.0'], 'old.pdf', { type: 'application/pdf' });
      const result = await checkPDFFormat(pdfOld);

      expect(result.isSupported).toBe(false);
    });
  });

  describe('validateFileSize', () => {
    it('should accept files under 50MB', () => {
      const size = 49 * 1024 * 1024; // 49MB
      const result = validateFileSize(size);

      expect(result.isValid).toBe(true);
      expect(result.sizeInMB).toBe(49);
    });

    it('should reject files over 50MB', () => {
      const size = 51 * 1024 * 1024; // 51MB
      const result = validateFileSize(size);

      expect(result.isValid).toBe(false);
      expect(result.error).toContain('exceeds maximum');
    });

    it('should handle empty files', () => {
      const result = validateFileSize(0);

      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Empty file');
    });
  });

  describe('validatePDFStructure', () => {
    it('should validate proper PDF structure with xref table', async () => {
      const validPDF = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
xref
0 2
0000000000 65535 f
0000000009 00000 n
trailer
<< /Size 2 /Root 1 0 R >>
startxref
123
%%EOF`;

      const file = new File([validPDF], 'valid.pdf', { type: 'application/pdf' });
      const result = await validatePDFStructure(file);

      expect(result.isValid).toBe(true);
      expect(result.hasXRefTable).toBe(true);
      expect(result.hasTrailer).toBe(true);
    });

    it('should detect missing xref table', async () => {
      const invalidPDF = '%PDF-1.4\nNo xref here\n%%EOF';
      const file = new File([invalidPDF], 'invalid.pdf', { type: 'application/pdf' });
      const result = await validatePDFStructure(file);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Missing xref table');
    });

    it('should detect missing EOF marker', async () => {
      const incompletePDF = '%PDF-1.4\nxref\ntrailer';
      const file = new File([incompletePDF], 'incomplete.pdf', { type: 'application/pdf' });
      const result = await validatePDFStructure(file);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Missing EOF marker');
    });
  });

  describe('Security Validation', () => {
    it('should detect password-protected PDFs', async () => {
      const protectedPDF = new File(['%PDF-1.4\n/Encrypt'], 'protected.pdf', { type: 'application/pdf' });
      const result = await validatePDF(protectedPDF);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password-protected PDFs not supported');
    });

    it('should detect potentially malicious JavaScript', async () => {
      const maliciousPDF = new File(['%PDF-1.4\n/JS (eval)'], 'malicious.pdf', { type: 'application/pdf' });
      const result = await validatePDF(maliciousPDF);

      expect(result.isValid).toBe(false);
      expect(result.securityWarnings).toContain('Contains JavaScript');
    });

    it('should validate PDF without security issues', async () => {
      const safePDF = new File(['%PDF-1.4\nSafe content'], 'safe.pdf', { type: 'application/pdf' });
      const result = await validatePDF(safePDF);

      expect(result.securityWarnings).toHaveLength(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle null file input', async () => {
      const result = await validatePDF(null as any);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('No file provided');
    });

    it('should handle undefined file input', async () => {
      const result = await validatePDF(undefined as any);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('No file provided');
    });

    it('should handle empty file name', async () => {
      const file = new File(['%PDF-1.4'], '', { type: 'application/pdf' });
      const result = await validatePDF(file);

      expect(result.warnings).toContain('Missing file name');
    });

    it('should handle files with multiple extensions', async () => {
      const file = new File(['%PDF-1.4'], 'file.pdf.exe', { type: 'application/pdf' });
      const result = await validatePDF(file);

      expect(result.securityWarnings).toContain('Suspicious file extension');
    });
  });

  describe('Performance', () => {
    it('should validate small PDFs under 100ms', async () => {
      const smallPDF = new File(['%PDF-1.4\nSmall content'], 'small.pdf', { type: 'application/pdf' });

      const start = performance.now();
      await validatePDF(smallPDF);
      const duration = performance.now() - start;

      expect(duration).toBeLessThan(100);
    });

    it('should validate large PDFs under 1000ms', async () => {
      // Create a 10MB buffer
      const largeBuffer = new ArrayBuffer(10 * 1024 * 1024);
      const view = new Uint8Array(largeBuffer);
      view.set(new TextEncoder().encode('%PDF-1.4\n'));

      const largePDF = new File([largeBuffer], 'large.pdf', { type: 'application/pdf' });

      const start = performance.now();
      await validatePDF(largePDF);
      const duration = performance.now() - start;

      expect(duration).toBeLessThan(1000);
    });
  });
});
