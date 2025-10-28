import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Sparkles, CheckCircle2 } from "lucide-react";
import confetti from "canvas-confetti";
import { useRealtimeDemo } from "@/hooks/useRealtimeDemo";
import { logDemoInteraction, updateDemoSession } from "@/features/demo/api";

interface SpellingContent {
  word: string;
  letters: string[];
  hints: string[];
}

interface SpellingCoachPlayerProps {
  activityId: string;
  language: string;
  content: SpellingContent;
}

// Letter name mapping for recognition (English and Spanish)
const LETTER_MAP: Record<string, string> = {
  // English letter names
  "a": "A", "ay": "A", "eh": "A",
  "b": "B", "be": "B", "bee": "B",
  "c": "C", "see": "C", "sea": "C",
  "d": "D", "de": "D", "dee": "D",
  "e": "E", "ee": "E",
  "f": "F", "ef": "F", "eff": "F",
  "g": "G", "gee": "G", "jee": "G",
  "h": "H", "aitch": "H", "ache": "H",
  "i": "I", "eye": "I",
  "j": "J", "jay": "J",
  "k": "K", "kay": "K",
  "l": "L", "el": "L", "ell": "L",
  "m": "M", "em": "M",
  "n": "N", "en": "N",
  "o": "O", "oh": "O", "owe": "O",
  "p": "P", "pee": "P",
  "q": "Q", "queue": "Q", "cue": "Q",
  "r": "R", "are": "R", "ar": "R",
  "s": "S", "ess": "S", "ese": "S",
  "t": "T", "tee": "T", "tea": "T",
  "u": "U", "you": "U", "yoo": "U",
  "v": "V", "vee": "V",
  "w": "W", "double": "W", "doubleyou": "W",
  "x": "X", "ex": "X",
  "y": "Y", "why": "Y", "wye": "Y",
  "z": "Z", "zee": "Z", "zed": "Z",
  
  // Spanish letter names
  "efe": "F",
  "elle": "LL",
  "ene": "N",
  "eñe": "Ñ",
  "erre": "R",
  "uvé": "V",
  "doble": "W",
  "equis": "X",
  "ye": "Y",
  "zeta": "Z",
};

// Normalize spoken letter to actual letter
function normalizeLetter(spoken: string): string | null {
  const normalized = spoken.toLowerCase().trim();
  
  // Direct single letter
  if (normalized.length === 1 && /[a-z]/i.test(normalized)) {
    return normalized.toUpperCase();
  }
  
  // Look up in letter map
  return LETTER_MAP[normalized] || null;
}

