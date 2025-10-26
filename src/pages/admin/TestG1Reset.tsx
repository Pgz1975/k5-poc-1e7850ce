import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";

export default function TestG1Reset() {
  const { t } = useLanguage();
  const [isResetting, setIsResetting] = useState(false);
  const [resetResult, setResetResult] = useState<any>(null);

  const handleReset = async () => {
    setIsResetting(true);
    setResetResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('test-g1-reset', {
        method: 'POST',
      });

      if (error) throw error;

      setResetResult(data);
      toast({
        title: t("Datos reiniciados exitosamente", "Reset Successful"),
        description: t(
          `${data.completedActivityCount} actividades completadas y ${data.voiceSessionsCount} sesiones de voz eliminadas`,
          `${data.completedActivityCount} completed activities and ${data.voiceSessionsCount} voice sessions deleted`
        ),
      });
    } catch (error) {
      console.error('Reset error:', error);
      toast({
        title: t("Error al reiniciar", "Reset Failed"),
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">
          {t("TEST G1 - Reinicio y Prueba de Calidad", "TEST G1 - Reset & QA")}
        </h1>
        <p className="text-muted-foreground">
          {t(
            "Herramientas internas para reiniciar datos de prueba y verificar el flujo de voz",
            "Internal tools for resetting test data and verifying voice flow"
          )}
        </p>
      </div>

      <div className="grid gap-6">
        {/* Reset Control */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              {t("1. Reiniciar Datos de Prueba", "1. Reset Test Data")}
            </CardTitle>
            <CardDescription>
              {t(
                "Elimina progreso completado y sesiones de voz para actividades TEST G1",
                "Clear completed progress and voice sessions for TEST G1 activities"
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleReset}
              disabled={isResetting}
              className="w-full sm:w-auto"
            >
              {isResetting ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  {t("Reiniciando...", "Resetting...")}
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  {t("Reiniciar Datos TEST G1", "Reset TEST G1 Data")}
                </>
              )}
            </Button>

            {resetResult && (
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <p className="font-semibold mb-2">
                  {t("Resultado del Reinicio:", "Reset Result:")}
                </p>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    {t(
                      `Actividades completadas eliminadas: ${resetResult.completedActivityCount}`,
                      `Completed activities deleted: ${resetResult.completedActivityCount}`
                    )}
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    {t(
                      `Sesiones de voz eliminadas: ${resetResult.voiceSessionsCount}`,
                      `Voice sessions deleted: ${resetResult.voiceSessionsCount}`
                    )}
                  </li>
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Manual Smoke Test Checklist */}
        <Card>
          <CardHeader>
            <CardTitle>
              {t("2. Lista de Verificación de Pruebas Manuales", "2. Manual Smoke Test Checklist")}
            </CardTitle>
            <CardDescription>
              {t(
                "Sigue estos pasos para verificar la integración de voz TEST G1",
                "Follow these steps to verify TEST G1 voice integration"
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="step1">
                <AccordionTrigger>
                  {t("Paso 1: Iniciar Sesión y Navegar", "Step 1: Login & Navigate")}
                </AccordionTrigger>
                <AccordionContent>
                  <ol className="list-decimal list-inside space-y-2 text-sm">
                    <li>{t("Inicia sesión como estudiante", "Student login")}</li>
                    <li>
                      {t(
                        'Navega a "TEST G1 Lesson – Biliteracy Syllable Coach"',
                        'Navigate to "TEST G1 Lesson – Biliteracy Syllable Coach"'
                      )}
                    </li>
                    <li>
                      {t(
                        "Haz clic en el asistente Coquí",
                        "Click the Coquí assistant"
                      )}
                    </li>
                    <li>
                      {t(
                        "Confirma que saluda primero, lee las líneas 🔊 y hace referencia al contenido de la lección",
                        "Confirm it greets first, reads the 🔊 lines, and references the lesson content"
                      )}
                    </li>
                  </ol>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="step2">
                <AccordionTrigger>
                  {t("Paso 2: Completar los 5 Ejercicios", "Step 2: Complete 5 Exercises")}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 text-sm">
                    <p className="font-semibold">
                      {t(
                        "Completa cada ejercicio en orden:",
                        "Complete each exercise in order:"
                      )}
                    </p>
                    <ol className="list-decimal list-inside space-y-2">
                      <li>{t("Búsqueda de Sonidos (Opción Múltiple)", "Sound Hunt (MCQ)")}</li>
                      <li>{t("Vocal Faltante (Llenar Espacio)", "Missing Vowel (Fill Blank)")}</li>
                      <li>{t("Construye la Palabra (Arrastrar y Soltar)", "Build the Word (Drag & Drop)")}</li>
                      <li>{t("Datos del Ciclo de Vida (Verdadero/Falso)", "Life Cycle Facts (True/False)")}</li>
                      <li>{t("Predice la Palabra (Respuesta Escrita)", "Predict the Word (Write Answer)")}</li>
                    </ol>
                    <div className="mt-4 p-3 bg-muted rounded">
                      <p className="font-semibold mb-2">
                        {t("Para cada ejercicio, verifica que la IA:", "For each exercise, verify the AI:")}
                      </p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>{t("Lee o parafrasea el texto 🔊 en voz alta", "Reads or paraphrases the 🔊 text aloud")}</li>
                        <li>{t("Usa las palabras de pronunciación como objetivos de entrenamiento", "Uses the pronunciation words as coaching targets")}</li>
                        <li>{t("Sigue el patrón pista → andamio → revelar (no respuestas directas)", "Follows the hint → scaffold → reveal pattern (no direct answers)")}</li>
                      </ul>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="step3">
                <AccordionTrigger>
                  {t("Paso 3: Probar Modificación de Guía", "Step 3: Test Guidance Modification")}
                </AccordionTrigger>
                <AccordionContent>
                  <ol className="list-decimal list-inside space-y-2 text-sm">
                    <li>
                      {t(
                        "Edita el campo 'voice_guidance' de un ejercicio en la base de datos (añade una frase única)",
                        "Edit one exercise's 'voice_guidance' in database (add a unique phrase)"
                      )}
                    </li>
                    <li>{t("Actualiza la página", "Refresh the page")}</li>
                    <li>
                      {t(
                        "Confirma que la IA ahora incluye esa frase",
                        "Confirm the AI now includes that phrase"
                      )}
                    </li>
                  </ol>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="step4">
                <AccordionTrigger>
                  {t("Paso 4: Cambio de Idioma", "Step 4: Language Switch")}
                </AccordionTrigger>
                <AccordionContent>
                  <ol className="list-decimal list-inside space-y-2 text-sm">
                    <li>{t("Cambia el idioma de la UI (es/en)", "Switch the UI language toggle (es/en)")}</li>
                    <li>{t("Reconecta la voz", "Reconnect voice")}</li>
                    <li>
                      {t(
                        "Confirma que las instrucciones de la persona cambian de idioma pero aún respetan el contexto programado",
                        "Confirm the persona instructions switch languages but still respect the scripted context"
                      )}
                    </li>
                  </ol>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* Observability Checks */}
        <Card>
          <CardHeader>
            <CardTitle>
              {t("3. Verificaciones de Observabilidad", "3. Observability Checks")}
            </CardTitle>
            <CardDescription>
              {t(
                "Revisa los logs del relay para confirmar el contexto",
                "Review relay logs to confirm context"
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm mb-2 font-semibold">
                  {t("Busca en los logs de realtime-voice-relay:", "Look for in realtime-voice-relay logs:")}
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li className="font-mono text-xs">🔊 markers present: true/false</li>
                  <li className="font-mono text-xs">🎯 pronunciation targets: N</li>
                  <li className="font-mono text-xs">Instruction length: X KB</li>
                </ul>
              </div>

              <div className="p-4 border border-warning/50 bg-warning/10 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-warning mt-0.5" />
                  <div className="text-sm">
                    <p className="font-semibold mb-1">
                      {t("Nota:", "Note:")}
                    </p>
                    <p>
                      {t(
                        "Si una sesión se desvía, captura el fragmento del log + la fila correspondiente de manual_assessment para depuración",
                        "If a session deviates, capture the log snippet + the corresponding manual_assessment row for debugging"
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <Button
                variant="outline"
                onClick={() => window.open('/admin-dashboard', '_blank')}
                className="w-full sm:w-auto"
              >
                {t("Ver Logs de Edge Functions", "View Edge Function Logs")}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Exit Criteria */}
        <Card>
          <CardHeader>
            <CardTitle>
              {t("4. Criterios de Salida", "4. Exit Criteria")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                <span>
                  {t(
                    "Los cinco ejercicios se completan con guía de voz en vivo y comportamientos conscientes del contexto",
                    "All five exercises complete with live voice guidance and context-aware behaviors"
                  )}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                <span>
                  {t(
                    "Cambiar 'voice_guidance' o 'pronunciation_words' en la base de datos altera inmediatamente la respuesta de la IA",
                    "Changing 'voice_guidance' or 'pronunciation_words' in database immediately alters AI response"
                  )}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                <span>
                  {t(
                    "Hoja de registro de QA actualizada con fecha, probador y anomalías",
                    "QA log sheet updated with date, tester, and any anomalies"
                  )}
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
