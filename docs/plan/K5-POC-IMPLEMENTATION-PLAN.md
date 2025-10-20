# K5 POC Complete Implementation Plan
## 7-Day Sprint to Bilingual AI Reading Platform

---

## 🎯 Executive Summary

This document outlines the complete implementation strategy for the K5 Reading POC, integrating:
- Hybrid Offline/Online TTS architecture with OpenAI premium voices and offline fallbacks
- Multi-stakeholder dashboard system (Student, Teacher, Parent, Administrator)
- Smart content access strategy for demonstration purposes
- Cost-optimized approach for 551 schools deployment

**Core Deliverable**: A working POC that demonstrates AI-powered bilingual reading assistance with real-time pronunciation feedback, working both online and offline, with measurable ROI for DEPR stakeholders.

---

## 📚 Content Access Strategy Decision

### Recommended Approach for POC: **Hybrid Role-Based with Override**

```javascript
// RECOMMENDED IMPLEMENTATION
const contentAccessStrategy = {
  // Primary: Role-based for authentic demo
  roleBasedAccounts: {
    'studentk@demo.com': { grade: 'K', name: 'Kindergarten Katie' },
    'student1@demo.com': { grade: '1', name: 'First Grade Felix' },
    'student2@demo.com': { grade: '2', name: 'Second Grade Sofia' },
    'student3@demo.com': { grade: '3', name: 'Third Grade Thomas' },
    'student4@demo.com': { grade: '4', name: 'Fourth Grade Fatima' },
    'student5@demo.com': { grade: '5', name: 'Fifth Grade Fernando' }
  },

  // Secondary: Master account for full demo
  masterAccount: {
    'demo@k5pr.com': {
      grade: 'ALL',
      name: 'Demo User',
      canSwitchGrades: true,
      description: 'For comprehensive demonstrations'
    }
  },

  // Teacher accounts see all grades
  teacherAccounts: {
    'teacher@demo.com': { grades: ['K', '1', '2', '3', '4', '5'] }
  }
};
```

### Why This Approach Works Best:

1. **Authentic Experience**: Stakeholders see real grade-level isolation
2. **Demo Flexibility**: Master account allows showing full platform capabilities
3. **Quick Testing**: Individual grade accounts for focused demos
4. **Realistic Scenarios**: Teachers naturally see all grades they teach

---

## 🏗️ Technical Architecture Implementation

### Phase 1: Core TTS System (Day 1-2)

#### 1.1 Smart TTS Manager Setup

```javascript
// /src/services/tts/SmartBilingualTTS.js

export class SmartBilingualTTS {
  constructor(config) {
    this.config = {
      openaiKey: import.meta.env.VITE_OPENAI_API_KEY,
      mode: 'auto', // 'offline', 'online', 'auto'
      costTracking: true,
      caching: true,
      fallbackChain: ['openai', 'onnx', 'webspeech', 'visual']
    };

    this.costManager = new TTSCostManager(config.monthlyBudget || 15000);
    this.cache = new TTSCache();
    this.initializeSystems();
  }

  async initializeSystems() {
    // Check all available TTS options
    this.systems = {
      openai: await this.checkOpenAI(),
      onnx: await this.checkONNX(),
      webspeech: this.checkWebSpeech(),
      visual: true // Always available
    };

    // Set initial quality tier
    this.selectOptimalTier();
  }

  selectOptimalTier() {
    const online = navigator.onLine;
    const hasAPIKey = !!this.config.openaiKey;
    const budgetAvailable = this.costManager.hasRemainingBudget();

    if (online && hasAPIKey && budgetAvailable) {
      return 'premium'; // OpenAI
    } else if (this.systems.onnx) {
      return 'standard'; // Local ONNX
    } else if (this.systems.webspeech) {
      return 'basic'; // Browser TTS
    }
    return 'visual'; // Highlighting only
  }

  async speak(text, options = {}) {
    const {
      lang = 'es-PR',
      voice = 'coqui', // Our mascot voice
      speed = 0.85, // Slower for children
      priority = 'normal', // 'high' for assessments
      studentProfile = {}
    } = options;

    // Check cache first
    const cached = await this.cache.get(text, lang);
    if (cached) return this.playAudio(cached);

    // Smart routing decision
    const tier = this.decideTier(text, priority, studentProfile);

    switch(tier) {
      case 'premium':
        return await this.speakWithOpenAI(text, lang, voice, speed);
      case 'standard':
        return await this.speakWithONNX(text, lang);
      case 'basic':
        return this.speakWithWebAPI(text, lang, speed);
      default:
        return this.visualReadingMode(text);
    }
  }
}
```

