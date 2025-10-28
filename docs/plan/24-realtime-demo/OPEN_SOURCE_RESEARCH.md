# Open Source Research - Speech-to-Text & Reading Tools
## Libraries and Tools for Realtime Demo Implementation

**Document Version:** 1.0
**Last Updated:** October 28, 2025
**Research Focus:** Production-ready, well-maintained libraries

---

## 🎯 Research Objectives

Find battle-tested open-source solutions for:
1. **Word-level speech-to-text** with timestamps
2. **Real-time word highlighting** synchronized with speech
3. **Pronunciation assessment** tools
4. **Fuzzy string matching** for transcription
5. **Reading metrics** calculation (WCPM, fluency)
6. **Audio visualization** components

---

## 🎤 Speech-to-Text Libraries

### 1. **Web Speech API** (Native Browser)
**URL:** https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API
**License:** W3C Standard (Free)
**Relevance:** ⭐⭐⭐⭐☆ (4/5)

**Pros:**
- ✅ Native browser support (Chrome, Edge, Safari)
- ✅ Real-time transcription with continuous mode
- ✅ No API costs
- ✅ Language support including Spanish
- ✅ Confidence scores available
- ✅ Simple integration

**Cons:**
- ❌ No word-level timestamps (sentence-level only)
- ❌ Limited to browser environment
- ❌ Varying quality across browsers
- ❌ No offline support

**Implementation Example:**
```javascript
const recognition = new webkitSpeechRecognition();
recognition.continuous = true;
recognition.interimResults = true;
recognition.lang = 'es-PR';

recognition.onresult = (event) => {
  for (let i = event.resultIndex; i < event.results.length; i++) {
    const transcript = event.results[i][0].transcript;
    const confidence = event.results[i][0].confidence;
    const isFinal = event.results[i].isFinal;

    // Process transcript
    if (isFinal) {
      handleFinalTranscript(transcript, confidence);
    }
  }
};
```

**Recommendation:** Use as **fallback** if OpenAI Realtime API transcription fails.

---

### 2. **Whisper.cpp** (Local Inference)
**URL:** https://github.com/ggerganov/whisper.cpp
**License:** MIT
**Relevance:** ⭐⭐⭐☆☆ (3/5)

**Pros:**
- ✅ OpenAI Whisper model in C++ (fast)
- ✅ Word-level timestamps available
- ✅ High accuracy (especially for Spanish)
- ✅ Can run in browser via WASM
- ✅ Offline capable

**Cons:**
- ❌ Requires model download (~140MB for base model)
- ❌ Initial load time
- ❌ Higher computational requirements
- ❌ Not real-time (post-processing)

**Use Case:** Offline demo mode or pronunciation analysis enhancement.

---

### 3. **@huggingface/transformers** (JS Library)
**URL:** https://github.com/xenova/transformers.js
**License:** Apache 2.0
**Relevance:** ⭐⭐⭐⭐☆ (4/5)

**Pros:**
- ✅ Already in project dependencies!
- ✅ Whisper models in browser
- ✅ Word-level timestamps
- ✅ Extensive model library
- ✅ TypeScript support

**Cons:**
- ❌ Large model sizes
- ❌ Slower than native solutions
- ❌ Not real-time (batch processing)

**Implementation Example:**
```typescript
import { pipeline } from '@huggingface/transformers';

const transcriber = await pipeline('automatic-speech-recognition', 'Xenova/whisper-tiny');

const result = await transcriber(audioData, {
  return_timestamps: 'word',
  language: 'spanish'
});

console.log(result);
// {
//   text: "hola mundo",
//   chunks: [
//     { text: "hola", timestamp: [0.0, 0.5] },
//     { text: "mundo", timestamp: [0.6, 1.2] }
//   ]
// }
```

**Recommendation:** Use for **pronunciation analysis** after recording, not real-time.

---

## 📖 Word Highlighting & Synchronization

