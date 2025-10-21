# UI Mockups - Manual Assessment Creation

## Design Philosophy
Match the **EXACT** visual style of `/reading-exercise`:
- Gradient backgrounds (blue to white)
- Large, kid-friendly fonts
- Colorful cards with soft shadows
- Coquí mascot always visible
- Lots of whitespace

---

## 1. Main Creation Page

### Route: `/manual-assessment/create`

```
┌─────────────────────────────────────────────────────────────────┐
│  [🏠 Home]                      Manual Assessment Creator       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Step 1: What do you want to create?                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐           │
│  │   📖        │  │   ✏️         │  │   📝        │           │
│  │   LESSON    │  │   EXERCISE   │  │  ASSESSMENT │           │
│  │             │  │             │  │             │           │
│  │  Teaching   │  │  Practice   │  │  Evaluate   │           │
│  │  content    │  │  activity   │  │  learning   │           │
│  └─────────────┘  └─────────────┘  └─────────────┘           │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  💡 Tip: Start with a Lesson to teach new concepts,      │  │
│  │      then create Exercises for practice!                 │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│                                   🐸 Coquí (thinking pose)     │
│                                   "¡Vamos a crear algo         │
│                                    divertido!"                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Subtype Selection (After Clicking "Exercise")

```
┌─────────────────────────────────────────────────────────────────┐
│  [← Back]                    Create New Exercise                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Step 2: Choose exercise type                                  │
│                                                                  │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐  │
│  │       ✓        │  │      T/F       │  │      ___       │  │
│  │  MULTIPLE      │  │   TRUE/FALSE   │  │  FILL BLANK    │  │
│  │   CHOICE       │  │                │  │                │  │
│  │                │  │                │  │                │  │
│  │  Pick correct  │  │  Statement is  │  │  Complete the  │  │
│  │  answer        │  │  true or false │  │  sentence      │  │
│  └────────────────┘  └────────────────┘  └────────────────┘  │
│                                                                  │
│  ┌────────────────┐  ┌────────────────┐                        │
│  │      ↔️         │  │      ✍️         │                        │
│  │   MATCHING     │  │  SHORT ANSWER  │  [Coming Soon]         │
│  │                │  │                │                        │
│  │  Connect pairs │  │  Type answer   │                        │
│  └────────────────┘  └────────────────┘                        │
│                                                                  │
│                                   🐸 Coquí (excited pose)      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Multiple Choice Editor (Main Form)

