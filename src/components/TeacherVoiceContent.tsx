import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Volume2, Save, Sparkles } from 'lucide-react';

interface VoiceTemplate {
  id: string;
  label: string;
  content: string;
  activityType: string;
}

const VOICE_TEMPLATES: VoiceTemplate[] = [
  {
    id: 'vowel_practice',
    label: 'Práctica de Vocales',
    content: 'Hola nene, vamos a practicar los sonidos de las vocales. Escucha bien y repite después de mí. ¡Tú puedes!',
    activityType: 'phonics',
  },
  {
    id: 'reading_intro',
    label: 'Introducción a Lectura',
    content: '¡Qué chévere que estés aquí! Hoy vamos a leer juntos. No te preocupes si te equivocas, así aprendemos.',
    activityType: 'reading',
  },
  {
    id: 'sound_game',
    label: 'Juego de Sonidos',
    content: 'Vamos a jugar con los sonidos. Te voy a decir una palabra y tú me dices qué sonido escuchas al principio. ¿Listo?',
    activityType: 'phonics',
  },
  {
    id: 'comprehension',
    label: 'Comprensión de Lectura',
    content: 'Leíste muy bien. Ahora vamos a hablar sobre lo que leímos. ¿Qué fue lo que más te gustó del cuento?',
    activityType: 'comprehension',
  },
];

const QUICK_COMMANDS = [
  { label: 'Pausa (2 seg)', value: '[PAUSA 2s]' },
  { label: 'Celebración', value: '¡Wepa! ¡Qué chévere!' },
  { label: 'Ánimo', value: 'Casi lo tienes, vamos a intentarlo otra vez' },
  { label: 'Más lento', value: '[HABLAR MÁS LENTO]' },
];

interface TeacherVoiceContentProps {
  assessmentId?: string;
  onSave?: (content: string) => void;
}

export default function TeacherVoiceContent({ assessmentId, onSave }: TeacherVoiceContentProps) {
  const [voiceContent, setVoiceContent] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const { toast } = useToast();

  const handleTemplateSelect = (templateId: string) => {
    const template = VOICE_TEMPLATES.find(t => t.id === templateId);
    if (template) {
      setVoiceContent(template.content);
      setSelectedTemplate(templateId);
    }
  };

  const insertQuickCommand = (command: string) => {
    setVoiceContent(prev => prev + (prev ? '\n' : '') + command);
  };

  const handlePreview = () => {
    setIsPreviewing(true);
    // Preview would use text-to-speech API (future enhancement)
    toast({
      title: "Vista Previa",
      description: "La función de vista previa estará disponible próximamente",
    });
    setTimeout(() => setIsPreviewing(false), 1000);
  };

  const handleSave = async () => {
    if (!voiceContent.trim()) {
      toast({
        title: "Error",
        description: "Por favor ingresa contenido de voz",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      if (assessmentId) {
        // Update assessment with voice guidance
        const { error } = await supabase
          .from('manual_assessments')
          .update({ voice_guidance: voiceContent })
          .eq('id', assessmentId);

        if (error) throw error;
      } else {
        // Save to voice guidance library
        const { error } = await supabase
          .from('voice_guidance_library')
          .insert({
            content: voiceContent,
            template_id: selectedTemplate || null,
            activity_type: VOICE_TEMPLATES.find(t => t.id === selectedTemplate)?.activityType || 'custom',
            language: 'es',
          });

        if (error) throw error;
      }

      toast({
        title: "¡Guardado!",
        description: "La guía de voz se guardó correctamente",
      });

      onSave?.(voiceContent);

    } catch (error) {
      console.error('Save error:', error);
      toast({
        title: "Error",
        description: "No se pudo guardar la guía de voz",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Volume2 className="h-5 w-5" />
          Guía de Voz para Estudiantes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Template Selector */}
        <div>
          <label className="text-sm font-medium mb-2 block">
            Plantillas Predefinidas
          </label>
          <Select value={selectedTemplate} onValueChange={handleTemplateSelect}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona una plantilla..." />
            </SelectTrigger>
            <SelectContent>
              {VOICE_TEMPLATES.map(template => (
                <SelectItem key={template.id} value={template.id}>
                  {template.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Quick Commands */}
        <div>
          <label className="text-sm font-medium mb-2 block">
            Comandos Rápidos
          </label>
          <div className="flex flex-wrap gap-2">
            {QUICK_COMMANDS.map(cmd => (
              <Button
                key={cmd.label}
                variant="outline"
                size="sm"
                onClick={() => insertQuickCommand(cmd.value)}
              >
                {cmd.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Voice Content Editor */}
        <div>
          <label className="text-sm font-medium mb-2 block">
            Contenido de Voz
          </label>
          <Textarea
            value={voiceContent}
            onChange={(e) => setVoiceContent(e.target.value)}
            placeholder="Escribe la guía de voz para los estudiantes... Usa lenguaje puertorriqueño auténtico."
            className="min-h-[200px] font-sans"
          />
          <p className="text-xs text-muted-foreground mt-2">
            Consejos: Usa "nene/nena", "chévere", "wepa". Evita "está mal", usa "casi lo tienes".
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            onClick={handlePreview}
            variant="outline"
            disabled={!voiceContent.trim() || isPreviewing}
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Vista Previa
          </Button>
          <Button
            onClick={handleSave}
            disabled={!voiceContent.trim() || isSaving}
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Guardando...' : 'Guardar'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
