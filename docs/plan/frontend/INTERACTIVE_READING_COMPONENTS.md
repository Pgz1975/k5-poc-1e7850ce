# Interactive Reading Components - Technical Specification

## Overview
This document details the React/TypeScript components for interactive reading exercises that utilize PDF-parsed images, voice recognition, and adaptive learning features for K-5 students.

## 1. Component Architecture

### Component Hierarchy
```
ReadingExercisePage
├── ExerciseHeader (level, progress, stats)
├── ContentArea
│   ├── ImagePanel (parsed PDF images)
│   ├── CoquiCompanion (mascot integration)
│   └── TextDisplay (interactive reading)
│       ├── SyllableHighlighter
│       ├── WordHighlighter
│       └── PronunciationFeedback
├── ControlPanel
│   ├── PlaybackControls
│   ├── VoiceRecorder
│   └── NavigationButtons
└── ComprehensionCheck
    ├── QuestionDisplay
    ├── AnswerOptions
    └── FeedbackPanel
```

### Data Flow
```typescript
// Exercise data structure
export interface ReadingExercise {
  id: string;
  level: number;
  levelName: string;

  // Bilingual text
  textEs: string;
  textEn: string;

  // PDF-parsed images
  images: ParsedImage[];

  // Reading metadata
  metadata: {
    wordCount: number;
    syllableCount: number;
    averageWordLength: number;
    readingLevel: number;
    estimatedDuration: number;
  };

  // Comprehension questions
  comprehensionQuestions: {
    es: Question[];
    en: Question[];
  };

  // Vocabulary support
  vocabulary: VocabularyItem[];
}

export interface ParsedImage {
  id: string;
  url: string;
  type: 'illustration' | 'diagram' | 'photo' | 'map';
  pageNumber: number;
  boundingBox: { x: number; y: number; width: number; height: number };

  // Interactive features
  hotspots?: Hotspot[];
  zoomable: boolean;

  // Accessibility
  altText: {
    es: string;
    en: string;
  };
  description: {
    es: string;
    en: string;
  };
}

export interface Hotspot {
  id: string;
  coordinates: { x: number; y: number; width: number; height: number };
  word: string;
  action: 'highlight' | 'define' | 'pronounce' | 'zoom';
  relatedWord?: string;  // Word in text this hotspot relates to
}
```

## 2. Image Display Component

### Interactive Image Panel

