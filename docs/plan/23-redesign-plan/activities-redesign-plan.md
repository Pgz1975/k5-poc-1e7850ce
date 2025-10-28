# 🎨 V2 Duolingo-Style Redesign: Lessons & Exercises
## Complete Implementation Plan

---

## 📊 Color Inheritance System

### The Flow
```
Unit (from lesson_ordering.domain_order) 
  → Lesson Page (/lesson/:id)
    → Exercise Flow (/lesson/:id/exercises)
      → Individual Exercise Players (multiple_choice, true_false, drag_drop, etc.)
```

### Color Determination Logic
**Query `lesson_ordering` table** to get:
- `domain_order` (Unit number: 1-6)
- `domain_name` (e.g., "Vocabulario", "Conciencia fonológica")

**Map to V2 Color Scheme** (from `StudentLessonsProgress-v2.tsx`):
```typescript
const unitColorSchemes = [
  { /* Unit 1 - Pink */ bg: "bg-[hsl(329,100%,71%)]", border: "border-[hsl(329,100%,65%)]", ... },
  { /* Unit 2 - Orange */ bg: "bg-[hsl(11,100%,67%)]", border: "border-[hsl(11,100%,65%)]", ... },
  { /* Unit 3 - Amber */ bg: "bg-[hsl(27,100%,71%)]", border: "border-[hsl(27,100%,65%)]", ... },
  { /* Unit 4 - Green */ bg: "bg-[hsl(125,100%,71%)]", border: "border-[hsl(125,100%,65%)]", ... },
  { /* Unit 5 - Cyan */ bg: "bg-[hsl(176,84%,71%)]", border: "border-[hsl(176,84%,65%)]", ... },
  { /* Unit 6 - Purple */ bg: "bg-[hsl(250,100%,75%)]", border: "border-[hsl(250,100%,70%)]", ... },
];
```

---

## 🎯 Phase 1: Shared Color Resolution Hook (Week 1, Day 1)

### Goal
Create a single source of truth for unit color determination that all pages can use.

### Deliverable: `src/hooks/useUnitColor.ts`

**Features:**
- Query `lesson_ordering` by `assessment_id` (lesson or exercise ID)
- If exercise, traverse `parent_lesson_id` to find parent lesson
- Extract `domain_order` from ordering
- Return color scheme object with all V2 properties

**API:**
```typescript
const { colorScheme, isLoading } = useUnitColor(assessmentId);
// Returns: { bg, border, text, shadow, iconBg, headerBg }
```

**Logic:**
```typescript
1. Fetch assessment record to get parent_lesson_id (if exercise)
2. Query lesson_ordering with final lesson ID
3. Get domain_order (1-6)
4. Return unitColorSchemes[domain_order - 1]
5. Fallback to default (Pink - Unit 1) if not found
```

---

## 🎯 Phase 2: Lesson View Page V2 Styling (Week 1, Day 2-3)

### Target File: `src/pages/ViewLesson.tsx`

### Changes Required:

#### 2.1 Add Unit Color Integration
```typescript
import { useUnitColor } from '@/hooks/useUnitColor';

const { colorScheme, isLoading: colorLoading } = useUnitColor(id);
```

#### 2.2 Update Lesson Header Card (Lines 267-276)
**Current:** Plain white card with border-2
**New:** V2 3D button-style header with unit color

```typescript

      {/* Unit badge with color */}

        {lesson.title}
        {lesson.description && (
          {lesson.description}
        )}

```

#### 2.3 Update Complete Button (Lines 362-369)
**Current:** Standard primary button
**New:** V2 3D button with unit color

```typescript

  {t("Marcar como Completada", "Mark as Complete")}

```

#### 2.4 Update Locked State Screen (Lines 211-254)
**Current:** Gray lock icon
**New:** Unit-colored lock with opacity

```typescript

```

---

## 🎯 Phase 3: Exercise Players V2 Styling (Week 1, Day 4-5)

### Target Files:
- `src/components/ManualAssessment/ExercisePlayer.tsx` (wrapper)
- `src/components/ManualAssessment/players/MultipleChoicePlayer.tsx`
- `src/components/ManualAssessment/players/TrueFalsePlayer.tsx`
- `src/components/ManualAssessment/players/DragDropPlayer.tsx`
- `src/components/ManualAssessment/players/FillBlankPlayer.tsx`
- `src/components/ManualAssessment/players/WriteAnswerPlayer.tsx`

### 3.1 ExercisePlayer.tsx Wrapper Updates

#### Add Color Hook
```typescript
const { colorScheme } = useUnitColor(exercise.id);
```

#### Update Header Section (Lines 164-175)
**Current:** Plain header with outline button
**New:** Unit-colored banner with V2 button

```typescript

    {t('Volver', 'Back')}

    {exercise.title}

```