### 1. **react-textfit** (Text Fitting)
**URL:** https://github.com/malte-wessel/react-textfit
**License:** MIT
**Relevance:** ⭐⭐☆☆☆ (2/5)

**Pros:**
- ✅ Responsive text sizing
- ✅ React integration

**Cons:**
- ❌ No highlighting features
- ❌ Not designed for reading

**Recommendation:** Skip - not needed for our use case.

---

### 2. **Custom Implementation with React State**
**Relevance:** ⭐⭐⭐⭐⭐ (5/5)

**Approach:**
```typescript
// Split passage into words with unique IDs
const words = passage.split(/\s+/).map((word, index) => ({
  id: index,
  text: word,
  state: 'pending' // 'pending' | 'correct' | 'error' | 'skipped' | 'current'
}));

// Render with conditional styling
{words.map(word => (
  <span
    key={word.id}
    className={cn({
      'bg-gray-100': word.state === 'pending',
      'bg-green-200': word.state === 'correct',
      'bg-red-200': word.state === 'error',
      'bg-yellow-200': word.state === 'skipped',
      'ring-4 ring-blue-400 scale-110': word.state === 'current'
    })}
  >
    {word.text}
  </span>
))}
```

**Recommendation:** ✅ **Use custom implementation** - full control, no dependencies.

---

### 3. **AutoScroll with `scrollIntoView`**
**Relevance:** ⭐⭐⭐⭐⭐ (5/5)

```typescript
function scrollToWord(wordId: number) {
  const element = document.getElementById(`word-${wordId}`);
  element?.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
    inline: 'nearest'
  });
}
```

**Recommendation:** ✅ **Use native browser API** - smooth, performant, no dependencies.

---

## 🔊 Pronunciation Assessment

### 1. **pronounce-js** (Phonetic Comparison)
**URL:** https://github.com/jantimon/pronounce
**License:** MIT
**Relevance:** ⭐⭐☆☆☆ (2/5)

**Status:** Archived, no longer maintained.
**Recommendation:** ❌ Skip.

---

### 2. **Levenshtein Distance Algorithms**
**URL:** https://github.com/gustf/js-levenshtein
**License:** MIT
**Relevance:** ⭐⭐⭐⭐⭐ (5/5)

**Pros:**
- ✅ Tiny library (~500 bytes)
- ✅ Fast implementation
- ✅ Perfect for fuzzy matching
- ✅ Well-tested

**Implementation:**
```typescript
import levenshtein from 'js-levenshtein';

function fuzzyMatch(spoken: string, expected: string): number {
  const distance = levenshtein(spoken.toLowerCase(), expected.toLowerCase());
  const maxLength = Math.max(spoken.length, expected.length);
  return 1 - (distance / maxLength);
}

// Usage
const score = fuzzyMatch('perro', 'pero'); // 0.8 (80% match)
```

**Recommendation:** ✅ **Use for pronunciation matching** in ReadFlow and Pronunciation demos.

---

### 3. **Soundex / Metaphone Algorithms**
**URL:** https://github.com/words/natural-soundex
**License:** MIT
**Relevance:** ⭐⭐⭐☆☆ (3/5)

**Use Case:** Phonetic similarity for English words
**Spanish Support:** Limited

**Recommendation:** ⚠️ Consider for English content only.

---

## 🎨 Audio Visualization

### 1. **Canvas API** (Native)
**URL:** https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API
**License:** W3C Standard
**Relevance:** ⭐⭐⭐⭐⭐ (5/5)

**Implementation:**
```typescript
function drawWaveform(canvas: HTMLCanvasElement, frequencyData: Uint8Array) {
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  const barWidth = width / frequencyData.length;

  ctx.clearRect(0, 0, width, height);

  for (let i = 0; i < frequencyData.length; i++) {
    const value = frequencyData[i];
    const barHeight = (value / 255) * height;
    const x = i * barWidth;
    const y = (height - barHeight) / 2;

    ctx.fillStyle = `hsl(${200 + value / 2}, 70%, 60%)`;
    ctx.fillRect(x, y, barWidth, barHeight);
  }
}
```

