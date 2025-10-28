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

export function PronunciationPlayer({ activityId, language, content }: PronunciationPlayerProps) {
  const [isListening, setIsListening] = useState(false);
  const isListeningRef = useRef(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [spokenWord, setSpokenWord] = useState("");
  const [confidence, setConfidence] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);

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

    // Fuzzy matching: normalize words by removing punctuation, hyphens, spaces
    const normalizeWord = (text: string) => 
      text.toLowerCase()
        .replace(/[.,!?]/g, '')
        .replace(/[-\s]/g, '');

    const matchedIndex = content.answers.findIndex(
      (answer) => normalizeWord(answer.text) === normalizeWord(word),
    );

    console.log(`[PronunciationPlayer] 🔍 Match result:`, { 
      matchedIndex, 
      normalizedWord: normalizeWord(word),
      answerOptions: content.answers.map(a => ({ text: a.text, normalized: normalizeWord(a.text) }))
    });

    if (
      matchedIndex !== -1 &&
      confidenceScore >= content.pronunciation_challenge.confidence_threshold
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
                  (Confidence {(confidence * 100).toFixed(0)}
                  %)
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
