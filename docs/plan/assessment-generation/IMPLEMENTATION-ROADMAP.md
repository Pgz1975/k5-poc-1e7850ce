# Implementation Roadmap

## Overview
Step-by-step implementation guide for the simple assessment generation system with visual editor.

## Phase 1: Edge Functions Setup (Day 1)
Priority: Core functionality first

### 1.1 Basic Functions
```bash
# Create edge functions
supabase functions new list-pdf-content
supabase functions new generate-assessment
supabase functions new get-assessment
```

### 1.2 Deploy Core Functions
1. `list-pdf-content` - Fetch and display parsed PDF data
2. `generate-assessment` - Create assessments from selections
3. `get-assessment` - Retrieve generated assessments

### 1.3 Test with Postman/curl
```bash
# Test listing content
curl -X GET "http://localhost:54321/functions/v1/list-pdf-content?document_id=xxx"

# Test generation
curl -X POST "http://localhost:54321/functions/v1/generate-assessment" \
  -H "Content-Type: application/json" \
  -d '{"selected_items": {...}}'
```

## Phase 2: UI Components (Day 2)

### 2.1 Create Base Pages
```typescript
// src/pages/AssessmentGenerator.tsx
// src/pages/GeneratedAssessment.tsx
// src/pages/VisualEditor.tsx
```

### 2.2 Component Structure
```
src/
  components/
    assessment/
      PDFSelector.tsx
      ContentList.tsx
      ContentItem.tsx
      GenerateControls.tsx
    generated/
      AssessmentDisplay.tsx
      QuizQuestion.tsx
      ReadingExercise.tsx
      CoquiMascot.tsx
    editor/
      EditorCanvas.tsx
      PropertiesPanel.tsx
      InlineTextEditor.tsx
      ImageManager.tsx
      QuestionEditor.tsx
```

### 2.3 Routing Setup
```typescript
// src/App.tsx
<Routes>
  <Route path="/assessment-generator" element={<AssessmentGenerator />} />
  <Route path="/generated/:id" element={<GeneratedAssessment />} />
  <Route path="/editor/:id" element={<VisualEditor />} />
</Routes>
```

## Phase 3: Visual Editor (Day 3)

### 3.1 Editor Functions
```bash
supabase functions new update-assessment
supabase functions new get-pdf-images
supabase functions new search-pexels
```

### 3.2 Editor Components
- Drag and drop with @dnd-kit/sortable
- Inline editing with contentEditable
- Auto-save with debouncing
- Preview mode toggle

### 3.3 Image Sources Integration
- PDF images from storage
- Pexels API search
- Upload functionality
- Gallery from previous assessments

## Phase 4: Templates (Day 4)

### 4.1 Create Template Components
```typescript
// src/templates/
//   VowelRecognition.tsx
//   PictureMatch.tsx
//   SizeComparison.tsx
//   ReadingComprehension.tsx
//   VocabularyCards.tsx
//   PatternRecognition.tsx
//   SimpleMath.tsx
//   PositionLearning.tsx
```

### 4.2 Template Switching Logic
```typescript
function getTemplateComponent(type: string) {
  switch(type) {
    case 'vowel_recognition': return VowelRecognition
    case 'picture_match': return PictureMatch
    // ... etc
  }
}
```

## Phase 5: Integration & Polish (Day 5)

### 5.1 Environment Setup
```env
PEXELS_API_KEY=your_key_here
SUPABASE_URL=your_url_here
SUPABASE_ANON_KEY=your_key_here
```

### 5.2 Final Features
- Error handling
- Loading states
- Success notifications
- Mobile responsive testing
- Keyboard shortcuts
- Print functionality

## Database Requirements

### New Table for Generated Assessments
```sql
CREATE TABLE generated_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  selected_items JSONB NOT NULL,
  type TEXT NOT NULL,
  grade_level INTEGER,
  language TEXT DEFAULT 'es',
  content JSONB NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Index for fast queries
CREATE INDEX idx_generated_assessments_type ON generated_assessments(type);
CREATE INDEX idx_generated_assessments_created_by ON generated_assessments(created_by);
```

### Storage Buckets
```sql
-- For uploaded images
INSERT INTO storage.buckets (id, name, public)
VALUES ('assessment-uploads', 'assessment-uploads', true);
```

## Testing Strategy

### 1. Unit Tests
```typescript
// tests/components/InlineTextEditor.test.tsx
// tests/components/QuestionEditor.test.tsx
// tests/utils/templateGenerator.test.ts
```

### 2. Integration Tests
```typescript
// tests/integration/assessment-generation.test.ts
// tests/integration/editor-save.test.ts
```

### 3. E2E Tests
```typescript
// cypress/e2e/full-flow.cy.ts
describe('Assessment Generation Flow', () => {
  it('selects content and generates assessment', () => {
    // Select PDF content
    // Generate assessment
    // Edit in visual editor
    // Save and preview
  })
})
```

## Deployment Checklist

### Pre-deployment
- [ ] All Edge Functions tested locally
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] Storage buckets created
- [ ] Pexels API key obtained

### Deployment
```bash
# Deploy Edge Functions
supabase functions deploy list-pdf-content
supabase functions deploy generate-assessment
supabase functions deploy get-assessment
supabase functions deploy update-assessment

# Deploy Frontend
npm run build
npm run deploy
```

### Post-deployment
- [ ] Test all endpoints in production
- [ ] Verify image uploads work
- [ ] Check auto-save functionality
- [ ] Test on mobile devices
- [ ] Monitor error logs

## Quick Start Commands

```bash
# 1. Install dependencies
npm install @dnd-kit/sortable

# 2. Set up environment
cp .env.example .env.local
# Add your Pexels API key

# 3. Run migrations
supabase db push

# 4. Start local development
supabase start
npm run dev

# 5. Deploy functions
supabase functions deploy --no-verify-jwt
```

## Common Issues & Solutions

### Issue: Images not loading
**Solution**: Check storage bucket permissions and CORS settings

### Issue: Auto-save not working
**Solution**: Verify debounce timeout and network connectivity

### Issue: Drag and drop not smooth
**Solution**: Add CSS transitions and optimize re-renders

### Issue: Pexels rate limiting
**Solution**: Implement caching and reduce API calls

## Performance Optimization

1. **Image Optimization**
   - Lazy load images
   - Use appropriate sizes
   - Cache Pexels results

2. **Component Optimization**
   - Memoize expensive computations
   - Use React.memo for static components
   - Virtualize long lists

3. **API Optimization**
   - Batch updates
   - Debounce auto-save
   - Cache frequent queries

## Success Metrics

- Page load time < 2 seconds
- Auto-save delay < 1 second
- Drag-drop response < 100ms
- Assessment generation < 3 seconds
- Zero data loss on editor crashes

## Next Steps After MVP

1. Add collaboration features
2. Implement version history
3. Add more template types
4. Create template marketplace
5. Add analytics dashboard
6. Implement A/B testing
7. Add multi-language support
8. Create mobile app version