```
┌─────────────────────────────────────────────────────────────────┐
│  [← Back]             Create Multiple Choice Exercise           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ 📝 Question or Instruction                                │  │
│  │ ┌────────────────────────────────────────────────────┐   │  │
│  │ │ ¿Con qué letra comienza la palabra "escuela"?     │   │  │
│  │ │                                                     │   │  │
│  │ │ [B] [I] [U] [Link] [Image]  <-- Rich text tools   │   │  │
│  │ └────────────────────────────────────────────────────┘   │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ 🎨 Add Question Image (Optional)                          │  │
│  │                                                            │  │
│  │ ┌──────────────────────────────────┐                      │  │
│  │ │     📋 Paste image from          │                      │  │
│  │ │     clipboard (Ctrl+V)           │                      │  │
│  │ │                                  │                      │  │
│  │ │     or drag & drop here          │                      │  │
│  │ └──────────────────────────────────┘                      │  │
│  │                                                            │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ ✅ Answer Options                                         │  │
│  │                                                            │  │
│  │ Option 1:  [ ✓ Correct Answer ]                          │  │
│  │ ┌─────────────────────────────────────┐  ┌─────┐  [X]    │  │
│  │ │ A (a)                               │  │ 📷  │         │  │
│  │ └─────────────────────────────────────┘  └─────┘         │  │
│  │            Text                      Paste Image          │  │
│  │                                                            │  │
│  │ Option 2:  [ ○ ]                                          │  │
│  │ ┌─────────────────────────────────────┐  ┌─────┐  [X]    │  │
│  │ │ E (e)                               │  │ 📷  │         │  │
│  │ └─────────────────────────────────────┘  └─────┘         │  │
│  │                                                            │  │
│  │ Option 3:  [ ○ ]                                          │  │
│  │ ┌─────────────────────────────────────┐  ┌─────┐  [X]    │  │
│  │ │ I (i)                               │  │ 📷  │         │  │
│  │ └─────────────────────────────────────┘  └─────┘         │  │
│  │                                                            │  │
│  │ [+ Add Another Option]                                    │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ 🎙️ Voice Guidance (Optional)                             │  │
│  │ ┌────────────────────────────────────────────────────┐   │  │
│  │ │ Lee cada opción con cuidado antes de responder     │   │  │
│  │ └────────────────────────────────────────────────────┘   │  │
│  │ This text will be spoken by Coquí                         │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ ⚙️ Settings                                               │  │
│  │                                                            │  │
│  │ Grade Level:  [K] [1] [2] [3] [4] [5]                    │  │
│  │ Language:     [🇵🇷 Español] [🇺🇸 English]                  │  │
│  │ Subject:      [Reading] [Math] [Science] [Social]        │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  [ Preview ]                              [ Save Exercise ]     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. Preview Mode (Before Saving)

```
┌─────────────────────────────────────────────────────────────────┐
│  [← Edit]                    Preview Mode                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  This is how students will see your exercise:                  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ [Student View - Identical to /reading-exercise style]     │  │
│  │                                                            │  │
│  │         🐸 Coquí (happy pose)                             │  │
│  │         "¡Vamos a practicar!"                             │  │
│  │                                                            │  │
│  │  ╔═════════════════════════════════════════════════════╗  │  │
│  │  ║                                                      ║  │  │
│  │  ║  ¿Con qué letra comienza la palabra "escuela"?     ║  │  │
│  │  ║                                                      ║  │  │
│  │  ╚═════════════════════════════════════════════════════╝  │  │
│  │                                                            │  │
│  │  ┌─────────────────────┐                                  │  │
│  │  │  A)  A (a)          │  ← Click to select               │  │
│  │  └─────────────────────┘                                  │  │
│  │                                                            │  │
│  │  ┌─────────────────────┐                                  │  │
│  │  │  B)  E (e)          │                                  │  │
│  │  └─────────────────────┘                                  │  │
│  │                                                            │  │
│  │  ┌─────────────────────┐                                  │  │
│  │  │  C)  I (i)          │                                  │  │
│  │  └─────────────────────┘                                  │  │
│  │                                                            │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  [← Back to Edit]         [✅ Looks Good - Save It!]           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 5. Student View (Actual Exercise)

### Route: `/manual-assessment/view/:id`

```
┌─────────────────────────────────────────────────────────────────┐
│  [🏠]  Grade 1 - Español                         ⭐ 45 puntos   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│                                                                  │
│         ┌──────────────┐                                        │
│         │    🐸        │   "Lee cada opción con cuidado..."    │
│         │   Coquí      │   [🔊 Speaking...]                     │
│         │  (speaking)  │                                        │
│         └──────────────┘                                        │
│                                                                  │
│                                                                  │
│  ╔════════════════════════════════════════════════════════════╗ │
│  ║                                                             ║ │
│  ║    ¿Con qué letra comienza la palabra "escuela"?          ║ │
│  ║                                                             ║ │
│  ╚════════════════════════════════════════════════════════════╝ │
│                                                                  │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                                                            │ │
│  │  A)  A (a)                                                │ │
│  │                                                            │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                                                            │ │
│  │  B)  E (e)           ✓  ¡CORRECTO!                       │ │
│  │                                                            │ │
│  └───────────────────────────────────────────────────────────┘ │
│         ↑ Selected answer highlighted in green                 │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                                                            │ │
│  │  C)  I (i)                                                │ │
│  │                                                            │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                  │
│                                                                  │
│         ┌──────────────┐                                        │
│         │    🐸        │   "¡Excelente trabajo!"               │
│         │   Coquí      │                                        │
│         │ (celebrating)│   + 10 ⭐                              │
│         └──────────────┘                                        │
│                                                                  │
│                                                                  │
│  [⏮️ Previous]                                    [Next ⏭️]     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 6. True/False Editor (Simpler Version)

```
┌─────────────────────────────────────────────────────────────────┐
│  [← Back]               Create True/False Exercise              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ 📝 Statement                                              │  │
│  │ ┌────────────────────────────────────────────────────┐   │  │
│  │ │ Las vocales en español son: a, e, i, o, u         │   │  │
│  │ │                                                     │   │  │
│  │ └────────────────────────────────────────────────────┘   │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ ✅ Correct Answer                                         │  │
│  │                                                            │  │
│  │     [ • ] Verdadero / True                                │  │
│  │     [ ○ ] Falso / False                                   │  │
│  │                                                            │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ 💬 Explanation (Optional)                                 │  │
│  │ ┌────────────────────────────────────────────────────┐   │  │
│  │ │ Shown after student answers                        │   │  │
│  │ └────────────────────────────────────────────────────┘   │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  [ Preview ]                              [ Save Exercise ]     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 7. Mobile View (Tablet - 768px)

