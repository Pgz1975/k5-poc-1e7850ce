import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { generateGrade1SpanishContent } from "@/scripts/generateGrade1SpanishContent";
import { generateGrade2SpanishContent } from "@/scripts/generateGrade2SpanishContent";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle2, AlertCircle, GraduationCap } from "lucide-react";

export default function GenerateContentAdmin() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [selectedGrade, setSelectedGrade] = useState<string>("1");
  const { toast } = useToast();

  const handleGenerate = async () => {
    setIsGenerating(true);
    setResult(null);

    try {
      // Select the appropriate generation function based on grade
      const generateFunction = selectedGrade === "1"
        ? generateGrade1SpanishContent
        : generateGrade2SpanishContent;

      const data = await generateFunction();
      setResult(data);

      toast({
        title: "¡Éxito!",
        description: `Se crearon ${data.parents.length} lecciones principales y ${data.exercises.length} ejercicios para ${selectedGrade === "1" ? "Primer" : "Segundo"} Grado.`,
      });
    } catch (error: any) {
      console.error("Error generating content:", error);
      toast({
        title: "Error",
        description: error.message || "No se pudo generar el contenido",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <GraduationCap className="h-6 w-6" />
            Generador de Contenido Educativo
          </CardTitle>
          <CardDescription>
            Genera automáticamente lecciones y ejercicios en español para estudiantes de Puerto Rico
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            {/* Grade Selection */}
            <div className="space-y-2">
              <Label htmlFor="grade-select">Selecciona el Grado</Label>
              <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                <SelectTrigger id="grade-select" className="w-full">
                  <SelectValue placeholder="Selecciona un grado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Primer Grado (1°)</SelectItem>
                  <SelectItem value="2">Segundo Grado (2°)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-lg bg-muted p-4">
              <h3 className="font-semibold mb-2">Contenido a Generar:</h3>
              {selectedGrade === "1" ? (
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• 4 Lecciones Principales (Fonética básica)</li>
                  <li>• 24 Ejercicios (6 por lección)</li>
                  <li>• Tipos: Multiple Choice, Drag & Drop, Fill Blank, Write Answer, True/False</li>
                  <li>• Temas: Letras M y S, El Coquí, Comida Boricua</li>
                  <li>• Nivel: Conciencia fonémica básica</li>
                  <li>• Imágenes de Pexels y guía de voz en español</li>
                </ul>
              ) : (
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• 5 Dominios de Lectura (según estándares DEPR)</li>
                  <li>• 32 Ejercicios totales (6-8 por dominio)</li>
                  <li>• Dominio 1: Fonética avanzada (dígrafos CH, LL, RR)</li>
                  <li>• Dominio 2: Fluidez lectora (80-120 palabras/min)</li>
                  <li>• Dominio 3: Vocabulario (sinónimos, antónimos, lenguaje figurado)</li>
                  <li>• Dominio 4: Comprensión literal</li>
                  <li>• Dominio 5: Comprensión inferencial y pensamiento crítico</li>
                  <li>• Contenido localizado para Puerto Rico</li>
                </ul>
              )}
            </div>

            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              size="lg"
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generando Contenido para {selectedGrade === "1" ? "Primer" : "Segundo"} Grado...
                </>
              ) : (
                `Generar Contenido de ${selectedGrade === "1" ? "Primer" : "Segundo"} Grado`
              )}
            </Button>
          </div>

          {result && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-success">
                <CheckCircle2 className="h-5 w-5" />
                <span className="font-semibold">Contenido Generado Exitosamente</span>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Lecciones</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{result.parents.length}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Ejercicios</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{result.exercises.length}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Ordenamiento</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{result.orderingRecords.length}</div>
                  </CardContent>
                </Card>
              </div>

              <div className="rounded-lg bg-muted p-4">
                <h3 className="font-semibold mb-2">Lecciones Creadas:</h3>
                <ul className="space-y-1 text-sm">
                  {result.parents.map((parent: any) => (
                    <li key={parent.id} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0" />
                      <span>{parent.title}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-semibold mb-1">Próximos Pasos:</p>
                    <p>Ve al Dashboard de Estudiantes (Grado {selectedGrade === "1" ? "1" : "2"}) para ver y probar las nuevas lecciones y ejercicios.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
