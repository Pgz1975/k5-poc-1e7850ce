# Component Structure - Manual Assessment Creation

## Component Hierarchy

```
App.tsx
└── ManualAssessmentCreate.tsx (Main Page)
    ├── Header (reuse existing)
    ├── TypeSelector
    ├── SubtypeSelector
    ├── ContentEditorForm
    │   ├── RichTextEditor
    │   ├── ImagePasteZone
    │   ├── AnswerList
    │   │   └── AnswerOption (repeating)
    │   │       ├── TextInput
    │   │       ├── ImagePasteButton
    │   │       └── CorrectToggle
    │   ├── VoiceGuidanceInput
    │   └── SettingsPanel
    ├── PreviewButton
    └── SaveButton

ManualAssessmentPreview.tsx (Preview Page)
└── StudentViewWrapper
    └── ManualAssessmentView (reusable)

ManualAssessmentView.tsx (Student-Facing)
├── Header (reuse existing)
├── CoquiMascot (reuse existing)
├── VoicePlayer (use useRealtimeVoice hook)
└── ContentRenderer
    ├── QuestionDisplay
    ├── MultipleChoiceOptions
    ├── TrueFalseButtons
    ├── FillBlankInput
    └── FeedbackPanel
```

---

## Core Components

### 1. ManualAssessmentCreate.tsx (Main Page)

```typescript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { TypeSelector } from '@/components/ManualAssessment/TypeSelector';
import { SubtypeSelector } from '@/components/ManualAssessment/SubtypeSelector';
import { ContentEditorForm } from '@/components/ManualAssessment/ContentEditorForm';

interface AssessmentData {
  type: 'lesson' | 'exercise' | 'assessment';
  subtype: 'multiple_choice' | 'true_false' | 'fill_blank' | 'matching';
  content: {
    question: string;
    questionImage?: string;
    answers: Answer[];
    voiceGuidance?: string;
  };
  settings: {
    gradeLevel: number;
    language: 'es' | 'en';
    subject: string;
  };
}

export default function ManualAssessmentCreate() {
  const [step, setStep] = useState<'type' | 'subtype' | 'content'>('type');
  const [data, setData] = useState<Partial<AssessmentData>>({});
  const navigate = useNavigate();

  const handleSave = async () => {
    // Save to Supabase
    const { data: saved, error } = await supabase
      .from('manual_assessments')
      .insert([data])
      .select();

    if (saved) {
      navigate(`/manual-assessment/view/${saved[0].id}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E6F7FF] to-white">
      <Header />

      <main className="container mx-auto px-6 py-8">
        {step === 'type' && (
          <TypeSelector
            onSelect={(type) => {
              setData({ ...data, type });
              setStep('subtype');
            }}
          />
        )}

        {step === 'subtype' && (
          <SubtypeSelector
            type={data.type!}
            onSelect={(subtype) => {
              setData({ ...data, subtype });
              setStep('content');
            }}
            onBack={() => setStep('type')}
          />
        )}

        {step === 'content' && (
          <ContentEditorForm
            data={data}
            onChange={setData}
            onSave={handleSave}
            onBack={() => setStep('subtype')}
          />
        )}
      </main>
    </div>
  );
}
```

---

### 2. TypeSelector.tsx

```typescript
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, PenTool, ClipboardCheck } from 'lucide-react';
import CoquiMascot from '@/components/CoquiMascot';

interface TypeSelectorProps {
  onSelect: (type: 'lesson' | 'exercise' | 'assessment') => void;
}

