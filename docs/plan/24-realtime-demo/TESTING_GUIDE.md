# Testing Guide - OpenAI Realtime API Demo Activities
## Quality Assurance & Validation Procedures

**Document Version:** 1.0
**Last Updated:** October 28, 2025
**Status:** TESTING READY

---

## 🎯 Testing Objectives

Ensure **100% first-shot success rate** for all demo activities by:
1. **Functional Testing** - All features work as specified
2. **Performance Testing** - Meets latency and quality targets
3. **Error Handling** - Graceful degradation and recovery
4. **Cross-browser Testing** - Works on all supported browsers
5. **Mobile Testing** - Responsive and functional on mobile devices
6. **Accessibility Testing** - WCAG 2.1 AA compliance

---

## 📊 Success Metrics (From Master Plan)

| Demo Type | Key Metric | Target | Status |
|-----------|-----------|--------|--------|
| **Story Narration** | Branching depth | 3+ levels | ⏳ Pending |
| **Pronunciation** | Transcription accuracy | >85% | ⏳ Pending |
| **Speed Quiz** | Response latency | <500ms | ⏳ Pending |
| **Voice Builder** | Function call accuracy | >90% | ⏳ Pending |
| **Spelling Coach** | Letter detection rate | >95% | ⏳ Pending |
| **Writing Coach** | Feedback relevance | 4/5 rating | ⏳ Pending |
| **ReadFlow** | Word sync accuracy | >92% | ⏳ Pending |

---

## 🧪 Test Categories

### 1. Unit Tests (Component Level)

**Framework:** Vitest + @testing-library/react
**Location:** `src/components/demo/__tests__/`

#### ReadFlow Player Tests

**File:** `src/components/demo/DemoPlayers/__tests__/ReadFlowPlayer.test.tsx`

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ReadFlowPlayer } from '../ReadFlowPlayer';
import * as useRealtimeDemo from '@/hooks/useRealtimeDemo';

// Mock the hook
vi.mock('@/hooks/useRealtimeDemo');

const mockContent = {
  passage: {
    title: 'Test Passage',
    text: 'The quick brown fox',
    words: [
      { id: 0, text: 'The', pronunciation: 'the', difficulty: 'easy' },
      { id: 1, text: 'quick', pronunciation: 'quick', difficulty: 'medium' },
      { id: 2, text: 'brown', pronunciation: 'brown', difficulty: 'easy' },
      { id: 3, text: 'fox', pronunciation: 'fox', difficulty: 'easy' }
    ],
    target_wcpm: 60,
    min_accuracy: 0.90
  },
  reading_assistance: {
    word_highlighting: true,
    auto_scroll: true,
    pronunciation_hints: true,
    pace_feedback: true
  }
};

