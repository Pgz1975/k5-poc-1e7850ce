# Visual Editor UI Mockups

## Main Editor View

### Desktop Layout (1920x1080)
```
┌──────────────────────────────────────────────────────────────────────┐
│  ✏️ Visual Assessment Editor            [Preview Mode] [Exit]        │
├──────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌─────────────────────────────────────┬──────────────────────────┐ │
│  │ TOOLBAR                              │ AUTO-SAVE: ✓ Saved      │ │
│  │ [Reading] [Quiz] [Vocabulary] [Math] │ Last save: 2 seconds ago │ │
│  └─────────────────────────────────────┴──────────────────────────┘ │
│                                                                       │
│  ┌─────────────────────────────────────────────┬──────────────────┐ │
│  │                                              │  ELEMENT TOOLBOX │ │
│  │            CANVAS (Live Edit)                │                  │ │
│  │                                              │  Add Elements:   │ │
│  │  ┌──────────────────────────────────────┐   │  ┌────┐ ┌────┐  │ │
│  │  │        Las Vocales 🌈                │   │  │ Aa │ │ 🖼️ │  │ │
│  │  │        (click to edit)               │   │  │Text│ │Img │  │ │
│  │  └──────────────────────────────────────┘   │  └────┘ └────┘  │ │
│  │                                              │  ┌────┐ ┌────┐  │ │
│  │  ┌────────┐ ┌────────┐ ┌────────┐         │  │ ❓ │ │ 🎵 │  │ │
│  │  │   A    │ │   E    │ │   I    │         │  │Quiz│ │Audio│ │ │
│  │  │  🍎   │ │  🐘   │ │  🏝️   │         │  └────┘ └────┘  │ │
│  │  │ (drag) │ │        │ │        │         │  ┌────┐ ┌────┐  │ │
│  │  └────────┘ └────────┘ └────────┘         │  │ 🐸 │ │ ⭐ │  │ │
│  │         ↕️ Drag to reorder                  │  │Coqu│ │Badge│ │ │
│  │                                              │  └────┘ └────┘  │ │
│  │  Question: ¿Con qué letra empieza?         │                  │ │
│  │  ○ A  ○ E  ● I  [+ Add option]            │  Properties:     │ │
│  │                                              │  ┌──────────────┐│ │
│  │           🐸 "¡Muy bien!"                   │  │Font Size: 32 ││ │
│  │       (Mascot: Happy ▼)                     │  │Color: Black  ││ │
│  │                                              │  │Bold: ☑       ││ │
│  └──────────────────────────────────────────────┤  └──────────────┘│ │
│  Page: [1] [2] [3] [+ Add Page]                 │                  │ │
│                                                  │  Image Library: │ │
│                                                  │  [PDF] [Pexels] │ │
│                                                  │  [Upload]       │ │
│                                                  └──────────────────┘ │
└──────────────────────────────────────────────────────────────────────┘
```

## Edit States

### 1. Text Editing Mode
```
┌──────────────────────────────────┐
│  Text Editor Active              │
│ ┌────────────────────────────┐   │
│ │ ¿Con qué letra empieza? █  │   │
│ └────────────────────────────┘   │
│                                   │
│ Formatting: [B] [I] [U]          │
│ Size: [－] 32px [＋]             │
│ Color: [🎨]                      │
│ Align: [⬅] [⬌] [➡]             │
└──────────────────────────────────┘
```

### 2. Image Selection Mode
```
┌──────────────────────────────────┐
│  Choose Image Source             │
├──────────────────────────────────┤
│  From PDF:                       │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐   │
│  │ 🏫 │ │ 📚 │ │ ✏️ │ │ 🎒 │  │
│  └────┘ └────┘ └────┘ └────┘   │
│                                   │
│  From Pexels:                    │
│  Search: [classroom____] [🔍]    │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐   │
│  │    │ │    │ │    │ │    │   │
│  └────┘ └────┘ └────┘ └────┘   │
│                                   │
│  [Upload from Computer]          │
└──────────────────────────────────┘
```

### 3. Question Editor Mode
```
┌──────────────────────────────────┐
│  Edit Question                   │
├──────────────────────────────────┤
│  Question Text:                  │
│  [¿Cuál es más grande?_______]   │
│                                   │
│  Options:                        │
│  ○ [Pequeño________] [🗑️]       │
│  ● [Grande_________] [🗑️] ✓     │
│  ○ [Mediano________] [🗑️]       │
│  [+ Add Option]                  │
│                                   │
│  Points: [5___]                  │
│  Type: [Multiple Choice ▼]       │
│                                   │
│  [Save] [Cancel]                 │
└──────────────────────────────────┘
```

## Drag and Drop Indicators

### While Dragging
```
┌─────────────────────────────┐
│  ░░░░░░░░░░░░░░░░░░░░░░░░  │ ← Drop zone
│                             │
│  ┌─────────────────┐       │
│  │ 🍎 Manzana      │ ← Being dragged (semi-transparent)
│  └─────────────────┘       │
│                             │
│  ░░░░░░░░░░░░░░░░░░░░░░░░  │ ← Drop zone
└─────────────────────────────┘
```

