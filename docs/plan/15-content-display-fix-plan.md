# Content Display Fix Plan - Manual Assessments

## 🔍 Problem Analysis

### Database Analysis Results
- **Total assessments**: 60
- **Clean records**: 47 (78%)
- **Problematic records**: 3 (5%)
  - `a86ddb21-aaf5-4f46-8e91-05b1aa5e8354` - Conciencia fonémica
  - `5059569e-5e56-4b1a-929f-f7f8e4960f0b` - Escoge la sílaba 2
  - `960797e1-1d11-46ee-9b57-db58a77dd46b` - Escoge la sílaba 4

### Issues Identified

#### Issue #1: Unstructured Table Data in Text Fields
**Example**: Record `a86ddb21` contains:
```
Palabra Sonido inicial correcto Opciones Visual Referencia Cultural
sol     s                        l o s    Clima tropical
mar     m                        a m r    Mar Caribe
```

**Problem**: Tab-separated or space-separated table data mixed with instructional text
- **Impact**: Renders as unformatted wall of text
- **Root Cause**: Content designed for a table but stored as plain text in `content.question`

#### Issue #2: Metadata/Mode Descriptions in Content
**Example**: Record `a86ddb21` voice_guidance contains:
```
Modo             Descripción                  Propósito
Modo auditivo    Escucha y selecciona...     Discriminación fonémica...
```

**Problem**: Structured metadata stored as text instead of JSON
- **Impact**: Metadata appears as unreadable text to users
- **Root Cause**: Planning/design information mixed with display content

#### Issue #3: Screen-by-Screen Instructions in Single Field
**Example**: Record `a86ddb21` contains:
```
Pantalla 1 – Instrucción auditiva y visual:
"Escucha la palabra: coquí..."
Opciones: /c/ /r/ /a/
Respuestas automáticas:
"¡Excelente! Coquí empieza con /c/."
```

**Problem**: Multi-step activity flow stored as linear text
- **Impact**: Confusing presentation, unclear interaction flow
- **Root Cause**: Activity workflow data mixed with display content

### Current Rendering Logic (ViewLesson.tsx:106-109)
```tsx
{lesson.content && typeof lesson.content === 'object' &&
 !('text' in lesson.content && lesson.content.text) &&
 'question' in lesson.content && lesson.content.question && (
  <div className="whitespace-pre-wrap">
    {String(lesson.content.question)}
  </div>
)}
```

**Current behavior**: Uses `whitespace-pre-wrap` which:
- ✅ Preserves line breaks
- ❌ Doesn't parse structured data
- ❌ Doesn't format tables
- ❌ Doesn't handle metadata

## 🎯 Solution Strategy

### Phase 1: Immediate Fixes (Content Cleanup)
Clean the 3 problematic records by restructuring their content

### Phase 2: Rendering Improvements (Code Changes)
Enhance ViewLesson.tsx to intelligently render different content types

### Phase 3: Content Schema Enhancement (Future)
Define better data structures for complex content

---

## 📋 Detailed Fix Plan

### Phase 1: Content Cleanup (Database)

#### Task 1.1: Fix Record a86ddb21 (Conciencia fonémica)
**Current structure**:
```json
{
  "question": "¡Escucha con mucha atención!\n...TABLE DATA...\nPantalla 1 – ..."
}
```

**Proposed structure**:
```json
{
  "question": "¡Escucha con mucha atención! Cada palabra tiene un sonido que se escucha al principio.",
  "instructions": "Cuando el sistema diga una palabra, escucha y elige el primer sonido que oyes. Por ejemplo, si escuchas "plato", el primer sonido es /p/.",
  "exercises": [
    {
      "word": "sol",
      "correctSound": "s",
      "options": ["l", "o", "s"],
      "visual": "Clima tropical"
    },
    {
      "word": "coquí",
      "correctSound": "c",
      "options": ["c", "o", "q"],
      "visual": "Símbolo de Puerto Rico"
    }
  ],
  "screens": [
    {
      "id": 1,
      "instruction": "Escucha la palabra: coquí. ¿Qué sonido escuchas primero?",
      "options": ["/c/", "/r/", "/a/"],
      "feedback": {
        "correct": "¡Excelente! Coquí empieza con /c/.",
        "help": "Escucha otra vez: coquí. Repite conmigo: /c/."
      }
    }
  ]
}
```

#### Task 1.2: Clean voice_guidance Field
**Current**: Contains mode descriptions table
**Proposed**: Extract to metadata or separate field
```json
{
  "voice_guidance": "Simple voice instructions for students",
  "metadata": {
    "modes": [
      {
        "name": "auditivo_simple",
        "description": "Escucha y selecciona entre 3 letras",
        "purpose": "Discriminación fonémica inicial"
      }
    ]
  }
}
```

