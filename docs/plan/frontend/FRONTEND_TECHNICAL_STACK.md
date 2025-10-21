# Frontend Technical Stack - K-5 Educational Platform

## Overview
Complete technical specification for the React/TypeScript frontend architecture, including libraries, state management, performance optimization, and deployment strategy for a bilingual K-5 educational platform.

## 1. Core Technology Stack

### Base Framework

```json
{
  "framework": "React 18.3+",
  "language": "TypeScript 5.3+",
  "buildTool": "Vite 5.0+",
  "nodeVersion": "20 LTS",
  "packageManager": "npm 10+"
}
```

**Rationale:**
- **React 18**: Concurrent rendering, automatic batching, improved hydration
- **TypeScript**: Type safety, better developer experience, fewer runtime errors
- **Vite**: Fast HMR, optimized builds, native ESM support
- **Node 20 LTS**: Long-term support, stable, modern features

### Project Structure

```
/src
├── /api                    # API clients and services
│   ├── /supabase          # Supabase client
│   ├── /voice             # Voice recognition APIs
│   └── /analytics         # Analytics services
├── /assets                # Static assets
│   ├── /images            # Images, illustrations
│   ├── /sounds            # Audio files
│   └── /fonts             # Custom fonts
├── /components            # Reusable components
│   ├── /ui                # Base UI components (shadcn/ui)
│   ├── /layout            # Layout components
│   ├── /reading           # Reading-specific components
│   ├── /gamification      # Badges, progress, rewards
│   └── /shared            # Shared utilities
├── /contexts              # React contexts
│   ├── LanguageContext.tsx
│   ├── AuthContext.tsx
│   ├── ThemeContext.tsx
│   └── ProgressContext.tsx
├── /hooks                 # Custom React hooks
│   ├── useVoiceRecognition.ts
│   ├── useReadingExercise.ts
│   ├── useProgress.ts
│   └── useGamification.ts
├── /lib                   # Utility libraries
│   ├── /audio             # Audio processing
│   ├── /voice             # Voice analysis
│   ├── /i18n              # Internationalization
│   └── /utils             # General utilities
├── /pages                 # Page components
│   ├── Dashboard.tsx
│   ├── ReadingExercise.tsx
│   ├── Progress.tsx
│   └── ParentView.tsx
├── /store                 # State management
│   ├── /slices            # Redux slices
│   └── store.ts           # Redux store config
├── /types                 # TypeScript types
│   ├── reading.ts
│   ├── user.ts
│   └── gamification.ts
├── /styles               # Global styles
│   ├── globals.css
│   └── themes.css
└── App.tsx               # Root component
```

## 2. UI Component Library

### shadcn/ui + Custom Components

```bash
# Install shadcn/ui
npx shadcn-ui@latest init

# Add base components
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add progress
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add avatar
npx shadcn-ui@latest add badge
```