#### 1.2 OpenAI Integration

```javascript
// /src/services/tts/OpenAITTS.js

export class OpenAITTS {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.voiceMap = {
      'es-PR': {
        coqui: 'nova',     // Friendly mascot voice
        teacher: 'alloy',   // Clear instructional voice
        narrator: 'echo'    // Story narration
      },
      'en-US': {
        coqui: 'alloy',
        teacher: 'nova',
        narrator: 'fable'
      }
    };
  }

  async generateSpeech(text, lang, voiceType = 'coqui', speed = 0.85) {
    const voice = this.voiceMap[lang]?.[voiceType] || 'nova';

    try {
      const response = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'tts-1', // Use cheaper model for POC
          input: text,
          voice: voice,
          speed: speed,
          response_format: 'mp3'
        })
      });

      if (!response.ok) throw new Error('OpenAI TTS failed');

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      // Track usage for cost monitoring
      this.trackUsage(text.length, 'openai');

      return {
        url: audioUrl,
        blob: audioBlob,
        cost: text.length * 0.000015,
        tier: 'premium'
      };
    } catch (error) {
      console.error('OpenAI TTS Error:', error);
      throw error;
    }
  }

  async streamSpeech(text, lang, onChunk) {
    // Implementation for streaming TTS
    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'tts-1',
        input: text,
        voice: this.voiceMap[lang]?.coqui || 'nova',
        response_format: 'opus',
        stream: true
      })
    });

    const reader = response.body.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      onChunk(value);
    }
  }
}
```

#### 1.3 Offline Fallback System

```javascript
// /src/services/tts/OfflineTTS.js

export class OfflineTTS {
  constructor() {
    this.webSpeechAvailable = 'speechSynthesis' in window;
    this.onnxReady = false;
    this.visualMode = new VisualReadingAssistant();
  }

  async initializeONNX() {
    try {
      // Lazy load ONNX model only when needed
      const { SherpaOnnx } = await import('sherpa-onnx-wasm');
      this.onnxTTS = await SherpaOnnx.createOfflineTts({
        model: '/models/vits-piper-es_ES-claude-medium.onnx',
        numThreads: 2,
        provider: 'wasm'
      });
      this.onnxReady = true;
    } catch (error) {
      console.log('ONNX not available, using fallbacks');
    }
  }

  async speakWithWebAPI(text, lang, speed = 0.85) {
    return new Promise((resolve) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'es-PR' ? 'es-ES' : 'en-US';
      utterance.rate = speed;

      // Try to find best voice
      const voices = speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => v.lang.startsWith(lang.substring(0, 2)));
      if (preferredVoice) utterance.voice = preferredVoice;

      utterance.onend = () => resolve({ success: true, tier: 'basic' });
      utterance.onerror = () => resolve({ success: false });

      speechSynthesis.speak(utterance);
    });
  }

  visualReadingMode(text) {
    // Fallback to visual highlighting when no audio available
    return this.visualMode.highlightWords(text);
  }
}
```

### Phase 2: AI Reading Experience (Day 2-3)

#### 2.1 Student Reading Interface

