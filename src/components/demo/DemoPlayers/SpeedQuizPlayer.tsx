import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Timer, Zap } from "lucide-react";
import { useRealtimeDemo } from "@/hooks/useRealtimeDemo";
import { logDemoInteraction, updateDemoSession } from "@/features/demo/api";

interface Question {
  statement: string;
  correct: boolean;
  category: string;
  time_limit_ms: number;
}

interface SpeedQuizContent {
  questions: Question[];
  scoring: {
    base_points: number;
    speed_multiplier: boolean;
    max_multiplier: number;
    penalty_per_second: number;
  };
}

interface SpeedQuizPlayerProps {
  activityId: string;
  language: string;
  content: SpeedQuizContent;
}

export function SpeedQuizPlayer({ activityId, language, content }: SpeedQuizPlayerProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(3000);
  const [isPlaying, setIsPlaying] = useState(false);
  const [results, setResults] = useState<Array<{ correct: boolean; time: number }>>([]);

  const questionStartTime = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { client, isConnected, startSession, demoSessionId } = useRealtimeDemo({
    demoActivityId: activityId,
    demoType: "speed_quiz",
    language: language as "es-PR" | "en-US",
    features: {
      wordLevelTranscription: true,
    },
    voiceGuidance:
      "You are hosting a rapid-fire quiz. Read each statement clearly and quickly. Confirm the student's answer immediately and keep the energy high.",
    onWordTranscription: handleAnswer,
  });

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  function handleAnswer(word: string) {
    if (!isPlaying) return;

    const normalizedWord = word.toLowerCase().trim();
    const isTrueAnswer = ["verdadero", "true", "sí", "yes", "cierto"].includes(normalizedWord);
    const isFalseAnswer = ["falso", "false", "no", "incorrecto"].includes(normalizedWord);

    if (!isTrueAnswer && !isFalseAnswer) return;

    const answerTime = performance.now() - questionStartTime.current;
    const question = content.questions[currentQuestion];
    const studentAnswer = isTrueAnswer;
    const isCorrect = studentAnswer === question.correct;

    let points = 0;
    if (isCorrect) {
      points = content.scoring.base_points;

      if (content.scoring.speed_multiplier) {
        const remainingMs = Math.max(0, question.time_limit_ms - answerTime);
        const speedBonus =
          (remainingMs / 1000) * content.scoring.penalty_per_second;
        const multiplier = Math.min(1 + speedBonus / 10, content.scoring.max_multiplier);
        points = Math.round(points * multiplier);
      }
      setStreak((prev) => prev + 1);
    } else {
      setStreak(0);
    }

    setScore((prev) => prev + points);
    setResults((prev) => [...prev, { correct: isCorrect, time: answerTime }]);

    if (demoSessionId) {
      logDemoInteraction(demoSessionId, {
        interaction_type: "speed_quiz_answer",
        transcript: word,
        metadata: {
          question_index: currentQuestion,
          statement: question.statement,
          correct: isCorrect,
          response_time_ms: answerTime,
          points_awarded: points,
        },
      }).catch((err) => console.warn("Failed to log speed quiz answer", err));
    }

    if (currentQuestion < content.questions.length - 1) {
      const nextIndex = currentQuestion + 1;
      setCurrentQuestion(nextIndex);
      resetTimer(nextIndex);
      const nextQ = content.questions[nextIndex];
      client?.sendText(`Next question: ${nextQ.statement}. True or false?`);
    } else {
      finishQuiz();
    }
  }

  function resetTimer(questionIndex: number) {
    const question = content.questions[questionIndex];
    setTimeRemaining(question.time_limit_ms);
    questionStartTime.current = performance.now();

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 100) {
          handleTimeout();
          return 0;
        }
        return prev - 100;
      });
    }, 100);
  }

  function handleTimeout() {
    setResults((prev) => [
      ...prev,
      { correct: false, time: content.questions[currentQuestion].time_limit_ms },
    ]);

    if (currentQuestion < content.questions.length - 1) {
      const nextIndex = currentQuestion + 1;
      setCurrentQuestion(nextIndex);
      resetTimer(nextIndex);
    } else {
      finishQuiz();
    }
  }

  function finishQuiz() {
    setIsPlaying(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    const correctCount = results.filter((r) => r.correct).length;
    const accuracy = results.length ? (correctCount / results.length) * 100 : 0;
    const avgTime = results.length
      ? results.reduce((sum, r) => sum + r.time, 0) / results.length
      : 0;

    client?.sendText(
      `Quiz complete! Score ${score} points. Accuracy ${accuracy.toFixed(
        0,
      )} percent. Average response time ${(avgTime / 1000).toFixed(
        1,
      )} seconds.`,
    );

    if (demoSessionId) {
      updateDemoSession(demoSessionId, {
        completion_percentage: 100,
        telemetry: {
          demo_type: "speed_quiz",
          score,
          accuracy,
          questions_answered: results.length,
        },
      }).catch((err) => console.warn("Failed to update speed quiz session", err));

      logDemoInteraction(demoSessionId, {
        interaction_type: "speed_quiz_summary",
        transcript: null,
        metadata: {
          score,
          accuracy,
          average_response_time_ms: avgTime,
        },
      }).catch((err) => console.warn("Failed to log speed quiz summary", err));
    }
  }

  async function startQuiz() {
    if (!isConnected) {
      await startSession(activityId);
      await new Promise((resolve) => setTimeout(resolve, 800));
    }

    setIsPlaying(true);
    setCurrentQuestion(0);
    setScore(0);
    setStreak(0);
    setResults([]);
    resetTimer(0);

    const firstQuestion = content.questions[0];
    client?.sendText(
      `Speed quiz starting! First question: ${firstQuestion.statement}. True or false?`,
    );

    if (demoSessionId) {
      logDemoInteraction(demoSessionId, {
        interaction_type: "speed_quiz_start",
        transcript: null,
        metadata: {
          total_questions: content.questions.length,
          language,
        },
      }).catch((err) => console.warn("Failed to log speed quiz start", err));
    }
  }

  return (
    <div className="space-y-6">
      <Badge variant="outline" className="bg-yellow-50 border-yellow-200 text-yellow-700">
        ⚡ Speed Quiz Demo - Rapid-Fire Mode
      </Badge>

      {!isPlaying && results.length === 0 ? (
        <Card className="p-12 text-center">
          <Zap className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
          <h2 className="text-2xl font-bold mb-4">Ready for a speed challenge?</h2>
          <p className="text-muted-foreground mb-6">
            Answer as fast as you can. Faster correct answers earn more points!
          </p>
          <Button onClick={startQuiz} size="lg">
            Start Quiz
          </Button>
        </Card>
      ) : isPlaying ? (
        <>
          <Card className="p-8">
            <div className="flex items-center justify-between mb-4">
              <Badge>
                Question {currentQuestion + 1} / {content.questions.length}
              </Badge>
              <div className="flex items-center gap-2">
                <Timer className="w-4 h-4" />
                <span className="font-mono">{(timeRemaining / 1000).toFixed(1)}s</span>
              </div>
            </div>

            <Progress
              value={
                (timeRemaining / content.questions[currentQuestion].time_limit_ms) * 100
              }
              className="mb-6"
            />

            <h3 className="text-2xl font-bold text-center mb-6">
              {content.questions[currentQuestion].statement}
            </h3>
            <p className="text-center text-muted-foreground">
              Say "Verdadero" or "Falso" out loud
            </p>
          </Card>

          <Card className="p-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-muted-foreground">Score</p>
                <p className="text-3xl font-bold text-yellow-600">{score}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Streak</p>
                <p className="text-3xl font-bold text-green-600">{streak} 🔥</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Correct</p>
                <p className="text-3xl font-bold text-blue-600">
                  {results.filter((r) => r.correct).length}
                </p>
              </div>
            </div>
          </Card>
        </>
      ) : (
        <Card className="p-8 bg-gradient-to-r from-yellow-50 to-orange-50">
          <h3 className="text-2xl font-bold text-center mb-6">🏆 Quiz Complete!</h3>
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Final Score</p>
              <p className="text-4xl font-bold text-yellow-600">{score}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Accuracy</p>
              <p className="text-4xl font-bold text-green-600">
                {results.length
                  ? ((results.filter((r) => r.correct).length / results.length) * 100).toFixed(0)
                  : 0}
                %
              </p>
            </div>
          </div>
          <Button onClick={startQuiz} size="lg" className="w-full">
            Play Again
          </Button>
        </Card>
      )}
    </div>
  );
}
