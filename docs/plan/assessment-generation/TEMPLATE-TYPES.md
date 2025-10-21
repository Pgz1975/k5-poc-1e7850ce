# Assessment Template Types

## Overview
Simple, reusable templates for different types of kid-friendly assessments. Each template uses content from the parsed PDFs and adds fun visual elements.

## 1. Vowel Recognition Template

### Use Case
Teaching vowels (A, E, I, O, U) with visual associations

### Layout
```
┌────────────────────────────────────────┐
│           🌈 Las Vocales 🌈            │
│                                         │
│    A a        [🍎 Apple Image]         │
│                                         │
│    E e        [🐘 Elephant Image]      │
│                                         │
│    I i        [🏝️ Island Image]        │
│                                         │
│    O o        [🐙 Octopus Image]       │
│                                         │
│    U u        [☂️ Umbrella Image]      │
│                                         │
│         🐸 "¡Repite conmigo!"          │
└────────────────────────────────────────┘
```

### Data Structure
```json
{
  "type": "vowel_recognition",
  "vowels": [
    {
      "letter": "A",
      "lowercase": "a",
      "image": "pdf_image_url",
      "pexels_image": "apple_url",
      "audio": "a_sound.mp3"
    }
  ]
}
```

## 2. Picture Match Template

### Use Case
Matching images with first letter sounds

### Layout
```
┌────────────────────────────────────────┐
│    ¿Con qué letra comienza?            │
│                                         │
│         [School Building]               │
│              🏫                         │
│                                         │
│    A          E          I             │
│    ○          ●          ○             │
│                                         │
│    🐸 "¡Correcto! Escuela = E"         │
└────────────────────────────────────────┘
```

### Data Structure
```json
{
  "type": "picture_match",
  "question": "¿Con qué letra comienza?",
  "image": "school.png",
  "options": ["A", "E", "I"],
  "correct": "E",
  "word": "Escuela"
}
```

## 3. Size Comparison Template

### Use Case
Teaching concepts of grande, mediano, pequeño

### Layout
```
┌────────────────────────────────────────┐
│      Ordena por tamaño                 │
│                                         │
│    🖍️        🖍️        🖍️              │
│   Small    Medium    Large             │
│                                         │
│   Drag and drop to order:              │
│                                         │
│   [  ]      [  ]      [  ]             │
│                                         │
│         🐸 "¡Muy bien!"                │
└────────────────────────────────────────┘
```

### Data Structure
```json
{
  "type": "size_comparison",
  "items": [
    {"image": "pencil_small.png", "size": "pequeño"},
    {"image": "pencil_medium.png", "size": "mediano"},
    {"image": "pencil_large.png", "size": "grande"}
  ]
}
```

## 4. Position Learning Template

### Use Case
Teaching positions: adentro, afuera, arriba, abajo

### Layout
```
┌────────────────────────────────────────┐
│    ¿Dónde está el gato? 🐱             │
│                                         │
│         [Table Image]                   │
│         [Cat Under Table]               │
│                                         │
│   Arriba ○    Abajo ●                  │
│                                         │
│   Adentro ○   Afuera ○                 │
│                                         │
│      🐸 "El gato está abajo"           │
└────────────────────────────────────────┘
```

### Data Structure
```json
{
  "type": "position_learning",
  "question": "¿Dónde está el gato?",
  "image": "cat_under_table.png",
  "options": ["arriba", "abajo", "adentro", "afuera"],
  "correct": "abajo"
}
```

## 5. Reading Comprehension Template

### Use Case
Simple reading with images and questions

### Layout
```
┌────────────────────────────────────────┐
│         Mi Escuela 🏫                  │
│                                         │
│  [School Image from PDF]                │
│                                         │
│  "Mi escuela es divertida.              │
│   Hay muchos amigos.                    │
│   Aprendemos juntos."                   │
│                                         │
│  ¿Cómo es la escuela?                  │
│  ○ Aburrida                            │
│  ● Divertida                           │
│  ○ Pequeña                             │
│                                         │
│       🐸 "¡Excelente lectura!"         │
└────────────────────────────────────────┘
```

