/**
 * Text Normalizer Tests
 */

import { describe, it, expect } from '@jest/globals';
import { TextNormalizer } from '../../src/language/normalization/textNormalizer';

describe('TextNormalizer', () => {
  describe('normalize()', () => {
    it('should normalize basic text', () => {
      const text = '  Hello    World!  ';
      const result = TextNormalizer.normalize(text);

      expect(result.normalized).toBe('hello world!');
      expect(result.changes.length).toBeGreaterThan(0);
    });

    it('should remove HTML tags', () => {
      const text = '<p>Hello <strong>world</strong>!</p>';
      const result = TextNormalizer.normalize(text, { removeHtmlTags: true });

      expect(result.normalized).not.toContain('<p>');
      expect(result.normalized).not.toContain('</p>');
      expect(result.normalized).toContain('hello');
      expect(result.normalized).toContain('world');
    });

    it('should preserve Spanish accents', () => {
      const text = 'café, niño, José';
      const result = TextNormalizer.normalize(text, { preserveAccents: true });

      expect(result.normalized).toContain('café');
      expect(result.normalized).toContain('niño');
      expect(result.normalized).toContain('josé');
    });

    it('should expand English contractions', () => {
      const text = "I can't do this. Don't worry, it's okay.";
      const result = TextNormalizer.normalize(text, { expandContractions: true });

      expect(result.normalized).toContain('cannot');
      expect(result.normalized).toContain('do not');
      expect(result.normalized).toContain('it is');
    });

    it('should preserve Puerto Rican terms', () => {
      const text = "Voy en la guagua pa' la escuela";
      const result = TextNormalizer.normalize(text, {
        preservePuertoRicanTerms: true,
        expandContractions: false
      });

      expect(result.normalized).toContain('guagua');
    });

    it('should normalize whitespace', () => {
      const text = 'Hello\t\tworld\n\n\ntest';
      const result = TextNormalizer.normalize(text, { normalizeWhitespace: true });

      expect(result.normalized).not.toContain('\t');
      expect(result.normalized.split('\n\n').length).toBeLessThanOrEqual(2);
    });
  });

  describe('quickNormalize()', () => {
    it('should perform quick normalization', () => {
      const text = '  <p>Hello</p>  World!  ';
      const result = TextNormalizer.quickNormalize(text);

      expect(result).toBe('hello world!');
    });
  });

  describe('normalizeForVoice()', () => {
    it('should normalize Spanish for voice recognition', () => {
      const text = 'El niño come. ¡Qué rico!';
      const result = TextNormalizer.normalizeForVoice(text, 'spanish');

      expect(result).toContain('niño'); // Accents preserved
      expect(result).not.toContain('!'); // Punctuation removed
    });

    it('should normalize English for voice recognition', () => {
      const text = "The child eats. It's delicious!";
      const result = TextNormalizer.normalizeForVoice(text, 'english');

      expect(result).toContain('it is'); // Contraction expanded
      expect(result).not.toContain('!'); // Punctuation removed
    });
  });

  describe('normalizeForSearch()', () => {
    it('should normalize for search indexing', () => {
      const text = 'Café con leche';
      const result = TextNormalizer.normalizeForSearch(text);

      expect(result).toBe('cafe con leche'); // Accents removed
    });
  });

  describe('cleanForEducation()', () => {
    it('should clean text for kindergarten', () => {
      const text = "I can't read this.";
      const result = TextNormalizer.cleanForEducation(text, 0);

      expect(result).toContain('cannot'); // Contractions expanded for K
    });

    it('should clean text for upper grades', () => {
      const text = "I can't read this.";
      const result = TextNormalizer.cleanForEducation(text, 5);

      expect(result).toContain("can't"); // Contractions OK for grade 5
    });
  });

  describe('Quality assessment', () => {
    it('should assess text quality', () => {
      const text = '<p>Hello world</p>';
      const result = TextNormalizer.normalize(text);

      expect(result.quality.cleanliness).toBeGreaterThan(0);
      expect(result.quality.readability).toBeGreaterThan(0);
    });
  });
});
