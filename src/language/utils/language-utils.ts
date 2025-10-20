/**
 * Language Processing Utilities
 * Helper functions for language processing tasks
 */

import { type SupportedLanguage } from '../config/language-config';

/**
 * Normalize Unicode text
 */
export function normalizeUnicode(text: string): string {
  return text.normalize('NFC'); // Canonical composition
}

/**
 * Remove diacritics while preserving ñ
 */
export function removeDiacritics(text: string, preserveN: boolean = true): string {
  let normalized = text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  if (preserveN) {
    // Restore ñ
    normalized = normalized.replace(/n\u0303/g, 'ñ');
  }

  return normalized;
}

/**
 * Convert text to lowercase while preserving special characters
 */
export function safeToLowerCase(text: string): string {
  return text.toLowerCase();
}

/**
 * Convert text to uppercase while preserving special characters
 */
export function safeToUpperCase(text: string): string {
  return text.toUpperCase();
}

/**
 * Capitalize first letter of each sentence
 */
export function capitalizeFirstLetters(text: string): string {
  return text.replace(/(^|[.!?¿¡]\s+)([a-záéíóúüñ])/gi, (match, separator, letter) => {
    return separator + letter.toUpperCase();
  });
}

/**
 * Count words in text
 */
export function countWords(text: string): number {
  return text.split(/\s+/).filter(word => /\p{L}+/u.test(word)).length;
}

/**
 * Count sentences in text
 */
export function countSentences(text: string): number {
  return (text.match(/[.!?¿¡]+/g) || []).length;
}

/**
 * Calculate average word length
 */
export function averageWordLength(text: string): number {
  const words = text.split(/\s+/).filter(word => /\p{L}+/u.test(word));
  if (words.length === 0) return 0;

  const totalLength = words.reduce((sum, word) => sum + word.length, 0);
  return totalLength / words.length;
}

/**
 * Extract words from text
 */
export function extractWords(text: string): string[] {
  return text.match(/\p{L}+/gu) || [];
}

/**
 * Extract sentences from text
 */
export function extractSentences(text: string): string[] {
  return text.split(/[.!?]+/).filter(s => s.trim().length > 0);
}

/**
 * Check if text contains Spanish characters
 */
export function hasSpanishCharacters(text: string): boolean {
  return /[áéíóúüñ¿¡]/i.test(text);
}

/**
 * Check if text is likely Spanish
 */
export function isLikelySpanish(text: string): boolean {
  const spanishIndicators = /\b(el|la|los|las|un|una|de|en|que|es|por|para)\b/gi;
  const matches = (text.match(spanishIndicators) || []).length;
  const words = countWords(text);

  return words > 0 && (matches / words) > 0.15;
}

/**
 * Check if text is likely English
 */
export function isLikelyEnglish(text: string): boolean {
  const englishIndicators = /\b(the|a|an|is|are|was|were|to|of|and|in|that)\b/gi;
  const matches = (text.match(englishIndicators) || []).length;
  const words = countWords(text);

  return words > 0 && (matches / words) > 0.15;
}

/**
 * Truncate text to specified length
 */
export function truncateText(text: string, maxLength: number, ellipsis: string = '...'): string {
  if (text.length <= maxLength) return text;

  return text.substring(0, maxLength - ellipsis.length) + ellipsis;
}

/**
 * Truncate to complete sentences
 */
export function truncateToSentences(text: string, maxSentences: number): string {
  const sentences = extractSentences(text);
  return sentences.slice(0, maxSentences).join('. ') + (sentences.length > maxSentences ? '.' : '');
}

/**
 * Clean whitespace
 */
export function cleanWhitespace(text: string): string {
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\t/g, ' ')
    .replace(/ +/g, ' ')
    .replace(/\n\n+/g, '\n\n')
    .trim();
}

/**
 * Escape special regex characters
 */
export function escapeRegex(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Calculate text similarity (Jaccard similarity)
 */
export function calculateSimilarity(text1: string, text2: string): number {
  const words1 = new Set(extractWords(text1.toLowerCase()));
  const words2 = new Set(extractWords(text2.toLowerCase()));

  const intersection = new Set([...words1].filter(w => words2.has(w)));
  const union = new Set([...words1, ...words2]);

  return union.size > 0 ? intersection.size / union.size : 0;
}

/**
 * Get language name
 */
export function getLanguageName(code: SupportedLanguage, native: boolean = false): string {
  const names: Record<SupportedLanguage, { en: string; native: string }> = {
    'en': { en: 'English', native: 'English' },
    'es': { en: 'Spanish', native: 'Español' },
    'es-PR': { en: 'Puerto Rican Spanish', native: 'Español Puertorriqueño' }
  };

  return native ? names[code].native : names[code].en;
}

/**
 * Format language detection confidence as percentage
 */
export function formatConfidence(confidence: number): string {
  return `${(confidence * 100).toFixed(1)}%`;
}

/**
 * Check if text contains code-switching
 */
export function hasCodeSwitching(text: string): boolean {
  return isLikelySpanish(text) && isLikelyEnglish(text);
}

export default {
  normalizeUnicode,
  removeDiacritics,
  safeToLowerCase,
  safeToUpperCase,
  capitalizeFirstLetters,
  countWords,
  countSentences,
  averageWordLength,
  extractWords,
  extractSentences,
  hasSpanishCharacters,
  isLikelySpanish,
  isLikelyEnglish,
  truncateText,
  truncateToSentences,
  cleanWhitespace,
  escapeRegex,
  calculateSimilarity,
  getLanguageName,
  formatConfidence,
  hasCodeSwitching
};
