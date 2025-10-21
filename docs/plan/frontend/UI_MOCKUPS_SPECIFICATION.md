# UI Mockups Specification - K-5 Educational Platform

## Overview
Detailed specifications for all major screens and user interfaces, designed for K-5 students (ages 5-11) in Puerto Rico with bilingual support and age-appropriate interaction patterns.

## 1. Home Screen / Dashboard

### Student Dashboard (Main Landing Page)

```
┌─────────────────────────────────────────────────────────────────┐
│  [Logo] K-5 Reading Platform          [ES/EN] [@User] [Parents]│
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────┐  ┌──────────────────┐                │
│  │    Welcome Card      │  │   Stats Widget   │                │
│  │                      │  │                  │                │
│  │  [Coquí Avatar]      │  │  🔥 Streak: 12   │                │
│  │  ¡Hola, María!       │  │  ⭐ Points: 1,250│                │
│  │                      │  │  📚 Books: 23    │                │
│  │  ¿Listo para leer?   │  │  🏆 Level: 5     │                │
│  └──────────────────────┘  └──────────────────┘                │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Daily Challenges (3 Cards)                   │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐         │  │
│  │  │ 📖 Read 2  │  │ 🎤 Pronounce│ │ 💬 Answer  │         │  │
│  │  │ Stories    │  │ 10 Words   │  │ 3 Questions│         │  │
│  │  │ [Progress] │  │ [Progress] │  │ [Progress] │         │  │
│  │  │  1/2  🎯  │  │  7/10 🎯  │  │   0/3  🎯 │         │  │
│  │  └────────────┘  └────────────┘  └────────────┘         │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │           Continue Reading (Carousel)                     │  │
│  │  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐│  │
│  │  │[Image]    │ │[Image]    │ │[Image]    │ │[Image]    ││  │
│  │  │El León y  │ │La Tortuga │ │El Coquí   │ │Aventura   ││  │
│  │  │el Ratón   │ │Marina     │ │de PR      │ │en Playa   ││  │
│  │  │           │ │           │ │           │ │           ││  │
│  │  │📊 Progress│ │📊 Progress│ │📊 Progress│ │  [New!]   ││  │
│  │  │   75%     │ │   30%     │ │   90%     │ │           ││  │
│  │  │[Continue] │ │[Continue] │ │[Continue] │ │ [Start]   ││  │
│  │  └───────────┘ └───────────┘ └───────────┘ └───────────┘│  │
│  │            [← Previous] [Next →]                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Quick Actions (Large Buttons)                │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐         │  │
│  │  │ 📚 Library │  │ 🏆 Badges  │  │ 🎯 Practice│         │  │
│  │  │            │  │            │  │            │         │  │
│  │  │ Browse All │  │ 12/45      │  │ Daily Quiz │         │  │
│  │  │   Books    │  │  Unlocked  │  │            │         │  │
│  │  └────────────┘  └────────────┘  └────────────┘         │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  [Coquí Mascot - Bottom Right Corner]                          │
│  [Speech Bubble: "¡Buen trabajo hoy!"]                         │
└─────────────────────────────────────────────────────────────────┘
```

#### Component Specifications

```typescript
// Dashboard Layout
export const StudentDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-caribbeanBlue-50 to-white">
      {/* Header */}
      <Header
        logo="/logo.svg"
        userName="María"
        userAvatar="/avatars/student.jpg"
        showLanguageToggle
        showParentLink
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Welcome Section */}
        <div className="grid md:grid-cols-3 gap-6">
          <WelcomeCard
            userName="María"
            coquiState="happy"
            greeting="¿Listo para leer?"
          />
          <StatsWidget
            streak={12}
            points={1250}
            booksCompleted={23}
            level={5}
          />
        </div>

        {/* Daily Challenges */}
        <DailyChallengesSection
          challenges={dailyChallenges}
          onChallengeClick={handleChallengeClick}
        />

        {/* Continue Reading Carousel */}
        <ContinueReadingCarousel
          books={inProgressBooks}
          onBookClick={handleBookClick}
        />

        {/* Quick Actions */}
        <QuickActionsGrid
          actions={quickActions}
          onActionClick={handleActionClick}
        />
      </main>

      {/* Floating Coquí */}
      <FloatingCoqui
        state="happy"
        message="¡Buen trabajo hoy!"
        position="bottom-right"
      />
    </div>
  );
};
```

