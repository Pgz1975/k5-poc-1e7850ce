## **Complete Implementation Plan: Lesson → Sequential Exercise Flow**

### **Overview**
Transform the lesson viewing experience so that after marking a lesson complete, students are automatically guided through all associated exercises sequentially, with progress tracking and the ability to resume where they left off.

---

### **Phase 1: Database Schema Updates**

#### **1.1 Add `order_in_lesson` Column Population**
Currently `order_in_lesson` exists but is NULL for all exercises. We need to set proper ordering:

```sql
-- Update existing exercises to have proper order_in_lesson values
UPDATE manual_assessments 
SET order_in_lesson = subquery.row_num
FROM (
  SELECT id, 
         ROW_NUMBER() OVER (PARTITION BY parent_lesson_id ORDER BY created_at) - 1 as row_num
  FROM manual_assessments
  WHERE parent_lesson_id IS NOT NULL
) AS subquery
WHERE manual_assessments.id = subquery.id;
```

#### **1.2 Add Teacher-Defined Passing Score**
Add column for minimum passing score (as per requirement "Teacher-defined per exercise"):

```sql
-- Add passing_score column to manual_assessments
ALTER TABLE manual_assessments 
ADD COLUMN IF NOT EXISTS passing_score INTEGER DEFAULT 70;

COMMENT ON COLUMN manual_assessments.passing_score IS 'Minimum score (0-100) required to mark exercise as completed';
```

#### **1.3 Update `completed_activity` to Track Exercise Completion**
Ensure `completed_activity` can track individual exercise completion within lessons:
- Already has `activity_type` ('lesson', 'exercise')
- Already has `activity_id` (can be lesson or exercise ID)
- Already has `score` field
- **No schema changes needed** ✅

---

### **Phase 2: New Exercise Flow Components**

#### **2.1 Create `LessonExerciseFlow.tsx` Page**
**Path:** `src/pages/LessonExerciseFlow.tsx`

**Purpose:** Manages the sequential exercise flow after lesson completion

**Key Features:**
- Fetches all exercises for the lesson (ordered by `order_in_lesson`)
- Fetches student's completion status for each exercise
- Displays current exercise using existing players
- Handles exercise submission and progression logic
- Shows celebration when all exercises complete
- "Back" button to return to dashboard

**State Management:**
```typescript
- exercises: Exercise[] // All exercises for this lesson
- currentExerciseIndex: number // Which exercise is active
- completedExercises: Set // IDs of completed exercises
- exerciseScores: Map // Score for each exercise
- showCelebration: boolean // All exercises done
```

**URL Structure:** `/lesson/:lessonId/exercises`

#### **2.2 Create `ExercisePlayer.tsx` Component**
**Path:** `src/components/ManualAssessment/ExercisePlayer.tsx`

**Purpose:** Unified wrapper that routes to correct player based on `subtype`

**Props:**
```typescript
interface ExercisePlayerProps {
  exercise: Exercise;
  onComplete: (score: number, passed: boolean) => void;
  onExit: () => void; // Back button handler
  voiceClient?: EnhancedRealtimeClient;
}
```

**Logic:**
- Switch on `exercise.subtype` to render correct player
- Handle completion logic uniformly
- Calculate score based on exercise type
- Compare score against `passing_score` to determine pass/fail
- Show feedback and "Next" button when complete

#### **2.3 Create `LessonCompletionScreen.tsx` Component**
**Path:** `src/components/LessonCompletion/LessonCompletionScreen.tsx`

**Purpose:** Shows when all exercises are done

**Features:**
- Confetti animation
- "¡Lección Completada!" message
- Shows lesson content again (as per requirement)
- List of completed exercises with scores
- Stars earned (one per completed exercise)
- "Volver al Dashboard" button
- Coquí mascot in celebration state

---

### **Phase 3: Modify `ViewLesson.tsx`**

#### **3.1 Update `handleComplete` Function**
After marking lesson complete, check if exercises exist:

```typescript
const handleComplete = async () => {
  try {
    // ... existing completion logic ...

    // Check if lesson has exercises
    const { data: exercises } = await supabase
      .from("manual_assessments")
      .select("id")
      .eq("parent_lesson_id", id)
      .order("order_in_lesson");

    if (exercises && exercises.length > 0) {
      // Has exercises - navigate to exercise flow
      toast.success(t("¡Lección completada! Ahora los ejercicios.", "Lesson completed! Now the exercises."));
      navigate(`/lesson/${id}/exercises`);
    } else {
      // No exercises - return to dashboard
      confetti({ ... });
      setTimeout(() => navigate("/student-dashboard/lessons"), 1500);
    }
  } catch (error) {
    // ... error handling ...
  }
};
```

---

