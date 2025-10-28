import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useRealtimeDemo } from "@/hooks/useRealtimeDemo";
import { logDemoInteraction, updateDemoSession } from "@/features/demo/api";
import confetti from "canvas-confetti";
import { Sparkles, CheckCircle2, XCircle, Mic } from "lucide-react";
import { AudioWaveform } from "@/components/realtime/AudioWaveform";

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

// Enhanced letter mapping for English and Spanish
const LETTER_MAP: Record<string, string> = {
  // English letter names
  "a": "A", "ay": "A", "eh": "A",
  "b": "B", "bee": "B", "be": "B",
  "c": "C", "see": "C", "sea": "C",
  "d": "D", "dee": "D", "de": "D",
  "e": "E", "ee": "E",
  "f": "F", "eff": "F", "ef": "F",
  "g": "G", "gee": "G", "ge": "G",
  "h": "H", "aitch": "H", "ache": "H",
  "i": "I", "eye": "I",
  "j": "J", "jay": "J",
  "k": "K", "kay": "K",
  "l": "L", "ell": "L", "el": "L",
  "m": "M", "em": "M",
  "n": "N", "en": "N",
  "o": "O", "oh": "O",
  "p": "P", "pee": "P", "pe": "P",
  "q": "Q", "cue": "Q", "queue": "Q",
  "r": "R", "are": "R", "ar": "R",
  "s": "S", "ess": "S", "esses": "S",
  "t": "T", "tee": "T", "tea": "T",
  "u": "U", "you": "U", "yu": "U",
  "v": "V", "vee": "V",
  "w": "W", "double you": "W", "doubleyou": "W",
  "x": "X",
  "y": "Y", "why": "Y", "wye": "Y",
  "z": "Z", "zee": "Z", "zed": "Z",
  
  // Spanish letter names
  "ese letra": "S",
  "efe": "F", "efe letra": "F",
  "ache letra": "H",
  "jota": "J", "jota letra": "J",
  "elle": "LL", "elle letra": "LL",
  "eme": "M", "eme letra": "M",
  "ene letra": "N",
  "eñe": "Ñ",
  "pe letra": "P",
  "cu": "Q", "cu letra": "Q",
  "erre": "R", "ere": "R",
  "te letra": "T",
  "uve": "V", "ve corta": "V",
  "doble ve": "W", "doble uve": "W",
  "equis letra": "X",
  "i griega": "Y", "ye": "Y",
  "zeta letra": "Z",
};

function normalizeLetter(spoken: string): string | null {
  const normalized = spoken.toLowerCase().trim();
  
  // Direct match
  if (LETTER_MAP[normalized]) {
    return LETTER_MAP[normalized];
  }
  
  // Check if it's already a single letter
  if (normalized.length === 1 && /[a-z]/i.test(normalized)) {
    return normalized.toUpperCase();
  }
  
  // Partial matches
  for (const [key, value] of Object.entries(LETTER_MAP)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return value;
    }
  }
  
  return null;
}