```
┌──────────────────────┐
│ [🏠] Create Exercise │
├──────────────────────┤
│                      │
│ 📝 Question:         │
│ ┌──────────────────┐ │
│ │ ¿Cuál letra...?  │ │
│ │                  │ │
│ └──────────────────┘ │
│                      │
│ ✅ Answers:          │
│                      │
│ ┌──────────────────┐ │
│ │ [✓] A (a)        │ │
│ │ [📷]             │ │
│ └──────────────────┘ │
│                      │
│ ┌──────────────────┐ │
│ │ [ ] E (e)        │ │
│ │ [📷]             │ │
│ └──────────────────┘ │
│                      │
│ [+ Add Option]       │
│                      │
│         🐸           │
│       Coquí          │
│                      │
│ [Save]               │
└──────────────────────┘
```

---

## Color Palette (Match `/reading-exercise`)

```css
/* Backgrounds */
--gradient-primary: linear-gradient(to-b, #E6F7FF, #FFFFFF)
--gradient-card: linear-gradient(to-br, #FFF, #F8FAFC)

/* Text */
--text-primary: #1F2937 (dark gray)
--text-accent: #3B82F6 (blue)

/* Buttons */
--button-primary: #3B82F6 (blue)
--button-success: #10B981 (green)
--button-warning: #F59E0B (orange)
--button-danger: #EF4444 (red)

/* Cards */
--card-bg: #FFFFFF
--card-border: rgba(59, 130, 246, 0.2)
--card-shadow: 0 4px 6px rgba(0, 0, 0, 0.1)

/* Feedback */
--feedback-correct: #D1FAE5 (light green bg)
--feedback-incorrect: #FED7AA (light orange bg)
```

---

## Typography (Kid-Friendly Sizes)

```css
/* Question Text */
font-size: 2rem;     /* 32px */
line-height: 1.5;
font-weight: 700;

/* Answer Options */
font-size: 1.5rem;   /* 24px */
line-height: 1.4;
font-weight: 600;

/* Instructions */
font-size: 1.25rem;  /* 20px */
line-height: 1.6;
font-weight: 400;

/* Buttons */
font-size: 1.125rem; /* 18px */
font-weight: 600;
min-height: 60px;    /* Touch-friendly */
```

---

## Animations (Subtle & Playful)

```css
/* Button Hover */
transform: scale(1.05);
transition: transform 0.2s ease;

/* Correct Answer */
animation: bounce 0.5s ease;
background: linear-gradient(45deg, #10B981, #34D399);

/* Incorrect Answer */
animation: shake 0.3s ease;
background: linear-gradient(45deg, #F59E0B, #FBBF24);

/* Coquí Entrance */
animation: slideInRight 0.5s ease;
```

---

## Accessibility Features

- **High Contrast**: Text readable on all backgrounds
- **Focus States**: Thick blue outline on keyboard focus
- **Touch Targets**: Minimum 44x44px (Apple HIG)
- **Screen Reader**: All images have alt text
- **Voice Support**: Questions read aloud automatically
- **Keyboard Navigation**: Tab through all interactive elements

---

## Notes for Developers

1. **Copy CSS from `/reading-exercise`** - Don't reinvent the wheel
2. **Use existing Card, Button, Input components** - Already styled
3. **Coquí positions**: Use exact same positioning logic
4. **Gradients**: Use exact color codes from reading exercise
5. **Spacing**: Use Tailwind's spacing scale (p-4, p-6, p-8)
6. **Responsive**: Mobile-first, then scale up to desktop

---

**Remember**: The goal is to make it LOOK and FEEL exactly like the reading exercise so students feel familiar and comfortable!
