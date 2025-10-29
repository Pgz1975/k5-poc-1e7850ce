# Component Nesting Architecture Analysis

## Overview
This document maps the complete component hierarchy for educational content (Lessons, Exercises, and Assessments) in the K5 POC application.

---

## 1. Database Layer - Component Container Model

All educational content is stored in a single `manual_assessments` table with type differentiation:

### Manual Assessments Table Schema
```
manual_assessments:
  - id (PK)
  - type: enum ["lesson", "exercise", "assessment"]
  - subtype: string (multiple_choice, true_false, fill_blank, write_answer, drag_drop)
  - parent_lesson_id: foreign key (self-referential for exercises)
  - order_in_lesson: number (for ordering within lessons)
  - grade_level: number
  - language: language_code
  - content: JSON (varies by type)
  - passing_score: number
  - voice_guidance: string (for Coquí integration)
  - title, description, created_by, published_at, etc.
```

### Key Relationships
```
LESSON (type='lesson')
  └── EXERCISES (type='exercise', parent_lesson_id=lesson.id)
       ├── Exercise 1 (subtype='multiple_choice')
       ├── Exercise 2 (subtype='fill_blank')
       └── Exercise N (subtype='drag_drop')

ASSESSMENT (type='assessment')
  └── Standalone exercises (type='exercise', parent_lesson_id=assessment.id)
```

---

## 2. Routing Architecture

### Route Map
```
App.tsx (BrowserRouter)
├── /student-dashboard → StudentDashboard.tsx (main landing)
│   ├── Activities overview with mascot
│   └── Navigation cards
│
├── /student-dashboard/lessons → StudentLessonsProgress.tsx
│   └── Lists all lessons grouped by domain
│
├── /lesson/:id → ViewLesson.tsx
│   ├── Displays lesson content
│   ├── CoquiLessonAssistantGuard (voice support)
│   └── "Mark as Complete" button
│
├── /lesson/:lessonId/exercises → LessonExerciseFlow.tsx
│   ├── Sequential exercise progression
│   ├── Exercise navigator (circles showing progress)
│   └── Each exercise shown via ExercisePlayer
│
├── /student-dashboard/exercises → StudentExercisesProgress.tsx
│   └── Lists all exercises grouped by parent lesson
│
├── /assessment/:id → ViewAssessment.tsx
│   └── Displays standalone assessments
│
└── /student-dashboard/assessments → StudentAssessmentsProgress.tsx
    └── Lists all standalone assessments
```

---

## 3. Component Nesting Hierarchy

### Level 1: Page Components (Router Endpoints)

#### A. ViewLesson.tsx
**Purpose**: Display lesson content to student
**Props**: lessonId from URL param
**Data Flow**:
```
ViewLesson
  ├── Fetches: manual_assessments WHERE id=:id AND type='lesson'
  ├── Displays:
  │   ├── Header
  │   ├── Lesson Title + Description
  │   ├── Lesson Content (text, images, HTML)
  │   ├── CoquiLessonAssistantGuard (voice interaction)
  │   ├── CoquiVoiceBridge (navigation guard)
  │   └── Buttons: "Back" | "Mark as Complete"
  └── On Complete:
      ├── Saves to completed_activity table
      ├── Checks for child exercises
      ├── If exercises exist → navigate to /lesson/:id/exercises
      └── If no exercises → return to dashboard + confetti
```

**Child Components**:
- Header.tsx
- Footer.tsx
- Card, CardContent (UI)
- CoquiLessonAssistantGuard.tsx
- CoquiVoiceBridge.tsx
- Button (UI)

---

#### B. LessonExerciseFlow.tsx
**Purpose**: Sequential exercise progression within a lesson
**Props**: lessonId from URL param
**Data Flow**:
```
LessonExerciseFlow
  ├── Fetches: 
  │   ├── Lesson: manual_assessments WHERE id=:lessonId AND type='lesson'
  │   └── Exercises: manual_assessments WHERE parent_lesson_id=:lessonId
  │                                    ORDER BY order_in_lesson ASC
  │
  ├── Displays:
  │   ├── Progress Bar (% completed)
  │   ├── Exercise Navigator (circles 1-N)
  │   │   └── Circles show: current, completed, locked, unlocked
  │   ├── ExercisePlayer (current exercise)
  │   ├── CoquiLessonAssistantGuard (voice)
  │   └── CoquiVoiceBridge (navigation guard)
  │
  ├── State Management:
  │   ├── currentExerciseId
  │   ├── completedExercises (Set<string>)
  │   └── exerciseScores (Map<string, number>)
  │
  └── On Exercise Complete:
      ├── Updates local state
      ├── Saves to completed_activity
      ├── Advances to next incomplete or next sequential
      ├── If all exercises done → show LessonCompletionScreen
      └── Exercise navigation is unlocked sequentially
```

