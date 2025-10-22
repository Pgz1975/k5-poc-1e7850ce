import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { TypeSelector } from '@/components/ManualAssessment/TypeSelector';
import { SubtypeSelector } from '@/components/ManualAssessment/SubtypeSelector';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from '@/components/ui/select';
import { ArrowLeft, Save, Loader2, Info } from 'lucide-react';
import { AnswerList } from '@/components/ManualAssessment/AnswerList';
import { ImagePasteZone } from '@/components/ManualAssessment/ImagePasteZone';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { CoquiMascot } from '@/components/CoquiMascot';

interface AssessmentData {
  type: 'lesson' | 'exercise' | 'assessment';
  subtype: string;
  title: string;
  voice_guidance?: string;
  activity_template?: string;
  coqui_dialogue?: string;
  pronunciation_words?: string;
  max_attempts?: number;
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
    },
    max_attempts: 3
  });
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const isSpanish = language === 'es';

  // Bilingual template definitions
  const genericTemplates = [
    {
      id: 'coqui_escucha',
      name: isSpanish ? 'Coquí escucha y habla' : 'Coquí Listens and Speaks',
      description: isSpanish ? 'El estudiante escucha y repite con Coquí' : 'Student listens and repeats with Coquí'
    },
    {
      id: 'coqui_encuentra',
      name: isSpanish ? 'Coquí encuentra el sonido' : 'Coquí Finds the Sound',
      description: isSpanish ? 'Identificar sonidos específicos en palabras' : 'Identify specific sounds in words'
    },
    {
      id: 'coqui_une',
      name: isSpanish ? 'Coquí une los sonidos' : 'Coquí Connects Sounds',
      description: isSpanish ? 'Combinar sonidos para formar palabras' : 'Combine sounds to form words'
    },
    {
      id: 'rima_coqui',
      name: isSpanish ? 'Rima con Coquí' : 'Rhyme with Coquí',
      description: isSpanish ? 'Practicar rimas con palabras locales' : 'Practice rhyming with local words'
    },
    {
      id: 'vocales_coqui',
      name: isSpanish ? 'Las vocales de Coquí' : "Coquí's Vowels",
      description: isSpanish ? 'Aprender las cinco vocales' : 'Learn the five vowels'
    }
  ];

  const curriculumTemplates = [
    {
      id: 'conciencia_s',
      name: isSpanish ? 'Conciencia Fonémica - Sonido /s/' : 'Phonemic Awareness - /s/ Sound',
      description: isSpanish ? 'Práctica con el sonido inicial /s/' : 'Practice with initial /s/ sound'
    },
    {
      id: 'segmentacion',
      name: isSpanish ? 'Segmentación de Sílabas' : 'Syllable Segmentation',
      description: isSpanish ? 'Dividir palabras en sílabas' : 'Divide words into syllables'
    },
    {
      id: 'vocales_yunque',
      name: isSpanish ? 'Vocales del Yunque' : 'El Yunque Vowels',
      description: isSpanish ? 'Vocales con vocabulario del bosque tropical' : 'Vowels with rainforest vocabulary'
    },
    {
      id: 'rimas_tropicales',
      name: isSpanish ? 'Rimas Tropicales' : 'Tropical Rhymes',
      description: isSpanish ? 'Rimas con palabras de Puerto Rico' : 'Rhymes with Puerto Rican words'
    },
    {
      id: 'fluidez_pr',
      name: isSpanish ? 'Fluidez Lectora PR' : 'PR Reading Fluency',
      description: isSpanish ? 'Práctica de lectura fluida' : 'Fluent reading practice'
    },
    {
      id: 'profesiones_boricuas',
      name: isSpanish ? 'Profesiones Boricuas' : 'Puerto Rican Professions',
      description: isSpanish ? 'Vocabulario de profesiones locales' : 'Local professions vocabulary'
    },
    {
      id: 'ciclo_coqui',
      name: isSpanish ? 'Ciclo del Coquí' : "Coquí's Life Cycle",
      description: isSpanish ? 'Comprensión sobre el coquí' : 'Comprehension about the coquí'
    }
  ];

  const autoFillTemplate = (templateId: string) => {
    const templates: Record<string, any> = {
      'conciencia_s': {
        title: isSpanish ? 'Identificando el Sonido /s/ con Coquí' : 'Identifying the /s/ Sound with Coquí',
        coqui_dialogue: isSpanish
          ? `SECTION 1: ¡Hola! Soy Coquí del bosque de El Yunque. Hoy vamos a descubrir palabras que comienzan con el sonido /s/.\nSECTION 2: Escucha estas palabras de Puerto Rico: sol, sapo, serpiente. ¿Escuchas el sonido /s/ al principio?\nSECTION 3: Ahora repite después de mí: sss-sol, sss-sapo, sss-serpiente.\nSECTION 4: ¡Excelente! El sonido /s/ suena como una serpiente: ssssss.`
          : `SECTION 1: Hi! I'm Coquí from El Yunque rainforest. Today we'll discover words that start with the /s/ sound.\nSECTION 2: Listen to these Puerto Rican words: sun, sand, snake. Do you hear the /s/ sound at the beginning?\nSECTION 3: Now repeat after me: sss-sun, sss-sand, sss-snake.\nSECTION 4: Excellent! The /s/ sound sounds like a snake: ssssss.`,
        pronunciation_words: isSpanish ? 'sol\nsapo\nserpiente\nsilla\nsopa' : 'sun\nsand\nsnake\nsit\nsoup',
        voice_guidance: isSpanish ? 'Habla despacio y claramente. Enfatiza el sonido /s/. Celebra con "¡Wepa!" cuando lo hagan bien.' : 'Speak slowly and clearly. Emphasize the /s/ sound. Celebrate with "Great job!" when they do well.'
      },
      'vocales_yunque': {
        title: isSpanish ? 'Las Vocales en el Yunque con Coquí' : 'Vowels in El Yunque with Coquí',
        coqui_dialogue: isSpanish
          ? `SECTION 1: ¡Hola! Soy Coquí. En El Yunque hay cinco vocales mágicas: a, e, i, o, u.\nSECTION 2: La A está en árbol y agua. Repite: aaa-árbol.\nSECTION 3: La E está en estrella y El Yunque. Repite: eee-estrella.\nSECTION 4: ¡Qué bien conoces las vocales del bosque!`
          : `SECTION 1: Hi! I'm Coquí. In El Yunque there are five magical vowels: a, e, i, o, u.\nSECTION 2: The A is in apple and ant. Repeat: aaa-apple.\nSECTION 3: The E is in elephant and El Yunque. Repeat: eee-elephant.\nSECTION 4: You know the forest vowels so well!`,
        pronunciation_words: isSpanish ? 'árbol\nestrella\nisla\nola\nuva' : 'apple\nelephant\nisland\nocean\numbrella',
        voice_guidance: isSpanish ? 'Pronuncia cada vocal lentamente. Pausa 3 segundos entre vocales.' : 'Pronounce each vowel slowly. Pause 3 seconds between vowels.'
      },
      'rimas_tropicales': {
        title: isSpanish ? 'Rimas del Bosque Tropical con Coquí' : 'Tropical Forest Rhymes with Coquí',
        coqui_dialogue: isSpanish
          ? `SECTION 1: ¡Hola! Vamos a jugar con rimas del bosque tropical.\nSECTION 2: Escucha: caracol rima con sol. ¿Escuchas cómo terminan igual?\nSECTION 3: Ahora tú: ¿Qué rima con coquí? ¡Sí, aquí!`
          : `SECTION 1: Hi! Let's play with tropical forest rhymes.\nSECTION 2: Listen: snail rhymes with pail. Do you hear how they end the same?\nSECTION 3: Now you: What rhymes with tree? Yes, bee!`,
        pronunciation_words: isSpanish ? 'caracol\nsol\ncoquí\naquí\nmariposa\nrosa' : 'snail\npail\ntree\nbee\nbutterfly\nsky',
        voice_guidance: isSpanish ? 'Enfatiza las terminaciones que riman. Celebra cada rima correcta.' : 'Emphasize the rhyming endings. Celebrate each correct rhyme.'
      }
    };

    const template = templates[templateId];
    if (template) {
      setData(prev => ({
        ...prev,
        title: template.title,
        coqui_dialogue: template.coqui_dialogue,
        pronunciation_words: template.pronunciation_words,
        voice_guidance: template.voice_guidance
      }));
    }
  };

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
      const pronunciationArray = data.pronunciation_words
        ? data.pronunciation_words.split('\n').filter(w => w.trim())
        : [];

      const assessment = {
        type: data.type!,
        subtype: data.subtype!,
        title: data.title || data.content!.question.substring(0, 50),
        content: data.content!,
        voice_guidance: data.voice_guidance || null,
        activity_template: data.activity_template || null,
        coqui_dialogue: data.coqui_dialogue || null,
        pronunciation_words: pronunciationArray.length > 0 ? pronunciationArray : null,
        max_attempts: data.max_attempts || 3,
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

            {/* Template Selector */}
            <Card className="p-6 mb-6 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/10 relative">
              <div className="absolute top-4 right-4">
                <CoquiMascot size="small" state="happy" />
              </div>
              <h3 className="text-xl font-bold mb-4">
                🎯 {t("Plantilla de Actividad Coquí", "Coquí Activity Template")}
              </h3>
              <Select
                value={data.activity_template || ''}
                onValueChange={(value) => {
                  setData({ ...data, activity_template: value });
                  if (value !== 'none') {
                    autoFillTemplate(value);
                  }
                }}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder={isSpanish ? "Selecciona una plantilla..." : "Select a template..."} />
                </SelectTrigger>
                <SelectContent className="bg-background z-50">
                  <SelectItem value="none">
                    {isSpanish ? '(Vacío - Sin plantilla)' : '(Empty - No template)'}
                  </SelectItem>
                  <SelectGroup>
                    <SelectLabel>{isSpanish ? 'Plantillas Genéricas' : 'Generic Templates'}</SelectLabel>
                    {genericTemplates.map(t => (
                      <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                    ))}
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>{isSpanish ? 'Plantillas del Currículo' : 'Curriculum Templates'}</SelectLabel>
                    {curriculumTemplates.map(t => (
                      <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground mt-3 flex items-start gap-2">
                <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                {isSpanish 
                  ? '💡 Consejo: Usa palabras locales de Puerto Rico para mejor conexión cultural' 
                  : '💡 Tip: Use local Puerto Rican words for better cultural connection'}
              </p>
            </Card>

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

            {/* Coquí Dialogue */}
            <Card className="p-6 mb-6">
              <h3 className="text-xl font-bold mb-4">🐸 {t("Diálogo de Coquí (Secciones)", "Coquí's Dialogue (Sections)")}</h3>
              <p className="text-sm text-muted-foreground mb-3">
                {t(
                  "Separa el diálogo en secciones que corresponden con las respuestas",
                  "Separate dialogue into sections that correspond with answers"
                )}
              </p>
              <Textarea
                value={data.coqui_dialogue || ''}
                onChange={(e) => setData({ ...data, coqui_dialogue: e.target.value })}
                placeholder={isSpanish 
                  ? `SECTION 1: ¡Hola! Soy Coquí...\nSECTION 2: Ahora vamos a practicar...\nSECTION 3: ¡Muy bien! Lo hiciste excelente...`
                  : `SECTION 1: Hi! I'm Coquí...\nSECTION 2: Now let's practice...\nSECTION 3: Great job! You did excellent...`}
                className="min-h-[150px] font-mono"
              />
            </Card>

            {/* Pronunciation Words */}
            <Card className="p-6 mb-6">
              <h3 className="text-xl font-bold mb-4">🗣️ {t("Palabras para Practicar Pronunciación", "Words for Pronunciation Practice")}</h3>
              <p className="text-sm text-muted-foreground mb-3">
                {t("Escribe una palabra por línea", "Write one word per line")}
              </p>
              <Textarea
                value={data.pronunciation_words || ''}
                onChange={(e) => setData({ ...data, pronunciation_words: e.target.value })}
                placeholder={isSpanish
                  ? `sol\nsapo\nserpiente\n(una palabra por línea)`
                  : `sun\nfrog\nsnake\n(one word per line)`}
                className="min-h-[100px]"
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
