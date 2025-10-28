import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mic, Volume2 } from "lucide-react";
import { useRealtimeDemo } from "@/hooks/useRealtimeDemo";
import { usePronunciationAnalysis } from "@/hooks/usePronunciationAnalysis";
import { AudioWaveform } from "@/components/realtime/AudioWaveform";
import { PronunciationFeedback } from "@/components/realtime/PronunciationFeedback";
import { logDemoInteraction, updateDemoSession } from "@/features/demo/api";

interface AnswerOption {
  text: string;
  pronunciation: string[];
  isCorrect: boolean;
}

interface PronunciationContent {
  question: string;
  target_pronunciation: string;
  answers: AnswerOption[];
  pronunciation_challenge: {
    say_to_select: boolean;
    confidence_threshold: number;
    feedback_levels: string[];
  };
}

interface PronunciationPlayerProps {
  activityId: string;
  language: string;
  content: PronunciationContent;
}

// Helper: Calculate Levenshtein distance for fuzzy matching
function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }
  
  return matrix[b.length][a.length];
}

// Helper: Calculate similarity percentage (0-1)
function calculateSimilarity(word1: string, word2: string): number {
  const distance = levenshteinDistance(word1, word2);
  const maxLength = Math.max(word1.length, word2.length);
  return maxLength === 0 ? 1 : 1 - distance / maxLength;
}

// Helper: Phonetic normalization for Spanish/English
function phoneticNormalize(word: string): string {
  return word
    .toLowerCase()
    .replace(/[áéíóúñ]/g, (m) => ({ 
      'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u', 'ñ': 'n' 
    })[m] || m)
    .replace(/qu/g, 'k')  // "coquí" → "coki"
    .replace(/c([eiy])/g, 's$1') // "cielo" → "sielo"
    .replace(/c/g, 'k')   // "casa" → "kasa"
    .replace(/z/g, 's')   // "zapato" → "sapato"
    .replace(/ll/g, 'y')  // "llama" → "yama"
    .replace(/[.,!?\-\s]/g, '');
}

