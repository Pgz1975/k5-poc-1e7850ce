import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Header } from '@/components/Header';
import { TypeSelector } from '@/components/ManualAssessment/TypeSelector';
import { SubtypeSelector } from '@/components/ManualAssessment/SubtypeSelector';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from '@/components/ui/select';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { AnswerList } from '@/components/ManualAssessment/AnswerList';
import { ImagePasteZone } from '@/components/ManualAssessment/ImagePasteZone';
import { MultipleChoiceEditor } from '@/components/ManualAssessment/editors/MultipleChoiceEditor';
import { TrueFalseEditor } from '@/components/ManualAssessment/editors/TrueFalseEditor';
import { FillBlankEditor } from '@/components/ManualAssessment/editors/FillBlankEditor';
import { WriteAnswerEditor } from '@/components/ManualAssessment/editors/WriteAnswerEditor';
import { DragDropEditor } from '@/components/ManualAssessment/editors/DragDropEditor';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { CoquiMascot } from '@/components/CoquiMascot';

interface AssessmentData {
  type: 'lesson' | 'exercise' | 'assessment';
  subtype: string;
  title: string;
  language?: 'es' | 'en';
  voice_guidance?: string;
  activity_template?: string;
  coqui_dialogue?: string;
  pronunciation_words?: string;
  parent_lesson_id?: string; // NEW: Link exercises to lessons
  max_attempts?: number;
  content?: any; // Flexible content structure for different exercise types
  settings: {
    gradeLevel: number;
    language: 'es' | 'en';
    subject: string;
  };
}


interface CreateAssessmentProps {
  editId?: string;
  isModal?: boolean;
  onSaveSuccess?: () => void;
}