**Component Configuration:**

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        coquiGreen: {
          50: '#E6F7EF',
          100: '#B3E8D1',
          200: '#80D9B3',
          300: '#4DCA95',
          400: '#26BB7D',
          500: '#00AC65',
          600: '#009657',
          700: '#008049',
          800: '#006A3B',
          900: '#00542D',
        },
        caribbeanBlue: {
          50: '#E6F7FF',
          100: '#B3E4FF',
          200: '#80D1FF',
          300: '#4DBEFF',
          400: '#26AEFF',
          500: '#009EFF',
          600: '#0088E0',
          700: '#0072C1',
          800: '#005CA2',
          900: '#004683',
        },
        sunnyYellow: {
          50: '#FFFEF0',
          100: '#FFF9C4',
          200: '#FFF59D',
          300: '#FFF176',
          400: '#FFEE58',
          500: '#FFEB3B',
          600: '#FDD835',
          700: '#FBC02D',
          800: '#F9A825',
          900: '#F57F17',
        },
      },
      fontFamily: {
        primary: ['Poppins', 'Nunito', 'sans-serif'],
        reading: ['OpenDyslexic', 'Comic Neue', 'Arial Rounded MT Bold', 'sans-serif'],
        decorative: ['Fredoka One', 'Baloo 2', 'cursive'],
      },
      fontSize: {
        // K-1 sizes
        'k1-body': '1.5rem',
        'k1-heading': '3rem',
        // Grade 2-3 sizes
        'g23-body': '1.25rem',
        'g23-heading': '2.5rem',
        // Grade 4-5 sizes
        'g45-body': '1.125rem',
        'g45-heading': '2rem',
      },
      animation: {
        'bounce-once': 'bounce 1s ease-out 1',
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'scale-in': 'scaleIn 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
```

## 3. State Management

### Redux Toolkit

```typescript
// /store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import authReducer from './slices/authSlice';
import readingReducer from './slices/readingSlice';
import progressReducer from './slices/progressSlice';
import gamificationReducer from './slices/gamificationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    reading: readingReducer,
    progress: progressReducer,
    gamification: gamificationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['reading/setAudioElement'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.audio'],
        // Ignore these paths in the state
        ignoredPaths: ['reading.audioElement'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

```typescript
// /store/slices/readingSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ReadingExercise } from '@/types/reading';

interface ReadingState {
  currentExercise: ReadingExercise | null;
  exerciseIndex: number;
  mode: 'reading' | 'practice' | 'comprehension' | 'complete';
  currentWordIndex: number;
  pronunciationScore: number;
  wordStatuses: Map<number, WordStatus>;
  isListening: boolean;
}

const initialState: ReadingState = {
  currentExercise: null,
  exerciseIndex: 0,
  mode: 'reading',
  currentWordIndex: -1,
  pronunciationScore: 0,
  wordStatuses: new Map(),
  isListening: false,
};

export const readingSlice = createSlice({
  name: 'reading',
  initialState,
  reducers: {
    setExercise: (state, action: PayloadAction<ReadingExercise>) => {
      state.currentExercise = action.payload;
    },
    setMode: (state, action: PayloadAction<ReadingState['mode']>) => {
      state.mode = action.payload;
    },
    setCurrentWord: (state, action: PayloadAction<number>) => {
      state.currentWordIndex = action.payload;
    },
    updatePronunciationScore: (state, action: PayloadAction<number>) => {
      state.pronunciationScore = action.payload;
    },
    setWordStatus: (state, action: PayloadAction<{ index: number; status: WordStatus }>) => {
      state.wordStatuses.set(action.payload.index, action.payload.status);
    },
    setListening: (state, action: PayloadAction<boolean>) => {
      state.isListening = action.payload;
    },
    resetExercise: (state) => {
      state.mode = 'reading';
      state.currentWordIndex = -1;
      state.pronunciationScore = 0;
      state.wordStatuses = new Map();
      state.isListening = false;
    },
  },
});

export const {
  setExercise,
  setMode,
  setCurrentWord,
  updatePronunciationScore,
  setWordStatus,
  setListening,
  resetExercise,
} = readingSlice.actions;

export default readingSlice.reducer;
```

## 4. Animation Library

### Framer Motion

```bash
npm install framer-motion
```

```typescript
// /components/shared/AnimatedPage.tsx
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedPageProps {
  children: ReactNode;
  className?: string;
}

export const AnimatedPage: React.FC<AnimatedPageProps> = ({ children, className }) => {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

// Usage in pages
import { AnimatedPage } from '@/components/shared/AnimatedPage';

export const Dashboard = () => {
  return (
    <AnimatedPage>
      {/* Page content */}
    </AnimatedPage>
  );
};
```

### Lottie Animations

```bash
npm install lottie-react
```

```typescript
// /components/shared/LottieAnimation.tsx
import Lottie from 'lottie-react';

interface LottieAnimationProps {
  animationData: any;
  loop?: boolean;
  autoplay?: boolean;
  className?: string;
}

export const LottieAnimation: React.FC<LottieAnimationProps> = ({
  animationData,
  loop = true,
  autoplay = true,
  className,
}) => {
  return (
    <Lottie
      animationData={animationData}
      loop={loop}
      autoplay={autoplay}
      className={className}
    />
  );
};

// Usage: Coquí celebration animation
import celebrationAnimation from '@/assets/animations/coqui-celebration.json';

<LottieAnimation
  animationData={celebrationAnimation}
  loop={false}
  className="w-64 h-64"
/>
```

## 5. Audio & Voice Recognition

### Web Speech API

```typescript
// /hooks/useVoiceRecognition.ts
import { useState, useCallback, useRef, useEffect } from 'react';

interface VoiceRecognitionOptions {
  language: 'es-PR' | 'en-US';
  continuous?: boolean;
  interimResults?: boolean;
}

export const useVoiceRecognition = (language: 'es' | 'en' = 'es') => {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [confidence, setConfidence] = useState(0);
  const [isSupported, setIsSupported] = useState(true);

  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    // Check browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    // Initialize recognition
    const recognition = new SpeechRecognition();
    recognition.lang = language === 'es' ? 'es-PR' : 'en-US';
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const result = event.results[event.results.length - 1];
      const transcriptText = result[0].transcript;
      const confidenceScore = result[0].confidence;

      setTranscript(transcriptText);
      setConfidence(confidenceScore);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, [language]);

  const startListening = useCallback(async () => {
    if (!recognitionRef.current) return;

    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });

      setTranscript('');
      setConfidence(0);
      recognitionRef.current.start();
      setIsListening(true);
    } catch (error) {
      console.error('Microphone access denied:', error);
    }
  }, []);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;

    recognitionRef.current.stop();
    setIsListening(false);

    return { transcript, confidence };
  }, [transcript, confidence]);

  return {
    transcript,
    confidence,
    isListening,
    isSupported,
    startListening,
    stopListening,
  };
};
```

### Audio Playback

```typescript
// /hooks/useAudio.ts
import { useState, useCallback, useRef, useEffect } from 'react';

export const useAudio = (audioUrl: string) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio(audioUrl);

    audio.addEventListener('loadedmetadata', () => {
      setDuration(audio.duration);
    });

    audio.addEventListener('timeupdate', () => {
      setCurrentTime(audio.currentTime);
    });

    audio.addEventListener('ended', () => {
      setIsPlaying(false);
      setCurrentTime(0);
    });

    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, [audioUrl]);

  const play = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.play();
    setIsPlaying(true);
  }, []);

  const pause = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setIsPlaying(false);
  }, []);

  const stop = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
    setCurrentTime(0);
  }, []);

  const seek = useCallback((time: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  }, []);

  return {
    isPlaying,
    currentTime,
    duration,
    play,
    pause,
    stop,
    seek,
  };
};
```

## 6. Real-Time Database (Supabase)

### Supabase Client Setup

```typescript
// /lib/supabase/client.ts
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});
```

### Real-Time Subscriptions

```typescript
// /hooks/useRealtimeProgress.ts
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

export const useRealtimeProgress = (userId: string) => {
  const [progress, setProgress] = useState<any>(null);
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  useEffect(() => {
    // Subscribe to progress updates
    const progressChannel = supabase
      .channel(`progress:${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_progress',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log('Progress updated:', payload);
          setProgress(payload.new);
        }
      )
      .subscribe();

    setChannel(progressChannel);

    // Cleanup
    return () => {
      progressChannel.unsubscribe();
    };
  }, [userId]);

  return { progress };
};
```

## 7. Internationalization (i18n)

### react-i18next Setup

```bash
npm install react-i18next i18next
```

```typescript
// /lib/i18n/config.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationES from './locales/es/translation.json';
import translationEN from './locales/en/translation.json';

