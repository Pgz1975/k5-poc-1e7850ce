# Manual Assessment Creation System - MAIN PLAN

## Overview
A **SIMPLE** teacher-friendly system to create lessons, exercises, and assessments manually through a kid-friendly web interface. This is NOT PDF-based - teachers create content from scratch with voice integration.

## Core Philosophy: KEEP IT SIMPLE
- **NO over-engineering** - Straightforward React components
- **REUSE existing code** - Voice system, UI components, database tables
- **FAST to build** - 3-4 days max implementation
- **EASY to use** - Teachers can create content in under 5 minutes

## The User Experience (Teacher Flow)

### Step 1: Choose Type (1 button click)
```
"What do you want to create?"
- [Lesson] [Exercise] [Assessment]
```

### Step 2: Choose Subtype (1 button click)
```
"What kind of exercise?"
- [Multiple Choice] [True/False] [Fill in Blank] [Matching]
```

### Step 3: Enter Content (1 rich text box)
```
"Enter your question or lesson text:"
[Large text editor with formatting]
```

### Step 4: Add Answers (Dynamic list)
```
"Add answer options:"
- Option 1: [text] [paste image] [✓ correct] [X remove]
- Option 2: [text] [paste image] [  ] [X remove]
- [+ Add Another Option]
```

### Step 5: Preview & Save (1 click)
```
"Preview how students will see this:"
[Kid-friendly preview with Coquí mascot]
[Save Button]
```

## Technical Architecture (SIMPLE)

### Database Tables
**NEW TABLE: `manual_assessments`**
```sql
CREATE TABLE manual_assessments (
  id UUID PRIMARY KEY,
  type TEXT, -- 'lesson', 'exercise', 'assessment'
  subtype TEXT, -- 'multiple_choice', 'true_false', etc.

  -- Content
  title TEXT,
  content JSONB, -- { question, answers, images, etc }

  -- Metadata
  grade_level INTEGER,
  language language_code,
  subject_area TEXT,

  -- Voice settings
  enable_voice BOOLEAN DEFAULT true,
  voice_guidance TEXT,

  -- Ownership
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Page Routes
1. `/manual-assessment/create` - Main creation form
2. `/manual-assessment/preview/:id` - Preview before saving
3. `/manual-assessment/view/:id` - Student-facing view with voice

### Core Components (Reuse Existing!)
- **Layout**: Copy `/reading-exercise` style (gradients, large fonts, Coquí)
- **Voice**: Use `useRealtimeVoice` hook from `/voice-test`
- **UI Components**: Existing shadcn/ui components (Button, Card, Input)
- **Image Paste**: HTML5 clipboard API (super simple!)

## Voice Integration (KEY FEATURE)

### How Voice Works in Manual Assessments

1. **Teacher Sets Voice Guidance**
   - Optional field when creating content
   - Example: "Read each option carefully before choosing"
   - Coquí speaks this in student's language

2. **Automatic Question Reading**
   - When student opens assessment
   - Coquí reads the question aloud
   - Uses same system as `/voice-test`

3. **Answer Feedback**
   - Correct: Coquí says "¡Excelente!" / "Excellent!"
   - Incorrect: Coquí says "Inténtalo de nuevo" / "Try again"

### Implementation (SIMPLE)
```typescript
// Reuse existing hook
const { connect, sendText } = useRealtimeVoice({
  studentId: user.id,
  language: 'es-PR', // or 'en-US'
  onTranscription: handleVoiceResponse
});

// On page load
useEffect(() => {
  connect();
  sendText(assessment.content.question); // Coquí reads it
}, []);
```

## Assessment Types Supported

### 1. Multiple Choice
- Question text with rich formatting
- 2-6 answer options
- Each option can have text + image
- Mark one correct answer

### 2. True/False
- Statement with rich formatting
- Optional supporting image
- Simple True/False buttons
- Explanation for correct answer

### 3. Fill in the Blank
- Sentence with _____ blanks
- List of word choices
- Drag-and-drop or select from dropdown

### 4. Matching
- Left column: Terms/images
- Right column: Definitions/images
- Drag to connect matching pairs

### 5. Short Answer (Future)
- Open text response
- Voice-to-text for younger students

## Image Support (CRITICAL FEATURE)

### Clipboard Paste
```typescript
// Super simple implementation
const handlePaste = (e: ClipboardEvent) => {
  const items = e.clipboardData?.items;
  for (let item of items) {
    if (item.type.startsWith('image/')) {
      const blob = item.getAsFile();
      uploadImageToSupabase(blob);
    }
  }
};
```

### Storage
- Upload to Supabase Storage bucket `manual-assessment-images`
- Generate thumbnail automatically
- Return public URL for immediate display

## Kid-Friendly UI Design

### Visual Style (Copy from `/reading-exercise`)
- **Colors**: Bright gradients (blue to green)
- **Fonts**: Extra large (3xl for questions, 2xl for options)
- **Coquí Mascot**: Visible on every screen with different states
- **Animations**: Gentle bounce on interactions
- **Spacing**: Wide margins, lots of breathing room

### Mobile-Friendly (Tablets)
- Touch-friendly buttons (min 60px height)
- Finger-friendly spacing
- No hover states (use active states)
- Large text for readability

## File Structure

```
/src/pages/
├── ManualAssessmentCreate.tsx    # Main creation form
├── ManualAssessmentPreview.tsx   # Preview before saving
└── ManualAssessmentView.tsx      # Student view with voice

