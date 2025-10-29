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
    <div className="space-y-8">
      {/* Header Badge */}
      <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-br from-peach-100 to-peach-50 rounded-full border-4 border-peach-300 shadow-lg">
        <Zap className="h-6 w-6 text-peach-600" />
        <span className="text-lg font-bold text-peach-700">
          ⚡ Speed Quiz - Rapid-Fire Mode
        </span>
      </div>

      {!isPlaying && results.length === 0 ? (
        /* Start Screen */
        <Card className="p-16 text-center bg-gradient-to-br from-peach-100 to-peach-50 border-4 border-peach-300 rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="mb-6 inline-flex items-center justify-center w-24 h-24 bg-white rounded-3xl border-4 border-peach-400 shadow-lg">
            <Zap className="w-14 h-14 text-peach-600" />
          </div>
          <h2 className="text-4xl font-black mb-4 text-gray-900">Ready for a speed challenge?</h2>
          <p className="text-xl text-gray-600 font-medium mb-8 max-w-md mx-auto">
            ⚡ Answer as fast as you can. Faster correct answers earn more points!
          </p>
          <Button 
            onClick={startQuiz} 
            size="lg"
            className="px-10 py-7 text-xl font-black bg-gradient-to-r from-peach-500 to-peach-600 hover:from-peach-600 hover:to-peach-700 text-white border-4 border-gray-900 rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all"
          >
            🚀 Start Quiz
          </Button>
        </Card>
      ) : isPlaying ? (
        /* Playing State */
        <>
          <Card className="p-10 bg-white border-4 border-gray-800 rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center justify-between mb-6">
              <Badge className="px-4 py-2 text-base font-bold border-3 border-cyan-400 bg-cyan-100 text-cyan-900 rounded-full">
                Question {currentQuestion + 1} / {content.questions.length}
              </Badge>
              <div className="flex items-center gap-3 px-5 py-2 bg-pink-100 border-3 border-pink-400 rounded-full">
                <Timer className="w-5 h-5 text-pink-600" />
                <span className="font-mono text-xl font-black text-pink-900">
                  {(timeRemaining / 1000).toFixed(1)}s
                </span>
              </div>
            </div>

            <Progress
              value={(timeRemaining / content.questions[currentQuestion].time_limit_ms) * 100}
              className="mb-8 h-4 bg-gray-200 border-3 border-gray-800 rounded-full overflow-hidden"
            />

            <h3 className="text-3xl md:text-4xl font-black text-center mb-8 text-gray-900 leading-tight">
              {content.questions[currentQuestion].statement}
            </h3>
            <p className="text-center text-xl text-gray-600 font-bold">
              🎤 Say "Verdadero" or "Falso" out loud
            </p>
          </Card>

          <Card className="p-8 bg-gradient-to-br from-lime-100 to-lime-50 border-4 border-lime-300 rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="grid grid-cols-3 gap-6 text-center">
              <div className="bg-white rounded-2xl p-6 border-3 border-peach-400 shadow-lg">
                <p className="text-sm font-bold text-gray-600 mb-2">Score</p>
                <p className="text-5xl font-black text-peach-600">{score}</p>
              </div>
              <div className="bg-white rounded-2xl p-6 border-3 border-coral-400 shadow-lg">
                <p className="text-sm font-bold text-gray-600 mb-2">Streak</p>
                <p className="text-5xl font-black text-coral-600">{streak} 🔥</p>
              </div>
              <div className="bg-white rounded-2xl p-6 border-3 border-cyan-400 shadow-lg">
                <p className="text-sm font-bold text-gray-600 mb-2">Correct</p>
                <p className="text-5xl font-black text-cyan-600">
                  {results.filter((r) => r.correct).length}
                </p>
              </div>
            </div>
          </Card>
        </>
      ) : (
        /* Results Screen */
        <Card className="p-12 bg-gradient-to-br from-peach-100 to-peach-50 border-4 border-peach-300 rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h3 className="text-4xl font-black text-center mb-8 text-gray-900">🏆 Quiz Complete!</h3>
          <div className="grid grid-cols-2 gap-8 mb-10">
            <div className="text-center bg-white rounded-3xl p-8 border-4 border-peach-400 shadow-lg">
              <p className="text-sm font-bold text-gray-600 mb-3">Final Score</p>
              <p className="text-6xl font-black text-peach-600">{score}</p>
            </div>
            <div className="text-center bg-white rounded-3xl p-8 border-4 border-lime-400 shadow-lg">
              <p className="text-sm font-bold text-gray-600 mb-3">Accuracy</p>
              <p className="text-6xl font-black text-lime-600">
                {results.length
                  ? ((results.filter((r) => r.correct).length / results.length) * 100).toFixed(0)
                  : 0}
                %
              </p>
            </div>
          </div>
          <Button 
            onClick={startQuiz} 
            size="lg" 
            className="w-full h-16 text-xl font-black bg-gradient-to-r from-peach-500 to-peach-600 hover:from-peach-600 hover:to-peach-700 text-white border-4 border-gray-900 rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all"
          >
            🔄 Play Again
          </Button>
        </Card>
      )}
    </div>
  );
}
