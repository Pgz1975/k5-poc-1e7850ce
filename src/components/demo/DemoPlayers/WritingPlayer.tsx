import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRealtimeDemo } from "@/hooks/useRealtimeDemo";
import { logDemoInteraction, updateDemoSession } from "@/features/demo/api";
import confetti from "canvas-confetti";
import { PenTool, CheckCircle2, XCircle, Mic } from "lucide-react";
import { AudioWaveform } from "@/components/realtime/AudioWaveform";

interface WritingContent {
  prompt: string;
  guidelines: string[];
}

interface WritingPlayerProps {
  activityId: string;
  language: string;
  content: WritingContent;
}

export function WritingPlayer({ activityId, language, content }: WritingPlayerProps) {
  const [phase, setPhase] = useState<"start" | "dictating" | "review" | "feedback" | "complete">("start");
  const [story, setStory] = useState("");
  const [validation, setValidation] = useState<{ guideline: string; met: boolean }[]>([]);

  const voiceGuidance = `You are a creative writing coach helping a Grade 1 student.
Story prompt: "${content.prompt}"
Guidelines to validate: ${content.guidelines.join('; ')}
Transcribe exactly what they say, then provide encouraging feedback.`;

  const { client, isConnected, startSession, demoSessionId, audioLevel, frequencyData, isAIPlaying } = useRealtimeDemo({
    demoActivityId: activityId,
    demoType: "writing",
    language: language as "es-PR" | "en-US",
    voiceGuidance,
    onWordTranscription: handleTranscription,
  });

  function handleTranscription(word: string) {
    if (phase === "dictating") {
      setStory(prev => prev ? `${prev} ${word}` : word);
    }
  }

  async function startDictating() {
    console.log("[WritingPlayer] startDictating() called", { isConnected });
    
    if (!isConnected) {
      console.log("[WritingPlayer] Not connected, starting session...");
      await startSession(activityId);
      console.log("[WritingPlayer] startSession() completed");
      await new Promise(resolve => setTimeout(resolve, 800));
      console.log("[WritingPlayer] Connection delay complete");
    }

    console.log("[WritingPlayer] Updating UI to dictating phase");
    setPhase("dictating");
    setStory("");
    
    // Send AI greeting after UI is responsive
    setTimeout(() => {
      console.log("[WritingPlayer] Sending AI introduction");
      client?.sendText(`Let's write a creative story together! I'll help you turn your ideas into words. When you're ready, just start speaking and I'll type everything you say. Your prompt is: ${content.prompt}`);
    }, 500);
  }

  function reviewStory() {
    setPhase("review");
    client?.sendText(`Great! Let me read back what you said: ${story}. Do you want to finish this story or continue adding more?`);
  }

  async function finishStory() {
    setPhase("feedback");

    // Simple validation logic
    const checks = content.guidelines.map(guideline => {
      const words = story.toLowerCase().split(/\s+/);
      let met = false;

      if (guideline.includes("sentence")) {
        const sentences = story.split(/[.!?]+/).filter(s => s.trim().length > 0);
        const count = parseInt(guideline.match(/\d+/)?.[0] || "3");
        met = sentences.length >= count;
      } else if (guideline.includes("word")) {
        const count = parseInt(guideline.match(/\d+/)?.[0] || "20");
        met = words.length >= count;
      } else {
        met = true; // Default to true for complex guidelines
      }

      return { guideline, met };
    });

    setValidation(checks);

    // Log interaction
    if (demoSessionId) {
      await logDemoInteraction(demoSessionId, {
        interaction_type: "story_completion",
        transcript: story,
        metadata: { 
          word_count: story.split(/\s+/).length,
          validation: checks
        }
      });

      await updateDemoSession(demoSessionId, {
        completion_percentage: 100,
        telemetry: { 
          story_length: story.length,
          word_count: story.split(/\s+/).length,
          guidelines_met: checks.filter(c => c.met).length
        }
      });
    }

    const allMet = checks.every(c => c.met);
    if (allMet) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    client?.sendText(`Wonderful story! Let me check your guidelines...`);
    
    setTimeout(() => {
      setPhase("complete");
    }, 3000);
  }

  const wordCount = story.split(/\s+/).filter(w => w).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <PenTool className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold">Creative Writing</h1>
          </div>
          <Badge variant="secondary">{language === "es-PR" ? "Español" : "English"}</Badge>
        </div>

        {phase === "start" && (
          <Card className="p-8 text-center space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Write Your Story</h2>
              <p className="text-muted-foreground">Speak your story out loud and I'll write it down!</p>
            </div>

            <div className="bg-primary/5 border-l-4 border-primary rounded-lg p-4 text-left">
              <p className="font-semibold mb-2">Story Prompt:</p>
              <p className="text-lg">{content.prompt}</p>
            </div>

            <div className="bg-muted/40 rounded-lg p-4 text-left space-y-2">
              <p className="font-semibold">Guidelines:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                {content.guidelines.map((guideline, idx) => (
                  <li key={idx}>{guideline}</li>
                ))}
              </ul>
            </div>

            <Button size="lg" onClick={startDictating} disabled={!isConnected && !client}>
              {isConnected ? "Start Dictating" : "Connecting..."}
            </Button>
          </Card>
        )}

        {phase === "dictating" && (
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <Badge variant="destructive" className="animate-pulse">
                🔴 Recording
              </Badge>
              <div className="flex gap-4 text-sm text-muted-foreground">
                <span>Words: {wordCount}</span>
                <span>Characters: {story.length}</span>
              </div>
            </div>

            <div className="rounded-lg border bg-muted/40 p-4">
              <div className="flex items-center gap-3 mb-2">
                <Mic className="w-5 h-5 text-purple-500 animate-pulse" />
                <span className="font-medium">Recording your story...</span>
              </div>
              <AudioWaveform
                frequencyData={frequencyData}
                audioLevel={audioLevel}
                isActive={true}
              />
            </div>

            <div className="min-h-[200px] bg-white rounded-lg border-2 border-dashed p-6">
              <p className="text-lg leading-relaxed whitespace-pre-wrap">
                {story || "Start speaking to see your story appear here..."}
              </p>
            </div>

            <div className="flex gap-3">
              <Button onClick={reviewStory} disabled={wordCount < 5} className="flex-1">
                Review Story
              </Button>
              <Button onClick={finishStory} disabled={wordCount < 10} variant="secondary">
                Finish & Check
              </Button>
            </div>
          </Card>
        )}

        {phase === "review" && (
          <Card className="p-8 space-y-6">
            <h2 className="text-2xl font-bold">Your Story</h2>
            
            <div className="prose prose-lg max-w-none bg-muted/20 rounded-lg p-6">
              <p className="text-lg leading-relaxed whitespace-pre-wrap">{story}</p>
            </div>

            <div className="flex gap-3">
              <Button onClick={() => setPhase("dictating")} variant="outline" className="flex-1">
                Continue Writing
              </Button>
              <Button onClick={finishStory} className="flex-1">
                Finish Story
              </Button>
            </div>
          </Card>
        )}

        {(phase === "feedback" || phase === "complete") && (
          <Card className="p-8 space-y-6">
            <h2 className="text-2xl font-bold text-center">Story Complete! 🎉</h2>

            <div className="prose prose-lg max-w-none bg-muted/20 rounded-lg p-6">
              <p className="text-lg leading-relaxed whitespace-pre-wrap">{story}</p>
            </div>

            <div className="space-y-3">
              <p className="font-semibold">Guideline Check:</p>
              {validation.map((check, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-muted/40">
                  {check.met ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-orange-500 mt-0.5" />
                  )}
                  <span className="flex-1">{check.guideline}</span>
                </div>
              ))}
            </div>

            {phase === "complete" && (
              <Button size="lg" onClick={() => {
                setPhase("start");
                setStory("");
                setValidation([]);
              }} className="w-full">
                Write Another Story
              </Button>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}
