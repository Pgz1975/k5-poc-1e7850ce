Complete Exercise Type Refactor & Enhancement Plan
🎯 OBJECTIVE
Transform the manual assessment system from a broken 3-type system into a robust 5-type exercise platform with dedicated editors and players for each type, supporting bilingual content creation and interactive drag-and-drop experiences.

📊 CURRENT STATE ANALYSIS
Problems Identified:
fill_blank is broken - Renders as multiple choice due to generic AnswerList component usage
No type-specific validation - All subtypes use same generic content structure
No dedicated editors - Lines 848-856 of CreateAssessment.tsx use AnswerList for all types
No dedicated players - Lines 213-241 of ViewAssessment.tsx render all as multiple choice buttons
Limited subtype options - Only 3 types exist: multiple_choice, true_false, fill_blank
Target Architecture:
5 Exercise Subtypes:
├── multiple_choice (existing ✓) - SELECT correct answer from options
├── true_false (existing ✓) - CHOOSE true or false
├── fill_blank (broken → FIX) - DRAG letters to form word
├── write_answer (NEW) - TYPE single word answer
└── drag_drop (NEW) - DRAG items (2 modes):
    ├── Mode 1: Assemble word from letters (PRIMARY for POC)
    └── Mode 2: Match items to categories (SECONDARY)
🗂️ FILE STRUCTURE
New Directory Structure:
src/components/ManualAssessment/
├── SubtypeSelector.tsx (MODIFY - add 2 new types)
├── ImagePasteZone.tsx (existing - reuse)
├── editors/ (NEW DIRECTORY)
│   ├── MultipleChoiceEditor.tsx (extract from CreateAssessment)
│   ├── TrueFalseEditor.tsx (extract from CreateAssessment)
│   ├── FillBlankEditor.tsx (NEW - letter-based drag-and-drop)
│   ├── WriteAnswerEditor.tsx (NEW - single word input)
│   └── DragDropEditor.tsx (NEW - 2 modes: letters/match)
└── players/ (NEW DIRECTORY)
    ├── MultipleChoicePlayer.tsx (extract from ViewAssessment)
    ├── TrueFalsePlayer.tsx (extract from ViewAssessment)
    ├── FillBlankPlayer.tsx (NEW - interactive letter tiles)
    ├── WriteAnswerPlayer.tsx (NEW - text input validation)
    └── DragDropPlayer.tsx (NEW - @dnd-kit implementation)
🔧 PHASE 1: DATABASE & SCHEMA UPDATES
1.1 Database Migration
File: supabase/migrations/YYYYMMDDHHMMSS_add_new_exercise_subtypes.sql

🚀 IMPLEMENTATION PHASES (For Execution)
Phase 1: Foundation ✅
Database migration
Update SubtypeSelector
Testing checkpoint
Phase 2: Fix Fill Blank ✅
Create FillBlankEditor
Create FillBlankPlayer
Integrate into CreateAssessment/ViewAssessment
Test with existing record ce9ffa7e-2977-4788-b32a-cd32d70f5ee2
Phase 3: Add Write Answer ✅
Create WriteAnswerEditor
Create WriteAnswerPlayer
Integrate into CreateAssessment/ViewAssessment
Full testing
Phase 4: Add Drag Drop (Letters) ✅
Create DragDropEditor (letters mode only)
Create DragDropPlayer (letters mode only)
Integrate into CreateAssessment/ViewAssessment
Full testing
Phase 5: Add Drag Drop (Match) ✅
Extend DragDropEditor (add match mode)
Extend DragDropPlayer (add match mode)
Full testing
Phase 6: Extract Multiple Choice & True/False ✅
Create MultipleChoiceEditor/Player
Create TrueFalseEditor/Player
Integrate into CreateAssessment/ViewAssessment
Regression testing
Phase 7: Polish & Refinement ✅
Bilingual validation sweep
Mobile responsiveness fixes
Voice integration testing
Accessibility improvements
Performance optimization

-- Add new subtype enum values
ALTER TYPE text CHECK (subtype IN ('multiple_choice', 'true_false', 'fill_blank', 'write_answer', 'drag_drop'));

-- Add drag_drop_mode field for future extensibility
ALTER TABLE manual_assessments 
ADD COLUMN IF NOT EXISTS drag_drop_mode TEXT CHECK (drag_drop_mode IN ('letters', 'match', 'sequence', 'fill_sentence'));

-- Add index for new subtypes
CREATE INDEX IF NOT EXISTS idx_manual_assessments_subtype_new 
ON manual_assessments(subtype) 
WHERE subtype IN ('write_answer', 'drag_drop');

-- Add comment for documentation
COMMENT ON COLUMN manual_assessments.drag_drop_mode IS 'Specifies drag-and-drop interaction: letters (assemble word), match (categorize items), sequence (order items), fill_sentence (complete sentence)';
1.2 Content Structure Definitions
Fill Blank Structure (Fixed)

{
  mode: 'single_word',
  prompt: string,              // "Arrastra las letras para formar la palabra"
  target: string,              // "coquí"
  letters: string[],           // ["c","o","q","u","í","a","m"]
  imageUrl?: string,           // Optional image
  autoShuffle: boolean         // Shuffle letters on load
}
Write Answer Structure (New)

{
  question: string,            // "¿Qué animal es este?"
  questionImage?: string,      // Optional image
  correctAnswer: string,       // "coquí" (single word, auto-graded)
  acceptedVariants?: string[], // ["coqui", "Coquí"] (optional)
  caseSensitive: false         // Always false per requirements
}
Drag Drop Structure (New)

// Mode 1: Assemble Word (PRIMARY)
{
  mode: 'letters',
  question: string,            // "Form the word for this image:"
  questionImage?: string,
  targetWord: string,          // "mesa"
  availableLetters: string[],  // ["m","e","s","a","o","l"] (includes distractors)
  autoShuffle: boolean
}

// Mode 2: Match Items (SECONDARY)
{
  mode: 'match',
  question: string,            // "Match animals to habitats"
  questionImage?: string,
  draggableItems: Array<{
    id: string,
    content: string | { type: 'image', url: string },
    correctZone: string
  }>,
  dropZones: Array<{
    id: string,
    label: string
  }>,
  allowMultiplePerZone: false  // Always false per requirements
}
🔧 PHASE 2: SUBTYPE SELECTOR UPDATE
2.1 Update SubtypeSelector.tsx
File: src/components/ManualAssessment/SubtypeSelector.tsx

Changes:

Add imports: PenLine, Move from lucide-react
Expand subtypes array from 3 to 5 items (lines 21-53)
Add bilingual titles/descriptions for new types
New Entries:


{
  id: 'write_answer',
  icon: PenLine,
  titleEs: 'Escribir Respuesta',
  titleEn: 'Write Answer',
  descriptionEs: 'Escribir la palabra correcta',
  descriptionEn: 'Write the correct word'
},
{
  id: 'drag_drop',
  icon: Move,
  titleEs: 'Arrastrar y Soltar',
  titleEn: 'Drag and Drop',
  descriptionEs: 'Arrastrar elementos para responder',
  descriptionEn: 'Drag elements to answer'
}
🔧 PHASE 3: EDITOR COMPONENTS (Teacher Creation)
3.1 Extract Existing: MultipleChoiceEditor.tsx
Location: src/components/ManualAssessment/editors/MultipleChoiceEditor.tsx

Purpose: Extract current AnswerList logic for multiple choice Props:


interface MultipleChoiceEditorProps {
  content: { question: string; questionImage?: string; answers: Answer[] };
  onChange: (content: any) => void;
  language: LanguageCode;
}
Features:

Question textarea
Image paste zone
AnswerList component (reuse existing)
Validation: At least 2 answers, exactly 1 marked correct
3.2 Extract Existing: TrueFalseEditor.tsx
Location: src/components/ManualAssessment/editors/TrueFalseEditor.tsx

Purpose: Simplified editor for T/F questions Props: Same as MultipleChoiceEditor

Features:

