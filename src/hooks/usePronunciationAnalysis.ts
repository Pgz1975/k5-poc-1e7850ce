import { useMemo } from "react";

interface PronunciationAnalysisProps {
  spokenWord: string;
  targetWord: string;
  confidence: number;
}

export function usePronunciationAnalysis({
  spokenWord,
  targetWord,
  confidence,
}: PronunciationAnalysisProps) {
  return useMemo(() => {
    if (!spokenWord || !targetWord) {
      return {
        phonemeMatch: 0,
        syllableMatch: 0,
        overallScore: 0,
        issues: [] as string[],
      };
    }

    const spoken = spokenWord.toLowerCase();
    const target = targetWord.toLowerCase();

    const spokenPhonemes = spoken.split("");
    const targetPhonemes = target.split("");

    let matchingPhonemes = 0;
    const minLength = Math.min(spokenPhonemes.length, targetPhonemes.length);

    for (let i = 0; i < minLength; i++) {
      if (spokenPhonemes[i] === targetPhonemes[i]) {
        matchingPhonemes += 1;
      }
    }

    const phonemeMatch =
      targetPhonemes.length > 0
        ? matchingPhonemes / targetPhonemes.length
        : 0;

    const syllableMatch = spoken === target ? 1 : phonemeMatch;

    const overallScore = Math.max(
      0,
      Math.min(1, phonemeMatch * 0.6 + syllableMatch * 0.2 + confidence * 0.2),
    );

    const issues: string[] = [];
    if (phonemeMatch < 0.7) {
      issues.push("Some sounds need work");
    }
    if (spoken.length < target.length) {
      issues.push("Missing some sounds");
    }
    if (spoken.length > target.length) {
      issues.push("Added extra sounds");
    }
    if (confidence < 0.8) {
      issues.push("Speak more clearly");
    }

    return {
      phonemeMatch,
      syllableMatch,
      overallScore,
      issues,
    };
  }, [spokenWord, targetWord, confidence]);
}