## 2. Reading Exercise Interface

### Reading Screen Layout

```
┌─────────────────────────────────────────────────────────────────┐
│ [← Back] Nivel 2 - Grade 1           [Progress: ●●●●○] [Help ?]│
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────────────┐  ┌──────────────┐                  │
│  │                        │  │  [Coquí]     │                  │
│  │   [Story Image]        │  │  "listening" │                  │
│  │   Beach scene with     │  │              │                  │
│  │   sandcastle           │  │  [Progress]  │                  │
│  │                        │  │   Word 5/12  │                  │
│  │   [Hotspot: castle]    │  │              │                  │
│  │   [Hotspot: beach]     │  │  Score: 85%  │                  │
│  │                        │  │              │                  │
│  │   [🔍 Zoom] [ℹ Info]   │  │  🔥 Streak   │                  │
│  │                        │  │     12       │                  │
│  └────────────────────────┘  └──────────────┘                  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Reading Text (Interactive)                   │  │
│  │                                                            │  │
│  │  María  va  a  la  playa.  Ella  construye  un           │  │
│  │  ─────  ──  ─  ──  ─────   ────  ─────────  ──           │  │
│  │  [perfect] [good] [current - highlighted in yellow]       │  │
│  │                                                            │  │
│  │  castillo  de  arena  grande.                             │  │
│  │  ────────  ──  ─────  ──────                             │  │
│  │  [pending] [pending] [pending] [pending]                  │  │
│  │                                                            │  │
│  │              Pronunciation Score: 85% ━━━━━━━━━━          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                  Control Panel                            │  │
│  │                                                            │  │
│  │  [🔊 Listen]  [🎤 Record]  [⏸ Pause]  [🔄 Repeat]        │  │
│  │                                                            │  │
│  │              [NEXT EXERCISE →]                            │  │
│  │         (Unlocked at 60% accuracy)                        │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

#### Reading Exercise Components

```typescript
export const ReadingExerciseScreen: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-caribbeanBlue-50 to-white">
      {/* Header Bar */}
      <ExerciseHeader
        level="Nivel 2 - Grade 1"
        progress={4}
        total={5}
        onBack={handleBack}
        onHelp={handleHelp}
      />

      {/* Main Reading Area */}
      <main className="container mx-auto px-6 py-6">
        <div className="grid lg:grid-cols-[1fr_250px] gap-6">
          {/* Left: Content */}
          <div className="space-y-6">
            {/* Image + Text */}
            <div className="flex gap-6">
              <ImagePanel
                image={currentImage}
                onHotspotClick={handleHotspotClick}
                highlightedWord={currentWord}
                className="flex-1"
              />

              <CoquiSidebar
                state={getCoquiState()}
                progress={wordProgress}
                score={pronunciationScore}
                streak={streakDays}
              />
            </div>

            {/* Interactive Text */}
            <TextDisplay
              text={currentText}
              currentWordIndex={currentWordIndex}
              wordStatuses={wordStatuses}
              onWordClick={handleWordClick}
              pronunciationScore={pronunciationScore}
            />
          </div>
        </div>

        {/* Bottom Controls */}
        <ControlPanel
          mode={mode}
          onListen={handleListen}
          onRecord={handleRecord}
          onPause={handlePause}
          onRepeat={handleRepeat}
          onNext={handleNext}
          canGoNext={pronunciationScore >= 60}
        />
      </main>
    </div>
  );
};
```

## 3. Comprehension Check Screen

### Question Interface

```
┌─────────────────────────────────────────────────────────────────┐
│                  Comprensión de Lectura                         │
│                   Pregunta 2 de 3                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐│
│  │              [Story Image - Reference]                      ││
│  │         (Same image from reading exercise)                  ││
│  │                                                             ││
│  └────────────────────────────────────────────────────────────┘│
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐│
│  │                                                             ││
│  │  🤔 [Coquí Thinking]                                        ││
│  │                                                             ││
│  │  "¿Qué construye María?"                                    ││
│  │                                                             ││
│  │  [Large, Clear Question Text - 2rem font]                  ││
│  │                                                             ││
│  └────────────────────────────────────────────────────────────┘│
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐│
│  │                   Answer Options                            ││
│  │                                                             ││
│  │  ┌──────────────────────────────────────────────────────┐ ││
│  │  │  A   Una casa                                         │ ││
│  │  │      [House icon]                           [Select]  │ ││
│  │  └──────────────────────────────────────────────────────┘ ││
│  │                                                             ││
│  │  ┌──────────────────────────────────────────────────────┐ ││
│  │  │  B   Un castillo de arena                            │ ││
│  │  │      [Sandcastle icon]                      [Select]  │ ││
│  │  └──────────────────────────────────────────────────────┘ ││
│  │                                                             ││
│  │  ┌──────────────────────────────────────────────────────┐ ││
│  │  │  C   Un barco                                         │ ││
│  │  │      [Boat icon]                            [Select]  │ ││
│  │  └──────────────────────────────────────────────────────┘ ││
│  │                                                             ││
│  └────────────────────────────────────────────────────────────┘│
│                                                                  │
│               [SUBMIT ANSWER] (Large button)                    │
│                                                                  │
│  Progress: ⭐●●○○○                                              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

