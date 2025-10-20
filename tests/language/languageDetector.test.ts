/**
 * Language Detector Tests
 * Comprehensive testing for 95%+ accuracy requirement
 */

import { describe, it, expect } from '@jest/globals';
import { LanguageDetector } from '../../src/language/detection/languageDetector';

describe('LanguageDetector', () => {
  describe('detect()', () => {
    it('should detect English text with high confidence', async () => {
      const text = 'The quick brown fox jumps over the lazy dog. This is a simple English sentence.';
      const result = await LanguageDetector.detect(text);

      expect(result.language).toBe('english');
      expect(result.confidence).toBeGreaterThan(0.95);
    });

    it('should detect Spanish text with high confidence', async () => {
      const text = 'El rápido zorro marrón salta sobre el perro perezoso. Esta es una oración simple en español.';
      const result = await LanguageDetector.detect(text);

      expect(result.language).toBe('spanish');
      expect(result.confidence).toBeGreaterThan(0.95);
    });

    it('should detect Puerto Rican Spanish dialect', async () => {
      const text = 'Voy a tomar la guagua para ir a tirar esto en el zafacón. Los nenes están jugando con la chiringa.';
      const result = await LanguageDetector.detect(text);

      expect(result.language).toBe('spanish');
      expect(result.details.dialectInfo?.isPuertoRican).toBe(true);
      expect(result.details.dialectInfo?.features).toContain('guagua');
      expect(result.details.dialectInfo?.features).toContain('zafacón');
      expect(result.details.dialectInfo?.features).toContain('chiringa');
    });

    it('should detect mixed language content', async () => {
      const text = 'Hello, mi nombre es Juan. I like to learn español and English together.';
      const result = await LanguageDetector.detect(text);

      expect(result.language).toBe('mixed');
      expect(result.details.distribution.spanish).toBeGreaterThan(0.2);
      expect(result.details.distribution.english).toBeGreaterThan(0.2);
    });

    it('should handle empty text gracefully', async () => {
      const result = await LanguageDetector.detect('');

      expect(result.language).toBe('unknown');
      expect(result.confidence).toBe(0);
    });

    it('should detect educational Spanish content', async () => {
      const text = 'Los estudiantes están aprendiendo a leer. La maestra explica la lección de matemáticas.';
      const result = await LanguageDetector.detect(text);

      expect(result.language).toBe('spanish');
      expect(result.confidence).toBeGreaterThan(0.9);
    });

    it('should detect educational English content', async () => {
      const text = 'The students are learning to read. The teacher explains the math lesson.';
      const result = await LanguageDetector.detect(text);

      expect(result.language).toBe('english');
      expect(result.confidence).toBeGreaterThan(0.9);
    });
  });

  describe('detectSegments()', () => {
    it('should detect language in text segments', async () => {
      const text = 'This is English. Esto es español. Another English sentence.';
      const segments = await LanguageDetector.detectSegments(text);

      expect(segments.length).toBeGreaterThan(0);
      expect(segments[0].language).toBe('english');
      expect(segments[1].language).toBe('spanish');
    });
  });

  describe('detectBatch()', () => {
    it('should detect language for multiple texts', async () => {
      const texts = [
        'Hello world',
        'Hola mundo',
        'Good morning class',
        'Buenos días clase'
      ];

      const results = await LanguageDetector.detectBatch(texts);

      expect(results).toHaveLength(4);
      expect(results[0].language).toBe('english');
      expect(results[1].language).toBe('spanish');
      expect(results[2].language).toBe('english');
      expect(results[3].language).toBe('spanish');
    });
  });

  describe('getStatistics()', () => {
    it('should return text statistics', () => {
      const text = 'The quick brown fox. Jumps over the lazy dog.';
      const stats = LanguageDetector.getStatistics(text);

      expect(stats.totalWords).toBe(9);
      expect(stats.sentenceCount).toBe(2);
      expect(stats.averageWordLength).toBeGreaterThan(0);
    });
  });

  describe('Puerto Rican dialect detection', () => {
    it('should detect common PR vocabulary', async () => {
      const prTexts = [
        'Vamos en la guagua',
        'Tira eso en el zafacón',
        'Me puse los mahones',
        'La chiringa está volando',
        'Comí china para el desayuno',
        'Vamos a comer mofongo'
      ];

      for (const text of prTexts) {
        const result = await LanguageDetector.detect(text);
        expect(result.details.dialectInfo?.isPuertoRican).toBe(true);
      }
    });

    it('should identify PR cultural terms', async () => {
      const text = 'El coquí canta en la noche. Los jíbaros cultivan la tierra.';
      const result = await LanguageDetector.detect(text);

      expect(result.details.dialectInfo?.isPuertoRican).toBe(true);
      expect(result.details.dialectInfo?.confidence).toBeGreaterThan(0.3);
    });
  });

  describe('Accuracy benchmarks', () => {
    it('should maintain 95%+ accuracy on test dataset', async () => {
      const testCases = [
        { text: 'The student reads a book every day.', expected: 'english' },
        { text: 'El estudiante lee un libro cada día.', expected: 'spanish' },
        { text: 'Learning is fun and exciting.', expected: 'english' },
        { text: 'Aprender es divertido y emocionante.', expected: 'spanish' },
        { text: 'The teacher helps the children.', expected: 'english' },
        { text: 'La maestra ayuda a los niños.', expected: 'spanish' },
        { text: 'Mathematics is important for everyone.', expected: 'english' },
        { text: 'Las matemáticas son importantes para todos.', expected: 'spanish' },
        { text: 'Reading comprehension skills develop over time.', expected: 'english' },
        { text: 'Las habilidades de comprensión lectora se desarrollan con el tiempo.', expected: 'spanish' }
      ];

      let correct = 0;

      for (const { text, expected } of testCases) {
        const result = await LanguageDetector.detect(text);
        if (result.language === expected) {
          correct++;
        }
      }

      const accuracy = correct / testCases.length;
      expect(accuracy).toBeGreaterThanOrEqual(0.95);
    });
  });
});