Question textarea
Image paste zone
Radio buttons: "Correct Answer: ○ True ○ False"
Auto-generates 2 answers: [{text: "True", correct: true/false}, {text: "False", correct: false/true}]
3.3 NEW: FillBlankEditor.tsx
Location: src/components/ManualAssessment/editors/FillBlankEditor.tsx

Purpose: Letter-based drag-and-drop word assembly Props:


interface FillBlankEditorProps {
  content: FillBlankContent;
  onChange: (content: FillBlankContent) => void;
  language: LanguageCode;
}
UI Fields:

Prompt (Textarea, required)

Placeholder: "Arrastra las letras..." / "Drag the letters..."
Max: 400 chars
Target Word (Input, required)

Validation: /^[a-zA-Záéíóúüñ]+$/i (letters only)
Max: 20 chars
Letters Pool (Chips editor)

Auto-generate button: Splits target + adds 2 random distractors
Manual edit: Add/remove individual letters
Display as draggable chips (visual preview)
Auto-Shuffle (Checkbox, default: true)

Optional Image (ImagePasteZone)

Validation (zod):


const fillBlankSchema = z.object({
  prompt: z.string().trim().min(1).max(400),
  target: z.string().trim().regex(/^[a-zA-Záéíóúüñ]+$/i).min(1).max(20),
  letters: z.array(z.string().length(1)).min(1).max(30)
    .refine(letters => {
      const target = /* get target */;
      return [...target].every(char => letters.includes(char.toLowerCase()));
    }, "Letters must contain all characters from target word"),
  imageUrl: z.string().url().optional(),
  autoShuffle: z.boolean()
});
Backward Compatibility Adapter:


function migrateFillBlank(oldContent: any): FillBlankContent {
  if (oldContent.target) return oldContent; // Already new format
  
  // Legacy format: extract from question and answers
  const target = oldContent.answers?.find(a => a.correct)?.text || '';
  const letters = oldContent.question.match(/\[(.*?)\]/)?.[1]?.split(',') || [];
  
  return {
    mode: 'single_word',
    prompt: oldContent.question.replace(/\[.*?\]/, '').trim(),
    target,
    letters,
    autoShuffle: true
  };
}
3.4 NEW: WriteAnswerEditor.tsx
Location: src/components/ManualAssessment/editors/WriteAnswerEditor.tsx

Purpose: Single-word text input exercise Props:


interface WriteAnswerEditorProps {
  content: WriteAnswerContent;
  onChange: (content: WriteAnswerContent) => void;
  language: LanguageCode;
}
UI Fields:

Question (Textarea, required)

Placeholder: "¿Qué animal es este?" / "What animal is this?"
Max: 500 chars
Correct Answer (Input, required)

Single word only
Validation: /^[a-zA-Záéíóúüñ]+$/i
Max: 50 chars
Optional Image (ImagePasteZone)

Validation (zod):


const writeAnswerSchema = z.object({
  question: z.string().trim().min(1).max(500),
  questionImage: z.string().url().optional(),
  correctAnswer: z.string().trim().regex(/^[a-zA-Záéíóúüñ]+$/i).min(1).max(50),
  caseSensitive: z.literal(false)
});
3.5 NEW: DragDropEditor.tsx
Location: src/components/ManualAssessment/editors/DragDropEditor.tsx

Purpose: Dual-mode drag-and-drop (letters/match) Props:


interface DragDropEditorProps {
  content: DragDropContent;
  mode: 'letters' | 'match';
  onChange: (content: DragDropContent) => void;
  language: LanguageCode;
}
UI Structure:

┌─ Mode Toggle ─────────────────────┐
│ ○ Letters (Assemble Word)         │
│ ○ Match (Categorize Items)        │
└───────────────────────────────────┘

{mode === 'letters' && <LettersModeUI />}
{mode === 'match' && <MatchModeUI />}
Mode 1: Letters UI (Priority for POC)

Question (Textarea)
Target Word (Input)
Available Letters (Auto-generate + manual edit)
Auto-Shuffle (Checkbox)
Optional Image
Mode 2: Match UI

Question (Textarea)
Draggable Items (List builder)
Each item: Text input OR image upload
Assign to zone (dropdown)
Drop Zones (List builder)
Each zone: Label input
Optional Image
Validation (zod):


const dragDropSchema = z.discriminatedUnion('mode', [
  z.object({
    mode: z.literal('letters'),
    question: z.string().trim().min(1).max(500),
    questionImage: z.string().url().optional(),
    targetWord: z.string().trim().regex(/^[a-zA-Záéíóúüñ]+$/i).min(1).max(20),
    availableLetters: z.array(z.string().length(1)).min(1).max(30),
    autoShuffle: z.boolean()
  }),
  z.object({
    mode: z.literal('match'),
    question: z.string().trim().min(1).max(500),
    questionImage: z.string().url().optional(),
    draggableItems: z.array(z.object({
      id: z.string(),
      content: z.union([z.string(), z.object({ type: z.literal('image'), url: z.string().url() })]),
      correctZone: z.string()
    })).min(2),
    dropZones: z.array(z.object({
      id: z.string(),
      label: z.string().min(1).max(100)
    })).min(2),
    allowMultiplePerZone: z.literal(false)
  })
]);
🔧 PHASE 4: INTEGRATE EDITORS INTO CreateAssessment.tsx
4.1 Modify CreateAssessment.tsx
Location: src/pages/CreateAssessment.tsx (lines 847-858)

Replace Generic AnswerList Section With:


{/* Type-Specific Editors */}
<div>
  <Label>{isSpanish ? 'Contenido del Ejercicio *' : 'Exercise Content *'}</Label>
  
  {data.subtype === 'multiple_choice' && (
    <MultipleChoiceEditor
      content={data.content || { question: '', answers: [] }}
      onChange={(content) => setData({ ...data, content })}
      language={data.settings.language}
    />
  )}
  
  {data.subtype === 'true_false' && (
    <TrueFalseEditor
      content={data.content || { question: '', correctAnswer: true }}
      onChange={(content) => setData({ ...data, content })}
      language={data.settings.language}
    />
  )}
  
  {data.subtype === 'fill_blank' && (
    <FillBlankEditor
      content={data.content || { mode: 'single_word', prompt: '', target: '', letters: [], autoShuffle: true }}
      onChange={(content) => setData({ ...data, content })}
      language={data.settings.language}
    />
  )}
  
  {data.subtype === 'write_answer' && (
    <WriteAnswerEditor
      content={data.content || { question: '', correctAnswer: '', caseSensitive: false }}
      onChange={(content) => setData({ ...data, content })}
      language={data.settings.language}
    />
  )}
  
  {data.subtype === 'drag_drop' && (
    <DragDropEditor
      content={data.content || { mode: 'letters', question: '', targetWord: '', availableLetters: [], autoShuffle: true }}
      mode={data.drag_drop_mode || 'letters'}
      onChange={(content) => setData({ ...data, content, drag_drop_mode: content.mode })}
      language={data.settings.language}
    />
  )}
</div>
Add Imports:


import { MultipleChoiceEditor } from '@/components/ManualAssessment/editors/MultipleChoiceEditor';
import { TrueFalseEditor } from '@/components/ManualAssessment/editors/TrueFalseEditor';
import { FillBlankEditor } from '@/components/ManualAssessment/editors/FillBlankEditor';
import { WriteAnswerEditor } from '@/components/ManualAssessment/editors/WriteAnswerEditor';
import { DragDropEditor } from '@/components/ManualAssessment/editors/DragDropEditor';
🔧 PHASE 5: PLAYER COMPONENTS (Student View)
5.1 Extract Existing: MultipleChoicePlayer.tsx
Location: src/components/ManualAssessment/players/MultipleChoicePlayer.tsx

Purpose: Extract current button-based multiple choice (lines 213-241 of ViewAssessment.tsx) Props:


interface MultipleChoicePlayerProps {
  content: { question: string; questionImage?: string; answers: Answer[] };
  onAnswer: (answerIndex: number, isCorrect: boolean) => void;
  selectedAnswer: number | null;
  showFeedback: boolean;
  isCorrect: boolean;
}
5.2 Extract Existing: TrueFalsePlayer.tsx
Location: src/components/ManualAssessment/players/TrueFalsePlayer.tsx

