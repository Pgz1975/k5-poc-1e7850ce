import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Header } from '@/components/Header';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import VoiceAssessment from '@/components/VoiceAssessment';
import TeacherVoiceContent from '@/components/TeacherVoiceContent';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Mic, BookOpen, Zap, CheckCircle, Globe } from 'lucide-react';

export default function VoiceSimpleEnhanced() {
  const { session } = useAuth();
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState('student');

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header with Language Switcher */}
        <div className="flex justify-between items-start mb-8">
          <div className="text-center flex-1">
            <h1 className="text-4xl font-bold mb-4">
              {language === 'es' 
                ? 'Sistema de Voz Mejorado - WebRTC' 
                : 'Enhanced Voice System - WebRTC'}
            </h1>
            <p className="text-lg text-muted-foreground">
              {language === 'es'
                ? 'Versión optimizada con latencia <150ms y audio fluido'
                : 'Optimized version with <150ms latency and smooth audio'}
            </p>
            
            {/* Feature Badges */}
            <div className="flex justify-center gap-2 mt-4 flex-wrap">
              <Badge variant="outline" className="gap-1">
                <Zap className="h-3 w-3" />
                WebRTC {language === 'es' ? 'Directo' : 'Direct'}
              </Badge>
              <Badge variant="outline" className="gap-1">
                <Mic className="h-3 w-3" />
                gpt-realtime-2025-08-28
              </Badge>
              <Badge variant="outline" className="gap-1">
                <BookOpen className="h-3 w-3" />
                {language === 'es' ? 'Acento Puertorriqueño' : 'Puerto Rican Accent'}
              </Badge>
              <Badge variant="outline" className="gap-1">
                <CheckCircle className="h-3 w-3" />
                {language === 'es' ? 'Registro en BD' : 'DB Logging'}
              </Badge>
              <Badge variant="default" className="gap-1">
                <Globe className="h-3 w-3" />
                {language === 'es' ? 'Bilingüe ES/EN' : 'Bilingual ES/EN'}
              </Badge>
            </div>
          </div>

          {/* Language Switcher */}
          <div className="ml-4">
            <LanguageSwitcher />
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="student">
              {language === 'es' ? 'Modo Estudiante' : 'Student Mode'}
            </TabsTrigger>
            <TabsTrigger value="teacher">
              {language === 'es' ? 'Modo Maestro' : 'Teacher Mode'}
            </TabsTrigger>
          </TabsList>

          {/* Student Tab */}
          <TabsContent value="student">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mic className="h-5 w-5" />
                  {language === 'es' 
                    ? 'Práctica de Voz con Coquí' 
                    : 'Voice Practice with Coquí'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <VoiceAssessment
                  assessmentId="demo-assessment"
                  studentId={session?.user?.id || 'demo-student'}
                  language={language === 'es' ? 'es-PR' : 'en-US'}
                  gradeLevel={2}
                />
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card className="mt-4">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">
                  {language === 'es' ? 'Instrucciones:' : 'Instructions:'}
                </h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• {language === 'es' 
                    ? 'Presiona "Empezar a Hablar" para conectarte con Coquí' 
                    : 'Press "Start Speaking" to connect with Coquí'}</li>
                  <li>• {language === 'es' 
                    ? 'Habla claramente al micrófono en español o inglés' 
                    : 'Speak clearly into the microphone in Spanish or English'}</li>
                  <li>• {language === 'es' 
                    ? 'Coquí responderá en el idioma seleccionado arriba' 
                    : 'Coquí will respond in the language selected above'}</li>
                  <li>• {language === 'es' 
                    ? 'Usa los botones de ayuda si necesitas asistencia' 
                    : 'Use help buttons if you need assistance'}</li>
                  <li>• {language === 'es' 
                    ? 'Todas las conversaciones se graban para tu progreso' 
                    : 'All conversations are logged for your progress'}</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Teacher Tab */}
          <TabsContent value="teacher">
            <TeacherVoiceContent />

            {/* Teacher Instructions */}
            <Card className="mt-4">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">
                  {language === 'es' ? 'Guía para Maestros:' : 'Teacher Guide:'}
                </h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• {language === 'es' 
                    ? 'Selecciona una plantilla o escribe guía personalizada' 
                    : 'Select a template or write custom guidance'}</li>
                  <li>• {language === 'es' 
                    ? 'Usa comandos rápidos para pausas y celebraciones' 
                    : 'Use quick commands for pauses and celebrations'}</li>
                  <li>• {language === 'es' 
                    ? 'Mantén el lenguaje apropiado para la edad' 
                    : 'Keep language age-appropriate'}</li>
                  <li>• {language === 'es' 
                    ? 'Usa vocabulario puertorriqueño auténtico' 
                    : 'Use authentic Puerto Rican vocabulary'}</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Technical Info */}
        <Card className="mt-8 border-dashed">
          <CardContent className="p-4 text-xs text-muted-foreground">
            <strong>{language === 'es' ? 'Arquitectura Técnica:' : 'Technical Architecture:'}</strong> 
            {' '}
            {language === 'es' 
              ? 'WebRTC directo a OpenAI, modelo gpt-realtime-2025-08-28, latencia <150ms (P95), audio 24kHz PCM16, VAD del servidor (500ms silencio), transcripciones en tiempo real, métricas de rendimiento, logging a base de datos. El idioma del asistente se ajusta automáticamente según la selección de idioma (ES=acento puertorriqueño con voz nova, EN=voz alloy).'
              : 'Direct WebRTC to OpenAI, gpt-realtime-2025-08-28 model, <150ms latency (P95), 24kHz PCM16 audio, server VAD (500ms silence), real-time transcriptions, performance metrics, database logging. The assistant language adjusts automatically based on language selection (ES=Puerto Rican accent with nova voice, EN=alloy voice).'}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
