# Component Nesting Quick Reference

## What Contains What - Quick Lookup

### Student's Journey Flow

```
STUDENT OPENS APP
    ↓
StudentDashboard (/student-dashboard)
    ├─ ActivityCards
    │   ├─ Lessons link
    │   ├─ Exercises link
    │   └─ Assessments link
    └─ CoquiVoiceChat (optional voice)

    USER CLICKS "LESSONS"
    ↓
StudentLessonsProgress (/student-dashboard/lessons)
    ├─ DomainHeader (per domain)
    │   └─ LessonCard (per lesson)
    │       ├─ Title & description
    │       ├─ Lock icon (if locked)
    │       └─ Exercise progress bar
    │           └─ Unlocked: click → ViewLesson
    │           └─ Locked: grayed out

    USER CLICKS LESSON
    ↓
ViewLesson (/lesson/:id)
    ├─ Lesson title & description
    ├─ Lesson content (text, images, HTML)
    ├─ CoquiLessonAssistantGuard (voice support)
    ├─ CoquiVoiceBridge (cleanup on nav)
    └─ Buttons:
        ├─ Back
        └─ Mark as Complete

    USER CLICKS "MARK AS COMPLETE"
    │
    ├─ Saves completion
    ├─ Checks for child exercises
    │
    ├─ IF NO EXERCISES:
    │   └─ Confetti → Back to lessons dashboard
    │
    └─ IF HAS EXERCISES:
        ↓
        LessonExerciseFlow (/lesson/:lessonId/exercises)
            ├─ Progress bar (% complete)
            │
            ├─ Exercise navigator (circles)
            │   ├─ Circle 1 (current)
            │   ├─ Circle 2 (unlocked)
            │   ├─ Circle 3 (locked)
            │   └─ Circle N
            │
            ├─ ExercisePlayer
            │   ├─ Exercise header with title
            │   ├─ Question card
            │   ├─ Player component (based on type):
            │   │   ├─ MultipleChoicePlayer
            │   │   ├─ TrueFalsePlayer
            │   │   ├─ FillBlankPlayer
            │   │   ├─ WriteAnswerPlayer
            │   │   └─ DragDropPlayer
            │   ├─ Feedback card
            │   │   ├─ If correct → "Continue" button
            │   │   └─ If incorrect → "Try Again" or "Exit"
            │   └─ ActivityActions menu
            │
            ├─ CoquiLessonAssistantGuard (voice)
            └─ CoquiVoiceBridge (cleanup)

            USER ANSWERS EXERCISE
            │
            ├─ Calculates score
            ├─ Shows feedback (correct/incorrect)
            │
            ├─ IF PASSED (score >= passing_score):
            │   ├─ Confetti
            │   ├─ Saves to completed_activity
            │   ├─ Finds next incomplete exercise
            │   │
            │   ├─ IF MORE EXERCISES:
            │   │   └─ Advances to next exercise (loop)
            │   │
            │   └─ IF ALL DONE:
            │       ↓
            │       LessonCompletionScreen
            │       ├─ Celebration banner
            │       ├─ Lesson review card
            │       ├─ Exercises summary:
            │       │   ├─ Exercise 1: 100% (3 stars)
            │       │   ├─ Exercise 2: 85% (2 stars)
            │       │   └─ Exercise N
            │       ├─ CoquiMascot (celebration state)
            │       └─ "Back to Dashboard" button
            │           ↓
            │           Back to StudentLessonsProgress
            │           (next lesson now unlocked)
            │
            └─ IF FAILED (score < passing_score):
                ├─ Error feedback
                ├─ NOT saved
                └─ "Try Again" to retry current exercise
```

---

## Component File Locations

### Page Components (Routable)
```
/src/pages/
├─ StudentDashboard.tsx
├─ StudentLessonsProgress.tsx
├─ StudentExercisesProgress.tsx
├─ StudentAssessmentsProgress.tsx
├─ ViewLesson.tsx
├─ LessonExerciseFlow.tsx
├─ ViewAssessment.tsx
└─ LessonCompletionScreen.tsx (exported from /components)
```