Purpose: Specialized T/F player (reuse MultipleChoicePlayer logic but styled as 2 large buttons)

5.3 NEW: FillBlankPlayer.tsx
Location: src/components/ManualAssessment/players/FillBlankPlayer.tsx

Purpose: Interactive letter tile drag-and-drop Dependencies: @dnd-kit/core, @dnd-kit/sortable

UI Structure:

┌─ Question ─────────────────────────┐
│ "Arrastra las letras..."           │
│ [Optional Image]                   │
└────────────────────────────────────┘

┌─ Letter Pool (Draggable) ─────────┐
│ [c] [o] [a] [q] [u] [í]           │
└────────────────────────────────────┘

┌─ Answer Slots (Drop Zones) ───────┐
│ [_] [_] [_] [_] [_]               │
└────────────────────────────────────┘

[Check Answer Button]
Implementation:


import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import { SortableContext, useSortable, arrayMove } from '@dnd-kit/sortable';

export function FillBlankPlayer({ content, onAnswer, voiceClient }: Props) {
  const [pool, setPool] = useState<string[]>(
    content.autoShuffle ? shuffle(content.letters) : content.letters
  );
  const [slots, setSlots] = useState<(string | null)[]>(
    Array(content.target.length).fill(null)
  );
  const [isChecked, setIsChecked] = useState(false);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    // Move letter from pool to slot or between slots
    // Update pool and slots state
  };

  const handleCheck = () => {
    const userAnswer = slots.join('').toLowerCase();
    const isCorrect = userAnswer === content.target.toLowerCase();
    setIsChecked(true);
    onAnswer(userAnswer, isCorrect);
    
    if (isCorrect) {
      voiceClient?.sendText("¡Correcto! Excelente trabajo.");
    } else {
      voiceClient?.sendText("Intenta de nuevo. ¡Tú puedes!");
    }
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <Card className="p-6">
        <h2 className="text-2xl mb-4">{content.prompt}</h2>
        {content.imageUrl && <img src={content.imageUrl} className="max-h-64 mx-auto mb-4" />}
        
        {/* Letter Pool */}
        <div className="flex flex-wrap gap-2 mb-6 justify-center">
          {pool.map((letter, i) => (
            <LetterTile key={`pool-${i}`} letter={letter} draggable />
          ))}
        </div>
        
        {/* Answer Slots */}
        <div className="flex gap-2 mb-6 justify-center">
          {slots.map((letter, i) => (
            <AnswerSlot key={`slot-${i}`} letter={letter} index={i} />
          ))}
        </div>
        
        <Button onClick={handleCheck} disabled={slots.some(s => s === null) || isChecked}>
          {isChecked ? '✓ Revisado' : 'Verificar Respuesta'}
        </Button>
      </Card>
    </DndContext>
  );
}
Accessibility:

Use aria-label on each tile: "Letter c, draggable"
Allow click-to-place for keyboard users (fallback to clicking)
Focus management during drag operations
5.4 NEW: WriteAnswerPlayer.tsx
Location: src/components/ManualAssessment/players/WriteAnswerPlayer.tsx

Purpose: Single-word text input with validation

UI Structure:

┌─ Question ─────────────────────────┐
│ "¿Qué animal es este?"             │
│ [Optional Image]                   │
└────────────────────────────────────┘

┌─ Answer Input ────────────────────┐
│ [              ]                   │
│  Type your answer here             │
└────────────────────────────────────┘

[Submit Answer Button]

{showFeedback && (
  isCorrect ? "✓ ¡Correcto!" : "✗ Respuesta: [correct answer]"
)}
Implementation:


export function WriteAnswerPlayer({ content, onAnswer, voiceClient }: Props) {
  const [userInput, setUserInput] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { t } = useLanguage();

  const handleSubmit = () => {
    const normalized = userInput.trim().toLowerCase();
    const isCorrect = normalized === content.correctAnswer.toLowerCase();
    setIsSubmitted(true);
    onAnswer(userInput, isCorrect);
    
    if (isCorrect) {
      voiceClient?.sendText("¡Perfecto! Esa es la respuesta correcta.");
    } else {
      voiceClient?.sendText(`La respuesta correcta es: ${content.correctAnswer}. ¡Sigue practicando!`);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl mb-4">{content.question}</h2>
      {content.questionImage && <img src={content.questionImage} className="max-h-64 mx-auto mb-4" />}
      
      <Input
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        placeholder={t("Escribe tu respuesta aquí", "Type your answer here")}
        disabled={isSubmitted}
        className="text-xl p-4 mb-4"
        autoFocus
      />
      
      <Button onClick={handleSubmit} disabled={!userInput.trim() || isSubmitted}>
        {t("Enviar Respuesta", "Submit Answer")}
      </Button>
      
      {isSubmitted && (
        <Alert className={isCorrect ? "bg-green-100" : "bg-red-100"}>
          {isCorrect ? (
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          ) : (
            <XCircle className="h-6 w-6 text-red-600" />
          )}
          <AlertTitle>
            {isCorrect ? t("¡Correcto!", "Correct!") : t("Incorrecto", "Incorrect")}
          </AlertTitle>
          {!isCorrect && (
            <AlertDescription>
              {t("La respuesta correcta es:", "The correct answer is:")} <strong>{content.correctAnswer}</strong>
            </AlertDescription>
          )}
        </Alert>
      )}
    </Card>
  );
}
5.5 NEW: DragDropPlayer.tsx
Location: src/components/ManualAssessment/players/DragDropPlayer.tsx

Purpose: Dual-mode player (letters/match)

Mode 1: Letters (Reuse FillBlankPlayer logic)

Mode 2: Match Items

UI Structure:

┌─ Question ─────────────────────────┐
│ "Match animals to their habitats"  │
└────────────────────────────────────┘

┌─ Draggable Items ─────────────────┐
│ [🐸 Coquí] [🐠 Pez] [🦅 Águila]   │
└────────────────────────────────────┘

┌─ Drop Zones ──────────────────────┐
│ [ FOREST ]                         │
│ [ OCEAN ]                          │
│ [ MOUNTAINS ]                      │
└────────────────────────────────────┘

[Check Answer Button]
Implementation:


export function DragDropPlayer({ content, onAnswer, voiceClient }: Props) {
  if (content.mode === 'letters') {
    return <FillBlankPlayer content={convertToFillBlank(content)} onAnswer={onAnswer} voiceClient={voiceClient} />;
  }

  const [placements, setPlacements] = useState<Record<string, string>>({});
  const [isChecked, setIsChecked] = useState(false);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    
    setPlacements(prev => ({
      ...prev,
      [active.id]: over.id
    }));
  };

  const handleCheck = () => {
    const correct = content.draggableItems.every(item => 
      placements[item.id] === item.correctZone
    );
    setIsChecked(true);
    onAnswer(placements, correct);
    
    if (correct) {
      voiceClient?.sendText("¡Todas las respuestas son correctas! ¡Buen trabajo!");
    } else {
      voiceClient?.sendText("Algunas respuestas no son correctas. Intenta de nuevo.");
    }
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <Card className="p-6">
        <h2 className="text-2xl mb-6">{content.question}</h2>
        
        {/* Draggable Items */}
        <div className="flex flex-wrap gap-4 mb-6 justify-center">
          {content.draggableItems.map(item => (
            <DraggableItem key={item.id} item={item} isPlaced={!!placements[item.id]} />
          ))}
        </div>
        
        {/* Drop Zones */}
        <div className="space-y-4 mb-6">
          {content.dropZones.map(zone => (
            <DropZone 
              key={zone.id} 
              zone={zone} 
              items={content.draggableItems.filter(i => placements[i.id] === zone.id)}
              isChecked={isChecked}
            />
          ))}
        </div>
        
        <Button onClick={handleCheck} disabled={Object.keys(placements).length < content.draggableItems.length || isChecked}>
          {t("Verificar Respuesta", "Check Answer")}
        </Button>
      </Card>
    </DndContext>
  );
}
🔧 PHASE 6: INTEGRATE PLAYERS INTO ViewAssessment.tsx
6.1 Modify ViewAssessment.tsx
Location: src/pages/ViewAssessment.tsx (lines 212-241)

