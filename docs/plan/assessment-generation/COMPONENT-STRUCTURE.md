# Component Structure Specification

## Component Hierarchy

```
App.tsx
├── AssessmentGenerator/
│   ├── PDFSelector
│   ├── ContentList
│   │   └── ContentItem (repeating)
│   └── GenerateControls
├── GeneratedAssessment/
│   ├── ProgressBar
│   ├── AssessmentContent
│   │   └── TemplateRenderer
│   ├── CoquiMascot
│   └── NavigationButtons
└── VisualEditor/
    ├── EditorToolbar
    ├── EditorCanvas
    │   └── EditableElements
    ├── PropertiesPanel
    └── ImagePicker
```

## Core Components

### 1. PDFSelector Component
```typescript
interface PDFSelectorProps {
  documents: PDFDocument[]
  selectedId: string | null
  onSelect: (id: string) => void
}

function PDFSelector({ documents, selectedId, onSelect }: PDFSelectorProps) {
  return (
    <select
      value={selectedId || ''}
      onChange={(e) => onSelect(e.target.value)}
      className="w-full p-3 border-2 border-blue-300 rounded-lg text-lg"
    >
      <option value="">Select a PDF document...</option>
      {documents.map(doc => (
        <option key={doc.id} value={doc.id}>
          {doc.filename} - {doc.total_pages} pages
        </option>
      ))}
    </select>
  )
}
```

### 2. ContentList Component
```typescript
interface ContentListProps {
  documentId: string
  onSelectionChange: (selected: SelectedItems) => void
}

interface SelectedItems {
  texts: string[]
  images: string[]
  questions: string[]
}

function ContentList({ documentId, onSelectionChange }: ContentListProps) {
  const [content, setContent] = useState<ParsedContent | null>(null)
  const [selected, setSelected] = useState<SelectedItems>({
    texts: [],
    images: [],
    questions: []
  })

  useEffect(() => {
    fetchPDFContent(documentId).then(setContent)
  }, [documentId])

  const toggleSelection = (type: keyof SelectedItems, id: string) => {
    setSelected(prev => {
      const updated = { ...prev }
      if (updated[type].includes(id)) {
        updated[type] = updated[type].filter(i => i !== id)
      } else {
        updated[type] = [...updated[type], id]
      }
      onSelectionChange(updated)
      return updated
    })
  }

  return (
    <div className="space-y-4 max-h-96 overflow-y-auto border rounded-lg p-4">
      {content?.texts.map(text => (
        <ContentItem
          key={text.id}
          item={text}
          type="text"
          selected={selected.texts.includes(text.id)}
          onToggle={() => toggleSelection('texts', text.id)}
        />
      ))}
      {/* Similar for images and questions */}
    </div>
  )
}
```

### 3. ContentItem Component
```typescript
interface ContentItemProps {
  item: TextContent | ImageContent | Question
  type: 'text' | 'image' | 'question'
  selected: boolean
  onToggle: () => void
}

function ContentItem({ item, type, selected, onToggle }: ContentItemProps) {
  return (
    <div
      className={`
        border-2 rounded-lg p-4 cursor-pointer transition-all
        ${selected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}
      `}
      onClick={onToggle}
    >
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={selected}
          onChange={onToggle}
          className="mt-1"
          onClick={(e) => e.stopPropagation()}
        />

        <div className="flex-1">
          <div className="text-xs text-gray-500 mb-1">
            Page {item.page_number} • {type}
          </div>

          {type === 'text' && (
            <p className="text-sm line-clamp-3">{item.text_content}</p>
          )}

          {type === 'image' && (
            <div className="flex gap-2">
              <img src={item.storage_path} alt={item.alt_text} className="h-20 rounded" />
              <span className="text-sm">{item.alt_text}</span>
            </div>
          )}

          {type === 'question' && (
            <div>
              <p className="font-medium">{item.question_text}</p>
              <div className="text-xs mt-1">
                {item.options?.map((opt, i) => (
                  <span key={i} className="mr-2">
                    {i === item.correct_answer && '✓'} {opt}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
```