```javascript
// /src/components/student/ReadingSession.jsx

import { useState, useEffect } from 'react';
import { SmartBilingualTTS } from '@/services/tts/SmartBilingualTTS';
import { PronunciationAnalyzer } from '@/services/ai/PronunciationAnalyzer';
import { CoquiMascot } from '@/components/mascot/CoquiMascot';

export function ReadingSession({ story, studentProfile, grade }) {
  const [tts] = useState(() => new SmartBilingualTTS());
  const [analyzer] = useState(() => new PronunciationAnalyzer());
  const [currentWord, setCurrentWord] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [isRecording, setIsRecording] = useState(false);

  // Core reading flow
  const startReading = async () => {
    setIsRecording(true);

    // Start recording student's voice
    const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(audioStream);

    recorder.ondataavailable = async (event) => {
      // Analyze pronunciation
      const analysis = await analyzer.analyze(event.data, {
        expectedText: story.currentSentence,
        language: story.language,
        gradeLevel: grade
      });

      // Provide real-time feedback
      provideFeedback(analysis);
    };

    recorder.start();
  };

  const provideFeedback = async (analysis) => {
    const { accuracy, problemWords, suggestions } = analysis;

    // Visual feedback
    setFeedback({
      accuracy,
      problemWords,
      suggestions
    });

    // Audio feedback from Coquí
    if (accuracy < 0.7) {
      await tts.speak(
        suggestions.encouragement,
        {
          lang: studentProfile.preferredLanguage,
          voice: 'coqui',
          priority: 'high'
        }
      );
    }

    // Highlight problem words
    problemWords.forEach(word => {
      highlightWord(word.position, word.severity);
    });
  };

  const highlightWord = (position, severity) => {
    const colors = {
      mild: '#FFD700',    // Yellow - almost there
      moderate: '#FFA500', // Orange - needs practice
      severe: '#FF6B6B'   // Red - let's try again
    };

    // Apply highlighting to word at position
    document.querySelector(`[data-word-index="${position}"]`)
      ?.style.setProperty('--highlight-color', colors[severity]);
  };

  return (
    <div className="reading-session">
      {/* Coquí Mascot provides encouragement */}
      <CoquiMascot
        mood={feedback?.accuracy > 0.8 ? 'happy' : 'encouraging'}
        message={feedback?.suggestions?.message}
      />

      {/* Story text with word-level highlighting */}
      <div className="story-content">
        {story.sentences.map((sentence, idx) => (
          <p key={idx} className="story-sentence">
            {sentence.split(' ').map((word, wordIdx) => (
              <span
                key={wordIdx}
                data-word-index={wordIdx}
                className="story-word"
                onClick={() => playWordPronunciation(word)}
              >
                {word}
              </span>
            ))}
          </p>
        ))}
      </div>

      {/* Reading controls */}
      <div className="reading-controls">
        <button
          onClick={startReading}
          className="btn-read-aloud"
          disabled={isRecording}
        >
          {isRecording ? 'Listening...' : 'Read to Coquí'}
        </button>

        <button
          onClick={() => tts.speak(story.currentSentence)}
          className="btn-hear-example"
        >
          Hear Example
        </button>

        <button
          onClick={() => switchLanguage()}
          className="btn-switch-language"
        >
          {story.language === 'es-PR' ? '🇺🇸 English' : '🇵🇷 Español'}
        </button>
      </div>

      {/* Progress indicator */}
      <ProgressBar
        current={currentWord}
        total={story.wordCount}
        accuracy={feedback?.accuracy}
      />
    </div>
  );
}
```

#### 2.2 Pronunciation Analysis

