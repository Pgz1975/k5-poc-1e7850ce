## **Complete Implementation Plan: Lesson/Exercise Ordering & Student Progress System**

---

## **📋 Overview**

Build a comprehensive lesson management and student progress system with:
- **Teacher Dashboard**: Drag-and-drop drawer to reorder lessons/exercises per grade
- **Student Dashboard**: Enhanced Duolingo-style lesson/exercise grid with sequential unlocking, progress badges, and animations
- **Database**: New `lesson_ordering` table to store global ordering per grade
- **Pre-population**: Spanish Grade 1 curriculum structure (5 domains, multiple lessons)

---

## **Phase 1: Database Schema & Migration**

### **1.1 Create `lesson_ordering` Table**

```sql
CREATE TABLE lesson_ordering (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  grade_level INTEGER NOT NULL CHECK (grade_level >= 0 AND grade_level <= 5),
  assessment_id UUID NOT NULL REFERENCES manual_assessments(id) ON DELETE CASCADE,
  display_order INTEGER NOT NULL,
  parent_lesson_id UUID REFERENCES manual_assessments(id) ON DELETE CASCADE,
  domain_name TEXT, -- e.g., "Conciencia Fonológica", "Fonética"
  domain_order INTEGER, -- For grouping lessons by domain
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(grade_level, assessment_id),
  UNIQUE(grade_level, display_order)
);

CREATE INDEX idx_lesson_ordering_grade ON lesson_ordering(grade_level, display_order);
CREATE INDEX idx_lesson_ordering_parent ON lesson_ordering(parent_lesson_id, display_order);

-- Trigger to update updated_at
CREATE TRIGGER update_lesson_ordering_updated_at
  BEFORE UPDATE ON lesson_ordering
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE lesson_ordering ENABLE ROW LEVEL SECURITY;

-- Teachers can manage ordering
CREATE POLICY "Teachers manage lesson ordering"
  ON lesson_ordering FOR ALL
  USING (
    has_role(auth.uid(), 'teacher_english'::app_role) OR
    has_role(auth.uid(), 'teacher_spanish'::app_role) OR
    has_role(auth.uid(), 'school_director'::app_role)
  )
  WITH CHECK (
    has_role(auth.uid(), 'teacher_english'::app_role) OR
    has_role(auth.uid(), 'teacher_spanish'::app_role) OR
    has_role(auth.uid(), 'school_director'::app_role)
  );

-- Students can view ordering
CREATE POLICY "Students view lesson ordering"
  ON lesson_ordering FOR SELECT
  USING (true);
```

### **1.2 Pre-populate Spanish Grade 1 Curriculum**

Insert the 5-domain structure with lessons ordered according to the pedagogical sequence provided:

```sql
-- Domain 1: Conciencia Fonológica (4 lessons)
-- Domain 2: Fonética (2 lessons)
-- Domain 3: Conciencia Silábica (3 lessons) + Fluidez (3 lessons)
-- Domain 4: Vocabulario (3 lessons)
-- Domain 5: Comprensión (2 lessons)
```

**Note**: This requires the actual lessons to exist in `manual_assessments` first. Will insert ordering entries referencing existing lesson IDs.

---

## **Phase 2: Teacher Dashboard - Lesson Management Drawer**

### **2.1 Create Drawer Component**

**File**: `src/components/TeacherDashboard/ManageLessonsDrawer.tsx`

**Features**:
- **Grade filter tabs** (K-5) using Shadcn Tabs
- **Two-level drag-and-drop**:
  - **Level 1**: Drag lessons to reorder within grade
  - **Level 2**: Expand lesson (accordion) → drag child exercises
- **Domain grouping**: Show domain headers (e.g., "Dominio 1: Conciencia Fonológica")
- **Visual indicators**: Lock icons for locked lessons, checkmarks for ordered
- **Save button**: Batch update `lesson_ordering` table
- Uses `@dnd-kit/core` and `@dnd-kit/sortable`

**UI Structure**:
```tsx

    Manage Lessons

     {/* Grade filter: K, 1, 2, 3, 4, 5 */}

            {/* Lesson cards with drag handles */}
             {/* Expandable for exercises */}

                 {/* Nested exercises */}
                  {/* Exercise cards */}

        Save Order

```

### **2.2 Integrate into Teacher Dashboard**

**File**: `src/pages/TeacherDashboard.tsx`

Add button in header or quick stats section:
```tsx

```

### **2.3 API Hooks**

**File**: `src/hooks/useLessonOrdering.ts`