## Properties Panel States

### Text Element Selected
```
┌──────────────────┐
│ Text Properties  │
├──────────────────┤
│ Font:            │
│ [Comic Sans ▼]   │
│                  │
│ Size:            │
│ [────●────] 32px │
│                  │
│ Style:           │
│ [B] [I] [U] [S] │
│                  │
│ Color:           │
│ [████] #000000   │
│                  │
│ Shadow:          │
│ ○ None           │
│ ● Soft           │
│ ○ Hard           │
└──────────────────┘
```

### Image Element Selected
```
┌──────────────────┐
│ Image Properties │
├──────────────────┤
│ Size:            │
│ ○ Small (100px)  │
│ ● Medium (200px) │
│ ○ Large (300px)  │
│ ○ Full Width     │
│                  │
│ Border:          │
│ [────●────] 8px  │
│                  │
│ Effects:         │
│ ☑ Shadow         │
│ ☐ Grayscale     │
│ ☑ Rounded        │
│                  │
│ Alt Text:        │
│ [Red apple____]  │
│                  │
│ [Replace] [🗑️]   │
└──────────────────┘
```

## Template Switcher

### Template Selection Dropdown
```
┌────────────────────────────────────┐
│ Current Template: Reading Exercise │
│ ▼                                  │
├────────────────────────────────────┤
│ ✓ Reading Exercise                 │
│   Picture Match                    │
│   Vocabulary Cards                 │
│   Simple Quiz                      │
│   Size Comparison                  │
│   Pattern Recognition              │
└────────────────────────────────────┘
```

### Template Switch Confirmation
```
┌──────────────────────────────┐
│  ⚠️ Change Template?         │
├──────────────────────────────┤
│  Your content will be        │
│  rearranged to fit the new   │
│  template layout.             │
│                              │
│  [Cancel] [Switch Template]  │
└──────────────────────────────┘
```

## Mobile Editor View (375px)

### Main Screen
```
┌─────────────────────┐
│ ← Back    ✓ Saved   │
├─────────────────────┤
│ Page 1 of 3    [+]  │
├─────────────────────┤
│                     │
│   Las Vocales       │
│                     │
│   A    E    I       │
│   🍎   🐘   🏝️      │
│                     │
│   (Tap to edit)     │
│                     │
├─────────────────────┤
│ [📝] [🖼️] [❓] [🐸] │
└─────────────────────┘
```

### Mobile Text Editor
```
┌─────────────────────┐
│ ✓ Done              │
├─────────────────────┤
│ ┌─────────────────┐ │
│ │ Las Vocales █   │ │
│ └─────────────────┘ │
│                     │
│ [B] [I] Size: 32   │
│ [🎨 Color]          │
└─────────────────────┘
```

## Preview Mode

### Preview Toggle
```
Before (Edit Mode):          After (Preview Mode):
┌──────────────┐            ┌──────────────┐
│ [👁️ Preview] │            │ [✏️ Edit]    │
│              │            │              │
│ Editable     │    →→→     │ Read-only    │
│ + Borders    │            │ No borders   │
│ + Handles    │            │ Clean view   │
└──────────────┘            └──────────────┘
```

## Context Menus

### Right-Click on Element
```
┌──────────────┐
│ ✂️ Cut       │
│ 📋 Copy      │
│ 📌 Paste     │
│ ─────────    │
│ 🔄 Duplicate │
│ 🗑️ Delete    │
│ ─────────    │
│ ⬆️ Move Up   │
│ ⬇️ Move Down │
│ ─────────    │
│ 🔒 Lock      │
└──────────────┘
```

## Keyboard Focus Indicators

```
Selected Element:
┌─────────────────────┐
│ ░░░░░░░░░░░░░░░░░░ │ ← Blue dashed border
│ ░   Selected      ░ │ ← Resize handles
│ ░   Element       ░ │
│ ░░░░░░░░░░░░░░░░░░ │
└─────────────────────┘

Hover State:
┌─────────────────────┐
│ ┊┊┊┊┊┊┊┊┊┊┊┊┊┊┊┊┊ │ ← Light blue background
│ ┊   Hovering     ┊ │
│ ┊┊┊┊┊┊┊┊┊┊┊┊┊┊┊┊┊ │
└─────────────────────┘
```

## Quick Actions Bar

### Floating toolbar when element selected
```
┌─────────────────────────────┐
│ [Copy] [Delete] [↑] [↓] [⚙️] │
└─────────────────────────────┘
```

## Status Messages

### Success
```
┌──────────────────────────┐
│ ✅ Changes saved         │
└──────────────────────────┘
```

### Error
```
┌──────────────────────────┐
│ ⚠️ Please add an answer  │
└──────────────────────────┘
```

### Loading
```
┌──────────────────────────┐
│ ⏳ Uploading image...    │
└──────────────────────────┘
```