Replace Generic Answer Buttons With:


{/* Type-Specific Players */}
{assessment.subtype === 'multiple_choice' && (
  <MultipleChoicePlayer
    content={assessment.content}
    onAnswer={handleAnswer}
    selectedAnswer={selectedAnswer}
    showFeedback={showFeedback}
    isCorrect={isCorrect}
  />
)}

{assessment.subtype === 'true_false' && (
  <TrueFalsePlayer
    content={assessment.content}
    onAnswer={handleAnswer}
    selectedAnswer={selectedAnswer}
    showFeedback={showFeedback}
    isCorrect={isCorrect}
  />
)}

{assessment.subtype === 'fill_blank' && (
  <FillBlankPlayer
    content={normalizeFillBlank(assessment.content)}
    onAnswer={(answer, correct) => {
      setIsCorrect(correct);
      setShowFeedback(true);
      if (correct) {
        voiceClient?.sendText("¡Excelente! Formaste la palabra correctamente.");
      } else {
        voiceClient?.sendText("Intenta de nuevo. Revisa las letras.");
      }
    }}
    voiceClient={voiceClient}
  />
)}

{assessment.subtype === 'write_answer' && (
  <WriteAnswerPlayer
    content={assessment.content}
    onAnswer={(answer, correct) => {
      setIsCorrect(correct);
      setShowFeedback(true);
    }}
    voiceClient={voiceClient}
  />
)}

{assessment.subtype === 'drag_drop' && (
  <DragDropPlayer
    content={assessment.content}
    onAnswer={(answer, correct) => {
      setIsCorrect(correct);
      setShowFeedback(true);
    }}
    voiceClient={voiceClient}
  />
)}
Add Imports:


import { MultipleChoicePlayer } from '@/components/ManualAssessment/players/MultipleChoicePlayer';
import { TrueFalsePlayer } from '@/components/ManualAssessment/players/TrueFalsePlayer';
import { FillBlankPlayer } from '@/components/ManualAssessment/players/FillBlankPlayer';
import { WriteAnswerPlayer } from '@/components/ManualAssessment/players/WriteAnswerPlayer';
import { DragDropPlayer } from '@/components/ManualAssessment/players/DragDropPlayer';
Add Helper Function:


function normalizeFillBlank(content: any): FillBlankContent {
  if (content.target) return content; // New format
  
  // Legacy format adapter
  const target = content.answers?.find((a: any) => a.correct)?.text || '';
  const letters = content.question.match(/\[(.*?)\]/)?.[1]?.split(',').map((l: string) => l.trim()) || [];
  
  return {
    mode: 'single_word',
    prompt: content.question.replace(/\[.*?\]/, '').trim(),
    target,
    letters,
    imageUrl: content.questionImage,
    autoShuffle: true
  };
}
🔧 PHASE 7: BILINGUAL IMPLEMENTATION
7.1 Language Switching (Already Implemented)
Use existing useLanguage() hook throughout all new components
Pattern: {t("Texto Español", "English Text")}
7.2 Bilingual Labels
All New Components Must Include:

Form labels (e.g., "Pregunta *" / "Question *")
Buttons (e.g., "Verificar Respuesta" / "Check Answer")
Validation messages (e.g., "Campo requerido" / "Required field")
Feedback messages (e.g., "¡Correcto!" / "Correct!")
Placeholder text
7.3 Voice Guidance Integration
Teachers can write voice guidance in either language
Voice client uses language specified in manual_assessments.language column
Coquí mascot responds in matching language
🔧 PHASE 8: TESTING CHECKPOINTS
Test 1: Database Migration
✅ Verify new subtypes accepted: write_answer, drag_drop
✅ Verify drag_drop_mode column added
✅ Check existing data integrity (no broken records)

Test 2: Subtype Selector
✅ All 5 types visible with correct icons
✅ Bilingual labels render correctly
✅ Selection triggers correct editor

Test 3: Fill Blank Fix
✅ Load exercise ce9ffa7e-2977-4788-b32a-cd32d70f5ee2
✅ Verify it renders as letter tiles (not multiple choice)
✅ Verify drag-and-drop works
✅ Verify check answer validation
✅ Verify voice feedback integration

Test 4: Write Answer
✅ Create new write_answer exercise
✅ Verify single-word validation
✅ Test correct/incorrect answers
✅ Verify case-insensitive matching
✅ Test with Spanish accents (coquí vs coqui)

Test 5: Drag Drop (Letters Mode)
✅ Create new drag_drop exercise (letters mode)
✅ Verify letter auto-generation with distractors
✅ Test drag-and-drop behavior
✅ Verify shuffle functionality
✅ Test check answer validation

Test 6: Drag Drop (Match Mode)
✅ Create new drag_drop exercise (match mode)
✅ Add text and image items
✅ Test drag-and-drop to zones
✅ Verify correct mappings
✅ Test check answer validation

Test 7: Bilingual Support
✅ Switch language (ES ↔ EN) in all editors
✅ Verify all labels translate
✅ Create exercises in both languages
✅ Test voice guidance in both languages

Test 8: Backward Compatibility
✅ Load old fill_blank records
✅ Verify adapter converts correctly
✅ Edit and re-save (should use new format)
✅ Verify no data loss

Test 9: Mobile Responsiveness
✅ Test all editors on mobile viewport
✅ Test all players on mobile (touch drag-and-drop)
✅ Verify buttons/inputs are touch-friendly

Test 10: Voice Integration
✅ Start voice session on each exercise type
✅ Verify Coquí mascot state changes
✅ Test correct/incorrect voice feedback
✅ Verify transcript displays properly

📋 DELIVERABLES SUMMARY
Database Changes:
Migration to add write_answer, drag_drop subtypes
Add drag_drop_mode column
New Files (16 total):
src/components/ManualAssessment/
├── editors/
│   ├── MultipleChoiceEditor.tsx (extracted)
│   ├── TrueFalseEditor.tsx (extracted)
│   ├── FillBlankEditor.tsx (NEW)
│   ├── WriteAnswerEditor.tsx (NEW)
│   └── DragDropEditor.tsx (NEW)
└── players/
    ├── MultipleChoicePlayer.tsx (extracted)
    ├── TrueFalsePlayer.tsx (extracted)
    ├── FillBlankPlayer.tsx (NEW)
    ├── WriteAnswerPlayer.tsx (NEW)
    └── DragDropPlayer.tsx (NEW)
Modified Files (3 total):
src/components/ManualAssessment/SubtypeSelector.tsx (add 2 new types)
src/pages/CreateAssessment.tsx (integrate editors)
src/pages/ViewAssessment.tsx (integrate players)
Validation Schemas (5 total):
fillBlankSchema (zod)
writeAnswerSchema (zod)
dragDropLettersSchema (zod)
dragDropMatchSchema (zod)
discriminatedUnion for drag_drop
🚀 IMPLEMENTATION PHASES (For Execution)
Phase 1: Foundation ✅
Database migration
Update SubtypeSelector
Testing checkpoint
Phase 2: Fix Fill Blank ✅
Create FillBlankEditor
Create FillBlankPlayer
Integrate into CreateAssessment/ViewAssessment
Test with existing record ce9ffa7e-2977-4788-b32a-cd32d70f5ee2
Phase 3: Add Write Answer ✅
Create WriteAnswerEditor
Create WriteAnswerPlayer
Integrate into CreateAssessment/ViewAssessment
Full testing
Phase 4: Add Drag Drop (Letters) ✅
Create DragDropEditor (letters mode only)
Create DragDropPlayer (letters mode only)
Integrate into CreateAssessment/ViewAssessment
Full testing
Phase 5: Add Drag Drop (Match) ✅
Extend DragDropEditor (add match mode)
Extend DragDropPlayer (add match mode)
Full testing
Phase 6: Extract Multiple Choice & True/False ✅
Create MultipleChoiceEditor/Player
Create TrueFalseEditor/Player
Integrate into CreateAssessment/ViewAssessment
Regression testing
Phase 7: Polish & Refinement ✅
Bilingual validation sweep
Mobile responsiveness fixes
Voice integration testing
Accessibility improvements
Performance optimization
🎯 SUCCESS CRITERIA
✅ All 5 exercise types work independently
✅ No breaking changes to existing exercises
✅ Backward compatibility maintained
✅ Full bilingual support
✅ Voice integration functional
✅ Mobile-responsive
✅ Accessible (keyboard + screen readers)
✅ Teachers can create all types easily
✅ Students can complete all types interactively
✅ Validation prevents invalid data

