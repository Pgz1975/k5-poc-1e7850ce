import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, CheckCircle2, XCircle } from "lucide-react";
import confetti from "canvas-confetti";
import { useRealtimeDemo } from "@/hooks/useRealtimeDemo";
import { logDemoInteraction, updateDemoSession } from "@/features/demo/api";

interface StorySegment {
  id: string;
  text: string;
  question: string;
  expected_answer: string;
}

interface StoryContent {
  story_segments: StorySegment[];
}

interface StoryPlayerProps {
  activityId: string;
  language: string;
  content: StoryContent;
}

// Helper: Fuzzy match for expected answer
function fuzzyMatch(spoken: string, expected: string): boolean {
  const normalize = (s: string) => 
    s.toLowerCase()
      .replace(/[áéíóúñ]/g, (m) => ({ 'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u', 'ñ': 'n' })[m] || m)
      .replace(/[.,!?\-]/g, '')
      .trim();
  
  const normalizedSpoken = normalize(spoken);
  const normalizedExpected = normalize(expected);
  
  // Check if spoken contains the expected answer
  return normalizedSpoken.includes(normalizedExpected) || 
         normalizedExpected.includes(normalizedSpoken);
}

export function StoryPlayer({ activityId, language, content }: StoryPlayerProps) {
  const [phase, setPhase] = useState<"start" | "reading" | "question" | "complete">("start");
  const [currentSegment, setCurrentSegment] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [lastAnswer, setLastAnswer] = useState<{ correct: boolean; text: string } | null>(null);

  const { client, isConnected, startSession, demoSessionId } = useRealtimeDemo({
    demoActivityId: activityId,
    demoType: "story",
    language: language as "es-PR" | "en-US",
    voiceGuidance:
      "You are a storytelling narrator. Read story segments with expression and emotion. Ask comprehension questions clearly and provide encouraging feedback.",
    onWordTranscription: handleAnswer,
  });

  function handleAnswer(word: string, _timestamp: number, confidence: number) {
    if (phase !== "question") return;

    const segment = content.story_segments[currentSegment];
    const isCorrect = fuzzyMatch(word, segment.expected_answer);

    console.log(`[StoryPlayer] Answer attempt:`, {
      spoken: word,
      expected: segment.expected_answer,
      isCorrect,
      confidence,
    });

    setLastAnswer({ correct: isCorrect, text: word });

    if (demoSessionId) {
      logDemoInteraction(demoSessionId, {
        interaction_type: "story_answer",
        transcript: word,
        metadata: {
          segment_index: currentSegment,
          question: segment.question,
          expected_answer: segment.expected_answer,
          correct: isCorrect,
          confidence,
        },
      }).catch((err) => console.warn("Failed to log story answer", err));
    }

    if (isCorrect) {
      setCorrectAnswers((prev) => prev + 1);
      
      setTimeout(() => {
        if (currentSegment < content.story_segments.length - 1) {
          // Move to next segment
          const nextIndex = currentSegment + 1;
          setCurrentSegment(nextIndex);
          setPhase("reading");
          setLastAnswer(null);
          
          const nextSegment = content.story_segments[nextIndex];
          client?.sendText(
            `Great answer! Here's the next part of the story: ${nextSegment.text}`,
          );
        } else {
          // Story complete
          finishStory();
        }
      }, 2000);
    } else {
      client?.sendText(
        `Not quite. The answer was "${segment.expected_answer}". Let me ask again: ${segment.question}`,
      );
      setLastAnswer(null);
    }
  }

  function finishStory() {
    setPhase("complete");
    
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    const accuracy = (correctAnswers / content.story_segments.length) * 100;
    client?.sendText(
      `Story complete! You answered ${correctAnswers} out of ${content.story_segments.length} questions correctly. Great job!`,
    );

    if (demoSessionId) {
      updateDemoSession(demoSessionId, {
        completion_percentage: 100,
        telemetry: {
          demo_type: "story",
          correct_answers: correctAnswers,
          total_segments: content.story_segments.length,
          accuracy,
        },
      }).catch((err) => console.warn("Failed to update story session", err));
    }
  }

  async function startStory() {
    if (!isConnected) {
      await startSession(activityId);
      await new Promise((resolve) => setTimeout(resolve, 800));
    }

    setPhase("reading");
    setCurrentSegment(0);
    setCorrectAnswers(0);
    setLastAnswer(null);

    const firstSegment = content.story_segments[0];
    client?.sendText(`Let's begin the story: ${firstSegment.text}`);

    if (demoSessionId) {
      logDemoInteraction(demoSessionId, {
        interaction_type: "story_start",
        transcript: null,
        metadata: {
          total_segments: content.story_segments.length,
          language,
        },
      }).catch((err) => console.warn("Failed to log story start", err));
    }
  }

  function askQuestion() {
    setPhase("question");
    const segment = content.story_segments[currentSegment];
    client?.sendText(`Now, let me ask you: ${segment.question}`);
  }

  const progressPercentage = ((currentSegment + 1) / content.story_segments.length) * 100;

  return (
    <div className="space-y-6">
      <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-700">
        📖 Story Demo - Interactive Comprehension
      </Badge>

      {phase === "start" && (
        <Card className="p-12 text-center">
          <BookOpen className="w-16 h-16 mx-auto mb-4 text-blue-500" />
          <h2 className="text-2xl font-bold mb-4">Ready for a story adventure?</h2>
          <p className="text-muted-foreground mb-6">
            Listen to the story and answer questions about what you heard!
          </p>
          <Button onClick={startStory} size="lg">
            Begin Story
          </Button>
        </Card>
      )}

      {phase !== "start" && phase !== "complete" && (
        <>
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Badge>
                Segment {currentSegment + 1} / {content.story_segments.length}
              </Badge>
              <span className="text-sm text-muted-foreground">
                Correct: {correctAnswers}
              </span>
            </div>

            <Progress value={progressPercentage} className="mb-6" />

            {phase === "reading" && (
              <div className="text-center space-y-6">
                <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                  <p className="text-xl leading-relaxed">
                    {content.story_segments[currentSegment].text}
                  </p>
                </div>
                <Button onClick={askQuestion} size="lg">
                  I'm Ready for the Question
                </Button>
              </div>
            )}

            {phase === "question" && (
              <div className="text-center space-y-6">
                <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                  <p className="text-xl font-semibold mb-4">
                    {content.story_segments[currentSegment].question}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Say your answer out loud
                  </p>
                </div>

                {lastAnswer && (
                  <Card className={`p-4 ${lastAnswer.correct ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
                    <div className="flex items-center justify-center gap-2">
                      {lastAnswer.correct ? (
                        <>
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                          <span className="font-semibold text-green-700">Correct! Well done!</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-5 h-5 text-amber-600" />
                          <span className="font-semibold text-amber-700">Try again!</span>
                        </>
                      )}
                    </div>
                  </Card>
                )}
              </div>
            )}
          </Card>
        </>
      )}

      {phase === "complete" && (
        <Card className="p-8 bg-gradient-to-r from-blue-50 to-purple-50">
          <h3 className="text-2xl font-bold text-center mb-6">🎉 Story Complete!</h3>
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Correct Answers</p>
              <p className="text-4xl font-bold text-green-600">{correctAnswers}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Accuracy</p>
              <p className="text-4xl font-bold text-blue-600">
                {((correctAnswers / content.story_segments.length) * 100).toFixed(0)}%
              </p>
            </div>
          </div>
          <Button onClick={startStory} size="lg" className="w-full">
            Read Again
          </Button>
        </Card>
      )}
    </div>
  );
}