#### Feedback Screen (After Answer)

```
┌─────────────────────────────────────────────────────────────────┐
│                     ¡Correcto! 🎉                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│                  [Coquí Celebration Animation]                  │
│                        🐸 ✨ ⭐                                 │
│                                                                  │
│              ¡Muy bien! ¡Esa es la respuesta!                   │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐│
│  │  Tu respuesta:    Un castillo de arena  ✓                  ││
│  │                                                             ││
│  │  Puntos ganados:  +20 ⭐                                    ││
│  │                                                             ││
│  │  Total:           1,270 puntos                              ││
│  └────────────────────────────────────────────────────────────┘│
│                                                                  │
│            [NEXT QUESTION →]  (Auto-enable after 2s)           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## 4. Progress Dashboard

### Student Progress View

```
┌─────────────────────────────────────────────────────────────────┐
│  Mi Progreso                                     [Week] [Month] │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │ Level 5      │  │ Streak 🔥    │  │ Points ⭐    │         │
│  │              │  │              │  │              │         │
│  │  [Circle]    │  │     12       │  │   1,250      │         │
│  │   5/6        │  │    days      │  │   points     │         │
│  │              │  │              │  │              │         │
│  │  85% to      │  │  Next: 🏆    │  │  Rank: #12   │         │
│  │  Level 6     │  │  at 14 days  │  │  in class    │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Reading Skills (Radar Chart)                 │  │
│  │                                                            │  │
│  │               Comprensión 90%                              │  │
│  │                    /\                                      │  │
│  │                   /  \                                     │  │
│  │        Fluidez   /    \   Vocabulario                     │  │
│  │          75%    /______\      85%                         │  │
│  │                /        \                                  │  │
│  │               /          \                                 │  │
│  │    Pronunciación 80%  Gramática 70%                       │  │
│  │                                                            │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │            Recent Activity (Timeline)                     │  │
│  │                                                            │  │
│  │  Hoy        ⭐ Completaste "El León y el Ratón"           │  │
│  │  12:30 PM   📚 +100 puntos                                │  │
│  │                                                            │  │
│  │  Ayer       🏆 Ganaste insignia "Lector Diario"           │  │
│  │  2:15 PM    ⭐ +200 puntos                                │  │
│  │                                                            │  │
│  │  Hace 2     📖 Completaste "La Tortuga Marina"            │  │
│  │  días       ⭐ +100 puntos                                │  │
│  │                                                            │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Goals This Week                              │  │
│  │                                                            │  │
│  │  📚 Read 5 stories        [████░░] 4/5                    │  │
│  │  🎤 Practice pronunciation [██████] 10/10 ✓               │  │
│  │  ⭐ Earn 500 points        [████░░] 400/500               │  │
│  │  🏆 Unlock 2 badges        [███░░░] 1/2                   │  │
│  │                                                            │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## 5. Parent Dashboard