describe('ReadFlowPlayer', () => {
  const mockClient = {
    sendText: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useRealtimeDemo).default.mockReturnValue({
      client: mockClient,
      isConnected: true,
      isConnecting: false,
      isAIPlaying: false,
      error: null,
      startSession: vi.fn(),
      endSession: vi.fn()
    });
  });

  it('renders passage correctly', () => {
    render(
      <ReadFlowPlayer
        content={mockContent}
        activityId="test-123"
        language="en-US"
      />
    );

    expect(screen.getByText('Test Passage')).toBeInTheDocument();
    expect(screen.getByText('The')).toBeInTheDocument();
    expect(screen.getByText('quick')).toBeInTheDocument();
  });

  it('starts reading session when Start button clicked', async () => {
    const mockStartSession = vi.fn();
    vi.mocked(useRealtimeDemo).default.mockReturnValue({
      client: mockClient,
      isConnected: false,
      isConnecting: false,
      isAIPlaying: false,
      error: null,
      startSession: mockStartSession,
      endSession: vi.fn()
    });

    render(
      <ReadFlowPlayer
        content={mockContent}
        activityId="test-123"
        language="en-US"
      />
    );

    const startButton = screen.getByText('Start Reading');
    fireEvent.click(startButton);

    await waitFor(() => {
      expect(mockStartSession).toHaveBeenCalled();
    });
  });

  it('highlights current word correctly', async () => {
    render(
      <ReadFlowPlayer
        content={mockContent}
        activityId="test-123"
        language="en-US"
      />
    );

    // Simulate word transcription
    const onWordTranscription = vi.mocked(useRealtimeDemo).default.mock.calls[0][0].onWordTranscription;

    await waitFor(() => {
      onWordTranscription?.('the', Date.now(), 0.95);
    });

    const theWord = screen.getByText('The').closest('span');
    expect(theWord).toHaveClass('bg-green-200'); // Correct word
  });

  it('calculates accuracy correctly', async () => {
    render(
      <ReadFlowPlayer
        content={mockContent}
        activityId="test-123"
        language="en-US"
      />
    );

    const onWordTranscription = vi.mocked(useRealtimeDemo).default.mock.calls[0][0].onWordTranscription;

    // Simulate reading
    onWordTranscription?.('the', Date.now(), 0.95);
    onWordTranscription?.('quick', Date.now(), 0.90);
    onWordTranscription?.('brown', Date.now(), 0.88);

    await waitFor(() => {
      expect(screen.getByText(/75\.0%/)).toBeInTheDocument(); // 3/4 words
    });
  });

  it('handles pronunciation errors', async () => {
    render(
      <ReadFlowPlayer
        content={mockContent}
        activityId="test-123"
        language="en-US"
      />
    );

    const onWordTranscription = vi.mocked(useRealtimeDemo).default.mock.calls[0][0].onWordTranscription;

    // Mispronounce first word
    onWordTranscription?.('thee', Date.now(), 0.70);

    await waitFor(() => {
      const theWord = screen.getByText('The').closest('span');
      expect(theWord).toHaveClass('bg-red-200'); // Error
      expect(mockClient.sendText).toHaveBeenCalledWith(
        expect.stringContaining('trying to say')
      );
    });
  });
});
```

#### Command to Run:
```bash
npm run test -- ReadFlowPlayer
```

---

### 2. Integration Tests (Full Flow)

**Framework:** Playwright
**Location:** `e2e/demo/`

#### ReadFlow End-to-End Test

**File:** `e2e/demo/readflow.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('ReadFlow Demo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/demo/readflow/demo-activity-123');

    // Wait for page load
    await page.waitForSelector('[data-testid="readflow-player"]');
  });

  test('loads passage and displays correctly', async ({ page }) => {
    await expect(page.locator('h2')).toContainText('Interactive Reading');

    const words = page.locator('[id^="word-"]');
    await expect(words).toHaveCount(30); // Assuming 30-word passage
  });

  test('connects to Realtime API and starts session', async ({ page }) => {
    // Grant microphone permission
    await page.context().grantPermissions(['microphone']);

    const startButton = page.locator('button:has-text("Start Reading")');
    await startButton.click();

    // Wait for connection
    await page.waitForSelector('[data-testid="audio-waveform"]', { timeout: 5000 });

    // Check for connected state
    const waveform = page.locator('[data-testid="audio-waveform"]');
    await expect(waveform).toBeVisible();
  });

  test('highlights words as student reads', async ({ page, context }) => {
    await context.grantPermissions(['microphone']);

    // Start session
    await page.click('button:has-text("Start Reading")');
    await page.waitForTimeout(2000); // Wait for connection

    // Simulate audio input (would need real audio in production tests)
    // For now, trigger word transcription via devtools
    await page.evaluate(() => {
      window.dispatchEvent(new CustomEvent('mock-word-transcription', {
        detail: { word: 'the', timestamp: Date.now(), confidence: 0.95 }
      }));
    });

    await page.waitForTimeout(500);

    const firstWord = page.locator('#word-0');
    await expect(firstWord).toHaveClass(/bg-green-200/);
  });

  test('completes reading and shows results', async ({ page, context }) => {
    await context.grantPermissions(['microphone']);

    await page.click('button:has-text("Start Reading")');
    await page.waitForTimeout(1000);

    // Simulate completing all words
    const wordCount = await page.locator('[id^="word-"]').count();

    for (let i = 0; i < wordCount; i++) {
      await page.evaluate((index) => {
        window.dispatchEvent(new CustomEvent('mock-word-transcription', {
          detail: {
            word: document.getElementById(`word-${index}`)?.textContent?.toLowerCase(),
            timestamp: Date.now(),
            confidence: 0.90
          }
        }));
      }, i);

      await page.waitForTimeout(100);
    }

    // Check for results
    await expect(page.locator('text=Great Job!')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=/Accuracy:/')).toBeVisible();
    await expect(page.locator('text=/Speed:/')).toBeVisible();
  });

  test('handles pause and resume correctly', async ({ page, context }) => {
    await context.grantPermissions(['microphone']);

    await page.click('button:has-text("Start Reading")');
    await page.waitForTimeout(1000);

    // Pause
    await page.click('button:has-text("Pause")');

    // Verify pause button changes
    await expect(page.locator('button:has-text("Start Reading")')).toBeVisible();

    // Resume
    await page.click('button:has-text("Start Reading")');
    await expect(page.locator('button:has-text("Pause")')).toBeVisible();
  });

  test('resets reading progress on Reset button', async ({ page }) => {
    await page.click('button:has-text("Start Reading")');
    await page.waitForTimeout(1000);

    // Read some words
    await page.evaluate(() => {
      window.dispatchEvent(new CustomEvent('mock-word-transcription', {
        detail: { word: 'the', timestamp: Date.now(), confidence: 0.95 }
      }));
    });

    await page.waitForTimeout(500);

    // Reset
    await page.click('button:has-text("Reset")');

    // Verify reset
    const words = page.locator('[id^="word-"]');
    const firstWord = words.first();

    await expect(firstWord).toHaveClass(/bg-gray-100/); // Back to pending
  });

  test('auto-scrolls to current word', async ({ page, context }) => {
    await context.grantPermissions(['microphone']);

    await page.click('button:has-text("Start Reading")');
    await page.waitForTimeout(1000);

    // Read first 10 words
    for (let i = 0; i < 10; i++) {
      await page.evaluate((index) => {
        window.dispatchEvent(new CustomEvent('mock-word-transcription', {
          detail: {
            word: document.getElementById(`word-${index}`)?.textContent?.toLowerCase(),
            timestamp: Date.now(),
            confidence: 0.90
          }
        }));
      }, i);

      await page.waitForTimeout(100);
    }

    // Check if word 10 is in viewport
    const word10 = page.locator('#word-10');
    await expect(word10).toBeInViewport();
  });
});