### Layout Components
```
/src/components/StudentDashboard/
├─ ActivityCards.tsx
├─ LessonCard.tsx
├─ ExerciseCard.tsx
├─ AssessmentCard.tsx
├─ DomainHeader.tsx
├─ CoquiVoiceChat.tsx
└─ VoiceTraining.tsx
```

### Exercise Players
```
/src/components/ManualAssessment/
├─ ExercisePlayer.tsx (main dispatcher)
└─ players/
    ├─ MultipleChoicePlayer.tsx
    ├─ TrueFalsePlayer.tsx
    ├─ FillBlankPlayer.tsx
    ├─ WriteAnswerPlayer.tsx
    ├─ DragDropPlayer.tsx
    └─ MatchModePlayer.tsx
```

### Completion & Voice
```
/src/components/LessonCompletion/
└─ LessonCompletionScreen.tsx

/src/components/coqui/
├─ CoquiLessonAssistantGuard.tsx
├─ CoquiVoiceBridge.tsx
├─ CoquiMascot.jsx
└─ [other voice-related components]
```

---

## Component Props Reference

### LessonCard
```typescript
Props:
  lesson: {id, title, description, ...}
  isLocked: boolean
  exerciseProgress?: {completed, total}
  onClick?: () => void
```

### ExercisePlayer
```typescript
Props:
  exercise: {id, title, content, subtype, passing_score, ...}
  onComplete: (score: number, passed: boolean) => void
  onExit: () => void
  voiceClient?: any
```

### LessonCompletionScreen
```typescript
Props:
  lesson: {id, title, description, content, ...}
  exercises: Array<{id, title, content, ...}>
  exerciseScores: Map<string, number>
  onReturn: () => void
```

### CoquiLessonAssistantGuard
```typescript
Props:
  activityId: string
  activityType: 'lesson' | 'exercise'
  voiceContext: {
    title: string
    subtype: string
    language: string
    voiceGuidance: string
    coquiDialogue?: string
    pronunciationWords?: string[]
    content?: object
  }
  autoConnect?: boolean
  position?: 'inline' | 'fixed'
  className?: string
```

---

## URL Routes

```
/student-dashboard                      → StudentDashboard
/student-dashboard/lessons              → StudentLessonsProgress
/student-dashboard/exercises            → StudentExercisesProgress
/student-dashboard/assessments          → StudentAssessmentsProgress
/lesson/:id                             → ViewLesson
/lesson/:lessonId/exercises             → LessonExerciseFlow
/assessment/:id                         → ViewAssessment
/view-assessment/:id                    → ViewAssessment
```

---

## Database Model

### manual_assessments Table

```typescript
type: 'lesson' | 'exercise' | 'assessment'
subtype?: 'multiple_choice' | 'true_false' | 'fill_blank' | 'write_answer' | 'drag_drop'
id: string (UUID)
title: string
description?: string
content: JSON (structure varies by type)
parent_lesson_id?: string (NULL for lessons, points to lesson for exercises)
order_in_lesson?: number (for ordering within a lesson)
passing_score?: number (default 70)
voice_guidance?: string (Coquí prompt)
pronunciation_words?: string[]
coqui_dialogue?: string
grade_level: number
language: 'en' | 'es' | 'es-PR'
created_by: string (user ID)
published_at?: timestamp
```

### completed_activity Table

```typescript
student_id: string (user ID)
activity_id: string (manual_assessments ID)
activity_type: 'lesson' | 'exercise' | 'assessment'
score?: number (exercise/assessment score, NULL for lessons)
completed_at: timestamp
```

### lesson_ordering Table

```typescript
id: string
assessment_id: string (lesson ID)
grade_level: number
domain_name: string
display_order: number
parent_lesson_id?: string (for nested lesson structures)
```

---

## Exercise Type Behaviors

### multiple_choice
- Shows question + multiple answer options
- One correct answer
- Score: 100% if correct, 0% if wrong

### true_false
- Shows question + True/False buttons
- One correct answer
- Score: 100% if correct, 0% if wrong

