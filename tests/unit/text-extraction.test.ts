/**
 * Unit Tests for Text Extraction
 * Tests text extraction accuracy, formatting, and multi-language support
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { extractText, extractTextWithFormatting, cleanExtractedText, detectTextLayout } from '@/services/pdf/textExtraction';

describe('Text Extraction', () => {
  describe('extractText', () => {
    it('should extract plain text from simple PDF', async () => {
      const mockPDF = {
        numPages: 1,
        getPage: vi.fn().mockResolvedValue({
          getTextContent: vi.fn().mockResolvedValue({
            items: [
              { str: 'Hello ', transform: [1, 0, 0, 1, 0, 0] },
              { str: 'World', transform: [1, 0, 0, 1, 50, 0] }
            ]
          })
        })
      };

      const result = await extractText(mockPDF);

      expect(result.text).toBe('Hello World');
      expect(result.pages).toHaveLength(1);
    });

    it('should handle multi-page PDFs', async () => {
      const mockPDF = {
        numPages: 3,
        getPage: vi.fn()
          .mockResolvedValueOnce({
            getTextContent: vi.fn().mockResolvedValue({
              items: [{ str: 'Page 1', transform: [1, 0, 0, 1, 0, 0] }]
            })
          })
          .mockResolvedValueOnce({
            getTextContent: vi.fn().mockResolvedValue({
              items: [{ str: 'Page 2', transform: [1, 0, 0, 1, 0, 0] }]
            })
          })
          .mockResolvedValueOnce({
            getTextContent: vi.fn().mockResolvedValue({
              items: [{ str: 'Page 3', transform: [1, 0, 0, 1, 0, 0] }]
            })
          })
      };

      const result = await extractText(mockPDF);

      expect(result.pages).toHaveLength(3);
      expect(result.pages[0].text).toBe('Page 1');
      expect(result.pages[1].text).toBe('Page 2');
      expect(result.pages[2].text).toBe('Page 3');
    });

    it('should preserve Spanish accents and special characters', async () => {
      const spanishText = 'El niño comió la manzana en el árbol';
      const mockPDF = {
        numPages: 1,
        getPage: vi.fn().mockResolvedValue({
          getTextContent: vi.fn().mockResolvedValue({
            items: [{ str: spanishText, transform: [1, 0, 0, 1, 0, 0] }]
          })
        })
      };

      const result = await extractText(mockPDF);

      expect(result.text).toBe(spanishText);
      expect(result.text).toContain('ñ');
      expect(result.text).toContain('á');
    });

    it('should handle empty pages', async () => {
      const mockPDF = {
        numPages: 1,
        getPage: vi.fn().mockResolvedValue({
          getTextContent: vi.fn().mockResolvedValue({
            items: []
          })
        })
      };

      const result = await extractText(mockPDF);

      expect(result.text).toBe('');
      expect(result.pages[0].isEmpty).toBe(true);
    });
  });

  describe('extractTextWithFormatting', () => {
    it('should detect paragraphs based on spacing', async () => {
      const mockPDF = {
        numPages: 1,
        getPage: vi.fn().mockResolvedValue({
          getTextContent: vi.fn().mockResolvedValue({
            items: [
              { str: 'First paragraph.', transform: [1, 0, 0, 1, 0, 100] },
              { str: 'Second paragraph.', transform: [1, 0, 0, 1, 0, 50] }
            ]
          })
        })
      };

      const result = await extractTextWithFormatting(mockPDF);

      expect(result.paragraphs).toHaveLength(2);
      expect(result.paragraphs[0]).toBe('First paragraph.');
      expect(result.paragraphs[1]).toBe('Second paragraph.');
    });

    it('should detect headings by font size', async () => {
      const mockPDF = {
        numPages: 1,
        getPage: vi.fn().mockResolvedValue({
          getTextContent: vi.fn().mockResolvedValue({
            items: [
              { str: 'Large Heading', height: 24, transform: [1, 0, 0, 1, 0, 0] },
              { str: 'Normal text', height: 12, transform: [1, 0, 0, 1, 0, 0] }
            ]
          })
        })
      };

      const result = await extractTextWithFormatting(mockPDF);

      expect(result.headings).toContain('Large Heading');
      expect(result.headings).not.toContain('Normal text');
    });

    it('should detect multi-column layouts', async () => {
      const mockPDF = {
        numPages: 1,
        getPage: vi.fn().mockResolvedValue({
          getTextContent: vi.fn().mockResolvedValue({
            items: [
              { str: 'Left column', transform: [1, 0, 0, 1, 50, 100] },
              { str: 'Right column', transform: [1, 0, 0, 1, 350, 100] }
            ]
          }),
          getViewport: vi.fn().mockReturnValue({ width: 600, height: 800 })
        })
      };

      const result = await extractTextWithFormatting(mockPDF);

      expect(result.layout.columnCount).toBe(2);
      expect(result.layout.columns[0].text).toContain('Left column');
      expect(result.layout.columns[1].text).toContain('Right column');
    });

    it('should preserve bullet points and lists', async () => {
      const mockPDF = {
        numPages: 1,
        getPage: vi.fn().mockResolvedValue({
          getTextContent: vi.fn().mockResolvedValue({
            items: [
              { str: '• ', transform: [1, 0, 0, 1, 0, 100] },
              { str: 'First item', transform: [1, 0, 0, 1, 10, 100] },
              { str: '• ', transform: [1, 0, 0, 1, 0, 80] },
              { str: 'Second item', transform: [1, 0, 0, 1, 10, 80] }
            ]
          })
        })
      };

      const result = await extractTextWithFormatting(mockPDF);

      expect(result.lists).toHaveLength(1);
      expect(result.lists[0].items).toHaveLength(2);
      expect(result.lists[0].items[0]).toBe('First item');
    });
  });

  describe('cleanExtractedText', () => {
    it('should remove extra whitespace', () => {
      const dirtyText = 'Hello    World  \n\n\n  Test';
      const result = cleanExtractedText(dirtyText);

      expect(result).toBe('Hello World\nTest');
    });

    it('should fix hyphenation at line breaks', () => {
      const hyphenatedText = 'This is a super-\ncalifragilistic word';
      const result = cleanExtractedText(hyphenatedText);

      expect(result).toBe('This is a supercalifragilistic word');
    });

    it('should normalize Spanish quotation marks', () => {
      const text = '«Hola» "mundo" 'test'';
      const result = cleanExtractedText(text);

      expect(result).toBe('"Hola" "mundo" "test"');
    });

    it('should preserve intentional formatting', () => {
      const formattedText = 'Title\n\nParagraph one.\n\nParagraph two.';
      const result = cleanExtractedText(formattedText, { preserveParagraphs: true });

      expect(result).toBe(formattedText);
    });

    it('should handle mixed Spanish and English text', () => {
      const mixedText = 'The word "árbol" means tree.';
      const result = cleanExtractedText(mixedText);

      expect(result).toBe(mixedText);
      expect(result).toContain('á');
    });
  });

  describe('detectTextLayout', () => {
    it('should detect single column layout', () => {
      const textItems = [
        { str: 'Line 1', transform: [1, 0, 0, 1, 50, 100] },
        { str: 'Line 2', transform: [1, 0, 0, 1, 50, 80] },
        { str: 'Line 3', transform: [1, 0, 0, 1, 50, 60] }
      ];

      const result = detectTextLayout(textItems, { width: 600, height: 800 });

      expect(result.type).toBe('single-column');
      expect(result.columns).toHaveLength(1);
    });

    it('should detect two-column layout', () => {
      const textItems = [
        { str: 'Left 1', transform: [1, 0, 0, 1, 50, 100] },
        { str: 'Right 1', transform: [1, 0, 0, 1, 350, 100] },
        { str: 'Left 2', transform: [1, 0, 0, 1, 50, 80] },
        { str: 'Right 2', transform: [1, 0, 0, 1, 350, 80] }
      ];

      const result = detectTextLayout(textItems, { width: 600, height: 800 });

      expect(result.type).toBe('two-column');
      expect(result.columns).toHaveLength(2);
    });

    it('should detect mixed layout (title + columns)', () => {
      const textItems = [
        { str: 'Full Width Title', transform: [1, 0, 0, 1, 100, 700] },
        { str: 'Left column', transform: [1, 0, 0, 1, 50, 600] },
        { str: 'Right column', transform: [1, 0, 0, 1, 350, 600] }
      ];

      const result = detectTextLayout(textItems, { width: 600, height: 800 });

      expect(result.type).toBe('mixed');
      expect(result.sections).toContain('full-width-header');
    });
  });

  describe('Performance', () => {
    it('should extract text from 1-page PDF under 200ms', async () => {
      const mockPDF = {
        numPages: 1,
        getPage: vi.fn().mockResolvedValue({
          getTextContent: vi.fn().mockResolvedValue({
            items: Array(1000).fill({ str: 'word ', transform: [1, 0, 0, 1, 0, 0] })
          })
        })
      };

      const start = performance.now();
      await extractText(mockPDF);
      const duration = performance.now() - start;

      expect(duration).toBeLessThan(200);
    });

    it('should extract text from 50-page PDF under 5000ms', async () => {
      const mockPDF = {
        numPages: 50,
        getPage: vi.fn().mockResolvedValue({
          getTextContent: vi.fn().mockResolvedValue({
            items: Array(100).fill({ str: 'word ', transform: [1, 0, 0, 1, 0, 0] })
          })
        })
      };

      const start = performance.now();
      await extractText(mockPDF);
      const duration = performance.now() - start;

      expect(duration).toBeLessThan(5000);
    });
  });

  describe('Accuracy', () => {
    it('should achieve >95% accuracy on standard text', async () => {
      const expectedText = 'The quick brown fox jumps over the lazy dog.';
      const mockPDF = {
        numPages: 1,
        getPage: vi.fn().mockResolvedValue({
          getTextContent: vi.fn().mockResolvedValue({
            items: [{ str: expectedText, transform: [1, 0, 0, 1, 0, 0] }]
          })
        })
      };

      const result = await extractText(mockPDF);
      const accuracy = calculateTextAccuracy(result.text, expectedText);

      expect(accuracy).toBeGreaterThan(0.95);
    });

    it('should maintain word order in multi-column text', async () => {
      // This tests that reading order is preserved
      const mockPDF = {
        numPages: 1,
        getPage: vi.fn().mockResolvedValue({
          getTextContent: vi.fn().mockResolvedValue({
            items: [
              { str: 'First', transform: [1, 0, 0, 1, 50, 100] },
              { str: 'Second', transform: [1, 0, 0, 1, 350, 100] },
              { str: 'Third', transform: [1, 0, 0, 1, 50, 80] },
              { str: 'Fourth', transform: [1, 0, 0, 1, 350, 80] }
            ]
          })
        })
      };

      const result = await extractTextWithFormatting(mockPDF);
      const words = result.text.split(/\s+/);

      expect(words).toEqual(['First', 'Second', 'Third', 'Fourth']);
    });
  });
});

// Helper function
function calculateTextAccuracy(extracted: string, expected: string): number {
  const extractedWords = extracted.toLowerCase().split(/\s+/);
  const expectedWords = expected.toLowerCase().split(/\s+/);

  let matches = 0;
  expectedWords.forEach((word, idx) => {
    if (extractedWords[idx] === word) matches++;
  });

  return matches / expectedWords.length;
}