test.describe('ReadFlow Performance', () => {
  test('measures word highlighting latency', async ({ page, context }) => {
    await context.grantPermissions(['microphone']);

    await page.goto('/demo/readflow/demo-activity-123');
    await page.click('button:has-text("Start Reading")');
    await page.waitForTimeout(1000);

    const latencies: number[] = [];

    for (let i = 0; i < 10; i++) {
      const start = performance.now();

      await page.evaluate((index) => {
        window.dispatchEvent(new CustomEvent('mock-word-transcription', {
          detail: {
            word: document.getElementById(`word-${index}`)?.textContent?.toLowerCase(),
            timestamp: Date.now(),
            confidence: 0.90
          }
        }));
      }, i);

      await page.waitForSelector(`#word-${i}[class*="bg-green-200"]`);

      const end = performance.now();
      latencies.push(end - start);
    }

    const avgLatency = latencies.reduce((sum, l) => sum + l, 0) / latencies.length;

    console.log(`Average highlighting latency: ${avgLatency.toFixed(2)}ms`);
    expect(avgLatency).toBeLessThan(100); // Should be < 100ms
  });
});
```

#### Command to Run:
```bash
npx playwright test demo/readflow
```

---

### 3. Manual Testing Checklist

#### ReadFlow Demo

**Tester:** _____________
**Date:** _____________
**Browser:** _____________
**Device:** _____________

**Pre-test Setup:**
- [ ] Login as demo user (admin@demo.com / demo1234)
- [ ] Navigate to `/demo/readflow/[activity-id]`
- [ ] Grant microphone permissions
- [ ] Verify network connection

**Functional Tests:**
- [ ] ✅ Passage displays correctly with all words
- [ ] ✅ Demo badge shows "ReadFlow Demo"
- [ ] ✅ Title displays passage name
- [ ] ✅ Start button is enabled when disconnected
- [ ] ✅ Clicking Start connects to OpenAI Realtime API
- [ ] ✅ Audio waveform displays during connection
- [ ] ✅ Words highlight as I read them aloud
- [ ] ✅ Correct words turn green
- [ ] ✅ Mispronounced words turn red
- [ ] ✅ Skipped words turn yellow
- [ ] ✅ Current word has blue ring
- [ ] ✅ Auto-scroll follows my reading
- [ ] ✅ AI provides pronunciation help when stuck
- [ ] ✅ Metrics update in real-time (words read, accuracy, WCPM)
- [ ] ✅ Pause button works correctly
- [ ] ✅ Resume continues from where I left off
- [ ] ✅ Reset clears all progress
- [ ] ✅ Completion triggers results screen
- [ ] ✅ Results show final accuracy and speed
- [ ] ✅ AI provides encouraging feedback

**Performance Tests:**
- [ ] ✅ Connection establishes in < 3 seconds
- [ ] ✅ Word highlighting has < 100ms latency
- [ ] ✅ No audio dropouts or glitches
- [ ] ✅ Smooth auto-scroll without janky animation
- [ ] ✅ Metrics update without lag

**Error Handling:**
- [ ] ✅ Graceful message if microphone denied
- [ ] ✅ Reconnect button shows if connection lost
- [ ] ✅ AI continues coaching after brief pause
- [ ] ✅ No crashes on rapid word changes
- [ ] ✅ Error boundary catches React errors

**Accessibility:**
- [ ] ✅ All buttons have aria-labels
- [ ] ✅ Keyboard navigation works (Tab, Enter, Space)
- [ ] ✅ Screen reader announces state changes
- [ ] ✅ Color contrast meets WCAG AA (4.5:1)
- [ ] ✅ Focus indicators visible
- [ ] ✅ Text scalable to 200% without breaking layout

**Mobile Specific (if applicable):**
- [ ] ✅ Touch targets at least 44x44px
- [ ] ✅ Responsive layout on small screens
- [ ] ✅ Portrait and landscape modes work
- [ ] ✅ Virtual keyboard doesn't obscure content
- [ ] ✅ No horizontal scrolling

**Notes/Issues:**
_________________________________________________________________
_________________________________________________________________

---

### 4. Pronunciation Demo Checklist

**Tester:** _____________
**Date:** _____________

**Functional Tests:**
- [ ] ✅ Question displays correctly
- [ ] ✅ 4 answer options show with pronunciations
- [ ] ✅ Speaker icons play pronunciation
- [ ] ✅ "Start Speaking" button connects to API
- [ ] ✅ Audio waveform shows when listening
- [ ] ✅ Spoken word detected accurately
- [ ] ✅ Correct answer highlights green with checkmark
- [ ] ✅ Incorrect answer highlights red with X
- [ ] ✅ Pronunciation feedback shows phoneme details
- [ ] ✅ AI models correct pronunciation clearly
- [ ] ✅ Try Again resets for another attempt
- [ ] ✅ Confidence score displays

**Performance:**
- [ ] ✅ Transcription accuracy > 85% (test with 20 samples)
- [ ] ✅ Response latency < 500ms from speech end

---

### 5. Speed Quiz Checklist

**Tester:** _____________
**Date:** _____________

**Functional Tests:**
- [ ] ✅ Quiz intro screen displays
- [ ] ✅ Start button begins quiz
- [ ] ✅ AI reads first question clearly
- [ ] ✅ Timer counts down visibly
- [ ] ✅ Saying "verdadero" or "falso" registers answer
- [ ] ✅ Immediate feedback for correct/incorrect
- [ ] ✅ Score updates with speed multiplier
- [ ] ✅ Streak counter increments on correct answers
- [ ] ✅ Timer advances to next question automatically
- [ ] ✅ Final results show score, accuracy, average time
- [ ] ✅ AI provides encouraging summary
- [ ] ✅ Play Again resets quiz

**Performance:**
- [ ] ✅ Question-to-question transition < 500ms
- [ ] ✅ Answer detection latency < 300ms
- [ ] ✅ No audio overlap between questions

---

### 6. Voice Builder (Drag & Drop) Checklist

**Tester:** _____________
**Date:** _____________

**Functional Tests:**
- [ ] ✅ Scene with zones displays
- [ ] ✅ Draggable items shown
- [ ] ✅ AI explains voice commands
- [ ] ✅ Saying "pon el sol arriba" moves sun to sky
- [ ] ✅ AI confirms each action
- [ ] ✅ "deshacer" command undoes last move
- [ ] ✅ Function calling executes correctly
- [ ] ✅ Visual feedback for successful moves
- [ ] ✅ Completion detected when all items placed
- [ ] ✅ Final scene shows correctly

**Performance:**
- [ ] ✅ Function call accuracy > 90% (test 20 commands)
- [ ] ✅ Command execution < 500ms

---

### 7. Spelling Coach Checklist

**Tester:** _____________
**Date:** _____________

**Functional Tests:**
- [ ] ✅ Word image displays
- [ ] ✅ Letter tiles show (with extras)
- [ ] ✅ AI pronounces target word
- [ ] ✅ Saying letter names selects tiles
- [ ] ✅ Correct letters turn green
- [ ] ✅ Incorrect letters shake and turn red
- [ ] ✅ AI provides syllable hints if stuck
- [ ] ✅ Completion celebrates with animation
- [ ] ✅ Phonetic breakdown shown

**Performance:**
- [ ] ✅ Letter detection rate > 95% (26-letter alphabet test)

---

### 8. Writing Coach Checklist

**Tester:** _____________
**Date:** _____________

**Functional Tests:**
- [ ] ✅ Writing prompt displays
- [ ] ✅ AI asks guiding questions
- [ ] ✅ Student can dictate story
- [ ] ✅ Transcription displays in real-time
- [ ] ✅ AI provides vocabulary suggestions
- [ ] ✅ Creativity prompts offered ("What happened next?")
- [ ] ✅ Word count tracks toward limit
- [ ] ✅ Final story read back by AI
- [ ] ✅ Evaluation criteria checklist shown
- [ ] ✅ Praise for specific details

**Performance:**
- [ ] ✅ Feedback relevance rated 4/5 (user survey)

---

### 9. Story Narration Checklist

**Tester:** _____________
**Date:** _____________

**Functional Tests:**
- [ ] ✅ Story intro read by AI
- [ ] ✅ Student can respond to open-ended questions
- [ ] ✅ Story branches based on responses
- [ ] ✅ AI incorporates student ideas
- [ ] ✅ Character voices distinguishable
- [ ] ✅ At least 3 branching points
- [ ] ✅ Story concludes satisfyingly
- [ ] ✅ Learning objectives achieved

**Performance:**
- [ ] ✅ Branching depth ≥ 3 levels

---

## 🔍 Automated Performance Tests

### Latency Monitoring Script

**File:** `scripts/measure-demo-latency.js`

```javascript
import { chromium } from 'playwright';