export default function CreateAssessment({ 
  editId: propEditId, 
  isModal = false,
  onSaveSuccess 
}: CreateAssessmentProps = {}) {
  const [searchParams] = useSearchParams();
  const editId = propEditId || searchParams.get('edit');
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
        { text: '', imageUrl: null, isCorrect: false },
        { text: '', imageUrl: null, isCorrect: false }
      ]
    },
    max_attempts: 3
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const isSpanish = language === 'es';

  // Load existing assessment if editing
  useEffect(() => {
    const loadAssessment = async () => {
      if (!editId || !user) return;
      
      setIsLoading(true);
      try {
        const { data: assessment, error } = await supabase
          .from('manual_assessments')
          .select('*')
          .eq('id', editId)
          // DEBUG MODE: No created_by filter - allow editing any activity
          .single();

        if (error) throw error;

        if (assessment) {
          setData({
            type: assessment.type as 'lesson' | 'exercise' | 'assessment',
            subtype: assessment.subtype,
            title: assessment.title,
            voice_guidance: assessment.voice_guidance || '',
            activity_template: assessment.activity_template || '',
            coqui_dialogue: assessment.coqui_dialogue || '',
            pronunciation_words: assessment.pronunciation_words?.join('\n') || '',
            parent_lesson_id: assessment.parent_lesson_id || undefined,
            max_attempts: assessment.max_attempts || 3,
            content: assessment.content as {
              question: string;
              questionImage?: string;
              answers: Array<{
                text: string;
                imageUrl: string | null;
                isCorrect: boolean;
              }>;
            },
            settings: {
              gradeLevel: assessment.grade_level,
              language: (assessment.language === 'es-PR' ? 'es' : assessment.language) as 'es' | 'en',
              subject: assessment.subject_area
            }
          });
          setStep('content'); // Skip to content step when editing
        }
      } catch (error: any) {
        console.error('Error loading assessment:', error);
        toast({
          title: "Error",
          description: "Failed to load assessment for editing",
          variant: "destructive"
        });
        navigate('/admin-dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    loadAssessment();
  }, [editId, user, navigate, toast]);

  // Fetch teacher's lessons for linking exercises
  const { data: teacherLessons } = useQuery({
    queryKey: ['teacher-lessons', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('manual_assessments')
        .select('id, title, grade_level, language')
        .eq('type', 'lesson')
        .eq('created_by', user?.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user && data.type === 'exercise'
  });

  // Template definitions from line 70-249

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

  // All template content

  const autoFillTemplate = (templateId: string) => {
    if (!templateId || templateId === 'none') {
      setData(prev => ({
        ...prev,
        title: '',
        coqui_dialogue: '',
        pronunciation_words: '',
        voice_guidance: '',
        activity_template: ''
      }));
      return;
    }

    const templates: Record<string, any> = {
      // ========== GENERIC TEMPLATES ==========
      'coqui_escucha': {
        title: isSpanish ? 'Escucha y Repite con Coquí' : 'Listen and Repeat with Coquí',
        coqui_dialogue: isSpanish
          ? `SECTION 1: ¡Hola! Soy Coquí. Hoy vamos a practicar escuchando y repitiendo palabras bonitas de Puerto Rico.\nSECTION 2: Escucha con atención. Voy a decir una palabra y tú la repites después de mí.\nSECTION 3: ¡Perfecto! Tu voz suena muy bien. Sigamos practicando.\nSECTION 4: ¡Wepa! Lo estás haciendo chévere. Eres un campeón del español.`
          : `SECTION 1: Hi! I'm Coquí. Today we'll practice listening and repeating beautiful Puerto Rican words.\nSECTION 2: Listen carefully. I'll say a word and you repeat it after me.\nSECTION 3: Perfect! Your voice sounds great. Let's keep practicing.\nSECTION 4: Great job! You're doing awesome. You're a Spanish champion.`,
        pronunciation_words: isSpanish ? 'playa\nmangó\npalma\ncoquí\nborinquen' : 'beach\nmango\npalm\ncoqui\nborinquen',
        voice_guidance: isSpanish ? 'Habla con entusiasmo. Pausa 2 segundos después de cada palabra. Celebra cada intento.' : 'Speak with enthusiasm. Pause 2 seconds after each word. Celebrate each attempt.'
      },
      'coqui_encuentra': {
        title: isSpanish ? 'Encuentra el Sonido con Coquí' : 'Find the Sound with Coquí',
        coqui_dialogue: isSpanish
          ? `SECTION 1: ¡Hola! Soy Coquí. Hoy vamos a ser detectives de sonidos.\nSECTION 2: Te voy a decir una palabra. Escucha bien el primer sonido.\nSECTION 3: ¿Lo escuchaste? Repite solo ese sonido inicial.\nSECTION 4: ¡Qué buen oído tienes! Eres un detective de sonidos increíble.`
          : `SECTION 1: Hi! I'm Coquí. Today we're going to be sound detectives.\nSECTION 2: I'll say a word. Listen carefully to the first sound.\nSECTION 3: Did you hear it? Repeat just that beginning sound.\nSECTION 4: What good ears you have! You're an amazing sound detective.`,
        pronunciation_words: isSpanish ? 'mamá\nmono\nmesa\nmariposa\nmar' : 'mom\nmonkey\nmoon\nmusic\nmountain',
        voice_guidance: isSpanish ? 'Enfatiza el sonido inicial. Separa claramente cada fonema.' : 'Emphasize the initial sound. Clearly separate each phoneme.'
      },
      'coqui_une': {
        title: isSpanish ? 'Une los Sonidos con Coquí' : 'Connect Sounds with Coquí',
        coqui_dialogue: isSpanish
          ? `SECTION 1: ¡Hola! Soy Coquí. Hoy vamos a unir sonidos como piezas de un rompecabezas.\nSECTION 2: Te voy a decir los sonidos separados: m-a-r. Ahora júntalos.\nSECTION 3: ¡Sí! Mar. Los uniste perfecto. ¿Listo para más?\nSECTION 4: ¡Eres un maestro uniendo sonidos! Qué talento tienes.`
          : `SECTION 1: Hi! I'm Coquí. Today we'll connect sounds like puzzle pieces.\nSECTION 2: I'll say the separate sounds: s-u-n. Now put them together.\nSECTION 3: Yes! Sun. You connected them perfectly. Ready for more?\nSECTION 4: You're a master at connecting sounds! What talent you have.`,
        pronunciation_words: isSpanish ? 'sol\npan\nmar\nluz\nvoz' : 'sun\ncat\ndog\nbed\ntop',
        voice_guidance: isSpanish ? 'Di cada sonido separado, luego junto. Pausa entre intentos.' : 'Say each sound separately, then together. Pause between attempts.'
      },
      'rima_coqui': {
        title: isSpanish ? 'Rimas Divertidas con Coquí' : 'Fun Rhymes with Coquí',
        coqui_dialogue: isSpanish
          ? `SECTION 1: ¡Hola! Soy Coquí y me encantan las rimas. Suenan como música.\nSECTION 2: Escucha: gato rima con pato. Terminan igual: -ato.\nSECTION 3: Ahora tú dime una palabra que rime con luna.\nSECTION 4: ¡Perfecto! Las rimas hacen que el español sea más divertido.`
          : `SECTION 1: Hi! I'm Coquí and I love rhymes. They sound like music.\nSECTION 2: Listen: cat rhymes with hat. They end the same: -at.\nSECTION 3: Now you tell me a word that rhymes with tree.\nSECTION 4: Perfect! Rhymes make language more fun.`,
        pronunciation_words: isSpanish ? 'gato\npato\nluna\ncuna\nflor\namor' : 'cat\nhat\ntree\nbee\nstar\ncar',
        voice_guidance: isSpanish ? 'Enfatiza las terminaciones. Celebra las rimas creativas.' : 'Emphasize the endings. Celebrate creative rhymes.'
      },
      'vocales_coqui': {
        title: isSpanish ? 'Las Cinco Vocales Mágicas de Coquí' : "Coquí's Five Magical Vowels",
        coqui_dialogue: isSpanish
          ? `SECTION 1: ¡Hola! Soy Coquí. Las vocales son mágicas: a, e, i, o, u.\nSECTION 2: La A es alegre como el agua. Di: aaa.\nSECTION 3: La E es especial como estrella. Di: eee.\nSECTION 4: ¡Conoces todas las vocales! Eres increíble.`
          : `SECTION 1: Hi! I'm Coquí. Vowels are magical: a, e, i, o, u.\nSECTION 2: A is awesome like apple. Say: aaa.\nSECTION 3: E is excellent like elephant. Say: eee.\nSECTION 4: You know all the vowels! You're amazing.`,
        pronunciation_words: isSpanish ? 'ave\noso\niglesia\nojo\nuva' : 'apple\negg\nigloo\nocean\numbrella',
        voice_guidance: isSpanish ? 'Exagera el sonido de cada vocal. Haz que sea divertido.' : 'Exaggerate each vowel sound. Make it fun.'
      },

      // ========== CURRICULUM TEMPLATES ==========
      'conciencia_s': {
        title: isSpanish ? 'Identificando el Sonido /s/ con Coquí' : 'Identifying the /s/ Sound with Coquí',
        coqui_dialogue: isSpanish
          ? `SECTION 1: ¡Hola! Soy Coquí del bosque de El Yunque. Hoy vamos a descubrir palabras que comienzan con el sonido /s/.\nSECTION 2: Escucha estas palabras de Puerto Rico: sol, sapo, serpiente. ¿Escuchas el sonido /s/ al principio?\nSECTION 3: Ahora repite después de mí: sss-sol, sss-sapo, sss-serpiente.\nSECTION 4: ¡Excelente! El sonido /s/ suena como una serpiente: ssssss.`
          : `SECTION 1: Hi! I'm Coquí from El Yunque rainforest. Today we'll discover words that start with the /s/ sound.\nSECTION 2: Listen to these Puerto Rican words: sun, sand, snake. Do you hear the /s/ sound at the beginning?\nSECTION 3: Now repeat after me: sss-sun, sss-sand, sss-snake.\nSECTION 4: Excellent! The /s/ sound sounds like a snake: ssssss.`,
        pronunciation_words: isSpanish ? 'sol\nsapo\nserpiente\nsilla\nsopa' : 'sun\nsand\nsnake\nsit\nsoup',
        voice_guidance: isSpanish ? 'Habla despacio y claramente. Enfatiza el sonido /s/. Celebra con "¡Wepa!" cuando lo hagan bien.' : 'Speak slowly and clearly. Emphasize the /s/ sound. Celebrate with "Great job!" when they do well.'
      },
      'segmentacion': {
        title: isSpanish ? 'Dividiendo Palabras en Sílabas con Coquí' : 'Dividing Words into Syllables with Coquí',
        coqui_dialogue: isSpanish
          ? `SECTION 1: ¡Hola! Soy Coquí. Las palabras son como trenes con vagones. Cada vagón es una sílaba.\nSECTION 2: Escucha: co-quí. Mi nombre tiene dos sílabas. Aplaude conmigo: co-quí.\nSECTION 3: Ahora tú. Divide esta palabra en sílabas: ma-ri-po-sa.\nSECTION 4: ¡Perfecto! Separaste todas las sílabas como un experto.`
          : `SECTION 1: Hi! I'm Coquí. Words are like trains with cars. Each car is a syllable.\nSECTION 2: Listen: co-qui. My name has two syllables. Clap with me: co-qui.\nSECTION 3: Now you. Divide this word into syllables: but-ter-fly.\nSECTION 4: Perfect! You separated all the syllables like an expert.`,
        pronunciation_words: isSpanish ? 'coquí\nmariposa\npalma\nborinquen\nplátano' : 'coqui\nbutterfly\nmango\nisland\nrainforest',
        voice_guidance: isSpanish ? 'Pausa claramente entre sílabas. Aplaude al ritmo de cada sílaba.' : 'Pause clearly between syllables. Clap to the rhythm of each syllable.'
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
      },
      'fluidez_pr': {
        title: isSpanish ? 'Lectura Fluida de Puerto Rico con Coquí' : 'Puerto Rico Fluent Reading with Coquí',
        coqui_dialogue: isSpanish
          ? `SECTION 1: ¡Hola! Soy Coquí. Hoy vamos a leer frases sobre nuestra bella isla.\nSECTION 2: Escucha primero: "El coquí canta en El Yunque." Ahora tú.\nSECTION 3: ¡Muy bien! Lee con ritmo, como si estuvieras contando un cuento.\nSECTION 4: ¡Wepa! Lees con tanta fluidez. Estoy orgulloso de ti.`
          : `SECTION 1: Hi! I'm Coquí. Today we'll read sentences about our beautiful island.\nSECTION 2: Listen first: "The coquí sings in El Yunque." Now you.\nSECTION 3: Very good! Read with rhythm, like you're telling a story.\nSECTION 4: Great! You read so fluently. I'm proud of you.`,
        pronunciation_words: isSpanish ? 'El Yunque\nSan Juan\nluquillo\nfajardo\nponce' : 'El Yunque\nSan Juan\nluquillo\nfajardo\nponce',
        voice_guidance: isSpanish ? 'Lee con expresión natural. Pausa en las comas. Celebra la fluidez.' : 'Read with natural expression. Pause at commas. Celebrate fluency.'
      },
      'profesiones_boricuas': {
        title: isSpanish ? 'Profesiones de Puerto Rico con Coquí' : 'Puerto Rican Professions with Coquí',
        coqui_dialogue: isSpanish
          ? `SECTION 1: ¡Hola! Soy Coquí. Hoy vamos a aprender sobre trabajos importantes en Puerto Rico.\nSECTION 2: Escucha: maestro, doctor, agricultor. ¿Cuál te gusta más?\nSECTION 3: Repite las profesiones después de mí. Imagina que eres cada uno.\nSECTION 4: ¡Excelente! Puedes ser lo que quieras cuando crezcas.`
          : `SECTION 1: Hi! I'm Coquí. Today we'll learn about important jobs in Puerto Rico.\nSECTION 2: Listen: teacher, doctor, farmer. Which do you like best?\nSECTION 3: Repeat the professions after me. Imagine you are each one.\nSECTION 4: Excellent! You can be anything you want when you grow up.`,
        pronunciation_words: isSpanish ? 'maestro\ndoctor\nagricultor\npescador\nbombero\nenfermera' : 'teacher\ndoctor\nfarmer\nfisherman\nfirefighter\nnurse',
        voice_guidance: isSpanish ? 'Pronuncia cada profesión con orgullo. Pausa para reflexionar.' : 'Pronounce each profession with pride. Pause to reflect.'
      },
      'ciclo_coqui': {
        title: isSpanish ? 'El Ciclo de Vida del Coquí' : "Coquí's Life Cycle",
        coqui_dialogue: isSpanish
          ? `SECTION 1: ¡Hola! Soy Coquí. ¿Quieres saber cómo nací? Te lo voy a contar.\nSECTION 2: Primero fui un huevo pequeñito en una hoja. Luego salí como coquicito.\nSECTION 3: Crecí y crecí hasta ser grande. Ahora canto: co-quí, co-quí.\nSECTION 4: ¡Entendiste mi historia! Ahora cuéntasela a alguien más.`
          : `SECTION 1: Hi! I'm Coquí. Want to know how I was born? I'll tell you.\nSECTION 2: First I was a tiny egg on a leaf. Then I came out as a baby coquí.\nSECTION 3: I grew and grew until I was big. Now I sing: co-qui, co-qui.\nSECTION 4: You understood my story! Now tell it to someone else.`,
        pronunciation_words: isSpanish ? 'huevo\ncoquicito\ncrecer\ncantar\nYunque' : 'egg\nbaby\ngrow\nsing\nYunque',
        voice_guidance: isSpanish ? 'Cuenta la historia con emoción. Varía el tono de voz.' : 'Tell the story with emotion. Vary your tone of voice.'
      }
    };

    const template = templates[templateId];
    if (template) {
      setData(prev => ({
        ...prev,
        title: template.title,
        coqui_dialogue: template.coqui_dialogue,
        pronunciation_words: template.pronunciation_words,
        voice_guidance: template.voice_guidance,
        activity_template: templateId
      }));
    }
  };

  // Handle lesson linking for exercises
  const handleLessonLink = (lessonId: string) => {
    if (!lessonId || lessonId === 'none') {
      setData(prev => ({
        ...prev,
        parent_lesson_id: undefined,
      }));
      return;
    }

    const lesson = teacherLessons?.find(l => l.id === lessonId);
    if (lesson) {
      setData(prev => ({
        ...prev,
        parent_lesson_id: lessonId,
        settings: {
          ...prev.settings!,
          gradeLevel: lesson.grade_level,
          language: lesson.language as 'es' | 'en',
        }
      }));
    }
  };

  // Type-specific validation
  const isValid = () => {
    // Allow image-only content - no text validation required
    
    if (data.type === 'lesson') {
      // LESSON: Only check that content object exists
      return data.content !== undefined;
    }
    
    if (data.type === 'exercise' || data.type === 'assessment') {
      // Fill blank: only check arrays exist
      if (data.subtype === 'fill_blank') {
        const hasLetters = data.content?.letters && data.content.letters.length > 0;
        return hasLetters;
      }
      
      // Write answer: allow empty if image provided
      if (data.subtype === 'write_answer') {
        return true; // Always valid, can be image-only
      }
      
      // Drag drop validation
      if (data.subtype === 'drag_drop') {
        // Letters mode: requires availableLetters
        if (data.content?.mode === 'letters') {
          const hasLetters = data.content?.availableLetters && data.content.availableLetters.length > 0;
          return hasLetters;
        }
        
        // Match mode: requires dropZones and draggableItems
        if (data.content?.mode === 'match') {
          const hasZones = data.content?.dropZones && data.content.dropZones.length >= 2;
          const hasItems = data.content?.draggableItems && data.content.draggableItems.length >= 1;
          return hasZones && hasItems;
        }
        
        return true;
      }
      
      // EXERCISE/ASSESSMENT: needs answers with at least one correct (text or image)
      const hasAnswers = data.content?.answers && data.content.answers.length >= 2;
      const hasCorrectAnswer = data.content?.answers?.some(a => a.isCorrect);
      return hasAnswers && hasCorrectAnswer;
    }
    
    return false;
  };

  // Type-specific save logic
  const handleSave = async (publishImmediately = false) => {
    if (!user || !isValid()) {
      toast({
        title: "Validation Error",
        description: data.type === 'lesson' 
          ? "Please fill in title, content, and voice guidance (required)"
          : "Please fill in all required fields correctly.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSaving(true);
    try {
    const payload: any = {
        type: data.type,
        subtype: data.subtype || (data.type === 'lesson' ? 'lesson' : 'multiple_choice'),
        title: data.title,
        content: data.content,
        grade_level: data.settings!.gradeLevel,
        language: data.settings!.language,
        subject_area: data.settings!.subject,
        created_by: user.id,
        status: publishImmediately ? 'published' : 'draft',
        published_at: publishImmediately ? new Date().toISOString() : null
      };
      
      // Type-specific fields
      if (data.type === 'lesson') {
        payload.voice_guidance = data.voice_guidance; // REQUIRED
        payload.coqui_dialogue = data.coqui_dialogue || null; // OPTIONAL
        payload.pronunciation_words = data.pronunciation_words 
          ? data.pronunciation_words.split('\n').filter(w => w.trim()) 
          : null; // OPTIONAL
        payload.activity_template = data.activity_template || null;
        payload.enable_voice = true;
        payload.voice_speed = 1.0;
        payload.auto_read_question = true;
      }
      
      if (data.type === 'exercise') {
        payload.parent_lesson_id = data.parent_lesson_id || null; // NEW
        payload.voice_guidance = data.voice_guidance || null;
        payload.coqui_dialogue = data.coqui_dialogue || null;
        payload.pronunciation_words = data.pronunciation_words 
          ? data.pronunciation_words.split('\n').filter(w => w.trim()) 
          : null;
        payload.max_attempts = data.max_attempts || 3;
        payload.enable_voice = true;
        payload.voice_speed = 1.0;
        payload.auto_read_question = true;

        // Drag-drop specific validation
        if (data.subtype === 'drag_drop' && data.content) {
          const content = data.content as any;
          if (content.mode === 'letters') {
            if (!content.targetWord?.trim()) {
              toast({
                title: "Validation Error",
                description: t('El campo "Palabra Objetivo" es requerido', 'Target Word is required'),
                variant: "destructive"
              });
              return;
            }
            if (!content.availableLetters || content.availableLetters.length === 0) {
              toast({
                title: "Validation Error",
                description: t('Debes añadir letras disponibles', 'You must add available letters'),
                variant: "destructive"
              });
              return;
            }
            const targetChars = [...content.targetWord.toLowerCase()];
            const hasAllLetters = targetChars.every(char => 
              content.availableLetters.includes(char.toLowerCase())
            );
            if (!hasAllLetters) {
              toast({
                title: "Validation Error",
                description: t(
                  'Las letras disponibles deben contener todas las letras de la palabra objetivo',
                  'Available letters must contain all letters from the target word'
                ),
                variant: "destructive"
              });
              return;
            }
          } else if (content.mode === 'match') {
            if (!content.dropZones || content.dropZones.length < 2) {
              toast({
                title: "Validation Error",
                description: t('Debes crear al menos 2 zonas de destino', 'You must create at least 2 drop zones'),
                variant: "destructive"
              });
              return;
            }
            if (!content.draggableItems || content.draggableItems.length < 2) {
              toast({
                title: "Validation Error",
                description: t('Debes crear al menos 2 elementos arrastrables', 'You must create at least 2 draggable items'),
                variant: "destructive"
              });
              return;
            }
            const allItemsHaveZone = content.draggableItems.every((item: any) => item.correctZone);
            if (!allItemsHaveZone) {
              toast({
                title: "Validation Error",
                description: t('Todos los elementos deben tener una zona correcta asignada', 'All items must have a correct zone assigned'),
                variant: "destructive"
              });
              return;
            }
          }
          // Save drag_drop_mode
          payload.drag_drop_mode = content.mode;
        }
      }
      
      if (data.type === 'assessment') {
        // No voice fields for assessments
        payload.max_attempts = data.max_attempts || 3;
      }
      
      let savedAssessment;
      
      if (editId) {
        // UPDATE existing assessment
        const { data: updated, error } = await supabase
          .from('manual_assessments')
          .update(payload)
          .eq('id', editId)
          .eq('created_by', user.id)
          .select()
          .single();
        
        if (error) throw error;
        savedAssessment = updated;
        
        toast({
          title: "Success!",
          description: `${data.type!.charAt(0).toUpperCase() + data.type!.slice(1)} updated successfully.`
        });
      } else {
        // INSERT new assessment
        const { data: inserted, error } = await supabase
          .from('manual_assessments')
          .insert(payload)
          .select()
          .single();
        
        if (error) throw error;
        savedAssessment = inserted;
        
        toast({
          title: "Success!",
          description: `${data.type!.charAt(0).toUpperCase() + data.type!.slice(1)} created successfully.`
        });
      }
      
      // Handle navigation based on modal mode
      if (onSaveSuccess) {
        onSaveSuccess(); // Close modal
      } else if (!isModal) {
        navigate(`/view-assessment/${savedAssessment.id}`);
      }
    } catch (error: any) {
      console.error('Save error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading assessment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate(editId ? '/admin-dashboard' : '/teacher-dashboard')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {isSpanish ? 'Volver' : 'Back'}
          </Button>
          <h1 className="text-3xl font-bold">
            {editId 
              ? (isSpanish ? 'Editar Contenido' : 'Edit Content')
              : (isSpanish ? 'Crear Nuevo Contenido' : 'Create New Content')
            }
          </h1>
          <div className="w-[100px]" />
        </div>

        {/* Step 1: Type Selection */}
        {step === 'type' && (
          <div className="space-y-6 animate-fade-in">
            <TypeSelector
              onSelect={(type) => {
                setData({ ...data, type, subtype: type === 'lesson' ? 'lesson' : undefined });
                // Lessons skip subtype step
                setStep(type === 'lesson' ? 'content' : 'subtype');
              }}
            />
          </div>
        )}

        {/* Step 2: Subtype Selection (only for exercise/assessment) */}
        {step === 'subtype' && data.type !== 'lesson' && (
          <div className="space-y-6 animate-fade-in">
            <SubtypeSelector
              type={data.type as 'exercise' | 'assessment'}
              onSelect={(subtype) => {
                setData({ ...data, subtype });
                setStep('content');
              }}
              onBack={() => setStep('type')}
            />
          </div>
        )}

        {/* Step 3: Content Creation - CONDITIONAL BY TYPE */}
        {step === 'content' && (
          <div className="space-y-6 animate-fade-in">
            
            {/* Settings Section - COMMON FOR ALL TYPES */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                {isSpanish ? 'Configuración' : 'Settings'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>{isSpanish ? 'Nivel de Grado *' : 'Grade Level *'}</Label>
                  <Select
                    value={String(data.settings?.gradeLevel)}
                    onValueChange={(value) => setData({
                      ...data,
                      settings: { ...data.settings!, gradeLevel: parseInt(value) }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">{isSpanish ? 'Kindergarten' : 'Kindergarten'}</SelectItem>
                      <SelectItem value="1">{isSpanish ? '1er Grado' : '1st Grade'}</SelectItem>
                      <SelectItem value="2">{isSpanish ? '2do Grado' : '2nd Grade'}</SelectItem>
                      <SelectItem value="3">{isSpanish ? '3er Grado' : '3rd Grade'}</SelectItem>
                      <SelectItem value="4">{isSpanish ? '4to Grado' : '4th Grade'}</SelectItem>
                      <SelectItem value="5">{isSpanish ? '5to Grado' : '5th Grade'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>{isSpanish ? 'Idioma *' : 'Language *'}</Label>
                  <Select
                    value={data.settings?.language}
                    onValueChange={(value: 'es' | 'en') => setData({
                      ...data,
                      settings: { ...data.settings!, language: value }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="es">{isSpanish ? 'Español' : 'Spanish'}</SelectItem>
                      <SelectItem value="en">{isSpanish ? 'Inglés' : 'English'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>{isSpanish ? 'Materia *' : 'Subject *'}</Label>
                  <Select
                    value={data.settings?.subject}
                    onValueChange={(value) => setData({
                      ...data,
                      settings: { ...data.settings!, subject: value }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="reading">{isSpanish ? 'Lectura' : 'Reading'}</SelectItem>
                      <SelectItem value="math">{isSpanish ? 'Matemáticas' : 'Math'}</SelectItem>
                      <SelectItem value="science">{isSpanish ? 'Ciencias' : 'Science'}</SelectItem>
                      <SelectItem value="social_studies">{isSpanish ? 'Estudios Sociales' : 'Social Studies'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>

            {/* ========== LESSON CREATION ========== */}
            {data.type === 'lesson' && (
              <>
                <div className="fixed top-20 right-4 z-50">
                  <CoquiMascot state="reading" size="small" />
                </div>
                
                {/* Template Selection - ONLY FOR LESSONS */}
                <Card className="p-6 bg-gradient-to-br from-blue-500/5 to-blue-600/10 border-blue-200">
                  <Label className="text-lg font-semibold mb-4 block">
                    {isSpanish ? 'Elige una Plantilla (Opcional)' : 'Choose a Template (Optional)'}
                  </Label>
                  <p className="text-sm text-muted-foreground mb-4">
                    {isSpanish 
                      ? 'Las plantillas te ayudan a crear lecciones estructuradas con guía de voz y práctica de pronunciación.'
                      : 'Templates help you create structured lessons with voice guidance and pronunciation practice.'}
                  </p>
                  <Select onValueChange={autoFillTemplate}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={isSpanish ? '-- Plantilla Vacía --' : '-- Empty Template --'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">{isSpanish ? '-- Plantilla Vacía --' : '-- Empty Template --'}</SelectItem>
                      
                      <SelectGroup>
                        <SelectLabel className="text-primary font-semibold">
                          {isSpanish ? 'Actividades Genéricas' : 'Generic Activities'}
                        </SelectLabel>
                        {genericTemplates.map((template) => (
                          <SelectItem key={template.id} value={template.id}>
                            <div className="flex flex-col">
                              <span className="font-medium">{template.name}</span>
                              <span className="text-xs text-muted-foreground">{template.description}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectGroup>
                      
                      <SelectGroup>
                        <SelectLabel className="text-secondary font-semibold">
                          {isSpanish ? 'Alineadas al Currículo' : 'Curriculum-Aligned'}
                        </SelectLabel>
                        {curriculumTemplates.map((template) => (
                          <SelectItem key={template.id} value={template.id}>
                            <div className="flex flex-col">
                              <span className="font-medium">{template.name}</span>
                              <span className="text-xs text-muted-foreground">{template.description}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Card>

                {/* Required Fields for Lessons */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    {isSpanish ? 'Detalles de la Lección' : 'Lesson Details'}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <Label>{isSpanish ? 'Título de la Lección *' : 'Lesson Title *'}</Label>
                      <Input
                        value={data.title || ''}
                        onChange={(e) => setData({ ...data, title: e.target.value })}
                        placeholder={isSpanish ? 'Ingrese el título de la lección' : 'Enter lesson title'}
                      />
                    </div>

                    <div>
                      <Label>{isSpanish ? 'Guía de Voz para IA * (Requerido)' : 'Voice Guidance for AI * (Required)'}</Label>
                      <p className="text-sm text-muted-foreground mb-2">
                        {isSpanish 
                          ? 'Instruye a la IA sobre cómo hablar e interactuar con los estudiantes'
                          : 'Instruct the AI how to speak and interact with students'}
                      </p>
                      <Textarea
                        value={data.voice_guidance || ''}
                        onChange={(e) => setData({ ...data, voice_guidance: e.target.value })}
                        placeholder={isSpanish 
                          ? 'ej., "Habla lento y claro. Enfatiza las sílabas. Celebra las respuestas correctas con entusiasmo."'
                          : 'e.g., "Speak slowly and clearly. Emphasize syllables. Celebrate correct answers with enthusiasm."'}
                        rows={3}
                        className="resize-none"
                      />
                    </div>

                    <div>
                      <Label>{isSpanish ? 'Contenido Principal de Enseñanza *' : 'Main Teaching Content *'}</Label>
                      <Textarea
                        value={data.content?.question || ''}
                        onChange={(e) => setData({
                          ...data,
                          content: { ...data.content!, question: e.target.value }
                        })}
                        placeholder={isSpanish ? 'Ingrese el contenido de la lección aquí...' : 'Enter the lesson content here...'}
                        rows={8}
                      />
                    </div>

                    <div>
                      <Label>{isSpanish ? 'Imagen de la Lección (Opcional)' : 'Lesson Image (Optional)'}</Label>
                      <p className="text-sm text-muted-foreground mb-2">
                        {isSpanish 
                          ? 'Sube o pega una imagen para acompañar la lección'
                          : 'Upload or paste an image to accompany the lesson'}
                      </p>
                      <ImagePasteZone
                        currentImage={data.content?.questionImage}
                        onImageUploaded={(url) => setData({
                          ...data,
                          content: { ...data.content!, questionImage: url }
                        })}
                      />
                    </div>
                  </div>
                </Card>

                {/* Optional Voice Fields for Lessons */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    {isSpanish ? 'Funciones de Voz Opcionales' : 'Optional Voice Features'}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <Label>{isSpanish ? "Diálogo de Coquí (Opcional)" : "Coquí's Dialogue (Optional)"}</Label>
                      <p className="text-sm text-muted-foreground mb-2">
                        {isSpanish ? 'Formato de 4 secciones para guía estructurada' : '4-section format for structured guidance'}
                      </p>
                      <Textarea
                        value={data.coqui_dialogue || ''}
                        onChange={(e) => setData({ ...data, coqui_dialogue: e.target.value })}
                        placeholder="SECTION 1: Introduction&#10;SECTION 2: Instruction&#10;SECTION 3: Practice&#10;SECTION 4: Celebration"
                        rows={8}
                      />
                    </div>

                    <div>
                      <Label>{isSpanish ? 'Palabras de Pronunciación (Opcional)' : 'Pronunciation Words (Optional)'}</Label>
                      <p className="text-sm text-muted-foreground mb-2">
                        {isSpanish ? 'Una palabra por línea para práctica de pronunciación' : 'One word per line for pronunciation practice'}
                      </p>
                      <Textarea
                        value={data.pronunciation_words || ''}
                        onChange={(e) => setData({ ...data, pronunciation_words: e.target.value })}
                        placeholder="word1&#10;word2&#10;word3"
                        rows={5}
                      />
                    </div>
                  </div>
                </Card>
              </>
            )}

            {/* ========== EXERCISE CREATION ========== */}
            {data.type === 'exercise' && (
              <>
                <div className="fixed top-20 right-4 z-50">
                  <CoquiMascot state="reading" size="small" />
                </div>
                
                {/* Link to Lesson - NEW */}
                <Card className="p-6 bg-gradient-to-br from-green-500/5 to-green-600/10 border-green-200">
                  <Label className="text-lg font-semibold mb-4 block">
                    {isSpanish ? 'Vincular a Lección (Opcional)' : 'Link to Lesson (Optional)'}
                  </Label>
                  <p className="text-sm text-muted-foreground mb-4">
                    {isSpanish ? 'Conecta este ejercicio a una lección existente' : 'Connect this exercise to an existing lesson'}
                  </p>
                  <Select
                    value={data.parent_lesson_id || 'none'}
                    onValueChange={handleLessonLink}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={isSpanish ? '-- Ejercicio Independiente --' : '-- Standalone Exercise --'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">{isSpanish ? '-- Ejercicio Independiente --' : '-- Standalone Exercise --'}</SelectItem>
                      {teacherLessons?.map((lesson) => (
                        <SelectItem key={lesson.id} value={lesson.id}>
                          {lesson.title} ({isSpanish ? 'Grado' : 'Grade'} {lesson.grade_level})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Card>

                {/* Exercise Fields */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    {isSpanish ? 'Detalles del Ejercicio' : 'Exercise Details'}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <Label>{isSpanish ? 'Título del Ejercicio *' : 'Exercise Title *'}</Label>
                      <Input
                        value={data.title || ''}
                        onChange={(e) => setData({ ...data, title: e.target.value })}
                        placeholder={isSpanish ? 'Ingrese el título del ejercicio' : 'Enter exercise title'}
                      />
                    </div>

                    {/* Type-Specific Editors */}
                    {data.subtype === 'fill_blank' ? (
                      <FillBlankEditor
                        content={data.content?.mode === 'single_word' ? data.content : { 
                          mode: 'single_word', 
                          prompt: data.content?.question || '', 
                          target: '', 
                          letters: [], 
                          autoShuffle: true 
                        }}
                        onChange={(content: any) => setData({ ...data, content })}
                        language={(data.settings?.language || 'es') as 'es' | 'en'}
                      />
                    ) : data.subtype === 'write_answer' ? (
                      <WriteAnswerEditor
                        content={data.content?.correctAnswer ? data.content : {
                          question: data.content?.question || '',
                          correctAnswer: '',
                          caseSensitive: false
                        }}
                        onChange={(content: any) => setData({ ...data, content })}
                        language={(data.settings?.language || 'es') as 'es' | 'en'}
                      />
                    ) : data.subtype === 'drag_drop' ? (
                      <DragDropEditor
                        content={data.content?.mode ? data.content : {
                          mode: 'letters',
                          question: data.content?.question || '',
                          targetWord: '',
                          availableLetters: [],
                          autoShuffle: true
                        }}
                        onChange={(content: any) => setData({ ...data, content })}
                        language={(data.settings?.language || 'es') as 'es' | 'en'}
                      />
                    ) : data.subtype === 'multiple_choice' || data.subtype === 'true_false' ? (
                      <>
                        <div>
                          <Label>{isSpanish ? 'Pregunta *' : 'Question *'}</Label>
                          <Textarea
                            value={data.content?.question || ''}
                            onChange={(e) => setData({
                              ...data,
                              content: { ...data.content!, question: e.target.value }
                            })}
                            placeholder={isSpanish ? 'Ingrese la pregunta' : 'Enter the question'}
                            rows={4}
                          />
                        </div>

                        <ImagePasteZone
                          onImageUploaded={(imageUrl) => {
                            setData({
                              ...data,
                              content: { ...data.content!, questionImage: imageUrl }
                            });
                          }}
                          currentImage={data.content?.questionImage}
                        />

                        {data.subtype === 'multiple_choice' ? (
                          <MultipleChoiceEditor
                            content={data.content || { question: '', answers: [] }}
                            onChange={(content: any) => setData({ ...data, content })}
                          />
                        ) : (
                          <TrueFalseEditor
                            content={data.content || { question: '', answers: [] }}
                            onChange={(content: any) => setData({ ...data, content })}
                          />
                        )}
                      </>
                    ) : null}
                  </div>
                </Card>

                {/* Optional Voice Features for Exercises */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    {isSpanish ? 'Funciones de Voz (Opcional)' : 'Voice Features (Optional)'}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <Label>{isSpanish ? 'Guía de Voz (Opcional)' : 'Voice Guidance (Optional)'}</Label>
                      <Textarea
                        value={data.voice_guidance || ''}
                        onChange={(e) => setData({ ...data, voice_guidance: e.target.value })}
                        placeholder={isSpanish ? 'ej., "Lee lento y enfatiza palabras clave"' : 'e.g., "Read slowly and emphasize key words"'}
                        rows={2}
                      />
                    </div>

                    <div>
                      <Label>{isSpanish ? 'Diálogo de Coquí (Opcional)' : 'Coquí Dialogue (Optional)'}</Label>
                      <Textarea
                        value={data.coqui_dialogue || ''}
                        onChange={(e) => setData({ ...data, coqui_dialogue: e.target.value })}
                        placeholder={isSpanish ? 'Diálogo opcional para este ejercicio' : 'Optional dialogue for this exercise'}
                        rows={4}
                      />
                    </div>

                    <div>
                      <Label>{isSpanish ? 'Palabras de Pronunciación (Opcional)' : 'Pronunciation Words (Optional)'}</Label>
                      <Textarea
                        value={data.pronunciation_words || ''}
                        onChange={(e) => setData({ ...data, pronunciation_words: e.target.value })}
                        placeholder="word1&#10;word2"
                        rows={3}
                      />
                    </div>
                  </div>
                </Card>
              </>
            )}

            {/* ========== ASSESSMENT CREATION ========== */}
            {data.type === 'assessment' && (
              <>
                {/* NO Coquí for assessments */}
                
                <Card className="p-6 bg-gradient-to-br from-purple-500/5 to-purple-600/10 border-purple-200">
                  <h3 className="text-lg font-semibold mb-4">
                    {isSpanish ? 'Detalles de la Evaluación' : 'Assessment Details'}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {isSpanish ? 'Crea una evaluación formal con preguntas y respuestas' : 'Create a formal evaluation with questions and answers'}
                  </p>
                  <div className="space-y-4">
                    <div>
                      <Label>{isSpanish ? 'Título de la Evaluación *' : 'Assessment Title *'}</Label>
                      <Input
                        value={data.title || ''}
                        onChange={(e) => setData({ ...data, title: e.target.value })}
                        placeholder={isSpanish ? 'Ingrese el título de la evaluación' : 'Enter assessment title'}
                      />
                    </div>

                    <div>
                      <Label>{isSpanish ? 'Pregunta *' : 'Question *'}</Label>
                      <Textarea
                        value={data.content?.question || ''}
                        onChange={(e) => setData({
                          ...data,
                          content: { ...data.content!, question: e.target.value }
                        })}
                        placeholder={isSpanish ? 'Ingrese la pregunta de evaluación' : 'Enter the assessment question'}
                        rows={4}
                      />
                    </div>

                    <ImagePasteZone
                      onImageUploaded={(imageUrl) => {
                        setData({
                          ...data,
                          content: { ...data.content!, questionImage: imageUrl }
                        });
                      }}
                      currentImage={data.content?.questionImage}
                    />

                    {data.subtype === 'multiple_choice' ? (
                      <MultipleChoiceEditor
                        content={data.content || { question: '', answers: [] }}
                        onChange={(content: any) => setData({ ...data, content })}
                      />
                    ) : data.subtype === 'true_false' ? (
                      <TrueFalseEditor
                        content={data.content || { question: '', answers: [] }}
                        onChange={(content: any) => setData({ ...data, content })}
                      />
                    ) : (
                      <div>
                        <Label>{isSpanish ? 'Respuestas *' : 'Answers *'}</Label>
                        <AnswerList
                          answers={data.content?.answers || []}
                          onChange={(answers) => setData({
                            ...data,
                            content: { ...data.content!, answers }
                          })}
                        />
                      </div>
                    )}
                  </div>
                </Card>
              </>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button variant="outline" onClick={() => setStep(data.type === 'lesson' ? 'type' : 'subtype')}>
                {isSpanish ? 'Atrás' : 'Back'}
              </Button>
              <Button 
                onClick={() => handleSave(false)} 
                disabled={!isValid() || isSaving}
                variant="outline"
                className="flex-1"
              >
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSaving ? (isSpanish ? 'Guardando...' : 'Saving...') : (editId ? (isSpanish ? 'Actualizar' : 'Update') : (isSpanish ? 'Guardar como Borrador' : 'Save as Draft'))}
              </Button>
              <Button 
                onClick={() => handleSave(true)} 
                disabled={!isValid() || isSaving}
                className="flex-1"
              >
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSaving ? (isSpanish ? 'Publicando...' : 'Publishing...') : (editId ? (isSpanish ? 'Actualizar y Publicar' : 'Update & Publish') : (isSpanish ? 'Guardar y Publicar' : 'Save & Publish'))}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