```javascript
// /src/services/ai/PronunciationAnalyzer.js

export class PronunciationAnalyzer {
  constructor() {
    this.webkitSpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    this.initializeRecognizer();
  }

  initializeRecognizer() {
    if (!this.webkitSpeechRecognition) return;

    this.recognizer = new this.webkitSpeechRecognition();
    this.recognizer.continuous = true;
    this.recognizer.interimResults = true;
    this.recognizer.maxAlternatives = 3;
  }

  async analyze(audioData, options) {
    const { expectedText, language, gradeLevel } = options;

    // Use Web Speech API for real-time recognition
    return new Promise((resolve) => {
      this.recognizer.lang = language === 'es-PR' ? 'es-ES' : 'en-US';

      let results = [];
      this.recognizer.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript;
        const confidence = event.results[event.results.length - 1][0].confidence;

        // Compare with expected text
        const analysis = this.compareTexts(transcript, expectedText, gradeLevel);

        results.push({
          transcript,
          confidence,
          ...analysis
        });
      };

      this.recognizer.onend = () => {
        resolve(this.aggregateResults(results));
      };

      this.recognizer.start();

      // Stop after reasonable time
      setTimeout(() => this.recognizer.stop(), 10000);
    });
  }

  compareTexts(spoken, expected, gradeLevel) {
    const spokenWords = spoken.toLowerCase().split(' ');
    const expectedWords = expected.toLowerCase().split(' ');

    const problemWords = [];
    let correctCount = 0;

    expectedWords.forEach((expectedWord, idx) => {
      const spokenWord = spokenWords[idx] || '';

      if (this.wordsMatch(spokenWord, expectedWord, gradeLevel)) {
        correctCount++;
      } else {
        problemWords.push({
          expected: expectedWord,
          spoken: spokenWord,
          position: idx,
          severity: this.getSeverity(spokenWord, expectedWord)
        });
      }
    });

    return {
      accuracy: correctCount / expectedWords.length,
      problemWords,
      suggestions: this.generateSuggestions(problemWords, gradeLevel, language)
    };
  }

  wordsMatch(spoken, expected, gradeLevel) {
    // More lenient for younger grades
    const threshold = gradeLevel === 'K' ? 0.6 :
                     gradeLevel === '1' ? 0.7 : 0.8;

    // Use Levenshtein distance for fuzzy matching
    const similarity = this.calculateSimilarity(spoken, expected);
    return similarity >= threshold;
  }

  generateSuggestions(problemWords, gradeLevel, language) {
    const suggestions = {
      message: '',
      encouragement: '',
      tips: []
    };

    if (problemWords.length === 0) {
      suggestions.encouragement = language === 'es-PR' ?
        '¡Excelente! ¡Lo hiciste muy bien!' :
        'Excellent! You did great!';
      return suggestions;
    }

    // Grade-appropriate feedback
    if (gradeLevel === 'K' || gradeLevel === '1') {
      suggestions.encouragement = language === 'es-PR' ?
        '¡Buen intento! Vamos a practicar un poco más.' :
        'Good try! Let\'s practice a bit more.';
    }

    // Specific tips for problem words
    problemWords.slice(0, 3).forEach(word => {
      suggestions.tips.push(this.getPronunciationTip(word, language));
    });

    return suggestions;
  }
}
```

### Phase 3: Multi-Stakeholder Dashboards (Day 4-5)

#### 3.1 Teacher Dashboard

```javascript
// /src/components/teacher/TeacherDashboard.jsx

export function TeacherDashboard({ classId, teacherId }) {
  const [realtimeData, setRealtimeData] = useState(null);
  const [aiInsights, setAiInsights] = useState(null);

  useEffect(() => {
    // Subscribe to real-time updates
    const subscription = supabase
      .channel(`class-${classId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'reading_sessions'
      }, handleRealtimeUpdate)
      .subscribe();

    // Load AI insights
    loadAIInsights();

    return () => subscription.unsubscribe();
  }, [classId]);

  const loadAIInsights = async () => {
    const insights = await generateAIInsights(classId);
    setAiInsights(insights);
  };

  const generateAIInsights = async (classId) => {
    // Analyze class data
    const { data: sessions } = await supabase
      .from('reading_sessions')
      .select('*')
      .eq('class_id', classId)
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));

    // Generate insights
    return {
      struggling: identifyStrugglingStudents(sessions),
      ready: identifyReadyForAdvancement(sessions),
      grouping: suggestGrouping(sessions),
      intervention: suggestInterventions(sessions),
      trends: analyzeTrends(sessions)
    };
  };

  return (
    <div className="teacher-dashboard">
      {/* Real-time class overview */}
      <ClassOverview
        studentsOnline={realtimeData?.online || 0}
        activeReading={realtimeData?.reading || 0}
        needingHelp={aiInsights?.struggling?.length || 0}
      />

      {/* Live activity feed */}
      <LiveActivityFeed activities={realtimeData?.activities} />

      {/* AI recommendations */}
      <AIInsightsPanel insights={aiInsights} />

      {/* Quick actions */}
      <QuickActions
        onAssignStory={assignStoryToClass}
        onGenerateReport={generateReport}
        onScheduleIntervention={scheduleIntervention}
      />

      {/* Class analytics */}
      <ClassAnalytics
        readingMinutes={realtimeData?.totalMinutes}
        languagePreference={realtimeData?.languageStats}
        skillProgression={aiInsights?.trends}
      />
    </div>
  );
}
```

#### 3.2 Parent Dashboard

```javascript
// /src/components/parent/ParentDashboard.jsx

