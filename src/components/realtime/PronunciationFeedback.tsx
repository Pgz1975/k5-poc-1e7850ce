import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, RefreshCw, XCircle } from "lucide-react";

interface PronunciationFeedbackProps {
  spokenWord: string;
  targetWord: string;
  isCorrect: boolean;
  analysis: {
    phonemeMatch: number;
    syllableMatch: number;
    overallScore: number;
    issues: string[];
  };
  onTryAgain: () => void;
}

export function PronunciationFeedback({
  spokenWord,
  targetWord,
  isCorrect,
  analysis,
  onTryAgain,
}: PronunciationFeedbackProps) {
  return (
    <Card className="p-6 space-y-4 bg-gradient-to-r from-emerald-50 via-white to-sky-50">
      <div className="flex items-center gap-3">
        {isCorrect ? (
          <CheckCircle2 className="w-8 h-8 text-emerald-500" />
        ) : (
          <XCircle className="w-8 h-8 text-amber-500" />
        )}
        <div>
          <h3 className="text-xl font-semibold">
            {isCorrect ? "¡Excelente pronunciación!" : "Sigamos practicando"}
          </h3>
          <p className="text-sm text-muted-foreground">
            Escuché "{spokenWord}", objetivo "{targetWord}"
          </p>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <Metric
          label="Coincidencia de sonidos"
          value={`${Math.round(analysis.phonemeMatch * 100)}%`}
        />
        <Metric
          label="Sílabas correctas"
          value={`${Math.round(analysis.syllableMatch * 100)}%`}
        />
        <Metric
          label="Puntuación total"
          value={`${Math.round(analysis.overallScore * 100)} / 100`}
        />
      </div>

      {analysis.issues.length > 0 && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-semibold text-amber-700 mb-2">
            Puntos para mejorar
          </p>
          <ul className="text-sm text-amber-800 space-y-1">
            {analysis.issues.map((issue, index) => (
              <li key={index}>• {issue}</li>
            ))}
          </ul>
        </div>
      )}

      <Button onClick={onTryAgain} variant="outline" className="w-full">
        <RefreshCw className="w-4 h-4 mr-2" />
        Intentar nuevamente
      </Button>
    </Card>
  );
}

interface MetricProps {
  label: string;
  value: string;
}

function Metric({ label, value }: MetricProps) {
  return (
    <div className="rounded-lg border border-border bg-white p-4 text-center shadow-sm">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-2xl font-bold text-primary">{value}</p>
    </div>
  );
}
