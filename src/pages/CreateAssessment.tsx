import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { TypeSelector } from '@/components/ManualAssessment/TypeSelector';
import { SubtypeSelector } from '@/components/ManualAssessment/SubtypeSelector';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { AnswerList } from '@/components/ManualAssessment/AnswerList';
import { ImagePasteZone } from '@/components/ManualAssessment/ImagePasteZone';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

interface AssessmentData {
  type: 'lesson' | 'exercise' | 'assessment';
  subtype: string;
  title: string;
  voice_guidance?: string;
  content: {
    question: string;
    questionImage?: string;
    answers: Array<{
      text: string;
      imageUrl: string | null;
      isCorrect: boolean;
    }>;
  };
  settings: {
    gradeLevel: number;
    language: 'es' | 'en';
    subject: string;
  };
}

export default function CreateAssessment() {
  const [step, setStep] = useState<'type' | 'subtype' | 'content'>('type');
  const [data, setData] = useState<Partial<AssessmentData>>({
    settings: {
      gradeLevel: 1,
      language: 'es',
      subject: 'reading'
    },
    content: {
      question: '',
      answers: [
        { text: '', imageUrl: null, isCorrect: false },
        { text: '', imageUrl: null, isCorrect: false }
      ]
    }
  });
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();

  const isValid = () => {
    return (
      data.content?.question && data.content.question.length > 10 &&
      data.content?.answers && data.content.answers.length >= 2 &&
      data.content.answers.some(a => a.isCorrect && a.text.trim())
    );
  };

  const handleSave = async () => {
    if (!user || !isValid()) return;

    setIsSaving(true);
    try {
      const assessment = {
        type: data.type!,
        subtype: data.subtype!,
        title: data.title || data.content!.question.substring(0, 50),
        content: data.content!,
        voice_guidance: data.voice_guidance || null,
        grade_level: data.settings!.gradeLevel,
        language: data.settings!.language,
        subject_area: data.settings!.subject,
        created_by: user.id,
        status: 'published'
      };

      const { data: saved, error } = await supabase
        .from('manual_assessments')
        .insert([assessment])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: t("¡Guardado!", "Saved!"),
        description: t("Tu ejercicio está listo.", "Your exercise is ready.")
      });

      navigate(`/assessment/${saved.id}`);
    } catch (error: any) {
      console.error('Save error:', error);
      toast({
        title: t("Error al guardar", "Save failed"),
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent/20 to-background">
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

        {step === 'subtype' && data.type && (
          <SubtypeSelector
            type={data.type}
            onSelect={(subtype) => {
              setData({ ...data, subtype });
              setStep('content');
            }}
            onBack={() => setStep('type')}
          />
        )}

        {step === 'content' && (
          <div className="max-w-4xl mx-auto">
            <Button onClick={() => setStep('subtype')} variant="ghost" className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("Atrás", "Back")}
            </Button>

            {/* Settings */}
            <Card className="p-6 mb-6">
              <h3 className="text-xl font-bold mb-4">⚙️ {t("Configuración", "Settings")}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    {t("Grado", "Grade Level")}
                  </label>
                  <Select
                    value={data.settings?.gradeLevel.toString()}
                    onValueChange={(v) => setData({
                      ...data,
                      settings: { ...data.settings!, gradeLevel: parseInt(v) }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Kinder</SelectItem>
                      <SelectItem value="1">1er Grado</SelectItem>
                      <SelectItem value="2">2do Grado</SelectItem>
                      <SelectItem value="3">3er Grado</SelectItem>
                      <SelectItem value="4">4to Grado</SelectItem>
                      <SelectItem value="5">5to Grado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    {t("Idioma", "Language")}
                  </label>
                  <Select
                    value={data.settings?.language}
                    onValueChange={(v: 'es' | 'en') => setData({
                      ...data,
                      settings: { ...data.settings!, language: v }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    {t("Materia", "Subject")}
                  </label>
                  <Select
                    value={data.settings?.subject}
                    onValueChange={(v) => setData({
                      ...data,
                      settings: { ...data.settings!, subject: v }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="reading">{t("Lectura", "Reading")}</SelectItem>
                      <SelectItem value="math">{t("Matemáticas", "Math")}</SelectItem>
                      <SelectItem value="science">{t("Ciencias", "Science")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>

            {/* Title */}
            <Card className="p-6 mb-6">
              <h3 className="text-xl font-bold mb-4">📝 {t("Título (opcional)", "Title (optional)")}</h3>
              <Input
                value={data.title || ''}
                onChange={(e) => setData({ ...data, title: e.target.value })}
                placeholder={t("Ej: Identificar Vocales", "e.g. Identify Vowels")}
                className="text-xl"
              />
            </Card>

            {/* Speech Instructions */}
            <Card className="p-6 mb-6">
              <h3 className="text-xl font-bold mb-4">🎙️ {t("Instrucciones para el Sistema de Voz", "Speech System Instructions")}</h3>
              <p className="text-sm text-muted-foreground mb-3">
                {t(
                  "Escribe instrucciones especiales que el asistente de voz debe seguir al leer este contenido (opcional).",
                  "Write special instructions for the voice assistant when reading this content (optional)."
                )}
              </p>
              <Textarea
                value={data.voice_guidance || ''}
                onChange={(e) => setData({
                  ...data,
                  voice_guidance: e.target.value
                })}
                placeholder={t(
                  "Ej: Lee la pregunta lentamente y repite las opciones dos veces",
                  "e.g. Read the question slowly and repeat options twice"
                )}
                className="min-h-24"
              />
            </Card>

            {/* Question */}
            <Card className="p-6 mb-6">
              <h3 className="text-xl font-bold mb-4">📝 {t("Pregunta o Instrucción", "Question or Instruction")}</h3>
              <Textarea
                value={data.content?.question || ''}
                onChange={(e) => setData({
                  ...data,
                  content: { ...data.content!, question: e.target.value }
                })}
                placeholder={t("Escribe tu pregunta aquí...", "Enter your question here...")}
                className="text-2xl min-h-32"
              />
            </Card>

            {/* Question Image */}
            <Card className="p-6 mb-6">
              <h3 className="text-xl font-bold mb-4">🎨 {t("Añadir Imagen (Opcional)", "Add Question Image (Optional)")}</h3>
              <ImagePasteZone
                currentImage={data.content?.questionImage}
                onImageUploaded={(url) => setData({
                  ...data,
                  content: { ...data.content!, questionImage: url }
                })}
              />
            </Card>

            {/* Answers */}
            <Card className="p-6 mb-6">
              <h3 className="text-xl font-bold mb-4">✅ {t("Opciones de Respuesta", "Answer Options")}</h3>
              <AnswerList
                answers={data.content?.answers || []}
                onChange={(answers) => setData({
                  ...data,
                  content: { ...data.content!, answers }
                })}
              />
            </Card>


            {/* Save */}
            <Button
              size="lg"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white"
              onClick={handleSave}
              disabled={!isValid() || isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  {t("Guardando...", "Saving...")}
                </>
              ) : (
                <>
                  <Save className="mr-2 h-5 w-5" />
                  {t("✅ Guardar Ejercicio", "✅ Save Exercise")}
                </>
              )}
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
