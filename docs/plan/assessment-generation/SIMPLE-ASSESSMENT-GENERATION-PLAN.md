# Simple Assessment Generation Plan

## Overview
A straightforward Edge Function system to display parsed PDF content and generate kid-friendly assessments/courses based on selected items from the database.

## Goals
- **Simple**: No over-engineering, direct implementation
- **Visual**: Show all extracted content (text, images, questions)
- **Kid-Friendly**: Match the existing /reading-exercise style
- **Flexible**: Generate different types based on selection

## Database Tables Used
- `pdf_documents` - Uploaded PDF metadata
- `pdf_text_content` - Extracted text blocks
- `pdf_images` - Extracted images with storage paths
- `assessment_questions` - Auto-generated questions
- `vocabulary_terms` - Bilingual vocabulary

## Simple Architecture

### 1. Content Display Edge Function
**Endpoint**: `/functions/v1/list-pdf-content`

**Purpose**: Fetch and display all parsed content from a PDF

**Response Structure**:
```json
{
  "document": {
    "id": "uuid",
    "filename": "M_KINDER U1 TG1.pdf",
    "grade_level": [1],
    "subject_area": ["math", "spanish"]
  },
  "content": [
    {
      "id": "uuid",
      "type": "text",
      "page": 1,
      "text": "Las vocales son...",
      "images": ["url1", "url2"]
    },
    {
      "id": "uuid",
      "type": "question",
      "page": 6,
      "question": "¿Con qué letra comienza?",
      "options": ["a", "e", "i"],
      "correct": "e",
      "images": ["school.png"]
    }
  ]
}
```

### 2. Assessment Generation Edge Function
**Endpoint**: `/functions/v1/generate-assessment`

**Input**:
```json
{
  "selected_items": ["uuid1", "uuid2", "uuid3"],
  "type": "exercise",  // or "quiz", "lesson"
  "grade_level": 1
}
```

**Output**: Direct HTML/JSON for rendering

## UI Components (Simple React)

### 1. Content List Page
```
/assessment-generator
├── Shows all parsed PDFs
├── Click to view content
└── Select items + Generate button
```

**Features**:
- List view with checkboxes
- Shows: Text preview, images, question type
- Multi-select for batch generation
- Simple "Generate" button

### 2. Generated Assessment Pages
```
/generated/[id]
├── Kid-friendly layout
├── Big text and images
├── Coquí mascot states
└── Pexels images for decoration
```

## Template Types (Keep It Simple)

### 1. Reading Exercise Template
- Large text display
- Images from PDF + Pexels
- Coquí mascot reactions
- Progress dots

### 2. Multiple Choice Template
- Big question text
- Image cards for options
- Fun animations on select
- Star rewards

### 3. Matching Template
- Drag and drop cards
- Visual connections
- Sound effects
- Completion celebration

### 4. Vocabulary Template
- Word cards with images
- Flip for translation
- Audio pronunciation
- Memory game style

## Edge Function Implementation

### `/functions/v1/list-pdf-content.js`
```javascript
export async function handler(req, context) {
  // 1. Get PDF document ID from query
  // 2. Fetch from tables: pdf_text_content, pdf_images, assessment_questions
  // 3. Combine and return as simple JSON
  // No complex processing - just fetch and return
}
```

### `/functions/v1/generate-assessment.js`
```javascript
export async function handler(req, context) {
  // 1. Get selected item IDs
  // 2. Fetch full content for each
  // 3. Pick template based on type
  // 4. Generate HTML with:
  //    - Text content
  //    - Original images
  //    - Pexels decoration images
  //    - Coquí mascot positions
  // 5. Save to database
  // 6. Return assessment URL
}
```

## Pexels Integration
- API Key in environment variable
- Search based on topic keywords
- Cache images for reuse
- Kid-safe search terms only

## Simple Database Tables for Generated Content

### `generated_assessments`
```sql
CREATE TABLE generated_assessments (
  id UUID PRIMARY KEY,
  source_pdf_id UUID REFERENCES pdf_documents(id),
  selected_items UUID[],
  type TEXT, -- 'exercise', 'quiz', 'lesson'
  grade_level INTEGER,
  content JSONB, -- Full generated content
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## File Structure
```
/supabase/functions/
├── list-pdf-content/
│   └── index.ts
├── generate-assessment/
│   └── index.ts
└── _shared/
    ├── templates.ts
    └── pexels.ts

/src/pages/
├── assessment-generator.tsx
└── generated/
    └── [id].tsx
```

## Implementation Steps

### Phase 1: Display (Day 1)
1. Create `list-pdf-content` edge function
2. Build simple list UI with checkboxes
3. Show all content types (text, images, questions)

### Phase 2: Generation (Day 2)
1. Create `generate-assessment` edge function
2. Build 2-3 simple templates
3. Integrate Pexels API
4. Add Coquí mascot states

### Phase 3: Polish (Day 3)
1. Add more templates as needed
2. Improve kid-friendly styling
3. Add sound effects
4. Test with sample PDFs

## Key Principles
- **NO OVER-ENGINEERING** - Direct, simple solutions
- **USE EXISTING DATA** - All content from parsed PDFs
- **VISUAL FIRST** - Images are as important as text
- **KID FRIENDLY** - Big, colorful, fun
- **FAST ITERATION** - Working POC over perfect architecture

## Example Selection Flow
1. User sees list: "Lesson 1: Las Vocales" with preview
2. Checks 3 items about vowels
3. Selects "Generate Reading Exercise"
4. System creates 3 pages with:
   - Original vowel images
   - Pexels decoration (rainbows, animals)
   - Big friendly text
   - Coquí celebrating progress

## Success Metrics
- Can display all parsed content ✓
- Can select multiple items ✓
- Generates kid-friendly pages ✓
- Uses original PDF images ✓
- Works with existing reading-exercise style ✓

## NOT Included (Keep Simple)
- Complex scoring systems
- User management
- Progress tracking
- Adaptive difficulty
- Analytics
- Multi-language UI (content is bilingual, UI stays simple)