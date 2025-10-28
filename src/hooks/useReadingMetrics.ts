import { useMemo } from "react";

type WordState = "pending" | "correct" | "error" | "skipped";

interface Word {
  id: number;
  text: string;
}

interface ReadingMetricsProps {
  words: Word[];
  currentIndex: number;
  wordStates: Map<number, WordState>;
  startTime: number | null;
}

export function useReadingMetrics({
  words,
  currentIndex,
  wordStates,
  startTime,
}: ReadingMetricsProps) {
  return useMemo(() => {
    const totalWords = words.length;
    const readWords = Math.min(currentIndex, totalWords);
    const values = Array.from(wordStates.values());

    const correctWords = values.filter((state) => state === "correct").length;
    const errorWords = values.filter((state) => state === "error").length;
    const skippedWords = values.filter((state) => state === "skipped").length;

    const accuracy = readWords > 0 ? correctWords / readWords : 0;

    let wcpm = 0;
    if (startTime && readWords > 0) {
      const elapsedMinutes = (Date.now() - startTime) / 60000;
      if (elapsedMinutes > 0) {
        wcpm = Math.round(correctWords / elapsedMinutes);
      }
    }

    const fluencyScore = Math.round(
      accuracy * 70 + Math.min(wcpm / 100, 1) * 30,
    );

    return {
      totalWords,
      readWords,
      correctWords,
      errorWords,
      skippedWords,
      accuracy,
      wcpm,
      fluencyScore,
      progress: totalWords === 0 ? 0 : readWords / totalWords,
    };
  }, [words, currentIndex, wordStates, startTime]);
}