```typescript
import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ZoomIn, ZoomOut, Info, Volume2 } from 'lucide-react';
import { ParsedImage, Hotspot } from '@/types/reading';
import { useLanguage } from '@/contexts/LanguageContext';

interface ImagePanelProps {
  images: ParsedImage[];
  currentImageIndex: number;
  onHotspotClick: (hotspot: Hotspot) => void;
  highlightedWord?: string;
}

export const ImagePanel: React.FC<ImagePanelProps> = ({
  images,
  currentImageIndex,
  onHotspotClick,
  highlightedWord
}) => {
  const { language } = useLanguage();
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [showInfo, setShowInfo] = useState(false);

  const currentImage = images[currentImageIndex];

  // Zoom controls
  const handleZoomIn = useCallback(() => {
    setZoomLevel(prev => Math.min(prev + 0.5, 3));
    setIsZoomed(true);
  }, []);

  const handleZoomOut = useCallback(() => {
    const newZoom = Math.max(zoomLevel - 0.5, 1);
    setZoomLevel(newZoom);
    if (newZoom === 1) {
      setIsZoomed(false);
      setPanPosition({ x: 0, y: 0 });
    }
  }, [zoomLevel]);

  // Pan handling for zoomed images
  const handlePan = useCallback((deltaX: number, deltaY: number) => {
    if (!isZoomed) return;
    setPanPosition(prev => ({
      x: prev.x + deltaX,
      y: prev.y + deltaY
    }));
  }, [isZoomed]);

  // Hotspot click handler
  const handleHotspotActivation = useCallback((hotspot: Hotspot) => {
    onHotspotClick(hotspot);

    // Visual feedback
    const element = document.getElementById(`hotspot-${hotspot.id}`);
    if (element) {
      element.classList.add('hotspot-activated');
      setTimeout(() => element.classList.remove('hotspot-activated'), 500);
    }
  }, [onHotspotClick]);

  return (
    <div className="image-panel relative rounded-3xl overflow-hidden bg-gradient-to-br from-neutral-50 to-neutral-100 shadow-lg">
      {/* Image Container */}
      <motion.div
        className="image-container relative w-full aspect-[4/3] overflow-hidden cursor-zoom-in"
        animate={{
          scale: zoomLevel,
          x: panPosition.x,
          y: panPosition.y
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        drag={isZoomed}
        dragConstraints={{ left: -200, right: 200, top: -200, bottom: 200 }}
        onDrag={(e, info) => handlePan(info.offset.x, info.offset.y)}
      >
        {/* Main Image */}
        <img
          src={currentImage.url}
          alt={currentImage.altText[language]}
          className="w-full h-full object-contain"
          loading="lazy"
        />

        {/* Interactive Hotspots */}
        {currentImage.hotspots?.map((hotspot) => (
          <motion.button
            key={hotspot.id}
            id={`hotspot-${hotspot.id}`}
            className={`
              absolute rounded-lg border-4
              ${hotspot.relatedWord === highlightedWord
                ? 'border-sunnyYellow-500 bg-sunnyYellow-500/30'
                : 'border-coquiGreen-500 bg-coquiGreen-500/20'
              }
              hover:bg-coquiGreen-500/40
              transition-all duration-200
              cursor-pointer
              touch-manipulation
              min-w-[44px] min-h-[44px]
            `}
            style={{
              left: `${hotspot.coordinates.x}%`,
              top: `${hotspot.coordinates.y}%`,
              width: `${hotspot.coordinates.width}%`,
              height: `${hotspot.coordinates.height}%`
            }}
            onClick={() => handleHotspotActivation(hotspot)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={{
              boxShadow: hotspot.relatedWord === highlightedWord
                ? ['0 0 0 0px rgba(255, 235, 59, 0.7)', '0 0 0 10px rgba(255, 235, 59, 0)']
                : '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}
            transition={{
              boxShadow: {
                repeat: Infinity,
                duration: 1.5
              }
            }}
            aria-label={`Interactive area: ${hotspot.word}`}
          >
            {hotspot.action === 'pronounce' && (
              <Volume2 className="text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" size={20} />
            )}
          </motion.button>
        ))}
      </motion.div>

      {/* Control Buttons */}
      <div className="absolute top-4 right-4 flex gap-2">
        {/* Info Button */}
        <motion.button
          className="btn-control bg-white/90 backdrop-blur rounded-full p-3 shadow-lg"
          onClick={() => setShowInfo(!showInfo)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Image information"
        >
          <Info size={24} className="text-caribbeanBlue-600" />
        </motion.button>

        {/* Zoom Controls */}
        {currentImage.zoomable && (
          <>
            <motion.button
              className="btn-control bg-white/90 backdrop-blur rounded-full p-3 shadow-lg"
              onClick={handleZoomIn}
              disabled={zoomLevel >= 3}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Zoom in"
            >
              <ZoomIn size={24} className="text-caribbeanBlue-600" />
            </motion.button>

            <motion.button
              className="btn-control bg-white/90 backdrop-blur rounded-full p-3 shadow-lg"
              onClick={handleZoomOut}
              disabled={zoomLevel <= 1}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Zoom out"
            >
              <ZoomOut size={24} className="text-caribbeanBlue-600" />
            </motion.button>
          </>
        )}
      </div>

      {/* Image Info Panel */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur p-6 rounded-t-3xl shadow-2xl"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 20 }}
          >
            <h3 className="text-xl font-bold mb-2 text-neutral-900">
              {currentImage.altText[language]}
            </h3>
            <p className="text-lg text-neutral-700">
              {currentImage.description[language]}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Accessibility: Zoom level indicator */}
      {isZoomed && (
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur rounded-full px-4 py-2 shadow-lg">
          <span className="text-sm font-semibold text-neutral-900">
            {Math.round(zoomLevel * 100)}%
          </span>
        </div>
      )}
    </div>
  );
};
```