async function measureLatency() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto('http://localhost:5173/demo/speed-quiz/demo-123');

  const latencies = [];

  // Capture network timing for Realtime API
  page.on('response', async (response) => {
    if (response.url().includes('api.openai.com/v1/realtime')) {
      const timing = response.timing();
      latencies.push(timing.responseEnd - timing.requestStart);
    }
  });

  // Simulate quiz interaction
  await page.click('button:has-text("Start Quiz")');
  await page.waitForTimeout(15000); // Run for 15 seconds

  await browser.close();

  const avgLatency = latencies.reduce((sum, l) => sum + l, 0) / latencies.length;
  const maxLatency = Math.max(...latencies);

  console.log(`Average Latency: ${avgLatency.toFixed(2)}ms`);
  console.log(`Max Latency: ${maxLatency.toFixed(2)}ms`);

  return { avgLatency, maxLatency };
}

measureLatency();
```

---

## 📊 Test Reporting

### Test Result Template

```markdown
# Demo Activity Test Report

**Demo:** ReadFlow Interactive Reading
**Date:** October 28, 2025
**Tester:** Jane Doe
**Environment:** Chrome 119, Windows 11

## Summary
- ✅ Passed: 24/26 tests
- ⚠️ Issues Found: 2
- 🐛 Bugs: 0
- ⚡ Performance: PASS