**Child Components**:
- Progress (UI)
- ExercisePlayer.tsx
- LessonCompletionScreen.tsx
- CoquiLessonAssistantGuard.tsx
- CoquiVoiceBridge.tsx
- ActivityActions.tsx
- Button (UI)

---

#### C. ExercisePlayer.tsx
**Purpose**: Render and handle a single exercise
**Props**: 
```typescript
{
  exercise: {
    id, title, content, subtype, passing_score
  },
  onComplete: (score, passed) => void,
  onExit: () => void
}
```

**Data Flow**:
```
ExercisePlayer
  ├── Input validation & normalization
  ├── State Management:
  │   ├── selectedAnswer
  │   ├── showFeedback
  │   ├── isCorrect
  │   ├── score
  │   └── hasCompleted
  │
  ├── Renders appropriate player based on subtype:
  │   ├── 'multiple_choice' → MultipleChoicePlayer
  │   ├── 'true_false' → TrueFalsePlayer
  │   ├── 'fill_blank' → FillBlankPlayer
  │   ├── 'write_answer' → WriteAnswerPlayer
  │   └── 'drag_drop' → DragDropPlayer
  │
  ├── Question Display Card
  │   ├── Question text
  │   └── Question image (if exists)
  │
  └── Feedback Card
      ├── Correct/Incorrect indicator
      ├── Score display
      ├── If Passed:
      │   └── "Continue" button → onComplete(score, true)
      └── If Failed:
          ├── "Try Again" button
          └── "Exit" button
```

**Child Components**:
- MultipleChoicePlayer.tsx
- TrueFalsePlayer.tsx
- FillBlankPlayer.tsx
- WriteAnswerPlayer.tsx
- DragDropPlayer.tsx
- Card, CardContent (UI)
- Button (UI)
- ActivityActions.tsx

---

#### D. LessonCompletionScreen.tsx
**Purpose**: Celebration screen after all exercises in a lesson complete
**Props**:
```typescript
{
  lesson: { id, title, description, content },
  exercises: Exercise[],
  exerciseScores: Map<string, number>,
  onReturn: () => void
}
```

**Data Flow**:
```
LessonCompletionScreen
  ├── Triggers confetti animation
  ├── Displays:
  │   ├── "🎉 Lesson Complete! 🎉" banner
  │   ├── Lesson content review card
  │   ├── Exercises summary card with:
  │   │   ├── Exercise title
  │   │   ├── Score percentage
  │   │   └── Star rating (1-3 stars)
  │   ├── Coquí mascot (celebration state)
  │   └── "Back to Dashboard" button
  │
  └── onClick → onReturn() → navigate to /student-dashboard/lessons
```

**Child Components**:
- Card, CardContent, CardHeader, CardTitle (UI)
- CoquiMascot.tsx
- Star (icon)
- Button (UI)

---

#### E. StudentLessonsProgress.tsx
**Purpose**: Dashboard showing all lessons for student's grade
**Data Flow**:
```
StudentLessonsProgress
  ├── Fetches:
  │   ├── Student profile (grade_level, learningLanguages)
  │   ├── All lessons: manual_assessments WHERE type='lesson'
  │   │                                  AND grade_level=student.grade
  │   │                                  AND language IN student.languages
  │   ├── Lesson ordering: lesson_ordering table
  │   └── Completed lessons: completed_activity WHERE activity_type='lesson'
  │
  ├── Groups lessons by domain
  ├── Sorts by domain_order, then display_order
  ├── Calculates exercise progress for each lesson
  │
  ├── Displays:
  │   ├── For each domain:
  │   │   ├── DomainHeader (domain name, progress %)
  │   │   └── For each lesson:
  │   │       ├── LessonCard
  │   │       │   ├── Title, description
  │   │       │   ├── Status: locked, in-progress, completed
  │   │       │   ├── Exercise progress bar
  │   │       │   └── onClick → /lesson/:id
  │   │       └── Can click only if unlocked
  │   │
  │   └── Locking Rules:
  │       ├── First lesson always unlocked
  │       └── Next lesson unlocks when previous completes
  │
  └── Returns navigate to /lesson/:id
```

