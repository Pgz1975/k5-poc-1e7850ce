# Implementation Steps - Manual Assessment Creation

## Overview
Step-by-step guide to build the manual assessment creation system. Follow this order to ensure a working system at each stage.

---

## Phase 1: Database Setup (2 hours)

### Step 1.1: Create Database Migration

```bash
# Create new migration file
cd /workspaces/k5-poc-1e7850ce
npx supabase migration new create_manual_assessments
```

### Step 1.2: Add Schema to Migration

Copy the SQL from `DATABASE-SCHEMA.md` into the new migration file:

```sql
-- /supabase/migrations/[timestamp]_create_manual_assessments.sql

-- Copy the CREATE TABLE statement for manual_assessments
-- Copy the indexes
-- Copy the triggers
-- Copy the RLS policies
```

### Step 1.3: Run Migration

```bash
# Apply migration to local database
npx supabase db reset

# Or if remote:
npx supabase db push
```

### Step 1.4: Create Storage Bucket

```typescript
// Via Supabase Dashboard or SQL
// Create bucket: manual-assessment-images
// Set to public: true
// Add storage policies from DATABASE-SCHEMA.md
```

### Step 1.5: Verify Schema

```bash
# Check if table exists
npx supabase db inspect

# Or query directly
psql -c "SELECT * FROM manual_assessments LIMIT 1;"
```

✅ **Checkpoint**: Database table and storage bucket exist

---

## Phase 2: Basic UI Components (6 hours)

### Step 2.1: Create Component Directory

```bash
mkdir -p src/components/ManualAssessment
touch src/components/ManualAssessment/TypeSelector.tsx
touch src/components/ManualAssessment/SubtypeSelector.tsx
touch src/components/ManualAssessment/ContentEditorForm.tsx
touch src/components/ManualAssessment/AnswerList.tsx
touch src/components/ManualAssessment/ImagePasteZone.tsx
```

### Step 2.2: Build TypeSelector Component

Copy from `COMPONENT-STRUCTURE.md`:
- Basic card layout with 3 type options
- Click handler to select type
- Coquí mascot at bottom

**Test**: Component renders, clicking a type logs to console

### Step 2.3: Build SubtypeSelector Component

Similar to TypeSelector but with 4-5 subtype options:
- Multiple Choice
- True/False
- Fill in Blank
- Matching

**Test**: Component renders, clicking a subtype logs to console

### Step 2.4: Build Basic ContentEditorForm

Start simple:
- Question textarea (no rich text yet)
- Submit button
- Back button

**Test**: Can type question, click submit logs data

### Step 2.5: Build AnswerList Component

- Display 2 default answer options
- Text input for each answer
- Checkbox to mark correct
- Add/remove buttons

**Test**: Can add/remove answers, mark correct answer

✅ **Checkpoint**: Can navigate through type → subtype → form

---

## Phase 3: Main Page Integration (4 hours)

### Step 3.1: Create Main Page

```bash
touch src/pages/ManualAssessmentCreate.tsx
```

### Step 3.2: Build Step State Machine

```typescript
const [step, setStep] = useState<'type' | 'subtype' | 'content'>('type');
const [data, setData] = useState<Partial<AssessmentData>>({});

// Render different components based on step
```

### Step 3.3: Wire Up Navigation

- TypeSelector sets type, moves to subtype
- SubtypeSelector sets subtype, moves to content
- ContentEditorForm can go back to subtype

**Test**: Can navigate forward and backward through steps

### Step 3.4: Add Route

```typescript
// In App.tsx or routes file
<Route
  path="/manual-assessment/create"
  element={<ManualAssessmentCreate />}
/>
```

### Step 3.5: Add Navigation Link

Add link from dashboard or header:

```typescript
<Button asChild>
  <Link to="/manual-assessment/create">Create Assessment</Link>
</Button>
```

✅ **Checkpoint**: Can access page, navigate through all steps

---

## Phase 4: Image Upload (4 hours)

### Step 4.1: Build ImagePasteZone Component

```typescript
// Basic structure:
- Drop zone area
- Paste event listener
- File input (hidden)
- Upload to Supabase storage
```

### Step 4.2: Implement Upload Function

```typescript
const uploadImage = async (file: File) => {
  const filename = `${Date.now()}-${file.name}`;

  const { data, error } = await supabase.storage
    .from('manual-assessment-images')
    .upload(filename, file);

  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage
    .from('manual-assessment-images')
    .getPublicUrl(data.path);

  return publicUrl;
};
```