### Image-Word Matching System

```typescript
// Syncs image hotspots with text highlighting
export const useImageTextSync = () => {
  const [highlightedWord, setHighlightedWord] = useState<string | null>(null);
  const [relatedHotspots, setRelatedHotspots] = useState<Hotspot[]>([]);

  const syncImageToWord = useCallback((word: string, images: ParsedImage[]) => {
    setHighlightedWord(word);

    // Find all hotspots related to this word
    const hotspots: Hotspot[] = [];
    images.forEach(image => {
      image.hotspots?.forEach(hotspot => {
        if (hotspot.relatedWord === word) {
          hotspots.push(hotspot);
        }
      });
    });

    setRelatedHotspots(hotspots);
  }, []);

  const clearSync = useCallback(() => {
    setHighlightedWord(null);
    setRelatedHotspots([]);
  }, []);

  return {
    highlightedWord,
    relatedHotspots,
    syncImageToWord,
    clearSync
  };
};
```

## 3. Text Display with Word Highlighting

### Interactive Text Component

```typescript
import React, { useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';

interface TextDisplayProps {
  text: string;
  currentWordIndex: number;
  wordStatuses: Map<number, WordStatus>;
  onWordClick: (index: number, word: string) => void;
  pronunciationScore?: number;
  mode: 'reading' | 'practice' | 'comprehension';
  highlightSyllables?: boolean;
}

type WordStatus = 'pending' | 'current' | 'correct' | 'incorrect' | 'perfect';

export const TextDisplay: React.FC<TextDisplayProps> = ({
  text,
  currentWordIndex,
  wordStatuses,
  onWordClick,
  pronunciationScore = 0,
  mode,
  highlightSyllables = false
}) => {
  // Split text into words with punctuation handling
  const words = useMemo(() => {
    return text.match(/[\w']+|[.,!?;]/g) || [];
  }, [text]);

  // Syllable splitting function (Spanish/English)
  const splitIntoSyllables = useCallback((word: string): string[] => {
    // Simplified syllable splitting
    // Production would use proper phonetic libraries
    const vowels = /[aeiouáéíóúüAEIOUÁÉÍÓÚÜ]/;
    const syllables: string[] = [];
    let currentSyllable = '';

    for (let i = 0; i < word.length; i++) {
      currentSyllable += word[i];

      if (vowels.test(word[i])) {
        // Check if next character is consonant
        if (i + 1 < word.length && !vowels.test(word[i + 1])) {
          currentSyllable += word[i + 1];
          i++;
        }
        syllables.push(currentSyllable);
        currentSyllable = '';
      }
    }

    if (currentSyllable) {
      if (syllables.length > 0) {
        syllables[syllables.length - 1] += currentSyllable;
      } else {
        syllables.push(currentSyllable);
      }
    }

    return syllables;
  }, []);

  // Get word styling based on status
  const getWordStyle = (index: number, status?: WordStatus) => {
    const baseClasses = 'inline-block px-2 py-1 mx-1 my-0.5 rounded-lg transition-all duration-200 cursor-pointer touch-manipulation';

    if (index === currentWordIndex) {
      return `${baseClasses} bg-sunnyYellow-200 text-neutral-900 font-bold scale-110 shadow-lg`;
    }

    switch (status) {
      case 'perfect':
        return `${baseClasses} bg-success-light/30 text-success-dark font-semibold`;
      case 'correct':
        return `${baseClasses} bg-coquiGreen-100 text-coquiGreen-900 font-medium`;
      case 'incorrect':
        return `${baseClasses} bg-error-light/30 text-error-dark`;
      case 'pending':
      default:
        return `${baseClasses} hover:bg-caribbeanBlue-50`;
    }
  };

  // Render word with optional syllable highlighting
  const renderWord = (word: string, index: number) => {
    const status = wordStatuses.get(index);
    const isCurrent = index === currentWordIndex;

    if (highlightSyllables && isCurrent && /[a-záéíóúüñ]/i.test(word)) {
      const syllables = splitIntoSyllables(word);

      return (
        <motion.span
          key={index}
          className={getWordStyle(index, status)}
          onClick={() => onWordClick(index, word)}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {syllables.map((syllable, sIndex) => (
            <motion.span
              key={`${index}-${sIndex}`}
              className="syllable"
              animate={{
                color: ['#212121', '#00AC65', '#212121']
              }}
              transition={{
                duration: 0.6,
                delay: sIndex * 0.2,
                repeat: Infinity,
                repeatDelay: 1
              }}
            >
              {syllable}
            </motion.span>
          ))}
        </motion.span>
      );
    }

    // Regular word rendering
    return (
      <motion.span
        key={index}
        className={getWordStyle(index, status)}
        onClick={() => onWordClick(index, word)}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {word}
      </motion.span>
    );
  };

  return (
    <div className="text-display-container bg-white/80 backdrop-blur rounded-3xl p-8 shadow-lg">
      <div className="text-content text-2xl md:text-3xl leading-relaxed font-reading">
        {words.map((word, index) => renderWord(word, index))}
      </div>

      {/* Pronunciation Score Indicator */}
      {mode === 'practice' && pronunciationScore > 0 && (
        <motion.div
          className="mt-6 flex items-center justify-center gap-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-neutral-700">
              Precisión:
            </span>
            <div className="relative w-32 h-8 bg-neutral-200 rounded-full overflow-hidden">
              <motion.div
                className={`absolute h-full ${
                  pronunciationScore >= 90 ? 'bg-success' :
                  pronunciationScore >= 70 ? 'bg-warning' :
                  'bg-error'
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${pronunciationScore}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
            <span className="text-xl font-bold text-neutral-900">
              {pronunciationScore}%
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
};
```

## 4. Voice Recognition Integration

### Voice Recognition Component

```typescript
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, Pause } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVoiceRecognition } from '@/hooks/useVoiceRecognition';
import { analyzePronunciation } from '@/lib/voice/pronunciationAnalyzer';