**Child Components**:
- Header, Footer (UI)
- LessonCard.tsx
- DomainHeader.tsx
- DomainGroup (structure)
- Card, CardContent (UI)
- Button (UI)
- Progress (UI)

---

#### F. StudentExercisesProgress.tsx
**Purpose**: Dashboard showing all exercises, grouped by parent lesson
**Data Flow**:
```
StudentExercisesProgress
  ├── Fetches:
  │   ├── All exercises: manual_assessments WHERE type='exercise'
  │   │                                  AND parent_lesson_id IS NOT NULL
  │   ├── Parent lessons: (via relation)
  │   ├── Completed exercises: completed_activity
  │   └── Domain info: lesson_ordering
  │
  ├── Groups exercises by parent_lesson_id
  ├── For each group:
  │   ├── Shows parent lesson name
  │   └── Lists all exercises in lesson
  │
  └── Each exercise links to /lesson/:lessonId/exercises
```

**Child Components**:
- ExerciseCard.tsx
- Card, CardContent (UI)
- Button (UI)

---

#### G. ViewAssessment.tsx
**Purpose**: Display standalone assessment (not part of lesson flow)
**Data Flow**:
```
ViewAssessment
  ├── Fetches: manual_assessments WHERE id=:id
  ├── Displays: Assessment player component
  └── Handles assessment submission (may be teacher-graded)
```

**Child Components**:
- MultipleChoicePlayer.tsx
- TrueFalsePlayer.tsx
- FillBlankPlayer.tsx
- WriteAnswerPlayer.tsx
- DragDropPlayer.tsx
- CoquiLessonAssistant.tsx

---

#### H. StudentAssessmentsProgress.tsx
**Purpose**: Dashboard showing all standalone assessments
**Data Flow**: Similar to StudentExercisesProgress but filters by type='assessment'

---

### Level 2: Container/Layout Components

#### LessonCard.tsx
**Purpose**: Individual lesson card on StudentLessonsProgress
**Props**:
```typescript
{
  lesson: { id, title, description, ... },
  isLocked: boolean,
  exerciseProgress?: { completed, total },
  onClick: () => void
}
```

**Displays**:
- Lesson title & description
- Exercise progress indicator
- Lock icon if locked
- Visual unlock status

---

#### ExerciseCard.tsx
**Purpose**: Individual exercise card on StudentExercisesProgress
**Props**:
```typescript
{
  exercise: { id, title, subtype, ... },
  isCompleted: boolean,
  score?: number,
  onClick: () => void
}
```

**Displays**:
- Exercise title
- Subtype badge
- Completion checkmark
- Score if completed

---

#### ActivityCards.tsx
**Purpose**: Quick navigation cards on StudentDashboard
**Displays**:
- Lessons button
- Exercises button
- Assessments button
- Recent activities

---

### Level 3: Player Components (Exercise Type Renderers)

#### MultipleChoicePlayer.tsx
```
MultipleChoicePlayer
  ├── Props: { content, onAnswer, selectedAnswer, showFeedback, isCorrect }
  ├── Displays:
  │   ├── Multiple choice options as buttons
  │   └── Feedback on selection
  └── Triggers confetti on correct answer
```

---

#### TrueFalsePlayer.tsx
```
TrueFalsePlayer
  ├── Props: { content, onAnswer, selectedAnswer, showFeedback, isCorrect }
  ├── Displays:
  │   ├── True/False buttons
  │   └── Feedback
  └── Simplified version of MultipleChoice
```

---

#### FillBlankPlayer.tsx
```
FillBlankPlayer
  ├── Props: { content, onAnswer, voiceClient }
  ├── Displays:
  │   ├── Question text with blanks
  │   ├── Drag-and-drop target zones
  │   └── Answer words to drag
  └── Voice integration: pronunciation words
```