const resources = {
  es: {
    translation: translationES,
  },
  en: {
    translation: translationEN,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'es',
    supportedLngs: ['es', 'en'],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
```

```typescript
// /contexts/LanguageContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface LanguageContextType {
  language: 'es' | 'en';
  setLanguage: (lang: 'es' | 'en') => void;
  t: (key: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { i18n, t: translate } = useTranslation();
  const [language, setLanguageState] = useState<'es' | 'en'>(
    (i18n.language as 'es' | 'en') || 'es'
  );

  const setLanguage = (lang: 'es' | 'en') => {
    i18n.changeLanguage(lang);
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  // Simplified translation helper
  const t = (spanish: string, english?: string): string => {
    return language === 'es' ? spanish : (english || spanish);
  };

  useEffect(() => {
    const savedLang = localStorage.getItem('language') as 'es' | 'en';
    if (savedLang) {
      setLanguage(savedLang);
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
```

## 8. PWA (Progressive Web App)

### Vite PWA Plugin

```bash
npm install vite-plugin-pwa workbox-window -D
```

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'K-5 Reading Platform',
        short_name: 'K5 Reading',
        description: 'Bilingual reading platform for K-5 students in Puerto Rico',
        theme_color: '#00AC65',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/icons/icon-72x72.png',
            sizes: '72x72',
            type: 'image/png',
          },
          {
            src: '/icons/icon-96x96.png',
            sizes: '96x96',
            type: 'image/png',
          },
          {
            src: '/icons/icon-128x128.png',
            sizes: '128x128',
            type: 'image/png',
          },
          {
            src: '/icons/icon-144x144.png',
            sizes: '144x144',
            type: 'image/png',
          },
          {
            src: '/icons/icon-152x152.png',
            sizes: '152x152',
            type: 'image/png',
          },
          {
            src: '/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icons/icon-384x384.png',
            sizes: '384x384',
            type: 'image/png',
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\./,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24, // 24 hours
              },
            },
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
            },
          },
          {
            urlPattern: /\.(?:mp3|wav|ogg)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'audio-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
            },
          },
        ],
      },
    }),
  ],
});
```

## 9. Performance Optimization

### Code Splitting & Lazy Loading

```typescript
// App.tsx
import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

// Lazy load pages
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const ReadingExercise = lazy(() => import('@/pages/ReadingExercise'));
const Progress = lazy(() => import('@/pages/Progress'));
const ParentView = lazy(() => import('@/pages/ParentView'));
const TeacherView = lazy(() => import('@/pages/TeacherView'));

function App() {
  return (
    <Router>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/reading/:id" element={<ReadingExercise />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/parent" element={<ParentView />} />
          <Route path="/teacher" element={<TeacherView />} />
        </Routes>
      </Suspense>
    </Router>
  );
}
```

### Image Optimization

```typescript
// /components/shared/OptimizedImage.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className,
  width,
  height,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`relative ${className}`}>
      {/* Blur placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-neutral-200 animate-pulse rounded-lg" />
      )}

      {/* Actual image */}
      <motion.img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className={className}
      />
    </div>
  );
};
```

### Bundle Analysis

```bash
npm install rollup-plugin-visualizer -D
```

```typescript
// vite.config.ts
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    // ... other plugins
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
});
```

## 10. Testing Setup

### Vitest + React Testing Library

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
  },
});
```

```typescript
// /src/test/setup.ts
import '@testing-library/jest-dom';
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Cleanup after each test
afterEach(() => {
  cleanup();
});
```

## 11. Build & Deployment

### Environment Variables

```.env
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Analytics
VITE_ANALYTICS_ID=your-analytics-id

# Feature Flags
VITE_ENABLE_VOICE_RECOGNITION=true
VITE_ENABLE_OFFLINE_MODE=true
```

### Build Configuration

```json
// package.json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "format": "prettier --write \"src/**/*.{ts,tsx,css}\"",
    "analyze": "vite-bundle-visualizer"
  }
}
```

### Deployment (Vercel)

```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "routes": [
    {
      "src": "/[^.]+",
      "dest": "/",
      "status": 200
    }
  ],
  "env": {
    "VITE_SUPABASE_URL": "@supabase-url",
    "VITE_SUPABASE_ANON_KEY": "@supabase-anon-key"
  }
}
```

## 12. Development Tools

### Essential VS Code Extensions

```json
// .vscode/extensions.json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "dsznajder.es7-react-js-snippets",
    "ms-vscode.vscode-typescript-next"
  ]
}
```

### ESLint Configuration

```typescript
// .eslintrc.cjs
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
  },
};
```

## 13. Success Metrics

1. **Build Performance:**
   - Bundle size < 500KB (gzipped)
   - First Contentful Paint < 1.5s
   - Time to Interactive < 3s
   - Lighthouse score > 90

2. **Runtime Performance:**
   - 60fps animations
   - <100ms interaction response
   - <3s page transitions

3. **Code Quality:**
   - 80%+ test coverage
   - 0 ESLint errors
   - Type-safe (100% TypeScript)

4. **Accessibility:**
   - WCAG 2.1 AA compliance
   - Keyboard navigation
   - Screen reader support

---

This technical stack provides a modern, performant, and maintainable foundation for the K-5 educational platform while ensuring excellent developer experience and user satisfaction.