export function SpellingCoachPlayer({ activityId, language, content }: SpellingCoachPlayerProps) {
  const [phase, setPhase] = useState<"start" | "spelling" | "complete">("start");
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [spokenLetters, setSpokenLetters] = useState<string[]>([]);
  const [lastAttempt, setLastAttempt] = useState<{ letter: string; correct: boolean; confidence: number } | null>(null);

  const voiceGuidance = `You are a friendly spelling coach for Grade 1 students.
Word to spell: "${content.word}"
Correct letters in order: ${content.letters.join(', ')}
Listen for letter names like "A", "B", "C" or "ay", "bee", "see" in English, or "ese", "efe", "ache" in Spanish.
Celebrate each correct letter enthusiastically! Encourage students when they need to try again.`;

  const { client, isConnected, startSession, demoSessionId, audioLevel, frequencyData, isAIPlaying } = useRealtimeDemo({
    demoActivityId: activityId,
    demoType: "spelling",
    language: language as "es-PR" | "en-US",
    voiceGuidance,
    onWordTranscription: handleLetterAttempt,
  });

  function handleLetterAttempt(word: string, _timestamp: number, confidence: number) {
    if (phase !== "spelling") return;

    console.log("[SpellingCoach] Letter attempt:", { word, confidence });

    const normalizedLetter = normalizeLetter(word);
    if (!normalizedLetter) {
      console.log("[SpellingCoach] Could not normalize:", word);
      return;
    }

    const expectedLetter = content.letters[currentLetterIndex];
    const isCorrect = normalizedLetter === expectedLetter.toUpperCase();

    console.log("[SpellingCoach] Match result:", { 
      normalized: normalizedLetter, 
      expected: expectedLetter, 
      isCorrect 
    });

    setLastAttempt({ letter: normalizedLetter, correct: isCorrect, confidence });

    // Log interaction
    if (demoSessionId) {
      logDemoInteraction(demoSessionId, {
        interaction_type: "letter_attempt",
        transcript: word,
        metadata: { 
          letter_index: currentLetterIndex,
          normalized: normalizedLetter,
          expected: expectedLetter,
          correct: isCorrect,
          confidence
        }
      });
    }

    if (isCorrect) {
      setSpokenLetters(prev => [...prev, normalizedLetter]);
      
      setTimeout(() => {
        setLastAttempt(null);
        
        if (currentLetterIndex < content.letters.length - 1) {
          setCurrentLetterIndex(prev => prev + 1);
          client?.sendText(`Perfect! Next letter!`);
        } else {
          finishSpelling();
        }
      }, 1500);
    } else {
      client?.sendText(`Not quite! The letter is ${expectedLetter}. Try again!`);
      
      setTimeout(() => {
        setLastAttempt(null);
      }, 2000);
    }
  }

  async function startSpelling() {
    if (!isConnected) {
      await startSession(activityId);
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    // AI Introduction
    client?.sendText(`We're going to spell a word together, letter by letter! I'll give you hints, and you tell me each letter. The word is ${content.word}. Here's your first hint: ${content.hints[0]}. What's the first letter?`);
    
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    setPhase("spelling");
    setCurrentLetterIndex(0);
    setSpokenLetters([]);
  }

  function finishSpelling() {
    setPhase("complete");
    
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 }
    });

    client?.sendText(`Fantastic! You spelled the word ${content.word} perfectly! Great job!`);

    if (demoSessionId) {
      updateDemoSession(demoSessionId, {
        completion_percentage: 100,
        telemetry: { 
          word: content.word,
          letters_count: content.letters.length,
          total_attempts: spokenLetters.length
        }
      });
    }
  }

  const progressPercentage = (spokenLetters.length / content.letters.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold">Spelling Coach</h1>
          </div>
          <Badge variant="secondary">{language === "es-PR" ? "Español" : "English"}</Badge>
        </div>

        {phase === "start" && (
          <Card className="p-8 text-center space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Let's Spell Together!</h2>
              <p className="text-muted-foreground">
                I'll give you hints and you tell me each letter
              </p>
            </div>

            <div className="bg-muted/40 rounded-lg p-6">
              <p className="text-sm text-muted-foreground mb-2">Word to spell:</p>
              <p className="text-4xl font-bold text-primary">{content.word.toUpperCase()}</p>
            </div>

            <div className="bg-primary/5 border-l-4 border-primary rounded-lg p-4 text-left space-y-2">
              <p className="font-semibold">Hints:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                {content.hints.map((hint, idx) => (
                  <li key={idx}>{hint}</li>
                ))}
              </ul>
            </div>

            <Button size="lg" onClick={startSpelling} disabled={!isConnected && !client}>
              {isConnected ? "Start Spelling" : "Connecting..."}
            </Button>
          </Card>
        )}

        {phase === "spelling" && (
          <Card className="p-8 space-y-6">
            <Progress value={progressPercentage} className="h-3" />

            <div className="flex items-center justify-center gap-4">
              {content.letters.map((letter, idx) => (
                <div
                  key={idx}
                  className={`w-16 h-20 flex items-center justify-center rounded-lg border-2 text-3xl font-bold transition-all ${
                    idx < spokenLetters.length
                      ? "bg-green-100 border-green-500 text-green-700"
                      : idx === currentLetterIndex
                      ? "bg-primary/10 border-primary border-dashed animate-pulse"
                      : "bg-muted/20 border-muted-foreground/20 text-muted-foreground"
                  }`}
                >
                  {idx < spokenLetters.length ? spokenLetters[idx] : "?"}
                </div>
              ))}
            </div>

            <div className="text-center space-y-2">
              <Badge variant="outline">Letter {currentLetterIndex + 1} of {content.letters.length}</Badge>
              <p className="text-lg text-muted-foreground">
                {content.hints[Math.min(currentLetterIndex, content.hints.length - 1)]}
              </p>
            </div>

            <div className="rounded-lg border bg-muted/40 p-4">
              <div className="flex items-center gap-3 mb-2">
                <Mic className="w-5 h-5 text-green-500" />
                <span className="font-medium">Say the next letter...</span>
              </div>
              <AudioWaveform
                frequencyData={frequencyData}
                audioLevel={audioLevel}
                isActive={true}
              />
            </div>

            {lastAttempt && (
              <Card className="p-4 bg-slate-50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {lastAttempt.correct ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                    <span className="font-semibold">
                      You said: "{lastAttempt.letter}"
                    </span>
                  </div>
                  <span className="text-2xl font-bold">
                    {(lastAttempt.confidence * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full transition-all rounded-full"
                    style={{
                      width: `${lastAttempt.confidence * 100}%`,
                      backgroundColor: lastAttempt.confidence > 0.7 ? '#22c55e' : 
                                     lastAttempt.confidence > 0.4 ? '#f59e0b' : '#ef4444'
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
              <h2 className="text-3xl font-bold text-green-600">Perfect Spelling! 🎉</h2>
              <p className="text-xl text-muted-foreground">
                You spelled <span className="font-bold text-primary">{content.word.toUpperCase()}</span> correctly!
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 text-5xl font-bold text-primary">
              {spokenLetters.map((letter, idx) => (
                <span key={idx} className="animate-bounce" style={{ animationDelay: `${idx * 0.1}s` }}>
                  {letter}
                </span>
              ))}
            </div>

            <Button size="lg" onClick={() => {
              setPhase("start");
              setCurrentLetterIndex(0);
              setSpokenLetters([]);
              setLastAttempt(null);
            }}>
              Spell Again
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