---

#### WriteAnswerPlayer.tsx
```
WriteAnswerPlayer
  ├── Props: { content, onAnswer, voiceClient }
  ├── Displays:
  │   ├── Question
  │   ├── Text input field
  │   └── Submit button
  └── Voice integration: auto-read question
```

---

#### DragDropPlayer.tsx
```
DragDropPlayer
  ├── Props: { content, onAnswer, voiceClient }
  ├── Displays:
  │   ├── Question with images/labels
  │   ├── Sortable drag-drop zones
  │   └── Visual feedback
  └── Modes: match, sequence, categorize
```

---

### Level 4: Voice Integration Components

#### CoquiLessonAssistantGuard.tsx
**Purpose**: Wrapper that safely manages Coquí voice session
**Props**:
```typescript
{
  activityId: string,
  activityType: 'lesson' | 'exercise',
  voiceContext: {
    title, subtype, language, voiceGuidance, content
  },
  autoConnect: boolean,
  position: 'inline' | 'fixed'
}
```

**Features**:
- Auto-connects on desktop, manual on mobile
- Displays microphone icon/button
- Handles session lifecycle

---

#### CoquiVoiceBridge.tsx
**Purpose**: Navigation guard for voice cleanup
**Props**:
```typescript
{
  activityId: string,
  activityType: 'lesson' | 'exercise',
  voiceContext: object,
  endSessionRef: MutableRefObject
}
```

**Features**:
- Exposes endSession function via ref
- Prevents navigation while voice session active
- Graceful cleanup

---

#### CoquiMascot.jsx
**Purpose**: Animated mascot for brand identity
**Props**:
```javascript
{
  state: 'happy' | 'thinking' | 'celebration' | 'listening',
  size: 'small' | 'medium' | 'large',
  position: 'inline' | 'fixed',
  className: string
}
```

---

## 4. Data Flow Diagram

### Complete User Journey: Lesson → Exercises → Completion

```
StudentDashboard (/student-dashboard)
    ↓ click "Lessons"
    ↓
StudentLessonsProgress (/student-dashboard/lessons)
    ├─ Fetches all lessons (type='lesson', grade_level=student.grade)
    ├─ Groups by domain
    ├─ Checks locks based on lesson_ordering
    └─ Each lesson card is "available" or "locked"
    ↓ click on available lesson
    ↓
ViewLesson (/lesson/:id)
    ├─ Fetches: manual_assessments WHERE id=:id AND type='lesson'
    ├─ Displays lesson content
    ├─ Saves completion on "Mark as Complete"
    └─ Checks for child exercises (WHERE parent_lesson_id=:id)
    ↓ if exercises exist, click "Mark as Complete"
    ↓
LessonExerciseFlow (/lesson/:lessonId/exercises)
    ├─ Fetches exercises (WHERE parent_lesson_id=:lessonId)
    ├─ Shows progress bar and exercise navigator
    ├─ Current exercise shown via ExercisePlayer
    ├─ ExercisePlayer renders appropriate player type
    ├─ Each exercise saves to completed_activity on pass
    ├─ Advances to next exercise or shows completion screen
    └─ Loop until all exercises complete
    ↓ on all exercises complete
    ↓
LessonCompletionScreen
    ├─ Shows celebration with confetti
    ├─ Lists all exercises with scores
    └─ "Back to Dashboard" button
    ↓ click "Back to Dashboard"
    ↓
StudentLessonsProgress (/student-dashboard/lessons)
    └─ Updated with completed lesson + next lesson now unlocked
```

---

## 5. State Management Architecture

### Query Keys (React Query)
```typescript
// Lessons
['lesson', lessonId]
['lessons-with-order', gradeLevel]
['student-progress', 'lesson', gradeLevel, learningLanguages]

// Exercises
['lesson-exercises', lessonId]
['completed-exercises', lessonId, userId]
['lesson-exercise-progress']
['all-lessons-exercise-progress', userId]

// Assessments
['assessment', assessmentId]
['assessments', gradeLevel]
```

