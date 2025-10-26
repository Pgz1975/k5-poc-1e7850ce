I'll investigate the different Coqui implementations across activity types by examining the relevant files.

Now let me search for the voice context configuration patterns:

Let me also check the voice guidance defaults:

Perfect! Now I have a comprehensive understanding. Let me compile the information about Coquí implementations across different activity types.

---

## Coquí Implementation Adaptations by Activity Type

Based on my analysis of the codebase, here are the **different adaptations of the Coquí implementation according to activity types**:

### **1. Core Activity Types**

The system recognizes **three primary activity types** (defined in `useCoquiSession.ts` line 23):
- `'lesson'` - Teaching content
- `'exercise'` - Practice activities  
- `'system'` - System-level interactions (not currently used in UI)

---

### **2. Implementation Differences by Type**

#### **A. Lessons (`activityType: 'lesson'`)**
**Used in:** `ViewLesson.tsx`

**Voice Context Configuration:**
```typescript
{
  title: lesson.title,
  subtype: lesson.subtype,
  language: lesson.language,
  voiceGuidance: lesson.voice_guidance ?? defaultLessonGuidance,
  coquiDialogue: lesson.coqui_dialogue,
  pronunciationWords: lesson.pronunciation_words,
  content: lesson.content
}
```

**Default Guidance Prompt:**
> "Start by greeting the Grade 1 student and summarizing the lesson '[title]'. Read aloud or paraphrase any key instructions from the content, then guide them through the concept using questions and examples. Stay within this lesson and use a Socratic approach—offer hints and prompts before revealing answers."

**UI Characteristics:**
- **Position:** Responsive (inline on desktop ≥1024px, fixed on mobile)
- **Auto-connect:** Yes
- **Guard Component:** `CoquiLessonAssistantGuard` (waits for auth)
- **Navigation Guard:** `CoquiVoiceBridge` (cleans up session before navigation)
- **Completion Behavior:** Navigates to exercises or dashboard after cleanup

---

#### **B. Exercises (`activityType: 'exercise'`)**
**Used in:** `LessonExerciseFlow.tsx`, `ViewAssessment.tsx`

**Voice Context Configuration:**
```typescript
{
  title: exercise.title,
  subtype: exercise.subtype, // e.g., 'multiple_choice', 'drag_drop', etc.
  language: exercise.language,
  voiceGuidance: exercise.voice_guidance ?? defaultExerciseGuidance,
  coquiDialogue: exercise.coqui_dialogue,
  pronunciationWords: exercise.pronunciation_words,
  content: exercise.content
}
```

**Default Guidance Prompt:**
> "Start by greeting the Grade 1 student and summarizing the exercise '[title]' ([subtype]). Read or paraphrase any instructions or prompts from the activity content, then invite the student to try. Use a Socratic approach: offer hints instead of direct answers, model pronunciation when needed, and avoid revealing the solution unless the student is stuck."

**UI Characteristics:**
- **Position:** Always fixed (bottom-right corner)
- **Auto-connect:** Yes
- **Guard Component:** `CoquiLessonAssistantGuard` (in flow) OR direct `CoquiLessonAssistant` (in standalone assessment)
- **Navigation Guard:** `CoquiVoiceBridge` (cleans up between exercises)
- **Activity Switching:** Automatically reconnects with new context when `activityId` changes (see `useCoquiSession.ts` lines 84-104)

**Special Behavior in `LessonExerciseFlow`:**
- Voice session **reconnects** when navigating between exercises in the same lesson
- Progress tracking: Updates `completedExercises` set and `exerciseScores` map
- Sequential unlocking: Only unlocked exercises can be accessed

---

### **3. Shared Voice Context Fields**

All activity types share these **configurable voice context parameters**:

| Field | Type | Purpose | Source |
|-------|------|---------|--------|
| `title` | `string` | Activity name | DB: `manual_assessments.title` |
| `subtype` | `string \| null` | Activity format (e.g., `multiple_choice`) | DB: `manual_assessments.subtype` |
| `language` | `string \| null` | Content language (`es-PR` or `en-US`) | DB: `manual_assessments.language` |
| `voiceGuidance` | `string \| null` | Custom AI system prompt | DB: `manual_assessments.voice_guidance` |
| `coquiDialogue` | `string \| null` | First spoken message (overrides guidance) | DB: `manual_assessments.coqui_dialogue` |
| `pronunciationWords` | `string[] \| null` | Target vocabulary for pronunciation | DB: `manual_assessments.pronunciation_words` |
| `content` | `Record \| null` | Full activity content (questions, answers, images) | DB: `manual_assessments.content` |

---

### **4. Key Behavioral Differences**

| Aspect | Lessons | Exercises |
|--------|---------|-----------|
| **Greeting Strategy** | Single greeting on connect, then activity guidance | Activity guidance replaces greeting (lines 94-106 in `CoquiLessonAssistant.tsx`) |
| **Reconnection Logic** | Only on manual disconnect/reconnect | **Automatic** when `activityId` changes (exercise flow) |
| **UI Position** | Responsive (inline/fixed) | Always fixed |
| **Initial Cooldown** | 1200ms before sending activity prompt | Same (1200ms) |
| **Retry Logic** | Max 10 retries with 500-800ms intervals | Same |
| **Session Cleanup** | On navigation away from lesson | Between exercises + on exit |
| **Progress Tracking** | Binary (completed/not completed) | Score-based (`exerciseScores` map) |

---

### **5. Activity Reconnection Flow (Exercise-Specific)**

When switching between exercises in `LessonExerciseFlow`:

1. **`activityId` changes** → Triggers `useEffect` in `useCoquiSession.ts` (lines 84-104)
2. **Disconnect current session** → `await disconnectRef.current()`
3. **300ms delay** → Ensure cleanup completes
4. **Reset connection flag** → `hasAttemptedConnection.current = false`
5. **Reconnect with new context** → `await connectRef.current()` (new `voiceContext` applied)
6. **CoquiLessonAssistant detects connection** → Sends new activity guidance after initial cooldown

---

### **6. Voice Guidance Personalization**

Both activity types support **custom voice guidance** via database fields:

- **`voice_guidance`** (system prompt): Sets AI behavior/persona
- **`coqui_dialogue`** (first message): If set, **overrides** default greeting (see line 194-199 in `CoquiLessonAssistant.tsx`)

**Priority Order:**
1. `coquiDialogue` (if exists) → Direct spoken message
2. `voiceGuidance` (if exists) → Custom system prompt
3. `defaultLessonGuidance` or `defaultExerciseGuidance` → Fallback

---

### **7. Current Implementation Gaps**

- **No `system` activity type usage**: Defined in types but not implemented in UI
- **ReadingExercise page**: Uses old `CoquiMascot` directly, not integrated with session management
- **ViewAssessment**: Uses direct `CoquiLessonAssistant` (no guard), manual pre-connection state

---

### **Summary Table**

| Feature | Lesson | Exercise | System (unused) |
|---------|--------|----------|-----------------|
| Component | `ViewLesson.tsx` | `LessonExerciseFlow.tsx`, `ViewAssessment.tsx` | N/A |
| Guard | ✅ `CoquiLessonAssistantGuard` | ✅ (flow) / ❌ (standalone) | N/A |
| Auto-reconnect on ID change | ❌ | ✅ | N/A |
| Default Guidance | Socratic teaching prompt | Socratic exercise prompt | N/A |
| Position | Responsive | Fixed | N/A |
| Pronunciation Focus | Moderate | **High** (hints, modeling) | N/A |
| Progress Tracking | Binary completion | Score-based | N/A |

---
