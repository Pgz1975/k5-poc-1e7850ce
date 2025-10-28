import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { BookOpen, TrendingUp, Clock, Star, Lightbulb, Target, Award, MessageSquare } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Helmet } from "react-helmet";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import CoquiMascot from "@/components/CoquiMascot";
import { useState } from "react";
import { toast } from "sonner";

const FamilyDashboardV2 = () => {
  const { t } = useLanguage();
  const [messageSubject, setMessageSubject] = useState("");
  const [messageContent, setMessageContent] = useState("");

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(t("Mensaje enviado a la maestra", "Message sent to teacher"));
    setMessageSubject("");
    setMessageContent("");
  };

  const weeklyProgress = [
    { day: t("Lun", "Mon"), minutes: 25 },
    { day: t("Mar", "Tue"), minutes: 30 },
    { day: t("Mié", "Wed"), minutes: 28 },
    { day: t("Jue", "Thu"), minutes: 35 },
    { day: t("Vie", "Fri"), minutes: 32 },
    { day: t("Sáb", "Sat"), minutes: 0 },
    { day: t("Dom", "Sun"), minutes: 0 },
  ];

  const recommendations = [
    {
      titleEs: "Practicar Pronunciación",
      titleEn: "Practice Pronunciation",
      descriptionEs: "María necesita práctica adicional con palabras que contienen la letra 'r'.",
      descriptionEn: "María needs additional practice with words containing the letter 'r'.",
      icon: Lightbulb,
      emoji: "💡",
    },
    {
      titleEs: "Lectura en Voz Alta",
      titleEn: "Read Aloud",
      descriptionEs: "Lean juntos 15 minutos diarios para mejorar la fluidez.",
      descriptionEn: "Read together for 15 minutes daily to improve fluency.",
      icon: BookOpen,
      emoji: "📚",
    },
    {
      titleEs: "Vocabulario del Día",
      titleEn: "Word of the Day",
      descriptionEs: "Introduce una palabra nueva cada día durante las comidas.",
      descriptionEn: "Introduce a new word each day during meals.",
      icon: Target,
      emoji: "🎯",
    },
  ];

  // Unit color palette for vibrant visualizations
  const unitColors = {
    pink: "hsl(329, 100%, 71%)",
    coral: "hsl(11, 100%, 67%)",
    peach: "hsl(27, 100%, 71%)",
    lime: "hsl(125, 100%, 71%)",
    cyan: "hsl(176, 84%, 71%)",
    purple: "hsl(250, 100%, 75%)",
  };

  return (
    <>
      <Helmet>
        <title>{t("Portal Familiar - LecturaPR", "Family Portal - LecturaPR")}</title>
        <meta name="description" content={t("Portal para familias", "Family portal")} />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <Header />
        
        <main className="flex-1 py-8">
          <div className="container px-4 md:px-6 space-y-8 max-w-7xl mx-auto">
            {/* Friendly Header with Coquí */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2 text-gray-800">
                  {t("¡Hola, Familia! 👋", "Hello, Family! 👋")}
                </h1>
                <p className="text-xl text-gray-600">
                  {t("Progreso de María González · 3er Grado", "María González's Progress · 3rd Grade")}
                </p>
              </div>
              <div className="hidden md:block">
                <CoquiMascot state="happy" size="medium" />
              </div>
            </div>

            {/* Colorful Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Reading Level */}
              <div className="bg-gradient-to-br from-pink-100 to-pink-50 rounded-3xl p-6 border-4 border-pink-300 shadow-lg hover:shadow-xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-14 w-14 rounded-2xl bg-pink-400 flex items-center justify-center">
                    <BookOpen className="h-7 w-7 text-white" />
                  </div>
                  <Badge className="bg-green-500 text-white border-0">
                    {t("Excelente", "Excellent")}
                  </Badge>
                </div>
                <h3 className="text-sm font-semibold text-gray-600 mb-2">
                  {t("Nivel de Lectura", "Reading Level")}
                </h3>
                <div className="text-4xl font-bold text-gray-800">3.2</div>
                <p className="text-sm text-green-600 mt-2 font-medium">
                  {t("Por encima del promedio", "Above average")}
                </p>
              </div>

              {/* Time This Week */}
              <div className="bg-gradient-to-br from-cyan-100 to-cyan-50 rounded-3xl p-6 border-4 border-cyan-300 shadow-lg hover:shadow-xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-14 w-14 rounded-2xl bg-cyan-400 flex items-center justify-center">
                    <Clock className="h-7 w-7 text-white" />
                  </div>
                  <Badge className="bg-blue-500 text-white border-0">
                    {t("Meta alcanzada", "Goal met")}
                  </Badge>
                </div>
                <h3 className="text-sm font-semibold text-gray-600 mb-2">
                  {t("Tiempo Esta Semana", "Time This Week")}
                </h3>
                <div className="text-4xl font-bold text-gray-800">150 <span className="text-xl">{t("min", "min")}</span></div>
                <p className="text-sm text-gray-600 mt-2">
                  {t("Meta: 120 min", "Goal: 120 min")} ✅
                </p>
              </div>

              {/* Activities Completed */}
              <div className="bg-gradient-to-br from-purple-100 to-purple-50 rounded-3xl p-6 border-4 border-purple-300 shadow-lg hover:shadow-xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-14 w-14 rounded-2xl bg-purple-400 flex items-center justify-center">
                    <Star className="h-7 w-7 text-white fill-white" />
                  </div>
                  <Badge className="bg-yellow-500 text-white border-0">
                    +5 {t("hoy", "today")}
                  </Badge>
                </div>
                <h3 className="text-sm font-semibold text-gray-600 mb-2">
                  {t("Actividades Completadas", "Activities Completed")}
                </h3>
                <div className="text-4xl font-bold text-gray-800">24</div>
                <p className="text-sm text-gray-600 mt-2">
                  {t("Este mes", "This month")}
                </p>
              </div>

              {/* Overall Progress */}
              <div className="bg-gradient-to-br from-lime-100 to-lime-50 rounded-3xl p-6 border-4 border-lime-300 shadow-lg hover:shadow-xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-14 w-14 rounded-2xl bg-lime-400 flex items-center justify-center">
                    <TrendingUp className="h-7 w-7 text-white" />
                  </div>
                  <Badge className="bg-green-600 text-white border-0">
                    +12%
                  </Badge>
                </div>
                <h3 className="text-sm font-semibold text-gray-600 mb-2">
                  {t("Progreso General", "Overall Progress")}
                </h3>
                <div className="text-4xl font-bold text-gray-800">88%</div>
                <p className="text-sm text-green-600 mt-2 font-medium">
                  {t("este trimestre", "this quarter")}
                </p>
              </div>
            </div>

            {/* Weekly Activity Chart */}
            <div className="bg-white rounded-3xl p-8 border-4 border-blue-300 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 rounded-2xl bg-blue-400 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {t("Actividad Semanal", "Weekly Activity")}
                  </h2>
                  <p className="text-gray-600">
                    {t("Minutos de lectura diarios", "Daily reading minutes")}
                  </p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={weeklyProgress}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="day" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '3px solid #93c5fd',
                      borderRadius: '16px',
                      padding: '12px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="minutes" 
                    stroke={unitColors.cyan}
                    strokeWidth={4}
                    dot={{ fill: unitColors.purple, r: 6, strokeWidth: 3, stroke: 'white' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Skills & Achievements Grid */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Reading Skills */}
              <div className="bg-white rounded-3xl p-8 border-4 border-pink-300 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-12 w-12 rounded-2xl bg-pink-400 flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      {t("Habilidades de Lectura", "Reading Skills")}
                    </h2>
                    <p className="text-gray-600">
                      {t("Evaluación por categoría", "Assessment by category")}
                    </p>
                  </div>
                </div>
                <div className="space-y-5">
                  {/* Comprehension */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-base font-bold text-gray-700">
                        {t("Comprensión", "Comprehension")}
                      </span>
                      <span className="text-xl font-bold text-pink-600">88%</span>
                    </div>
                    <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all" 
                        style={{ width: '88%', backgroundColor: unitColors.pink }}
                      />
                    </div>
                  </div>

                  {/* Fluency */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-base font-bold text-gray-700">
                        {t("Fluidez", "Fluency")}
                      </span>
                      <span className="text-xl font-bold text-cyan-600">85%</span>
                    </div>
                    <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all" 
                        style={{ width: '85%', backgroundColor: unitColors.cyan }}
                      />
                    </div>
                  </div>

                  {/* Vocabulary */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-base font-bold text-gray-700">
                        {t("Vocabulario", "Vocabulary")}
                      </span>
                      <span className="text-xl font-bold text-lime-600">90%</span>
                    </div>
                    <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all" 
                        style={{ width: '90%', backgroundColor: unitColors.lime }}
                      />
                    </div>
                  </div>

                  {/* Pronunciation */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-base font-bold text-gray-700">
                        {t("Pronunciación", "Pronunciation")}
                      </span>
                      <span className="text-xl font-bold text-coral-600">82%</span>
                    </div>
                    <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all" 
                        style={{ width: '82%', backgroundColor: unitColors.coral }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Achievements */}
              <div className="bg-white rounded-3xl p-8 border-4 border-purple-300 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-12 w-12 rounded-2xl bg-purple-400 flex items-center justify-center">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      {t("Logros Recientes", "Recent Achievements")}
                    </h2>
                    <p className="text-gray-600">
                      {t("Reconocimientos obtenidos", "Achievements earned")}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  {/* Achievement 1 */}
                  <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl border-3 border-yellow-300">
                    <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-400 flex items-center justify-center shrink-0 shadow-lg">
                      <Star className="h-8 w-8 text-white fill-white" />
                    </div>
                    <div>
                      <p className="font-bold text-lg text-gray-800">
                        {t("Racha de 7 Días 🔥", "7-Day Streak 🔥")}
                      </p>
                      <p className="text-sm text-gray-600">
                        {t("Completado hoy", "Completed today")}
                      </p>
                    </div>
                  </div>

                  {/* Achievement 2 */}
                  <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border-3 border-blue-300">
                    <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center shrink-0 shadow-lg">
                      <BookOpen className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-lg text-gray-800">
                        {t("10 Lecturas Completas 📚", "10 Readings Complete 📚")}
                      </p>
                      <p className="text-sm text-gray-600">
                        {t("Hace 1 día", "1 day ago")}
                      </p>
                    </div>
                  </div>

                  {/* Achievement 3 */}
                  <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-lime-50 rounded-2xl border-3 border-green-300">
                    <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-green-400 to-lime-400 flex items-center justify-center shrink-0 shadow-lg">
                      <TrendingUp className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-lg text-gray-800">
                        {t("Nivel 3 Alcanzado 🎯", "Level 3 Reached 🎯")}
                      </p>
                      <p className="text-sm text-gray-600">
                        {t("Hace 3 días", "3 days ago")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommendations Section */}
            <div className="bg-white rounded-3xl p-8 border-4 border-lime-300 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 rounded-2xl bg-lime-400 flex items-center justify-center">
                  <Lightbulb className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {t("Sugerencias para Apoyar en Casa 🏡", "Suggestions to Support at Home 🏡")}
                  </h2>
                  <p className="text-gray-600">
                    {t("Actividades recomendadas por el mentor AI", "Activities recommended by AI mentor")}
                  </p>
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {recommendations.map((rec, index) => (
                  <div 
                    key={index} 
                    className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border-3 border-gray-200 hover:border-lime-400 hover:shadow-lg transition-all"
                  >
                    <div className="text-5xl mb-4">{rec.emoji}</div>
                    <h4 className="font-bold text-xl mb-3 text-gray-800">
                      {t(rec.titleEs, rec.titleEn)}
                    </h4>
                    <p className="text-gray-600 leading-relaxed">
                      {t(rec.descriptionEs, rec.descriptionEn)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Message Teacher Section */}
            <div className="bg-gradient-to-br from-orange-100 to-coral-50 rounded-3xl p-8 border-4 border-orange-300 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 rounded-2xl bg-orange-400 flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {t("Enviar Mensaje a la Maestra 💌", "Message Teacher 💌")}
                  </h2>
                  <p className="text-gray-600">
                    {t("Comunícate con la maestra de María", "Communicate with María's teacher")}
                  </p>
                </div>
              </div>
              
              <form onSubmit={handleSendMessage} className="space-y-4">
                <div>
                  <label htmlFor="subject" className="block text-sm font-bold text-gray-700 mb-2">
                    {t("Asunto", "Subject")}
                  </label>
                  <input
                    id="subject"
                    type="text"
                    value={messageSubject}
                    onChange={(e) => setMessageSubject(e.target.value)}
                    placeholder={t("Ejemplo: Pregunta sobre tarea", "Example: Question about homework")}
                    className="w-full px-4 py-3 rounded-xl border-3 border-orange-200 focus:border-orange-400 focus:outline-none text-gray-800 font-medium"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-bold text-gray-700 mb-2">
                    {t("Mensaje", "Message")}
                  </label>
                  <textarea
                    id="message"
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    placeholder={t("Escribe tu mensaje aquí...", "Write your message here...")}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border-3 border-orange-200 focus:border-orange-400 focus:outline-none text-gray-800 font-medium resize-none"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-400 to-coral-400 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all border-3 border-orange-500"
                >
                  {t("Enviar Mensaje 📧", "Send Message 📧")}
                </button>
              </form>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default FamilyDashboardV2;
