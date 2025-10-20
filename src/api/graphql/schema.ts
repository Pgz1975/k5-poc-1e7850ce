/**
 * K5 Platform GraphQL Schema
 * Type definitions for flexible querying
 */

export const typeDefs = `
  # ============================================================================
  # Scalar Types
  # ============================================================================

  scalar DateTime
  scalar JSON

  # ============================================================================
  # Enums
  # ============================================================================

  enum GradeLevel {
    K
    ONE
    TWO
    THREE
    FOUR
    FIVE
  }

  enum Language {
    SPANISH
    ENGLISH
    BILINGUAL
  }

  enum ContentType {
    READING_PASSAGE
    ASSESSMENT
    INSTRUCTIONAL_MATERIAL
    ACTIVITY_SHEET
    TEACHER_GUIDE
  }

  enum ProcessingStatus {
    PENDING
    PROCESSING
    COMPLETED
    FAILED
    VALIDATING
  }

  enum SubjectArea {
    READING
    COMPREHENSION
    VOCABULARY
    FLUENCY
    WRITING
    GRAMMAR
  }

  enum AssessmentType {
    DIAGNOSTIC
    FORMATIVE
    SUMMATIVE
  }

  enum QuestionType {
    MULTIPLE_CHOICE
    TRUE_FALSE
    SHORT_ANSWER
    ESSAY
  }

  # ============================================================================
  # Input Types
  # ============================================================================

  input PaginationInput {
    page: Int = 1
    limit: Int = 20
  }

  input DocumentFilter {
    contentType: [ContentType!]
    gradeLevel: [GradeLevel!]
    subjectArea: [SubjectArea!]
    primaryLanguage: [Language!]
    processingStatus: [ProcessingStatus!]
  }

  input SearchFilter {
    contentType: [ContentType!]
    gradeLevel: [GradeLevel!]
    subjectArea: [SubjectArea!]
    primaryLanguage: [Language!]
    readingLevel: String
  }

  input UploadPDFInput {
    contentType: ContentType!
    gradeLevel: [GradeLevel!]!
    subjectArea: [SubjectArea!]!
    primaryLanguage: Language!
    readingLevel: String
    curriculumStandards: [String!]
    metadata: JSON
  }

  input CreateAssessmentInput {
    documentId: ID
    title: String!
    description: String
    assessmentType: AssessmentType!
    gradeLevel: [GradeLevel!]!
    subjectArea: [SubjectArea!]!
    curriculumStandards: [String!]!
    totalPoints: Float!
    passingScore: Float!
    timeLimit: Int
    questions: [QuestionInput!]!
  }

  input QuestionInput {
    questionNumber: Int!
    questionText: String!
    questionType: QuestionType!
    points: Float!
    options: [OptionInput!]
    correctAnswer: String
    explanation: String
    curriculumStandard: String
    difficultyLevel: String
    imageUrl: String
  }

  input OptionInput {
    optionText: String!
    isCorrect: Boolean!
    order: Int!
  }

  # ============================================================================
  # Object Types
  # ============================================================================

  type PDFDocument {
    id: ID!
    filename: String!
    originalFilename: String!
    fileSize: Int!
    storageBucket: String!
    storagePath: String!
    fileHash: String!
    contentType: ContentType!
    gradeLevel: [GradeLevel!]!
    subjectArea: [SubjectArea!]!
    primaryLanguage: Language!
    readingLevel: String
    curriculumStandards: [String!]
    processingStatus: ProcessingStatus!
    processingProgress: Float
    processingError: String
    pageCount: Int!
    uploadedBy: String
    uploadedAt: DateTime!
    processedAt: DateTime
    metadata: JSON
    content: [PDFContent!]!
    images: [PDFImage!]!
  }

  type PDFContent {
    id: ID!
    documentId: ID!
    pageNumber: Int!
    textContent: String!
    rawText: String!
    detectedLanguage: Language!
    languageConfidence: Float!
    wordCount: Int!
    characterCount: Int!
    hasImages: Boolean!
    imageCount: Int!
  }

  type PDFImage {
    id: ID!
    documentId: ID!
    pageNumber: Int!
    imageIndex: Int!
    storagePath: String!
    thumbnailPath: String
    format: String!
    width: Int!
    height: Int!
    fileSize: Int!
    url: String
    alt: String
    caption: String
  }

  type Assessment {
    id: ID!
    documentId: ID
    document: PDFDocument
    title: String!
    description: String
    assessmentType: AssessmentType!
    gradeLevel: [GradeLevel!]!
    subjectArea: [SubjectArea!]!
    curriculumStandards: [String!]!
    questions: [AssessmentQuestion!]!
    totalPoints: Float!
    passingScore: Float!
    timeLimit: Int
    createdBy: String!
    createdAt: DateTime!
  }

  type AssessmentQuestion {
    id: ID!
    assessmentId: ID!
    questionNumber: Int!
    questionText: String!
    questionType: QuestionType!
    points: Float!
    options: [AssessmentOption!]
    correctAnswer: String
    explanation: String
    curriculumStandard: String
    difficultyLevel: String
    imageUrl: String
  }

  type AssessmentOption {
    id: ID!
    questionId: ID!
    optionText: String!
    isCorrect: Boolean!
    order: Int!
  }

  type SearchResult {
    document: PDFDocument!
    relevance: Float!
    highlights: [String!]
    matchedContent: [MatchedContent!]
  }

  type MatchedContent {
    pageNumber: Int!
    excerpt: String!
  }

  type VoiceReadingSession {
    id: ID!
    studentId: ID!
    documentId: ID
    pageNumber: Int
    transcription: String!
    expectedText: String
    fluencyScore: Float
    accuracyScore: Float
    wordsPerMinute: Float
    language: String!
    audioDuration: Float
    createdAt: DateTime!
  }

  type ProcessingProgress {
    documentId: ID!
    status: ProcessingStatus!
    progress: Float!
    currentStep: String!
    stepsCompleted: Int!
    totalSteps: Int!
    estimatedTimeRemaining: Int
    error: String
  }

  # ============================================================================
  # Response Types
  # ============================================================================

  type PaginatedDocuments {
    items: [PDFDocument!]!
    total: Int!
    page: Int!
    limit: Int!
    hasMore: Boolean!
  }

  type PaginatedAssessments {
    items: [Assessment!]!
    total: Int!
    page: Int!
    limit: Int!
    hasMore: Boolean!
  }

  type SearchResponse {
    results: [SearchResult!]!
    total: Int!
    page: Int!
    limit: Int!
    hasMore: Boolean!
  }

  type UploadResponse {
    success: Boolean!
    documentId: ID!
    message: String!
    processingStarted: Boolean!
  }

  type AnalyticsData {
    documentId: ID
    views: Int!
    downloads: Int!
    voiceReadings: Int!
    averageCompletionRate: Float!
    averageFluencyScore: Float
  }

  # ============================================================================
  # Queries
  # ============================================================================

  type Query {
    # Documents
    document(id: ID!): PDFDocument
    documents(
      filter: DocumentFilter
      pagination: PaginationInput
    ): PaginatedDocuments!

    # Search
    search(
      query: String!
      filter: SearchFilter
      pagination: PaginationInput
    ): SearchResponse!

    # Assessments
    assessment(id: ID!): Assessment
    assessments(
      filter: DocumentFilter
      pagination: PaginationInput
    ): PaginatedAssessments!

    # Voice Reading
    voiceReadingSessions(
      studentId: ID
      documentId: ID
      pagination: PaginationInput
    ): [VoiceReadingSession!]!

    # Analytics
    documentAnalytics(documentId: ID!): AnalyticsData
    studentAnalytics(
      studentId: ID!
      dateFrom: DateTime
      dateTo: DateTime
    ): JSON

    # Processing
    processingProgress(documentId: ID!): ProcessingProgress
  }

  # ============================================================================
  # Mutations
  # ============================================================================

  type Mutation {
    # Document operations
    uploadPDF(input: UploadPDFInput!): UploadResponse!
    deleteDocument(id: ID!): Boolean!

    # Assessment operations
    createAssessment(input: CreateAssessmentInput!): Assessment!
    submitAssessment(
      assessmentId: ID!
      answers: JSON!
      studentId: ID
    ): JSON!

    # Webhook operations
    createWebhookSubscription(
      url: String!
      events: [String!]!
      secret: String
    ): JSON!
  }

  # ============================================================================
  # Subscriptions
  # ============================================================================

  type Subscription {
    # Processing updates
    processingProgress(documentId: ID!): ProcessingProgress!

    # Real-time notifications
    documentUploaded(userId: ID!): PDFDocument!
    assessmentCompleted(studentId: ID!): JSON!
  }
`;
