# K5 POC Component Nesting Documentation

This documentation suite provides a comprehensive analysis of the educational content component hierarchy in the K5 POC application.

## Documents Included

### 1. COMPONENT_NESTING_ANALYSIS.md (Main Reference - 853 lines)
**Comprehensive architectural documentation covering:**

- Database layer and schema relationships
- Routing architecture with complete route map
- Detailed component nesting hierarchy (4 levels)
- Complete data flow diagrams
- State management architecture
- Component containment summary (visual tree)
- Type hierarchy in database
- Integration points (voice, progress, unlocking)
- Component communication patterns
- Visual component hierarchy

**Best for:** Deep understanding, architecture design, implementation reference

### 2. COMPONENT_QUICK_REFERENCE.md (Quick Lookup - 471 lines)
**Practical quick-reference guide including:**

- Student's complete journey flow (visual)
- Component file locations
- Component props reference
- URL routes mapping
- Database model schemas
- Exercise type behaviors
- State flow examples
- Lesson unlocking logic
- Exercise navigation scenarios
- Error handling flows
- Key files by function
- Common props combinations

**Best for:** Quick lookups, development, debugging, props reference

## Quick Navigation

### By Use Case

#### I need to understand how lessons contain exercises
→ See: COMPONENT_NESTING_ANALYSIS.md → Section 1 (Database Layer)

#### I need to add a new feature/component
→ See: COMPONENT_QUICK_REFERENCE.md → Component File Locations & Props Reference

#### I'm debugging a component
→ See: COMPONENT_QUICK_REFERENCE.md → Error Handling Flows & State Flow Example

#### I need to understand the user journey
→ See: COMPONENT_QUICK_REFERENCE.md → What Contains What (the flow diagram)

#### I need to understand routing
→ See: COMPONENT_NESTING_ANALYSIS.md → Section 2 (Routing Architecture)

#### I need to integrate voice
→ See: COMPONENT_NESTING_ANALYSIS.md → Section 9 (Key Integration Points)

#### I need to understand progress tracking
→ See: COMPONENT_NESTING_ANALYSIS.md → Section 9 (Key Integration Points) or Quick Reference → Exercise Navigation

#### I need component props
→ See: COMPONENT_QUICK_REFERENCE.md → Component Props Reference

### By Component

#### ViewLesson.tsx
- Full details: COMPONENT_NESTING_ANALYSIS.md → Section 3.A
- Props: COMPONENT_QUICK_REFERENCE.md → Component Props Reference
- Route: COMPONENT_QUICK_REFERENCE.md → URL Routes

#### LessonExerciseFlow.tsx
- Full details: COMPONENT_NESTING_ANALYSIS.md → Section 3.B
- Flow diagram: COMPONENT_QUICK_REFERENCE.md → What Contains What
- Navigation: COMPONENT_QUICK_REFERENCE.md → Exercise Navigation Scenarios

#### ExercisePlayer.tsx
- Full details: COMPONENT_NESTING_ANALYSIS.md → Section 3.C
- Props: COMPONENT_QUICK_REFERENCE.md → Component Props Reference
- State flow: COMPONENT_QUICK_REFERENCE.md → State Flow Example

#### LessonCompletionScreen.tsx
- Full details: COMPONENT_NESTING_ANALYSIS.md → Section 3.D
- Props: COMPONENT_QUICK_REFERENCE.md → Component Props Reference
- Integration: COMPONENT_NESTING_ANALYSIS.md → Section 9

#### StudentLessonsProgress.tsx
- Full details: COMPONENT_NESTING_ANALYSIS.md → Section 3.E
- File location: COMPONENT_QUICK_REFERENCE.md → Component File Locations
- Route: COMPONENT_QUICK_REFERENCE.md → URL Routes

#### Exercise Players (MultipleChoice, TrueFalse, FillBlank, etc.)
- Details: COMPONENT_NESTING_ANALYSIS.md → Section 3.3
- Behaviors: COMPONENT_QUICK_REFERENCE.md → Exercise Type Behaviors
- File locations: COMPONENT_QUICK_REFERENCE.md → Component File Locations

#### Voice Components (CoquiLessonAssistantGuard, CoquiVoiceBridge)
- Full details: COMPONENT_NESTING_ANALYSIS.md → Section 3.4
- Props: COMPONENT_QUICK_REFERENCE.md → Component Props Reference
- Integration: COMPONENT_NESTING_ANALYSIS.md → Section 9

## Key Concepts Quick Summary

### What Contains What (Hierarchy)

```
App.tsx (Router)
  ├─ StudentDashboard
  │  ├─ ActivityCards
  │  └─ CoquiVoiceChat
  │
  ├─ StudentLessonsProgress
  │  ├─ DomainHeader
  │  └─ LessonCard
  │
  ├─ ViewLesson
  │  ├─ CoquiLessonAssistantGuard
  │  └─ CoquiVoiceBridge
  │
  ├─ LessonExerciseFlow
  │  ├─ ExercisePlayer
  │  │  └─ [Player Type Components]
  │  ├─ LessonCompletionScreen
  │  ├─ CoquiLessonAssistantGuard
  │  └─ CoquiVoiceBridge
  │
  ├─ ViewAssessment
  │  └─ [Player Type Components]
  │
  └─ [Other Pages]
```

