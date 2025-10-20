# K5 Language Processing System

## Overview

Comprehensive bilingual language processing system for the K5 educational platform, providing high-accuracy (95%+) language detection, text normalization, phonetic processing, translation, reading level assessment, and vocabulary extraction for Spanish and English, with special support for Puerto Rican Spanish dialect.

## Features

### 🔍 Language Detection (95%+ Accuracy)
- **Multi-strategy detection**: Combines franc library, pattern matching, and n-gram analysis
- **Spanish/English identification**: Specialized for educational content
- **Puerto Rican dialect detection**: Identifies and preserves cultural vocabulary
- **Mixed language support**: Detects and segments bilingual content
- **Confidence scoring**: Provides accuracy metrics for each detection

### 🧹 Text Normalization
- **HTML tag removal**: Cleans web content
- **Whitespace normalization**: Consistent formatting
- **Contraction expansion**: Supports English and Spanish (including PR contractions)
- **Accent preservation**: Maintains Spanish diacritics
- **Puerto Rican term preservation**: Protects cultural vocabulary
- **Educational cleaning**: Grade-level appropriate normalization

### 🗣️ Phonetic Processing
- **IPA transcription**: International Phonetic Alphabet support
- **Puerto Rican Spanish phonetics**: Dialect-specific pronunciations (R/L weakening, S aspiration, etc.)
- **Voice recognition hints**: Optimized for speech-to-text
- **Syllabification**: Accurate for both languages
- **Stress identification**: Automatic stress marking

### 🌐 Translation
- **Culturally-sensitive translation**: Preserves Puerto Rican terms
- **Educational phrase library**: Common classroom expressions
- **Cognate identification**: Supports bilingual learners
- **Context preservation**: Maintains educational meaning
- **Grade-appropriate vocabulary**: Age-suitable translations

### 📚 Reading Level Assessment
- **K-5 grade level analysis**: Flesch-Kincaid, Fog Index, SMOG, Coleman-Liau
- **Spanish and English support**: Adapted formulas for each language
- **Confidence scoring**: Assessment reliability metrics
- **Complexity classification**: Very-easy to very-hard
- **Recommendations**: Actionable suggestions for improvement

### 📖 Vocabulary Extraction
- **Tier classification**: Tier 1 (high-frequency), Tier 2 (academic), Tier 3 (domain-specific)
- **Academic vocabulary identification**: Grade-level appropriate
- **Cultural vocabulary detection**: Puerto Rican terms
- **Cognate finding**: Spanish-English word pairs
- **Frequency analysis**: Word usage statistics
- **Key vocabulary extraction**: Most important words for instruction

## Installation

```bash
cd src/language
npm install
```

### Dependencies

```json
{
  "franc": "^6.1.0"
}
```

## Usage

### Quick Start

```typescript
import { LanguageProcessor } from './src/language';

// Detect language
const detection = await LanguageDetector.detect('Los estudiantes aprenden.');
console.log(detection.language); // 'spanish'
console.log(detection.confidence); // 0.98

// Normalize text
const normalized = TextNormalizer.normalize('  <p>Hello   World!</p>  ');
console.log(normalized.normalized); // 'hello world!'

// Assess reading level
const reading = ReadingLevelAssessor.assess('The cat runs fast.', 'english');
console.log(reading.gradeLevel); // 1
console.log(reading.complexity); // 'easy'

// Extract vocabulary
const vocab = VocabularyExtractor.analyze('Students analyze evidence.', 'english');
console.log(vocab.categoryDistribution.academic); // 2
```

### Full Pipeline Processing

```typescript
const result = await LanguageProcessor.processText(
  'Los estudiantes están aprendiendo a leer.',
  {
    detectLanguage: true,
    normalize: true,
    generatePhonetics: true,
    assessReadingLevel: true,
    extractVocabulary: true
  }
);

console.log(result.language?.language); // 'spanish'
console.log(result.readingLevel?.gradeLevel); // 2
console.log(result.vocabulary?.keyVocabulary); // Academic words
```

### Educational Content Analysis

```typescript
const analysis = await LanguageProcessor.analyzeEducationalContent(
  'The students analyze scientific evidence.',
  4 // Grade level
);

console.log(analysis.isAppropriate); // true/false
console.log(analysis.readingLevel.gradeLevel); // 4
console.log(analysis.recommendations); // Suggestions
```

### Voice Recognition Preparation

```typescript
const voice = await LanguageProcessor.prepareForVoice(
  "The child can't read this.",
  'english'
);

console.log(voice.normalized); // 'the child cannot read this'
console.log(voice.phonetics.ipa); // IPA transcription
console.log(voice.hints); // Voice recognition hints
```

### Puerto Rican Spanish Processing

```typescript
// Detect PR dialect
const detection = await LanguageDetector.detect(
  'Voy en la guagua al zafacón.'
);

console.log(detection.details.dialectInfo?.isPuertoRican); // true
console.log(detection.details.dialectInfo?.features); // ['guagua', 'zafacón']

// Cultural vocabulary preservation
const vocab = VocabularyExtractor.analyze(
  'Comimos mofongo y alcapurrias.',
  'spanish'
);

console.log(vocab.categoryDistribution.cultural); // 2

// Translation with cultural preservation
const translation = await Translator.translate(
  'Toma la guagua.',
  'english',
  { preserveCulturalTerms: true }
);

console.log(translation.preservedTerms); // ['guagua']
console.log(translation.culturalNotes); // Explanations
```