#### Update Question Card (Lines 178-193)
**Current:** Plain white card
**New:** Unit-colored border card

```typescript

      {exercise.content.question}

    {/* ... rest of question content */}

```

#### Update Feedback Card (Lines 199-239)
**Current:** Semantic green/red backgrounds
**New:** Keep semantic colors, add unit-colored accent

```typescript

    {/* Feedback content stays semantic */}

    {/* But action buttons use unit color when passed */}
    {passed ? (

        {t('Continuar', 'Continue')}

    ) : (
      {/* Keep outline/secondary for retry/exit */}
    )}

```

### 3.2 Individual Player Component Updates

#### MultipleChoicePlayer.tsx (Lines 31-50)
**Current:** Outline buttons that turn green/red on feedback
**New:** Unit-colored borders, semantic feedback overlay

```typescript
 onAnswer(index)}
  disabled={showFeedback}
  className={cn(
    "flex-1 p-4 sm:p-6 justify-start min-h-[80px]",
    "border-4 rounded-2xl font-bold",
    "shadow-[0_4px_0_rgba(0,0,0,0.08)]",
    "hover:shadow-[0_6px_0_rgba(0,0,0,0.12)] hover:-translate-y-0.5",
    "active:shadow-[0_2px_0_rgba(0,0,0,0.08)] active:translate-y-1",
    "transition-all duration-200",

    // Default state: unit color border
    !showFeedback && cn(colorScheme?.border, "bg-white"),

    // Feedback state: semantic colors override
    showFeedback && selectedAnswer === index && (
      isCorrect
        ? 'bg-success border-success text-white'
        : 'bg-destructive border-destructive text-white'
    )
  )}
>

    {String.fromCharCode(65 + index)})

    {answer.text}

```

#### TrueFalsePlayer.tsx (Lines 27-54)
**Similar approach:** Unit-colored borders for unselected, semantic feedback for selected

```typescript
 onAnswer(index)}
  disabled={showFeedback}
  className={cn(
    "text-xl sm:text-3xl p-6 sm:p-12 h-auto",
    "border-4 rounded-2xl font-black",
    "shadow-[0_6px_0_rgba(0,0,0,0.12)]",
    "hover:-translate-y-0.5 active:translate-y-1",

    !showFeedback && cn(colorScheme?.border, "bg-white", colorScheme?.text),

    showFeedback && selectedAnswer === index && (
      isCorrect
        ? 'bg-success border-success text-white'
        : 'bg-destructive border-destructive text-white'
    )
  )}
>
  {answer.text}

```

#### DragDropPlayer, FillBlankPlayer, WriteAnswerPlayer
**Apply same pattern:**
- Draggable items: unit-colored borders
- Drop zones: unit-colored dashed borders
- Correct drops: semantic green
- Input fields: unit-colored focus rings

---

## 🎯 Phase 4: Exercise Flow Page (Week 2, Day 1)

### Target File: `src/pages/LessonExerciseFlow.tsx`

### Changes:
1. **Add color hook** for parent lesson
2. **Update progress bar** to use unit color
3. **Update "Complete Lesson" button** to use V2 styling with unit color
4. **Pass colorScheme to ExercisePlayer** as prop

---

## 🎯 Phase 5: Global Application (Week 2, Day 2-3)

### Apply to All Grades:

#### 5.1 Test with Different Grades
- Grade 1 (Kindergarten)
- Grade 2
- Grade 3
- Grade 4
- Grade 5

#### 5.2 Verify Color Consistency
For each grade:
1. Navigate to lesson list (`/student-dashboard/lessons`)
2. Click into a lesson in Unit 4 (should be GREEN)
3. Verify lesson page has green header, button, borders
4. Complete lesson and navigate to exercises
5. Verify ALL exercises have green styling
6. Test multiple-choice, true-false, drag-drop, fill-blank

#### 5.3 Edge Cases to Test
- **Exercises without parent lesson** (orphaned) → Fallback to Unit 1 color (Pink)
- **Locked lessons** → Unit color with opacity
- **Completed exercises** → Green checkmark but retain unit color for replay button

---

## 🎯 Phase 6: Button Variant Enhancement (Week 2, Day 4)

### Target File: `src/components/ui/button.tsx`

### Add Dynamic Color Variants

**Current V2 variants:**
- `student-pink`, `student-coral`, `student-peach`, `student-yellow`, `student-lime`

**New approach:** Accept color scheme as className override
```typescript
// Usage

  Click Me

```

**OR** Create a wrapper component:
```typescript
// src/components/ui/UnitButton.tsx
export function UnitButton({ colorScheme, children, ...props }) {
  return (

      {children}

  );
}
```

---

## 🎯 Phase 7: Polish & Animations (Week 2, Day 5)

### Enhancements:
1. **Confetti on correct answers** (already exists, verify it uses unit color)
2. **Coquí mascot reactions** to unit colors (bounce animation with color pulse)
3. **Progress rings** in unit colors (lesson completion percentage)
4. **Transition animations** between exercises (fade + slide with color trails)