```tsx
// Fetch ordering for a grade
const { data: ordering } = useQuery({
  queryKey: ['lesson-ordering', gradeLevel],
  queryFn: async () => {
    const { data } = await supabase
      .from('lesson_ordering')
      .select('*, manual_assessments(*)')
      .eq('grade_level', gradeLevel)
      .order('display_order');
    return data;
  }
});

// Update ordering (batch upsert)
const { mutate: updateOrdering } = useMutation({
  mutationFn: async (updates: LessonOrder[]) => {
    const { error } = await supabase
      .from('lesson_ordering')
      .upsert(updates);
    if (error) throw error;
  }
});
```

---

## **Phase 3: Student Dashboard - Enhanced Lesson/Exercise Views**

### **3.1 Enhanced Lessons Page**

**File**: `src/pages/StudentLessonsProgress.tsx`

**Current**: Shows only next lesson card  
**Enhanced**: 
- **Grid layout** with all lessons (3-4 columns on desktop)
- **Sequential unlocking**: Lock icon + disabled state for unstarted lessons
- **Progress indicators**: 
  - ✓ Checkmark for completed
  - Score badge (color-coded: gold ≥90, silver ≥75, bronze ≥60)
  - Progress bar showing exercise completion within lesson
- **Animations**:
  - Unlock animation when prerequisite completed (scale + fade)
  - Celebrate animation on lesson completion (confetti + bounce)
- **Domain sections**: Group lessons by domain with headers

**UI Structure**:
```tsx

  {domains.map(domain => (

      {domain.name}

        {domain.lessons.map((lesson, index) => (
           0 && !domain.lessons[index-1].completed}
            completionData={completedMap[lesson.id]}
          />
        ))}

  ))}

```

### **3.2 Enhanced Exercises Page**

**File**: `src/pages/StudentExercisesProgress.tsx`

**Current**: Shows only next exercise card  
**Enhanced**:
- **Grid layout** with ALL exercises (including those linked to lessons)
- **Thematic grouping**: By subject area or skill (e.g., "Sílabas", "Vocabulario")
- **Independent access**: Students can practice any unlocked exercise
- **Visual distinction**: Badge showing "Parte de: [Lesson Name]" for linked exercises
- **Duolingo-style cards**:
  - Colorful themed icons per category
  - Circular progress indicator
  - Star rating display
  - "Practice Again" vs "Start" button

**UI Structure**:
```tsx

  {categories.map(category => (

        {category.name}

        {category.exercises.map(exercise => (

        ))}

  ))}

```

### **3.3 New Component: LessonCard**

**File**: `src/components/StudentDashboard/LessonCard.tsx`

**Features**:
- Lock overlay with shake animation on click
- Progress ring (using `react-circular-progressbar` or SVG)
- Completion badge with stars
- Hover scale animation
- Click → navigate to `/lesson/{id}`

### **3.4 New Component: ExerciseCard**

**File**: `src/components/StudentDashboard/ExerciseCard.tsx`

**Features**:
- Themed color palette per category
- Icon representing exercise type (multiple choice, fill blank, etc.)
- "Linked to lesson" badge
- Star rating display
- Click → navigate to `/view-assessment/{id}`

---

## **Phase 4: Sequential Unlocking Logic**

### **4.1 Modify `useStudentProgress` Hook**

**File**: `src/hooks/useStudentProgress.ts`

**Add**:
- Fetch `lesson_ordering` to determine sequence
- Check `completed_activity` to determine which lessons/exercises are unlocked
- Return array with `isLocked` flag per item

```tsx
const { data: orderedLessons } = useQuery({
  queryKey: ['ordered-lessons', gradeLevel],
  queryFn: async () => {
    const { data: ordering } = await supabase
      .from('lesson_ordering')
      .select('*, manual_assessments(*)')
      .eq('grade_level', gradeLevel)
      .order('display_order');

    const { data: completed } = await supabase
      .from('completed_activity')
      .select('activity_id')
      .eq('student_id', userId)
      .eq('activity_type', 'lesson');

    const completedIds = new Set(completed?.map(c => c.activity_id));

    return ordering?.map((item, index) => ({
      ...item,
      isLocked: index > 0 && !completedIds.has(ordering[index - 1].assessment_id)
    }));
  }
});
```

### **4.2 Update ViewLesson to Block Locked Content**

**File**: `src/pages/ViewLesson.tsx`

Check if lesson is locked before rendering:
```tsx
if (isLocked) {
  return (

      This lesson is locked
      Complete the previous lesson to unlock

  );
}
```

---

## **Phase 5: Animations & Visual Polish**

### **5.1 Unlock Animation**

Use Framer Motion or CSS animations:
```tsx

  {/* Lesson Card */}

```

### **5.2 Completion Celebration**

Use `canvas-confetti` package or Lottie animation:
```tsx
import confetti from 'canvas-confetti';

const handleComplete = () => {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  });
};
```

### **5.3 Progress Ring Component**