export function PronunciationPlayer({ activityId, language, content }: PronunciationPlayerProps) {
  const [isListening, setIsListening] = useState(false);
  const isListeningRef = useRef(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [spokenWord, setSpokenWord] = useState("");
  const [confidence, setConfidence] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [matchSimilarity, setMatchSimilarity] = useState(0);

  // Sync ref with state to avoid stale closures
  useEffect(() => {
    isListeningRef.current = isListening;
  }, [isListening]);

  const {
    client,
    isConnected,
    startSession,
    audioLevel,
    frequencyData,
    isAIPlaying,
    demoSessionId,
  } = useRealtimeDemo({
    demoActivityId: activityId,
    demoType: "pronunciation",
    language: language as "es-PR" | "en-US",
    features: {
      wordLevelTranscription: true,
      pronunciationAnalysis: true,
      audioVisualization: true,
    },
    voiceGuidance:
      "You are a pronunciation coach. Listen carefully, provide phoneme-level feedback, and model the target pronunciation slowly and clearly.",
    onWordTranscription: handlePronunciation,
  });

  const analysis = usePronunciationAnalysis({
    spokenWord,
    targetWord: content.target_pronunciation,
    confidence,
  });

  function handlePronunciation(word: string, _timestamp: number, confidenceScore: number) {
    console.log(`[PronunciationPlayer] 🎤 handlePronunciation ENTRY:`, { 
      word, 
      isListening: isListeningRef.current, 
      confidence: confidenceScore,
      timestamp: new Date().toISOString()
    });

    if (!isListeningRef.current) {
      console.log('[PronunciationPlayer] ⏸️ EARLY RETURN - isListening is false');
      return;
    }

    setSpokenWord(word);
    setConfidence(confidenceScore);

    // Fuzzy phonetic matching with 80% similarity threshold
    const SIMILARITY_THRESHOLD = 0.80;
    const MIN_CONFIDENCE = 0.70; // Lowered from 90% to 70%

    const matchResults = content.answers.map((answer, index) => {
      const similarity = calculateSimilarity(
        phoneticNormalize(answer.text),
        phoneticNormalize(word)
      );
      return { index, similarity, answer };
    });

    // Find best match above threshold
    const bestMatch = matchResults
      .filter(result => result.similarity >= SIMILARITY_THRESHOLD)
      .sort((a, b) => b.similarity - a.similarity)[0];

    const matchedIndex = bestMatch ? bestMatch.index : -1;

    console.log(`[PronunciationPlayer] 🔍 Fuzzy match results:`, {
      normalizedWord: phoneticNormalize(word),
      matches: matchResults.map(r => ({
        text: r.answer.text,
        phonetic: phoneticNormalize(r.answer.text),
        similarity: (r.similarity * 100).toFixed(1) + '%'
      })),
      bestMatch: bestMatch ? {
        text: bestMatch.answer.text,
        similarity: (bestMatch.similarity * 100).toFixed(1) + '%'
      } : null
    });

    if (bestMatch) {
      setMatchSimilarity(bestMatch.similarity);
    }

    // Use fuzzy similarity to boost confidence if phonetic match is strong
    const adjustedConfidence = bestMatch 
      ? Math.max(confidenceScore, bestMatch.similarity) 
      : confidenceScore;

    if (
      matchedIndex !== -1 &&
      adjustedConfidence >= MIN_CONFIDENCE
    ) {
      setSelectedAnswer(matchedIndex);
      setIsListening(false);
      setShowFeedback(true);

      const answer = content.answers[matchedIndex];
      if (answer.isCorrect) {
        client?.sendText(
          `Great pronunciation of "${word}"! Encourage the student and celebrate the correct choice.`,
        );
      } else {
        client?.sendText(
          `The student said "${word}". Kindly explain why the correct pronunciation is "${content.target_pronunciation}" and model it slowly.`,
        );
      }

      if (demoSessionId) {
        const metadata = {
          spoken_word: word,
          confidence: confidenceScore,
          selected_answer: answer.text,
          correct: answer.isCorrect,
        } satisfies Record<string, unknown>;

        logDemoInteraction(demoSessionId, {
          interaction_type: "pronunciation_attempt",
          transcript: word,
          metadata,
        }).catch((err) => console.warn("Failed to log pronunciation attempt", err));

        if (answer.isCorrect) {
          updateDemoSession(demoSessionId, {
            completion_percentage: 100,
            telemetry: {
              demo_type: "pronunciation",
              last_spoken_word: word,
              confidence: confidenceScore,
            },
          }).catch((err) => console.warn("Failed to update pronunciation session", err));
        }
      }
    }
  }

  async function handleStartListening() {
    if (!isConnected) {
      await startSession(activityId);
      await new Promise((resolve) => setTimeout(resolve, 800));
    }

    setIsListening(true);
    setSpokenWord("");
    setConfidence(0);
    setShowFeedback(false);
    setSelectedAnswer(null);

    client?.sendText(
      `We are practicing pronunciation. Listen for the student to say one of the following words: ${content.answers
        .map((a) => a.text)
        .join(", ")}.`,
    );

    if (demoSessionId) {
      logDemoInteraction(demoSessionId, {
        interaction_type: "pronunciation_start",
        transcript: null,
        metadata: {
          answer_options: content.answers.map((a) => a.text),
          language,
        },
      }).catch((err) => console.warn("Failed to log pronunciation start", err));
    }
  }

  function handleModelPronunciation(text: string) {
    client?.sendText(`Please model the pronunciation of "${text}" clearly and slowly.`);
  }

  return (
    <div className="space-y-6">
      <Badge variant="outline" className="bg-rose-50 border-rose-200 text-rose-700">
        🎤 Pronunciation Demo - Coaching with Live Feedback
      </Badge>

      <Card className="p-6 space-y-4">
        <h2 className="text-xl font-semibold">{content.question}</h2>
        <p className="text-muted-foreground">
          Say the word out loud. The AI coach listens and gives instant feedback.
        </p>
        
        {confidence > 0 && (
          <div className="p-4 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 border-2 border-primary/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold uppercase tracking-wide">Confidence Score</span>
              <span className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {(confidence * 100).toFixed(0)}%
              </span>
            </div>
            <div className="w-full h-4 bg-muted/50 rounded-full overflow-hidden border">
              <div 
                className="h-full transition-all duration-500 ease-out"
                style={{
                  width: `${confidence * 100}%`,
                  backgroundColor: confidence > 0.7 ? 'hsl(var(--success))' : 
                                 confidence > 0.4 ? 'hsl(45, 93%, 47%)' : 
                                 'hsl(var(--destructive))'
                }}
              />
            </div>
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          {content.answers.map((answer, index) => {
            const isSelected = selectedAnswer === index;
            return (
              <Card
                key={answer.text}
                className={`p-4 border ${
                  isSelected ? (answer.isCorrect ? "border-green-400" : "border-amber-400") : ""
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold">{answer.text}</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleModelPronunciation(answer.text)}
                  >
                    <Volume2 className="w-4 h-4 mr-1" />
                    Model
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Pronunciations: {answer.pronunciation.join(" · ")}
                </p>
              </Card>
            );
          })}
        </div>

        <div className="rounded-lg border bg-muted/40 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mic className="w-5 h-5 text-rose-500" />
              <span className="font-medium">
                {isListening ? "Listening..." : "Tap start to begin practicing"}
              </span>
            </div>
            <Button onClick={handleStartListening} disabled={isListening}>
              {isListening ? "Listening" : "Start Practice"}
            </Button>
          </div>

          <div className="mt-4">
            <AudioWaveform
              frequencyData={frequencyData}
              audioLevel={audioLevel}
              isActive={isListening || isAIPlaying}
            />
          </div>
        </div>

        {spokenWord && (
          <Card className="p-4 bg-slate-50">
            <p className="text-sm text-muted-foreground">
              Heard: <span className="font-semibold">{spokenWord}</span>{" "}
              {confidence > 0 && (
                <span className="ml-2">
                  (Confidence: {(confidence * 100).toFixed(0)}%)
                </span>
              )}
              {matchSimilarity > 0 && (
                <span className="ml-2 text-success font-medium">
                  ✓ {(matchSimilarity * 100).toFixed(0)}% match
                </span>
              )}
            </p>
          </Card>
        )}
      </Card>

      {showFeedback && selectedAnswer !== null && (
        <PronunciationFeedback
          spokenWord={spokenWord}
          targetWord={content.target_pronunciation}
          isCorrect={content.answers[selectedAnswer].isCorrect}
          analysis={analysis}
          onTryAgain={handleStartListening}
        />
      )}
    </div>
  );
}