---

## 📋 Implementation Checklist

### Phase 1: Foundation ✅
- [ ] Create `useUnitColor` hook
- [ ] Test color resolution for lessons
- [ ] Test color resolution for exercises (with parent traversal)
- [ ] Handle fallback for orphaned assessments

### Phase 2: Lesson Pages ✅
- [ ] Update `ViewLesson.tsx` header
- [ ] Update complete button
- [ ] Update locked state
- [ ] Test on 3 different units

### Phase 3: Exercise Players ✅
- [ ] Update `ExercisePlayer.tsx` wrapper
- [ ] Update `MultipleChoicePlayer.tsx`
- [ ] Update `TrueFalsePlayer.tsx`
- [ ] Update `DragDropPlayer.tsx`
- [ ] Update `FillBlankPlayer.tsx`
- [ ] Update `WriteAnswerPlayer.tsx`
- [ ] Verify semantic feedback (green/red) overrides unit colors correctly

### Phase 4: Exercise Flow ✅
- [ ] Update `LessonExerciseFlow.tsx`
- [ ] Pass color scheme to child components
- [ ] Test lesson → exercise transition

### Phase 5: Global Validation ✅
- [ ] Test Grade 1 (all units 1-6)
- [ ] Test Grade 2
- [ ] Test Grade 3
- [ ] Test Grade 4
- [ ] Test Grade 5
- [ ] Verify color consistency across all exercise types

### Phase 6: Enhancement ✅
- [ ] Create `UnitButton` component or variant
- [ ] Refactor all buttons to use new system
- [ ] Verify accessibility (contrast ratios)

### Phase 7: Polish ✅
- [ ] Add confetti color matching
- [ ] Coquí color reactions
- [ ] Progress ring colors
- [ ] Transition animations

---

## 🚨 Critical Requirements Recap

1. **Color Determination:** Query `lesson_ordering.domain_order` for unit number
2. **Color Inheritance:** Exercise inherits from parent lesson via `parent_lesson_id`
3. **V2 Styling:** All buttons use 3D effect (border-4, shadow, translate on hover/active)
4. **Semantic Override:** Correct=green, Incorrect=red (always), but borders/headers use unit color
5. **Locked State:** Unit color with `opacity-40` for grayed-out effect
6. **Global Application:** Same logic applies to all grades (K-5)

---

## 📊 Files Modified Summary

| File | Lines Changed | Purpose |
|------|--------------|---------|
| `src/hooks/useUnitColor.ts` | NEW | Color resolution logic |
| `src/pages/ViewLesson.tsx` | ~50 | Lesson page V2 styling |
| `src/pages/LessonExerciseFlow.tsx` | ~30 | Exercise flow color propagation |
| `src/components/ManualAssessment/ExercisePlayer.tsx` | ~40 | Exercise wrapper V2 styling |
| `src/components/ManualAssessment/players/MultipleChoicePlayer.tsx` | ~25 | Answer buttons V2 |
| `src/components/ManualAssessment/players/TrueFalsePlayer.tsx` | ~20 | True/False buttons V2 |
| `src/components/ManualAssessment/players/DragDropPlayer.tsx` | ~30 | Drag items V2 |
| `src/components/ManualAssessment/players/FillBlankPlayer.tsx` | ~25 | Fill blank inputs V2 |
| `src/components/ManualAssessment/players/WriteAnswerPlayer.tsx` | ~20 | Write answer input V2 |
| `src/components/ui/button.tsx` OR `src/components/ui/UnitButton.tsx` | ~30 | Unit-colored button variant |

**Total Estimated Changes:** ~320 lines across 10 files

---

## ⏱️ Timeline Estimate

- **Phase 1 (Hook):** 2-3 hours
- **Phase 2 (Lesson Page):** 3-4 hours
- **Phase 3 (Players):** 6-8 hours (5 player components)
- **Phase 4 (Flow):** 2 hours
- **Phase 5 (Testing):** 4-6 hours (5 grades × multiple units)
- **Phase 6 (Button System):** 2-3 hours
- **Phase 7 (Polish):** 3-4 hours

**Total:** 22-30 hours (~3-4 working days)

---

## 🎯 Success Criteria

✅ Student navigates to Unit 4 lesson → sees GREEN everywhere  
✅ Student completes multiple-choice → correct answer shows semantic green, button borders are unit green  
✅ Student sees locked Unit 2 lesson → orange lock with opacity  
✅ Teacher views Grade 1 Unit 3 lesson → amber styling  
✅ All exercise types (5 subtypes) match their parent lesson's unit color  
✅ Color persists across lesson → exercise flow → individual exercise → completion  

---

Implement each phase then wait for user validation.
Then proceed to the next phase
