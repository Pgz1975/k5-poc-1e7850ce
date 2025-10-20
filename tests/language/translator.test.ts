/**
 * Translator Tests
 */

import { describe, it, expect } from '@jest/globals';
import { Translator } from '../../src/language/translation/translator';

describe('Translator', () => {
  describe('translate()', () => {
    it('should translate English to Spanish', async () => {
      const result = await Translator.translate('hello', 'spanish');

      expect(result.sourceLanguage).toBe('english');
      expect(result.targetLanguage).toBe('spanish');
      expect(result.translated).toBeDefined();
    });

    it('should translate Spanish to English', async () => {
      const result = await Translator.translate('hola', 'english');

      expect(result.sourceLanguage).toBe('spanish');
      expect(result.targetLanguage).toBe('english');
      expect(result.translated).toBeDefined();
    });

    it('should preserve Puerto Rican cultural terms', async () => {
      const result = await Translator.translate(
        'Toma la guagua',
        'english',
        { preserveCulturalTerms: true }
      );

      expect(result.preservedTerms).toContain('guagua');
      expect(result.culturalNotes.length).toBeGreaterThan(0);
    });

    it('should provide cultural explanations', async () => {
      const result = await Translator.translate(
        'Comí mofongo',
        'english',
        { preserveCulturalTerms: true }
      );

      expect(result.culturalNotes.some(note =>
        note.term === 'mofongo'
      )).toBe(true);
    });

    it('should handle educational phrases', async () => {
      const result = await Translator.translate(
        'Good morning, class!',
        'spanish'
      );

      expect(result.confidence).toBeGreaterThan(0.5);
    });

    it('should adapt for target audience', async () => {
      const childResult = await Translator.translate(
        'The students learn',
        'spanish',
        { targetAudience: 'children', gradeLevel: 1 }
      );

      expect(childResult.translated).toBeDefined();
    });
  });

  describe('getCulturalTermInfo()', () => {
    it('should return info for cultural terms', () => {
      const info = Translator.getCulturalTermInfo('guagua');

      expect(info).toBeDefined();
      expect(info?.term).toBe('guagua');
      expect(info?.context).toContain('bus');
    });

    it('should return undefined for non-cultural terms', () => {
      const info = Translator.getCulturalTermInfo('random');

      expect(info).toBeUndefined();
    });
  });

  describe('shouldPreserveTerm()', () => {
    it('should identify terms to preserve', () => {
      expect(Translator.shouldPreserveTerm('guagua')).toBe(true);
      expect(Translator.shouldPreserveTerm('mofongo')).toBe(true);
      expect(Translator.shouldPreserveTerm('hello')).toBe(false);
    });
  });

  describe('getAllCulturalTerms()', () => {
    it('should return all cultural terms', () => {
      const terms = Translator.getAllCulturalTerms();

      expect(terms.length).toBeGreaterThan(0);
      expect(terms.some(t => t.term === 'guagua')).toBe(true);
      expect(terms.some(t => t.term === 'mofongo')).toBe(true);
    });
  });

  describe('translateBatch()', () => {
    it('should translate multiple texts', async () => {
      const texts = ['hello', 'goodbye', 'thank you'];
      const results = await Translator.translateBatch(texts, 'spanish');

      expect(results.length).toBe(3);
      results.forEach(result => {
        expect(result.targetLanguage).toBe('spanish');
      });
    });
  });

  describe('Cultural sensitivity', () => {
    it('should maintain context for Puerto Rican terms', async () => {
      const prTerms = ['guagua', 'zafacón', 'mahones', 'chiringa', 'mofongo'];

      for (const term of prTerms) {
        const result = await Translator.translate(
          term,
          'english',
          { preserveCulturalTerms: true }
        );

        expect(result.preservedTerms).toContain(term);
        expect(result.culturalNotes.length).toBeGreaterThan(0);
      }
    });
  });
});
