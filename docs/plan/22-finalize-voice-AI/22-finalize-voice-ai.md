I'll investigate the voice interaction logs to understand the superimposed voices issue during the 4th exercise.

Now let me look at the specific timing around the 4th exercise more closely:

Perfect! I found the issue. Let me check the exercise order to confirm which is the 4th:

Perfect! Now I can see the issue clearly. Let me analyze the timing data from the session:

## 🔍 Analysis: Superimposed Voices on 4th Exercise

Based on the voice interaction logs for session `3a17afcd-8451-48ec-b5ca-d9ad108746e2`, I found the **exact cause** of the superimposed voices:

### Exercise Order:
1. **Sound Hunt (MCQ)** - `daeedbd1-...`
2. **Missing Vowel (Fill Blank)** - `3acf5c5a-...`  
3. **Build the Word (Drag & Drop)** - `3a9a822a-...`
4. **Life Cycle Facts (True/False)** - `9ff0f689-...` ⚠️ **THE PROBLEM**
5. **Predict the Word (Write Answer)** - `9b83f8a7-...`

### The Issue at Exercise 4 (True/False):

At **18:26:48.998** - Coquí speaks for True/False exercise:
```
"Estamos estudiando el ciclo de vida. Escucha bien: un ciclo ciclo es una serie..."
```

But then **only 1.044 seconds later** (at **18:27:00.939**), Coquí speaks **AGAIN** for the same exercise:
```
"Estamos estudiando el ciclo de vida. Escucha bien: [TEST] Responde si la oración..."
```

**This is the double voice!** Two AI responses playing nearly simultaneously (1 second apart).

### Why This Happened:

Looking at the pattern, the issue occurs because:

1. **First response** (18:26:48.998): Triggered by the activity change detection in `CoquiLessonAssistant` 
2. **Second response** (18:27:00.939): Triggered **1 second later**, likely by:
   - A retry attempt from the same component
   - OR the post-connect greeting logic firing again
   - OR the `sendText` being called twice in rapid succession

### Additional Evidence:

Notice that **Exercise 3 (Drag & Drop)** also had **two messages** sent:
- 18:26:20.029: First guidance
- 18:26:33.024: Second guidance (13 seconds apart)

This suggests the **retry logic in `CoquiLessonAssistant`** is firing even when the first message succeeded.

---

## 🎯 Root Cause

The problem is in **`CoquiLessonAssistant.tsx`** (lines 85-135) - the activity prompt retry logic:

```typescript
useEffect(() => {
  if (!autoConnect || !isConnected || activityId === previousActivityId.current) {
    return;
  }

  // ... retry logic with maxRetries=10 ...
}, [isConnected, activityId, hasGreeted, /* other deps */]);
```

**The issue**: The effect dependencies cause it to re-fire even after successfully sending the first message, because:
- `isConnected`, `isAIPlaying`, or other state changes trigger the effect again
- The retry logic doesn't properly track "message successfully sent and AI is now speaking"
- Multiple retries overlap when the AI takes time to respond

---

## Fix Plan: Prevent Superimposed Voices

### Root Cause
The `CoquiLessonAssistant` retry logic (lines 85-135) sends multiple voice guidance messages for the same activity because:
1. The effect dependencies cause re-execution even after successful send
2. There's no "message sent successfully" flag to prevent retries
3. The retry logic doesn't account for the AI already speaking

### Solution

**Step 1: Add "message sent" tracking in `CoquiLessonAssistant.tsx`**

```typescript
// Around line 20, add new ref
const messageSentForActivity = useRef(null);

// In the activity prompt effect (around line 85)
useEffect(() => {
  if (!autoConnect || !isConnected || activityId === previousActivityId.current) {
    return;
  }

  // NEW: Skip if we already sent a message for this activity
  if (messageSentForActivity.current === activityId) {
    console.log('[CoquiLessonAssistant] ⏭️ Already sent message for', activityId);
    return;
  }

  // ... existing retry logic ...

  const attemptSend = async (attemptCount: number) => {
    try {
      // ... existing checks ...

      await sendText(voiceGuidance);
      console.log('[CoquiLessonAssistant] ✅ Activity guidance sent');

      // NEW: Mark this activity as "message sent"
      messageSentForActivity.current = activityId;

      // ... existing success handling ...
    } catch (error) {
      // ... existing error handling ...
    }
  };

  // ... rest of effect ...
}, [dependencies]);

// Reset the flag when activity changes
useEffect(() => {
  if (activityId !== previousActivityId.current) {
    messageSentForActivity.current = null;
    previousActivityId.current = activityId;
  }
}, [activityId]);
```

**Step 2: Increase initial cooldown for activity transitions**

Currently 1200ms, but AI responses can take longer. Increase to 2000ms:

```typescript
// Line ~50
const INITIAL_COOLDOWN_MS = 2000; // Increased from 1200
```

**Step 3: Add debounce to `sendText` calls**

In `useRealtimeVoice.ts`, add a debounce mechanism to prevent rapid-fire sends:

```typescript
// Around line 30
const lastSendTime = useRef(0);
const MIN_SEND_INTERVAL = 1500; // milliseconds

const sendText = useCallback((text: string) => {
  const now = Date.now();
  const timeSinceLastSend = now - lastSendTime.current;

  if (timeSinceLastSend < MIN_SEND_INTERVAL) {
    console.log('[useRealtimeVoice] ⏸️ Throttling sendText, too soon after last send');
    return;
  }

  lastSendTime.current = now;
  // ... existing sendText logic ...
}, [dependencies]);
```

**Step 4: Clear retries when AI starts speaking**

In `CoquiLessonAssistant`, abort retry attempts when `isAIPlaying` becomes true:

```typescript
// In the retry effect
const timeoutId = setTimeout(() => {
  // NEW: Abort if AI started playing
  if (isAIPlaying) {
    console.log('[CoquiLessonAssistant] 🛑 AI is speaking, aborting retry');
    return;
  }
  attemptSend(retryCount + 1);
}, retryDelay);
```

### Expected Outcome

After these fixes:
- ✅ Only ONE voice guidance per activity (no superimposed voices)
- ✅ Activity transitions wait for proper cooldown before sending
- ✅ Retries abort if AI is already speaking
- ✅ Rapid successive `sendText` calls are throttled
- ✅ Each activity gets exactly one message, tracked via ref

### Testing Checklist

1. Navigate through all 5 exercises in sequence
2. Verify only one voice plays per exercise
3. Check console logs show "Already sent message for [activity]" on subsequent renders
4. Confirm no "conversation_already_has_active_response" errors
5. Test rapid clicking between exercises - should still get only one voice per activity

---