### Data Structure
```json
{
  "type": "reading_comprehension",
  "title": "Mi Escuela",
  "text": "Mi escuela es divertida...",
  "image": "school.png",
  "question": "¿Cómo es la escuela?",
  "options": ["Aburrida", "Divertida", "Pequeña"],
  "correct": "Divertida"
}
```

## 6. Vocabulary Cards Template

### Use Case
Bilingual vocabulary practice

### Layout
```
┌────────────────────────────────────────┐
│         Vocabulary Cards 📚             │
│                                         │
│  ┌──────────┐     ┌──────────┐        │
│  │   Tree   │     │  Árbol   │        │
│  │    🌳    │ →→→ │    🌳    │        │
│  │ (English)│     │(Español) │        │
│  └──────────┘     └──────────┘        │
│                                         │
│  [Tap to flip]    [Next word →]        │
│                                         │
│       🐸 "Tree = Árbol"                │
└────────────────────────────────────────┘
```

### Data Structure
```json
{
  "type": "vocabulary_cards",
  "cards": [
    {
      "english": "Tree",
      "spanish": "Árbol",
      "image": "tree.png",
      "audio_en": "tree.mp3",
      "audio_es": "arbol.mp3"
    }
  ]
}
```

## 7. Pattern Recognition Template

### Use Case
Teaching patterns with shapes and colors

### Layout
```
┌────────────────────────────────────────┐
│      Complete the Pattern 🎨           │
│                                         │
│   🔴 🔵 🔴 🔵 🔴 [?]                   │
│                                         │
│   Choose:                               │
│   🔴        🔵        🟢               │
│                                         │
│      🐸 "¡Sigue el patrón!"           │
└────────────────────────────────────────┘
```

### Data Structure
```json
{
  "type": "pattern_recognition",
  "pattern": ["red", "blue", "red", "blue", "red"],
  "options": ["red", "blue", "green"],
  "correct": "blue"
}
```

## 8. Simple Math Template

### Use Case
Basic counting and addition

### Layout
```
┌────────────────────────────────────────┐
│         Counting Fun 🔢                │
│                                         │
│   🍎 🍎 🍎 + 🍎 🍎 = ?                │
│                                         │
│     3         5         7               │
│     ○         ●         ○               │
│                                         │
│    🐸 "¡3 + 2 = 5! Muy bien!"         │
└────────────────────────────────────────┘
```

### Data Structure
```json
{
  "type": "simple_math",
  "problem": "3 + 2",
  "visual": ["🍎", "🍎", "🍎", "+", "🍎", "🍎"],
  "options": [3, 5, 7],
  "correct": 5
}
```

## Template Selection Rules

### Based on Content Type:
- **Text with vowels** → Vowel Recognition
- **Questions with images** → Picture Match
- **Size/position concepts** → Size Comparison or Position Learning
- **Paragraphs** → Reading Comprehension
- **Word lists** → Vocabulary Cards
- **Sequences** → Pattern Recognition
- **Numbers** → Simple Math

### Grade Level Adjustments:
- **Kindergarten**: Bigger fonts, fewer options, more images
- **Grade 1**: Add simple words, 3-4 options
- **Grade 2+**: Longer texts, more complex questions

## Common Elements Across All Templates

### Visual Elements
- Coquí mascot with different states
- Pexels decoration images
- Original PDF images
- Progress indicators
- Star rewards

### Interactive Features
- Click/tap to select
- Drag and drop (where appropriate)
- Audio playback buttons
- Next/Previous navigation
- Celebration animations

### Accessibility
- High contrast colors
- Large touch targets (min 48x48px)
- Clear audio cues
- Simple language
- Visual + text feedback

## Implementation Notes

1. **Keep It Simple**: No complex scoring algorithms
2. **Visual First**: Images are as important as text
3. **Immediate Feedback**: Show right/wrong instantly
4. **Positive Reinforcement**: Always encourage, even on mistakes
5. **Mobile Friendly**: Touch-optimized for tablets