✅ NEXT STEPS
I've created a comprehensive plan covering all aspects of the refactor. The plan is structured into 7 implementation phases that we can execute one at a time with testing in between.

Key Highlights:

🔧 5 distinct exercise types (multiple choice, true/false, fill blank, write answer, drag-and-drop)
🎨 Dedicated editors for each type (easy teacher authoring)
🎮 Interactive players for students (@dnd-kit integration)
🌐 Full bilingual support (ES/EN throughout)
🔄 Backward compatibility (adapter for old fill_blank records)
🗣️ Voice integration (Coquí feedback for all types)
📱 Mobile-responsive (touch-friendly drag-and-drop)
Would you like to start with Phase 1 (Foundation - Database + SubtypeSelector)? This will set up the groundwork for all subsequent phases.

Perfect! Now I have everything I need. Let me create a comprehensive implementation plan.

Complete Exercise Type Refactor & Enhancement Plan
🎯 OBJECTIVE
Transform the manual assessment system from a broken 3-type system into a robust 5-type exercise platform with dedicated editors and players for each type, supporting bilingual content creation and interactive drag-and-drop experiences.

📊 CURRENT STATE ANALYSIS
Problems Identified:
fill_blank is broken - Renders as multiple choice due to generic AnswerList component usage
No type-specific validation - All subtypes use same generic content structure
No dedicated editors - Lines 848-856 of CreateAssessment.tsx use AnswerList for all types
No dedicated players - Lines 213-241 of ViewAssessment.tsx render all as multiple choice buttons
Limited subtype options - Only 3 types exist: multiple_choice, true_false, fill_blank
Target Architecture:
5 Exercise Subtypes:
├── multiple_choice (existing ✓) - SELECT correct answer from options
├── true_false (existing ✓) - CHOOSE true or false
├── fill_blank (broken → FIX) - DRAG letters to form word
├── write_answer (NEW) - TYPE single word answer
└── drag_drop (NEW) - DRAG items (2 modes):
    ├── Mode 1: Assemble word from letters (PRIMARY for POC)
    └── Mode 2: Match items to categories (SECONDARY)
🗂️ FILE STRUCTURE
New Directory Structure:
src/components/ManualAssessment/
├── SubtypeSelector.tsx (MODIFY - add 2 new types)
├── ImagePasteZone.tsx (existing - reuse)
├── editors/ (NEW DIRECTORY)
│   ├── MultipleChoiceEditor.tsx (extract from CreateAssessment)
│   ├── TrueFalseEditor.tsx (extract from CreateAssessment)
│   ├── FillBlankEditor.tsx (NEW - letter-based drag-and-drop)
│   ├── WriteAnswerEditor.tsx (NEW - single word input)
│   └── DragDropEditor.tsx (NEW - 2 modes: letters/match)
└── players/ (NEW DIRECTORY)
    ├── MultipleChoicePlayer.tsx (extract from ViewAssessment)
    ├── TrueFalsePlayer.tsx (extract from ViewAssessment)
    ├── FillBlankPlayer.tsx (NEW - interactive letter tiles)
    ├── WriteAnswerPlayer.tsx (NEW - text input validation)
    └── DragDropPlayer.tsx (NEW - @dnd-kit implementation)
🔧 PHASE 1: DATABASE & SCHEMA UPDATES
1.1 Database Migration
File: supabase/migrations/YYYYMMDDHHMMSS_add_new_exercise_subtypes.sql


-- Add new subtype enum values
ALTER TYPE text CHECK (subtype IN ('multiple_choice', 'true_false', 'fill_blank', 'write_answer', 'drag_drop'));

-- Add drag_drop_mode field for future extensibility
ALTER TABLE manual_assessments 
ADD COLUMN IF NOT EXISTS drag_drop_mode TEXT CHECK (drag_drop_mode IN ('letters', 'match', 'sequence', 'fill_sentence'));

-- Add index for new subtypes
CREATE INDEX IF NOT EXISTS idx_manual_assessments_subtype_new 
ON manual_assessments(subtype) 
WHERE subtype IN ('write_answer', 'drag_drop');

-- Add comment for documentation
COMMENT ON COLUMN manual_assessments.drag_drop_mode IS 'Specifies drag-and-drop interaction: letters (assemble word), match (categorize items), sequence (order items), fill_sentence (complete sentence)';
1.2 Content Structure Definitions
Fill Blank Structure (Fixed)

{
  mode: 'single_word',
  prompt: string,              // "Arrastra las letras para formar la palabra"
  target: string,              // "coquí"
  letters: string[],           // ["c","o","q","u","í","a","m"]
  imageUrl?: string,           // Optional image
  autoShuffle: boolean         // Shuffle letters on load
}
Write Answer Structure (New)

{
  question: string,            // "¿Qué animal es este?"
  questionImage?: string,      // Optional image
  correctAnswer: string,       // "coquí" (single word, auto-graded)
  acceptedVariants?: string[], // ["coqui", "Coquí"] (optional)
  caseSensitive: false         // Always false per requirements
}
Drag Drop Structure (New)

// Mode 1: Assemble Word (PRIMARY)
{
  mode: 'letters',
  question: string,            // "Form the word for this image:"
  questionImage?: string,
  targetWord: string,          // "mesa"
  availableLetters: string[],  // ["m","e","s","a","o","l"] (includes distractors)
  autoShuffle: boolean
}

// Mode 2: Match Items (SECONDARY)
{
  mode: 'match',
  question: string,            // "Match animals to habitats"
  questionImage?: string,
  draggableItems: Array<{
    id: string,
    content: string | { type: 'image', url: string },
    correctZone: string
  }>,
  dropZones: Array<{
    id: string,
    label: string
  }>,
  allowMultiplePerZone: false  // Always false per requirements
}
🔧 PHASE 2: SUBTYPE SELECTOR UPDATE
2.1 Update SubtypeSelector.tsx
File: src/components/ManualAssessment/SubtypeSelector.tsx

Changes:

Add imports: PenLine, Move from lucide-react
Expand subtypes array from 3 to 5 items (lines 21-53)
Add bilingual titles/descriptions for new types
New Entries:


{
  id: 'write_answer',
  icon: PenLine,
  titleEs: 'Escribir Respuesta',
  titleEn: 'Write Answer',
  descriptionEs: 'Escribir la palabra correcta',
  descriptionEn: 'Write the correct word'
},
{
  id: 'drag_drop',
  icon: Move,
  titleEs: 'Arrastrar y Soltar',
  titleEn: 'Drag and Drop',
  descriptionEs: 'Arrastrar elementos para responder',
  descriptionEn: 'Drag elements to answer'
}
🔧 PHASE 3: EDITOR COMPONENTS (Teacher Creation)
3.1 Extract Existing: MultipleChoiceEditor.tsx
Location: src/components/ManualAssessment/editors/MultipleChoiceEditor.tsx

Purpose: Extract current AnswerList logic for multiple choice Props:


interface MultipleChoiceEditorProps {
  content: { question: string; questionImage?: string; answers: Answer[] };
  onChange: (content: any) => void;
  language: LanguageCode;
}
Features:

Question textarea
Image paste zone
AnswerList component (reuse existing)
Validation: At least 2 answers, exactly 1 marked correct
3.2 Extract Existing: TrueFalseEditor.tsx
Location: src/components/ManualAssessment/editors/TrueFalseEditor.tsx

Purpose: Simplified editor for T/F questions Props: Same as MultipleChoiceEditor

Features:

