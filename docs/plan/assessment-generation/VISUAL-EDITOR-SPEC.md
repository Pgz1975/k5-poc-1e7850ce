# Visual Editor Specification

## Overview
A simple, intuitive visual editor for modifying generated assessments and lessons. Direct manipulation with live preview - no complex forms or configurations.

## Editor Route
`/editor/[assessment-id]`

## Core Features

### 1. Template Switching
- Dropdown to change template type on the fly
- Instant preview of content in new template
- Keep content, just change presentation

### 2. Text Editing
- Click any text to edit in-place
- Rich text toolbar (bold, size, color)
- Auto-save on blur

### 3. Image Management
- Add images from multiple sources:
  - Upload new
  - Pick from PDF images
  - Search Pexels
  - Image gallery from previous assessments
- Drag to reposition
- Click to resize
- Right-click to remove

### 4. Question/Answer Management
- Add new questions with "+" button
- Edit questions and answers inline
- Drag to reorder
- Delete with trash icon
- Add/remove answer options

## UI Layout

```
┌─────────────────────────────────────────────────────────────┐
│  ✏️ Edit Assessment                              [Preview] │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Toolbar:                                                   │
│  [Template ▼] [Add Text] [Add Image] [Add Question] [Save] │
│                                                              │
│  ┌──────────────────────────────┬─────────────────────────┐│
│  │                              │                         ││
│  │     EDITOR CANVAS            │     PROPERTIES PANEL   ││
│  │                              │                         ││
│  │  ┌────────────────────┐     │  Selected: Text Block  ││
│  │  │ ¿Con qué letra      │     │  ┌─────────────────┐   ││
│  │  │ comienza? [edit]    │     │  │ Font Size: 32px │   ││
│  │  └────────────────────┘     │  │ Color: #000     │   ││
│  │                              │  │ Bold: ☑         │   ││
│  │  [🖼️ Image] [🖼️] [🖼️]      │  └─────────────────┘   ││
│  │   ↕️ drag to reorder         │                         ││
│  │                              │  Quick Actions:        ││
│  │  Options:                    │  [Duplicate]           ││
│  │  ○ A [edit] [✖️]            │  [Delete]              ││
│  │  ● E [edit] [✖️]            │  [Move Up]             ││
│  │  ○ I [edit] [✖️]            │  [Move Down]           ││
│  │  [+ Add Option]              │                         ││
│  │                              │  Image Library:        ││
│  │  🐸 Mascot: [Happy ▼]       │  [From PDF] [Pexels]   ││
│  │                              │  [Upload] [Gallery]    ││
│  └──────────────────────────────┴─────────────────────────┘│
│                                                              │
│  Pages: [1] [2] [3] [+]                      [Auto-save ✓] │
└─────────────────────────────────────────────────────────────┘
```

## Editor Components

### 1. Template Switcher
```javascript
const templates = [
  'reading_exercise',
  'picture_match',
  'vocabulary_cards',
  'quiz',
  'size_comparison',
  'position_learning'
]

function TemplateSwitcher({ currentTemplate, onSwitch }) {
  return (
    <select onChange={(e) => onSwitch(e.target.value)}>
      {templates.map(t => (
        <option value={t}>{t.replace('_', ' ')}</option>
      ))}
    </select>
  )
}
```

### 2. Inline Text Editor
```javascript
function InlineTextEditor({ text, onSave }) {
  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = useState(text)

  if (isEditing) {
    return (
      <div className="border-2 border-blue-500 p-2">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={() => {
            onSave(value)
            setIsEditing(false)
          }}
          className="w-full text-3xl"
          autoFocus
        />
      </div>
    )
  }

  return (
    <div
      onClick={() => setIsEditing(true)}
      className="hover:bg-blue-50 cursor-text p-2"
    >
      {text}
    </div>
  )
}
```

### 3. Image Manager
```javascript
function ImageManager({ images, onAdd, onRemove, onReorder }) {
  const [showPicker, setShowPicker] = useState(false)

  return (
    <div className="grid grid-cols-3 gap-4">
      {images.map((img, idx) => (
        <div key={idx} className="relative group">
          <img src={img} className="w-full h-32 object-cover" />
          <button
            onClick={() => onRemove(idx)}
            className="absolute top-1 right-1 bg-red-500 text-white p-1
                     opacity-0 group-hover:opacity-100"
          >
            ✖️
          </button>
        </div>
      ))}
      <button
        onClick={() => setShowPicker(true)}
        className="border-2 border-dashed h-32 flex items-center justify-center"
      >
        + Add Image
      </button>

      {showPicker && <ImagePicker onSelect={onAdd} />}
    </div>
  )
}
```

