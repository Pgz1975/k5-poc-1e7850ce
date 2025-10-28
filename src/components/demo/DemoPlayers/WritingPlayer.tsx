import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mic, PenTool, CheckCircle2, XCircle } from "lucide-react";
import confetti from "canvas-confetti";
import { useRealtimeDemo } from "@/hooks/useRealtimeDemo";
import { logDemoInteraction, updateDemoSession } from "@/features/demo/api";

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
  const [validation, setValidation] = useState<Array<{ guideline: string; passed: boolean }>>([]);

  const { client, isConnected, startSession, demoSessionId } = useRealtimeDemo({
    demoActivityId: activityId,
    demoType: "writing",
    language: language as "es-PR" | "en-US",
    voiceGuidance:
      "You are a creative writing coach. Help the student craft their story by transcribing what they say and providing encouraging, constructive feedback on their writing.",
    onWordTranscription: handleTranscription,
  });

  function handleTranscription(word: string) {
    if (phase !== "dictating") return;

    setStory((prev) => {
      const newStory = prev ? `${prev} ${word}` : word;
      console.log(`[WritingPlayer] Transcription updated:`, newStory);
      return newStory;
    });
  }

  async function startDictating() {
    if (!isConnected) {
      await startSession(activityId);
      await new Promise((resolve) => setTimeout(resolve, 800));
    }

    setPhase("dictating");
    setStory("");

    client?.sendText(
      `Ready to write! Start dictating your story based on this prompt: ${content.prompt}`,
    );

    if (demoSessionId) {
      logDemoInteraction(demoSessionId, {
        interaction_type: "writing_start",
        transcript: null,
        metadata: {
          prompt: content.prompt,
          language,
        },
      }).catch((err) => console.warn("Failed to log writing start", err));
    }
  }

  function reviewStory() {
    setPhase("review");
    client?.sendText(
      `Let me read your story back to you: ${story}`,
    );
  }

  async function finishStory() {
    setPhase("feedback");

    // Simple validation logic
    const sentences = story.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const wordCount = story.split(/\s+/).filter(w => w.length > 0).length;

    const guidelineChecks = content.guidelines.map((guideline) => {
      let passed = false;

      if (guideline.toLowerCase().includes("sentence")) {
        const expectedCount = parseInt(guideline.match(/\d+/)?.[0] || "3");
        passed = sentences.length >= expectedCount;
      } else if (guideline.toLowerCase().includes("word")) {
        const expectedWords = parseInt(guideline.match(/\d+/)?.[0] || "10");
        passed = wordCount >= expectedWords;
      } else {
        // For other guidelines, just check if the story is non-empty
        passed = story.length > 20;
      }

      return { guideline, passed };
    });

    setValidation(guidelineChecks);

    const allPassed = guidelineChecks.every(g => g.passed);
    
    if (allPassed) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }

    client?.sendText(
      `Great work on your story! Let me give you feedback on the guidelines: ${guidelineChecks.map(g => `${g.guideline} - ${g.passed ? 'Yes!' : 'Not quite'}`).join('. ')}`,
    );

    if (demoSessionId) {
      logDemoInteraction(demoSessionId, {
        interaction_type: "writing_complete",
        transcript: story,
        metadata: {
          word_count: wordCount,
          sentence_count: sentences.length,
          guidelines_met: guidelineChecks.filter(g => g.passed).length,
          total_guidelines: guidelineChecks.length,
        },
      }).catch((err) => console.warn("Failed to log writing completion", err));

      updateDemoSession(demoSessionId, {
        completion_percentage: 100,
        telemetry: {
          demo_type: "writing",
          story_length: story.length,
          word_count: wordCount,
        },
      }).catch((err) => console.warn("Failed to update writing session", err));
    }

    setTimeout(() => setPhase("complete"), 3000);
  }

  return (
    <div className="space-y-6">
      <Badge variant="outline" className="bg-purple-50 border-purple-200 text-purple-700">
        ✍️ Writing Demo - Creative Expression
      </Badge>

      {phase === "start" && (
        <Card className="p-12 text-center">
          <PenTool className="w-16 h-16 mx-auto mb-4 text-purple-500" />
          <h2 className="text-2xl font-bold mb-4">Ready to create a story?</h2>
          <p className="text-muted-foreground mb-6">
            Speak your story out loud and watch it appear on screen!
          </p>
          
          <Card className="p-6 mb-6 bg-gradient-to-r from-purple-50 to-pink-50">
            <p className="text-lg font-semibold mb-4">Story Prompt:</p>
            <p className="text-xl">{content.prompt}</p>
            
            <div className="mt-6">
              <p className="text-sm font-semibold mb-2">Guidelines:</p>
              <ul className="text-left list-disc list-inside space-y-1">
                {content.guidelines.map((guideline, i) => (
                  <li key={i} className="text-sm text-muted-foreground">{guideline}</li>
                ))}
              </ul>
            </div>
          </Card>

          <Button onClick={startDictating} size="lg">
            <Mic className="w-4 h-4 mr-2" />
            Start Dictating
          </Button>
        </Card>
      )}

      {phase === "dictating" && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <Badge className="bg-red-500">
              <Mic className="w-3 h-3 mr-1 animate-pulse" />
              Recording
            </Badge>
            <Button onClick={reviewStory} variant="outline">
              Pause & Review
            </Button>
          </div>

          <div className="min-h-[300px] p-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg">
            <p className="text-lg leading-relaxed whitespace-pre-wrap">
              {story || "Start speaking to see your story appear..."}
            </p>
          </div>

          <div className="mt-4 flex justify-center">
            <Button onClick={reviewStory} size="lg">
              I'm Done Dictating
            </Button>
          </div>
        </Card>
      )}

      {phase === "review" && (
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4">Your Story:</h3>
          
          <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg mb-6">
            <p className="text-lg leading-relaxed whitespace-pre-wrap">
              {story}
            </p>
          </div>

          <div className="flex gap-4 justify-center">
            <Button onClick={startDictating} variant="outline">
              Continue Writing
            </Button>
            <Button onClick={finishStory} size="lg">
              Finish Story
            </Button>
          </div>
        </Card>
      )}

      {(phase === "feedback" || phase === "complete") && (
        <Card className="p-8">
          <h3 className="text-2xl font-bold text-center mb-6">
            {validation.every(g => g.passed) ? "🎉 Amazing Story!" : "✨ Great Effort!"}
          </h3>

          <div className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
            <p className="text-lg leading-relaxed whitespace-pre-wrap">
              {story}
            </p>
          </div>

          <div className="space-y-3 mb-6">
            <p className="font-semibold">Guideline Checklist:</p>
            {validation.map((item, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 p-3 rounded-lg ${
                  item.passed ? 'bg-green-50' : 'bg-amber-50'
                }`}
              >
                {item.passed ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                )}
                <span className={item.passed ? 'text-green-700' : 'text-amber-700'}>
                  {item.guideline}
                </span>
              </div>
            ))}
          </div>

          {phase === "complete" && (
            <Button onClick={() => {
              setPhase("start");
              setStory("");
              setValidation([]);
            }} size="lg" className="w-full">
              Write Another Story
            </Button>
          )}
        </Card>
      )}
    </div>
  );
}