### Local State (Component Level)
```typescript
// LessonExerciseFlow
- currentExerciseId: string
- completedExercises: Set<string>
- exerciseScores: Map<string, number>
- showCelebration: boolean
- endSessionRef: MutableRefObject<endSession>

// ExercisePlayer
- selectedAnswer: number | null
- showFeedback: boolean
- isCorrect: boolean | null
- score: number
- hasCompleted: boolean

// StudentLessonsProgress
- sortedLessons: Lesson[]
- exerciseProgressMap: Map<lessonId, progress>
```

---

## 6. Component Containment Summary

### What Contains What

```
APP LEVEL
├─ App.tsx (Router setup)
│  └─ AppRoutes()
│     ├─ ViewLesson.tsx (Lesson display)
│     │  └─ CoquiLessonAssistantGuard
│     │     └─ CoquiMascot
│     │
│     ├─ LessonExerciseFlow.tsx (Exercise sequence)
│     │  ├─ ExercisePlayer.tsx (Individual exercise)
│     │  │  ├─ MultipleChoicePlayer.tsx
│     │  │  ├─ TrueFalsePlayer.tsx
│     │  │  ├─ FillBlankPlayer.tsx
│     │  │  ├─ WriteAnswerPlayer.tsx
│     │  │  ├─ DragDropPlayer.tsx
│     │  │  └─ ActivityActions.tsx
│     │  │
│     │  ├─ LessonCompletionScreen.tsx
│     │  │  └─ CoquiMascot
│     │  │
│     │  ├─ CoquiLessonAssistantGuard
│     │  └─ CoquiVoiceBridge
│     │
│     ├─ StudentDashboard.tsx (Main landing)
│     │  ├─ ActivityCards.tsx
│     │  └─ CoquiVoiceChat.tsx
│     │
│     ├─ StudentLessonsProgress.tsx (Lessons list)
│     │  ├─ DomainHeader.tsx
│     │  └─ LessonCard.tsx
│     │
│     ├─ StudentExercisesProgress.tsx (Exercises list)
│     │  └─ ExerciseCard.tsx
│     │
│     ├─ ViewAssessment.tsx (Assessment display)
│     │  ├─ MultipleChoicePlayer.tsx
│     │  ├─ TrueFalsePlayer.tsx
│     │  └─ [Other players]
│     │
│     └─ StudentAssessmentsProgress.tsx (Assessments list)
│        └─ AssessmentCard.tsx
│
└─ Root layout
   ├─ Header.tsx
   ├─ Main content (route)
   └─ Footer.tsx
```

---

## 7. Type Hierarchy in Database

### Type Field Values
```
type='lesson'
  ├─ Standalone educational unit
  ├─ Contains theory, explanation, multimedia
  ├─ parent_lesson_id is NULL
  └─ Can have exercises (via parent_lesson_id in other records)

type='exercise'
  ├─ Subtype: multiple_choice, true_false, fill_blank, write_answer, drag_drop
  ├─ Can belong to lesson (parent_lesson_id = lesson.id)
  ├─ Can belong to assessment (parent_lesson_id = assessment.id)
  └─ Or standalone in activities view

type='assessment'
  ├─ Teacher-created or system-generated assessment
  ├─ May contain exercises
  └─ Can have different completion/grading rules
```

---

## 8. Routing and Component Relationships

### By Component Type

#### Page Components (Full Screen)
- ViewLesson.tsx
- LessonExerciseFlow.tsx
- StudentDashboard.tsx
- StudentLessonsProgress.tsx
- StudentExercisesProgress.tsx
- ViewAssessment.tsx
- StudentAssessmentsProgress.tsx

#### Layout Components (Sections/Cards)
- LessonCard.tsx
- ExerciseCard.tsx
- AssessmentCard.tsx
- ActivityCards.tsx
- DomainHeader.tsx

#### Exercise Renderers (Exercise Type Specific)
- ExercisePlayer.tsx (dispatcher)
- MultipleChoicePlayer.tsx
- TrueFalsePlayer.tsx
- FillBlankPlayer.tsx
- WriteAnswerPlayer.tsx
- DragDropPlayer.tsx

#### Specialized Components
- LessonCompletionScreen.tsx (celebration)
- CoquiLessonAssistantGuard.tsx (voice)
- CoquiVoiceBridge.tsx (voice cleanup)
- CoquiMascot.jsx (brand mascot)

---

## 9. Key Integration Points

