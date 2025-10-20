/**
 * Integration Tests for Language Processing System
 * Tests end-to-end workflows
 */

import { describe, it, expect } from '@jest/globals';
import { LanguageProcessor } from '../../src/language';

describe('Language Processing System Integration', () => {
  describe('processText()', () => {
    it('should process English text through full pipeline', async () => {
      const text = 'The students are learning to read every day.';

      const result = await LanguageProcessor.processText(text, {
        detectLanguage: true,
        normalize: true,
        generatePhonetics: true,
        assessReadingLevel: true,
        extractVocabulary: true
      });

      expect(result.language?.language).toBe('english');
      expect(result.normalized?.normalized).toBeDefined();
      expect(result.phonetics?.phonetic).toBeDefined();
      expect(result.readingLevel?.gradeLevel).toBeGreaterThanOrEqual(0);
      expect(result.vocabulary?.totalWords).toBeGreaterThan(0);
    });

    it('should process Spanish text through full pipeline', async () => {
      const text = 'Los estudiantes están aprendiendo a leer todos los días.';

      const result = await LanguageProcessor.processText(text, {
        detectLanguage: true,
        normalize: true,
        generatePhonetics: true,
        assessReadingLevel: true,
        extractVocabulary: true
      });

      expect(result.language?.language).toBe('spanish');
      expect(result.normalized?.normalized).toBeDefined();
      expect(result.phonetics?.phonetic).toBeDefined();
      expect(result.readingLevel?.gradeLevel).toBeGreaterThanOrEqual(0);
      expect(result.vocabulary?.totalWords).toBeGreaterThan(0);
    });

    it('should handle Puerto Rican Spanish', async () => {
      const text = 'Los nenes toman la guagua para ir a la escuela.';

      const result = await LanguageProcessor.processText(text, {
        detectLanguage: true,
        extractVocabulary: true
      });

      expect(result.language?.language).toBe('spanish');
      expect(result.language?.details.dialectInfo?.isPuertoRican).toBe(true);
      expect(result.vocabulary?.categoryDistribution.cultural).toBeGreaterThan(0);
    });
  });

  describe('analyzeEducationalContent()', () => {
    it('should analyze kindergarten content', async () => {
      const text = 'I see a cat. The cat is big.';

      const result = await LanguageProcessor.analyzeEducationalContent(text, 0);

      expect(result.language.language).toBe('english');
      expect(result.readingLevel.gradeLevel).toBeLessThanOrEqual(1);
      expect(result.isAppropriate).toBe(true);
      expect(result.recommendations).toBeDefined();
    });

    it('should analyze upper elementary content', async () => {
      const text = 'Students analyze evidence to support their conclusions.';

      const result = await LanguageProcessor.analyzeEducationalContent(text, 4);

      expect(result.readingLevel.gradeLevel).toBeGreaterThanOrEqual(3);
      expect(result.vocabulary.categoryDistribution.academic).toBeGreaterThan(0);
    });

    it('should identify inappropriate content for grade level', async () => {
      const text = 'The implementation of comprehensive methodologies requires sophisticated analysis.';

      const result = await LanguageProcessor.analyzeEducationalContent(text, 1);

      expect(result.isAppropriate).toBe(false);
      expect(result.reason).toContain('too difficult');
    });
  });

  describe('prepareForVoice()', () => {
    it('should prepare English text for voice recognition', async () => {
      const text = "The child can't read this book.";

      const result = await LanguageProcessor.prepareForVoice(text, 'english');

      expect(result.normalized).toBeDefined();
      expect(result.phonetics.phonetic).toBeDefined();
      expect(result.hints.length).toBeGreaterThan(0);
    });

    it('should prepare Spanish text for voice recognition', async () => {
      const text = 'El niño no puede leer este libro.';

      const result = await LanguageProcessor.prepareForVoice(text, 'spanish');

      expect(result.normalized).toBeDefined();
      expect(result.phonetics.phonetic).toBeDefined();
      expect(result.phonetics.language).toBe('spanish');
    });

    it('should prepare Puerto Rican Spanish with dialect features', async () => {
      const text = 'Voy pa\' la escuela en la guagua.';

      const result = await LanguageProcessor.prepareForVoice(text, 'spanish');

      expect(result.normalized).toContain('guagua');
      expect(result.phonetics.phonetic).toBeDefined();
    });
  });

  describe('getStatistics()', () => {
    it('should provide comprehensive statistics', async () => {
      const text = 'The students learn important academic vocabulary every day.';

      const stats = await LanguageProcessor.getStatistics(text);

      expect(stats.languageStats).toBeDefined();
      expect(stats.vocabularyStats).toBeDefined();
      expect(stats.readabilityStats).toBeDefined();

      expect(stats.languageStats.totalWords).toBeGreaterThan(0);
      expect(stats.vocabularyStats.lexicalDiversity).toBeGreaterThan(0);
      expect(stats.readabilityStats.wordCount).toBeGreaterThan(0);
    });
  });

  describe('Cultural sensitivity', () => {
    it('should preserve Puerto Rican cultural terms', async () => {
      const prTerms = [
        'La guagua llega tarde.',
        'Tira eso en el zafacón.',
        'Los mahones están limpios.',
        'La chiringa vuela alto.',
        'Comimos mofongo rico.'
      ];

      for (const text of prTerms) {
        const result = await LanguageProcessor.processText(text, {
          detectLanguage: true,
          normalize: true,
          extractVocabulary: true
        });

        expect(result.language?.details.dialectInfo?.isPuertoRican).toBe(true);
        expect(result.vocabulary?.categoryDistribution.cultural).toBeGreaterThan(0);
      }
    });

    it('should identify cognates for bilingual support', async () => {
      const text = 'The family visits the natural museum to study animals.';

      const result = await LanguageProcessor.processText(text, {
        extractVocabulary: true
      });

      expect(result.vocabulary?.categoryDistribution.cognate).toBeGreaterThan(0);
    });
  });

  describe('Accuracy requirements', () => {
    it('should maintain 95%+ language detection accuracy', async () => {
      const testCases = [
        { text: 'Hello world', expected: 'english' },
        { text: 'Hola mundo', expected: 'spanish' },
        { text: 'Good morning class', expected: 'english' },
        { text: 'Buenos días clase', expected: 'spanish' },
        { text: 'The students read books', expected: 'english' },
        { text: 'Los estudiantes leen libros', expected: 'spanish' },
        { text: 'Learning is fun', expected: 'english' },
        { text: 'Aprender es divertido', expected: 'spanish' },
        { text: 'Mathematics is important', expected: 'english' },
        { text: 'Las matemáticas son importantes', expected: 'spanish' }
      ];

      let correct = 0;

      for (const { text, expected } of testCases) {
        const result = await LanguageProcessor.processText(text, {
          detectLanguage: true
        });

        if (result.language?.language === expected) {
          correct++;
        }
      }

      const accuracy = correct / testCases.length;
      expect(accuracy).toBeGreaterThanOrEqual(0.95);
    });
  });
});