### Database Model

All educational content stored in one table with type differentiation:

```
manual_assessments:
  type: 'lesson' | 'exercise' | 'assessment'
  parent_lesson_id: (exercises point to their parent lesson)
  subtype: 'multiple_choice' | 'true_false' | 'fill_blank' | 'write_answer' | 'drag_drop'
```

### Student Journey

```
Dashboard → Lessons List → View Lesson → Exercise Flow → Completion Screen
```

### Completion Tracking

```
completed_activity:
  student_id + activity_id + activity_type + score + completed_at
```

### Lesson Unlocking

```
Based on lesson_ordering table + completed_activity:
  First lesson: unlocked
  Subsequent: unlock when previous completes
```

## File Paths

### Main Documentation
- `/workspaces/k5-poc-1e7850ce/COMPONENT_NESTING_ANALYSIS.md` - Full analysis
- `/workspaces/k5-poc-1e7850ce/COMPONENT_QUICK_REFERENCE.md` - Quick reference
- `/workspaces/k5-poc-1e7850ce/DOCUMENTATION_INDEX.md` - This file

### Component Source Files
- Page components: `/src/pages/*.tsx`
- Layout/container: `/src/components/StudentDashboard/*.tsx`
- Exercise players: `/src/components/ManualAssessment/players/*.tsx`
- Voice components: `/src/components/coqui/*.tsx`
- Completion screen: `/src/components/LessonCompletion/*.tsx`

### Related Configuration
- Routes: `/src/App.tsx`
- Database types: `/src/integrations/supabase/types.ts`
- Hooks: `/src/hooks/` (useStudentProgress, useLessonOrdering, useUnitColor, etc.)
- Utilities: `/src/utils/lessonUnlocking.ts`

## How to Use These Documents

### For Implementation
1. Read COMPONENT_QUICK_REFERENCE.md → Component File Locations
2. Find the component you're working with
3. Check the flow diagrams in QUICK_REFERENCE for context
4. Refer to Props Reference for expected inputs/outputs
5. Check NESTING_ANALYSIS for detailed architectural context

### For Debugging
1. Identify the page/component causing issues
2. Find it in QUICK_REFERENCE → Component File Locations
3. Look at the data flow in QUICK_REFERENCE → What Contains What
4. Check error handling flows
5. Review state management in NESTING_ANALYSIS → Section 5

### For New Features
1. Understand current architecture: NESTING_ANALYSIS → Sections 1-3
2. Find similar existing component
3. Study its props and integration points
4. Check QUICK_REFERENCE → Common Props Combinations
5. Follow existing patterns

### For Code Review
1. Check if routing is correct: QUICK_REFERENCE → URL Routes
2. Verify component hierarchy: NESTING_ANALYSIS → Section 6
3. Check data flow: NESTING_ANALYSIS → Section 4
4. Validate props: QUICK_REFERENCE → Component Props Reference
5. Ensure state management: NESTING_ANALYSIS → Section 5

## Document Statistics

- Total lines: 1,324
- Total size: 36 KB
- Analysis coverage: 7 major page components, 15+ layout components, 6 player types, 4 voice components
- Database tables documented: 3 (manual_assessments, completed_activity, lesson_ordering)
- Routes mapped: 10+
- Exercise types covered: 5

## Updates and Maintenance

These documents reflect the architecture as of October 29, 2025.

### When to Update
- New page component added
- Component structure significantly changes
- New database tables created
- Routing structure changes
- New integration points added

### How to Update
1. Verify the change in the actual codebase
2. Update relevant sections in both documents
3. Keep QUICK_REFERENCE concise and practical
4. Keep NESTING_ANALYSIS comprehensive and thorough
5. Update this index file if new documents are added

## References in Codebase

### Key Implementation Files
- `/src/App.tsx` - Complete routing configuration
- `/src/pages/LessonExerciseFlow.tsx` - Core exercise flow (352 lines)
- `/src/pages/ViewLesson.tsx` - Lesson display (423 lines)
- `/src/components/ManualAssessment/ExercisePlayer.tsx` - Exercise dispatcher (305 lines)
- `/src/components/LessonCompletion/LessonCompletionScreen.tsx` - Completion UI (236 lines)

### Key Data Files
- `/src/integrations/supabase/types.ts` - Database schema types
- `/src/hooks/useStudentProgress.ts` - Progress fetching
- `/src/hooks/useLessonOrdering.ts` - Lesson order & domains
- `/src/utils/lessonUnlocking.ts` - Locking logic

---

**Last Updated:** October 29, 2025
**Documentation Version:** 1.0
**Component Architecture Version:** Stable
