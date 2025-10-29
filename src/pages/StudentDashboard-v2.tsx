import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Star, Sparkles, BookOpen, Target, ClipboardCheck, Flame, Trophy } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Helmet } from "react-helmet";
import CoquiMascot from "@/components/CoquiMascot";
import { useState, useEffect, useRef } from "react";
import { useCoquiSession } from "@/hooks/useCoquiSession";
import { CoquiClickHint } from "@/components/StudentDashboard/CoquiClickHint";
import { useStudentProfile } from "@/hooks/useStudentProfile";
import { useStudentProgress } from "@/hooks/useStudentProgress";
import { Link } from "react-router-dom";
import { ProgressRing } from "@/components/ui/progress-ring";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { SkillsProgressSection } from "@/components/StudentDashboard/SkillsProgressSection";
import { AIRecommendations } from "@/components/StudentDashboard/AIRecommendations";
import { ReadingLevelPath } from "@/components/StudentDashboard/ReadingLevelPath";
import { RecentActivitiesTimeline } from "@/components/StudentDashboard/RecentActivitiesTimeline";
import { BilingualProgressComparison } from "@/components/StudentDashboard/BilingualProgressComparison";
import { AchievementGallery } from "@/components/StudentDashboard/AchievementGallery";
import { CulturalContentShowcase } from "@/components/StudentDashboard/CulturalContentShowcase";
import { WeeklyUsageStats } from "@/components/StudentDashboard/WeeklyUsageStats";
import { QuickActions } from "@/components/StudentDashboard/QuickActions";