### Parent View (Read-Only)

```
┌─────────────────────────────────────────────────────────────────┐
│  Panel de Padres - María García             [Spanish] [English]│
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Weekly Summary                               │  │
│  │                                                            │  │
│  │  Esta semana, María:                                       │  │
│  │                                                            │  │
│  │  ✓ Leyó 8 historias (objetivo: 5) 🎉                      │  │
│  │  ✓ Practicó 35 minutos diarios (promedio)                │  │
│  │  ✓ Mantuvo su racha de 12 días 🔥                         │  │
│  │  ✓ Subió al Nivel 5                                       │  │
│  │                                                            │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌─────────────────┐  ┌──────────────────────────────────────┐│
│  │  Reading Level  │  │     Skill Development                ││
│  │                 │  │                                       ││
│  │   Grade 1.8     │  │  Comprensión    ████████░ 90%        ││
│  │  (Above grade)  │  │  Pronunciación  ████████  80%        ││
│  │                 │  │  Vocabulario    ████████░ 85%        ││
│  │  [Details →]    │  │  Fluidez        ███████   75%        ││
│  │                 │  │  Gramática      ███████   70%        ││
│  └─────────────────┘  └──────────────────────────────────────┘│
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │          Activity Timeline (This Week)                    │  │
│  │                                                            │  │
│  │  L  M  M  J  V  S  D                                      │  │
│  │  ██ ██ ██ ██ ██ █░ ░░  (Bar chart of daily minutes)      │  │
│  │  35 40 30 35 38 15 0                                      │  │
│  │                                                            │  │
│  │  Tiempo total: 3 horas 13 minutos                         │  │
│  │                                                            │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Recent Achievements                          │  │
│  │                                                            │  │
│  │  🏆 Lector Diario         Ayer                            │  │
│  │  🌟 Primera Historia      Hace 3 días                     │  │
│  │  📚 5 Historias           Hace 5 días                     │  │
│  │                                                            │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │         Recommended Activities (AI Suggestions)           │  │
│  │                                                            │  │
│  │  📖 Continue practicing Grade 2 stories                   │  │
│  │  🎤 Focus on multi-syllable word pronunciation            │  │
│  │  📚 Try stories about science (shows interest)            │  │
│  │                                                            │  │
│  │  [View Detailed Report →]                                 │  │
│  │                                                            │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │            How to Support at Home                         │  │
│  │                                                            │  │
│  │  💡 Read together for 15 minutes before bed               │  │
│  │  💡 Ask about story details to practice comprehension     │  │
│  │  💡 Praise effort, not just results                       │  │
│  │                                                            │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## 6. Teacher Dashboard

### Classroom Overview

```
┌─────────────────────────────────────────────────────────────────┐
│  Clase: 2do Grado - Sra. Rodríguez    [Students] [Reports]    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │ Total        │  │ Active       │  │ Avg. Time    │         │
│  │ Students     │  │ This Week    │  │ Per Student  │         │
│  │              │  │              │  │              │         │
│  │    24        │  │    22        │  │  28 min      │         │
│  │              │  │   (92%)      │  │  daily       │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │          Class Performance Distribution                   │  │
│  │                                                            │  │
│  │  Above Grade:  ████████     8 students (33%)              │  │
│  │  On Grade:     ████████████ 12 students (50%)             │  │
│  │  Below Grade:  ████         4 students (17%)              │  │
│  │                                                            │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │           Students Needing Attention                      │  │
│  │                                                            │  │
│  │  🔴 Juan Pérez       - No activity for 5 days             │  │
│  │  🟡 Ana Torres       - Struggling with pronunciation      │  │
│  │  🟡 Carlos Ruiz      - Below grade level                  │  │
│  │                                                            │  │
│  │  [View Full List →]                                       │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Student List (Sortable)                      │  │
│  │                                                            │  │
│  │  Name ▼         Level   Streak  Points   Last Active      │  │
│  │  ──────────────────────────────────────────────────────  │  │
│  │  María García    1.8     12🔥   1,250    Hoy 12:30       │  │
│  │  Luis Martínez   2.1     8       980     Ayer 3:45       │  │
│  │  Sofia López     1.5     15🔥   1,450    Hoy 2:15        │  │
│  │  ... (21 more)                                            │  │
│  │                                                            │  │
│  │  [Export to Excel] [Print Report]                         │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │           Assign Reading (Teacher Tools)                  │  │
│  │                                                            │  │
│  │  Select story:  [El Coquí de Puerto Rico    ▼]           │  │
│  │  Assign to:     [● Whole Class  ○ Selected Students]     │  │
│  │  Due date:      [Next Friday                ▼]           │  │
│  │                                                            │  │
│  │  [ASSIGN READING]                                         │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## 7. Badge Collection Screen