### 4. GenerateControls Component
```typescript
interface GenerateControlsProps {
  selectedCount: number
  onGenerate: (type: AssessmentType, options: GenerateOptions) => void
}

function GenerateControls({ selectedCount, onGenerate }: GenerateControlsProps) {
  const [type, setType] = useState<AssessmentType>('reading_exercise')
  const [gradeLevel, setGradeLevel] = useState(1)
  const [language, setLanguage] = useState('es')

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-lg font-medium">
          {selectedCount} items selected
        </span>

        <div className="flex gap-2">
          <button
            className={`px-4 py-2 rounded ${type === 'reading_exercise' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setType('reading_exercise')}
          >
            Reading Exercise
          </button>
          <button
            className={`px-4 py-2 rounded ${type === 'quiz' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setType('quiz')}
          >
            Quiz
          </button>
          <button
            className={`px-4 py-2 rounded ${type === 'lesson' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setType('lesson')}
          >
            Lesson
          </button>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <select
          value={gradeLevel}
          onChange={(e) => setGradeLevel(Number(e.target.value))}
          className="px-3 py-2 border rounded"
        >
          <option value={0}>Kindergarten</option>
          <option value={1}>Grade 1</option>
          <option value={2}>Grade 2</option>
        </select>

        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="px-3 py-2 border rounded"
        >
          <option value="es">Español</option>
          <option value="en">English</option>
        </select>
      </div>

      <button
        disabled={selectedCount === 0}
        onClick={() => onGenerate(type, { gradeLevel, language })}
        className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white
                   font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed
                   hover:from-blue-600 hover:to-purple-600 transition-all"
      >
        🎨 Generate Assessment
      </button>
    </div>
  )
}
```

### 5. CoquiMascot Component
```typescript
interface CoquiMascotProps {
  state: 'happy' | 'excited' | 'thinking' | 'celebrating'
  message?: string
  position?: 'left' | 'right' | 'center'
}

function CoquiMascot({ state, message, position = 'center' }: CoquiMascotProps) {
  const mascotImages = {
    happy: '/assets/coqui-happy.svg',
    excited: '/assets/coqui-excited.svg',
    thinking: '/assets/coqui-thinking.svg',
    celebrating: '/assets/coqui-celebrating.svg'
  }

  return (
    <div className={`flex items-center gap-4 ${position === 'center' ? 'justify-center' : `justify-${position}`}`}>
      <img
        src={mascotImages[state]}
        alt="Coquí Mascot"
        className="w-24 h-24 animate-bounce-slow"
      />
      {message && (
        <div className="speech-bubble bg-white p-3 rounded-lg shadow-lg">
          <p className="text-lg font-medium">{message}</p>
        </div>
      )}
    </div>
  )
}
```

### 6. InlineTextEditor Component
```typescript
interface InlineTextEditorProps {
  text: string
  onSave: (text: string) => void
  className?: string
  multiline?: boolean
}

function InlineTextEditor({ text, onSave, className = '', multiline = false }: InlineTextEditorProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = useState(text)
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const handleSave = () => {
    if (value !== text) {
      onSave(value)
    }
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      handleSave()
    } else if (e.key === 'Escape') {
      setValue(text)
      setIsEditing(false)
    }
  }

  if (isEditing) {
    const Component = multiline ? 'textarea' : 'input'
    return (
      <Component
        ref={inputRef as any}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className={`w-full p-2 border-2 border-blue-500 rounded ${className}`}
        rows={multiline ? 4 : undefined}
      />
    )
  }

  return (
    <div
      onClick={() => setIsEditing(true)}
      className={`cursor-text hover:bg-blue-50 p-2 rounded transition-colors ${className}`}
    >
      {text || <span className="text-gray-400">Click to edit...</span>}
    </div>
  )
}
```

### 7. ImageManager Component
```typescript
interface ImageManagerProps {
  images: string[]
  onAdd: (url: string) => void
  onRemove: (index: number) => void
  onReorder: (images: string[]) => void
}

function ImageManager({ images, onAdd, onRemove, onReorder }: ImageManagerProps) {
  const [showPicker, setShowPicker] = useState(false)
  const [activeSource, setActiveSource] = useState<'pdf' | 'pexels' | 'upload'>('pdf')

  return (
    <>
      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={(event) => {
          const { active, over } = event
          if (active.id !== over?.id) {
            const oldIndex = images.findIndex(img => img === active.id)
            const newIndex = images.findIndex(img => img === over?.id)
            const newImages = arrayMove(images, oldIndex, newIndex)
            onReorder(newImages)
          }
        }}
      >
        <SortableContext items={images} strategy={verticalListSortingStrategy}>
          <div className="grid grid-cols-3 gap-4">
            {images.map((image, index) => (
              <SortableImage
                key={image}
                id={image}
                url={image}
                onRemove={() => onRemove(index)}
              />
            ))}

            <button
              onClick={() => setShowPicker(true)}
              className="border-2 border-dashed border-gray-300 rounded-lg h-32
                       flex items-center justify-center hover:border-blue-500 transition-colors"
            >
              <span className="text-4xl">+</span>
            </button>
          </div>
        </SortableContext>
      </DndContext>

      {showPicker && (
        <ImagePicker
          source={activeSource}
          onSelect={(url) => {
            onAdd(url)
            setShowPicker(false)
          }}
          onClose={() => setShowPicker(false)}
        />
      )}
    </>
  )
}
```

### 8. QuestionEditor Component
```typescript
interface QuestionEditorProps {
  question: Question
  onUpdate: (question: Question) => void
  onRemove: () => void
}