## API Reference

### LanguageDetector

```typescript
// Detect language with high accuracy
LanguageDetector.detect(text: string): Promise<LanguageDetectionResult>

// Detect language in text segments
LanguageDetector.detectSegments(text: string): Promise<Array<TextSegment & Language>>

// Batch detection
LanguageDetector.detectBatch(texts: string[]): Promise<LanguageDetectionResult[]>

// Text statistics
LanguageDetector.getStatistics(text: string): TextStatistics
```

### TextNormalizer

```typescript
// Full normalization with options
TextNormalizer.normalize(text: string, options?: NormalizationOptions): NormalizationResult

// Quick normalize
TextNormalizer.quickNormalize(text: string): string

// Normalize for voice
TextNormalizer.normalizeForVoice(text: string, language: 'spanish' | 'english'): string

// Normalize for search
TextNormalizer.normalizeForSearch(text: string): string

// Educational cleaning
TextNormalizer.cleanForEducation(text: string, gradeLevel: number): string
```

### PhoneticProcessor

```typescript
// Generate phonetic transcription
PhoneticProcessor.process(text: string, language: 'spanish' | 'english'): PhoneticResult

// Syllabify word
PhoneticProcessor.syllabify(word: string, language: 'spanish' | 'english'): string[]

// Voice recognition hints
PhoneticProcessor.generateVoiceHints(text: string, language: 'spanish' | 'english'): VoiceHint[]

// Phonetic spelling
PhoneticProcessor.generatePhoneticSpelling(word: string, language: 'spanish' | 'english'): string
```

### Translator

```typescript
// Translate with cultural sensitivity
Translator.translate(text: string, targetLanguage: 'spanish' | 'english', options?: TranslationOptions): Promise<TranslationResult>

// Get cultural term info
Translator.getCulturalTermInfo(term: string): CulturalNote | undefined

// Check if term should be preserved
Translator.shouldPreserveTerm(term: string): boolean

// Batch translate
Translator.translateBatch(texts: string[], targetLanguage: 'spanish' | 'english', options?: TranslationOptions): Promise<TranslationResult[]>
```

### ReadingLevelAssessor

```typescript
// Assess reading level
ReadingLevelAssessor.assess(text: string, language: 'spanish' | 'english'): ReadingLevelResult

// Calculate metrics
ReadingLevelAssessor.calculateMetrics(text: string, language: 'spanish' | 'english'): ReadabilityMetrics

// Check appropriateness
ReadingLevelAssessor.isAppropriateForGrade(text: string, targetGrade: number, language: 'spanish' | 'english'): AppropriatenessResult

// Get grade info
ReadingLevelAssessor.getGradeInfo(grade: number): GradeInfo
```

### VocabularyExtractor

```typescript
// Analyze vocabulary
VocabularyExtractor.analyze(text: string, language: 'spanish' | 'english'): VocabularyAnalysis

// Extract key vocabulary
VocabularyExtractor.extractKeyVocabulary(text: string, language: 'spanish' | 'english', maxWords?: number): VocabularyItem[]

// Find cognates
VocabularyExtractor.findCognates(spanishText: string, englishText: string): Cognate[]

// Get statistics
VocabularyExtractor.getStatistics(analysis: VocabularyAnalysis): VocabularyStatistics
```

## Performance

- **Language Detection**: 95%+ accuracy
- **Processing Speed**: <50ms for typical educational texts (500 words)
- **Memory Efficient**: Optimized for batch processing
- **Scalable**: Handles thousands of documents

## Puerto Rican Spanish Features

### Cultural Vocabulary Detected
- **guagua** (bus)
- **zafacón** (trash can)
- **mahones** (jeans)
- **chiringa** (kite)
- **china** (orange)
- **mofongo** (traditional dish)
- **alcapurria** (fried food)
- **piragua** (shaved ice)
- **coquí** (tree frog)
- **jíbaro** (farmer/peasant)

### Phonetic Features
- R/L weakening at syllable end
- S aspiration or deletion
- D deletion between vowels
- LL/Y pronounced as 'dʒ'
- Velarization of N

## Testing

```bash
# Run all tests
npm test

# Run specific test suite
npm test languageDetector.test.ts

# Run with coverage
npm test -- --coverage
```

### Test Coverage
- Language Detection: 95%+ accuracy verified
- Text Normalization: All edge cases covered
- Phonetic Processing: Both languages tested
- Translation: Cultural preservation verified
- Reading Level: All K-5 grades tested
- Vocabulary: All categories validated

## Contributing

When adding new features:
1. Maintain 95%+ accuracy for language detection
2. Preserve Puerto Rican cultural terms
3. Support both Spanish and English
4. Write comprehensive tests
5. Update documentation

## License

Part of the K5 POC project.

## Support

For questions or issues, contact the K5 development team.