export function ParentDashboard({ studentId, parentId }) {
  const [childProgress, setChildProgress] = useState(null);
  const [dailyTips, setDailyTips] = useState(null);

  useEffect(() => {
    loadChildProgress();
    generateDailyTips();
  }, [studentId]);

  const generateDailyTips = async () => {
    // AI-generated tips based on child's current challenges
    const tips = await generateParentGuidance(studentId);
    setDailyTips(tips);
  };

  return (
    <div className="parent-dashboard-mobile">
      {/* Daily notification banner */}
      <DailyNotification
        message={`${childProgress?.name} read for ${childProgress?.todayMinutes} minutes today!`}
        highlight={childProgress?.improvement}
      />

      {/* Today's activity */}
      <TodayActivity
        storiesRead={childProgress?.todayStories}
        accuracy={childProgress?.todayAccuracy}
        newWords={childProgress?.newWords}
        timeSpent={childProgress?.todayMinutes}
      />

      {/* Weekly progress */}
      <WeeklyProgress
        goal={childProgress?.weeklyGoal}
        current={childProgress?.weeklyProgress}
        bestSkill={childProgress?.strongestSkill}
        needsPractice={childProgress?.challengeArea}
      />

      {/* Help at home section */}
      <HelpAtHome
        tips={dailyTips}
        practiceWords={childProgress?.practiceWords}
        printableWorksheet={childProgress?.worksheetUrl}
      />

      {/* Communication with teacher */}
      <TeacherMessages
        messages={childProgress?.teacherNotes}
        onSendMessage={sendMessageToTeacher}
      />
    </div>
  );
}
```

#### 3.3 Administrator Dashboard

```javascript
// /src/components/admin/AdminDashboard.jsx

export function AdminDashboard({ schoolId, districtId }) {
  const [metrics, setMetrics] = useState(null);
  const [costAnalysis, setCostAnalysis] = useState(null);

  useEffect(() => {
    loadSchoolMetrics();
    calculateCostSavings();
  }, [schoolId]);

  const calculateCostSavings = async () => {
    const analysis = {
      ttsUsage: await calculateTTSCosts(),
      teacherTimeSaved: await calculateTimeSavings(),
      interventionEfficiency: await calculateInterventionROI(),
      projectedAnnualSavings: 0
    };

    analysis.projectedAnnualSavings =
      analysis.teacherTimeSaved * 35 + // $35/hour teacher cost
      analysis.interventionEfficiency * 100; // $100/intervention session saved

    setCostAnalysis(analysis);
  };

  return (
    <div className="admin-dashboard">
      {/* Executive summary */}
      <ExecutiveSummary
        totalStudents={metrics?.totalStudents}
        activeToday={metrics?.activeToday}
        averageLevel={metrics?.averageLevel}
        monthlyGrowth={metrics?.growth}
      />

      {/* AI Performance metrics */}
      <AIPerformancePanel
        interventions={metrics?.aiInterventions}
        improvementRate={metrics?.improvementRate}
        timeSaved={costAnalysis?.teacherTimeSaved}
      />

      {/* Cost analysis */}
      <CostAnalysisPanel
        ttsCosts={costAnalysis?.ttsUsage}
        savingsProjection={costAnalysis?.projectedAnnualSavings}
        roiPercentage={costAnalysis?.roi}
      />

      {/* Comparison views */}
      <ComparisonCharts
        schoolVsDistrict={metrics?.comparison}
        gradeBreakdown={metrics?.gradeStats}
        languageDistribution={metrics?.languageStats}
      />

      {/* Export options */}
      <ExportPanel
        onExportPDF={exportToPDF}
        onExportExcel={exportToExcel}
        onExportPresentation={exportToPowerPoint}
      />
    </div>
  );
}
```

### Phase 4: Cost Management System (Day 5-6)

#### 4.1 TTS Cost Manager

```javascript
// /src/services/cost/TTSCostManager.js

export class TTSCostManager {
  constructor(monthlyBudget = 15000) {
    this.monthlyBudget = monthlyBudget;
    this.currentMonth = new Date().getMonth();
    this.usage = this.loadUsageData();
  }