interface VoiceRecorderProps {
  text: string;
  language: 'es' | 'en';
  onPronunciationResult: (result: PronunciationResult) => void;
  mode: 'word' | 'sentence' | 'full-text';
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  text,
  language,
  onPronunciationResult,
  mode
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [waveformData, setWaveformData] = useState<number[]>([]);

  const {
    startListening,
    stopListening,
    transcript,
    confidence,
    isSupported
  } = useVoiceRecognition(language);

  // Audio visualization
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyzerRef = useRef<AnalyserNode | null>(null);

  // Initialize audio context for visualization
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyzerRef.current = audioContextRef.current.createAnalyser();
      analyzerRef.current.fftSize = 256;
    }

    return () => {
      audioContextRef.current?.close();
    };
  }, []);

  // Start voice recording
  const handleStartListening = useCallback(async () => {
    try {
      setIsListening(true);
      await startListening();

      // Start audio visualization
      if (analyzerRef.current) {
        const dataArray = new Uint8Array(analyzerRef.current.frequencyBinCount);
        const updateWaveform = () => {
          if (!isListening) return;

          analyzerRef.current!.getByteFrequencyData(dataArray);
          setWaveformData(Array.from(dataArray).slice(0, 20));
          requestAnimationFrame(updateWaveform);
        };
        updateWaveform();
      }
    } catch (error) {
      console.error('Failed to start voice recognition:', error);
      setIsListening(false);
    }
  }, [startListening, isListening]);

  // Stop and process
  const handleStopListening = useCallback(async () => {
    setIsListening(false);
    setIsProcessing(true);

    const result = await stopListening();

    // Analyze pronunciation
    const analysis = await analyzePronunciation({
      expectedText: text,
      spokenText: transcript,
      language,
      confidence
    });

    setIsProcessing(false);
    onPronunciationResult(analysis);
  }, [stopListening, text, transcript, language, confidence, onPronunciationResult]);

  if (!isSupported) {
    return (
      <div className="voice-recorder-error bg-error-light/20 rounded-2xl p-6 text-center">
        <p className="text-error-dark font-semibold">
          Voice recognition is not supported on this device
        </p>
        <p className="text-sm text-neutral-600 mt-2">
          Please use a modern browser with microphone access
        </p>
      </div>
    );
  }

  return (
    <div className="voice-recorder bg-gradient-to-br from-caribbeanBlue-50 to-coquiGreen-50 rounded-3xl p-6 shadow-lg">
      {/* Microphone Button */}
      <div className="flex flex-col items-center gap-4">
        <motion.button
          className={`
            mic-button relative
            w-24 h-24 rounded-full
            flex items-center justify-center
            ${isListening
              ? 'bg-error shadow-lg shadow-error/50'
              : 'bg-coquiGreen-500 shadow-lg shadow-coquiGreen-500/50'
            }
            text-white
            transition-all duration-300
            touch-manipulation
          `}
          onClick={isListening ? handleStopListening : handleStartListening}
          disabled={isProcessing}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          animate={{
            boxShadow: isListening
              ? ['0 0 0 0px rgba(255, 82, 82, 0.7)', '0 0 0 20px rgba(255, 82, 82, 0)']
              : '0 8px 16px rgba(0, 172, 101, 0.3)'
          }}
          transition={{
            boxShadow: {
              repeat: Infinity,
              duration: 1.5
            }
          }}
        >
          {isProcessing ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            >
              <Volume2 size={40} />
            </motion.div>
          ) : isListening ? (
            <MicOff size={40} />
          ) : (
            <Mic size={40} />
          )}
        </motion.button>

        {/* Instructions */}
        <p className="text-lg font-semibold text-center text-neutral-900">
          {isProcessing ? 'Analizando...' :
           isListening ? 'Hablando... Toca para parar' :
           'Toca el micrófono para empezar'}
        </p>

        {/* Waveform Visualization */}
        <AnimatePresence>
          {isListening && (
            <motion.div
              className="waveform flex items-center justify-center gap-1 h-16"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 64 }}
              exit={{ opacity: 0, height: 0 }}
            >
              {waveformData.map((value, index) => (
                <motion.div
                  key={index}
                  className="waveform-bar w-2 bg-coquiGreen-500 rounded-full"
                  animate={{
                    height: `${(value / 255) * 100}%`
                  }}
                  transition={{
                    duration: 0.1
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Transcript Preview */}
        {transcript && (
          <motion.div
            className="transcript-preview bg-white rounded-2xl p-4 max-w-md"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-sm text-neutral-600 mb-1">Escuché:</p>
            <p className="text-lg font-semibold text-neutral-900">{transcript}</p>
            <div className="mt-2 flex items-center gap-2">
              <div className="flex-1 h-2 bg-neutral-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-coquiGreen-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${confidence * 100}%` }}
                />
              </div>
              <span className="text-sm font-medium text-neutral-700">
                {Math.round(confidence * 100)}%
              </span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
```

### Pronunciation Feedback Visualization

```typescript
interface PronunciationFeedbackProps {
  score: number;
  wordAnalysis: WordPronunciationScore[];
  onRetry: () => void;
}

export const PronunciationFeedback: React.FC<PronunciationFeedbackProps> = ({
  score,
  wordAnalysis,
  onRetry
}) => {
  const getFeedbackMessage = (score: number) => {
    if (score >= 95) return { es: '¡Perfecto!', en: 'Perfect!', emoji: '🌟' };
    if (score >= 85) return { es: '¡Excelente!', en: 'Excellent!', emoji: '⭐' };
    if (score >= 75) return { es: '¡Muy bien!', en: 'Very good!', emoji: '👍' };
    if (score >= 60) return { es: '¡Buen trabajo!', en: 'Good job!', emoji: '👏' };
    return { es: '¡Sigue practicando!', en: 'Keep practicing!', emoji: '💪' };
  };

  const feedback = getFeedbackMessage(score);

  return (
    <motion.div
      className="pronunciation-feedback bg-white rounded-3xl p-6 shadow-2xl max-w-2xl mx-auto"
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: 'spring', damping: 15 }}
    >
      {/* Overall Score */}
      <div className="text-center mb-6">
        <motion.div
          className="text-6xl mb-4"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
        >
          {feedback.emoji}
        </motion.div>

        <h3 className="text-3xl font-bold text-neutral-900 mb-2">
          {feedback.es}
        </h3>

        <div className="flex items-center justify-center gap-4">
          <CircularProgress value={score} size={100} />
          <div className="text-left">
            <p className="text-sm text-neutral-600">Tu puntuación</p>
            <p className="text-4xl font-bold text-coquiGreen-600">{score}%</p>
          </div>
        </div>
      </div>

      {/* Word-by-Word Analysis */}
      <div className="word-analysis mb-6">
        <h4 className="text-xl font-semibold text-neutral-900 mb-4">
          Análisis de palabras:
        </h4>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {wordAnalysis.map((word, index) => (
            <motion.div
              key={index}
              className={`
                word-score rounded-xl p-3
                ${word.score >= 90 ? 'bg-success/20 border-2 border-success' :
                  word.score >= 70 ? 'bg-warning/20 border-2 border-warning' :
                  'bg-error/20 border-2 border-error'
                }
              `}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <p className="font-semibold text-lg text-neutral-900 mb-1">
                {word.word}
              </p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-neutral-200 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full ${
                      word.score >= 90 ? 'bg-success' :
                      word.score >= 70 ? 'bg-warning' :
                      'bg-error'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${word.score}%` }}
                    transition={{ delay: index * 0.05 + 0.2, duration: 0.5 }}
                  />
                </div>
                <span className="text-sm font-bold">{word.score}%</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Retry Button */}
      <div className="text-center">
        <motion.button
          className="btn-primary bg-coquiGreen-500 hover:bg-coquiGreen-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg"
          onClick={onRetry}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Intentar de nuevo
        </motion.button>
      </div>
    </motion.div>
  );
};
```

## 5. Progress Animations & Gamification

### Progress Bar with Animations

```typescript
export const ReadingProgressBar: React.FC<{ value: number; total: number }> = ({
  value,
  total
}) => {
  const percentage = (value / total) * 100;

  return (
    <div className="progress-bar-container relative">
      {/* Background Track */}
      <div className="h-6 bg-neutral-200 rounded-full overflow-hidden relative">
        {/* Progress Fill */}
        <motion.div
          className="h-full bg-gradient-to-r from-coquiGreen-500 to-coquiGreen-600 relative overflow-hidden"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {/* Shine effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{
              x: ['-100%', '200%']
            }}
            transition={{
              repeat: Infinity,
              duration: 2,
              ease: 'linear'
            }}
          />
        </motion.div>

        {/* Progress Markers */}
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className="absolute top-0 bottom-0 w-0.5 bg-white/50"
            style={{ left: `${((i + 1) / total) * 100}%` }}
          />
        ))}
      </div>

      {/* Stars at milestones */}
      {Array.from({ length: total }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute top-1/2 -translate-y-1/2"
          style={{ left: `${((i + 1) / total) * 100}%` }}
          initial={{ scale: 0 }}
          animate={{
            scale: value > i ? 1 : 0.5,
            rotate: value > i ? 0 : -45
          }}
          transition={{ delay: i * 0.1 }}
        >
          <Star
            size={24}
            className={`${
              value > i
                ? 'text-sunnyYellow-500 fill-sunnyYellow-500'
                : 'text-neutral-400'
            }`}
          />
        </motion.div>
      ))}
    </div>
  );
};
```

### Achievement Celebration

```typescript
export const AchievementCelebration: React.FC<{
  achievement: Achievement;
  onClose: () => void;
}> = ({ achievement, onClose }) => {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="achievement-card bg-white rounded-3xl p-8 max-w-md mx-4 text-center relative overflow-hidden"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', damping: 10 }}
      >
        {/* Confetti */}
        <ConfettiExplosion />

        {/* Achievement Icon */}
        <motion.div
          className="text-8xl mb-4"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 10, -10, 0]
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatDelay: 1
          }}
        >
          {achievement.emoji}
        </motion.div>

        {/* Title */}
        <h2 className="text-3xl font-bold text-neutral-900 mb-2">
          ¡Logro Desbloqueado!
        </h2>

        {/* Achievement Name */}
        <h3 className="text-2xl font-semibold text-coquiGreen-600 mb-4">
          {achievement.name}
        </h3>

        {/* Description */}
        <p className="text-lg text-neutral-700 mb-6">
          {achievement.description}
        </p>

        {/* Points Earned */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <Star className="text-sunnyYellow-500 fill-sunnyYellow-500" size={32} />
          <span className="text-3xl font-bold text-sunnyYellow-600">
            +{achievement.points}
          </span>
        </div>

        {/* Close Button */}
        <motion.button
          className="btn-primary bg-coquiGreen-500 hover:bg-coquiGreen-600 text-white px-8 py-3 rounded-2xl font-bold"
          onClick={onClose}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ¡Genial!
        </motion.button>
      </motion.div>
    </motion.div>
  );
};
```

## 6. Implementation Checklist

### Phase 1: Core Reading Components (Week 1-2)
- [ ] TextDisplay component with word highlighting
- [ ] ImagePanel with zoom and pan
- [ ] Basic CoquiCompanion integration
- [ ] ControlPanel with navigation

### Phase 2: Voice Integration (Week 3-4)
- [ ] VoiceRecorder component
- [ ] Pronunciation analysis system
- [ ] PronunciationFeedback component
- [ ] Audio visualization

### Phase 3: Interactive Features (Week 5-6)
- [ ] Image hotspots implementation
- [ ] Image-text synchronization
- [ ] Syllable highlighting
- [ ] Word-image matching games

### Phase 4: Progress & Gamification (Week 7-8)
- [ ] Progress animations
- [ ] Achievement system
- [ ] Star collection mechanics
- [ ] Celebration animations

### Phase 5: Polish & Optimization (Week 9-10)
- [ ] Performance optimization
- [ ] Mobile responsiveness
- [ ] Accessibility testing
- [ ] User testing with K-5 students

## Success Metrics

1. **Engagement**: 80%+ completion rate on reading exercises
2. **Pronunciation**: 70%+ average pronunciation accuracy
3. **Image Interaction**: 60%+ students click image hotspots
4. **Voice Usage**: 75%+ prefer voice over typing
5. **Time on Task**: Average 15-20 minutes per exercise
6. **Accessibility**: WCAG 2.1 AA compliance
7. **Performance**: <3s load time, 60fps animations

---

These components create an engaging, interactive reading experience that leverages PDF-parsed images and voice recognition to make learning fun and effective for K-5 students in Puerto Rico.
