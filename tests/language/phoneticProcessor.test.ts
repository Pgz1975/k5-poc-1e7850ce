/**
 * Phonetic Processor Tests
 */

import { describe, it, expect } from '@jest/globals';
import { PhoneticProcessor } from '../../src/language/phonetic/phoneticProcessor';

describe('PhoneticProcessor', () => {
  describe('process()', () => {
    it('should generate phonetic transcription for English', () => {
      const text = 'The cat sits.';
      const result = PhoneticProcessor.process(text, 'english');

      expect(result.language).toBe('english');
      expect(result.phonetic).toBeDefined();
      expect(result.syllables.length).toBeGreaterThan(0);
    });

    it('should generate phonetic transcription for Spanish', () => {
      const text = 'El gato come.';
      const result = PhoneticProcessor.process(text, 'spanish');

      expect(result.language).toBe('spanish');
      expect(result.phonetic).toBeDefined();
      expect(result.syllables.length).toBeGreaterThan(0);
    });

    it('should handle Puerto Rican Spanish features', () => {
      const text = 'Los nenes juegan.';
      const result = PhoneticProcessor.process(text, 'spanish');

      expect(result.phonetic).toBeDefined();
      expect(result.hints.length).toBeGreaterThan(0);
    });

    it('should identify stressed syllables', () => {
      const text = 'español';
      const result = PhoneticProcessor.process(text, 'spanish');

      expect(result.stress.length).toBeGreaterThan(0);
    });
  });

  describe('syllabify()', () => {
    it('should syllabify Spanish words correctly', () => {
      const syllables = PhoneticProcessor.syllabify('estudiante', 'spanish');

      expect(syllables.length).toBeGreaterThan(1);
      expect(syllables.join('-')).toBe('es-tu-dian-te');
    });

    it('should syllabify English words correctly', () => {
      const syllables = PhoneticProcessor.syllabify('student', 'english');

      expect(syllables.length).toBeGreaterThan(1);
    });
  });

  describe('generateVoiceHints()', () => {
    it('should generate hints for English', () => {
      const hints = PhoneticProcessor.generateVoiceHints('beautiful', 'english');

      expect(hints.length).toBeGreaterThan(0);
      expect(hints[0].word).toBe('beautiful');
      expect(hints[0].pronunciation).toBeDefined();
    });

    it('should generate hints for Spanish', () => {
      const hints = PhoneticProcessor.generateVoiceHints('hermoso', 'spanish');

      expect(hints.length).toBeGreaterThan(0);
      expect(hints[0].word).toBe('hermoso');
    });

    it('should assess pronunciation difficulty', () => {
      const hints = PhoneticProcessor.generateVoiceHints('extraordinarily', 'english');

      expect(hints[0].difficulty).toBe('hard');
    });
  });

  describe('generatePhoneticSpelling()', () => {
    it('should generate phonetic spelling with stress', () => {
      const spelling = PhoneticProcessor.generatePhoneticSpelling('español', 'spanish');

      expect(spelling).toContain('-');
      expect(spelling.toUpperCase()).toContain('ÑOL'); // Stressed syllable
    });
  });
});