## Detailed Results

### Functional Tests (20/20 ✅)
All functional requirements met.

### Performance Tests (4/5 ✅)
- Connection time: 2.1s ✅
- Word highlighting: 85ms ✅
- Audio quality: Clear ✅
- Auto-scroll: 45ms ✅
- Metrics update: 120ms ⚠️ (Target: <100ms)

### Issues Found
1. **Metrics update latency**
   - Severity: Low
   - Description: Accuracy percentage updates with 120ms delay
   - Expected: <100ms
   - Action: Optimize state update debouncing

2. **Mobile keyboard overlap**
   - Severity: Medium
   - Description: Virtual keyboard obscures bottom metrics on iOS Safari
   - Action: Add bottom padding when keyboard visible

## Recommendations
1. Optimize metrics calculation with useMemo
2. Implement keyboard-aware layout on mobile
3. Add loading skeleton for initial connection
```

---

## 🚀 CI/CD Integration

### GitHub Actions Workflow

**File:** `.github/workflows/demo-tests.yml`

```yaml
name: Demo Activities Tests

on:
  push:
    branches: [main, demo/**]
  pull_request:
    branches: [main]

jobs:
  unit-tests:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Run unit tests
        run: npm run test -- --coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v3

  e2e-tests:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright
        run: npx playwright install --with-deps

      - name: Run E2E tests
        run: npx playwright test
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}

      - name: Upload test results
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

---

## ✅ Acceptance Criteria

### Per-Demo Checklist

Each demo MUST achieve:
- [ ] ✅ All functional tests pass
- [ ] ✅ Performance targets met
- [ ] ✅ No critical bugs
- [ ] ✅ Cross-browser compatibility
- [ ] ✅ Mobile responsiveness
- [ ] ✅ Accessibility WCAG AA
- [ ] ✅ Error handling verified
- [ ] ✅ User feedback positive (4/5+)

### Overall System Checklist

- [ ] ✅ All 7 demos deployed and accessible
- [ ] ✅ Database migrations successful
- [ ] ✅ No console errors in production
- [ ] ✅ Analytics tracking configured
- [ ] ✅ Documentation complete
- [ ] ✅ Demo walkthrough video recorded
- [ ] ✅ Support team trained

---

## 📚 Resources

### Testing Tools
- **Vitest:** https://vitest.dev
- **Playwright:** https://playwright.dev
- **Testing Library:** https://testing-library.com

### Audio Testing
- **Audio samples library:** `/tests/fixtures/audio/`
- **Pronunciation test words:** `/tests/fixtures/pronunciation-test.json`
- **Reading passages:** `/tests/fixtures/reading-passages.json`

---

## 🎓 Best Practices

1. **Test Early, Test Often:** Write tests alongside implementation
2. **Use Real Audio:** Test with actual speech samples, not mocks
3. **Cross-browser Testing:** Don't just test in Chrome
4. **Mobile First:** Test on real devices when possible
5. **Accessibility First:** Use screen reader during every test
6. **Performance Monitoring:** Track metrics in production
7. **User Feedback:** Conduct user testing sessions
8. **Document Issues:** Log all bugs with reproduction steps

---

**Document Status:** ✅ TESTING GUIDE COMPLETE
**Next Action:** Begin implementation with testing in parallel
**Estimated Testing Time:** 2-3 days (Week 3, Days 1-3)

**Last Updated:** October 28, 2025
**Version:** 1.0