#### Task 1.3: Fix Other 2 Records
Similar approach for records:
- `5059569e-5e56-4b1a-929f-f7f8e4960f0b`
- `960797e1-1d11-46ee-9b57-db58a77dd46b`

---

### Phase 2: Rendering Improvements (ViewLesson.tsx)

#### Task 2.1: Create Content Parser Utility
**File**: `src/utils/contentParser.ts`

```typescript
interface ParsedContent {
  type: 'simple' | 'structured' | 'exercise' | 'table';
  question: string;
  sections?: ContentSection[];
  exercises?: Exercise[];
  tables?: TableData[];
}

export function parseQuestionContent(question: string): ParsedContent {
  // Detect content type
  // Parse based on type
  // Return structured data
}
```

#### Task 2.2: Create Content Renderers
**File**: `src/components/lesson/ContentRenderer.tsx`

Components:
- `<SimpleTextRenderer />` - For clean, short questions
- `<StructuredContentRenderer />` - For exercises with sections
- `<TableRenderer />` - For tabular data
- `<MultiScreenRenderer />` - For step-by-step activities

#### Task 2.3: Update ViewLesson.tsx
Replace lines 106-109 with:
```tsx
<ContentRenderer
  content={lesson.content}
  voiceGuidance={lesson.voice_guidance}
  activityTemplate={lesson.activity_template}
/>
```

---

### Phase 3: Content Schema Enhancement

#### Task 3.1: Define TypeScript Interfaces
```typescript
// Different content types
type LessonContent =
  | SimpleContent
  | StructuredContent
  | ExerciseContent
  | MultiScreenContent;

interface SimpleContent {
  type: 'simple';
  question: string;
  questionImage?: string;
}

interface StructuredContent {
  type: 'structured';
  sections: Section[];
}

interface ExerciseContent {
  type: 'exercise';
  instructions: string;
  exercises: Exercise[];
}

interface MultiScreenContent {
  type: 'multiscreen';
  screens: Screen[];
}
```

#### Task 3.2: Migration Script
Create script to migrate existing content to new schema

#### Task 3.3: Update Database Types
Update `src/integrations/supabase/types.ts` with new content structures

---

## 🚀 Implementation Priority

### High Priority (Fix Now)
1. ✅ **Task 1.1**: Clean record a86ddb21
2. ✅ **Task 1.2**: Clean voice_guidance
3. ✅ **Task 2.1**: Create basic content parser
4. ✅ **Task 2.2**: Create table renderer

### Medium Priority (Next Sprint)
5. ⏳ **Task 2.3**: Update ViewLesson.tsx
6. ⏳ **Task 1.3**: Clean remaining records
7. ⏳ Full content renderer suite

### Low Priority (Future Enhancement)
8. 🔮 **Phase 3**: Complete schema redesign
9. 🔮 Content migration tools
10. 🔮 Content validation

---

## 🧪 Testing Plan

### Unit Tests
- [ ] Content parser correctly identifies content types
- [ ] Table renderer handles various formats
- [ ] Multi-screen renderer sequences correctly

### Integration Tests
- [ ] ViewLesson displays all content types
- [ ] No regression on working lessons (47 good records)
- [ ] Problematic records now display correctly

### Manual Testing
- [ ] Test record `8b2ab422` (good baseline)
- [ ] Test record `a86ddb21` (table data)
- [ ] Test voice guidance display
- [ ] Test on mobile devices

---

## 📊 Success Metrics

- ✅ All 3 problematic records display cleanly
- ✅ No visual regression on 47 working records
- ✅ Table data formatted as actual tables
- ✅ Metadata hidden from students
- ✅ Multi-screen activities are navigable

---

## 🛠️ Technical Decisions

### Why Not HTML?
**Decision**: Use structured JSON instead of storing HTML
**Reason**:
- Better security (no XSS)
- Easier to modify/maintain
- Better for accessibility
- Supports multiple renderers (web, mobile, print)

### Why Parser Over Direct Fields?
**Decision**: Parse content intelligently vs require strict schema
**Reason**:
- Works with existing data
- Graceful degradation
- Easier migration path

### Why Multiple Renderers?
**Decision**: Component per content type vs single complex component
**Reason**:
- Better maintainability
- Easier testing
- Clear separation of concerns

---

## 📝 Notes

- The majority of lessons (78%) already work correctly
- Main issue is mixing metadata/structure with display content
- Solution should be backward compatible
- Focus on the 3 problematic records first
- Consider content creation workflow improvements

---

**Created**: 2025-10-23
**Status**: Ready for Implementation
**Estimated Effort**: 3-5 days