### **Phase 4: Update `LessonCard.tsx` Display Logic**

#### **4.1 Fetch Exercise Progress**
Add query to fetch exercise completion for the lesson:

```typescript
const { data: exerciseProgress } = useQuery({
  queryKey: ['lesson-exercise-progress', lesson.id, user?.id],
  queryFn: async () => {
    const { data: exercises } = await supabase
      .from('manual_assessments')
      .select('id')
      .eq('parent_lesson_id', lesson.id)
      .order('order_in_lesson');

    const { data: completed } = await supabase
      .from('completed_activity')
      .select('activity_id, score')
      .eq('student_id', user.id)
      .eq('activity_type', 'exercise')
      .in('activity_id', exercises.map(e => e.id));

    return {
      total: exercises.length,
      completed: completed.length,
      scores: completed
    };
  }
});
```

#### **4.2 Update Card Display**
```typescript
const isLessonCompleted = completionData?.completed_at;
const exerciseCount = exerciseProgress?.total || 0;
const completedCount = exerciseProgress?.completed || 0;
const isPartiallyComplete = isLessonCompleted && completedCount > 0 && completedCount < exerciseCount;
const isFullyComplete = isLessonCompleted && completedCount === exerciseCount;

// Button text logic
const buttonText = isFullyComplete 
  ? t("Revisar", "Review")
  : isPartiallyComplete 
    ? t("Continuar", "Resume")
    : t("Comenzar", "Start");

// Star system (filled stars = completed exercises)

  {Array.from({ length: exerciseCount }).map((_, i) => (

  ))}

// Visual state for partially completed

```

#### **4.3 Update Navigation Logic**
```typescript
const handleClick = () => {
  if (isLocked) return;

  if (isLessonCompleted && exerciseCount > 0) {
    // Has exercises - go to exercise flow
    navigate(`/lesson/${lesson.id}/exercises`);
  } else {
    // No exercises or not started - show lesson content
    navigate(`/lesson/${lesson.id}`);
  }
};
```

---

### **Phase 5: Exercise Progression Logic**

#### **5.1 In `LessonExerciseFlow.tsx`**

**Initial Load:**
```typescript
useEffect(() => {
  const determineStartingExercise = () => {
    // Find first incomplete exercise
    const firstIncomplete = exercises.findIndex(
      ex => !completedExercises.has(ex.id)
    );

    setCurrentExerciseIndex(firstIncomplete >= 0 ? firstIncomplete : 0);
  };

  determineStartingExercise();
}, [exercises, completedExercises]);
```

**Handle Exercise Completion:**
```typescript
const handleExerciseComplete = async (exerciseId: string, score: number, passed: boolean) => {
  const exercise = exercises[currentExerciseIndex];

  if (passed) {
    // Insert/update completion record
    const { data: existing } = await supabase
      .from('completed_activity')
      .select('score')
      .eq('student_id', user.id)
      .eq('activity_id', exerciseId)
      .single();

    // Only update if new score is better (as per requirement)
    if (!existing || score > existing.score) {
      await supabase.from('completed_activity').upsert({
        student_id: user.id,
        activity_id: exerciseId,
        activity_type: 'exercise',
        score: score,
        completed_at: new Date().toISOString()
      });
    }

    // Update local state
    setCompletedExercises(prev => new Set(prev).add(exerciseId));
    setExerciseScores(prev => new Map(prev).set(exerciseId, score));

    // Move to next or show celebration
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
    } else {
      setShowCelebration(true);
    }
  } else {
    // Failed - show retry option but don't advance
    toast.error(t(
      `Necesitas al menos ${exercise.passing_score}% para continuar`,
      `You need at least ${exercise.passing_score}% to continue`
    ));
  }
};
```

**Handle Back Button:**
```typescript
const handleBack = () => {
  navigate('/student-dashboard/lessons');
};
```

---

### **Phase 6: Celebration Screen Implementation**

#### **6.1 `LessonCompletionScreen.tsx` Structure**

```typescript

  {/* Confetti Effect */}

      {t("🎉 ¡Lección Completada! 🎉", "🎉 Lesson Complete! 🎉")}

  {/* Lesson Content (Again) */}

      {lesson.title}

      {/* Render lesson.content */}

  {/* Exercises Summary */}

      {t("Ejercicios Completados", "Completed Exercises")}

        {exercises.map(ex => (

            {ex.title}

              {exerciseScores.get(ex.id)}%

        ))}

  {/* Coquí Mascot */}

  {/* Return Button */}

      {t("Volver al Dashboard", "Back to Dashboard")}

```

---

### **Phase 7: Router Updates**

#### **7.1 Add New Route in `App.tsx`**

```typescript
} 
/>
```

---

