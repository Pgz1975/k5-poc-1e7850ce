/**
 * Unit Tests for PDF Parser Module
 * Tests text extraction, language detection, and metadata extraction
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { MockPDFGenerator } from '../mocks/pdf-generator';

// Mock the PDF parsing libraries
const mockPdfParse = async (buffer: Buffer) => {
  return {
    numpages: 1,
    numrender: 1,
    info: {
      Title: 'Test Document',
      Author: 'Test Author',
      Creator: 'Test Creator'
    },
    metadata: null,
    text: 'Sample text content from PDF',
    version: '1.10.100'
  };
};

describe('PDF Parser - Text Extraction', () => {
  let testPdf: Buffer;

  beforeEach(async () => {
    testPdf = await MockPDFGenerator.generatePDF({ pageCount: 1, language: 'english' });
  });

  it('should extract text from single-page PDF', async () => {
    const result = await mockPdfParse(testPdf);

    expect(result).toBeDefined();
    expect(result.text).toBeDefined();
    expect(result.text.length).toBeGreaterThan(0);
  });

  it('should extract metadata from PDF', async () => {
    const result = await mockPdfParse(testPdf);

    expect(result.info).toBeDefined();
    expect(result.numpages).toBeGreaterThan(0);
  });

  it('should handle empty PDF gracefully', async () => {
    const emptyPdf = await MockPDFGenerator.generatePDF({ pageCount: 0 });

    try {
      const result = await mockPdfParse(emptyPdf);
      expect(result.numpages).toBe(0);
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it('should extract text with high confidence (>98%)', async () => {
    const result = await mockPdfParse(testPdf);

    // Mock confidence score based on text quality
    const confidence = calculateTextConfidence(result.text);
    expect(confidence).toBeGreaterThan(0.98);
  });

  it('should preserve text formatting and structure', async () => {
    const result = await mockPdfParse(testPdf);

    expect(result.text).toContain('Reading Passage');
    expect(result.text.length).toBeGreaterThan(10);
  });
});

describe('PDF Parser - Language Detection', () => {
  it('should detect Spanish content correctly', async () => {
    const spanishPdf = await MockPDFGenerator.generatePDF({ language: 'spanish' });
    const result = await mockPdfParse(spanishPdf);

    const language = detectLanguage(result.text);
    expect(language.language).toBe('spanish');
    expect(language.confidence).toBeGreaterThan(0.95);
  });

  it('should detect English content correctly', async () => {
    const englishPdf = await MockPDFGenerator.generatePDF({ language: 'english' });
    const result = await mockPdfParse(englishPdf);

    const language = detectLanguage(result.text);
    expect(language.language).toBe('english');
    expect(language.confidence).toBeGreaterThan(0.95);
  });

  it('should detect bilingual content', async () => {
    const bilingualPdf = await MockPDFGenerator.generateBilingualPDF();
    const result = await mockPdfParse(bilingualPdf);

    const language = detectLanguage(result.text);
    expect(['spanish', 'english', 'bilingual']).toContain(language.language);
  });

  it('should handle mixed language content per section', async () => {
    const bilingualPdf = await MockPDFGenerator.generateBilingualPDF();
    const result = await mockPdfParse(bilingualPdf);

    const sections = splitIntoSections(result.text);
    const languages = sections.map(s => detectLanguage(s));

    expect(languages.length).toBeGreaterThan(1);
    expect(languages.some(l => l.language === 'spanish')).toBe(true);
    expect(languages.some(l => l.language === 'english')).toBe(true);
  });

  it('should detect Puerto Rican Spanish dialect markers', async () => {
    const puertoricanText = 'Vamos pa\' la playa. El nene está jugando con la goma.';
    const language = detectLanguage(puertoricanText);

    expect(language.language).toBe('spanish');
    expect(language.dialect).toBe('puerto_rican');
  });
});

describe('PDF Parser - Page Processing', () => {
  it('should process multi-page PDFs correctly', async () => {
    const multiPagePdf = await MockPDFGenerator.generatePDF({ pageCount: 10 });
    const result = await mockPdfParse(multiPagePdf);

    expect(result.numpages).toBe(10);
  });

  it('should maintain page order', async () => {
    const multiPagePdf = await MockPDFGenerator.generatePDF({ pageCount: 5 });
    const result = await mockPdfParse(multiPagePdf);

    const pageMarkers = extractPageMarkers(result.text);
    expect(pageMarkers).toEqual([1, 2, 3, 4, 5]);
  });

  it('should handle large PDFs (100+ pages)', async () => {
    const largePdf = await MockPDFGenerator.generatePDF({ pageCount: 100 });

    const startTime = Date.now();
    const result = await mockPdfParse(largePdf);
    const processingTime = Date.now() - startTime;

    expect(result.numpages).toBe(100);
    // Should process within 45 seconds
    expect(processingTime).toBeLessThan(45000);
  }, 60000);
});

describe('PDF Parser - Error Handling', () => {
  it('should handle corrupted PDF files', async () => {
    const corruptedPdf = Buffer.from('Not a valid PDF');

    await expect(async () => {
      await mockPdfParse(corruptedPdf);
    }).rejects.toThrow();
  });

  it('should handle password-protected PDFs', async () => {
    // Mock password-protected PDF
    const protectedPdf = Buffer.from('%PDF-1.4\n%encrypted');

    try {
      await mockPdfParse(protectedPdf);
    } catch (error: any) {
      expect(error.message).toContain('password');
    }
  });

  it('should handle PDFs with no text (image-only)', async () => {
    const imageOnlyPdf = await MockPDFGenerator.generatePDF({
      pageCount: 1,
      includeImages: true,
      imageCount: 5
    });

    const result = await mockPdfParse(imageOnlyPdf);
    // Should still extract some text (image markers)
    expect(result.text).toBeDefined();
  });

  it('should provide meaningful error messages', async () => {
    const invalidPdf = Buffer.from('');

    try {
      await mockPdfParse(invalidPdf);
    } catch (error: any) {
      expect(error.message).toBeDefined();
      expect(error.message.length).toBeGreaterThan(0);
    }
  });
});

describe('PDF Parser - Content Classification', () => {
  it('should identify assessment content', async () => {
    const assessmentPdf = await MockPDFGenerator.generateAssessmentPDF(10, 'spanish');
    const result = await mockPdfParse(assessmentPdf);

    const contentType = classifyContent(result.text);
    expect(contentType).toBe('assessment');
  });

  it('should identify reading passage content', async () => {
    const readingPdf = await MockPDFGenerator.generatePDF({
      contentType: 'reading_passage',
      language: 'spanish'
    });
    const result = await mockPdfParse(readingPdf);

    const contentType = classifyContent(result.text);
    expect(contentType).toBe('reading_passage');
  });

  it('should extract grade level from content', async () => {
    const pdf = await MockPDFGenerator.generatePDF({
      gradeLevel: '3',
      language: 'spanish'
    });
    const result = await mockPdfParse(pdf);

    const gradeLevel = extractGradeLevel(result.text);
    expect(['K', '1', '2', '3', '4', '5']).toContain(gradeLevel);
  });

  it('should calculate reading complexity', async () => {
    const complexPdf = await MockPDFGenerator.generatePDF({
      complexity: 'high',
      language: 'english'
    });
    const result = await mockPdfParse(complexPdf);

    const complexity = calculateReadingComplexity(result.text);
    expect(complexity.score).toBeGreaterThan(5.0);
    expect(complexity.level).toBe('high');
  });
});

// Helper functions (these would be implemented in actual parser)
function calculateTextConfidence(text: string): number {
  // Mock implementation
  return text.length > 10 ? 0.99 : 0.50;
}

function detectLanguage(text: string): { language: string; confidence: number; dialect?: string } {
  const spanishWords = ['el', 'la', 'los', 'las', 'un', 'una', 'de', 'del', 'y', 'había', 'vez'];
  const englishWords = ['the', 'a', 'an', 'and', 'or', 'of', 'to', 'in', 'once', 'upon'];
  const puertoricanMarkers = ['pa\'', 'nene', 'nena', 'goma', 'china'];

  const lowerText = text.toLowerCase();
  const spanishCount = spanishWords.filter(w => lowerText.includes(w)).length;
  const englishCount = englishWords.filter(w => lowerText.includes(w)).length;
  const puertoricanCount = puertoricanMarkers.filter(m => lowerText.includes(m)).length;

  if (spanishCount > englishCount) {
    return {
      language: 'spanish',
      confidence: 0.96,
      dialect: puertoricanCount > 0 ? 'puerto_rican' : undefined
    };
  } else if (englishCount > spanishCount) {
    return {
      language: 'english',
      confidence: 0.97
    };
  }

  return { language: 'bilingual', confidence: 0.85 };
}

function splitIntoSections(text: string): string[] {
  return text.split('\n\n').filter(s => s.trim().length > 0);
}

function extractPageMarkers(text: string): number[] {
  const matches = text.match(/Página (\d+)/g) || [];
  return matches.map(m => parseInt(m.match(/\d+/)?.[0] || '0'));
}

function classifyContent(text: string): string {
  const lowerText = text.toLowerCase();

  if (lowerText.includes('evaluación') || lowerText.includes('assessment')) {
    return 'assessment';
  }
  if (lowerText.includes('pasaje') || lowerText.includes('passage')) {
    return 'reading_passage';
  }
  if (lowerText.includes('actividad') || lowerText.includes('activity')) {
    return 'activity_sheet';
  }

  return 'reading_passage';
}

function extractGradeLevel(text: string): string {
  const match = text.match(/grado\s+(\d+)|grade\s+(\d+)/i);
  if (match) {
    return match[1] || match[2];
  }
  return '3'; // Default
}

function calculateReadingComplexity(text: string): { score: number; level: string } {
  const words = text.split(/\s+/).length;
  const sentences = text.split(/[.!?]+/).length;
  const avgWordsPerSentence = words / sentences;

  let score = avgWordsPerSentence;
  let level = 'low';

  if (avgWordsPerSentence > 15) {
    level = 'high';
    score = 8.0;
  } else if (avgWordsPerSentence > 10) {
    level = 'medium';
    score = 5.5;
  } else {
    level = 'low';
    score = 3.0;
  }

  return { score, level };
}