### Step 4.3: Add Clipboard Paste

```typescript
const handlePaste = async (e: React.ClipboardEvent) => {
  const items = e.clipboardData.items;
  for (let item of items) {
    if (item.type.startsWith('image/')) {
      const file = item.getAsFile();
      if (file) {
        const url = await uploadImage(file);
        onImageUploaded(url);
      }
    }
  }
};
```

### Step 4.4: Integrate into ContentEditorForm

- Add ImagePasteZone for question image
- Add to each answer option

**Test**: Paste image from clipboard, see it upload and display

### Step 4.5: Add Loading States

- Show spinner during upload
- Disable form while uploading
- Show error if upload fails

✅ **Checkpoint**: Can paste images, they upload to Supabase

---

## Phase 5: Save Functionality (3 hours)

### Step 5.1: Build Save Function

```typescript
const handleSave = async () => {
  const assessment = {
    type: data.type,
    subtype: data.subtype,
    title: data.title || 'Untitled',
    content: {
      question: data.content.question,
      questionImage: data.content.questionImage,
      answers: data.content.answers,
      voiceGuidance: data.content.voiceGuidance
    },
    settings: data.settings,
    created_by: user.id,
    status: 'draft'
  };

  const { data: saved, error } = await supabase
    .from('manual_assessments')
    .insert([assessment])
    .select()
    .single();

  if (error) {
    console.error('Save error:', error);
    toast({
      title: 'Save failed',
      description: error.message,
      variant: 'destructive'
    });
    return;
  }

  toast({
    title: 'Assessment saved!',
    description: 'Your assessment is ready.'
  });

  navigate(`/manual-assessment/view/${saved.id}`);
};
```

### Step 5.2: Add Save Button

In ContentEditorForm:

```typescript
<Button
  onClick={handleSave}
  size="lg"
  className="w-full"
  disabled={!isValid()}
>
  ✅ Save Assessment
</Button>
```

### Step 5.3: Add Validation

```typescript
const isValid = () => {
  return (
    data.content?.question?.length > 10 &&
    data.content?.answers?.length >= 2 &&
    data.content?.answers?.some(a => a.isCorrect)
  );
};
```

### Step 5.4: Add Loading State

```typescript
const [isSaving, setIsSaving] = useState(false);

// Disable button while saving
<Button disabled={isSaving || !isValid()}>
  {isSaving ? 'Saving...' : 'Save Assessment'}
</Button>
```

✅ **Checkpoint**: Can save assessment to database

---

## Phase 6: Student View (5 hours)

### Step 6.1: Create Student View Page

```bash
touch src/pages/ManualAssessmentView.tsx
```

### Step 6.2: Build Basic Layout

Copy style from `/reading-exercise`:
- Gradient background
- Large text
- Coquí mascot
- Answer buttons

### Step 6.3: Fetch Assessment Data

```typescript
useEffect(() => {
  const fetchAssessment = async () => {
    const { data } = await supabase
      .from('manual_assessments')
      .select('*')
      .eq('id', id)
      .single();

    setAssessment(data);
  };

  fetchAssessment();
}, [id]);
```

### Step 6.4: Render Question and Answers

```typescript
<Card className="p-8">
  <h2 className="text-4xl font-bold mb-6">
    {assessment.content.question}
  </h2>

  {assessment.content.questionImage && (
    <img src={assessment.content.questionImage} />
  )}
</Card>

<div className="space-y-4">
  {assessment.content.answers.map((answer, index) => (
    <Button
      key={index}
      onClick={() => handleAnswer(index)}
      className="w-full text-2xl p-8"
    >
      {String.fromCharCode(65 + index)}) {answer.text}
    </Button>
  ))}
</div>
```

### Step 6.5: Add Answer Feedback

```typescript
const handleAnswer = (index: number) => {
  setSelectedAnswer(index);
  setShowFeedback(true);

  const isCorrect = assessment.content.answers[index].isCorrect;

  // Show visual feedback
  // Green for correct, red for incorrect
};
```

### Step 6.6: Add Route

```typescript
<Route
  path="/manual-assessment/view/:id"
  element={<ManualAssessmentView />}
/>
```

✅ **Checkpoint**: Can view saved assessment as student

---

## Phase 7: Voice Integration (6 hours)

### Step 7.1: Import Voice Hook

```typescript
import { useRealtimeVoice } from '@/hooks/useRealtimeVoice';
```

### Step 7.2: Initialize Voice System