**Recommendation:** ✅ **Use native Canvas** - performant, no dependencies.

---

### 2. **wavesurfer.js**
**URL:** https://github.com/wavesurfer-js/wavesurfer.js
**License:** BSD-3-Clause
**Relevance:** ⭐⭐⭐☆☆ (3/5)

**Pros:**
- ✅ Beautiful visualizations
- ✅ Waveform rendering
- ✅ Interactive timeline

**Cons:**
- ❌ 50KB+ library
- ❌ Designed for audio playback, not live input
- ❌ Overkill for our needs

**Recommendation:** ⚠️ Skip - custom Canvas is lighter and more flexible.

---

## 📊 Reading Metrics & Analytics

### 1. **Custom WCPM Calculator**
**Relevance:** ⭐⭐⭐⭐⭐ (5/5)

```typescript
interface ReadingMetrics {
  wordsCorrect: number;
  wordsTotal: number;
  elapsedSeconds: number;
}

function calculateWCPM(metrics: ReadingMetrics): number {
  const minutes = metrics.elapsedSeconds / 60;
  return Math.round(metrics.wordsCorrect / minutes);
}

function calculateAccuracy(correct: number, total: number): number {
  return total > 0 ? correct / total : 0;
}

function calculateFluencyScore(wcpm: number, accuracy: number, targetWCPM: number): number {
  const speedScore = Math.min(wcpm / targetWCPM, 1) * 100;
  const accuracyScore = accuracy * 100;

  return (speedScore * 0.3) + (accuracyScore * 0.7); // 30% speed, 70% accuracy
}
```

**Recommendation:** ✅ **Implement custom** - simple, tailored to our needs.

---

### 2. **reading-level** (Flesch-Kincaid, etc.)
**URL:** https://github.com/words/reading-level
**License:** MIT
**Relevance:** ⭐⭐☆☆☆ (2/5)

**Use Case:** Text complexity analysis (not real-time metrics)
**Recommendation:** ⚠️ Optional - useful for content creation, not demo runtime.

---

## 🧪 Testing Libraries

### 1. **@testing-library/react**
**URL:** https://testing-library.com/docs/react-testing-library/intro
**License:** MIT
**Relevance:** ⭐⭐⭐⭐⭐ (5/5)

**Already in project dependencies** (via Vite/React template)

**Use Cases:**
- Component rendering tests
- User interaction simulation
- Accessibility testing

**Recommendation:** ✅ **Use for demo component tests**.

---

### 2. **Mock Audio APIs**
**URL:** https://github.com/goldfire/howler.js (for reference)
**License:** MIT
**Relevance:** ⭐⭐⭐⭐☆ (4/5)

**Mock Implementation:**
```typescript
// Mock getUserMedia for tests
global.navigator.mediaDevices = {
  getUserMedia: vi.fn().mockResolvedValue({
    getTracks: () => [
      {
        kind: 'audio',
        stop: vi.fn()
      }
    ]
  } as any)
};

// Mock AudioContext
global.AudioContext = vi.fn(() => ({
  createAnalyser: vi.fn(() => ({
    fftSize: 256,
    frequencyBinCount: 128,
    getByteFrequencyData: vi.fn()
  })),
  createMediaStreamSource: vi.fn(),
  sampleRate: 24000
})) as any;
```

**Recommendation:** ✅ **Implement mocks** for unit tests.

---

## 🎯 Function Calling & Voice Commands

### 1. **Natural Language Command Parser**
**URL:** https://github.com/spencermountain/compromise
**License:** MIT
**Relevance:** ⭐⭐⭐☆☆ (3/5)

**Pros:**
- ✅ Lightweight NLP library
- ✅ Verb/noun extraction
- ✅ Spanish support (via plugin)

**Cons:**
- ❌ Not needed if using OpenAI function calling
- ❌ Adds complexity

