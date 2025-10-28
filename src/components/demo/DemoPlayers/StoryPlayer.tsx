import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useRealtimeDemo } from "@/hooks/useRealtimeDemo";
import { logDemoInteraction, updateDemoSession } from "@/features/demo/api";
import confetti from "canvas-confetti";
import { BookOpen, CheckCircle2, XCircle, Mic } from "lucide-react";
import { AudioWaveform } from "@/components/realtime/AudioWaveform";

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

// Phonetic normalization (from PronunciationPlayer)
function phoneticNormalize(word: string): string {
  return word
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, "")
    .trim();
}

function calculateSimilarity(word1: string, word2: string): number {
  const s1 = phoneticNormalize(word1);
  const s2 = phoneticNormalize(word2);
  
  if (s1 === s2) return 1.0;
  if (s1.includes(s2) || s2.includes(s1)) return 0.85;
  
  const words1 = s1.split(/\s+/);
  const words2 = s2.split(/\s+/);
  const matchingWords = words1.filter(w => words2.includes(w)).length;
  const totalWords = Math.max(words1.length, words2.length);
  
  return matchingWords / totalWords;
}

export function StoryPlayer({ activityId, language, content }: StoryPlayerProps) {
  const [phase, setPhase] = useState<"start" | "reading" | "question" | "complete">("start");
  const [currentSegment, setCurrentSegment] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [lastAnswer, setLastAnswer] = useState<{ text: string; correct: boolean } | null>(null);
  const [lastConfidence, setLastConfidence] = useState(0);
  const [attemptHistory, setAttemptHistory] = useState<Array<{ word: string; confidence: number }>>([]);

  const voiceGuidance = `You are a storytelling narrator for Grade 1 students. Read with emotion and excitement.
Correct answers for comprehension questions:
${content.story_segments.map(s => `Q: "${s.question}" → A: "${s.expected_answer}"`).join('\n')}
Celebrate correct answers enthusiastically! Be encouraging when answers are incorrect.`;

  const { client, isConnected, startSession, demoSessionId, audioLevel, frequencyData, isAIPlaying } = useRealtimeDemo({
    demoActivityId: activityId,
    demoType: "story",
    language: language as "es-PR" | "en-US",
    voiceGuidance,
    onWordTranscription: handleAnswer,
  });

  function handleAnswer(word: string, _timestamp: number, confidence: number) {
    if (phase !== "question") return;

    console.log("[StoryPlayer] Answer received:", { word, confidence });
    
    setLastConfidence(confidence);
    setAttemptHistory(prev => [...prev, { word, confidence }]);

    const segment = content.story_segments[currentSegment];
    const similarity = calculateSimilarity(word, segment.expected_answer);
    const isCorrect = similarity >= 0.70 && confidence >= 0.65;

    console.log("[StoryPlayer] Match result:", { similarity, confidence, isCorrect });

    setLastAnswer({ text: word, correct: isCorrect });

    // Log interaction
    if (demoSessionId) {
      logDemoInteraction(demoSessionId, {
        interaction_type: "answer",
        transcript: word,
        metadata: { 
          segment_id: segment.id,
          expected_response: segment.expected_answer,
          is_correct: isCorrect,
          confidence_score: confidence,
          similarity 
        }
      }).then(({ error }) => {
        if (error) console.error("[StoryPlayer] Failed to log interaction:", error);
      });
    }

    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
      
      setTimeout(() => {
        if (currentSegment < content.story_segments.length - 1) {
          setCurrentSegment(prev => prev + 1);
          setPhase("reading");
          setLastAnswer(null);
          
          const nextSegment = content.story_segments[currentSegment + 1];
          client?.sendText(`Excellent! Now, ${nextSegment.text}`);
        } else {
          finishStory();
        }
      }, 2000);
    } else {
      client?.sendText(`Not quite! The answer I was looking for was ${segment.expected_answer}. Try again!`);
    }
  }

  async function startStory() {
    if (!isConnected) {
      await startSession(activityId);
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    // AI Introduction
    client?.sendText(`Hi! I'm going to tell you an exciting story. Listen carefully because I'll ask questions afterwards. Ready? Here we go!`);
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setPhase("reading");
    const firstSegment = content.story_segments[0];
    
    setTimeout(() => {
      client?.sendText(firstSegment.text);
    }, 500);
  }

  function askQuestion() {
    setPhase("question");
    setLastAnswer(null);
    
    const segment = content.story_segments[currentSegment];
    setTimeout(() => {
      client?.sendText(`Now, here's my question: ${segment.question}`);
    }, 1000);
  }

  function finishStory() {
    setPhase("complete");
    
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    const score = Math.round((correctAnswers / content.story_segments.length) * 100);
    
    client?.sendText(`Amazing job! You answered ${correctAnswers} out of ${content.story_segments.length} questions correctly! That's ${score}%!`);

    if (demoSessionId) {
      updateDemoSession(demoSessionId, {
        completion_percentage: 100,
        telemetry: { 
          correct_answers: correctAnswers,
          total_questions: content.story_segments.length,
          score,
          attempt_history: attemptHistory
        }
      });
    }
  }

  const progressPercentage = ((currentSegment + 1) / content.story_segments.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold">Story Time</h1>
          </div>
          <Badge variant="secondary">{language === "es-PR" ? "Español" : "English"}</Badge>
        </div>

        <Progress value={progressPercentage} className="h-2" />

        {phase === "start" && (
          <Card className="p-8 text-center space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Interactive Story</h2>
              <p className="text-muted-foreground">
                Listen to the story and answer questions to test your comprehension!
              </p>
            </div>
            <div className="bg-muted/40 rounded-lg p-4 text-sm text-left space-y-2">
              <p><strong>How it works:</strong></p>
              <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                <li>I'll read you a story segment</li>
                <li>Then I'll ask you a question</li>
                <li>Answer with your voice</li>
                <li>Continue to the next segment!</li>
              </ol>
            </div>
            <Button size="lg" onClick={startStory} disabled={!isConnected && !client}>
              {isConnected ? "Begin Story" : "Connecting..."}
            </Button>
          </Card>
        )}

        {phase === "reading" && (
          <Card className="p-8 space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <Badge variant="outline">Segment {currentSegment + 1} of {content.story_segments.length}</Badge>
            </div>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-lg leading-relaxed">
                {content.story_segments[currentSegment].text}
              </p>
            </div>

            <div className="rounded-lg border bg-muted/40 p-4">
              <div className="flex items-center gap-3 mb-2">
                <Mic className={`w-5 h-5 ${isAIPlaying ? 'text-blue-500' : 'text-muted-foreground'}`} />
                <span className="font-medium">
                  {isAIPlaying ? "AI is speaking..." : "Listening..."}
                </span>
              </div>
              <AudioWaveform
                frequencyData={frequencyData}
                audioLevel={audioLevel}
                isActive={isAIPlaying}
              />
            </div>

            <Button onClick={askQuestion} size="lg" className="w-full">
              Ready for the Question
            </Button>
          </Card>
        )}

        {phase === "question" && (
          <Card className="p-8 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Badge>Question {currentSegment + 1}</Badge>
              </div>
              
              <div className="bg-primary/5 border-l-4 border-primary rounded-lg p-4">
                <p className="text-lg font-medium">
                  {content.story_segments[currentSegment].question}
                </p>
              </div>
            </div>

            <div className="rounded-lg border bg-muted/40 p-4">
              <div className="flex items-center gap-3 mb-2">
                <Mic className="w-5 h-5 text-green-500" />
                <span className="font-medium">Listening for your answer...</span>
              </div>
              <AudioWaveform
                frequencyData={frequencyData}
                audioLevel={audioLevel}
                isActive={true}
              />
            </div>

            {lastAnswer && (
              <Card className="p-4 bg-slate-50">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {lastAnswer.correct ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                    <span className="font-semibold">
                      You said: "{lastAnswer.text}"
                    </span>
                  </div>
                  <span className="text-2xl font-bold">
                    {(lastConfidence * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full transition-all rounded-full"
                    style={{
                      width: `${lastConfidence * 100}%`,
                      backgroundColor: lastConfidence > 0.7 ? '#22c55e' : 
                                     lastConfidence > 0.4 ? '#f59e0b' : '#ef4444'
                    }}
                  />
                </div>
              </Card>
            )}
          </Card>
        )}

        {phase === "complete" && (
          <Card className="p-8 text-center space-y-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-green-600">Story Complete! 🎉</h2>
              <p className="text-xl text-muted-foreground">
                You got {correctAnswers} out of {content.story_segments.length} questions correct!
              </p>
            </div>
            
            <div className="bg-muted/40 rounded-lg p-6">
              <div className="text-6xl font-bold text-primary mb-2">
                {Math.round((correctAnswers / content.story_segments.length) * 100)}%
              </div>
              <p className="text-sm text-muted-foreground">Final Score</p>
            </div>

            <Button size="lg" onClick={() => {
              setPhase("start");
              setCurrentSegment(0);
              setCorrectAnswers(0);
              setLastAnswer(null);
              setAttemptHistory([]);
            }}>
              Read Story Again
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