/src/components/ManualAssessment/
├── TypeSelector.tsx              # Step 1: Choose type
├── SubtypeSelector.tsx           # Step 2: Choose subtype
├── ContentEditor.tsx             # Step 3: Text editor
├── AnswerList.tsx                # Step 4: Manage answers
├── ImagePasteInput.tsx           # Clipboard paste support
├── VoiceGuidanceInput.tsx        # Voice settings
└── StudentView.tsx               # Reusable student view

/src/hooks/
└── useManualAssessment.ts        # Business logic hook

/supabase/functions/
├── save-manual-assessment/       # Save to database
├── upload-assessment-image/      # Image upload handler
└── get-manual-assessment/        # Fetch for student view
```

## Implementation Priority

### Phase 1: Basic Creation (Day 1)
- Type/subtype selector
- Simple text editor (no rich text yet)
- Multiple choice with text-only answers
- Save to database

### Phase 2: Image Support (Day 2)
- Clipboard paste implementation
- Supabase storage integration
- Image preview in answers
- Thumbnail generation

### Phase 3: Voice Integration (Day 3)
- Connect `useRealtimeVoice` hook
- Auto-read questions
- Voice feedback on answers
- Test with both languages

### Phase 4: Polish & More Types (Day 4)
- Add True/False type
- Add Fill in Blank type
- Rich text formatting
- Preview mode
- Mobile testing

## Key Success Metrics
1. Teacher can create assessment in < 5 minutes ✓
2. Clipboard image paste works smoothly ✓
3. Voice reads questions in student's language ✓
4. UI matches kid-friendly style of `/reading-exercise` ✓
5. Works on tablets (90% of student devices) ✓

## NOT Included (Keep It Simple!)
- Complex scoring algorithms
- Time limits or deadlines
- Student progress tracking (that's separate)
- Analytics dashboard
- Bulk import/export
- Templates or presets
- Collaborative editing
- Version history

## Integration with Existing System

### Connects To:
- **Voice System**: Reuse `/voice-test` implementation
- **Database**: Use existing Supabase setup
- **Auth**: Existing auth context
- **UI**: Existing component library
- **Storage**: Existing Supabase storage buckets

### Does NOT Connect To:
- PDF parsing system (totally separate)
- Assessment generator from PDFs (different flow)
- Adaptive learning (future feature)

## Development Timeline

| Day | Task | Hours |
|-----|------|-------|
| 1 | Database schema + basic UI | 8 |
| 2 | Image paste + storage | 6 |
| 3 | Voice integration | 6 |
| 4 | Polish + testing | 4 |
| **Total** | **MVP Complete** | **24 hours** |

## Risk Mitigation

### Potential Issues:
1. **Image paste browser compatibility** → Test early, provide fallback upload button
2. **Voice latency** → Already solved in `/voice-test`, reuse that code
3. **Mobile keyboard covering inputs** → Use viewport height units, sticky positioning
4. **Teachers need training** → Make UI so simple no training needed

## Next Steps
1. Review this plan with team
2. Read UI-MOCKUPS.md for visual design
3. Read COMPONENT-STRUCTURE.md for code architecture
4. Read DATABASE-SCHEMA.md for table details
5. Read VOICE-INTEGRATION.md for voice specifics
6. Read IMPLEMENTATION-STEPS.md for step-by-step guide

---

**Remember**: This is designed to be SIMPLE and FAST to build. Resist the urge to over-engineer. Get it working, then iterate based on real teacher feedback.