**Recommendation:** ⚠️ Skip - OpenAI handles this natively via function calling.

---

### 2. **Command Pattern with OpenAI Functions**
**Relevance:** ⭐⭐⭐⭐⭐ (5/5)

```typescript
const voiceCommandTools = [
  {
    type: 'function',
    name: 'move_item',
    description: 'Move a draggable item to a target zone',
    parameters: {
      type: 'object',
      properties: {
        item: {
          type: 'string',
          enum: ['sun', 'cloud', 'tree', 'flower'],
          description: 'The item to move'
        },
        zone: {
          type: 'string',
          enum: ['sky', 'ground'],
          description: 'Target zone'
        }
      },
      required: ['item', 'zone']
    }
  },
  {
    type: 'function',
    name: 'undo_move',
    description: 'Undo the last move'
  }
];

// Handle function calls
client.registerFunctionHandler('move_item', async ({ item, zone }) => {
  performDragDrop(item, zone);
  return { success: true, message: `Moved ${item} to ${zone}` };
});
```

**Recommendation:** ✅ **Use OpenAI function calling** - most reliable approach.

---

## 🌐 Multilingual Support

### 1. **Language Detection**
**URL:** Native - OpenAI Realtime API supports language parameter
**Relevance:** ⭐⭐⭐⭐⭐ (5/5)

**Configuration:**
```typescript
{
  audio: {
    input: {
      transcription: {
        model: 'gpt-4o-transcribe',
        language: 'es' // Spanish
      }
    }
  }
}
```

**Recommendation:** ✅ **Use OpenAI native language support**.

---

### 2. **Spanish Pronunciation Resources**
**URL:** https://github.com/topics/spanish-pronunciation
**Relevance:** ⭐⭐⭐☆☆ (3/5)

**Resources:**
- IPA (International Phonetic Alphabet) for Spanish
- Syllable break rules
- Stress patterns

**Recommendation:** 📚 **Reference for content creation**, not runtime code.

---

## 🔧 Utility Libraries

### 1. **fuzzysort** (Fuzzy Search)
**URL:** https://github.com/farzher/fuzzysort
**License:** MIT
**Relevance:** ⭐⭐⭐⭐☆ (4/5)

**Pros:**
- ✅ Fast fuzzy search
- ✅ Typo-tolerance
- ✅ Highlighting support
- ✅ TypeScript support

**Implementation:**
```typescript
import fuzzysort from 'fuzzysort';

function matchWord(spoken: string, candidates: string[]): string | null {
  const result = fuzzysort.go(spoken, candidates, { threshold: 0.7 });

  return result.length > 0 ? result[0].target : null;
}

// Usage
const match = matchWord('perro', ['pero', 'perro', 'pera']);
// Returns: 'perro'
```

**Recommendation:** ✅ **Use for word matching** in ReadFlow.

---

### 2. **lodash** (Utilities)
**URL:** https://lodash.com
**License:** MIT
**Relevance:** ⭐⭐☆☆☆ (2/5)

**Recommendation:** ⚠️ Only if needed - prefer native JS methods to reduce bundle size.

---

### 3. **date-fns** (Already in Dependencies)
**URL:** https://date-fns.org
**License:** MIT
**Relevance:** ⭐⭐⭐⭐☆ (4/5)

**Use Cases:**
- Timestamp formatting
- Duration calculations
- Timer displays

**Recommendation:** ✅ **Use for time calculations** in speed quiz and metrics.

---

## 📦 Recommended Dependencies

### Install Commands

```bash
# Essential
npm install js-levenshtein    # Fuzzy matching
npm install fuzzysort          # Word search

# Optional (already have alternatives)
# npm install @huggingface/transformers  # Already installed
# npm install date-fns                    # Already installed
```

### Bundle Size Analysis

