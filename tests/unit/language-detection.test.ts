/**
 * Unit Tests for Language Detection
 * Tests language detection precision, bilingual content handling
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { detectLanguage, detectMixedLanguages, calculateLanguageConfidence, detectDialect } from '@/services/pdf/languageDetection';

describe('Language Detection', () => {
  describe('detectLanguage', () => {
    it('should detect English text', () => {
      const text = 'The quick brown fox jumps over the lazy dog.';
      const result = detectLanguage(text);

      expect(result.language).toBe('en-US');
      expect(result.confidence).toBeGreaterThan(0.9);
    });

    it('should detect Spanish text', () => {
      const text = 'El rápido zorro marrón salta sobre el perro perezoso.';
      const result = detectLanguage(text);

      expect(result.language).toBe('es');
      expect(result.confidence).toBeGreaterThan(0.9);
    });

    it('should detect Puerto Rican Spanish dialect', () => {
      const text = 'Vamos pa\' la playa a pasarla bien chévere.';
      const result = detectLanguage(text);

      expect(result.language).toBe('es');
      expect(result.dialect).toBe('es-PR');
      expect(result.confidence).toBeGreaterThan(0.8);
    });

    it('should handle short text snippets', () => {
      const text = 'Hola';
      const result = detectLanguage(text);

      expect(result.language).toBe('es');
      expect(result.confidence).toBeLessThan(0.8); // Lower confidence for short text
    });

    it('should detect language with special characters', () => {
      const text = '¿Cómo estás? ¡Muy bien!';
      const result = detectLanguage(text);

      expect(result.language).toBe('es');
      expect(result.confidence).toBeGreaterThan(0.9);
    });

    it('should handle empty text', () => {
      const result = detectLanguage('');

      expect(result.language).toBe('unknown');
      expect(result.confidence).toBe(0);
    });

    it('should handle numbers and symbols only', () => {
      const text = '123 456 789 !@#$%';
      const result = detectLanguage(text);

      expect(result.language).toBe('unknown');
      expect(result.confidence).toBeLessThan(0.3);
    });
  });

  describe('detectMixedLanguages', () => {
    it('should detect bilingual Spanish-English content', () => {
      const text = 'Today we learned about el ciclo del agua (water cycle). Es muy importante.';
      const result = detectMixedLanguages(text);

      expect(result.isMixed).toBe(true);
      expect(result.languages).toContain('en-US');
      expect(result.languages).toContain('es');
      expect(result.primaryLanguage).toBe('en-US'); // More English words
    });

    it('should identify language sections', () => {
      const text = 'The cat is on the table. El gato está en la mesa.';
      const result = detectMixedLanguages(text);

      expect(result.sections).toHaveLength(2);
      expect(result.sections[0].language).toBe('en-US');
      expect(result.sections[1].language).toBe('es');
    });

    it('should calculate language distribution', () => {
      const text = 'Hello world. Hola mundo. How are you? ¿Cómo estás? Good morning.';
      const result = detectMixedLanguages(text);

      expect(result.distribution['en-US']).toBeGreaterThan(0.5);
      expect(result.distribution['es']).toBeLessThan(0.5);
      expect(result.distribution['en-US'] + result.distribution['es']).toBeCloseTo(1, 1);
    });

    it('should detect code-switching patterns', () => {
      const text = 'Voy a la store para comprar some groceries.';
      const result = detectMixedLanguages(text);

      expect(result.isMixed).toBe(true);
      expect(result.hasCodeSwitching).toBe(true);
      expect(result.switchingPattern).toBe('intra-sentential');
    });

    it('should handle single language text', () => {
      const text = 'This is purely English text with no Spanish.';
      const result = detectMixedLanguages(text);

      expect(result.isMixed).toBe(false);
      expect(result.languages).toHaveLength(1);
      expect(result.languages[0]).toBe('en-US');
    });
  });

  describe('calculateLanguageConfidence', () => {
    it('should calculate high confidence for clear language markers', () => {
      const spanishMarkers = ['el', 'la', 'de', 'que', 'es', 'está'];
      const confidence = calculateLanguageConfidence('es', spanishMarkers);

      expect(confidence).toBeGreaterThan(0.9);
    });

    it('should calculate medium confidence for ambiguous text', () => {
      const ambiguousWords = ['animal', 'color', 'hotel', 'banana'];
      const confidence = calculateLanguageConfidence('es', ambiguousWords);

      expect(confidence).toBeGreaterThan(0.5);
      expect(confidence).toBeLessThan(0.8);
    });

    it('should calculate low confidence for non-language content', () => {
      const numbers = ['123', '456', '789'];
      const confidence = calculateLanguageConfidence('es', numbers);

      expect(confidence).toBeLessThan(0.3);
    });

    it('should boost confidence with punctuation patterns', () => {
      const textWithQuestions = '¿Cómo? ¿Qué? ¿Cuándo?';
      const result = detectLanguage(textWithQuestions);

      expect(result.confidence).toBeGreaterThan(0.95);
    });
  });

  describe('detectDialect', () => {
    it('should detect Puerto Rican Spanish markers', () => {
      const prText = 'Mira, vamos pa\'l campo a comer mofongo bien chévere.';
      const result = detectDialect(prText, 'es');

      expect(result.dialect).toBe('es-PR');
      expect(result.markers).toContain('pa\'l');
      expect(result.markers).toContain('chévere');
    });

    it('should detect Mexican Spanish', () => {
      const mxText = 'Órale güey, vamos al changarro.';
      const result = detectDialect(mxText, 'es');

      expect(result.dialect).toBe('es-MX');
    });

    it('should detect standard Spanish', () => {
      const standardText = 'Buenos días. ¿Cómo está usted?';
      const result = detectDialect(standardText, 'es');

      expect(result.dialect).toBe('es');
      expect(result.dialectConfidence).toBeGreaterThan(0.7);
    });

    it('should detect US English', () => {
      const usText = 'The color of the truck was gray.';
      const result = detectDialect(usText, 'en');

      expect(result.dialect).toBe('en-US');
    });

    it('should detect British English', () => {
      const gbText = 'The colour of the lorry was grey.';
      const result = detectDialect(gbText, 'en');

      expect(result.dialect).toBe('en-GB');
    });
  });

  describe('Grade-Level Language Patterns', () => {
    it('should identify Kindergarten-level text', () => {
      const kText = 'Cat. Dog. See the cat. See the dog.';
      const result = detectLanguage(kText);

      expect(result.gradeLevel).toBe('K');
      expect(result.complexity).toBe('simple');
    });

    it('should identify 3rd grade-level text', () => {
      const grade3Text = 'The ancient tree stood majestically in the forest, providing shelter for many animals.';
      const result = detectLanguage(grade3Text);

      expect(result.gradeLevel).toBe('3');
      expect(result.complexity).toBe('intermediate');
    });

    it('should identify 5th grade-level text', () => {
      const grade5Text = 'Photosynthesis is the process by which plants convert sunlight into chemical energy, demonstrating remarkable efficiency.';
      const result = detectLanguage(grade5Text);

      expect(result.gradeLevel).toBe('5');
      expect(result.complexity).toBe('advanced');
    });
  });

  describe('Performance', () => {
    it('should detect language in short text under 10ms', () => {
      const text = 'Quick test';

      const start = performance.now();
      detectLanguage(text);
      const duration = performance.now() - start;

      expect(duration).toBeLessThan(10);
    });

    it('should detect language in 1000-word text under 100ms', () => {
      const text = 'word '.repeat(1000);

      const start = performance.now();
      detectLanguage(text);
      const duration = performance.now() - start;

      expect(duration).toBeLessThan(100);
    });

    it('should detect mixed languages under 200ms', () => {
      const text = 'English word. Spanish palabra. '.repeat(100);

      const start = performance.now();
      detectMixedLanguages(text);
      const duration = performance.now() - start;

      expect(duration).toBeLessThan(200);
    });
  });

  describe('Accuracy Requirements', () => {
    it('should achieve >99% accuracy on pure Spanish', () => {
      const spanishTexts = [
        'El sol brilla en el cielo azul.',
        'Los niños juegan en el parque.',
        'Mi madre cocina comida deliciosa.',
        'El perro corre rápidamente.'
      ];

      const results = spanishTexts.map(text => detectLanguage(text));
      const correctDetections = results.filter(r => r.language === 'es').length;
      const accuracy = correctDetections / spanishTexts.length;

      expect(accuracy).toBeGreaterThanOrEqual(0.99);
    });

    it('should achieve >99% accuracy on pure English', () => {
      const englishTexts = [
        'The sun shines in the blue sky.',
        'Children play in the park.',
        'My mother cooks delicious food.',
        'The dog runs quickly.'
      ];

      const results = englishTexts.map(text => detectLanguage(text));
      const correctDetections = results.filter(r => r.language === 'en-US').length;
      const accuracy = correctDetections / englishTexts.length;

      expect(accuracy).toBeGreaterThanOrEqual(0.99);
    });

    it('should achieve >95% accuracy on mixed content', () => {
      const mixedTexts = [
        'The gato is sleeping.',
        'Vamos a la store.',
        'My amigo is coming.',
        'Let\'s go al parque.'
      ];

      const results = mixedTexts.map(text => detectMixedLanguages(text));
      const correctDetections = results.filter(r => r.isMixed).length;
      const accuracy = correctDetections / mixedTexts.length;

      expect(accuracy).toBeGreaterThanOrEqual(0.95);
    });
  });

  describe('Edge Cases', () => {
    it('should handle text with only punctuation', () => {
      const result = detectLanguage('¡!¿?,.;:');

      expect(result.language).toBe('unknown');
    });

    it('should handle extremely long words', () => {
      const text = 'supercalifragilisticexpialidocious';
      const result = detectLanguage(text);

      expect(result.language).toBe('en-US');
    });

    it('should handle multilingual names', () => {
      const text = 'José García meets John Smith';
      const result = detectMixedLanguages(text);

      expect(result.isMixed).toBe(true);
    });

    it('should handle technical vocabulary', () => {
      const text = 'HTTP protocol AJAX JSON API';
      const result = detectLanguage(text);

      expect(result.confidence).toBeLessThan(0.6); // Technical terms are ambiguous
    });
  });
});
