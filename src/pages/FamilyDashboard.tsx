import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, TrendingUp, Clock, Star, Lightbulb, Target, 
  Calendar, MessageSquare, Download, Send, Video, FileText,
  Award, Bell, Settings2, Users
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Helmet } from "react-helmet";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { CollapsibleFamilySection } from "@/components/FamilyDashboard/CollapsibleFamilySection";
import { 
  studentProfile, 
  weeklyActivity, 
  weeklyStats, 
  skillsDetailed, 
  culturalVocabulary,
  achievements,
  recentActivities,
  levelProgress
} from "@/data/familyStudentData";
import { aiRecommendations, weeklyChallenge, aiInsight } from "@/data/familyRecommendations";
import { teacherMessages, progressReports, encouragementTemplates } from "@/data/familyCommunication";
import { parentGuides, videoTutorials, faqs, supportInfo } from "@/data/familyResources";
import { weeklySchedule, goals, reminders, familyChallenge } from "@/data/familyScheduleGoals";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FamilyDashboard = () => {
  const { t, language } = useLanguage();

  return (
    <>
      <Helmet>
        <title>{t("Portal Familiar - LecturaPR", "Family Portal - LecturaPR")}</title>
        <meta name="description" content={t("Portal para familias monitorear progreso de lectura", "Family portal to monitor reading progress")} />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/20">
        <Header />
        
        <main className="flex-1 py-8">
          <div className="container px-4 md:px-6 space-y-6">
            {/* Header with Student Info */}
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  {t("Portal Familiar", "Family Portal")}
                </h1>
                <p className="text-muted-foreground text-lg">
                  {t(`Progreso de ${studentProfile.name} · ${studentProfile.grade}er Grado`, 
                      `${studentProfile.name}'s Progress · ${studentProfile.grade}rd Grade`)}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Send className="h-4 w-4 mr-2" />
                  {t("Enviar Ánimo", "Send Encouragement")}
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  {t("Descargar Reporte", "Download Report")}
                </Button>
                <Button variant="outline" size="sm">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  {t("Contactar Maestra", "Contact Teacher")}
                </Button>
              </div>
            </div>

            {/* Quick Overview - Always Visible */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Reading Level Card - Pink */}
              <Card className="border-2 border-pink-200 bg-gradient-to-br from-pink-50 to-pink-100/50">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <div className="bg-pink-400 rounded-xl p-3">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <Badge className="bg-green-500 text-white hover:bg-green-600">
                    {t("Excelente", "Excellent")}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="text-sm font-medium text-foreground/70 mb-1">
                    {t("Nivel de Lectura", "Reading Level")}
                  </div>
                  <div className="text-4xl font-bold">{studentProfile.readingLevel}</div>
                  <p className="text-sm text-green-600 font-medium mt-1">
                    {t("Por encima del promedio", "Above average")}
                  </p>
                </CardContent>
              </Card>

              {/* Time This Week Card - Cyan */}
              <Card className="border-2 border-cyan-200 bg-gradient-to-br from-cyan-50 to-cyan-100/50">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <div className="bg-cyan-400 rounded-xl p-3">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <Badge className="bg-blue-500 text-white hover:bg-blue-600">
                    {t("Meta cumplida", "Goal met")}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="text-sm font-medium text-foreground/70 mb-1">
                    {t("Tiempo Esta Semana", "Time This Week")}
                  </div>
                  <div className="text-4xl font-bold">{weeklyStats.totalMinutes} <span className="text-2xl">min</span></div>
                  <p className="text-sm text-green-600 font-medium mt-1">
                    {t(`Meta: ${weeklyStats.goalMinutes} min ✅`, `Goal: ${weeklyStats.goalMinutes} min ✅`)}
                  </p>
                </CardContent>
              </Card>

              {/* Activities Completed Card - Purple */}
              <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100/50">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <div className="bg-purple-400 rounded-xl p-3">
                    <Star className="h-6 w-6 text-white" />
                  </div>
                  <Badge className="bg-yellow-500 text-white hover:bg-yellow-600">
                    +5 {t("hoy", "today")}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="text-sm font-medium text-foreground/70 mb-1">
                    {t("Actividades Completadas", "Activities Completed")}
                  </div>
                  <div className="text-4xl font-bold">24</div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t("Este mes", "This month")}
                  </p>
                </CardContent>
              </Card>

              {/* Overall Progress Card - Lime */}
              <Card className="border-2 border-lime-200 bg-gradient-to-br from-lime-50 to-lime-100/50">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <div className="bg-lime-400 rounded-xl p-3">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <Badge className="bg-green-500 text-white hover:bg-green-600">
                    +12%
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="text-sm font-medium text-foreground/70 mb-1">
                    {t("Progreso General", "Overall Progress")}
                  </div>
                  <div className="text-4xl font-bold">88%</div>
                  <p className="text-sm text-green-600 font-medium mt-1">
                    {t("este trimestre", "this quarter")}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Section 1: This Week's Activity */}
            <CollapsibleFamilySection
              id="weekly-activity"
              title={t("Actividad de Esta Semana", "This Week's Activity")}
              icon={TrendingUp}
              description={t("Minutos de lectura y patrones de uso", "Reading minutes and usage patterns")}
              defaultOpen={true}
              colorClass="blue"
              summaryContent={
                <div className="flex items-center gap-4 text-sm">
                  <div className="text-right">
                    <div className="font-bold text-lg">{weeklyStats.totalMinutes} min</div>
                    <div className="text-muted-foreground">{weeklyStats.activeDays}/7 {t("días activos", "active days")}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-600">+25% {t("sobre meta", "over goal")}</div>
                    <div className="text-orange-600">🔥 {weeklyStats.streak} {t("días", "days")}</div>
                  </div>
                </div>
              }
            >
              <div className="space-y-6">
                {/* Weekly Chart */}
                <div>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={weeklyActivity}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey={language === 'es' ? 'day' : 'dayEn'} />
                      <YAxis />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="minutes" 
                        stroke="rgb(34, 211, 238)" 
                        strokeWidth={3}
                        dot={{ fill: 'rgb(34, 211, 238)', r: 5 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Daily Breakdown */}
                <div className="grid md:grid-cols-3 gap-4">
                  <Card className="border-cyan-200 bg-cyan-50/50">
                    <CardContent className="pt-6">
                      <div className="text-sm text-muted-foreground mb-1">
                        {t("Sesión Promedio", "Average Session")}
                      </div>
                      <div className="text-2xl font-bold">{weeklyStats.averageSessionLength} min</div>
                    </CardContent>
                  </Card>
                  <Card className="border-cyan-200 bg-cyan-50/50">
                    <CardContent className="pt-6">
                      <div className="text-sm text-muted-foreground mb-1">
                        {t("Sesión Más Larga", "Longest Session")}
                      </div>
                      <div className="text-2xl font-bold">{weeklyStats.longestSession} min</div>
                      <div className="text-xs text-muted-foreground">
                        {t("Miércoles tarde", "Wednesday afternoon")}
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-cyan-200 bg-cyan-50/50">
                    <CardContent className="pt-6">
                      <div className="text-sm text-muted-foreground mb-1">
                        {t("Horario Preferido", "Preferred Time")}
                      </div>
                      <div className="text-lg font-bold">{weeklyStats.preferredTime}</div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CollapsibleFamilySection>

            {/* Section 2: Reading Skills Progress */}
            <CollapsibleFamilySection
              id="reading-skills"
              title={t("Progreso de Habilidades de Lectura", "Reading Skills Progress")}
              icon={BookOpen}
              description={t("Evaluación detallada por categoría", "Detailed assessment by category")}
              defaultOpen={true}
              colorClass="pink"
              summaryContent={
                <div className="flex items-center gap-4 text-sm">
                  <div className="text-right">
                    <div className="font-bold text-lg">88% {t("general", "overall")}</div>
                    <div className="text-green-600">⭐ {t("Vocabulario", "Vocabulary")}: 90%</div>
                  </div>
                  <div className="text-right">
                    <div className="text-orange-600 font-medium">
                      📝 {t("Practicar", "Practice")}: {t("Pronunciación", "Pronunciation")} 82%
                    </div>
                    <div className="text-muted-foreground">+5% {t("este mes", "this month")}</div>
                  </div>
                </div>
              }
            >
              <div className="space-y-6">
                {/* Main Skills Bars */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    {/* Comprehension */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold">{t("Comprensión", "Comprehension")}</span>
                        <span className="font-bold text-pink-600">{skillsDetailed.comprehension.overall}%</span>
                      </div>
                      <div className="h-3 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-pink-400 to-pink-600 transition-all" 
                          style={{ width: `${skillsDetailed.comprehension.overall}%` }}
                        />
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground pl-2">
                        {t("Ideas principales", "Main ideas")}: {skillsDetailed.comprehension.subskills.mainIdeas}% · 
                        {t("Inferencia", "Inference")}: {skillsDetailed.comprehension.subskills.inference}% · 
                        {t("Detalles", "Details")}: {skillsDetailed.comprehension.subskills.details}%
                      </div>
                    </div>

                    {/* Fluency */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold">{t("Fluidez", "Fluency")}</span>
                        <span className="font-bold text-cyan-600">{skillsDetailed.fluency.overall}%</span>
                      </div>
                      <div className="h-3 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-cyan-400 to-cyan-600 transition-all" 
                          style={{ width: `${skillsDetailed.fluency.overall}%` }}
                        />
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground pl-2">
                        {skillsDetailed.fluency.wordsPerMinute} {t("palabras/min", "words/min")} · 
                        {t("Expresión", "Expression")}: {skillsDetailed.fluency.expressionScore}%
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Vocabulary */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold">{t("Vocabulario", "Vocabulary")} ⭐</span>
                        <span className="font-bold text-purple-600">{skillsDetailed.vocabulary.overall}%</span>
                      </div>
                      <div className="h-3 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-purple-400 to-purple-600 transition-all" 
                          style={{ width: `${skillsDetailed.vocabulary.overall}%` }}
                        />
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground pl-2">
                        {skillsDetailed.vocabulary.newWordsThisMonth} {t("palabras nuevas este mes", "new words this month")} · 
                        {t("Retención", "Retention")}: {skillsDetailed.vocabulary.retentionRate}%
                      </div>
                    </div>

                    {/* Pronunciation */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold">{t("Pronunciación", "Pronunciation")} ⚠️</span>
                        <span className="font-bold text-orange-600">{skillsDetailed.pronunciation.overall}%</span>
                      </div>
                      <div className="h-3 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-orange-400 to-orange-600 transition-all" 
                          style={{ width: `${skillsDetailed.pronunciation.overall}%` }}
                        />
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground pl-2">
                        {t("Necesita práctica", "Needs practice")}: {skillsDetailed.pronunciation.commonChallenges.join(", ")}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cultural Vocabulary Tracker */}
                <Card className="border-lime-200 bg-lime-50/30">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      🇵🇷 {t("Vocabulario Cultural Puertorriqueño", "Puerto Rican Cultural Vocabulary")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">
                          {t("Historias culturales completadas", "Cultural stories completed")}
                        </span>
                        <span className="font-bold text-lime-600">{culturalVocabulary.percentage}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-lime-400 to-lime-600 transition-all" 
                          style={{ width: `${culturalVocabulary.percentage}%` }}
                        />
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {culturalVocabulary.completedStories}/{culturalVocabulary.totalCulturalStories} {t("historias", "stories")}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <div className="text-sm">
                        <span className="font-medium">{t("Dominadas", "Mastered")}:</span> 
                        {culturalVocabulary.mastered.map((word, i) => (
                          <Badge key={i} variant="outline" className="ml-1 bg-green-100 text-green-700 border-green-300">
                            {word} ✓
                          </Badge>
                        ))}
                      </div>
                      <div className="text-sm w-full">
                        <span className="font-medium">{t("Próximas", "Next")}:</span> 
                        {culturalVocabulary.next.map((word, i) => (
                          <Badge key={i} variant="outline" className="ml-1">
                            {word}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CollapsibleFamilySection>

            {/* Section 3: AI Recommendations for Home */}
            <CollapsibleFamilySection
              id="ai-recommendations"
              title={t("Sugerencias del Mentor AI para Casa", "AI Mentor Recommendations for Home")}
              icon={Lightbulb}
              description={t("Actividades personalizadas para apoyar en casa", "Personalized activities to support at home")}
              defaultOpen={true}
              colorClass="orange"
              summaryContent={
                <div className="flex items-center gap-4 text-sm">
                  <div className="text-right">
                    <div className="font-bold text-lg">{aiRecommendations.length} {t("sugerencias", "suggestions")}</div>
                    <div className="text-orange-600">{t("Prioridad", "Priority")}: {t("Pronunciación", "Pronunciation")}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">15 min/día</div>
                    <div className="text-green-600">85% {t("éxito", "success rate")}</div>
                  </div>
                </div>
              }
            >
              <div className="space-y-4">
                {/* AI Insight Box */}
                <Card className="border-blue-200 bg-blue-50/50">
                  <CardContent className="pt-6">
                    <div className="flex gap-3">
                      <div className="text-3xl">🤖</div>
                      <div>
                        <p className="text-sm font-medium mb-1">
                          {t("Análisis del Mentor AI", "AI Mentor Analysis")}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {language === 'es' ? aiInsight.messageEs : aiInsight.messageEn}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recommendations */}
                {aiRecommendations.map((rec) => (
                  <Card key={rec.id} className="border-orange-200 hover:border-orange-300 transition-colors">
                    <CardContent className="pt-6">
                      <div className="flex gap-4">
                        <div className="text-4xl shrink-0">{rec.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-bold text-lg">
                              {language === 'es' ? rec.titleEs : rec.titleEn}
                            </h4>
                            <div className="flex gap-2">
                              {rec.priority === 'high' && (
                                <Badge className="bg-red-500 text-white">
                                  {t("Alta Prioridad", "High Priority")}
                                </Badge>
                              )}
                              {rec.priority === 'daily' && (
                                <Badge className="bg-blue-500 text-white">
                                  {t("Diario", "Daily")}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            {language === 'es' ? rec.descriptionEs : rec.descriptionEn}
                          </p>
                          
                          {rec.specificWords && (
                            <div className="mb-3">
                              <p className="text-sm font-medium mb-1">
                                {t("Palabras para practicar", "Words to practice")}:
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {rec.specificWords.map((word, i) => (
                                  <Badge key={i} variant="outline" className="bg-orange-50">
                                    {word}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {rec.tips && (
                            <div className="mb-3 p-3 bg-muted/50 rounded-lg">
                              <p className="text-sm">
                                💡 <span className="font-medium">{t("Consejo", "Tip")}:</span>{" "}
                                {language === 'es' ? rec.tips.es : rec.tips.en}
                              </p>
                            </div>
                          )}

                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>⏱️ {rec.estimatedTime} min</span>
                            <span>📊 {t("Dificultad", "Difficulty")}: {t(rec.difficulty, rec.difficulty)}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Weekly Challenge */}
                <Card className="border-purple-200 bg-purple-50/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      🏆 {language === 'es' ? weeklyChallenge.titleEs : weeklyChallenge.titleEn}
                    </CardTitle>
                    <CardDescription>
                      {language === 'es' ? weeklyChallenge.descriptionEs : weeklyChallenge.descriptionEn}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        {weeklyChallenge.words.map((word, i) => (
                          <Badge key={i} variant="secondary" className="text-base">
                            {word}
                          </Badge>
                        ))}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {t("Recompensa", "Reward")}: {language === 'es' ? weeklyChallenge.reward.es : weeklyChallenge.reward.en}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CollapsibleFamilySection>

            {/* Section 4: Recent Activities & Achievements */}
            <CollapsibleFamilySection
              id="activities-achievements"
              title={t("Actividades Recientes y Logros", "Recent Activities & Achievements")}
              icon={Award}
              defaultOpen={false}
              colorClass="purple"
              summaryContent={
                <div className="flex items-center gap-4 text-sm">
                  <div className="text-right">
                    <div className="font-bold text-lg">{achievements[0].icon} {language === 'es' ? achievements[0].titleEs : achievements[0].titleEn}</div>
                    <div className="text-muted-foreground">{t("Completado hoy", "Completed today")}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{achievements.length} {t("medallas", "badges")}</div>
                    <div className="text-purple-600">{t("Próximo hito en 3 actividades", "Next milestone in 3 activities")}</div>
                  </div>
                </div>
              }
            >
              <div className="space-y-6">
                {/* Achievements Gallery */}
                <div>
                  <h3 className="font-bold text-lg mb-4">{t("Medallas Ganadas", "Earned Badges")}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {achievements.map((achievement) => (
                      <Card 
                        key={achievement.id} 
                        className={achievement.cultural ? "border-lime-300 bg-lime-50/50" : "border-purple-200"}
                      >
                        <CardContent className="pt-6 text-center">
                          <div className="text-5xl mb-2">{achievement.icon}</div>
                          <p className="font-medium text-sm">
                            {language === 'es' ? achievement.titleEs : achievement.titleEn}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(achievement.date).toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', 
                              { month: 'short', day: 'numeric' }
                            )}
                          </p>
                          {achievement.cultural && (
                            <Badge variant="outline" className="mt-2 text-xs bg-lime-100 text-lime-700">
                              🇵🇷 {t("Cultural", "Cultural")}
                            </Badge>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Recent Activity Timeline */}
                <div>
                  <h3 className="font-bold text-lg mb-4">{t("Actividades Recientes", "Recent Activities")}</h3>
                  <div className="space-y-3">
                    {recentActivities.map((activity, i) => (
                      <Card key={i} className="border-cyan-200">
                        <CardContent className="pt-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant="outline" className="text-xs">
                                  {activity.category}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(activity.date).toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US')} · {activity.time}
                                </span>
                              </div>
                              <h4 className="font-semibold">
                                {language === 'es' ? activity.titleEs : activity.titleEn}
                              </h4>
                              <div className="flex items-center gap-4 mt-2 text-sm">
                                <span>⏱️ {activity.duration} min</span>
                                <span className="text-green-600">
                                  📖 {t("Comprensión", "Comprehension")}: {activity.comprehensionScore}%
                                </span>
                                {activity.pronunciationScore && (
                                  <span className="text-orange-600">
                                    🗣️ {t("Pronunciación", "Pronunciation")}: {activity.pronunciationScore}%
                                  </span>
                                )}
                              </div>
                            </div>
                            {activity.hasRecording && (
                              <Button size="sm" variant="outline">
                                <Video className="h-4 w-4 mr-2" />
                                {t("Escuchar", "Listen")}
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Level Progress */}
                <Card className="border-lime-200 bg-lime-50/30">
                  <CardHeader>
                    <CardTitle>{t("Progreso de Nivel", "Level Progress")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{t("Nivel actual", "Current level")}: {levelProgress.currentLevel}</span>
                        <span className="font-medium">{t("Próximo nivel", "Next level")}: {levelProgress.nextLevel}</span>
                      </div>
                      <div className="h-4 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-lime-400 to-lime-600 transition-all flex items-center justify-end pr-2" 
                          style={{ width: `${levelProgress.progressPercentage}%` }}
                        >
                          <span className="text-xs font-bold text-white">{levelProgress.progressPercentage}%</span>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {t("Habilidades necesarias", "Skills needed")}: {levelProgress.skillsNeeded.join(", ")}
                      </div>
                      <div className="text-sm font-medium text-lime-700">
                        ⏱️ {t("Tiempo estimado", "Estimated time")}: {levelProgress.estimatedTimeToNext}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CollapsibleFamilySection>

            {/* Section 5: Communication & Reports */}
            <CollapsibleFamilySection
              id="communication"
              title={t("Comunicación y Reportes", "Communication & Reports")}
              icon={MessageSquare}
              defaultOpen={false}
              colorClass="blue"
              summaryContent={
                <div className="flex items-center gap-4 text-sm">
                  <div className="text-right">
                    <div className="font-bold text-lg">
                      {teacherMessages.filter(m => !m.read).length} {t("nuevos", "new")}
                    </div>
                    <div className="text-muted-foreground">{t("Último mensaje hace 3 días", "Last message 3 days ago")}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{t("Próximo reporte", "Next report")}</div>
                    <div className="text-blue-600">{t("En 2 semanas", "In 2 weeks")}</div>
                  </div>
                </div>
              }
            >
              <div className="space-y-6">
                {/* Teacher Messages */}
                <div>
                  <h3 className="font-bold text-lg mb-4">{t("Mensajes de la Maestra", "Teacher Messages")}</h3>
                  <div className="space-y-3">
                    {teacherMessages.map((msg) => (
                      <Card key={msg.id} className={msg.read ? "border-muted" : "border-blue-400 bg-blue-50/30"}>
                        <CardContent className="pt-4">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="font-semibold">{msg.from}</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(msg.date).toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US')} · {msg.time}
                              </p>
                            </div>
                            {!msg.read && (
                              <Badge className="bg-blue-500 text-white">{t("Nuevo", "New")}</Badge>
                            )}
                          </div>
                          <h4 className="font-medium mb-2">
                            {language === 'es' ? msg.subjectEs : msg.subjectEn}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {language === 'es' ? msg.messageEs : msg.messageEn}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <Button className="w-full mt-4" variant="outline">
                    <Send className="h-4 w-4 mr-2" />
                    {t("Enviar Mensaje a la Maestra", "Send Message to Teacher")}
                  </Button>
                </div>

                {/* Progress Reports */}
                <div>
                  <h3 className="font-bold text-lg mb-4">{t("Reportes de Progreso", "Progress Reports")}</h3>
                  <div className="space-y-3">
                    {progressReports.map((report) => (
                      <Card key={report.id} className="border-purple-200">
                        <CardContent className="pt-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h4 className="font-semibold mb-1">
                                {language === 'es' ? report.titleEs : report.titleEn}
                              </h4>
                              <p className="text-sm text-muted-foreground mb-2">
                                {new Date(report.date).toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US')}
                              </p>
                              <div className="flex flex-wrap gap-2 text-xs">
                                <span className="font-medium">{t("Nivel", "Level")}: {report.highlights.readingLevel}</span>
                                <span className="text-green-600">{report.highlights.improvement} {t("mejora", "improvement")}</span>
                                <span>{report.highlights.activitiesCompleted} {t("actividades", "activities")}</span>
                              </div>
                            </div>
                            <Button size="sm" variant="outline">
                              <Download className="h-4 w-4 mr-2" />
                              PDF
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Send Encouragement */}
                <Card className="border-lime-200 bg-lime-50/30">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {t("Enviar Mensaje de Ánimo", "Send Encouragement Message")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {encouragementTemplates.map((template, i) => (
                        <Button key={i} variant="outline" size="sm" className="text-sm">
                          {language === 'es' ? template.es : template.en}
                        </Button>
                      ))}
                    </div>
                    <Button className="w-full">
                      <Send className="h-4 w-4 mr-2" />
                      {t("Escribir mensaje personalizado", "Write custom message")}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CollapsibleFamilySection>

            {/* Section 6: Resources & Support */}
            <CollapsibleFamilySection
              id="resources"
              title={t("Recursos y Apoyo para Padres", "Resources & Support for Parents")}
              icon={FileText}
              defaultOpen={false}
              colorClass="purple"
              summaryContent={
                <div className="flex items-center gap-4 text-sm">
                  <div className="text-right">
                    <div className="font-bold text-lg">
                      {parentGuides.filter(g => g.isNew).length} {t("nuevos recursos", "new resources")}
                    </div>
                    <div className="text-muted-foreground">{t("Más popular", "Most popular")}: {t("Guía de Pronunciación", "Pronunciation Guide")}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{videoTutorials.length} {t("videos", "videos")}</div>
                    <div className="text-purple-600">{faqs.length} {t("preguntas frecuentes", "FAQs")}</div>
                  </div>
                </div>
              }
            >
              <div className="space-y-6">
                {/* Parent Guides */}
                <div>
                  <h3 className="font-bold text-lg mb-4">{t("Guías para Padres", "Parent Guides")}</h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {parentGuides.map((guide) => (
                      <Card key={guide.id} className="border-purple-200 hover:border-purple-400 transition-colors">
                        <CardContent className="pt-4">
                          <div className="flex items-start gap-3">
                            <div className="text-3xl">{guide.icon}</div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-1">
                                <h4 className="font-semibold text-sm">
                                  {language === 'es' ? guide.titleEs : guide.titleEn}
                                </h4>
                                {guide.isNew && (
                                  <Badge variant="secondary" className="ml-2 text-xs">
                                    {t("Nuevo", "New")}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground mb-2">
                                {language === 'es' ? guide.descriptionEs : guide.descriptionEn}
                              </p>
                              <Button size="sm" variant="outline" className="text-xs h-7">
                                <Download className="h-3 w-3 mr-1" />
                                {t("Descargar", "Download")}
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Video Tutorials */}
                <div>
                  <h3 className="font-bold text-lg mb-4">{t("Tutoriales en Video", "Video Tutorials")}</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    {videoTutorials.map((video) => (
                      <Card key={video.id} className="border-blue-200">
                        <CardContent className="pt-4">
                          <div className="aspect-video bg-muted rounded-lg mb-3 flex items-center justify-center">
                            <Video className="h-12 w-12 text-muted-foreground" />
                          </div>
                          <h4 className="font-semibold text-sm mb-1">
                            {language === 'es' ? video.titleEs : video.titleEn}
                          </h4>
                          <p className="text-xs text-muted-foreground mb-2">
                            {language === 'es' ? video.descriptionEs : video.descriptionEn}
                          </p>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">⏱️ {video.duration}</span>
                            <Button size="sm" variant="link" className="h-auto p-0 text-xs">
                              {t("Ver ahora", "Watch now")} →
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* FAQs */}
                <div>
                  <h3 className="font-bold text-lg mb-4">{t("Preguntas Frecuentes", "Frequently Asked Questions")}</h3>
                  <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, i) => (
                      <AccordionItem key={i} value={`faq-${i}`}>
                        <AccordionTrigger className="text-left">
                          {language === 'es' ? faq.questionEs : faq.questionEn}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          {language === 'es' ? faq.answerEs : faq.answerEn}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>

                {/* Support Info */}
                <Card className="border-orange-200 bg-orange-50/30">
                  <CardHeader>
                    <CardTitle className="text-lg">{t("Soporte Técnico", "Technical Support")}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{t("Teléfono", "Phone")}:</span>
                      <span>{supportInfo.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">WhatsApp:</span>
                      <span>{supportInfo.whatsapp}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Email:</span>
                      <span>{supportInfo.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{t("Horario", "Hours")}:</span>
                      <span>{language === 'es' ? supportInfo.hours.es : supportInfo.hours.en}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{t("Tiempo de respuesta", "Response time")}:</span>
                      <span className="text-green-600">
                        {language === 'es' ? supportInfo.averageResponseTime.es : supportInfo.averageResponseTime.en}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CollapsibleFamilySection>

            {/* Section 7: Schedule & Goals */}
            <CollapsibleFamilySection
              id="schedule-goals"
              title={t("Horario y Metas", "Schedule & Goals")}
              icon={Calendar}
              defaultOpen={false}
              colorClass="lime"
              summaryContent={
                <div className="flex items-center gap-4 text-sm">
                  <div className="text-right">
                    <div className="font-bold text-lg">{goals.weeklyMinutes.current}/{goals.weeklyMinutes.target} min</div>
                    <div className="text-green-600">{goals.weeklyMinutes.percentage}% 🎉</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{t("Próxima lectura", "Next reading")}: {t("Hoy 7:00 PM", "Today 7:00 PM")}</div>
                    <div className="text-lime-600">{t("Recordatorios activos", "Reminders enabled")} ✓</div>
                  </div>
                </div>
              }
            >
              <div className="space-y-6">
                {/* Goals Progress */}
                <div>
                  <h3 className="font-bold text-lg mb-4">{t("Metas Semanales", "Weekly Goals")}</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <Card className="border-lime-200 bg-lime-50/30">
                      <CardContent className="pt-4">
                        <div className="text-sm text-muted-foreground mb-1">
                          {t("Minutos por semana", "Minutes per week")}
                        </div>
                        <div className="text-2xl font-bold mb-2">
                          {goals.weeklyMinutes.current}/{goals.weeklyMinutes.target}
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-lime-400 to-lime-600" 
                            style={{ width: `${Math.min(goals.weeklyMinutes.percentage, 100)}%` }}
                          />
                        </div>
                        <div className="text-xs text-green-600 font-medium mt-1">
                          {goals.weeklyMinutes.percentage}% {t("completado", "complete")} 🎉
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-cyan-200 bg-cyan-50/30">
                      <CardContent className="pt-4">
                        <div className="text-sm text-muted-foreground mb-1">
                          {t("Actividades por semana", "Activities per week")}
                        </div>
                        <div className="text-2xl font-bold mb-2">
                          {goals.activitiesPerWeek.current}/{goals.activitiesPerWeek.target}
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-cyan-400 to-cyan-600" 
                            style={{ width: `${Math.min(goals.activitiesPerWeek.percentage, 100)}%` }}
                          />
                        </div>
                        <div className="text-xs text-green-600 font-medium mt-1">
                          {goals.activitiesPerWeek.percentage}% {t("completado", "complete")} ⭐
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-orange-200 bg-orange-50/30">
                      <CardContent className="pt-4">
                        <div className="text-sm text-muted-foreground mb-1">
                          {t("Racha de días consecutivos", "Consecutive days streak")}
                        </div>
                        <div className="text-2xl font-bold mb-2">
                          {goals.consecutiveDays.current}/{goals.consecutiveDays.target}
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-orange-400 to-orange-600" 
                            style={{ width: `${Math.min(goals.consecutiveDays.percentage, 100)}%` }}
                          />
                        </div>
                        <div className="text-xs text-orange-600 font-medium mt-1">
                          {goals.consecutiveDays.percentage}% {t("completado", "complete")} 🔥
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Custom Goals */}
                {goals.customGoals.length > 0 && (
                  <div>
                    <h3 className="font-bold text-lg mb-4">{t("Metas Personalizadas", "Custom Goals")}</h3>
                    <div className="space-y-3">
                      {goals.customGoals.map((goal) => (
                        <Card key={goal.id} className={goal.completed ? "border-green-300 bg-green-50/30" : "border-muted"}>
                          <CardContent className="pt-4">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <h4 className="font-semibold text-sm mb-2">
                                  {language === 'es' ? goal.titleEs : goal.titleEn}
                                </h4>
                                <div className="h-2 bg-muted rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full ${goal.completed ? 'bg-green-500' : 'bg-primary'}`}
                                    style={{ width: `${(goal.progress / goal.target) * 100}%` }}
                                  />
                                </div>
                                <div className="text-xs text-muted-foreground mt-1">
                                  {goal.progress}/{goal.target}
                                </div>
                              </div>
                              {goal.completed && (
                                <div className="text-3xl ml-4">✅</div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Family Challenge */}
                <Card className="border-purple-200 bg-purple-50/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      🏆 {language === 'es' ? familyChallenge.titleEs : familyChallenge.titleEn}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{t("Progreso", "Progress")}:</span>
                      <span className="font-bold text-purple-600">
                        {familyChallenge.progress}/{familyChallenge.target} {t("días", "days")}
                      </span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-400 to-purple-600" 
                        style={{ width: `${(familyChallenge.progress / familyChallenge.target) * 100}%` }}
                      />
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">{t("Recompensa", "Reward")}:</span>{" "}
                      {language === 'es' ? familyChallenge.reward.es : familyChallenge.reward.en}
                    </div>
                  </CardContent>
                </Card>

                {/* Reminders Settings */}
                <Card className="border-blue-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="h-5 w-5" />
                      {t("Configuración de Recordatorios", "Reminder Settings")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{t("Recordatorio de lectura diaria", "Daily reading reminder")}</p>
                        <p className="text-xs text-muted-foreground">
                          {reminders.dailyReading.time} · {t("Lun-Vie", "Mon-Fri")}
                        </p>
                      </div>
                      <Badge className={reminders.dailyReading.enabled ? "bg-green-500" : "bg-muted"}>
                        {reminders.dailyReading.enabled ? "✓" : "✗"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm">{t("Notificaciones de logros", "Achievement notifications")}</p>
                      <Badge className={reminders.achievementNotifications.enabled ? "bg-green-500" : "bg-muted"}>
                        {reminders.achievementNotifications.enabled ? "✓" : "✗"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{t("Reporte semanal", "Weekly report")}</p>
                        <p className="text-xs text-muted-foreground">
                          {t("Domingos", "Sundays")} · {reminders.weeklyReport.time}
                        </p>
                      </div>
                      <Badge className={reminders.weeklyReport.enabled ? "bg-green-500" : "bg-muted"}>
                        {reminders.weeklyReport.enabled ? "✓" : "✗"}
                      </Badge>
                    </div>
                    <Button variant="outline" size="sm" className="w-full mt-3">
                      <Settings2 className="h-4 w-4 mr-2" />
                      {t("Ajustar Configuración", "Adjust Settings")}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CollapsibleFamilySection>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default FamilyDashboard;