  loadUsageData() {
    const stored = localStorage.getItem('tts-usage');
    if (stored) {
      const data = JSON.parse(stored);
      // Reset if new month
      if (data.month !== this.currentMonth) {
        return this.resetUsage();
      }
      return data;
    }
    return this.resetUsage();
  }

  resetUsage() {
    return {
      month: this.currentMonth,
      premium: { chars: 0, cost: 0 },
      standard: { count: 0, cost: 0 },
      basic: { count: 0, cost: 0 },
      total: 0
    };
  }

  shouldUsePremium(text, context) {
    const factors = {
      textLength: text.length,
      isAssessment: context.type === 'assessment',
      isNewLesson: context.isNew,
      studentStruggling: context.studentScore < 0.7,
      remainingBudget: this.getRemainingBudget(),
      priorityLevel: context.priority || 'normal'
    };

    // Always use premium for assessments
    if (factors.isAssessment) return true;

    // Use premium for struggling students if budget allows
    if (factors.studentStruggling && factors.remainingBudget > 1000) {
      return true;
    }

    // Short texts are cheap, use premium if under 500 chars
    if (factors.textLength < 500 && factors.remainingBudget > 500) {
      return true;
    }

    // Check if we're under 30% of budget used
    const budgetUsedPercent = (this.usage.total / this.monthlyBudget) * 100;
    if (budgetUsedPercent < 30) {
      return true;
    }

    // Default to offline for practice/review content
    return false;
  }

  trackUsage(chars, tier, cost = 0) {
    switch(tier) {
      case 'premium':
        this.usage.premium.chars += chars;
        this.usage.premium.cost += cost;
        this.usage.total += cost;
        break;
      case 'standard':
        this.usage.standard.count += 1;
        break;
      case 'basic':
        this.usage.basic.count += 1;
        break;
    }

    this.saveUsage();
    this.checkBudgetAlerts();
  }

  checkBudgetAlerts() {
    const percentUsed = (this.usage.total / this.monthlyBudget) * 100;

    if (percentUsed >= 90) {
      this.notifyAdministrator('CRITICAL: 90% of TTS budget consumed');
    } else if (percentUsed >= 75) {
      this.notifyAdministrator('WARNING: 75% of TTS budget consumed');
    } else if (percentUsed >= 50) {
      this.notifyAdministrator('INFO: 50% of TTS budget consumed');
    }
  }

  getRemainingBudget() {
    return this.monthlyBudget - this.usage.total;
  }

  getProjectedMonthlyUsage() {
    const dayOfMonth = new Date().getDate();
    const daysInMonth = new Date(new Date().getFullYear(), this.currentMonth + 1, 0).getDate();
    const dailyAverage = this.usage.total / dayOfMonth;
    return dailyAverage * daysInMonth;
  }

  generateCostReport() {
    return {
      currentUsage: this.usage,
      remainingBudget: this.getRemainingBudget(),
      projectedMonthly: this.getProjectedMonthlyUsage(),
      recommendations: this.getCostOptimizationRecommendations(),
      breakdown: {
        premiumPercent: (this.usage.premium.cost / this.usage.total) * 100,
        averagePerStudent: this.usage.total / 551, // For 551 schools
        costPerWord: this.usage.premium.cost / (this.usage.premium.chars / 5)
      }
    };
  }
}
```

### Phase 5: Demo Features & Polish (Day 6-7)

#### 5.1 Demo Orchestration

```javascript
// /src/demo/DemoOrchestrator.js

export class DemoOrchestrator {
  constructor() {
    this.scenarios = {
      studentReading: new StudentReadingDemo(),
      teacherMonitoring: new TeacherMonitoringDemo(),
      parentEngagement: new ParentEngagementDemo(),
      adminROI: new AdminROIDemo(),
      offlineCapability: new OfflineDemo()
    };
  }

