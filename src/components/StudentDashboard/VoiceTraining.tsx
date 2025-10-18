import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Mic, MicOff, Volume2, RotateCcw, CheckCircle2, XCircle, Star } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useEffect, useRef } from "react";

interface PracticePhrase {
  textEs: string;
  textEn: string;
  difficulty: "easy" | "medium" | "hard";
  category: string;
}

const practicePhrases: PracticePhrase[] = [
  {
    textEs: "Buenos días, ¿cómo estás?",
    textEn: "Good morning, how are you?",
    difficulty: "easy",
    category: "Greetings"
  },
  {
    textEs: "Me gusta leer libros interesantes",
    textEn: "I like to read interesting books",
    difficulty: "medium",
    category: "Reading"
  },
  {
    textEs: "La metáfora es una figura literaria",
    textEn: "The metaphor is a literary figure",
    difficulty: "hard",
    category: "Literature"
  },
  {
    textEs: "¿Puedes ayudarme con mi tarea?",
    textEn: "Can you help me with my homework?",
    difficulty: "easy",
    category: "School"
  },
  {
    textEs: "Estoy aprendiendo español e inglés",
    textEn: "I am learning Spanish and English",
    difficulty: "medium",
    category: "Learning"
  }
];

export const VoiceTraining = () => {
  const { t, language } = useLanguage();
  const [isRecording, setIsRecording] = useState(false);
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [score, setScore] = useState<number | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [sessionScore, setSessionScore] = useState({ correct: 0, total: 0 });
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);

  const currentPhrase = practicePhrases[currentPhraseIndex];
  const currentText = language === "es" ? currentPhrase.textEs : currentPhrase.textEn;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "bg-success/10 text-success border-success/20";
      case "medium": return "bg-secondary/10 text-secondary border-secondary/20";
      case "hard": return "bg-destructive/10 text-destructive border-destructive/20";
      default: return "bg-muted";
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      
      analyserRef.current.fftSize = 256;
      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateLevel = () => {
        if (analyserRef.current) {
          analyserRef.current.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b) / bufferLength;
          setAudioLevel(Math.min(100, (average / 255) * 200));
          animationRef.current = requestAnimationFrame(updateLevel);
        }
      };

      updateLevel();
      setIsRecording(true);
      setScore(null);
    } catch (error) {
      console.error("Microphone access error:", error);
    }
  };

  const stopRecording = () => {
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    setIsRecording(false);
    setAudioLevel(0);

    // Simulate scoring (in production, this would use speech recognition API)
    const simulatedScore = Math.floor(Math.random() * 30) + 70; // 70-100
    setScore(simulatedScore);
    setAttempts(attempts + 1);
    
    if (simulatedScore >= 80) {
      setSessionScore({ correct: sessionScore.correct + 1, total: sessionScore.total + 1 });
    } else {
      setSessionScore({ ...sessionScore, total: sessionScore.total + 1 });
    }
  };

  const playAudio = () => {
    // Placeholder for text-to-speech
    console.log("Playing audio:", currentText);
  };

  const nextPhrase = () => {
    setCurrentPhraseIndex((currentPhraseIndex + 1) % practicePhrases.length);
    setScore(null);
    setAttempts(0);
  };

  const retryPhrase = () => {
    setScore(null);
  };

  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <CardTitle className="text-2xl md:text-3xl flex items-center gap-3">
              <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Mic className="h-5 w-5 md:h-6 md:w-6 text-primary" />
              </div>
              {t("¡Practica tu Voz! 🎤", "Practice Your Voice! 🎤")}
            </CardTitle>
            <CardDescription className="text-base mt-2">
              {t("Lee en voz alta y gana estrellas", "Read out loud and earn stars")}
            </CardDescription>
          </div>
          {sessionScore.total > 0 && (
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary">
                {Math.round((sessionScore.correct / sessionScore.total) * 100)}%
              </div>
              <p className="text-sm text-muted-foreground">
                {sessionScore.correct}/{sessionScore.total} ⭐
              </p>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6 md:space-y-8">
        {/* Current Phrase Card */}
        <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-6 md:p-8 border-2 border-primary/20">
          <div className="flex items-center justify-between mb-6">
            <Badge className={`${getDifficultyColor(currentPhrase.difficulty)} text-base px-4 py-2`}>
              {t(
                currentPhrase.difficulty === "easy" ? "Fácil ✨" : currentPhrase.difficulty === "medium" ? "Medio 💪" : "Difícil 🔥",
                currentPhrase.difficulty === "easy" ? "Easy ✨" : currentPhrase.difficulty === "medium" ? "Medium 💪" : "Hard 🔥"
              )}
            </Badge>
          </div>
          
          <div className="space-y-4">
            <p className="text-lg md:text-xl font-medium text-muted-foreground">
              {t("Lee esta frase:", "Read this phrase:")}
            </p>
            <div className="bg-background/80 rounded-xl p-4 md:p-6 border-2 border-primary/20">
              <div className="flex items-center gap-3">
                <p className="text-2xl md:text-3xl font-bold flex-1">{currentText}</p>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={playAudio}
                  className="shrink-0 hover:bg-primary/20 h-12 w-12 md:h-14 md:w-14"
                >
                  <Volume2 className="h-6 w-6 md:h-7 md:w-7 text-primary" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Recording Controls */}
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-4">
            <Button
              size="lg"
              onClick={isRecording ? stopRecording : startRecording}
              className={`gap-2 ${isRecording ? 'bg-destructive hover:bg-destructive/90' : 'bg-primary hover:bg-primary/90'}`}
            >
              {isRecording ? (
                <>
                  <MicOff className="h-5 w-5" />
                  {t("Detener", "Stop")}
                </>
              ) : (
                <>
                  <Mic className="h-5 w-5" />
                  {t("Grabar", "Record")}
                </>
              )}
            </Button>

            {score !== null && (
              <>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={retryPhrase}
                  className="gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  {t("Reintentar", "Retry")}
                </Button>
                <Button
                  size="lg"
                  onClick={nextPhrase}
                  className="gap-2"
                >
                  {t("Siguiente", "Next")}
                </Button>
              </>
            )}
          </div>

          {/* Audio Level Indicator */}
          {isRecording && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {t("Nivel de audio", "Audio level")}
                </span>
                <span className="text-primary font-medium">{Math.round(audioLevel)}%</span>
              </div>
              <Progress value={audioLevel} className="h-2" />
            </div>
          )}
        </div>

        {/* Score Display */}
        {score !== null && (
          <div className="bg-card border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {score >= 80 ? (
                  <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center">
                    <CheckCircle2 className="h-6 w-6 text-success" />
                  </div>
                ) : (
                  <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center">
                    <XCircle className="h-6 w-6 text-secondary" />
                  </div>
                )}
                <div>
                  <p className="font-semibold text-lg">
                    {score >= 80 
                      ? t("¡Excelente trabajo!", "Excellent work!") 
                      : t("Sigue practicando", "Keep practicing")}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t("Puntuación:", "Score:")} {score}/100
                  </p>
                </div>
              </div>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(score / 20)
                        ? "fill-primary text-primary"
                        : "text-muted"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {t("Pronunciación", "Pronunciation")}
                </span>
                <span className="font-medium">{Math.min(100, score + 5)}%</span>
              </div>
              <Progress value={Math.min(100, score + 5)} className="h-1.5" />
              
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {t("Fluidez", "Fluency")}
                </span>
                <span className="font-medium">{Math.max(0, score - 5)}%</span>
              </div>
              <Progress value={Math.max(0, score - 5)} className="h-1.5" />
              
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {t("Claridad", "Clarity")}
                </span>
                <span className="font-medium">{score}%</span>
              </div>
              <Progress value={score} className="h-1.5" />
            </div>

            {attempts > 1 && (
              <p className="text-xs text-muted-foreground mt-4">
                {t(`Intento ${attempts}`, `Attempt ${attempts}`)}
              </p>
            )}
          </div>
        )}

        {/* AI Integration Notice */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 text-sm">
          <p className="text-muted-foreground">
            {t(
              "🔧 Placeholder: Reconocimiento de voz con Web Speech API / Whisper API y evaluación de pronunciación con AI se integrarán aquí.",
              "🔧 Placeholder: Voice recognition with Web Speech API / Whisper API and pronunciation evaluation with AI will be integrated here."
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