Question textarea
Image paste zone
Radio buttons: "Correct Answer: ○ True ○ False"
Auto-generates 2 answers: [{text: "True", correct: true/false}, {text: "False", correct: false/true}]
3.3 NEW: FillBlankEditor.tsx
Location: src/components/ManualAssessment/editors/FillBlankEditor.tsx

Purpose: Letter-based drag-and-drop word assembly Props:


interface FillBlankEditorProps {
  content: FillBlankContent;
  onChange: (content: FillBlankContent) => void;
  language: LanguageCode;
}
UI Fields:

Prompt (Textarea, required)

Placeholder: "Arrastra las letras..." / "Drag the letters..."
Max: 400 chars
Target Word (Input, required)

Validation: /^[a-zA-Záéíóúüñ]+$/i (letters only)
Max: 20 chars
Letters Pool (Chips editor)

Auto-generate button: Splits target + adds 2 random distractors
Manual edit: Add/remove individual letters
Display as draggable chips (visual preview)
Auto-Shuffle (Checkbox, default: true)

Optional Image (ImagePasteZone)

Validation (zod):


const fillBlankSchema = z.object({
  prompt: z.string().trim().min(1).max(400),
  target: z.string().trim().regex(/^[a-zA-Záéíóúüñ]+$/i).min(1).max(20),
  letters: z.array(z.string().length(1)).min(1).max(30)
    .refine(letters => {
      const target = /* get target */;
      return [...target].every(char => letters.includes(char.toLowerCase()));
    }, "Letters must contain all characters from target word"),
  imageUrl: z.string().url().optional(),
  autoShuffle: z.boolean()
});
Backward Compatibility Adapter:


function migrateFillBlank(oldContent: any): FillBlankContent {
  if (oldContent.target) return oldContent; // Already new format
  
  // Legacy format: extract from question and answers
  const target = oldContent.answers?.find(a => a.correct)?.text || '';
  const letters = oldContent.question.match(/\[(.*?)\]/)?.[1]?.split(',') || [];
  
  return {
    mode: 'single_word',
    prompt: oldContent.question.replace(/\[.*?\]/, '').trim(),
    target,
    letters,
    autoShuffle: true
  };
}
3.4 NEW: WriteAnswerEditor.tsx
Location: src/components/ManualAssessment/editors/WriteAnswerEditor.tsx

Purpose: Single-word text input exercise Props:


interface WriteAnswerEditorProps {
  content: WriteAnswerContent;
  onChange: (content: WriteAnswerContent) => void;
  language: LanguageCode;
}
UI Fields:

Question (Textarea, required)

Placeholder: "¿Qué animal es este?" / "What animal is this?"
Max: 500 chars
Correct Answer (Input, required)

Single word only
Validation: /^[a-zA-Záéíóúüñ]+$/i
Max: 50 chars
Optional Image (ImagePasteZone)

Validation (zod):


const writeAnswerSchema = z.object({
  question: z.string().trim().min(1).max(500),
  questionImage: z.string().url().optional(),
  correctAnswer: z.string().trim().regex(/^[a-zA-Záéíóúüñ]+$/i).min(1).max(50),
  caseSensitive: z.literal(false)
});
3.5 NEW: DragDropEditor.tsx
Location: src/components/ManualAssessment/editors/DragDropEditor.tsx

Purpose: Dual-mode drag-and-drop (letters/match) Props:


interface DragDropEditorProps {
  content: DragDropContent;
  mode: 'letters' | 'match';
  onChange: (content: DragDropContent) => void;
  language: LanguageCode;
}
UI Structure:

┌─ Mode Toggle ─────────────────────┐
│ ○ Letters (Assemble Word)         │
│ ○ Match (Categorize Items)        │
└───────────────────────────────────┘

{mode === 'letters' && <LettersModeUI />}
{mode === 'match' && <MatchModeUI />}
Mode 1: Letters UI (Priority for POC)

Question (Textarea)
Target Word (Input)
Available Letters (Auto-generate + manual edit)
Auto-Shuffle (Checkbox)
Optional Image
Mode 2: Match UI

Question (Textarea)
Draggable Items (List builder)
Each item: Text input OR image upload
Assign to zone (dropdown)
Drop Zones (List builder)
Each zone: Label input
Optional Image
Validation (zod):


const dragDropSchema = z.discriminatedUnion('mode', [
  z.object({
    mode: z.literal('letters'),
    question: z.string().trim().min(1).max(500),
    questionImage: z.string().url().optional(),
    targetWord: z.string().trim().regex(/^[a-zA-Záéíóúüñ]+$/i).min(1).max(20),
    availableLetters: z.array(z.string().length(1)).min(1).max(30),
    autoShuffle: z.boolean()
  }),
  z.object({
    mode: z.literal('match'),
    question: z.string().trim().min(1).max(500),
    questionImage: z.string().url().optional(),
    draggableItems: z.array(z.object({
      id: z.string(),
      content: z.union([z.string(), z.object({ type: z.literal('image'), url: z.string().url() })]),
      correctZone: z.string()
    })).min(2),
    dropZones: z.array(z.object({
      id: z.string(),
      label: z.string().min(1).max(100)
    })).min(2),
    allowMultiplePerZone: z.literal(false)
  })
]);
🔧 PHASE 4: INTEGRATE EDITORS INTO CreateAssessment.tsx
4.1 Modify CreateAssessment.tsx
Location: src/pages/CreateAssessment.tsx (lines 847-858)

Replace Generic AnswerList Section With:


{/* Type-Specific Editors */}
<div>
  <Label>{isSpanish ? 'Contenido del Ejercicio *' : 'Exercise Content *'}</Label>
  
  {data.subtype === 'multiple_choice' && (
    <MultipleChoiceEditor
      content={data.content || { question: '', answers: [] }}
      onChange={(content) => setData({ ...data, content })}
      language={data.settings.language}
    />
  )}
  
  {data.subtype === 'true_false' && (
    <TrueFalseEditor
      content={data.content || { question: '', correctAnswer: true }}
      onChange={(content) => setData({ ...data, content })}
      language={data.settings.language}
    />
  )}
  
  {data.subtype === 'fill_blank' && (
    <FillBlankEditor
      content={data.content || { mode: 'single_word', prompt: '', target: '', letters: [], autoShuffle: true }}
      onChange={(content) => setData({ ...data, content })}
      language={data.settings.language}
    />
  )}
  
  {data.subtype === 'write_answer' && (
    <WriteAnswerEditor
      content={data.content || { question: '', correctAnswer: '', caseSensitive: false }}
      onChange={(content) => setData({ ...data, content })}
      language={data.settings.language}
    />
  )}
  
  {data.subtype === 'drag_drop' && (
    <DragDropEditor
      content={data.content || { mode: 'letters', question: '', targetWord: '', availableLetters: [], autoShuffle: true }}
      mode={data.drag_drop_mode || 'letters'}
      onChange={(content) => setData({ ...data, content, drag_drop_mode: content.mode })}
      language={data.settings.language}
    />
  )}
</div>
Add Imports:


import { MultipleChoiceEditor } from '@/components/ManualAssessment/editors/MultipleChoiceEditor';
import { TrueFalseEditor } from '@/components/ManualAssessment/editors/TrueFalseEditor';
import { FillBlankEditor } from '@/components/ManualAssessment/editors/FillBlankEditor';
import { WriteAnswerEditor } from '@/components/ManualAssessment/editors/WriteAnswerEditor';
import { DragDropEditor } from '@/components/ManualAssessment/editors/DragDropEditor';
🔧 PHASE 5: PLAYER COMPONENTS (Student View)
5.1 Extract Existing: MultipleChoicePlayer.tsx
Location: src/components/ManualAssessment/players/MultipleChoicePlayer.tsx

Purpose: Extract current button-based multiple choice (lines 213-241 of ViewAssessment.tsx) Props:


interface MultipleChoicePlayerProps {
  content: { question: string; questionImage?: string; answers: Answer[] };
  onAnswer: (answerIndex: number, isCorrect: boolean) => void;
  selectedAnswer: number | null;
  showFeedback: boolean;
  isCorrect: boolean;
}
5.2 Extract Existing: TrueFalsePlayer.tsx
Location: src/components/ManualAssessment/players/TrueFalsePlayer.tsx