  async runFullDemo() {
    const steps = [
      // Step 1: Student struggles with English
      {
        scenario: 'studentReading',
        script: 'Carlitos reads "The Big Cat" - struggles with "big"',
        duration: 60,
        highlight: 'Real-time pronunciation feedback'
      },

      // Step 2: Teacher gets alert
      {
        scenario: 'teacherMonitoring',
        script: 'Mrs. Rodriguez sees alert about Carlitos',
        duration: 30,
        highlight: 'Instant intervention notification'
      },

      // Step 3: Switch to offline mode
      {
        scenario: 'offlineCapability',
        script: 'Disconnect WiFi - system continues working',
        duration: 45,
        highlight: 'Seamless offline operation'
      },

      // Step 4: Parent notification
      {
        scenario: 'parentEngagement',
        script: 'Dad receives specific practice words',
        duration: 30,
        highlight: 'Actionable parent guidance'
      },

      // Step 5: Administrator metrics
      {
        scenario: 'adminROI',
        script: 'Principal sees 45 hours saved this week',
        duration: 45,
        highlight: 'Measurable ROI'
      }
    ];

    for (const step of steps) {
      await this.executeStep(step);
      await this.pause(2000); // Pause between steps
    }
  }

  async executeStep(step) {
    console.log(`🎬 Demo Step: ${step.script}`);

    // Show notification
    this.showDemoNotification(step.highlight);

    // Run scenario
    await this.scenarios[step.scenario].run(step);

    // Log metrics
    this.logDemoMetrics(step);
  }

  showDemoNotification(message) {
    // Display prominent notification during demo
    const notification = document.createElement('div');
    notification.className = 'demo-notification';
    notification.textContent = `✨ ${message}`;
    document.body.appendChild(notification);

    setTimeout(() => notification.remove(), 5000);
  }
}
```

#### 5.2 Offline Demo Mode

```javascript
// /src/demo/OfflineDemo.js

export class OfflineDemo {
  async run() {
    // Step 1: Show current online status with premium TTS
    await this.showOnlineCapabilities();

    // Step 2: Simulate network disconnection
    await this.disconnectNetwork();

    // Step 3: Demonstrate offline capabilities
    await this.showOfflineCapabilities();

    // Step 4: Show cached content access
    await this.demonstrateCachedContent();

    // Step 5: Reconnect and sync
    await this.reconnectAndSync();
  }

  async disconnectNetwork() {
    // Visual indicator
    document.querySelector('.network-status').classList.add('offline');

    // Override navigator.onLine for demo
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: false
    });

    // Show notification
    this.showNotification('📡 Network Disconnected - Switching to Offline Mode');

    // TTS automatically switches to offline
    const tts = new SmartBilingualTTS();
    console.log('TTS Tier:', tts.selectOptimalTier()); // Will return 'standard' or 'basic'
  }

  async showOfflineCapabilities() {
    const capabilities = [
      'Reading continues with offline TTS',
      'Progress tracked locally',
      'Cached stories available',
      'Visual reading assistance active'
    ];

    for (const capability of capabilities) {
      await this.demonstrateCapability(capability);
    }
  }
}
```

---

## 📊 Implementation Timeline

### Day 1: Foundation & TTS Core
- **Morning**: Set up project structure, install dependencies
- **Afternoon**: Implement SmartBilingualTTS base class
- **Evening**: OpenAI integration + Web Speech API fallback

### Day 2: Offline System & Content
- **Morning**: ONNX model integration
- **Afternoon**: Content access system with grade-based accounts
- **Evening**: Basic student reading interface

### Day 3: AI Features
- **Morning**: Voice recording and speech recognition
- **Afternoon**: Pronunciation analysis and feedback
- **Evening**: Coquí mascot animations and interactions

### Day 4: Teacher & Parent Dashboards
- **Morning**: Teacher real-time monitoring
- **Afternoon**: Parent progress views
- **Evening**: AI insights generation

### Day 5: Administrator & Cost Management
- **Morning**: Admin dashboard with metrics
- **Afternoon**: Cost tracking and projections
- **Evening**: Export functionality (PDF/Excel)

### Day 6: Integration & Testing
- **Morning**: Full system integration
- **Afternoon**: Cross-platform testing
- **Evening**: Performance optimization

### Day 7: Demo Preparation
- **Morning**: Demo scenarios setup
- **Afternoon**: Stakeholder presentation prep
- **Evening**: Final polish and backup plans

---

## 🎯 Success Metrics

### Technical Metrics
- ✅ Voice recognition works in Spanish & English
- ✅ TTS switches seamlessly between online/offline
- ✅ Response time < 2 seconds for feedback
- ✅ Works on phone, tablet, desktop
- ✅ Handles 100+ concurrent users

### Business Metrics
- ✅ Demonstrates 45+ hours saved per week per school
- ✅ Shows 70% cost reduction with hybrid TTS
- ✅ Proves 87% student improvement rate
- ✅ Scalable to 551 schools architecture

### User Experience Metrics
- ✅ Students engage for 15+ minutes per session
- ✅ Teachers receive actionable insights
- ✅ Parents get specific practice guidance
- ✅ Administrators see clear ROI

---

## 🚀 Deployment Strategy

### POC Deployment (Immediate)
```bash
# Quick deployment for demo
npm run build
npm run preview