export function TypeSelector({ onSelect }: TypeSelectorProps) {
  const types = [
    {
      id: 'lesson' as const,
      icon: BookOpen,
      title: 'Lesson',
      titleEs: 'Lección',
      description: 'Teaching content',
      descriptionEs: 'Contenido educativo',
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'exercise' as const,
      icon: PenTool,
      title: 'Exercise',
      titleEs: 'Ejercicio',
      description: 'Practice activity',
      descriptionEs: 'Actividad de práctica',
      color: 'from-green-500 to-green-600'
    },
    {
      id: 'assessment' as const,
      icon: ClipboardCheck,
      title: 'Assessment',
      titleEs: 'Evaluación',
      description: 'Evaluate learning',
      descriptionEs: 'Evaluar aprendizaje',
      color: 'from-purple-500 to-purple-600'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-8">
        What do you want to create?
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {types.map(type => {
          const Icon = type.icon;
          return (
            <Card
              key={type.id}
              className="p-8 cursor-pointer hover:shadow-xl transition-all hover:scale-105"
              onClick={() => onSelect(type.id)}
            >
              <div className={`w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br ${type.color} flex items-center justify-center`}>
                <Icon className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-center mb-2">
                {type.titleEs}
              </h3>
              <p className="text-center text-muted-foreground">
                {type.descriptionEs}
              </p>
            </Card>
          );
        })}
      </div>

      {/* Tip Card */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <p className="text-lg">
          💡 <strong>Tip:</strong> Start with a Lesson to teach new concepts,
          then create Exercises for practice!
        </p>
      </Card>

      {/* Coquí Mascot */}
      <div className="flex justify-end mt-8">
        <div className="text-right mr-4">
          <div className="bg-white p-4 rounded-2xl shadow-lg mb-2">
            <p className="text-xl font-medium">
              ¡Vamos a crear algo divertido!
            </p>
          </div>
        </div>
        <CoquiMascot state="thinking" size="large" />
      </div>
    </div>
  );
}
```

---

### 3. ContentEditorForm.tsx (Main Form)

```typescript
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { AnswerList } from './AnswerList';
import { ImagePasteZone } from './ImagePasteZone';
import { VoiceGuidanceInput } from './VoiceGuidanceInput';
import { SettingsPanel } from './SettingsPanel';

interface ContentEditorFormProps {
  data: Partial<AssessmentData>;
  onChange: (data: Partial<AssessmentData>) => void;
  onSave: () => void;
  onBack: () => void;
}

export function ContentEditorForm({ data, onChange, onSave, onBack }: ContentEditorFormProps) {
  const [questionText, setQuestionText] = useState(data.content?.question || '');
  const [answers, setAnswers] = useState(data.content?.answers || [
    { text: '', imageUrl: null, isCorrect: false },
    { text: '', imageUrl: null, isCorrect: false }
  ]);

  const updateContent = () => {
    onChange({
      ...data,
      content: {
        ...data.content,
        question: questionText,
        answers
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Button onClick={onBack} variant="ghost" className="mb-6">
        ← Back
      </Button>

      {/* Question Input */}
      <Card className="p-6 mb-6">
        <h3 className="text-xl font-bold mb-4">📝 Question or Instruction</h3>
        <Textarea
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          onBlur={updateContent}
          placeholder="Enter your question here..."
          className="text-2xl min-h-32"
        />
      </Card>

      {/* Question Image */}
      <Card className="p-6 mb-6">
        <h3 className="text-xl font-bold mb-4">🎨 Add Question Image (Optional)</h3>
        <ImagePasteZone
          onImageUploaded={(url) => {
            onChange({
              ...data,
              content: { ...data.content, questionImage: url }
            });
          }}
        />
      </Card>

      {/* Answer Options */}
      <Card className="p-6 mb-6">
        <h3 className="text-xl font-bold mb-4">✅ Answer Options</h3>
        <AnswerList
          answers={answers}
          onChange={(newAnswers) => {
            setAnswers(newAnswers);
            updateContent();
          }}
        />
      </Card>

      {/* Voice Guidance */}
      <VoiceGuidanceInput
        value={data.content?.voiceGuidance || ''}
        onChange={(voice) => {
          onChange({
            ...data,
            content: { ...data.content, voiceGuidance: voice }
          });
        }}
      />

      {/* Settings */}
      <SettingsPanel
        settings={data.settings || { gradeLevel: 1, language: 'es', subject: 'reading' }}
        onChange={(settings) => onChange({ ...data, settings })}
      />

      {/* Action Buttons */}
      <div className="flex gap-4 mt-8">
        <Button
          variant="outline"
          size="lg"
          onClick={() => {/* Preview mode */}}
        >
          👁️ Preview
        </Button>
        <Button
          size="lg"
          className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500"
          onClick={onSave}
        >
          ✅ Save Exercise
        </Button>
      </div>
    </div>
  );
}
```

---

### 4. AnswerList.tsx

```typescript
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { X } from 'lucide-react';
import { ImagePasteButton } from './ImagePasteButton';

interface Answer {
  text: string;
  imageUrl: string | null;
  isCorrect: boolean;
}

interface AnswerListProps {
  answers: Answer[];
  onChange: (answers: Answer[]) => void;
}

export function AnswerList({ answers, onChange }: AnswerListProps) {
  const addAnswer = () => {
    onChange([...answers, { text: '', imageUrl: null, isCorrect: false }]);
  };

  const removeAnswer = (index: number) => {
    onChange(answers.filter((_, i) => i !== index));
  };

  const updateAnswer = (index: number, field: keyof Answer, value: any) => {
    const updated = [...answers];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      {answers.map((answer, index) => (
        <div key={index} className="border-2 rounded-lg p-4 bg-white">
          <div className="flex items-center gap-4 mb-2">
            <span className="text-lg font-bold">Option {index + 1}:</span>
            <Checkbox
              checked={answer.isCorrect}
              onCheckedChange={(checked) => updateAnswer(index, 'isCorrect', checked)}
            />
            <span className="text-sm">Mark as correct</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeAnswer(index)}
              className="ml-auto"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex gap-4">
            <Input
              value={answer.text}
              onChange={(e) => updateAnswer(index, 'text', e.target.value)}
              placeholder="Enter answer text..."
              className="flex-1 text-xl"
            />

            <ImagePasteButton
              onImageUploaded={(url) => updateAnswer(index, 'imageUrl', url)}
            />
          </div>

          {answer.imageUrl && (
            <div className="mt-2">
              <img
                src={answer.imageUrl}
                alt={`Answer ${index + 1}`}
                className="h-24 w-24 object-cover rounded border-2"
              />
            </div>
          )}
        </div>
      ))}

      <Button
        onClick={addAnswer}
        variant="outline"
        className="w-full border-dashed border-2"
      >
        + Add Another Option
      </Button>
    </div>
  );
}
```

---

### 5. ImagePasteZone.tsx (Clipboard Support)

```typescript
import { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ImagePasteZoneProps {
  onImageUploaded: (url: string) => void;
}

export function ImagePasteZone({ onImageUploaded }: ImagePasteZoneProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const uploadImage = async (file: File) => {
    setIsUploading(true);
    try {
      const filename = `${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage
        .from('manual-assessment-images')
        .upload(filename, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('manual-assessment-images')
        .getPublicUrl(data.path);

      setPreviewUrl(publicUrl);
      onImageUploaded(publicUrl);

      toast({
        title: 'Image uploaded!',
        description: 'Your image has been added.'
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload failed',
        description: 'Could not upload image. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (let item of items) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) {
          await uploadImage(file);
        }
      }
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadImage(file);
    }
  };

  return (
    <Card
      className="border-2 border-dashed p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
      onPaste={handlePaste}
      onClick={() => inputRef.current?.click()}
    >
      {previewUrl ? (
        <img src={previewUrl} alt="Preview" className="max-h-48 mx-auto" />
      ) : (
        <div>
          <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-lg font-medium mb-2">
            📋 Paste image from clipboard (Ctrl+V)
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            or drag & drop here
          </p>
          <Button variant="outline" disabled={isUploading}>
            {isUploading ? 'Uploading...' : 'Browse Files'}
          </Button>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />
    </Card>
  );
}
```

---

### 6. ManualAssessmentView.tsx (Student View)

```typescript
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import CoquiMascot from '@/components/CoquiMascot';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useRealtimeVoice } from '@/hooks/useRealtimeVoice';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export default function ManualAssessmentView() {
  const { id } = useParams();
  const { user } = useAuth();
  const [assessment, setAssessment] = useState<any>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const { connect, sendText, isConnected } = useRealtimeVoice({
    studentId: user?.id || '',
    language: assessment?.settings.language === 'es' ? 'es-PR' : 'en-US',
    onTranscription: (text, isUser) => {
      console.log('Voice:', text);
    }
  });

  useEffect(() => {
    // Fetch assessment
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

  useEffect(() => {
    // Auto-connect voice and read question
    if (assessment && !isConnected) {
      connect().then(() => {
        // Read voice guidance first
        if (assessment.content.voiceGuidance) {
          sendText(assessment.content.voiceGuidance);
        }
        // Then read the question
        setTimeout(() => {
          sendText(assessment.content.question);
        }, 2000);
      });
    }
  }, [assessment, isConnected]);

  const handleAnswer = (index: number) => {
    setSelectedAnswer(index);
    setShowFeedback(true);

    const isCorrect = assessment.content.answers[index].isCorrect;

    // Voice feedback
    if (isCorrect) {
      sendText(assessment.settings.language === 'es'
        ? '¡Excelente! Respuesta correcta.'
        : 'Excellent! Correct answer.');
    } else {
      sendText(assessment.settings.language === 'es'
        ? 'Inténtalo de nuevo. Piensa un poco más.'
        : 'Try again. Think a little more.');
    }
  };

  if (!assessment) return <div>Loading...</div>;

  const isCorrect = selectedAnswer !== null
    && assessment.content.answers[selectedAnswer]?.isCorrect;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E6F7FF] to-white">
      <Header />

      <main className="container mx-auto px-6 py-8">
        {/* Coquí Mascot */}
        <div className="flex justify-center mb-8">
          <CoquiMascot
            state={showFeedback ? (isCorrect ? 'celebration' : 'neutral') : 'speaking'}
            size="large"
          />
        </div>

        {/* Question */}
        <Card className="p-8 mb-8 bg-white shadow-lg max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-6 text-center">
            {assessment.content.question}
          </h2>

          {assessment.content.questionImage && (
            <img
              src={assessment.content.questionImage}
              alt="Question"
              className="max-h-64 mx-auto mb-6 rounded-lg"
            />
          )}
        </Card>

        {/* Answer Options */}
        <div className="space-y-4 max-w-4xl mx-auto">
          {assessment.content.answers.map((answer: any, index: number) => (
            <Button
              key={index}
              variant="outline"
              className={`w-full p-8 text-2xl justify-start ${
                showFeedback && index === selectedAnswer
                  ? isCorrect
                    ? 'bg-green-500/20 border-green-500 border-2'
                    : 'bg-red-500/20 border-red-500 border-2'
                  : ''
              }`}
              onClick={() => !showFeedback && handleAnswer(index)}
              disabled={showFeedback}
            >
              <span className="flex items-center gap-4 w-full">
                <span className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-bold">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="flex-1 text-left">{answer.text}</span>
                {answer.imageUrl && (
                  <img
                    src={answer.imageUrl}
                    alt={`Option ${index + 1}`}
                    className="h-16 w-16 object-cover rounded"
                  />
                )}
              </span>
            </Button>
          ))}
        </div>

        {/* Feedback */}
        {showFeedback && (
          <Card className={`p-6 mt-8 max-w-4xl mx-auto ${
            isCorrect ? 'bg-green-500/10' : 'bg-orange-500/10'
          }`}>
            <p className="text-3xl font-bold text-center">
              {isCorrect ? '¡Excelente! ⭐' : '¡Inténtalo de nuevo!'}
            </p>
          </Card>
        )}
      </main>
    </div>
  );
}
```

---

## Utility Hooks

### useManualAssessment.ts (Business Logic)

```typescript
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useManualAssessment() {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const saveAssessment = useCallback(async (data: any) => {
    setIsSaving(true);
    try {
      const { data: saved, error } = await supabase
        .from('manual_assessments')
        .insert([data])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Assessment saved!',
        description: 'Your assessment is ready for students.'
      });

      return saved;
    } catch (error) {
      console.error('Save error:', error);
      toast({
        title: 'Save failed',
        description: 'Could not save assessment. Please try again.',
        variant: 'destructive'
      });
      return null;
    } finally {
      setIsSaving(false);
    }
  }, [toast]);

  return { saveAssessment, isSaving };
}
```

---

## File Structure Summary

```
/src/pages/
├── ManualAssessmentCreate.tsx    # Main creation page
├── ManualAssessmentPreview.tsx   # Preview mode
└── ManualAssessmentView.tsx      # Student view

/src/components/ManualAssessment/
├── TypeSelector.tsx              # Step 1
├── SubtypeSelector.tsx           # Step 2
├── ContentEditorForm.tsx         # Step 3 (main form)
├── AnswerList.tsx                # Answer management
├── ImagePasteZone.tsx            # Clipboard paste
├── ImagePasteButton.tsx          # Small paste button
├── VoiceGuidanceInput.tsx        # Voice settings
└── SettingsPanel.tsx             # Grade/language/subject

/src/hooks/
└── useManualAssessment.ts        # Business logic
```

---

## Notes for Developers

1. **Reuse existing components**: Header, CoquiMascot, Card, Button, Input
2. **Copy styles from ReadingExercise.tsx**: Exact same gradients and spacing
3. **Voice integration**: Use `useRealtimeVoice` hook directly
4. **Image upload**: Use Supabase storage bucket `manual-assessment-images`
5. **Keep it simple**: Don't over-engineer, focus on core functionality