| Library | Size (gzipped) | Purpose | Priority |
|---------|----------------|---------|----------|
| js-levenshtein | 0.5 KB | Pronunciation matching | ✅ High |
| fuzzysort | 4 KB | Word matching | ✅ High |
| @huggingface/transformers | ~1 MB | Offline STT | ⚠️ Low |
| Web Speech API | 0 KB (native) | Fallback STT | ✅ High |

**Total Added:** ~4.5 KB

---

## 🎯 Implementation Strategy

### Phase 1: Core Dependencies (Day 1)
```bash
npm install js-levenshtein fuzzysort
```

### Phase 2: Custom Implementations (Days 2-3)
- ✅ Canvas-based audio visualization
- ✅ React state for word highlighting
- ✅ Custom WCPM calculator
- ✅ Fuzzy matching wrapper

### Phase 3: OpenAI Integration (Days 4-5)
- ✅ Word-level transcription parsing
- ✅ Function calling setup
- ✅ Voice command handlers

### Phase 4: Fallbacks (Optional)
- ⚠️ Web Speech API integration
- ⚠️ Offline mode with Hugging Face

---

## 📊 Comparison Matrix

| Feature | OpenAI Realtime | Web Speech API | Hugging Face | Custom Code |
|---------|----------------|----------------|--------------|-------------|
| **Real-time** | ✅ Yes | ✅ Yes | ❌ No | N/A |
| **Word timestamps** | ✅ Yes | ❌ No | ✅ Yes | N/A |
| **Spanish support** | ✅ Excellent | ✅ Good | ✅ Excellent | N/A |
| **Cost** | $$ API | Free | Free | Free |
| **Accuracy** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | N/A |
| **Latency** | ~300ms | ~500ms | ~2000ms | N/A |
| **Bundle size** | 0 KB | 0 KB | ~1 MB | Minimal |

**Winner:** ✅ **OpenAI Realtime API** (primary) + **Custom code** (UI/logic)

---

## 🎓 Learning Resources

### Documentation
1. **OpenAI Realtime API Docs:** https://platform.openai.com/docs/guides/realtime
2. **Web Audio API Guide:** https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API
3. **Canvas Tutorial:** https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial

### Reference Implementations
1. **OpenAI Realtime Console:** https://github.com/openai/openai-realtime-console
2. **Speech Recognition Examples:** https://github.com/mdn/dom-examples/tree/main/web-speech-api
3. **Canvas Visualizations:** https://github.com/processing/p5.js-sound

---

## ✅ Final Recommendations

### ✅ Use These:
1. **OpenAI Realtime API** - Primary STT with word-level transcription
2. **js-levenshtein** - Pronunciation matching
3. **fuzzysort** - Word search and matching
4. **Canvas API** - Audio visualization
5. **Native React State** - Word highlighting
6. **Custom WCPM Calculator** - Reading metrics

### ⚠️ Consider These:
1. **Web Speech API** - Fallback for OpenAI failures
2. **date-fns** (already installed) - Time formatting
3. **@huggingface/transformers** (already installed) - Offline analysis

### ❌ Skip These:
1. ❌ wavesurfer.js - Too heavy
2. ❌ pronounce-js - Unmaintained
3. ❌ compromise - Redundant with OpenAI
4. ❌ lodash - Use native JS

---

## 📝 Implementation Checklist

- [ ] Install js-levenshtein
- [ ] Install fuzzysort
- [ ] Create fuzzy matching utility
- [ ] Implement Canvas visualizer
- [ ] Build word highlighting component
- [ ] Create WCPM calculator
- [ ] Setup OpenAI transcription parsing
- [ ] Implement function calling handlers
- [ ] Add Web Speech API fallback
- [ ] Write unit tests with mocks

---

**Document Status:** ✅ RESEARCH COMPLETE
**Next Action:** Begin implementation with recommended dependencies
**Total Added Dependencies:** 2 (js-levenshtein, fuzzysort)
**Total Bundle Impact:** ~4.5 KB gzipped

**Last Updated:** October 28, 2025
**Version:** 1.0
