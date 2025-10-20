/**
 * Vocabulary Extractor Tests
 */

import { describe, it, expect } from '@jest/globals';
import { VocabularyExtractor } from '../../src/language/vocabulary/vocabularyExtractor';

describe('VocabularyExtractor', () => {
  describe('analyze()', () => {
    it('should extract vocabulary from English text', () => {
      const text = 'The students learn mathematics and science every day.';
      const result = VocabularyExtractor.analyze(text, 'english');

      expect(result.totalWords).toBeGreaterThan(0);
      expect(result.uniqueWords).toBeGreaterThan(0);
      expect(result.vocabularyItems.length).toBeGreaterThan(0);
    });

    it('should extract vocabulary from Spanish text', () => {
      const text = 'Los estudiantes aprenden matemáticas y ciencias todos los días.';
      const result = VocabularyExtractor.analyze(text, 'spanish');

      expect(result.totalWords).toBeGreaterThan(0);
      expect(result.uniqueWords).toBeGreaterThan(0);
      expect(result.vocabularyItems.length).toBeGreaterThan(0);
    });

    it('should categorize high-frequency words', () => {
      const text = 'the and a to in is';
      const result = VocabularyExtractor.analyze(text, 'english');

      const highFrequency = result.vocabularyItems.filter(
        item => item.category === 'high-frequency'
      );

      expect(highFrequency.length).toBeGreaterThan(0);
    });

    it('should identify academic vocabulary', () => {
      const text = 'Students analyze evidence to conclude their hypothesis.';
      const result = VocabularyExtractor.analyze(text, 'english');

      const academic = result.vocabularyItems.filter(
        item => item.category === 'academic' || item.category === 'tier-2'
      );

      expect(academic.length).toBeGreaterThan(0);
    });

    it('should identify cultural vocabulary', () => {
      const text = 'Vamos a comer mofongo y alcapurrias en la guagua.';
      const result = VocabularyExtractor.analyze(text, 'spanish');

      const cultural = result.vocabularyItems.filter(
        item => item.category === 'cultural'
      );

      expect(cultural.length).toBeGreaterThan(0);
      expect(cultural.some(item => item.word === 'mofongo')).toBe(true);
      expect(cultural.some(item => item.word === 'guagua')).toBe(true);
    });

    it('should identify cognates', () => {
      const text = 'The family visits the natural museum to study animals.';
      const result = VocabularyExtractor.analyze(text, 'english');

      const cognates = result.vocabularyItems.filter(
        item => item.category === 'cognate'
      );

      expect(cognates.length).toBeGreaterThan(0);
    });

    it('should calculate category distribution', () => {
      const text = 'The students analyze important information about natural history.';
      const result = VocabularyExtractor.analyze(text, 'english');

      expect(result.categoryDistribution).toBeDefined();
      expect(typeof result.categoryDistribution.academic).toBe('number');
      expect(typeof result.categoryDistribution['high-frequency']).toBe('number');
    });

    it('should assign appropriate grade levels', () => {
      const text = 'I see a cat. The hypothesis requires comprehensive analysis.';
      const result = VocabularyExtractor.analyze(text, 'english');

      const simpleCat = result.vocabularyItems.find(item => item.word === 'cat');
      const complexHyp = result.vocabularyItems.find(item => item.word === 'hypothesis');

      if (simpleCat) {
        expect(simpleCat.gradeLevel).toBeLessThanOrEqual(2);
      }

      if (complexHyp) {
        expect(complexHyp.gradeLevel).toBeGreaterThanOrEqual(4);
      }
    });
  });

  describe('extractKeyVocabulary()', () => {
    it('should extract key academic vocabulary', () => {
      const text = 'Students analyze evidence to support their conclusions about the experiment.';
      const keyWords = VocabularyExtractor.extractKeyVocabulary(text, 'english', 5);

      expect(keyWords.length).toBeLessThanOrEqual(5);
      expect(keyWords.some(word =>
        word.category === 'academic' || word.category === 'tier-2'
      )).toBe(true);
    });

    it('should prioritize by importance and frequency', () => {
      const text = 'analyze analyze analyze the the students';
      const keyWords = VocabularyExtractor.extractKeyVocabulary(text, 'english', 3);

      expect(keyWords.length).toBeGreaterThan(0);
      // Should prioritize 'analyze' due to category + frequency
      expect(keyWords[0].word).toBe('analyze');
    });
  });

  describe('findCognates()', () => {
    it('should find cognates between Spanish and English', () => {
      const spanish = 'La familia visita el museo natural';
      const english = 'The family visits the natural museum';

      const cognates = VocabularyExtractor.findCognates(spanish, english);

      expect(cognates.length).toBeGreaterThan(0);
      expect(cognates.some(c => c.spanish === 'familia')).toBe(true);
      expect(cognates.some(c => c.spanish === 'natural')).toBe(true);
    });
  });

  describe('getStatistics()', () => {
    it('should calculate vocabulary statistics', () => {
      const text = 'Students analyze important scientific evidence every day.';
      const analysis = VocabularyExtractor.analyze(text, 'english');
      const stats = VocabularyExtractor.getStatistics(analysis);

      expect(stats.lexicalDiversity).toBeGreaterThan(0);
      expect(stats.lexicalDiversity).toBeLessThanOrEqual(1);
      expect(stats.academicDensity).toBeGreaterThanOrEqual(0);
      expect(stats.cognateDensity).toBeGreaterThanOrEqual(0);
    });

    it('should calculate cultural density for PR Spanish', () => {
      const text = 'Tomamos la guagua para ir a comprar mofongo y alcapurrias.';
      const analysis = VocabularyExtractor.analyze(text, 'spanish');
      const stats = VocabularyExtractor.getStatistics(analysis);

      expect(stats.culturalDensity).toBeGreaterThan(0);
    });
  });

  describe('Recommendations', () => {
    it('should provide recommendations for vocabulary instruction', () => {
      const text = 'the the the and and is is';
      const result = VocabularyExtractor.analyze(text, 'english');

      expect(result.recommendations).toBeDefined();
      expect(result.recommendations.length).toBeGreaterThan(0);
    });

    it('should recommend cognate highlighting for Spanish', () => {
      const text = 'Los estudiantes estudian ciencias.';
      const result = VocabularyExtractor.analyze(text, 'spanish');

      const cognateDensity = result.categoryDistribution.cognate / result.vocabularyItems.length;

      if (cognateDensity < 0.1) {
        expect(result.recommendations.some(r =>
          r.includes('cognate')
        )).toBe(true);
      }
    });
  });

  describe('Tier classification', () => {
    it('should classify Tier 1 words correctly', () => {
      const text = 'the and a to';
      const result = VocabularyExtractor.analyze(text, 'english');

      const tier1 = result.vocabularyItems.filter(
        item => item.category === 'high-frequency'
      );

      expect(tier1.length).toBe(4);
    });

    it('should classify Tier 2 words correctly', () => {
      const text = 'analyze justify formulate';
      const result = VocabularyExtractor.analyze(text, 'english');

      const tier2 = result.vocabularyItems.filter(
        item => item.category === 'tier-2' || item.category === 'academic'
      );

      expect(tier2.length).toBeGreaterThan(0);
    });
  });
});