### 4. Question Editor
```javascript
function QuestionEditor({ question, onUpdate }) {
  const [options, setOptions] = useState(question.options || [])

  const addOption = () => {
    setOptions([...options, ''])
    onUpdate({ ...question, options: [...options, ''] })
  }

  const updateOption = (index, value) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
    onUpdate({ ...question, options: newOptions })
  }

  const removeOption = (index) => {
    const newOptions = options.filter((_, i) => i !== index)
    setOptions(newOptions)
    onUpdate({ ...question, options: newOptions })
  }

  return (
    <div className="border rounded p-4">
      <InlineTextEditor
        text={question.text}
        onSave={(text) => onUpdate({ ...question, text })}
      />

      <div className="mt-4">
        {options.map((opt, idx) => (
          <div key={idx} className="flex items-center gap-2 mb-2">
            <input
              type="radio"
              checked={question.correct === idx}
              onChange={() => onUpdate({ ...question, correct: idx })}
            />
            <input
              type="text"
              value={opt}
              onChange={(e) => updateOption(idx, e.target.value)}
              className="flex-1 p-2 border"
            />
            <button onClick={() => removeOption(idx)}>✖️</button>
          </div>
        ))}
        <button onClick={addOption} className="text-blue-500">
          + Add Option
        </button>
      </div>
    </div>
  )
}
```

## Image Sources

### 1. PDF Images
```javascript
async function fetchPDFImages(documentId) {
  const response = await fetch(`/functions/v1/get-pdf-images?doc_id=${documentId}`)
  return response.json() // Returns all images from original PDF
}
```

### 2. Pexels Search
```javascript
async function searchPexels(query) {
  const response = await fetch(`/functions/v1/search-pexels?q=${query}`)
  return response.json() // Returns kid-safe images
}
```

### 3. Upload New
```javascript
function ImageUploader({ onUpload }) {
  return (
    <input
      type="file"
      accept="image/*"
      onChange={async (e) => {
        const file = e.target.files[0]
        const url = await uploadToSupabase(file)
        onUpload(url)
      }}
    />
  )
}
```

### 4. Gallery (Previous Assessments)
```javascript
async function fetchGallery() {
  const response = await fetch('/functions/v1/get-assessment-gallery')
  return response.json() // Returns commonly used images
}
```

## Properties Panel

### Text Properties
- Font size: 16px - 48px slider
- Color picker
- Bold, italic toggles
- Alignment: left, center, right

### Image Properties
- Size: small, medium, large, full
- Border radius: 0 - 20px
- Shadow: none, small, large
- Alt text for accessibility

### Question Properties
- Question type dropdown
- Points value
- Difficulty: easy, medium, hard
- Hint text field

### Page Properties
- Background color/gradient
- Mascot position
- Progress indicator style

## Auto-Save System

```javascript
function useAutoSave(content, assessmentId) {
  const [isSaving, setIsSaving] = useState(false)
  const saveTimeout = useRef()

  useEffect(() => {
    clearTimeout(saveTimeout.current)
    saveTimeout.current = setTimeout(async () => {
      setIsSaving(true)
      await fetch('/functions/v1/update-assessment', {
        method: 'POST',
        body: JSON.stringify({ id: assessmentId, content })
      })
      setIsSaving(false)
    }, 1000) // Save 1 second after last change
  }, [content])

  return isSaving
}
```

## Drag and Drop System

```javascript
import { DndContext, closestCenter } from '@dnd-kit/sortable'

function DraggableContent({ items, onReorder }) {
  const handleDragEnd = (event) => {
    const { active, over } = event
    if (active.id !== over.id) {
      const oldIndex = items.findIndex(i => i.id === active.id)
      const newIndex = items.findIndex(i => i.id === over.id)
      onReorder(arrayMove(items, oldIndex, newIndex))
    }
  }

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      {items.map(item => (
        <DraggableItem key={item.id} item={item} />
      ))}
    </DndContext>
  )
}
```

## Preview Mode

Toggle between edit and preview to see exactly how students will see it:

```javascript
function EditorWithPreview() {
  const [mode, setMode] = useState('edit') // 'edit' or 'preview'

  return (
    <div>
      <button onClick={() => setMode(mode === 'edit' ? 'preview' : 'edit')}>
        {mode === 'edit' ? '👁️ Preview' : '✏️ Edit'}
      </button>

      {mode === 'edit' ? (
        <EditorCanvas />
      ) : (
        <PreviewCanvas />
      )}
    </div>
  )
}
```

## Edge Function Updates

### Update Assessment
**Endpoint**: `POST /functions/v1/update-assessment`

```typescript
export async function handler(req) {
  const { id, content } = await req.json()

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL'),
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  )

  const { data, error } = await supabase
    .from('generated_assessments')
    .update({
      content,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)

  return new Response(
    JSON.stringify({ success: !error }),
    { headers: { 'Content-Type': 'application/json' } }
  )
}
```

## Keyboard Shortcuts

- `Ctrl+S`: Save immediately
- `Delete`: Remove selected element
- `Ctrl+Z`: Undo last change
- `Ctrl+Y`: Redo
- `Ctrl+D`: Duplicate selected element
- `Arrow keys`: Move selected element

## Mobile Editor

Simplified toolbar for touch devices:

```
┌─────────────────────┐
│ ← Back   [Save]     │
├─────────────────────┤
│ [📝] [🖼️] [❓] [🎨] │
├─────────────────────┤
│                     │
│   Tap to edit       │
│   Hold to drag      │
│   Swipe to delete   │
│                     │
└─────────────────────┘
```

## Validation

Before saving, check:
- At least one question has correct answer
- All images have alt text
- Text is readable (contrast check)
- No empty pages

## Export Options

- Save as template for reuse
- Export as PDF
- Share link for preview
- Duplicate assessment