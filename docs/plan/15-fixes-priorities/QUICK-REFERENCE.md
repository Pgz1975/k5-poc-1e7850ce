# QUICK REFERENCE - CRITICAL FIXES
## October 27 Demo Deadline

---

## 🔴 P0 CRITICAL FILES TO MODIFY

### 1. System Stability
- `/src/pages/ViewAssessment.tsx` - Add timeout & finally blocks
- `/src/hooks/useRealtimeVoice.ts` - Add connection timeout
- **Time: 2-3 hours**

### 2. Child-Appropriate Language
- `/src/pages/CreateAssessment.tsx` - Remove adult terms (amor, cariño)
- `/src/utils/prompts/childFriendlyConfig.ts` - NEW FILE
- **Time: 1-2 hours**

### 3. Exercise Format Fix
- `/src/pages/CreateAssessment.tsx` (Line 414) - Fix subtype logic
- `/src/components/ManualAssessment/SubtypeSelector.tsx` - Add persistence
- **Time: 30 minutes**

### 4. Error Handling & Retry
- `/src/pages/ViewAssessment.tsx` - Add retry button & logic
- **Time: 1 hour**

### 5. Assessment Limits
- `/src/pages/AdminDashboard.tsx` - Add pagination (remove .limit(10))
- **Time: 45 minutes**

---

## 🟡 P1 HIGH PRIORITY FILES

### 6. Image Handling
- `/src/components/ManualAssessment/ImagePasteZone.tsx` - Multiple upload
- `/src/components/ManualAssessment/LessonContentEditor.tsx` - NEW FILE
- **Time: 2 hours**

### 7. Missing Templates
- `/src/components/ExerciseTemplates/FillInBlank.tsx` - NEW FILE
- `/src/components/ExerciseTemplates/WriteAnswer.tsx` - NEW FILE
- `/src/components/ExerciseTemplates/Matching.tsx` - NEW FILE
- **Time: 3-4 hours**

### 8. AI Response Quality
- `/src/utils/ai/guidedResponses.ts` - NEW FILE
- **Time: 1-2 hours**

---

## KEY CODE CHANGES

### Fix 1: Timeout Handler (ViewAssessment.tsx)
```typescript
// Add timeout to prevent freezing
const timeoutId = setTimeout(() => {
  setIsLoading(false);
  toast({ title: "Connection timeout" });
}, 10000);

try {
  // existing code
} finally {
  clearTimeout(timeoutId);
  setIsLoading(false); // CRITICAL!
}
```

### Fix 2: Remove Adult Terms (CreateAssessment.tsx)
```typescript
// BEFORE: 'flor\namor'
// AFTER: 'flor\ncolor'

// FORBIDDEN: amor, cariño, querido, mi vida
// USE: amiguito/a, estudiante, campeón/campeona
```

### Fix 3: Exercise Format (CreateAssessment.tsx:414)
```typescript
// BEFORE:
subtype: data.subtype || (data.type === 'lesson' ? 'lesson' : 'multiple_choice')

// AFTER:
subtype: data.subtype || (
  data.type === 'lesson' ? 'lesson' :
  data.type === 'exercise' && formData.subtype ? formData.subtype :
  'multiple_choice'
)
```

### Fix 4: Retry Button (ViewAssessment.tsx)
```typescript
const handleRetry = () => {
  setSelectedAnswer(null);
  setShowFeedback(false);
  setIsCorrect(false);
  // Re-ask question
};

// In JSX:
{showFeedback && !isCorrect && (
  <Button onClick={handleRetry}>
    {t("Intentar de nuevo", "Try Again")}
  </Button>
)}
```

### Fix 5: Remove Limit (AdminDashboard.tsx)
```typescript
// BEFORE:
.limit(10)

// AFTER:
.range(
  currentPage * itemsPerPage,
  (currentPage + 1) * itemsPerPage - 1
)
```

---

## SQL UPDATES NEEDED

```sql
-- Run in Supabase SQL Editor

-- 1. Remove assessment view limits
DROP POLICY IF EXISTS "Teachers can view their assessments" ON manual_assessments;
CREATE POLICY "Teachers can view their assessments" ON manual_assessments
  FOR SELECT USING (created_by = auth.uid());

-- 2. Add edit tracking
ALTER TABLE manual_assessments
  ADD COLUMN IF NOT EXISTS last_edited_at TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS edit_count INT DEFAULT 0;
```

---

## TEST COMMANDS

```bash
# Quick stability test
npm run dev
# Then manually test timeout by disconnecting internet

# Build check
npm run build

# Type check
npm run typecheck

# Lint
npm run lint
```

---

## CLIENT ISSUES MAPPING

| Client Issue | Fix # | File | Priority |
|-------------|-------|------|----------|
| System freezes | Fix 1 | ViewAssessment.tsx | P0 |
| Masculine form / adult terms | Fix 2 | CreateAssessment.tsx | P0 |
| Always Multiple Choice | Fix 3 | CreateAssessment.tsx | P0 |
| "Try again" doesn't reset | Fix 4 | ViewAssessment.tsx | P0 |
| Red error persists | Fix 1 | useRealtimeVoice.ts | P0 |
| Limited to 10 assessments | Fix 5 | AdminDashboard.tsx | P0 |
| No image in lessons | Fix 6 | ImagePasteZone.tsx | P1 |
| Missing True/False, Fill-blank | Fix 7 | NEW Templates | P1 |
| AI reveals answers | Fix 8 | guidedResponses.ts | P1 |

---

## EMERGENCY CONTACTS

- **Lead Dev**: [Contact]
- **Frontend**: [Contact]
- **AI/Prompts**: [Contact]
- **QA**: [Contact]
- **Pierre** (Client): [Contact]

---

## TIMELINE

### Day 1 (Oct 24)
- Morning: Fix 1 (Stability)
- Afternoon: Fix 2 (Language)

### Day 2 (Oct 25)
- Morning: Fix 3, 4 (Format, Retry)
- Afternoon: Fix 5 (Limits)

### Day 3 (Oct 26)
- Morning: Fix 6 (Images)
- Afternoon: Fix 7 (Templates)

### Day 4 (Oct 27)
- Morning: Fix 8 (AI Quality)
- Afternoon: Final Testing
- Evening: DEMO

---

## SUCCESS CRITERIA

✅ **MUST HAVE for Demo:**
- No freezing/crashes
- Child-appropriate language only
- All exercise types work
- Can view >10 assessments
- Retry button works

⭐ **NICE TO HAVE:**
- Image upload works
- All templates available
- AI gives hints not answers

---

*Use this card for quick reference during implementation*
*Full details in CRITICAL-REMEDIATION-PLAN.md*