import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { generateGrade1SpanishContent } from "@/scripts/generateGrade1SpanishContent";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";

export default function GenerateContent() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    setResult(null);

    try {
      console.log("Starting content generation...");
      const data = await generateGrade1SpanishContent();
      
      setResult(data);
      toast({
        title: "¡Éxito!",
        description: `Se crearon ${data.parents.length} lecciones y ${data.exercises.length} ejercicios.`,
      });
    } catch (err: any) {
      console.error("Error generating content:", err);
      setError(err.message || "Error desconocido");
      toast({
        title: "Error",
        description: err.message || "Ocurrió un error al generar el contenido",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Generador de Contenido - Grado 1</CardTitle>
          <CardDescription>
            Genera 4 lecciones con 24 ejercicios en español para estudiantes de primer grado
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold">Contenido a generar:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Lección 1: Sonidos Iniciales - Letra M (6 ejercicios)</li>
              <li>Lección 2: Sonidos Iniciales - Letra S (6 ejercicios)</li>
              <li>Lección 3: El Coquí de Puerto Rico (6 ejercicios)</li>
              <li>Lección 4: Comida Típica Boricua (6 ejercicios)</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Tipos de ejercicios por lección:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Selección múltiple con imágenes</li>
              <li>Arrastrar y soltar letras</li>
              <li>Arrastrar y soltar imágenes (clasificación)</li>
              <li>Completar palabras</li>
              <li>Respuesta escrita</li>
              <li>Verdadero/Falso</li>
            </ul>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !!result}
            className="w-full"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Generando contenido...
              </>
            ) : result ? (
              <>
                <CheckCircle className="mr-2 h-5 w-5" />
                Contenido generado
              </>
            ) : (
              "Generar Contenido"
            )}
          </Button>

          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
              <div>
                <p className="font-semibold text-destructive">Error</p>
                <p className="text-sm text-destructive/80">{error}</p>
              </div>
            </div>
          )}

          {result && (
            <div className="bg-success/10 border border-success/20 rounded-lg p-4 space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                <div>
                  <p className="font-semibold text-success">¡Contenido generado exitosamente!</p>
                </div>
              </div>
              <div className="text-sm space-y-1">
                <p>📚 Lecciones creadas: {result.parents.length}</p>
                <p>📝 Ejercicios creados: {result.exercises.length}</p>
                <p>📊 Registros de ordenamiento: {result.orderingRecords.length}</p>
              </div>
              <div className="pt-2">
                <p className="text-sm text-muted-foreground">
                  Los estudiantes de grado 1 ahora pueden acceder a este contenido desde su panel.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
