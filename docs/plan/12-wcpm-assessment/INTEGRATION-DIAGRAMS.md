# WCPM Assessment - Integration Diagrams & Flowcharts
## Visual System Architecture and Data Flows

**Version:** 1.0
**Date:** October 23, 2025

---

## Table of Contents

1. [System Architecture Diagram](#system-architecture-diagram)
2. [Data Flow Diagrams](#data-flow-diagrams)
3. [Sequence Diagrams](#sequence-diagrams)
4. [State Machine Diagrams](#state-machine-diagrams)
5. [Component Interaction Diagrams](#component-interaction-diagrams)
6. [Deployment Architecture](#deployment-architecture)

---

## System Architecture Diagram

### High-Level Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        A[React App<br/>ViewAssessment.tsx]
        B[WCPM Live Meter<br/>Component]
        C[EnhancedRealtimeClient<br/>WCPM Tracker]
    end

    subgraph "Voice API Layer"
        D[OpenAI Realtime API<br/>WebRTC Connection]
        E[Speech-to-Text<br/>Transcription]
    end

    subgraph "Backend Layer"
        F[Supabase Edge Function<br/>calculate-wcpm]
        G[WCPM Calculator<br/>Algorithm]
        H[Benchmark Comparator<br/>Risk Assessment]
    end

    subgraph "Data Layer"
        I[(PostgreSQL Database)]
        J[wcpm_scores Table]
        K[voice_assessment_results]
        L[profiles Table]
    end

    A -->|User Action| C
    B -->|Display| A
    C -->|Audio Stream| D
    D -->|Transcription| E
    E -->|Text + Timing| C
    C -->|Calculation Request| F
    F -->|Process| G
    G -->|Assess| H
    H -->|Store Results| I
    I -->|Contains| J
    I -->|Contains| K
    I -->|Contains| L
    F -->|Response| C
    C -->|Update UI| B
```

### Layered Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                        │
│  - ViewAssessment.tsx (Assessment display)                  │
│  - WCPMLiveMeter.tsx (Real-time feedback)                   │
│  - AssessmentControls (Start/Stop buttons)                  │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                   Application Layer                          │
│  - EnhancedRealtimeClient (WCPM tracking)                   │
│  - WCPMTracker (State management)                           │
│  - Event handlers (Progress, completion)                     │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    Service Layer                             │
│  - OpenAI Realtime API (Speech-to-text)                     │
│  - Supabase Edge Functions (WCPM calculation)                │
│  - Authentication service (JWT validation)                   │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                     Data Layer                               │
│  - PostgreSQL (wcpm_scores, voice_assessment_results)       │
│  - Row-Level Security (Privacy enforcement)                  │
│  - Indexes (Performance optimization)                        │
└─────────────────────────────────────────────────────────────┘
```

---

## Data Flow Diagrams

### DFD Level 0: Context Diagram

```mermaid
graph LR
    Student((Student))
    Teacher((Teacher))
    System[WCPM Assessment<br/>System]
    Database[(Database)]

    Student -->|Reads Passage| System
    System -->|WCPM Score| Student
    System -->|Store Results| Database
    Teacher -->|View Reports| System
    System -->|Retrieve Scores| Database
```

### DFD Level 1: Process Breakdown

```mermaid
graph TB
    subgraph "1.0 Reading Session"
        A[1.1 Start Session] --> B[1.2 Capture Audio]
        B --> C[1.3 Track Timing]
    end

    subgraph "2.0 Transcription"
        D[2.1 Stream Audio] --> E[2.2 Convert to Text]
        E --> F[2.3 Return Segments]
    end

    subgraph "3.0 WCPM Calculation"
        G[3.1 Align Words] --> H[3.2 Count Errors]
        H --> I[3.3 Calculate WCPM]
        I --> J[3.4 Assess Risk]
    end

    subgraph "4.0 Data Storage"
        K[4.1 Validate Data] --> L[4.2 Insert Record]
        L --> M[4.3 Update Profile]
    end

    C --> D
    F --> G
    J --> K
```

### DFD Level 2: WCPM Calculation Detail

```mermaid
graph TB
    Start[Transcription Complete]

    Start --> Normalize[Normalize Text<br/>- Lowercase<br/>- Remove punctuation<br/>- Trim spaces]

    Normalize --> Tokenize[Tokenize Words<br/>- Split on whitespace<br/>- Handle contractions]

    Tokenize --> Align[Align Words<br/>- Dynamic programming<br/>- Edit distance matrix]

    Align --> CountErrors[Count Errors<br/>- Omissions<br/>- Substitutions<br/>- Mispronunciations]

    CountErrors --> CalcWCPM[Calculate WCPM<br/>WCPM = (words - errors) / (time/60)]

    CalcWCPM --> GetBenchmark[Get Benchmark<br/>- Current period<br/>- Grade level]

    GetBenchmark --> AssessRisk[Assess Risk Level<br/>- Above: ≥120%<br/>- On-Level: 80-119%<br/>- Below: 50-79%<br/>- Far Below: <50%]

    AssessRisk --> Return[Return Results]
```

---

## Sequence Diagrams

### Sequence 1: Complete WCPM Assessment Flow

```mermaid
sequenceDiagram
    actor Student
    participant UI as ViewAssessment
    participant Client as EnhancedRealtimeClient
    participant OpenAI as OpenAI Realtime API
    participant EdgeFn as calculate-wcpm Function
    participant DB as PostgreSQL

    Note over Student,DB: Reading Session Initiation
    Student->>UI: Click "Start Reading"
    UI->>Client: startWCPMTracking(passage)
    Client->>Client: Initialize tracker state
    Client->>OpenAI: Establish WebRTC connection
    OpenAI-->>Client: Connection ready
    UI->>Student: Show "Recording..." indicator

    Note over Student,DB: Reading in Progress
    loop Every spoken word
        Student->>Client: Speak into microphone
        Client->>OpenAI: Stream audio (PCM16, 24kHz)
        OpenAI->>OpenAI: Transcribe (Whisper)
        OpenAI-->>Client: Transcription segment
        Client->>Client: Record segment + timestamp
        Client->>UI: Emit progress event
        UI->>Student: Update progress bar
        UI->>Student: Show estimated WCPM
    end

    Note over Student,DB: Reading Completion
    Student->>UI: Click "Stop Reading"
    UI->>Client: stopWCPMTracking()
    Client->>Client: Mark end time
    Client->>EdgeFn: POST /calculate-wcpm<br/>{expected, transcribed, timing}
    EdgeFn->>EdgeFn: Normalize text
    EdgeFn->>EdgeFn: Align words (DP algorithm)
    EdgeFn->>EdgeFn: Count errors
    EdgeFn->>EdgeFn: Calculate WCPM
    EdgeFn->>EdgeFn: Determine risk level
    EdgeFn->>DB: INSERT INTO wcpm_scores
    DB-->>EdgeFn: Record saved (id)
    EdgeFn-->>Client: Return WCPM results
    Client->>UI: Display final WCPM
    UI->>Student: Show celebration/feedback
```

### Sequence 2: Real-Time Progress Updates

```mermaid
sequenceDiagram
    participant Client as EnhancedRealtimeClient
    participant OpenAI as OpenAI API
    participant UI as WCPM Live Meter

    Note over Client,UI: Student is reading

    loop Every 100ms while reading
        Client->>Client: Calculate elapsed time
        Client->>Client: Count transcribed words
        Client->>Client: Estimate WCPM<br/>(words / (time/60))
        Client->>UI: Emit 'wcpm:progress' event
        UI->>UI: Update progress bar
        UI->>UI: Update timer display
        UI->>UI: Update WCPM estimate
    end

    Note over Client,UI: Transcription arrives
    OpenAI-->>Client: New transcription segment
    Client->>Client: Append to segments array
    Client->>Client: Recalculate progress<br/>(transcribed / expected)
    Client->>UI: Emit updated progress
    UI->>UI: Animate progress bar
    UI->>UI: Update word count
```

### Sequence 3: Error Detection Flow

```mermaid
sequenceDiagram
    participant EdgeFn as Edge Function
    participant Aligner as Word Aligner
    participant Phonetic as Phonetic Comparator

    EdgeFn->>Aligner: alignWords(expected, transcribed)

    loop For each word pair
        Aligner->>Aligner: Compare words

        alt Words match
            Aligner->>Aligner: Mark as correct
        else Words differ
            Aligner->>Phonetic: calculateSimilarity(word1, word2)
            Phonetic->>Phonetic: Convert to phonetic form
            Phonetic->>Phonetic: Compute Levenshtein distance
            Phonetic-->>Aligner: Similarity score (0-1)

            alt Similarity > 0.7
                Aligner->>Aligner: Mark as mispronunciation
            else Similarity ≤ 0.7
                Aligner->>Aligner: Mark as substitution
            end
        end

        alt Transcribed word is null
            Aligner->>Aligner: Mark as omission
        end
    end

    Aligner-->>EdgeFn: Return alignment with error types
```

---

## State Machine Diagrams

### WCPM Session State Machine

```mermaid
stateDiagram-v2
    [*] --> Idle

    Idle --> Initializing : startWCPMTracking()
    Initializing --> WaitingForSpeech : Connection established

    WaitingForSpeech --> Reading : First word detected
    Reading --> Reading : Additional words detected
    Reading --> Paused : Long silence (>3s)
    Paused --> Reading : Speech resumes

    Reading --> Calculating : stopWCPMTracking() called
    Calculating --> Complete : Calculation success
    Calculating --> Error : Calculation failure

    Complete --> Idle : Reset
    Error --> Idle : Retry or cancel

    note right of Reading
        Events emitted:
        - wcpm:progress (100ms)
        - wcpm:segment (on transcription)
    end note

    note right of Calculating
        Calls Edge Function:
        POST /calculate-wcpm
    end note
```

### Assessment Period State

```mermaid
stateDiagram-v2
    [*] --> Determining

    Determining --> Fall : Aug-Nov
    Determining --> Winter : Dec-Feb
    Determining --> Spring : Mar-Jul

    Fall --> [*] : Benchmark = fall_wcpm
    Winter --> [*] : Benchmark = winter_wcpm
    Spring --> [*] : Benchmark = spring_wcpm

    note right of Fall
        Benchmark varies by grade:
        K: N/A, 1: 23, 2: 51
        3: 71, 4: 94, 5: 110
    end note
```

### Risk Classification State

```mermaid
stateDiagram-v2
    [*] --> CalculatePercent

    CalculatePercent --> Above : ≥120% of benchmark
    CalculatePercent --> OnLevel : 80-119% of benchmark
    CalculatePercent --> Below : 50-79% of benchmark
    CalculatePercent --> FarBelow : <50% of benchmark

    Above --> [*] : Green badge
    OnLevel --> [*] : Blue badge
    Below --> [*] : Yellow badge
    FarBelow --> [*] : Red badge

    note right of CalculatePercent
        Percent = (WCPM / Benchmark) × 100
    end note
```

---

## Component Interaction Diagrams

### React Component Hierarchy

```
┌─────────────────────────────────────────────┐
│         ViewAssessment.tsx                  │
│  (Main assessment page)                     │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │  Assessment Content Card              │ │
│  │  - Passage text                        │ │
│  │  - Images                              │ │
│  └───────────────────────────────────────┘ │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │  Assessment Controls                   │ │
│  │  - Start Reading Button                │ │
│  │  - Stop Reading Button                 │ │
│  │  - Help Buttons (Optional)             │ │
│  └───────────────────────────────────────┘ │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │  WCPMLiveMeter Component              │ │
│  │  ┌─────────────────────────────────┐  │ │
│  │  │ Progress Bar                    │  │ │
│  │  └─────────────────────────────────┘  │ │
│  │  ┌───────┬────────┬────────┐          │ │
│  │  │ WCPM  │ Target │ Time   │          │ │
│  │  │  85   │  89    │ 12s    │          │ │
│  │  └───────┴────────┴────────┘          │ │
│  │  ┌─────────────────────────────────┐  │ │
│  │  │ Visual Gauge (color-coded)      │  │ │
│  │  └─────────────────────────────────┘  │ │
│  │  Badge: On-Level (Blue)                │ │
│  └───────────────────────────────────────┘ │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │  Transcript Display (Optional)         │ │
│  │  - User speech segments                │ │
│  │  - AI responses                        │ │
│  └───────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

### Component Communication Flow

```mermaid
graph LR
    subgraph "UI Components"
        A[ViewAssessment]
        B[WCPMLiveMeter]
        C[Controls]
    end

    subgraph "State Management"
        D[wcpmData State]
        E[transcript State]
        F[isConnected State]
    end

    subgraph "Service Layer"
        G[EnhancedRealtimeClient]
    end

    A -->|useState| D
    A -->|useState| E
    A -->|useState| F

    C -->|onClick| A
    A -->|startReading| G
    G -->|emit 'wcpm:progress'| A
    A -->|setWcpmData| D
    D -->|props| B
    B -->|render| A
```

---

## Deployment Architecture

### Infrastructure Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      Internet                                │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Cloudflare CDN                            │
│  - Static assets (JS, CSS, images)                          │
│  - DDoS protection                                           │
│  - SSL/TLS termination                                       │
└───────────────────────────┬─────────────────────────────────┘
                            │
        ┌───────────────────┴───────────────────┐
        │                                       │
        ▼                                       ▼
┌──────────────────┐                 ┌──────────────────┐
│  Lovable CDN     │                 │  Supabase        │
│  - React App     │                 │  Platform        │
│  - Static Build  │                 │                  │
└──────────────────┘                 └────────┬─────────┘
                                              │
                        ┌─────────────────────┼─────────────────────┐
                        │                     │                     │
                        ▼                     ▼                     ▼
            ┌────────────────────┐  ┌────────────────┐  ┌────────────────┐
            │  Edge Functions    │  │  PostgreSQL    │  │  Auth Service  │
            │  - calculate-wcpm  │  │  - wcpm_scores │  │  - JWT tokens  │
            │  - Deno runtime    │  │  - RLS         │  │  - Session mgmt│
            └────────────────────┘  └────────────────┘  └────────────────┘
                        │
                        ▼
            ┌────────────────────┐
            │  OpenAI API        │
            │  - Realtime API    │
            │  - WebRTC endpoint │
            │  - Whisper STT     │
            └────────────────────┘
```

### Network Flow

```
Student Browser
    │
    ├─► [HTTP/2] → Lovable CDN → React App (static)
    │
    ├─► [WebRTC] → OpenAI Realtime API → Audio transcription
    │
    ├─► [HTTPS] → Supabase Edge Functions → calculate-wcpm
    │
    └─► [HTTPS] → Supabase PostgREST → Database queries

Data Flow:
1. HTML/CSS/JS: Lovable CDN (cached, fast)
2. Audio: Direct WebRTC to OpenAI (low latency)
3. Calculations: Edge Functions (serverless, auto-scale)
4. Storage: PostgreSQL (ACID, encrypted)
```

### Scalability Architecture

```
                        [Load Balancer]
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
[Edge Function 1]     [Edge Function 2]     [Edge Function 3]
(Auto-scaled)         (Auto-scaled)         (Auto-scaled)
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              │
                    [Connection Pool]
                              │
                              ▼
                    [PostgreSQL Primary]
                              │
                    ┌─────────┴─────────┐
                    │                   │
                    ▼                   ▼
            [Read Replica 1]    [Read Replica 2]

Scaling Strategy:
- Edge Functions: Auto-scale based on concurrent requests
- Database: Read replicas for analytics queries
- WebRTC: Direct P2P connection (no server load)
```

---

## Error Flow Diagrams

### Error Handling Flow

```mermaid
graph TB
    Start[User Action] --> Try[Try Operation]

    Try -->|Success| Success[Complete]
    Try -->|Error| Catch[Catch Exception]

    Catch --> Classify{Error Type?}

    Classify -->|Network| Network[Network Error]
    Classify -->|Auth| Auth[Auth Error]
    Classify -->|Validation| Validation[Validation Error]
    Classify -->|Unknown| Unknown[Unknown Error]

    Network --> Retry{Retry?}
    Retry -->|Yes| Try
    Retry -->|No| UserNotify[Notify User]

    Auth --> Refresh[Refresh Token]
    Refresh -->|Success| Try
    Refresh -->|Fail| UserNotify

    Validation --> UserNotify
    Unknown --> Log[Log Error]
    Log --> UserNotify

    UserNotify --> End[Display Toast]
```

### Retry Logic Flow

```mermaid
graph TB
    Request[API Request] --> Attempt{Attempt #?}

    Attempt -->|1| Try1[Try Request]
    Attempt -->|2| Try2[Wait 1s, Try Request]
    Attempt -->|3| Try3[Wait 2s, Try Request]

    Try1 -->|Success| Success[Return Result]
    Try1 -->|Fail| Wait1[Wait 1s]
    Wait1 --> Attempt

    Try2 -->|Success| Success
    Try2 -->|Fail| Wait2[Wait 2s]
    Wait2 --> Attempt

    Try3 -->|Success| Success
    Try3 -->|Fail| Failed[Return Error]

    Success --> End[Done]
    Failed --> End
```

---

## Database Entity-Relationship Diagram

```mermaid
erDiagram
    profiles ||--o{ wcpm_scores : has
    profiles ||--o{ voice_assessment_results : has
    manual_assessments ||--o{ wcpm_scores : assesses
    manual_assessments ||--o{ voice_assessment_results : assesses

    profiles {
        uuid id PK
        string full_name
        string app_role
        int grade_level
        timestamp created_at
    }

    wcpm_scores {
        uuid id PK
        uuid student_id FK
        uuid assessment_id FK
        int grade_level
        text expected_text
        text transcribed_text
        int total_words
        int words_read
        int omissions
        int substitutions
        int mispronunciations
        numeric time_seconds
        int wcpm
        int accuracy
        string risk_level
        int benchmark_wcpm
        int percent_of_benchmark
        string assessment_period
        string language
        timestamp created_at
    }

    voice_assessment_results {
        uuid id PK
        uuid student_id FK
        uuid assessment_id FK
        uuid wcpm_score_id FK
        int reading_wcpm
        int reading_accuracy
        jsonb metadata
        timestamp created_at
    }

    manual_assessments {
        uuid id PK
        string title
        jsonb content
        string language
        int grade_level
        text voice_guidance
        timestamp created_at
    }
```

---

## Performance Optimization Flow

```mermaid
graph TB
    Request[WCPM Calculation Request]

    Request --> Cache{In Cache?}
    Cache -->|Yes| Return[Return Cached Result]
    Cache -->|No| Process[Process Calculation]

    Process --> Parallel{Can Parallelize?}
    Parallel -->|Yes| Split[Split into Sub-tasks]
    Split --> Sub1[Normalize Text]
    Split --> Sub2[Get Benchmark]

    Sub1 --> Join[Join Results]
    Sub2 --> Join

    Parallel -->|No| Sequential[Sequential Processing]
    Sequential --> Join

    Join --> Align[Word Alignment<br/>O(n×m) complexity]
    Align --> Count[Count Errors<br/>O(n) complexity]
    Count --> Calc[Calculate WCPM<br/>O(1) complexity]
    Calc --> Store[Store in Database]
    Store --> CacheSet[Set Cache Entry]
    CacheSet --> Return
```

---

## Monitoring Dashboard Layout

```
┌─────────────────────────────────────────────────────────────┐
│                 WCPM System Dashboard                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────┬────────────┬────────────┬────────────┐     │
│  │  Total     │  Success   │  Failed    │  Avg       │     │
│  │  Calcs     │  Rate      │  Rate      │  Latency   │     │
│  │  15,234    │  99.2%     │  0.8%      │  285ms     │     │
│  └────────────┴────────────┴────────────┴────────────┘     │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  WCPM Distribution by Grade                          │  │
│  │  [Bar Chart]                                          │  │
│  │  K: 28  1: 75  2: 85  3: 95  4: 110  5: 125         │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Risk Level Distribution                              │  │
│  │  [Pie Chart]                                          │  │
│  │  Above: 15%  On-Level: 60%  Below: 20%  Far: 5%     │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Recent Calculations (Live)                           │  │
│  │  StudentA | Grade 2 | 89 WCPM | On-Level | 2s ago   │  │
│  │  StudentB | Grade 3 | 105 WCPM | Above | 5s ago     │  │
│  │  StudentC | Grade 1 | 65 WCPM | Below | 8s ago      │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Conclusion

These diagrams provide a comprehensive visual representation of the WCPM Assessment system architecture, data flows, and component interactions. They serve as:

1. **Development Guide:** Clear blueprints for implementation
2. **Communication Tool:** Visual aids for stakeholder discussions
3. **Documentation:** Permanent record of system design
4. **Troubleshooting Reference:** Quick diagnosis of issues

**All diagrams are in Mermaid format** and can be rendered in:
- GitHub Markdown
- VS Code (with Mermaid extension)
- Mermaid Live Editor (https://mermaid.live)
- Documentation platforms (GitBook, Confluence, etc.)

---

**Document Version:** 1.0
**Last Updated:** October 23, 2025
**Status:** Complete - Ready for development reference