Purpose: Specialized T/F player (reuse MultipleChoicePlayer logic but styled as 2 large buttons)

5.3 NEW: FillBlankPlayer.tsx
Location: src/components/ManualAssessment/players/FillBlankPlayer.tsx

Purpose: Interactive letter tile drag-and-drop Dependencies: @dnd-kit/core, @dnd-kit/sortable

UI Structure:

┌─ Question ─────────────────────────┐
│ "Arrastra las letras..."           │
│ [Optional Image]                   │
└────────────────────────────────────┘

┌─ Letter Pool (Draggable) ─────────┐
│ [c] [o] [a] [q] [u] [í]           │
└────────────────────────────────────┘

┌─ Answer Slots (Drop Zones) ───────┐
│ [_] [_] [_] [_] [_]               │
└────────────────────────────────────┘

[Check Answer Button]
Implementation:


import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import { SortableContext, useSortable, arrayMove } from '@dnd-kit/sortable';

export function FillBlankPlayer({ content, onAnswer, voiceClient }: Props) {
  const [pool, setPool] = useState<string[]>(
    content.autoShuffle ? shuffle(content.letters) : content.letters
  );
  const [slots, setSlots] = useState<(string | null)[]>(
    Array(content.target.length).fill(null)
  );
  const [isChecked, setIsChecked] = useState(false);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    // Move letter from pool to slot or between slots
    // Update pool and slots state
  };

  const handleCheck = () => {
    const userAnswer = slots.join('').toLowerCase();
    const isCorrect = userAnswer === content.target.toLowerCase();
    setIsChecked(true);
    onAnswer(userAnswer, isCorrect);
    
    if (isCorrect) {
      voiceClient?.sendText("¡Correcto! Excelente trabajo.");
    } else {
      voiceClient?.sendText("Intenta de nuevo. ¡Tú puedes!");
    }
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <Card className="p-6">
        <h2 className="text-2xl mb-4">{content.prompt}</h2>
        {content.imageUrl && <img src={content.imageUrl} className="max-h-64 mx-auto mb-4" />}
        
        {/* Letter Pool */}
        <div className="flex flex-wrap gap-2 mb-6 justify-center">
          {pool.map((letter, i) => (
            <LetterTile key={`pool-${i}`} letter={letter} draggable />
          ))}
        </div>
        
        {/* Answer Slots */}
        <div className="flex gap-2 mb-6 justify-center">
          {slots.map((letter, i) => (
            <AnswerSlot key={`slot-${i}`} letter={letter} index={i} />
          ))}
        </div>
        
        <Button onClick={handleCheck} disabled={slots.some(s => s === null) || isChecked}>
          {isChecked ? '✓ Revisado' : 'Verificar Respuesta'}
        </Button>
      </Card>
    </DndContext>
  );
}
Accessibility:

Use aria-label on each tile: "Letter c, draggable"
Allow click-to-place for keyboard users (fallback to clicking)
Focus management during drag operations
5.4 NEW: WriteAnswerPlayer.tsx
Location: src/components/ManualAssessment/players/WriteAnswerPlayer.tsx

Purpose: Single-word text input with validation

UI Structure:

┌─ Question ─────────────────────────┐
│ "¿Qué animal es este?"             │
│ [Optional Image]                   │
└────────────────────────────────────┘

┌─ Answer Input ────────────────────┐
│ [              ]                   │
│  Type your answer here             │
└────────────────────────────────────┘

[Submit Answer Button]

{showFeedback && (
  isCorrect ? "✓ ¡Correcto!" : "✗ Respuesta: [correct answer]"
)}
Implementation:


export function WriteAnswerPlayer({ content, onAnswer, voiceClient }: Props) {
  const [userInput, setUserInput] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { t } = useLanguage();

  const handleSubmit = () => {
    const normalized = userInput.trim().toLowerCase();
    const isCorrect = normalized === content.correctAnswer.toLowerCase();
    setIsSubmitted(true);
    onAnswer(userInput, isCorrect);
    
    if (isCorrect) {
      voiceClient?.sendText("¡Perfecto! Esa es la respuesta correcta.");
    } else {
      voiceClient?.sendText(`La respuesta correcta es: ${content.correctAnswer}. ¡Sigue practicando!`);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl mb-4">{content.question}</h2>
      {content.questionImage && <img src={content.questionImage} className="max-h-64 mx-auto mb-4" />}
      
      <Input
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        placeholder={t("Escribe tu respuesta aquí", "Type your answer here")}
        disabled={isSubmitted}
        className="text-xl p-4 mb-4"
        autoFocus
      />
      
      <Button onClick={handleSubmit} disabled={!userInput.trim() || isSubmitted}>
        {t("Enviar Respuesta", "Submit Answer")}
      </Button>
      
      {isSubmitted && (
        <Alert className={isCorrect ? "bg-green-100" : "bg-red-100"}>
          {isCorrect ? (
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          ) : (
            <XCircle className="h-6 w-6 text-red-600" />
          )}
          <AlertTitle>
            {isCorrect ? t("¡Correcto!", "Correct!") : t("Incorrecto", "Incorrect")}
          </AlertTitle>
          {!isCorrect && (
            <AlertDescription>
              {t("La respuesta correcta es:", "The correct answer is:")} <strong>{content.correctAnswer}</strong>
            </AlertDescription>
          )}
        </Alert>
      )}
    </Card>
  );
}
5.5 NEW: DragDropPlayer.tsx
Location: src/components/ManualAssessment/players/DragDropPlayer.tsx

Purpose: Dual-mode player (letters/match)

Mode 1: Letters (Reuse FillBlankPlayer logic)

Mode 2: Match Items

UI Structure:

┌─ Question ─────────────────────────┐
│ "Match animals to their habitats"  │
└────────────────────────────────────┘

┌─ Draggable Items ─────────────────┐
│ [🐸 Coquí] [🐠 Pez] [🦅 Águila]   │
└────────────────────────────────────┘

┌─ Drop Zones ──────────────────────┐
│ [ FOREST ]                         │
│ [ OCEAN ]                          │
│ [ MOUNTAINS ]                      │
└────────────────────────────────────┘

[Check Answer Button]
Implementation:


export function DragDropPlayer({ content, onAnswer, voiceClient }: Props) {
  if (content.mode === 'letters') {
    return <FillBlankPlayer content={convertToFillBlank(content)} onAnswer={onAnswer} voiceClient={voiceClient} />;
  }

  const [placements, setPlacements] = useState<Record<string, string>>({});
  const [isChecked, setIsChecked] = useState(false);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    
    setPlacements(prev => ({
      ...prev,
      [active.id]: over.id
    }));
  };

  const handleCheck = () => {
    const correct = content.draggableItems.every(item => 
      placements[item.id] === item.correctZone
    );
    setIsChecked(true);
    onAnswer(placements, correct);
    
    if (correct) {
      voiceClient?.sendText("¡Todas las respuestas son correctas! ¡Buen trabajo!");
    } else {
      voiceClient?.sendText("Algunas respuestas no son correctas. Intenta de nuevo.");
    }
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <Card className="p-6">
        <h2 className="text-2xl mb-6">{content.question}</h2>
        
        {/* Draggable Items */}
        <div className="flex flex-wrap gap-4 mb-6 justify-center">
          {content.draggableItems.map(item => (
            <DraggableItem key={item.id} item={item} isPlaced={!!placements[item.id]} />
          ))}
        </div>
        
        {/* Drop Zones */}
        <div className="space-y-4 mb-6">
          {content.dropZones.map(zone => (
            <DropZone 
              key={zone.id} 
              zone={zone} 
              items={content.draggableItems.filter(i => placements[i.id] === zone.id)}
              isChecked={isChecked}
            />
          ))}
        </div>
        
        <Button onClick={handleCheck} disabled={Object.keys(placements).length < content.draggableItems.length || isChecked}>
          {t("Verificar Respuesta", "Check Answer")}
        </Button>
      </Card>
    </DndContext>
  );
}
🔧 PHASE 6: INTEGRATE PLAYERS INTO ViewAssessment.tsx
6.1 Modify ViewAssessment.tsx
Location: src/pages/ViewAssessment.tsx (lines 212-241)

