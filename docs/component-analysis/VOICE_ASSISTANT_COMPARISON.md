# Voice Assistant Comparison: Lessons vs Exercises

## 🎤 Are They the Same Voice Assistant?

**YES** - The voice assistant is essentially the **same component system** used in both contexts, but with **different configurations** and **guidance prompts**.

## 📊 Component Architecture

Both ViewLesson and LessonExerciseFlow use the **exact same voice components**:

```
1. CoquiLessonAssistantGuard (wrapper for auth check)
2. CoquiVoiceBridge (session management)
3. CoquiLessonAssistant (actual voice UI - rendered by Guard)
```

## 🔄 How They're Used

### In ViewLesson (Lesson View)
```tsx
// ViewLesson.tsx lines 358-374
<CoquiLessonAssistantGuard
  activityId={lesson.id}
  activityType="lesson"              // ← Type: "lesson"
  position={isDesktop ? "inline" : "fixed"}
  voiceContext={lessonVoiceContext}
  autoConnect={true}
/>

<CoquiVoiceBridge
  activityId={lesson.id}
  activityType="lesson"              // ← Type: "lesson"
  voiceContext={lessonVoiceContext}
  endSessionRef={endSessionRef}
/>
```

### In LessonExerciseFlow (Exercise View)
```tsx
// LessonExerciseFlow.tsx lines 337-350
<CoquiLessonAssistantGuard
  activityId={currentExercise.id}
  activityType="exercise"            // ← Type: "exercise"
  voiceContext={exerciseVoiceContext}
  autoConnect={true}
/>

<CoquiVoiceBridge
  activityId={currentExercise.id}
  activityType="exercise"            // ← Type: "exercise"
  voiceContext={exerciseVoiceContext}
  endSessionRef={endSessionRef}
/>
```

## 🎯 Key Differences

### 1. Activity Type
- **Lesson**: `activityType="lesson"`
- **Exercise**: `activityType="exercise"`

### 2. Activity ID
- **Lesson**: Uses the lesson ID
- **Exercise**: Uses the current exercise ID (changes as user progresses)

### 3. Voice Context & Guidance

#### Lesson Voice Context (ViewLesson.tsx lines 209-219)
```javascript
const defaultLessonGuidance = `Start by greeting the Grade 1 student and
summarizing the lesson "${lesson.title}". Read aloud or paraphrase any
key instructions from the content, then guide them through the concept
using questions and examples. Stay within this lesson and use a Socratic
approach—offer hints and prompts before revealing answers.`;

const lessonVoiceContext = {
  title: lesson.title,
  subtype: lesson.subtype,
  language: lesson.language,
  voiceGuidance: lesson.voice_guidance ?? defaultLessonGuidance,
  coquiDialogue: lesson.coqui_dialogue,
  pronunciationWords: lesson.pronunciation_words,
  content: lesson.content
};
```

#### Exercise Voice Context (LessonExerciseFlow.tsx lines 251-261)
```javascript
const defaultExerciseGuidance = `Start by greeting the Grade 1 student and
summarizing the exercise "${currentExercise.title}" (${currentExercise.subtype}).
Read or paraphrase any instructions or prompts from the activity content,
then invite the student to try. Use a Socratic approach: offer hints
instead of direct answers, model pronunciation when needed, and avoid
revealing the solution unless the student is stuck.`;

const exerciseVoiceContext = {
  title: currentExercise.title,
  subtype: currentExercise.subtype,
  language: currentExercise.language,
  voiceGuidance: currentExercise.voice_guidance ?? defaultExerciseGuidance,
  coquiDialogue: currentExercise.coqui_dialogue,
  pronunciationWords: currentExercise.pronunciation_words,
  content: currentExercise.content
};
```

### 4. Default Guidance Differences

| Aspect | Lesson | Exercise |
|--------|--------|----------|
| **Focus** | "guide them through the concept using questions and examples" | "invite the student to try" |
| **Context** | Mentions lesson title only | Mentions both title AND subtype (e.g., "multiple_choice") |
| **Approach** | "Stay within this lesson" | "avoid revealing the solution unless the student is stuck" |
| **Intent** | Teaching/explaining concepts | Helping with practice/assessment |

### 5. Position Behavior (Lesson Only)
In ViewLesson, the assistant position changes based on screen size:
```tsx
position={isDesktop ? "inline" : "fixed"}
```
In LessonExerciseFlow, position isn't specified (uses default).

## 🔗 Session Continuity

### When Transitioning from Lesson → Exercises

1. **Session Ends**: Voice session from lesson view terminates
2. **New Session**: New voice session starts for exercises
3. **Context Switch**: Voice guidance changes from lesson context to exercise context
4. **ID Changes**: Activity ID switches from lesson.id to currentExercise.id

### Within Exercise Flow

When moving between exercises (Exercise 1 → Exercise 2):
- Component re-renders with new exercise ID
- Voice context updates with new exercise details
- New guidance specific to that exercise type

## 📝 Summary

**Same Components, Different Configurations:**
- ✅ Same voice assistant components (CoquiLessonAssistantGuard, CoquiVoiceBridge)
- ✅ Same visual interface (mascot, chat UI)
- ✅ Same underlying voice technology
- ❌ Different activity types (lesson vs exercise)
- ❌ Different guidance prompts
- ❌ Different activity IDs
- ❌ Different contexts (teaching vs practice)

The voice assistant **adapts its behavior** based on whether it's helping with:
- **Lesson**: Explaining concepts, teaching
- **Exercise**: Guiding practice, providing hints

It's like having the same tutor who changes their teaching approach based on whether they're introducing new material (lesson) or helping with practice problems (exercises).