# Demo accounts ready
studentk@demo.com -> student5@demo.com (grade-specific)
demo@k5pr.com (full access)
teacher@demo.com (teacher view)
parent@demo.com (parent view)
admin@demo.com (administrator view)
```

### Production Considerations (Post-POC)
1. **Infrastructure**: Move to Vercel Edge Functions for global CDN
2. **Database**: Supabase with row-level security
3. **TTS Costs**: Implement tiered pricing per school
4. **Monitoring**: Real-time usage and cost dashboards
5. **Support**: Multi-language help system

---

## 📋 Pre-Demo Checklist

### Technical Readiness
- [ ] All demo accounts created and tested
- [ ] OpenAI API key configured and working
- [ ] Offline mode tested without internet
- [ ] Sample content loaded for each grade
- [ ] Cost tracking dashboard showing projections

### Demo Content
- [ ] 5-10 stories per grade level ready
- [ ] Bilingual content properly formatted
- [ ] Assessment questions prepared
- [ ] Progress data pre-populated

### Stakeholder Materials
- [ ] PDF export of sample reports
- [ ] Cost projection spreadsheet
- [ ] ROI calculation document
- [ ] Architecture diagram for scaling

### Backup Plans
- [ ] Local demo server ready
- [ ] Offline demo video prepared
- [ ] Printed handouts available
- [ ] Mobile hotspot for connectivity

---

## 🎊 Demo Day Script

### Opening (2 minutes)
"Today we'll demonstrate how AI can transform bilingual reading education across Puerto Rico's 551 schools, saving teacher time while improving student outcomes."

### Student Demo (5 minutes)
1. Login as Carlitos (Grade 1)
2. Select "The Big Cat" story
3. Read aloud with mistakes
4. Show real-time feedback
5. Switch to Spanish mid-story
6. Complete with celebration

### Teacher Demo (3 minutes)
1. Show live alert about Carlitos
2. Display AI recommendations
3. Assign group intervention
4. Generate instant report

### Parent Demo (2 minutes)
1. Show mobile notification
2. Display practice words
3. Print worksheet

### Administrator Demo (3 minutes)
1. Show 45 hours saved metric
2. Display cost projections
3. Export DEPR report

### Offline Demo (2 minutes)
1. Disconnect internet
2. Continue reading
3. Show sync when reconnected

### Closing (3 minutes)
"This POC proves we can deliver enterprise-grade bilingual AI reading assistance that works everywhere, saves money, and improves outcomes. Ready to scale to all 551 schools."

---

## 🔧 Technical Support

### Common Issues & Solutions

#### OpenAI API Issues
```javascript
// Fallback if API key invalid
if (!import.meta.env.VITE_OPENAI_API_KEY) {
  console.log('Using offline mode - OpenAI key not configured');
  // System automatically uses offline TTS
}
```

#### Audio Playback Issues
```javascript
// Handle autoplay restrictions
document.addEventListener('click', () => {
  // Resume audio context after user interaction
  audioContext.resume();
}, { once: true });
```

#### Grade Access Issues
```javascript
// Override for demo if needed
if (userEmail === 'demo@k5pr.com') {
  return ALL_GRADES; // Special access
}
```

---

## ✅ Final Implementation Notes

1. **Priority Order**: TTS system → Student reading → Teacher dashboard → Cost tracking
2. **Critical Path**: Working voice recognition is ESSENTIAL
3. **Failsafes**: Every premium feature has offline fallback
4. **Demo Focus**: Emphasize time savings and offline capability
5. **Cost Message**: Show 70% savings with hybrid approach

This plan delivers a working POC that demonstrates real AI value, works offline, scales to 551 schools, and shows clear ROI for DEPR stakeholders.