### Voice Integration
```
All activities support optional voice guidance:
├─ ViewLesson.tsx
│  ├─ CoquiLessonAssistantGuard
│  └─ voice_guidance field from lesson
│
├─ LessonExerciseFlow.tsx
│  ├─ CoquiLessonAssistantGuard per exercise
│  └─ exercise.voice_guidance + pronunciation_words
│
└─ Coquí bridge manages session lifecycle
   └─ Cleanup on navigation between activities
```

### Progress Tracking
```
completed_activity table:
├─ student_id, activity_id, activity_type
├─ score (for exercises/assessments)
├─ completed_at timestamp
└─ Used by all progress views
```

### Lesson Unlocking
```
lesson_ordering table controls:
├─ display_order (visual sequence)
├─ domain_name (grouping)
├─ Links lesson to ordering
└─ lessonUnlocking utility:
   ├─ Checks if prerequisite lessons complete
   └─ Used in ViewLesson lock status check
```

---

## 10. Component Communication Patterns

### Props Drilling
- ViewLesson → CoquiLessonAssistantGuard (voice context)
- LessonExerciseFlow → ExercisePlayer (exercise + callbacks)
- StudentLessonsProgress → LessonCard (lesson + status)

### URL Parameters
- `/lesson/:id` - lesson ID
- `/lesson/:lessonId/exercises` - lesson ID for exercise set
- `/assessment/:id` - assessment ID

### Query/Mutation Hooks
- useQuery for data fetching
- useMutation for completion tracking
- React Query cache invalidation on success

### Refs
- ViewLesson uses endSessionRef for voice cleanup on navigation
- LessonExerciseFlow uses endSessionRef for exercise transitions

---

## 11. Visual Component Hierarchy

```
VIEWPORT (Full Screen)
│
├─ Header.tsx (top nav)
│  ├─ Navigation buttons
│  └─ Logo
│
├─ MAIN CONTENT (route-dependent)
│  │
│  ├─ If StudentDashboard:
│  │  ├─ Welcome section with CoquiMascot
│  │  ├─ ActivityCards.tsx
│  │  └─ CoquiVoiceChat.tsx
│  │
│  ├─ If StudentLessonsProgress:
│  │  ├─ For each domain:
│  │  │  ├─ DomainHeader
│  │  │  └─ Cards container
│  │  │     └─ For each lesson:
│  │  │        └─ LessonCard
│  │  │           ├─ Title
│  │  │           ├─ Progress bar (exercises)
│  │  │           └─ Status indicator
│  │  │
│  │
│  ├─ If ViewLesson:
│  │  ├─ Lesson Card (title + description)
│  │  ├─ Content area
│  │  ├─ Coquí mascot sidebar (desktop only)
│  │  └─ Action buttons (Back, Mark Complete)
│  │
│  ├─ If LessonExerciseFlow:
│  │  ├─ Progress bar (% complete)
│  │  ├─ Exercise navigator (circles)
│  │  ├─ ExercisePlayer container
│  │  │  ├─ Header with exercise title
│  │  │  ├─ Question card
│  │  │  ├─ Exercise type player
│  │  │  │  └─ [MultiChoice|TrueFalse|FillBlank|...]
│  │  │  └─ Feedback card
│  │  ├─ Coquí assistant
│  │  └─ Voice bridge (invisible)
│  │
│  └─ If LessonCompletionScreen:
│     ├─ Celebration header
│     ├─ Lesson review card
│     ├─ Exercises summary card
│     ├─ Coquí mascot (celebration)
│     └─ Return button
│
└─ Footer.tsx (bottom)
   └─ Copyright, links, language switcher
```

---

## Summary

The component nesting architecture follows these principles:

1. **Flat Database Model**: All content (lessons, exercises, assessments) in one table with type differentiation
2. **Hierarchical Display**: Lessons contain exercises via parent_lesson_id, displayed as sequential flow
3. **Component Specialization**: Player components adapt to exercise subtype
4. **Progressive Navigation**: Dashboard → Lesson → Exercise Flow → Completion → Dashboard
5. **Voice Integration**: Optional at every level via CoquiLessonAssistantGuard
6. **Progress Tracking**: Centralized via completed_activity table
7. **Responsive Design**: Desktop shows voice assistant inline, mobile shows overlay

