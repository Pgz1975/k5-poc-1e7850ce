import { useState, useCallback } from 'react';
import { readingExercises, ReadingExercise } from '@/data/readingExercises';

export type ReadingMode = 'listen' | 'practice' | 'comprehension' | 'complete';
export type WordStatus = 'pending' | 'current' | 'correct' | 'close' | 'incorrect' | 'completed';

interface UseReadingExerciseReturn {
  currentExercise: ReadingExercise;
  exerciseIndex: number;
  mode: ReadingMode;
  currentWordIndex: number;
  pronunciationScore: number;
  wordStatuses: WordStatus[];
  comprehensionAnswers: number[];
  currentQuestionIndex: number;
  streakDays: number;
  pointsEarned: number;
  
  // Actions
  nextExercise: () => void;
  previousExercise: () => void;
  setMode: (mode: ReadingMode) => void;
  startListening: () => void;
  startPracticing: () => void;
  handleWordPronunciation: (score: number) => void;
  selectWord: (index: number) => void;
  answerQuestion: (answerIndex: number) => void;
  resetExercise: () => void;
}

export const useReadingExercise = (): UseReadingExerciseReturn => {
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [mode, setMode] = useState<ReadingMode>('listen');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [pronunciationScore, setPronunciationScore] = useState(0);
  const [wordStatuses, setWordStatuses] = useState<WordStatus[]>([]);
  const [comprehensionAnswers, setComprehensionAnswers] = useState<number[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [streakDays] = useState(5);
  const [pointsEarned, setPointsEarned] = useState(45);

  const currentExercise = readingExercises[exerciseIndex];

  const nextExercise = useCallback(() => {
    if (exerciseIndex < readingExercises.length - 1) {
      setExerciseIndex(prev => prev + 1);
      resetExercise();
    }
  }, [exerciseIndex]);

  const previousExercise = useCallback(() => {
    if (exerciseIndex > 0) {
      setExerciseIndex(prev => prev - 1);
      resetExercise();
    }
  }, [exerciseIndex]);

  const startListening = useCallback(() => {
    setMode('listen');
    setCurrentWordIndex(0);
  }, []);

  const startPracticing = useCallback(() => {
    setMode('practice');
    setCurrentWordIndex(0);
    setPronunciationScore(0);
    setWordStatuses([]);
  }, []);

  const handleWordPronunciation = useCallback((score: number) => {
    setWordStatuses(prev => {
      const newStatuses = [...prev];
      if (score >= 90) {
        newStatuses[currentWordIndex] = 'correct';
      } else if (score >= 70) {
        newStatuses[currentWordIndex] = 'close';
      } else {
        newStatuses[currentWordIndex] = 'incorrect';
      }
      return newStatuses;
    });

    setPronunciationScore(prev => {
      const newScore = Math.round((prev * currentWordIndex + score) / (currentWordIndex + 1));
      return newScore;
    });

    // Move to next word or comprehension
    const words = (currentExercise.textEn || currentExercise.textEs).split(' ');
    if (currentWordIndex < words.length - 1) {
      setCurrentWordIndex(prev => prev + 1);
    } else {
      setMode('comprehension');
      setPointsEarned(prev => prev + Math.round(score / 10));
    }
  }, [currentWordIndex, currentExercise]);

  const selectWord = useCallback((index: number) => {
    setCurrentWordIndex(index);
  }, []);

  const answerQuestion = useCallback((answerIndex: number) => {
    setComprehensionAnswers(prev => [...prev, answerIndex]);
    
    if (currentQuestionIndex < 2) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setMode('complete');
      setPointsEarned(prev => prev + 10);
    }
  }, [currentQuestionIndex]);

  const resetExercise = useCallback(() => {
    setMode('listen');
    setCurrentWordIndex(0);
    setPronunciationScore(0);
    setWordStatuses([]);
    setComprehensionAnswers([]);
    setCurrentQuestionIndex(0);
  }, []);

  return {
    currentExercise,
    exerciseIndex,
    mode,
    currentWordIndex,
    pronunciationScore,
    wordStatuses,
    comprehensionAnswers,
    currentQuestionIndex,
    streakDays,
    pointsEarned,
    
    nextExercise,
    previousExercise,
    setMode,
    startListening,
    startPracticing,
    handleWordPronunciation,
    selectWord,
    answerQuestion,
    resetExercise
  };
};
