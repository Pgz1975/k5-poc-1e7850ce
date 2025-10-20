/**
 * Reading Level Assessor Tests
 */

import { describe, it, expect } from '@jest/globals';
import { ReadingLevelAssessor } from '../../src/language/assessment/readingLevelAssessor';

describe('ReadingLevelAssessor', () => {
  describe('assess()', () => {
    it('should assess kindergarten level text', () => {
      const text = 'I see a cat. The cat is big. The cat is red.';
      const result = ReadingLevelAssessor.assess(text, 'english');

      expect(result.gradeLevel).toBeLessThanOrEqual(1);
      expect(result.complexity).toBe('very-easy');
    });

    it('should assess first grade level text', () => {
      const text = 'The dog runs fast. He likes to play. We have fun together.';
      const result = ReadingLevelAssessor.assess(text, 'english');

      expect(result.gradeLevel).toBeGreaterThanOrEqual(0);
      expect(result.gradeLevel).toBeLessThanOrEqual(2);
    });

    it('should assess upper elementary text', () => {
      const text = 'The scientific method involves making observations, forming hypotheses, and conducting experiments to test predictions.';
      const result = ReadingLevelAssessor.assess(text, 'english');

      expect(result.gradeLevel).toBeGreaterThanOrEqual(4);
    });

    it('should assess Spanish text', () => {
      const text = 'El perro corre rápido. Le gusta jugar. Nos divertimos juntos.';
      const result = ReadingLevelAssessor.assess(text, 'spanish');

      expect(result.gradeLevel).toBeGreaterThanOrEqual(0);
      expect(result.gradeLevel).toBeLessThanOrEqual(5);
      expect(result.metrics.language).toBe('spanish');
    });

    it('should provide grade level range', () => {
      const text = 'Students learn many things in school each day.';
      const result = ReadingLevelAssessor.assess(text, 'english');

      expect(result.gradeLevelRange).toHaveLength(2);
      expect(result.gradeLevelRange[0]).toBeLessThanOrEqual(result.gradeLevelRange[1]);
    });

    it('should calculate confidence score', () => {
      const text = 'The children play outside during recess.';
      const result = ReadingLevelAssessor.assess(text, 'english');

      expect(result.confidence).toBeGreaterThan(0);
      expect(result.confidence).toBeLessThanOrEqual(1);
    });

    it('should provide recommendations', () => {
      const text = 'This sentence has lots of really complicated and extraordinarily challenging vocabulary.';
      const result = ReadingLevelAssessor.assess(text, 'english');

      expect(result.recommendations).toBeDefined();
      expect(Array.isArray(result.recommendations)).toBe(true);
    });
  });

  describe('calculateMetrics()', () => {
    it('should calculate comprehensive metrics', () => {
      const text = 'The dog runs. The cat sleeps.';
      const metrics = ReadingLevelAssessor.calculateMetrics(text, 'english');

      expect(metrics.wordCount).toBe(6);
      expect(metrics.sentenceCount).toBe(2);
      expect(metrics.averageWordsPerSentence).toBe(3);
      expect(metrics.syllableCount).toBeGreaterThan(0);
    });

    it('should calculate ratios correctly', () => {
      const text = 'The extraordinarily complicated terminology demonstrates sophisticated vocabulary.';
      const metrics = ReadingLevelAssessor.calculateMetrics(text, 'english');

      expect(metrics.uniqueWordRatio).toBeGreaterThan(0);
      expect(metrics.longWordRatio).toBeGreaterThan(0);
      expect(metrics.averageSyllablesPerWord).toBeGreaterThan(1);
    });
  });

  describe('isAppropriateForGrade()', () => {
    it('should determine if text is appropriate for grade level', () => {
      const text = 'I see my mom. She is happy.';
      const result = ReadingLevelAssessor.isAppropriateForGrade(text, 1, 'english');

      expect(result.appropriate).toBe(true);
      expect(result.reason).toContain('appropriate');
    });

    it('should identify text that is too difficult', () => {
      const text = 'The implementation of sophisticated methodologies requires comprehensive understanding.';
      const result = ReadingLevelAssessor.isAppropriateForGrade(text, 1, 'english');

      expect(result.appropriate).toBe(false);
      expect(result.reason).toContain('too difficult');
    });

    it('should identify text that is too easy', () => {
      const text = 'I see a cat.';
      const result = ReadingLevelAssessor.isAppropriateForGrade(text, 5, 'english');

      expect(result.appropriate).toBe(false);
      expect(result.reason).toContain('too easy');
    });
  });

  describe('Syllable counting', () => {
    it('should count English syllables correctly', () => {
      const testCases = [
        { text: 'The cat runs fast.', language: 'english' as const },
        { text: 'Beautiful butterflies fly.', language: 'english' as const }
      ];

      testCases.forEach(({ text, language }) => {
        const metrics = ReadingLevelAssessor.calculateMetrics(text, language);
        expect(metrics.syllableCount).toBeGreaterThan(0);
        expect(metrics.averageSyllablesPerWord).toBeGreaterThan(0);
      });
    });

    it('should count Spanish syllables correctly', () => {
      const testCases = [
        { text: 'El gato corre rápido.', language: 'spanish' as const },
        { text: 'Mariposas hermosas vuelan.', language: 'spanish' as const }
      ];

      testCases.forEach(({ text, language }) => {
        const metrics = ReadingLevelAssessor.calculateMetrics(text, language);
        expect(metrics.syllableCount).toBeGreaterThan(0);
        expect(metrics.averageSyllablesPerWord).toBeGreaterThan(0);
      });
    });
  });

  describe('Grade level ranges', () => {
    it('should return correct grade info', () => {
      const gradeInfo = ReadingLevelAssessor.getGradeInfo(2);

      expect(gradeInfo.name).toBe('Second Grade');
      expect(gradeInfo.min).toBeLessThan(gradeInfo.max);
    });
  });
});