```typescript
const { connect, sendText, isConnected, isAIPlaying } = useRealtimeVoice({
  studentId: user?.id || '',
  language: assessment?.settings.language === 'es' ? 'es-PR' : 'en-US',
  model: 'gpt-4o-realtime-preview-2024-12-17',
  onTranscription: (text, isUser) => {
    console.log(`Voice: ${text}`);
  }
});
```

### Step 7.3: Auto-Connect on Page Load

```typescript
useEffect(() => {
  if (assessment && !isConnected) {
    connect();
  }

  return () => disconnect();
}, [assessment]);
```

### Step 7.4: Read Question Automatically

```typescript
useEffect(() => {
  if (assessment && isConnected) {
    // Read guidance first
    if (assessment.content.voiceGuidance) {
      sendText(assessment.content.voiceGuidance);
      setTimeout(() => {
        sendText(assessment.content.question);
      }, 2000);
    } else {
      sendText(assessment.content.question);
    }
  }
}, [assessment, isConnected]);
```

### Step 7.5: Add Voice Feedback

```typescript
const handleAnswer = (index: number) => {
  // ... existing code

  const isCorrect = assessment.content.answers[index].isCorrect;
  const language = assessment.settings.language;

  // Voice feedback
  if (isCorrect) {
    sendText(
      language === 'es'
        ? '¡Excelente! Respuesta correcta.'
        : 'Excellent! Correct answer.'
    );
  } else {
    sendText(
      language === 'es'
        ? 'Inténtalo de nuevo.'
        : 'Try again.'
    );
  }
};
```

### Step 7.6: Sync Coquí with Voice

```typescript
const getCoquiState = () => {
  if (isAIPlaying) return 'speaking';
  if (showFeedback) {
    return isCorrect ? 'celebration' : 'neutral';
  }
  return 'thinking';
};

<CoquiMascot state={getCoquiState()} size="large" />
```

### Step 7.7: Test Voice in Both Languages

- Create Spanish assessment → Hear Spanish voice
- Create English assessment → Hear English voice

✅ **Checkpoint**: Voice reads questions and provides feedback

---

## Phase 8: Voice Settings UI (3 hours)

### Step 8.1: Add Voice Settings to ContentEditorForm

```typescript
<Card className="p-6">
  <h3 className="text-xl font-bold mb-4">🎙️ Voice Settings</h3>

  <Switch
    checked={voiceSettings.enableVoice}
    onCheckedChange={(checked) =>
      setVoiceSettings({ ...voiceSettings, enableVoice: checked })
    }
  />
  <label>Enable voice guidance</label>

  <Textarea
    value={voiceSettings.voiceGuidance}
    onChange={(e) =>
      setVoiceSettings({ ...voiceSettings, voiceGuidance: e.target.value })
    }
    placeholder="Custom voice message..."
  />
</Card>
```

### Step 8.2: Add to Settings Panel

```typescript
<SettingsPanel
  settings={data.settings}
  voiceSettings={voiceSettings}
  onChange={(settings) => setData({ ...data, settings })}
/>
```

### Step 8.3: Save Voice Settings

Include in save payload:

```typescript
const assessment = {
  // ... other fields
  enable_voice: voiceSettings.enableVoice,
  content: {
    // ... other content
    voiceGuidance: voiceSettings.voiceGuidance
  }
};
```

✅ **Checkpoint**: Teachers can customize voice settings

---

## Phase 9: Polish & Testing (4 hours)

### Step 9.1: Add True/False Type

Simpler version of multiple choice:
- Only 2 options (True/False)
- Different UI layout

### Step 9.2: Mobile Testing

Test on tablet (768px width):
- Touch-friendly buttons
- Keyboard doesn't cover inputs
- Images resize properly

### Step 9.3: Error Handling

Add try-catch blocks:
- Image upload failures
- Database save failures
- Voice connection failures

### Step 9.4: Loading States

Add spinners/skeletons:
- While fetching assessment
- While uploading images
- While saving

### Step 9.5: Validation Messages

Clear error messages:
- "Question must be at least 10 characters"
- "Please add at least 2 answer options"
- "Mark one answer as correct"

### Step 9.6: Toast Notifications

Success/error toasts:
- "Assessment saved!"
- "Image uploaded"
- "Connection failed"

✅ **Checkpoint**: System feels polished and complete

---

## Phase 10: Preview Mode (3 hours)

### Step 10.1: Create Preview Page

```bash
touch src/pages/ManualAssessmentPreview.tsx
```

### Step 10.2: Reuse Student View Component

