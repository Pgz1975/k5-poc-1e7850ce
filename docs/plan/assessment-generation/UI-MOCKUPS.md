# UI Mockups - Simple Assessment Generator

## 1. PDF Content List Page

### Route: `/assessment-generator`

### Layout
```
┌─────────────────────────────────────────────────────────┐
│  📚 Assessment Generator                          [Back] │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Select PDF Document:                                   │
│  ┌────────────────────────────────────────┐            │
│  │ ▼ M_KINDER U1 TG1 REV novid.pdf       │            │
│  └────────────────────────────────────────┘            │
│                                                          │
│  Content from PDF:                                      │
│  ┌──────────────────────────────────────────────────┐  │
│  │ □ Page 6 - PREPRUEBA                             │  │
│  │   "¿Con qué letra comienza el dibujo?"          │  │
│  │   🖼️ [school] [abacus] [koala]                  │  │
│  │                                                   │  │
│  │ □ Page 12 - Las Vocales                         │  │
│  │   "Las vocales son 5 letras del abecedario..."  │  │
│  │   🖼️ [a] [e] [i] [o] [u]                        │  │
│  │                                                   │  │
│  │ □ Page 14 - Vocal A Examples                     │  │
│  │   "Esta es la vocal Aa. Observa las imágenes"    │  │
│  │   🖼️ [airplane] [closet] [water]                 │  │
│  │                                                   │  │
│  │ □ Page 31 - Tamaño                              │  │
│  │   "Grande, mediano, pequeño"                     │  │
│  │   🖼️ [3 pencils of different sizes]             │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  [3 items selected]                                     │
│                                                          │
│  Generate As:                                           │
│  [Reading Exercise] [Quiz] [Lesson]                     │
│                                                          │
│  [🎨 Generate Assessment]                               │
└─────────────────────────────────────────────────────────┘
```

### Components
- **Dropdown**: Select parsed PDF
- **Content List**: Scrollable list with checkboxes
- **Preview**: Text snippet + thumbnail images
- **Selection Counter**: Shows selected count
- **Generate Button**: Big, colorful CTA

## 2. Generated Reading Exercise

### Route: `/generated/[id]`

### Page 1 of 3
```
┌─────────────────────────────────────────────────────────┐
│  Progress: ●●○                               🏠 Home    │
├─────────────────────────────────────────────────────────┤
│                                                          │
│         🖼️ [Large Pexels Image: Colorful School]        │
│                                                          │
│  ╔═══════════════════════════════════════════════════╗  │
│  ║                                                    ║  │
│  ║   ¿Con qué letra comienza                        ║  │
│  ║   el dibujo?                                     ║  │
│  ║                                                    ║  │
│  ╚═══════════════════════════════════════════════════╝  │
│                                                          │
│     🖼️           🖼️           🖼️                        │
│   [school]    [abacus]     [koala]                      │
│                                                          │
│     (a)         (e)         (i)                         │
│                                                          │
│                           🐸 [Coquí Happy]              │
│                           "¡Muy bien!"                  │
│                                                          │
│  [← Previous]                      [Next →]             │
└─────────────────────────────────────────────────────────┘
```

### Features
- **Large Text**: 3xl font size for kids
- **Big Images**: From PDF + Pexels decoration
- **Coquí Mascot**: Different states based on progress
- **Simple Navigation**: Big Previous/Next buttons
- **Progress Dots**: Visual progress indicator

## 3. Generated Quiz Page

### Route: `/generated/[quiz-id]`

```
┌─────────────────────────────────────────────────────────┐
│  Quiz: Las Vocales                          Score: 2/5  │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Question 3 of 5:                                       │
│                                                          │
│  ╔═══════════════════════════════════════════════════╗  │
│  ║                                                    ║  │
│  ║   ¿Cuál de estos dibujos                         ║  │
│  ║   comienza con la vocal Aa?                      ║  │
│  ║                                                    ║  │
│  ╚═══════════════════════════════════════════════════╝  │
│                                                          │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐                │
│  │         │  │         │  │         │                │
│  │  🌳     │  │  🦎     │  │  🏫     │                │
│  │         │  │         │  │         │                │
│  │  Tree   │  │ Iguana  │  │ School  │                │
│  └─────────┘  └─────────┘  └─────────┘                │
│      (A)          (B)          (C)                      │
│                                                          │
│                                    🐸 [Coquí Thinking]  │
│                                                          │
│  [Check Answer]                                         │
└─────────────────────────────────────────────────────────┘
```

## 4. Selection Success Modal

```
┌─────────────────────────────────────────────┐
│                                              │
│          ✨ Assessment Created! ✨           │
│                                              │
│     Your assessment is ready to use:         │
│                                              │
│     "Reading Exercise - Las Vocales"         │
│                                              │
│     📝 3 pages generated                     │
│     🖼️ 12 images included                    │
│     🐸 Coquí mascot added                   │
│                                              │
│     [View Assessment]  [Create Another]      │
│                                              │
└─────────────────────────────────────────────┘
```

## 5. Mobile Responsive View

### Phone Layout (375px)
```
┌─────────────────────┐
│ 📚 Generator        │
├─────────────────────┤
│ Select Content:     │
│ ┌─────────────────┐ │
│ │ □ Vocales       │ │
│ │   Page 12       │ │
│ │   🖼️ [a][e][i]  │ │
│ ├─────────────────┤ │
│ │ □ Tamaño        │ │
│ │   Page 31       │ │
│ │   🖼️ [sizes]    │ │
│ └─────────────────┘ │
│                     │
│ [Generate Exercise] │
└─────────────────────┘
```

## React Components Structure

### `AssessmentGenerator.tsx`
```tsx
function AssessmentGenerator() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50">
      <Header />
      <main className="container mx-auto p-6">
        <PDFSelector />
        <ContentList />
        <GenerateControls />
      </main>
    </div>
  )
}
```

### `GeneratedAssessment.tsx`
```tsx
function GeneratedAssessment({ id }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-pink-50">
      <ProgressBar />
      <AssessmentContent />
      <CoquiMascot state={coquiState} />
      <NavigationButtons />
    </div>
  )
}
```

## Color Palette (Kid-Friendly)
- Background: Gradient pastels
- Primary: Bright Blue (#3B82F6)
- Success: Green (#10B981)
- Accent: Yellow (#FCD34D)
- Text: Dark Gray (#1F2937)
- Cards: White with soft shadows

## Typography
- Headers: `font-bold text-4xl`
- Questions: `font-semibold text-3xl`
- Options: `font-medium text-2xl`
- Body: `font-normal text-xl`

## Animations
- Card hover: `transform hover:scale-105`
- Selection: `animate-bounce-once`
- Success: `animate-pulse`
- Coquí: `animate-wiggle`