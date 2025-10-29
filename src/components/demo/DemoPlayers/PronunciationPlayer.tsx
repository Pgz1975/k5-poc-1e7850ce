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

    // Adaptive threshold based on word length
    const getSimilarityThreshold = (word: string): number => {
      const len = word.replace(/\s+/g, '').length;
      if (len <= 4) return 0.60;  // Short words: more lenient
      if (len <= 7) return 0.70;  // Medium words
      return 0.80;                // Long words
    };

    const SIMILARITY_THRESHOLD = getSimilarityThreshold(word);
    const MIN_CONFIDENCE = 0.65; // Lowered for better acceptance

    const matchResults = content.answers.map((answer, index) => {
      const normalizedAnswer = phoneticNormalize(answer.text);
      const normalizedWord = phoneticNormalize(word);
      
      // Calculate similarity with and without spaces
      const directSimilarity = calculateSimilarity(normalizedAnswer, normalizedWord);
      
      // Also try matching if original transcription was multi-word (e.g., "cool key")
      const wordWithoutSpaces = word.replace(/\s+/g, '');
      const spacelessSimilarity = calculateSimilarity(
        normalizedAnswer, 
        phoneticNormalize(wordWithoutSpaces)
      );
      
      // Use best similarity
      const similarity = Math.max(directSimilarity, spacelessSimilarity);
      
      return { index, similarity, answer };
    });

    // Find best match above threshold
    const bestMatch = matchResults
      .filter(result => result.similarity >= SIMILARITY_THRESHOLD)
      .sort((a, b) => b.similarity - a.similarity)[0];

    const matchedIndex = bestMatch ? bestMatch.index : -1;

    console.log(`[PronunciationPlayer] 🔍 Fuzzy match results:`, {
      originalWord: word,
      normalizedWord: phoneticNormalize(word),
      wordWithoutSpaces: word.replace(/\s+/g, ''),
      wordLength: word.replace(/\s+/g, '').length,
      threshold: (SIMILARITY_THRESHOLD * 100).toFixed(0) + '%',
      confidenceScore: (confidenceScore * 100).toFixed(0) + '%',
      matches: matchResults.map(r => ({
        text: r.answer.text,
        phonetic: phoneticNormalize(r.answer.text),
        similarity: (r.similarity * 100).toFixed(1) + '%',
        passed: r.similarity >= SIMILARITY_THRESHOLD
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
    <div className="space-y-8">
      {/* Header Badge */}
      <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-br from-pink-100 to-pink-50 rounded-full border-4 border-pink-300 shadow-lg">
        <Mic className="h-6 w-6 text-pink-600" />
        <span className="text-lg font-bold text-pink-700">
          🎤 Pronunciation Coaching - Live Feedback
        </span>
      </div>

      {/* Main Card */}
      <Card className="p-8 bg-white border-4 border-gray-800 rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="space-y-6">
          {/* Question */}
          <div className="space-y-3">
            <h2 className="text-3xl font-black text-gray-900">{content.question}</h2>
            <p className="text-lg text-gray-600 font-medium">
              🎙️ Say the word out loud. The AI coach listens and gives instant feedback!
            </p>
          </div>
          
          {/* Confidence Score */}
          {confidence > 0 && (
            <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-100 to-purple-50 border-4 border-purple-300">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-black uppercase tracking-wide text-purple-700">
                  Confidence Score
                </span>
                <span className="text-5xl font-black bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                  {(confidence * 100).toFixed(0)}%
                </span>
              </div>
              <div className="w-full h-6 bg-white/50 rounded-full overflow-hidden border-3 border-purple-400">
                <div 
                  className="h-full transition-all duration-500 ease-out rounded-full"
                  style={{
                    width: `${confidence * 100}%`,
                    backgroundColor: confidence > 0.7 ? 'hsl(125, 100%, 71%)' : 
                                   confidence > 0.4 ? 'hsl(45, 100%, 71%)' : 
                                   'hsl(11, 100%, 67%)'
                  }}
                />
              </div>
            </div>
          )}

          {/* Answer Options */}
          <div className="grid gap-6 md:grid-cols-2">
            {content.answers.map((answer, index) => {
              const isSelected = selectedAnswer === index;
              const cardColor = isSelected 
                ? (answer.isCorrect ? "from-lime-100 to-lime-50 border-lime-400" : "from-peach-100 to-peach-50 border-peach-400")
                : "from-cyan-50 to-cyan-25 border-cyan-200";
              
              return (
                <Card
                  key={answer.text}
                  className={`p-6 bg-gradient-to-br ${cardColor} border-4 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-2xl font-black text-gray-900">{answer.text}</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      className="font-bold border-3 border-gray-800 bg-white hover:bg-gray-100 rounded-xl"
                      onClick={() => handleModelPronunciation(answer.text)}
                    >
                      <Volume2 className="w-4 h-4 mr-1" />
                      Model
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600 font-medium">
                    Pronunciations: {answer.pronunciation.join(" · ")}
                  </p>
                </Card>
              );
            })}
          </div>

          {/* Microphone Interface */}
          <div className="rounded-2xl border-4 border-pink-300 bg-gradient-to-br from-pink-50 to-pink-25 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white rounded-xl border-3 border-pink-400">
                  <Mic className="w-6 h-6 text-pink-600" />
                </div>
                <span className="text-lg font-bold text-gray-800">
                  {isListening ? "🎤 Listening..." : "Tap start to begin practicing"}
                </span>
              </div>
              <Button 
                onClick={handleStartListening} 
                disabled={isListening}
                className="px-6 py-6 text-lg font-black bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white border-4 border-gray-900 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all disabled:opacity-50"
              >
                {isListening ? "🎙️ Listening" : "▶️ Start Practice"}
              </Button>
            </div>

            {/* Audio Waveform */}
            <div className="mt-4">
              <AudioWaveform
                frequencyData={frequencyData}
                audioLevel={audioLevel}
                isActive={isListening || isAIPlaying}
              />
            </div>
          </div>

          {/* Spoken Word Display */}
          {spokenWord && (
            <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-25 border-4 border-purple-300 rounded-2xl">
              <p className="text-lg text-gray-700 font-medium">
                Heard: <span className="font-black text-gray-900">{spokenWord}</span>{" "}
                {confidence > 0 && (
                  <span className="ml-2 px-3 py-1 bg-white rounded-full border-2 border-purple-400 text-sm font-bold">
                    {(confidence * 100).toFixed(0)}% confidence
                  </span>
                )}
                {matchSimilarity > 0 && (
                  <span className="ml-2 px-3 py-1 bg-lime-200 rounded-full border-2 border-lime-400 text-sm font-bold text-lime-900">
                    ✓ {(matchSimilarity * 100).toFixed(0)}% match
                  </span>
                )}
              </p>
            </Card>
          )}
        </div>
      </Card>

      {/* Feedback Section */}
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