```typescript
// Make ManualAssessmentView accept preview prop
export default function ManualAssessmentView({ previewData }: Props) {
  const assessment = previewData || fetchedAssessment;
  // ... rest of component
}
```

### Step 10.3: Add Preview Button

In ContentEditorForm:

```typescript
<Button
  onClick={() => navigate('/manual-assessment/preview', {
    state: { assessment: data }
  })}
  variant="outline"
>
  👁️ Preview
</Button>
```

### Step 10.4: Preview Page Layout

```typescript
export default function ManualAssessmentPreview() {
  const { state } = useLocation();

  return (
    <div>
      <div className="bg-yellow-100 p-4 text-center">
        📝 Preview Mode - This is how students will see it
      </div>

      <ManualAssessmentView previewData={state.assessment} />

      <div className="fixed bottom-4 right-4">
        <Button onClick={() => navigate(-1)}>
          ← Back to Edit
        </Button>
      </div>
    </div>
  );
}
```

✅ **Checkpoint**: Can preview before saving

---

## Testing Checklist

### Functionality Tests

```
□ Can navigate type → subtype → form
□ Can enter question text
□ Can add/remove answer options
□ Can mark correct answer
□ Can paste images from clipboard
□ Images upload to Supabase
□ Can save assessment to database
□ Can view assessment as student
□ Voice connects automatically
□ Voice reads question in correct language
□ Voice provides feedback on answers
□ Coquí mascot syncs with voice
□ Preview mode works
□ Can edit and re-save assessments
```

### UI/UX Tests

```
□ Matches style of /reading-exercise
□ Large, kid-friendly text
□ Colorful and engaging
□ Coquí mascot visible
□ Smooth transitions between steps
□ Clear error messages
□ Loading states for async operations
□ Mobile-friendly (tablets)
□ Touch-friendly buttons
```

### Edge Cases

```
□ No question text → validation error
□ No correct answer → validation error
□ Upload image failure → shows error
□ Voice connection failure → fallback mode
□ No internet → shows offline message
□ Navigate away → confirm unsaved changes
```

---

## Deployment Checklist

### Before Deploying

```
□ Run all migrations on production database
□ Create storage bucket in production
□ Test with production Supabase instance
□ Verify RLS policies work correctly
□ Check voice Edge Function is deployed
□ Test on multiple devices (desktop, tablet, phone)
□ Get teacher to test create flow
□ Get student to test view flow
```

### After Deploying

```
□ Monitor Supabase logs for errors
□ Check storage bucket usage
□ Verify voice connections working
□ Test in both Spanish and English
□ Get feedback from real users
```

---

## Time Estimates Summary

| Phase | Task | Hours |
|-------|------|-------|
| 1 | Database Setup | 2 |
| 2 | Basic UI Components | 6 |
| 3 | Main Page Integration | 4 |
| 4 | Image Upload | 4 |
| 5 | Save Functionality | 3 |
| 6 | Student View | 5 |
| 7 | Voice Integration | 6 |
| 8 | Voice Settings UI | 3 |
| 9 | Polish & Testing | 4 |
| 10 | Preview Mode | 3 |
| **Total** | **Complete MVP** | **40 hours** |

Estimated: **5 working days** (8 hours/day)

---

## Quick Start Command

```bash
# Clone and setup
cd /workspaces/k5-poc-1e7850ce

# Create database migration
npx supabase migration new create_manual_assessments

# Create component directories
mkdir -p src/components/ManualAssessment
mkdir -p src/pages

# Create files
touch src/pages/ManualAssessmentCreate.tsx
touch src/pages/ManualAssessmentView.tsx
touch src/pages/ManualAssessmentPreview.tsx
touch src/components/ManualAssessment/TypeSelector.tsx
touch src/components/ManualAssessment/SubtypeSelector.tsx
touch src/components/ManualAssessment/ContentEditorForm.tsx
touch src/components/ManualAssessment/AnswerList.tsx
touch src/components/ManualAssessment/ImagePasteZone.tsx

# Run migrations
npx supabase db reset

# Start development
npm run dev
```

---

## Success Criteria

System is complete when:
1. ✅ Teacher can create assessment in < 5 minutes
2. ✅ Images paste from clipboard easily
3. ✅ Voice reads questions in student's language
4. ✅ UI matches kid-friendly style
5. ✅ Works on tablets smoothly
6. ✅ Saves to database reliably
7. ✅ Students can complete assessments
8. ✅ Voice feedback is clear and helpful

---

**Remember**: Build in phases. Get each phase working before moving to the next. Don't try to build everything at once!