Replace Generic Answer Buttons With:


{/* Type-Specific Players */}
{assessment.subtype === 'multiple_choice' && (
  <MultipleChoicePlayer
    content={assessment.content}
    onAnswer={handleAnswer}
    selectedAnswer={selectedAnswer}
    showFeedback={showFeedback}
    isCorrect={isCorrect}
  />
)}

{assessment.subtype === 'true_false' && (
  <TrueFalsePlayer
    content={assessment.content}
    onAnswer={handleAnswer}
    selectedAnswer={selectedAnswer}
    showFeedback={showFeedback}
    isCorrect={isCorrect}
  />
)}

{assessment.subtype === 'fill_blank' && (
  <FillBlankPlayer
    content={normalizeFillBlank(assessment.content)}
    onAnswer={(answer, correct) => {
      setIsCorrect(correct);
      setShowFeedback(true);
      if (correct) {
        voiceClient?.sendText("¡Excelente! Formaste la palabra correctamente.");
      } else {
        voiceClient?.sendText("Intenta de nuevo. Revisa las letras.");
      }
    }}
    voiceClient={voiceClient}
  />
)}

{assessment.subtype === 'write_answer' && (
  <WriteAnswerPlayer
    content={assessment.content}
    onAnswer={(answer, correct) => {
      setIsCorrect(correct);
      setShowFeedback(true);
    }}
    voiceClient={voiceClient}
  />
)}

{assessment.subtype === 'drag_drop' && (
  <DragDropPlayer
    content={assessment.content}
    onAnswer={(answer, correct) => {
      setIsCorrect(correct);
      setShowFeedback(true);
    }}
    voiceClient={voiceClient}
  />
)}
Add Imports:


import { MultipleChoicePlayer } from '@/components/ManualAssessment/players/MultipleChoicePlayer';
import { TrueFalsePlayer } from '@/components/ManualAssessment/players/TrueFalsePlayer';
import { FillBlankPlayer } from '@/components/ManualAssessment/players/FillBlankPlayer';
import { WriteAnswerPlayer } from '@/components/ManualAssessment/players/WriteAnswerPlayer';
import { DragDropPlayer } from '@/components/ManualAssessment/players/DragDropPlayer';
Add Helper Function:


function normalizeFillBlank(content: any): FillBlankContent {
  if (content.target) return content; // New format
  
  // Legacy format adapter
  const target = content.answers?.find((a: any) => a.correct)?.text || '';
  const letters = content.question.match(/\[(.*?)\]/)?.[1]?.split(',').map((l: string) => l.trim()) || [];
  
  return {
    mode: 'single_word',
    prompt: content.question.replace(/\[.*?\]/, '').trim(),
    target,
    letters,
    imageUrl: content.questionImage,
    autoShuffle: true
  };
}
🔧 PHASE 7: BILINGUAL IMPLEMENTATION
7.1 Language Switching (Already Implemented)
Use existing useLanguage() hook throughout all new components
Pattern: {t("Texto Español", "English Text")}
7.2 Bilingual Labels
All New Components Must Include:

Form labels (e.g., "Pregunta *" / "Question *")
Buttons (e.g., "Verificar Respuesta" / "Check Answer")
Validation messages (e.g., "Campo requerido" / "Required field")
Feedback messages (e.g., "¡Correcto!" / "Correct!")
Placeholder text
7.3 Voice Guidance Integration
Teachers can write voice guidance in either language
Voice client uses language specified in manual_assessments.language column
Coquí mascot responds in matching language
🔧 PHASE 8: TESTING CHECKPOINTS
Test 1: Database Migration
✅ Verify new subtypes accepted: write_answer, drag_drop
✅ Verify drag_drop_mode column added
✅ Check existing data integrity (no broken records)

Test 2: Subtype Selector
✅ All 5 types visible with correct icons
✅ Bilingual labels render correctly
✅ Selection triggers correct editor

Test 3: Fill Blank Fix
✅ Load exercise ce9ffa7e-2977-4788-b32a-cd32d70f5ee2
✅ Verify it renders as letter tiles (not multiple choice)
✅ Verify drag-and-drop works
✅ Verify check answer validation
✅ Verify voice feedback integration

Test 4: Write Answer
✅ Create new write_answer exercise
✅ Verify single-word validation
✅ Test correct/incorrect answers
✅ Verify case-insensitive matching
✅ Test with Spanish accents (coquí vs coqui)

Test 5: Drag Drop (Letters Mode)
✅ Create new drag_drop exercise (letters mode)
✅ Verify letter auto-generation with distractors
✅ Test drag-and-drop behavior
✅ Verify shuffle functionality
✅ Test check answer validation

Test 6: Drag Drop (Match Mode)
✅ Create new drag_drop exercise (match mode)
✅ Add text and image items
✅ Test drag-and-drop to zones
✅ Verify correct mappings
✅ Test check answer validation

Test 7: Bilingual Support
✅ Switch language (ES ↔ EN) in all editors
✅ Verify all labels translate
✅ Create exercises in both languages
✅ Test voice guidance in both languages

Test 8: Backward Compatibility
✅ Load old fill_blank records
✅ Verify adapter converts correctly
✅ Edit and re-save (should use new format)
✅ Verify no data loss

Test 9: Mobile Responsiveness
✅ Test all editors on mobile viewport
✅ Test all players on mobile (touch drag-and-drop)
✅ Verify buttons/inputs are touch-friendly

Test 10: Voice Integration
✅ Start voice session on each exercise type
✅ Verify Coquí mascot state changes
✅ Test correct/incorrect voice feedback
✅ Verify transcript displays properly

📋 DELIVERABLES SUMMARY
Database Changes:
Migration to add write_answer, drag_drop subtypes
Add drag_drop_mode column
New Files (16 total):
src/components/ManualAssessment/
├── editors/
│   ├── MultipleChoiceEditor.tsx (extracted)
│   ├── TrueFalseEditor.tsx (extracted)
│   ├── FillBlankEditor.tsx (NEW)
│   ├── WriteAnswerEditor.tsx (NEW)
│   └── DragDropEditor.tsx (NEW)
└── players/
    ├── MultipleChoicePlayer.tsx (extracted)
    ├── TrueFalsePlayer.tsx (extracted)
    ├── FillBlankPlayer.tsx (NEW)
    ├── WriteAnswerPlayer.tsx (NEW)
    └── DragDropPlayer.tsx (NEW)
Modified Files (3 total):
src/components/ManualAssessment/SubtypeSelector.tsx (add 2 new types)
src/pages/CreateAssessment.tsx (integrate editors)
src/pages/ViewAssessment.tsx (integrate players)
Validation Schemas (5 total):
fillBlankSchema (zod)
writeAnswerSchema (zod)
dragDropLettersSchema (zod)
dragDropMatchSchema (zod)
discriminatedUnion for drag_drop


🎯 SUCCESS CRITERIA
✅ All 5 exercise types work independently
✅ No breaking changes to existing exercises
✅ Backward compatibility maintained
✅ Full bilingual support
✅ Voice integration functional
✅ Mobile-responsive
✅ Accessible (keyboard + screen readers)
✅ Teachers can create all types easily
✅ Students can complete all types interactively
✅ Validation prevents invalid data

✅ NEXT STEPS
I've created a comprehensive plan covering all aspects of the refactor. The plan is structured into 7 implementation phases that we can execute one at a time with testing in between.

Key Highlights:

🔧 5 distinct exercise types (multiple choice, true/false, fill blank, write answer, drag-and-drop)
🎨 Dedicated editors for each type (easy teacher authoring)
🎮 Interactive players for students (@dnd-kit integration)
🌐 Full bilingual support (ES/EN throughout)
🔄 Backward compatibility (adapter for old fill_blank records)
🗣️ Voice integration (Coquí feedback for all types)
📱 Mobile-responsive (touch-friendly drag-and-drop)