### fill_blank
- Shows text with blanks ____ 
- Drag words from list to fill blanks
- Score based on number of correct placements
- Voice: pronunciation_words supported

### write_answer
- Shows question
- Text input field for student answer
- Considered correct if non-empty (no AI grading)
- Score: 100% if attempted, 0% if blank

### drag_drop
- Shows items to drag and target zones
- Multiple modes: match, sequence, categorize
- Score based on correct placements
- Voice: auto-read supported

---

## State Flow Example: ExercisePlayer

```typescript
Initial: {
  selectedAnswer: null,
  showFeedback: false,
  isCorrect: null,
  score: 0,
  hasCompleted: false
}

User selects answer:
  ↓
  selectedAnswer = 2
  showFeedback = true
  isCorrect = true (if answer[2].isCorrect)
  score = 100
  
  // Triggers confetti if correct
  
User clicks "Continue":
  ↓
  hasCompleted = true
  onComplete(100, true) called
  
  // Component unmounts, next exercise loads
```

---

## Lesson Unlocking Logic

```
First lesson: ALWAYS unlocked

Subsequent lessons:
  IF (prerequisite lesson completed):
    → UNLOCKED
  ELSE:
    → LOCKED (grayed out, unclickable)

Prerequisite = previous lesson in display_order
```

---

## Exercise Navigation in LessonExerciseFlow

```
Scenario 1: Sequential completion
  Exercise 1 ✓ → Exercise 2 ⭕ → Exercise 3 🔒 → Exercise 4 🔒
  (User passes Ex 1, Auto-advances to Ex 2)

Scenario 2: User retakes
  Exercise 1 ✓ → Exercise 2 ⭕ (fail)
  (User can click "Try Again" to retry Ex 2)
  (Or click circle to go back to Ex 1)

Scenario 3: Skip ahead
  Exercise 1 ✓ → Exercise 2 ⭕ → Exercise 3 (can click)
  (Once Ex 1 passed, Ex 3 becomes clickable even if Ex 2 not done)

Locking: Always based on highest completed:
  max_unlocked_index = Math.max(...completedIndexes) + 1
  exercises[index] unlocked if index <= max_unlocked_index
```

---

## Error Handling Flows

### Lesson Locked
```
ViewLesson receives locked status
  ↓
Shows lock icon + "Complete previous lesson" message
  ↓
"View My Lessons" button → StudentLessonsProgress
```

### No Exercises After Lesson
```
ViewLesson completion
  ↓
Checks: .from('manual_assessments').eq('parent_lesson_id', id)
  ↓
Empty result array
  ↓
Shows confetti + redirects to lessons
```

### Exercise Not Found
```
LessonExerciseFlow loads
  ↓
currentExercise = exercises[currentExerciseIndex]
  ↓
!currentExercise condition
  ↓
Shows loading spinner or error
```

---

## Key Files by Function

### Fetching Data
- `src/hooks/useLessonOrdering.ts` - gets lesson order & domains
- `src/hooks/useStudentProgress.ts` - gets completion status
- `src/utils/lessonUnlocking.ts` - checks if lesson locked

### Navigation
- `src/App.tsx` - route definitions

### Voice Support
- `src/components/coqui/` - all voice-related
- `src/utils/realtime/` - voice connection

### Styling
- `src/hooks/useUnitColor.ts` - gets color scheme per unit
- Theme from Tailwind configuration

---

## Common Props Combinations

### Showing a Lesson
```typescript
<ViewLesson 
  lessonId={id}
  onNavigate={() => navigate(...)}
/>
```

### Showing Exercise Flow
```typescript
<LessonExerciseFlow 
  lessonId={lessonId}
  onComplete={handleCompletion}
/>
```

### Showing Individual Exercise
```typescript
<ExercisePlayer
  exercise={exercise}
  onComplete={handleExerciseComplete}
  onExit={handleExit}
/>
```

### With Voice Support
```typescript
<CoquiLessonAssistantGuard
  activityId={lesson.id}
  activityType="lesson"
  voiceContext={{
    title: lesson.title,
    language: student.language,
    voiceGuidance: lesson.voice_guidance,
  }}
/>
```

