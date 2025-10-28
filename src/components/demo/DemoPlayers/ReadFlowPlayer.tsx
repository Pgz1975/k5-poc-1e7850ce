import { useMemo, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AIDemoBadge } from "@/components/demo/AIDemoBadge";
import { useRealtimeDemo } from "@/hooks/useRealtimeDemo";
import { useReadingMetrics } from "@/hooks/useReadingMetrics";
import { logDemoInteraction, updateDemoSession } from "@/features/demo/api";
import { CheckCircle2, PauseCircle, PlayCircle, RefreshCcw } from "lucide-react";

interface PassageWord {
  id: number;
  text: string;
  pronunciation?: string;
  syllables?: number;
  difficulty?: "easy" | "medium" | "hard";
}

interface ReadFlowContent {
  passage: {
    title: string;
    text: string;
    words: PassageWord[];
    target_wcpm: number;
    min_accuracy: number;
  };
  reading_assistance: {
    word_highlighting: boolean;
    auto_scroll: boolean;
    pronunciation_hints: boolean;
    pace_feedback: boolean;
  };
}

interface ReadFlowPlayerProps {
  activityId: string;
  language: string;
  content: ReadFlowContent;
}

type WordState = "pending" | "correct" | "error" | "skipped";

export function ReadFlowPlayer({ content, activityId, language }: ReadFlowPlayerProps) {
  const [isReading, setIsReading] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [wordStates, setWordStates] = useState<Map<number, WordState>>(new Map());
  const [showResults, setShowResults] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { client, isConnected, startSession, endSession, demoSessionId } = useRealtimeDemo({
    demoActivityId: activityId,
    demoType: "readflow",
    language: language as "es-PR" | "en-US",
    features: {
      wordLevelTranscription: true,
    },
    voiceGuidance:
      "You are a reading coach. Listen carefully as the student reads. Track each word spoken. If a word is skipped or mispronounced, gently model it syllable by syllable. Celebrate progress enthusiastically.",
    onWordTranscription: handleWordTranscription,
  });

  const metrics = useReadingMetrics({
    words: content.passage.words,
    currentIndex: currentWordIndex,
    wordStates,
    startTime: sessionStartTime,
  });

  function handleWordTranscription(word: string) {
    if (!isReading) return;

    const expectedWord = content.passage.words[currentWordIndex];
    if (!expectedWord) return;

    const match = fuzzyMatch(word, expectedWord.text);

    if (match.score > 0.85) {
      setWordStates((prev) => {
        const next = new Map(prev);
        next.set(currentWordIndex, "correct");
        return next;
      });
      const nextIndex = currentWordIndex + 1;
      setCurrentWordIndex(nextIndex);

      if (nextIndex >= content.passage.words.length) {
        void handleReadingComplete();
      }
    } else {
      const upcoming = content.passage.words.slice(currentWordIndex + 1, currentWordIndex + 4);
      const skipMatch = upcoming.findIndex((w) => fuzzyMatch(word, w.text).score > 0.85);

      if (skipMatch !== -1) {
        setWordStates((prev) => {
          const next = new Map(prev);
          next.set(currentWordIndex, "skipped");
          return next;
        });
        setCurrentWordIndex(currentWordIndex + skipMatch + 1);
      } else if (match.score > 0.6) {
        setWordStates((prev) => {
          const next = new Map(prev);
          next.set(currentWordIndex, "error");
          return next;
        });

        client?.sendText(
          `The student is trying to read "${expectedWord.text}" but said "${word}". Provide a gentle correction with pronunciation support.`,
        );
      }
    }

    if (content.reading_assistance.auto_scroll) {
      scrollToWord(currentWordIndex);
    }
  }

  async function handleStart() {
    if (!isConnected) {
      await startSession(activityId);
      await new Promise((resolve) => setTimeout(resolve, 800));
    }

    setIsReading(true);
    setSessionStartTime(Date.now());
    setCurrentWordIndex(0);
    setWordStates(new Map());
    setShowResults(false);

    client?.sendText(
      `The student is ready to read "${content.passage.title}". Listen carefully, track accuracy, and encourage fluency.`,
    );

    if (demoSessionId) {
      logDemoInteraction(demoSessionId, {
        interaction_type: "readflow_start",
        transcript: null,
        metadata: {
          passage_title: content.passage.title,
          language,
        },
      }).catch((err) => console.warn("Failed to log ReadFlow start", err));
    }
  }

  function handlePause() {
    setIsReading(false);
  }

  function handleReset() {
    setIsReading(false);
    setSessionStartTime(null);
    setCurrentWordIndex(0);
    setWordStates(new Map());
    setShowResults(false);
    endSession().catch(() => {});
  }

  async function handleReadingComplete() {
    setIsReading(false);
    setShowResults(true);
    const accuracyPct = (metrics.accuracy * 100).toFixed(1);
    const wcpm = metrics.wcpm;

    client?.sendText(
      `The student completed the passage. Accuracy: ${accuracyPct} percent. Words per minute: ${wcpm}. Provide specific praise and suggestions.`,
    );

    if (demoSessionId) {
      const telemetry = {
        demo_type: "readflow",
        accuracy: metrics.accuracy,
        wcpm: metrics.wcpm,
        correct_words: metrics.correctWords,
        total_words: content.passage.words.length,
      } satisfies Record<string, unknown>;

      updateDemoSession(demoSessionId, {
        completion_percentage: 100,
        telemetry,
      }).catch((err) => console.warn("Failed to update ReadFlow session", err));

      logDemoInteraction(demoSessionId, {
        interaction_type: "readflow_summary",
        transcript: null,
        metadata: telemetry,
      }).catch((err) => console.warn("Failed to log ReadFlow summary", err));
    }
  }

  function scrollToWord(index: number) {
    const wordElement = document.getElementById(`word-${index}`);
    const container = containerRef.current;
    if (wordElement && container) {
      const wordRect = wordElement.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      if (wordRect.top < containerRect.top || wordRect.bottom > containerRect.bottom) {
        wordElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }

  const summary = useMemo(() => {
    const total = content.passage.words.length;
    const correct = metrics.correctWords;
    return {
      accuracy: metrics.accuracy,
      wcpm: metrics.wcpm,
      completion: metrics.progress,
      correct,
      total,
    };
  }, [metrics, content.passage.words.length]);

  return (
    <div className="space-y-6">
      <AIDemoBadge className="bg-purple-50 border-purple-200 text-purple-700">
        ✨ ReadFlow Demo - Interactive Reading Coach
      </AIDemoBadge>

      <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50">
        <h2 className="text-2xl font-bold text-center">{content.passage.title}</h2>
        <p className="mt-2 text-center text-muted-foreground">
          Track reading fluency, pronunciation, and pace with live feedback.
        </p>
      </Card>

      <div className="flex flex-wrap items-center gap-4">
        {!isReading ? (
          <Button onClick={handleStart} size="lg">
            <PlayCircle className="mr-2 h-5 w-5" /> Start Reading
          </Button>
        ) : (
          <Button onClick={handlePause} size="lg" variant="secondary">
            <PauseCircle className="mr-2 h-5 w-5" /> Pause
          </Button>
        )}
        <Button onClick={handleReset} variant="ghost">
          <RefreshCcw className="mr-2 h-5 w-5" /> Reset
        </Button>
        {showResults && (
          <div className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-green-700">
            <CheckCircle2 className="h-4 w-4" />
            Completed
          </div>
        )}
      </div>

      <Card ref={containerRef} className="p-8 max-h-[400px] overflow-y-auto scroll-smooth space-y-4">
        <div className="text-lg leading-relaxed">
          {content.passage.words.map((word, index) => {
            const state = wordStates.get(index) ?? "pending";
            const isCurrent = index === currentWordIndex && isReading;

            return (
              <span
                key={word.id ?? index}
                id={`word-${index}`}
                className={cn(
                  "inline-block mx-1 px-2 py-1 rounded transition-all duration-200",
                  state === "pending" && "bg-gray-100",
                  state === "correct" && "bg-green-200 text-green-800",
                  state === "error" && "bg-red-200 text-red-800",
                  state === "skipped" && "bg-yellow-200 text-yellow-800",
                  isCurrent && "ring-4 ring-blue-400 scale-110",
                )}
              >
                {word.text}
              </span>
            );
          })}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Reading Metrics</h3>
        <div className="grid gap-4 md:grid-cols-4">
          <Metric label="Accuracy" value={`${Math.round(summary.accuracy * 100)}%`} />
          <Metric label="Words per Minute" value={summary.wcpm.toString()} />
          <Metric label="Words Correct" value={`${summary.correct}/${summary.total}`} />
          <Metric label="Progress" value={`${Math.round(summary.completion * 100)}%`} />
        </div>
      </Card>

      {showResults && (
        <Card className="p-6 bg-green-50 border border-green-200">
          <h3 className="text-xl font-bold text-green-800 mb-4">Great reading!</h3>
          <p className="text-green-700">
            Accuracy {Math.round(summary.accuracy * 100)}% • Speed {summary.wcpm} WCPM
          </p>
        </Card>
      )}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-white p-4 text-center shadow-sm">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-bold text-primary">{value}</p>
    </div>
  );
}

function fuzzyMatch(spoken: string, expected: string) {
  const s = spoken.toLowerCase();
  const e = expected.toLowerCase();

  const matrix: number[][] = [];
  for (let i = 0; i <= e.length; i++) matrix[i] = [i];
  for (let j = 0; j <= s.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= e.length; i++) {
    for (let j = 1; j <= s.length; j++) {
      if (e[i - 1] === s[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1,
        );
      }
    }
  }

  const distance = matrix[e.length][s.length];
  const maxLen = Math.max(s.length, e.length) || 1;
  const score = 1 - distance / maxLen;
  return { score, distance };
}