### Achievements Gallery

```
┌─────────────────────────────────────────────────────────────────┐
│  Mis Insignias                           12/45 desbloqueadas   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  [All] [Reading] [Pronunciation] [Streaks] [Cultural]          │
│                                                                  │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐       │
│  │  📖    │ │  ⭐    │ │  🏆    │ │   🔒   │ │   🔒   │       │
│  │Primera │ │ Lector │ │5 Días  │ │  ???   │ │  ???   │       │
│  │Historia│ │ Diario │ │Seguidos│ │        │ │        │       │
│  │        │ │        │ │        │ │ 3/5    │ │ 0/10   │       │
│  │+50 pts │ │+100 pts│ │+200 pts│ │progress│ │progress│       │
│  │[COMÚN] │ │[COMÚN] │ │[RARO]  │ │[COMÚN] │ │[ÉPICO] │       │
│  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘       │
│                                                                  │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐       │
│  │  🐸    │ │  🌴    │ │   🔒   │ │   🔒   │ │   🔒   │       │
│  │ Amigo  │ │El Yunque│ │  ???   │ │  ???   │ │  ???   │       │
│  │del Coquí│ Explorador│        │ │        │ │        │       │
│  │        │ │        │ │        │ │        │ │        │       │
│  │+400 pts│ │+600 pts│ │        │ │        │ │        │       │
│  │[CULTURAL│[CULTURAL││        │ │        │ │        │       │
│  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘       │
│                                                                  │
│  ... (more badges)                                              │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │            Next Badge to Unlock                           │  │
│  │                                                            │  │
│  │  🎤 Clear Speaker (Uncommon)                              │  │
│  │  Logra 90% de precisión 10 veces                          │  │
│  │                                                            │  │
│  │  Progress: 7/10  [███████░░░] 70%                         │  │
│  │  Reward: +300 points                                      │  │
│  │                                                            │  │
│  │  [PRACTICE NOW →]                                         │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## 8. Responsive Design Breakpoints

### Mobile Layout (320px - 768px)

```typescript
// Single column, vertical stacking
export const mobileLayout = {
  dashboard: {
    layout: 'flex flex-col gap-4',
    welcomeCard: 'w-full',
    statsWidget: 'w-full',
    challenges: 'grid-cols-1',
    continueReading: 'carousel-single',
    quickActions: 'grid-cols-2'
  },

  readingExercise: {
    layout: 'flex flex-col',
    image: 'w-full aspect-[4/3]',
    coqui: 'fixed bottom-20 right-4',
    text: 'text-xl leading-relaxed',
    controls: 'fixed bottom-0 w-full'
  },

  comprehension: {
    question: 'text-xl px-4',
    options: 'grid-cols-1 gap-3',
    buttons: 'w-full'
  }
};
```

### Tablet Layout (768px - 1024px)

```typescript
export const tabletLayout = {
  dashboard: {
    layout: 'grid grid-cols-2 gap-6',
    challenges: 'grid-cols-2',
    continueReading: 'carousel-double',
    quickActions: 'grid-cols-3'
  },

  readingExercise: {
    layout: 'grid grid-cols-[2fr_1fr]',
    image: 'w-full',
    coqui: 'sidebar',
    text: 'text-2xl',
    controls: 'sticky bottom-4'
  }
};
```

### Desktop Layout (1024px+)

```typescript
export const desktopLayout = {
  dashboard: {
    layout: 'grid grid-cols-3 gap-8',
    challenges: 'grid-cols-3',
    continueReading: 'carousel-quad',
    quickActions: 'grid-cols-4'
  },

  readingExercise: {
    layout: 'grid grid-cols-[1fr_300px]',
    image: 'max-w-2xl',
    coqui: 'sidebar-sticky',
    text: 'text-3xl max-w-4xl',
    controls: 'inline-bottom'
  }
};
```

## 9. Animation Specifications

### Page Transitions

```typescript
export const pageTransitions = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 }
  },

  slideUp: {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -20, opacity: 0 },
    transition: { duration: 0.4, ease: 'easeOut' }
  },

  scaleIn: {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.9, opacity: 0 },
    transition: { duration: 0.3, ease: 'backOut' }
  }
};
```

### Button Interactions

```typescript
export const buttonAnimations = {
  hover: {
    scale: 1.05,
    transition: { duration: 0.2 }
  },

  tap: {
    scale: 0.95,
    transition: { duration: 0.1 }
  },

  disabled: {
    opacity: 0.5,
    scale: 1,
    cursor: 'not-allowed'
  }
};
```

## 10. Accessibility Features

### Keyboard Navigation Map

```typescript
export const keyboardNavigation = {
  dashboard: {
    Tab: 'Navigate between cards and buttons',
    Enter: 'Activate focused element',
    Arrow_Keys: 'Navigate carousel',
    Escape: 'Close modals'
  },

  readingExercise: {
    Space: 'Play/Pause audio',
    Enter: 'Start/Stop recording',
    Arrow_Left: 'Previous word',
    Arrow_Right: 'Next word',
    R: 'Repeat current word',
    Escape: 'Exit exercise'
  },

  comprehension: {
    1_4: 'Select answer option',
    Enter: 'Submit answer',
    Escape: 'Cancel'
  }
};
```

### Screen Reader Announcements

```typescript
export const ariaAnnouncements = {
  exercise_start: 'Ejercicio de lectura iniciado. Nivel {level}',
  word_highlight: 'Palabra actual: {word}',
  pronunciation_score: 'Puntuación de pronunciación: {score} por ciento',
  question_shown: 'Pregunta {number} de {total}: {question}',
  answer_correct: '¡Correcto! Has ganado {points} puntos',
  answer_incorrect: 'Incorrecto. Intenta de nuevo',
  level_up: '¡Felicidades! Has subido al nivel {level}',
  badge_earned: 'Has desbloqueado la insignia: {badgeName}'
};
```

## 11. Implementation Checklist

### Phase 1: Core Screens (Weeks 1-3)
- [ ] Student Dashboard
- [ ] Reading Exercise Screen
- [ ] Comprehension Check
- [ ] Basic navigation

### Phase 2: Progress & Data (Weeks 4-5)
- [ ] Progress Dashboard
- [ ] Parent View
- [ ] Teacher Dashboard
- [ ] Data visualization

### Phase 3: Gamification (Weeks 6-7)
- [ ] Badge Collection
- [ ] Achievement displays
- [ ] Streak visualizations
- [ ] Leaderboards

### Phase 4: Polish (Weeks 8-10)
- [ ] Responsive layouts
- [ ] Animations
- [ ] Accessibility
- [ ] Performance optimization

## Success Metrics

1. **Usability**: 90%+ can navigate without help (K-5 students)
2. **Engagement**: <3s average time to find desired feature
3. **Clarity**: 95%+ understand icons and labels
4. **Accessibility**: WCAG 2.1 AA compliance
5. **Performance**: <2s page load, 60fps animations
6. **Mobile**: 100% feature parity across devices

---

These mockups create an intuitive, engaging, and accessible interface that makes learning feel like play while maintaining educational rigor for K-5 students in Puerto Rico.