**File**: `src/components/ui/progress-ring.tsx`

SVG-based circular progress:
```tsx

```

---

## **Phase 6: Domain Grouping & Themed Categories**

### **6.1 Add Domain Metadata**

Store domain info in `lesson_ordering` table (already included in schema).

### **6.2 Category Icons**

Map exercise types to Lucide icons:
```tsx
const CATEGORY_ICONS = {
  'multiple_choice': CheckCircle2,
  'true_false': CheckSquare,
  'fill_blank': PenTool,
  'matching': Link2,
  'drag_drop': Move,
  'short_answer': MessageSquare,
  'sequencing': ArrowRightLeft,
  'write_answer': Edit3
};
```

### **6.3 Color Themes**

Define color palette per domain:
```css
.domain-1 { /* Conciencia Fonológica */
  --theme-color: hsl(220, 90%, 56%); /* Blue */
}
.domain-2 { /* Fonética */
  --theme-color: hsl(340, 82%, 52%); /* Pink */
}
.domain-3 { /* Conciencia Silábica */
  --theme-color: hsl(160, 84%, 39%); /* Green */
}
.domain-4 { /* Vocabulario */
  --theme-color: hsl(45, 93%, 47%); /* Yellow */
}
.domain-5 { /* Comprensión */
  --theme-color: hsl(280, 65%, 60%); /* Purple */
}
```

---

## **Phase 7: Testing & Edge Cases**

### **7.1 Test Scenarios**

1. **Teacher reorders lessons** → Students see new order immediately
2. **Student completes lesson** → Next lesson unlocks with animation
3. **No ordering data** → Fall back to creation date order
4. **Exercise with no parent** → Still appears in exercises grid
5. **Multiple students** → Each has independent progress

### **7.2 Performance Optimization**

- Use `React Query` caching for ordering data
- Debounce drag operations
- Lazy load lesson content
- Optimize completed activity queries (index on `student_id + activity_type`)

---

## **Files to Create/Modify**

### **New Files** (15):
1. `src/components/TeacherDashboard/ManageLessonsDrawer.tsx`
2. `src/components/TeacherDashboard/LessonOrderingList.tsx`
3. `src/components/TeacherDashboard/DraggableLessonItem.tsx`
4. `src/components/StudentDashboard/LessonCard.tsx`
5. `src/components/StudentDashboard/ExerciseCard.tsx`
6. `src/components/StudentDashboard/DomainSection.tsx`
7. `src/components/StudentDashboard/CategorySection.tsx`
8. `src/components/ui/progress-ring.tsx`
9. `src/hooks/useLessonOrdering.ts`
10. `src/hooks/useOrderedLessons.ts`
11. `src/utils/lessonUnlocking.ts`
12. `src/utils/categoryMapping.ts`
13. `src/types/lessonOrdering.ts`
14. Migration SQL file
15. Seed data SQL file (Spanish Grade 1 curriculum)

### **Modified Files** (5):
1. `src/pages/TeacherDashboard.tsx` - Add drawer trigger button
2. `src/pages/StudentLessonsProgress.tsx` - Replace with grid layout
3. `src/pages/StudentExercisesProgress.tsx` - Replace with themed grid
4. `src/hooks/useStudentProgress.ts` - Add ordering + locking logic
5. `src/pages/ViewLesson.tsx` - Add lock check

---

## **Dependencies to Install**

```bash
npm install canvas-confetti framer-motion
```

(Already have `@dnd-kit/core`, `@dnd-kit/sortable`)

---

## **Success Metrics**

✅ Teachers can reorder lessons via drag-and-drop  
✅ Ordering persists globally per grade  
✅ Students see lessons in teacher-defined order  
✅ Sequential unlocking works (locked lessons show lock icon)  
✅ Completion triggers unlock animation  
✅ Exercise grid shows all exercises with theme grouping  
✅ Progress badges display correctly  
✅ Spanish Grade 1 curriculum pre-populated  

---

## **Implementation Time Estimate**

- **Phase 1** (Database): 30 mins
- **Phase 2** (Teacher UI): 2-3 hours
- **Phase 3** (Student UI): 3-4 hours
- **Phase 4** (Unlocking Logic): 1-2 hours
- **Phase 5** (Animations): 1-2 hours
- **Phase 6** (Theming): 1 hour
- **Phase 7** (Testing): 1-2 hours

**Total**: 9-14 hours

---

## **Risks & Mitigations**

| Risk | Mitigation |
|------|------------|
| Complex drag-and-drop nesting | Start with single-level, add nesting incrementally |
| Performance with many lessons | Virtualize lists, lazy load |
| Ordering conflicts | Use transaction + unique constraints |
| Animation performance on mobile | Use CSS transforms, test on devices |