export function SpellingCoachPlayer({ activityId, language, content }: SpellingCoachPlayerProps) {
  const [phase, setPhase] = useState<"start" | "spelling" | "complete">("start");
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [spokenLetters, setSpokenLetters] = useState<string[]>([]);
  const [lastAttempt, setLastAttempt] = useState<{ letter: string; correct: boolean } | null>(null);

  const { client, isConnected, startSession, demoSessionId } = useRealtimeDemo({
    demoActivityId: activityId,
    demoType: "spelling",
    language: language as "es-PR" | "en-US",
    voiceGuidance:
      "You are a friendly spelling coach. Encourage the student as they spell each letter. Celebrate correct letters and gently guide them if they make a mistake.",
    onWordTranscription: handleLetterAttempt,
  });

  function handleLetterAttempt(word: string, _timestamp: number, confidence: number) {
    if (phase !== "spelling") return;

    const expectedLetter = content.letters[currentLetterIndex];
    const spokenLetter = normalizeLetter(word);

    console.log(`[SpellingCoachPlayer] Letter attempt:`, {
      spoken: word,
      normalized: spokenLetter,
      expected: expectedLetter,
      confidence,
    });

    if (!spokenLetter) {
      console.log(`[SpellingCoachPlayer] Could not recognize letter from: ${word}`);
      return;
    }

    const isCorrect = spokenLetter === expectedLetter;
    setLastAttempt({ letter: spokenLetter, correct: isCorrect });

    if (demoSessionId) {
      logDemoInteraction(demoSessionId, {
        interaction_type: "spelling_letter",
        transcript: word,
        metadata: {
          letter_index: currentLetterIndex,
          expected_letter: expectedLetter,
          spoken_letter: spokenLetter,
          correct: isCorrect,
          confidence,
        },
      }).catch((err) => console.warn("Failed to log spelling attempt", err));
    }

    if (isCorrect) {
      setSpokenLetters((prev) => [...prev, spokenLetter]);
      client?.sendText(`Correct! ${spokenLetter}!`);

      setTimeout(() => {
        setLastAttempt(null);
        
        if (currentLetterIndex < content.letters.length - 1) {
          // Move to next letter
          setCurrentLetterIndex((prev) => prev + 1);
          client?.sendText(`Great! Next letter?`);
        } else {
          // Word complete!
          finishSpelling();
        }
      }, 1500);
    } else {
      client?.sendText(
        `Not quite. You said ${spokenLetter}, but the next letter is ${expectedLetter}. Try again!`,
      );
      
      setTimeout(() => {
        setLastAttempt(null);
      }, 2000);
    }
  }

  function finishSpelling() {
    setPhase("complete");
    
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
    });

    client?.sendText(
      `Perfect! You spelled ${content.word} correctly: ${content.letters.join(', ')}. Excellent work!`,
    );

    if (demoSessionId) {
      updateDemoSession(demoSessionId, {
        completion_percentage: 100,
        telemetry: {
          demo_type: "spelling",
          word: content.word,
          letters_count: content.letters.length,
        },
      }).catch((err) => console.warn("Failed to update spelling session", err));
    }
  }

  async function startSpelling() {
    if (!isConnected) {
      await startSession(activityId);
      await new Promise((resolve) => setTimeout(resolve, 800));
    }

    setPhase("spelling");
    setCurrentLetterIndex(0);
    setSpokenLetters([]);
    setLastAttempt(null);

    client?.sendText(
      `Let's spell the word ${content.word}! ${content.hints[0]}. What's the first letter?`,
    );

    if (demoSessionId) {
      logDemoInteraction(demoSessionId, {
        interaction_type: "spelling_start",
        transcript: null,
        metadata: {
          word: content.word,
          letters: content.letters,
          language,
        },
      }).catch((err) => console.warn("Failed to log spelling start", err));
    }
  }

  const progressPercentage = ((spokenLetters.length) / content.letters.length) * 100;

  return (
    <div className="space-y-6">
      <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700">
        🔤 Spelling Demo - Letter by Letter
      </Badge>

      {phase === "start" && (
        <Card className="p-12 text-center">
          <Sparkles className="w-16 h-16 mx-auto mb-4 text-green-500" />
          <h2 className="text-2xl font-bold mb-4">Ready to spell?</h2>
          
          <Card className="p-6 mb-6 bg-gradient-to-r from-green-50 to-emerald-50">
            <p className="text-lg font-semibold mb-3">Hints about the word:</p>
            <ul className="space-y-2">
              {content.hints.map((hint, i) => (
                <li key={i} className="text-muted-foreground">💡 {hint}</li>
              ))}
            </ul>
          </Card>

          <Button onClick={startSpelling} size="lg">
            Start Spelling
          </Button>
        </Card>
      )}

      {phase === "spelling" && (
        <Card className="p-8">
          <Progress value={progressPercentage} className="mb-6" />

          <div className="flex items-center justify-center gap-3 mb-8">
            {content.letters.map((letter, i) => {
              const isSpoken = i < spokenLetters.length;
              const isCurrent = i === currentLetterIndex;
              const showAttempt = isCurrent && lastAttempt;

              return (
                <div
                  key={i}
                  className={`
                    w-16 h-16 rounded-lg flex items-center justify-center text-2xl font-bold
                    transition-all duration-300
                    ${isSpoken ? 'bg-green-100 text-green-700 border-2 border-green-400' : 
                      isCurrent ? 'bg-blue-100 text-blue-700 border-2 border-blue-400 animate-pulse' :
                      'bg-muted text-muted-foreground border-2 border-transparent'}
                  `}
                >
                  {isSpoken ? (
                    <div className="flex flex-col items-center">
                      <span>{letter}</span>
                      <CheckCircle2 className="w-4 h-4 text-green-600 absolute -bottom-1" />
                    </div>
                  ) : isCurrent && showAttempt ? (
                    <span className={lastAttempt.correct ? 'text-green-600' : 'text-red-600'}>
                      {lastAttempt.letter}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">_</span>
                  )}
                </div>
              );
            })}
          </div>

          <div className="text-center space-y-4">
            <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
              <p className="text-lg font-semibold mb-2">
                {spokenLetters.length === 0 ? "What's the first letter?" : "What's the next letter?"}
              </p>
              <p className="text-sm text-muted-foreground">
                Say the letter name out loud (e.g., "S", "O", "L")
              </p>
            </div>

            {lastAttempt && (
              <Card className={`p-4 ${lastAttempt.correct ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <p className={`font-semibold ${lastAttempt.correct ? 'text-green-700' : 'text-red-700'}`}>
                  {lastAttempt.correct ? `✓ Correct! ${lastAttempt.letter}` : `✗ Not quite, try again!`}
                </p>
              </Card>
            )}
          </div>
        </Card>
      )}

      {phase === "complete" && (
        <Card className="p-8 bg-gradient-to-r from-green-50 to-emerald-50">
          <h3 className="text-2xl font-bold text-center mb-6">🎉 Perfect Spelling!</h3>
          
          <div className="flex justify-center gap-2 mb-6">
            {content.letters.map((letter, i) => (
              <div
                key={i}
                className="w-16 h-16 rounded-lg bg-green-100 border-2 border-green-400 flex items-center justify-center text-3xl font-bold text-green-700"
              >
                {letter}
              </div>
            ))}
          </div>

          <p className="text-center text-xl font-semibold mb-6 text-green-700">
            {content.word}
          </p>

          <Button onClick={startSpelling} size="lg" className="w-full">
            Spell Again
          </Button>
        </Card>
      )}
    </div>
  );
}