const StudentDashboardV2 = () => {
  const { t, language } = useLanguage();
  const [mascotState, setMascotState] = useState<"happy" | "thinking" | "reading" | "exploring" | "correct" | "excited" | "speaking">("happy");
  const [audioLevel, setAudioLevel] = useState(-100);
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);
  const hasGreeted = useRef(false);
  const { data: profile, isLoading } = useStudentProfile();

  // Dashboard voice guidance context
  const dashboardGuidance = language === 'es' 
    ? `Eres Coquí, el amigo y guía oficial de la plataforma educativa FluenxIA para estudiantes de K-5 en Puerto Rico. Tu rol es dar la bienvenida al estudiante al dashboard, presentar brevemente las opciones disponibles (Lecciones, Ejercicios, Evaluaciones), y motivarlo a explorar. Sé amigable, breve y entusiasta. Si el estudiante te pregunta algo, ayúdalo con información sobre la plataforma.`
    : `You are Coquí, the official friend and guide for the FluenxIA educational platform for K-5 students in Puerto Rico. Your role is to welcome the student to the dashboard, briefly introduce the available options (Lessons, Exercises, Assessments), and motivate them to explore. Be friendly, brief, and enthusiastic. If the student asks you something, help them with information about the platform.`;

  // Voice session management
  const {
    isConnected,
    isConnecting,
    isAIPlaying,
    startSession,
    endSession,
    sendText
  } = useCoquiSession({
    activityId: undefined, // System activity - no specific lesson/exercise
    activityType: 'system',
    voiceContext: {
      title: 'Dashboard Introduction',
      language: language === 'es' ? 'es-PR' : 'en-US',
      voiceGuidance: dashboardGuidance
    },
    onAudioLevel: (dbLevel) => {
      setAudioLevel(dbLevel);
      const isSpeaking = dbLevel > -45;
      setIsUserSpeaking(isSpeaking);
    }
  });

  // Update mascot state based on voice session
  useEffect(() => {
    if (isAIPlaying) {
      setMascotState('speaking');
    } else if (isUserSpeaking) {
      setMascotState('thinking');
    } else if (isConnected) {
      setMascotState('exploring');
    } else {
      setMascotState('happy');
    }
  }, [isAIPlaying, isConnected, isUserSpeaking]);

  // Send initial greeting when connection is established
  useEffect(() => {
    if (!isConnected) return;
    if (hasGreeted.current) return;
    if (!sendText) {
      console.warn('[StudentDashboard] ⚠️ sendText not available yet');
      return;
    }

    hasGreeted.current = true;
    
    const greeting = language === 'es'
      ? '¡Hola! Por favor, preséntate y explica cómo puedes ayudarme en mi dashboard.'
      : 'Hello! Please introduce yourself and explain how you can help me on my dashboard.';
    
    console.log('[StudentDashboard] 👋 Sending initial greeting to Coquí');
    console.log('[StudentDashboard] 📝 Greeting text:', greeting);
    
    // Small delay to ensure WebSocket is fully ready
    setTimeout(() => {
      sendText(greeting);
      console.log('[StudentDashboard] ✅ Greeting sent!');
    }, 100);
  }, [isConnected, sendText, language]);

  // Reset greeting flag when disconnecting
  useEffect(() => {
    if (!isConnected && hasGreeted.current) {
      hasGreeted.current = false;
    }
  }, [isConnected]);

  // Handle Coquí click to start session
  const handleCoquiClick = async () => {
    if (isConnected || isConnecting) return;
    localStorage.setItem("coqui-hint-dismissed", "true");
    await startSession();
  };

  // Cleanup session on unmount
  useEffect(() => {
    return () => {
      if (isConnected) {
        endSession();
      }
    };
  }, [isConnected, endSession]);

  const lessonsProgress = useStudentProgress({
    activityType: "lesson",
    gradeLevel: profile?.gradeLevel ?? 0,
    learningLanguages: profile?.learningLanguages ?? ["es", "en"],
  });

  const exercisesProgress = useStudentProgress({
    activityType: "exercise",
    gradeLevel: profile?.gradeLevel ?? 0,
    learningLanguages: profile?.learningLanguages ?? ["es", "en"],
  });

  const assessmentsProgress = useStudentProgress({
    activityType: "assessment",
    gradeLevel: profile?.gradeLevel ?? 0,
    learningLanguages: profile?.learningLanguages ?? ["es", "en"],
  });

  const getGradeLabel = (gradeLevel: number) => {
    if (gradeLevel === 0) return t("Kindergarten", "Kindergarten");
    return t(`${gradeLevel}er Grado`, `Grade ${gradeLevel}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const activityCards = [
    {
      icon: BookOpen,
      title: t("Lecciones", "Lessons"),
      description: t("¡Sigue Aprendiendo!", "Continue Learning!"),
      completedCount: lessonsProgress.data?.completedCount ?? 0,
      totalActivities: lessonsProgress.data?.totalActivities ?? 0,
      route: "/student-dashboard/lessons",
      bgColor: "bg-[hsl(329,100%,95%)]",
      borderColor: "border-[hsl(329,100%,65%)]",
      textColor: "text-[hsl(329,100%,35%)]",
      iconBg: "bg-[hsl(329,100%,71%)]",
      shadowColor: "shadow-[0_6px_0_hsl(329,100%,65%)]",
    },
    {
      icon: Target,
      title: t("Ejercicios", "Exercises"),
      description: t("¡Practica tu Lectura!", "Exercise Your Reading!"),
      completedCount: exercisesProgress.data?.completedCount ?? 0,
      totalActivities: exercisesProgress.data?.totalActivities ?? 0,
      route: "/student-dashboard/exercises",
      bgColor: "bg-[hsl(11,100%,95%)]",
      borderColor: "border-[hsl(11,100%,65%)]",
      textColor: "text-[hsl(11,100%,35%)]",
      iconBg: "bg-[hsl(11,100%,67%)]",
      shadowColor: "shadow-[0_6px_0_hsl(11,100%,65%)]",
    },
    {
      icon: ClipboardCheck,
      title: t("Evaluaciones", "Assessments"),
      description: t("¡Demuestra lo Aprendido!", "Show What You Know!"),
      completedCount: assessmentsProgress.data?.completedCount ?? 0,
      totalActivities: assessmentsProgress.data?.totalActivities ?? 0,
      route: "/student-dashboard/assessments",
      bgColor: "bg-[hsl(27,100%,95%)]",
      borderColor: "border-[hsl(27,100%,65%)]",
      textColor: "text-[hsl(27,100%,35%)]",
      iconBg: "bg-[hsl(27,100%,71%)]",
      shadowColor: "shadow-[0_6px_0_hsl(27,100%,65%)]",
    },
  ];

  const xpProgress = 75; // Mock data - 75% to next level
  const currentXP = 1875;
  const nextLevelXP = 2500;
  const currentLevel = 12;

  return (
    <>
      <Helmet>
        <title>{t("Mi Panel - FluenxIA", "My Dashboard - FluenxIA")}</title>
        <meta name="description" content={t("Panel de estudiante", "Student dashboard")} />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-gradient-to-b from-sky-100 via-green-50 to-yellow-50">
        <Header />
        
        <main className="flex-1 py-8 md:py-12">
          <div className="container px-4 md:px-6 max-w-7xl mx-auto space-y-8">
            
            {/* Top Stats Bar with Duolingo-style Gamification */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Streak Counter */}
              <div className="rounded-2xl border-4 border-[hsl(27,100%,65%)] bg-white p-6 shadow-[0_6px_0_hsl(27,100%,65%)] hover:shadow-[0_8px_0_hsl(27,100%,65%)] hover:-translate-y-0.5 transition-all">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Flame className="h-12 w-12 text-[hsl(27,100%,55%)] fill-[hsl(27,100%,55%)]" />
                    <div className="absolute -top-1 -right-1 bg-white rounded-full w-6 h-6 flex items-center justify-center border-2 border-[hsl(27,100%,55%)]">
                      <span className="text-xs font-bold text-[hsl(27,100%,35%)]">7</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-[hsl(27,100%,35%)]">7</div>
                    <div className="text-sm font-bold text-gray-600">{t("días seguidos", "day streak")}</div>
                  </div>
                </div>
              </div>

              {/* Level with XP Bar */}
              <div className="rounded-2xl border-4 border-[hsl(45,100%,65%)] bg-white p-6 shadow-[0_6px_0_hsl(45,100%,65%)] hover:shadow-[0_8px_0_hsl(45,100%,65%)] hover:-translate-y-0.5 transition-all">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-[hsl(45,100%,71%)] to-[hsl(45,100%,55%)] rounded-full w-14 h-14 flex items-center justify-center border-4 border-[hsl(45,100%,65%)]">
                    <Trophy className="h-7 w-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-2xl font-bold text-[hsl(45,100%,35%)]">{t("Nivel", "Level")} {currentLevel}</div>
                    <Progress value={xpProgress} variant="student-yellow" className="h-4 mt-2" />
                    <div className="text-xs font-bold text-gray-600 mt-1">{currentXP}/{nextLevelXP} XP</div>
                  </div>
                </div>
              </div>

              {/* Total Stars */}
              <div className="rounded-2xl border-4 border-[hsl(125,100%,65%)] bg-white p-6 shadow-[0_6px_0_hsl(125,100%,65%)] hover:shadow-[0_8px_0_hsl(125,100%,65%)] hover:-translate-y-0.5 transition-all">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Star className="h-12 w-12 text-[hsl(125,100%,55%)] fill-[hsl(125,100%,55%)]" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-[hsl(125,100%,35%)]">156</div>
                    <div className="text-sm font-bold text-gray-600">{t("estrellas totales", "total stars")}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Welcome Section with Interactive Coquí */}
            <div className="rounded-3xl border-4 border-white bg-gradient-to-br from-[hsl(176,84%,95%)] to-[hsl(176,84%,85%)] p-8 md:p-12 shadow-[0_8px_0_rgba(255,255,255,0.8)]">
              <div className="grid md:grid-cols-[auto_1fr] gap-8 items-center">
                {/* Interactive Mascot */}
                <div className="flex justify-center">
                  <div className="relative inline-block">
                    <div onClick={handleCoquiClick}>
                      <CoquiMascot 
                        state={isConnecting ? "waiting" : mascotState}
                        size="large"
                        position="inline"
                        className={
                          isConnecting 
                            ? "animate-pulse cursor-wait drop-shadow-2xl" 
                            : isConnected 
                              ? "animate-breathe drop-shadow-2xl" 
                              : "cursor-pointer hover:scale-105 transition-transform drop-shadow-2xl"
                        }
                      />
                    </div>
                    {!isConnected && !isConnecting && <CoquiClickHint />}
                  </div>
                </div>
                
                {/* Text Content */}
                <div className="text-center md:text-left">
                  <Badge className="mb-4 text-base px-4 py-2 bg-white border-2 border-[hsl(176,84%,55%)] text-[hsl(176,84%,35%)] shadow-[0_3px_0_hsl(176,84%,55%)]">
                    {getGradeLabel(profile?.gradeLevel ?? 0)}
                  </Badge>
                  <h1 className="text-4xl md:text-6xl font-black mb-4 text-[hsl(176,84%,25%)]">
                    {t("¡Hola, ", "Hello, ")}{profile?.fullName || t("Estudiante", "Student")}! 👋
                  </h1>
                  <p className="text-xl md:text-2xl font-bold text-[hsl(176,84%,30%)]">
                    {t("¿Qué quieres hacer hoy?", "What do you want to do today?")}
                  </p>
                  
                  {/* Status Text */}
                  <p className="text-lg md:text-xl font-semibold text-[hsl(176,84%,35%)] mt-4">
                    {isConnecting
                      ? t("Conectando...", "Connecting...")
                      : isConnected
                        ? isAIPlaying
                          ? t("🐸 Coquí está hablando...", "🐸 Coquí is speaking...")
                          : t("¡Háblame! Estoy escuchando 👂", "Talk to me! I'm listening 👂")
                        : t("Haz clic en Coquí para empezar", "Click on Coquí to start")
                    }
                  </p>
                </div>
              </div>
            </div>


            {/* Activity Cards - Duolingo Style with 3D Effect */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {activityCards.map((card) => {
                const progress = card.totalActivities > 0 
                  ? (card.completedCount / card.totalActivities) * 100 
                  : 0;

                return (
                  <Link key={card.route} to={card.route} className="group">
                    <div className={`rounded-3xl border-4 ${card.borderColor} ${card.bgColor} p-6 ${card.shadowColor} hover:shadow-[0_8px_0_${card.borderColor}] hover:-translate-y-0.5 active:translate-y-1 active:shadow-[0_2px_0_${card.borderColor}] transition-all`}>
                      <div className="flex flex-col items-center text-center space-y-4">
                        {/* Icon with 3D effect */}
                        <div className={`${card.iconBg} rounded-2xl p-5 border-4 ${card.borderColor} shadow-[0_4px_0_${card.borderColor}]`}>
                          <card.icon className="w-10 h-10 text-white" />
                        </div>
                        
                        {/* Title */}
                        <h3 className={`text-2xl font-black ${card.textColor}`}>{card.title}</h3>
                        
                        {/* Progress Ring */}
                        <div className="py-2">
                          <ProgressRing 
                            progress={progress} 
                            size={80}
                            strokeWidth={8}
                            className={card.textColor}
                          />
                        </div>
                        
                        {/* Stats */}
                        <div className="space-y-1">
                          <p className={`text-sm font-bold ${card.textColor} opacity-80`}>
                            {card.description}
                          </p>
                          <div className="text-lg font-bold text-gray-700">
                            {card.completedCount}/{card.totalActivities} {t("completados", "completed")}
                          </div>
                        </div>

                        {/* CTA Button */}
                        <button className={`w-full rounded-xl border-4 ${card.borderColor} ${card.iconBg} text-white font-black text-lg py-3 px-6 shadow-[0_4px_0_${card.borderColor}] hover:shadow-[0_6px_0_${card.borderColor}] hover:-translate-y-0.5 active:translate-y-1 active:shadow-[0_1px_0_${card.borderColor}] transition-all`}>
                          {t("¡Continuar!", "Continue!")}
                        </button>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Quick Actions */}
            <QuickActions />

            {/* Reading Skills Progress Section */}
            <SkillsProgressSection />

            {/* AI Mentor Recommendations */}
            <AIRecommendations />

            {/* Reading Level Progression Path */}
            <ReadingLevelPath 
              currentLevel={currentLevel}
              currentXP={currentXP}
              nextLevelXP={nextLevelXP}
              gradeLevel={profile?.gradeLevel ?? 0}
            />

            {/* Weekly Usage Statistics */}
            <WeeklyUsageStats />

            {/* Recent Activities Timeline */}
            <RecentActivitiesTimeline />

            {/* Bilingual Progress Comparison */}
            <BilingualProgressComparison />

            {/* Achievement Gallery */}
            <AchievementGallery />

            {/* Cultural Content Showcase */}
            <CulturalContentShowcase />

            {/* Daily Goal Progress */}
            <div className="rounded-3xl border-4 border-[hsl(125,100%,65%)] bg-white p-8 shadow-[0_6px_0_hsl(125,100%,65%)]">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-black text-[hsl(125,100%,35%)]">
                  {t("¡Meta Diaria!", "Daily Goal!")}
                </h2>
                <span className="text-4xl">🎯</span>
              </div>
              <div className="space-y-4">
                <p className="text-lg font-bold text-gray-700">
                  {t("30 actividades para ganar tu próxima medalla", "30 activities to earn your next medal")}
                </p>
                <Progress value={80} variant="student-lime" />
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-700">24/30</span>
                  <span className="text-lg font-bold text-[hsl(125,100%,35%)]">
                    {t("¡Solo 6 más! 💪", "Just 6 more! 💪")}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default StudentDashboardV2;