function QuestionEditor({ question, onUpdate, onRemove }: QuestionEditorProps) {
  const [options, setOptions] = useState(question.options || [])
  const [correctAnswer, setCorrectAnswer] = useState(question.correct_answer)

  const addOption = () => {
    const newOptions = [...options, '']
    setOptions(newOptions)
    onUpdate({ ...question, options: newOptions })
  }

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
    onUpdate({ ...question, options: newOptions })
  }

  const removeOption = (index: number) => {
    const newOptions = options.filter((_, i) => i !== index)
    setOptions(newOptions)
    if (correctAnswer === index) {
      setCorrectAnswer(0)
    } else if (correctAnswer > index) {
      setCorrectAnswer(correctAnswer - 1)
    }
    onUpdate({
      ...question,
      options: newOptions,
      correct_answer: correctAnswer
    })
  }

  return (
    <div className="border-2 border-gray-200 rounded-lg p-4 bg-white">
      <div className="flex justify-between items-start mb-4">
        <InlineTextEditor
          text={question.question_text}
          onSave={(text) => onUpdate({ ...question, question_text: text })}
          className="flex-1 text-lg font-medium"
        />
        <button
          onClick={onRemove}
          className="ml-2 p-2 text-red-500 hover:bg-red-50 rounded"
        >
          🗑️
        </button>
      </div>

      <div className="space-y-2">
        {options.map((option, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              type="radio"
              checked={correctAnswer === index}
              onChange={() => {
                setCorrectAnswer(index)
                onUpdate({ ...question, correct_answer: index })
              }}
              className="w-4 h-4"
            />
            <input
              type="text"
              value={option}
              onChange={(e) => updateOption(index, e.target.value)}
              placeholder="Enter option..."
              className="flex-1 px-3 py-2 border rounded"
            />
            <button
              onClick={() => removeOption(index)}
              className="p-2 text-red-500 hover:bg-red-50 rounded"
            >
              ✖️
            </button>
          </div>
        ))}

        <button
          onClick={addOption}
          className="w-full py-2 border-2 border-dashed border-gray-300 rounded
                   text-gray-500 hover:border-blue-500 hover:text-blue-500"
        >
          + Add Option
        </button>
      </div>
    </div>
  )
}
```

### 9. Auto-Save Hook
```typescript
function useAutoSave(
  content: any,
  saveFunction: (content: any) => Promise<void>,
  delay: number = 1000
) {
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const saveTimeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    clearTimeout(saveTimeoutRef.current)

    saveTimeoutRef.current = setTimeout(async () => {
      setIsSaving(true)
      try {
        await saveFunction(content)
        setLastSaved(new Date())
      } catch (error) {
        console.error('Auto-save failed:', error)
      } finally {
        setIsSaving(false)
      }
    }, delay)

    return () => clearTimeout(saveTimeoutRef.current)
  }, [content, saveFunction, delay])

  return { isSaving, lastSaved }
}
```

## Utility Functions

### Template Selector
```typescript
function selectTemplate(content: ParsedContent): TemplateType {
  // Analyze content and suggest best template
  const hasVowels = content.texts.some(t =>
    /[aeiouAEIOU]/.test(t.text_content)
  )
  const hasQuestions = content.questions.length > 0
  const hasImages = content.images.length > 0

  if (hasVowels && content.texts.length < 5) {
    return 'vowel_recognition'
  }
  if (hasQuestions && hasImages) {
    return 'picture_match'
  }
  if (content.texts.some(t => t.text_content.includes('grande'))) {
    return 'size_comparison'
  }
  // ... more logic

  return 'reading_exercise' // default
}
```

### Image Fetcher
```typescript
async function fetchDecorativeImages(theme: string, count: number = 4) {
  const response = await fetch(
    `/functions/v1/search-pexels?q=${theme}&per_page=${count}`
  )
  const images = await response.json()
  return images.map((img: any) => img.url)
}
```

### Content Formatter
```typescript
function formatContentForTemplate(
  selectedItems: SelectedItems,
  template: TemplateType
): FormattedContent {
  switch(template) {
    case 'vowel_recognition':
      return {
        vowels: extractVowels(selectedItems.texts),
        images: selectedItems.images.slice(0, 5)
      }
    case 'picture_match':
      return {
        questions: selectedItems.questions,
        images: correlateImagesWithQuestions(
          selectedItems.questions,
          selectedItems.images
        )
      }
    // ... more formatters
  }
}
```

## State Management

### Global State (Context or Zustand)
```typescript
interface AppState {
  // Assessment Generator
  selectedDocument: string | null
  selectedItems: SelectedItems

  // Generated Assessment
  currentAssessment: Assessment | null
  currentPage: number

  // Editor
  editingAssessment: Assessment | null
  hasUnsavedChanges: boolean

  // UI
  isLoading: boolean
  error: string | null
}
```

## Styling Constants

```typescript
// tailwind.config.js extensions
module.exports = {
  theme: {
    extend: {
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite'
      },
      colors: {
        'kid-blue': '#3B82F6',
        'kid-green': '#10B981',
        'kid-yellow': '#FCD34D',
        'kid-pink': '#EC4899'
      }
    }
  }
}
```