### **Phase 8: Teacher Interface for `order_in_lesson`**

#### **8.1 Update `ManageLessonsDrawer.tsx`**
Add ability to set `order_in_lesson` when assigning exercises to lessons:

- Show exercises grouped by parent lesson
- Allow drag-and-drop reordering within lesson
- Auto-update `order_in_lesson` on reorder
- Show "Set Passing Score" input for each exercise

---

### **Phase 9: Edge Cases & Error Handling**

#### **9.1 No Exercises for Lesson**
- After marking complete, check exercise count
- If 0, show confetti and return to dashboard immediately
- ✅ Already handled in Phase 3.1

#### **9.2 Student Leaves Mid-Exercise**
- State is saved in `completed_activity` table
- On return, `LessonExerciseFlow` loads completion status
- Resumes at first incomplete exercise
- ✅ Handled in Phase 5.1

#### **9.3 Exercise With No Passing Score Set**
- Default to 70% (set in database migration)
- Show warning in teacher interface if not set
- Student sees default value

#### **9.4 Redo Exercise With Lower Score**
- Query checks existing score before updating
- Only upsert if new score > old score
- ✅ Handled in Phase 5.1 (requirement met)

#### **9.5 All Exercises Already Completed**
- Show completion screen immediately
- Allow reviewing any exercise
- Add dropdown or list to jump to specific exercise

---

### **Phase 10: Visual Polish**

#### **10.1 Progress Indicator**
In `LessonExerciseFlow.tsx`, show progress bar at top:

```typescript

    {t(
      `Ejercicio ${currentExerciseIndex + 1} de ${exercises.length}`,
      `Exercise ${currentExerciseIndex + 1} of ${exercises.length}`
    )}

```

#### **10.2 Exercise Navigation Menu**
Show thumbnails of all exercises (grayed out if locked):

```typescript

  {exercises.map((ex, idx) => (
     idx <= currentExerciseIndex && setCurrentExerciseIndex(idx)}
      disabled={idx > currentExerciseIndex}
      className={cn(
        "w-12 h-12 rounded-full",
        completedExercises.has(ex.id) && "bg-green-500",
        idx === currentExerciseIndex && "ring-2 ring-primary",
        idx > currentExerciseIndex && "bg-gray-300 opacity-50"
      )}
    >
      {idx + 1}

  ))}

```

---

### **Phase 11: Testing Scenarios**

1. **New Student First Lesson:**
   - Click "Start" → sees lesson content
   - Click "Mark as Complete" → redirects to first exercise
   - Complete exercise (pass) → shows next exercise
   - Complete all → celebration screen → back to dashboard

2. **Partially Completed Lesson:**
   - Student completed 2/5 exercises
   - Lesson card shows "Resume" + 2 filled stars
   - Click card → goes directly to exercise 3
   - Complete remaining → celebration

3. **Redo for Better Score:**
   - Student scored 75% on exercise
   - Clicks lesson card → celebration screen (all done)
   - Clicks on exercise 2 from list → replays it
   - Scores 90% → database updates score
   - Scores 60% → database keeps 75%

4. **No Exercises:**
   - Lesson has no exercises
   - Mark complete → confetti → back to dashboard
   - No exercise flow shown

5. **Back Button Mid-Exercise:**
   - Student on exercise 3/5
   - Clicks "Back" → returns to dashboard
   - Lesson shows "Resume" + 2 stars
   - Clicks again → resumes at exercise 3

---

### **Files to Create:**

1. `src/pages/LessonExerciseFlow.tsx` (new)
2. `src/components/ManualAssessment/ExercisePlayer.tsx` (new)
3. `src/components/LessonCompletion/LessonCompletionScreen.tsx` (new)

### **Files to Modify:**

1. `src/pages/ViewLesson.tsx` (Phase 3)
2. `src/components/StudentDashboard/LessonCard.tsx` (Phase 4)
3. `src/App.tsx` (add route - Phase 7)
4. `src/components/TeacherDashboard/ManageLessonsDrawer.tsx` (Phase 8 - optional enhancement)

### **Database Migrations:**

1. Update `order_in_lesson` for existing exercises
2. Add `passing_score` column to `manual_assessments`

---

### **Success Criteria:**

✅ Lesson completion triggers exercise flow (if exercises exist)  
✅ Exercises unlock sequentially (one at a time)  
✅ Student can exit and resume where they left off  
✅ Lesson card shows progress (X/Y stars, "Resume" button)  
✅ Only better scores update the database  
✅ Celebration screen shows lesson content + exercise list  
✅ All exercise subtypes supported (multiple_choice, true_false, fill_blank, write_answer, drag_drop)  
✅ Passing score is teacher-defined per exercise  
✅ Back button returns to dashboard  

---

