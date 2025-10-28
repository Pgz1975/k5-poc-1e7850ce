import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Mail, 
  Save, 
  Loader2, 
  BookOpen, 
  Trophy, 
  TrendingUp, 
  Calendar,
  Star,
  Brain,
  Clock,
  Award
} from "lucide-react";
import { Helmet } from "react-helmet";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useStudentProfile } from "@/hooks/useStudentProfile";

const profileSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters").max(100),
  avatar_url: z.string().refine(
    (val) => !val || val.startsWith('/') || val.startsWith('http://') || val.startsWith('https://'),
    { message: "Must be a valid URL or path" }
  ).optional().or(z.literal("")),
});

// V2 Color schemes - Multiple colors for variety like Family Dashboard
const colorSchemes = {
  pink: {
    bg: "bg-[hsl(329,100%,71%)]",
    border: "border-[hsl(329,100%,65%)]",
    text: "text-[hsl(329,100%,40%)]",
    shadow: "shadow-[0_6px_0_hsl(329,100%,60%)]",
    badgeBg: "bg-[hsl(329,100%,85%)]",
    cardBg: "bg-white",
  },
  cyan: {
    bg: "bg-[hsl(176,84%,71%)]",
    border: "border-[hsl(176,84%,65%)]",
    text: "text-[hsl(176,84%,35%)]",
    shadow: "shadow-[0_6px_0_hsl(176,84%,60%)]",
    badgeBg: "bg-[hsl(176,84%,85%)]",
    cardBg: "bg-white",
  },
  purple: {
    bg: "bg-[hsl(250,100%,75%)]",
    border: "border-[hsl(250,100%,70%)]",
    text: "text-[hsl(250,100%,40%)]",
    shadow: "shadow-[0_6px_0_hsl(250,100%,65%)]",
    badgeBg: "bg-[hsl(250,100%,85%)]",
    cardBg: "bg-white",
  },
  lime: {
    bg: "bg-[hsl(84,100%,71%)]",
    border: "border-[hsl(84,100%,65%)]",
    text: "text-[hsl(84,100%,35%)]",
    shadow: "shadow-[0_6px_0_hsl(84,100%,60%)]",
    badgeBg: "bg-[hsl(84,100%,85%)]",
    cardBg: "bg-white",
  },
  orange: {
    bg: "bg-[hsl(11,100%,67%)]",
    border: "border-[hsl(11,100%,65%)]",
    text: "text-[hsl(11,100%,40%)]",
    shadow: "shadow-[0_6px_0_hsl(11,100%,60%)]",
    badgeBg: "bg-[hsl(11,100%,85%)]",
    cardBg: "bg-white",
  },
  amber: {
    bg: "bg-[hsl(27,100%,71%)]",
    border: "border-[hsl(27,100%,65%)]",
    text: "text-[hsl(27,100%,40%)]",
    shadow: "shadow-[0_6px_0_hsl(27,100%,60%)]",
    badgeBg: "bg-[hsl(27,100%,85%)]",
    cardBg: "bg-white",
  },
};

const ProfileV2 = () => {
  const { t } = useLanguage();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { data: studentProfile } = useStudentProfile();

  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [role, setRole] = useState<string>("");
  const [createdAt, setCreatedAt] = useState<string>("");
  const [learningLanguages, setLearningLanguages] = useState<string[]>(["es", "en"]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Use different colors for different sections - lighter colors
  const headerColor = colorSchemes.pink;
  const detailsColor = {
    bg: "bg-sky-100",
    border: "border-sky-400",
    text: "text-sky-700",
    shadow: "shadow-[0_8px_0_0_rgb(56,189,248)]",
  };
  const activityColor = colorSchemes.cyan;

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();

        if (profileError) throw profileError;
        if (!profile) throw new Error("Profile not found");

        const { data: userRole, error: roleError } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .maybeSingle();

        if (roleError) throw roleError;
        if (!userRole) throw new Error("Role not found");

        setFullName(profile.full_name || "");
        setAvatarUrl(profile.avatar_url || "");
        setLearningLanguages(profile.learning_languages || ["es", "en"]);
        setRole(userRole.role);
        setCreatedAt(profile.created_at);
      } catch (err: any) {
        console.error("Error fetching profile:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      profileSchema.parse({ full_name: fullName, avatar_url: avatarUrl });

      if (!user) throw new Error("No user found");

      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          full_name: fullName,
          avatar_url: avatarUrl || null,
          learning_languages: learningLanguages,
        })
        .eq("id", user.id);

      if (updateError) throw updateError;

      setSuccess(t("Perfil actualizado exitosamente", "Profile updated successfully"));
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
      } else {
        setError(err.message || "An error occurred");
      }
    } finally {
      setSaving(false);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "student":
        return `${headerColor.badgeBg} ${headerColor.text} border-4 ${headerColor.border}`;
      case "teacher":
        return "bg-[hsl(11,100%,85%)] text-[hsl(11,100%,40%)] border-4 border-[hsl(11,100%,65%)]";
      case "family":
        return "bg-[hsl(125,100%,85%)] text-[hsl(125,100%,35%)] border-4 border-[hsl(125,100%,65%)]";
      default:
        return "bg-muted";
    }
  };

  // Stat card colors - different color for each stat
  const statColors = [colorSchemes.pink, colorSchemes.cyan, colorSchemes.purple, colorSchemes.lime];

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "student":
        return t("Estudiante", "Student");
      case "teacher":
        return t("Maestro", "Teacher");
      case "family":
        return t("Familia", "Family");
      default:
        return role;
    }
  };

  const getRoleStats = () => {
    switch (role) {
      case "student":
        return {
          stat1: { label: t("Actividades completadas", "Activities completed"), value: "24", icon: BookOpen },
          stat2: { label: t("Racha actual", "Current streak"), value: "7 días", icon: TrendingUp },
          stat3: { label: t("Nivel de lectura", "Reading level"), value: "3.2", icon: Star },
          stat4: { label: t("Sesiones con AI", "AI sessions"), value: "12", icon: Brain },
        };
      case "teacher":
        return {
          stat1: { label: t("Estudiantes", "Students"), value: "28", icon: User },
          stat2: { label: t("Clases activas", "Active classes"), value: "3", icon: BookOpen },
          stat3: { label: t("Promedio de clase", "Class average"), value: "85%", icon: TrendingUp },
          stat4: { label: t("Evaluaciones creadas", "Assessments created"), value: "15", icon: Award },
        };
      case "family":
        return {
          stat1: { label: t("Estudiantes vinculados", "Linked students"), value: "2", icon: User },
          stat2: { label: t("Progreso semanal", "Weekly progress"), value: "+12%", icon: TrendingUp },
          stat3: { label: t("Tiempo de lectura", "Reading time"), value: "5.2h", icon: Clock },
          stat4: { label: t("Logros obtenidos", "Achievements earned"), value: "8", icon: Trophy },
        };
      default:
        return null;
    }
  };

  const getRecentActivity = () => {
    switch (role) {
      case "student":
        return [
          { icon: Trophy, text: t("Completó 'La Fotosíntesis'", "Completed 'Photosynthesis'"), time: t("Hace 2 horas", "2 hours ago") },
          { icon: Star, text: t("Obtuvo insignia '7 Días'", "Earned '7 Days' badge"), time: t("Ayer", "Yesterday") },
          { icon: Brain, text: t("Sesión de AI Mentor", "AI Mentor session"), time: t("Hace 1 día", "1 day ago") },
        ];
      case "teacher":
        return [
          { icon: BookOpen, text: t("Creó evaluación de comprensión", "Created comprehension assessment"), time: t("Hace 1 hora", "1 hour ago") },
          { icon: User, text: t("Agregó 3 nuevos estudiantes", "Added 3 new students"), time: t("Hace 2 días", "2 days ago") },
          { icon: Award, text: t("Revisó 15 actividades", "Reviewed 15 activities"), time: t("Hace 3 días", "3 days ago") },
        ];
      case "family":
        return [
          { icon: TrendingUp, text: t("Revisó progreso semanal", "Reviewed weekly progress"), time: t("Hace 1 hora", "1 hour ago") },
          { icon: Trophy, text: t("Hijo completó 5 actividades", "Child completed 5 activities"), time: t("Ayer", "Yesterday") },
          { icon: BookOpen, text: t("Activó recordatorios diarios", "Enabled daily reminders"), time: t("Hace 2 días", "2 days ago") },
        ];
      default:
        return [];
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(t("es-PR", "en-US"), { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const stats = getRoleStats();
  const recentActivity = getRecentActivity();

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{t("Mi Perfil - LecturaPR", "My Profile - LecturaPR")}</title>
        <meta name="description" content={t("Gestiona tu perfil", "Manage your profile")} />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/20">
        <Header />

        <main className="flex-1 py-8">
          <div className="container max-w-6xl px-4 md:px-6 space-y-6">
            {/* Profile Header Card - V2 Style */}
            <Card className={`border-4 ${headerColor.border} ${headerColor.shadow} bg-white rounded-3xl overflow-hidden transition-all hover:translate-y-[-2px] active:translate-y-[2px] active:shadow-[0_2px_0_hsl(var(--primary)/0.6)]`}>
              <CardHeader className="bg-white">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                  <Avatar className="h-24 w-24 border-4 border-white shadow-lg rounded-full">
                    <AvatarImage src={avatarUrl || undefined} alt={fullName} />
                    <AvatarFallback className={`${headerColor.bg} text-white text-3xl font-black`}>
                      {fullName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3 flex-wrap">
                      <CardTitle className="text-2xl md:text-3xl font-black">{fullName}</CardTitle>
                      <Badge className="bg-white border-4 border-gray-300 text-gray-700 font-bold px-4 py-1 rounded-full shadow-sm">
                        {getRoleLabel(role)}
                      </Badge>
                    </div>
                    <CardDescription className="flex items-center gap-2 text-gray-700">
                      <Mail className="h-4 w-4" />
                      {user?.email}
                    </CardDescription>
                    <CardDescription className="flex items-center gap-2 text-gray-700">
                      <Calendar className="h-4 w-4" />
                      {t("Miembro desde", "Member since")} {createdAt && formatDate(createdAt)}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Stats Cards - V2 Style */}
            {stats && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.values(stats).map((stat, index) => {
                  const IconComponent = stat.icon;
                  const cardColor = statColors[index % statColors.length];
                  return (
                     <Card 
                      key={index}
                      className={`border-4 ${cardColor.border} ${cardColor.shadow} bg-white rounded-2xl transition-all hover:translate-y-[-2px] active:translate-y-[2px] active:shadow-[0_2px_0_hsl(var(--primary)/0.6)]`}
                    >
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-bold">
                          {stat.label}
                        </CardTitle>
                        <div className={`${cardColor.bg} p-2 rounded-xl border-2 ${cardColor.border}`}>
                          <IconComponent className={`h-4 w-4 ${cardColor.text}`} />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className={`text-3xl font-black ${cardColor.text}`}>{stat.value}</div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            {/* Tabs for Profile Details and Activity - V2 Style */}
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-white border-4 border-gray-300 rounded-2xl p-1 shadow-lg h-auto">
                <TabsTrigger 
                  value="details" 
                  className="font-black text-base py-3 rounded-xl data-[state=active]:bg-gradient-to-br data-[state=active]:from-orange-400 data-[state=active]:to-orange-500 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=inactive]:text-gray-600 transition-all"
                >
                  {t("Detalles del Perfil", "Profile Details")}
                </TabsTrigger>
                <TabsTrigger 
                  value="activity"
                  className="font-black text-base py-3 rounded-xl data-[state=active]:bg-gradient-to-br data-[state=active]:from-cyan-400 data-[state=active]:to-cyan-500 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=inactive]:text-gray-600 transition-all"
                >
                  {t("Actividad Reciente", "Recent Activity")}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4 mt-6">
                <Card className={`border-4 ${detailsColor.border} ${detailsColor.shadow} bg-white rounded-3xl overflow-hidden`}>
                  <CardHeader className="bg-white">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 bg-white rounded-2xl border-2 ${detailsColor.border}`}>
                        <User className={`h-6 w-6 ${detailsColor.text}`} />
                      </div>
                      <div>
                        <CardTitle className="text-xl font-black">{t("Editar Perfil", "Edit Profile")}</CardTitle>
                        <CardDescription className="text-gray-700">
                          {t("Actualiza tu información personal", "Update your personal information")}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-6">
                    {error && (
                      <Alert variant="destructive" className="mb-4 border-4 border-red-400 rounded-2xl">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    {success && (
                      <Alert className="mb-4 bg-green-100 text-green-800 border-4 border-green-400 rounded-2xl">
                        <AlertDescription className="font-bold">{success}</AlertDescription>
                      </Alert>
                    )}

                    <form onSubmit={handleSave} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="full-name" className="text-base font-bold">
                          {t("Nombre completo", "Full name")}
                        </Label>
                        <div className="relative">
                          <User className={`absolute left-4 top-4 h-5 w-5 ${detailsColor.text}`} />
                          <Input
                            id="full-name"
                            type="text"
                            placeholder={t("Tu nombre", "Your name")}
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className={`pl-12 h-14 border-4 ${detailsColor.border} rounded-2xl font-bold text-lg focus-visible:ring-offset-0 focus-visible:ring-2 focus-visible:ring-offset-2`}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="avatar-url" className="text-base font-bold">
                          {t("URL del avatar", "Avatar URL")}
                        </Label>
                        <Input
                          id="avatar-url"
                          type="text"
                          inputMode="url"
                          placeholder="https://example.com/avatar.jpg or /avatars/student-2.jpg"
                          value={avatarUrl}
                          onChange={(e) => setAvatarUrl(e.target.value)}
                          className={`h-14 border-4 ${detailsColor.border} rounded-2xl font-bold text-lg focus-visible:ring-offset-0 focus-visible:ring-2 focus-visible:ring-offset-2`}
                        />
                        <p className="text-sm text-muted-foreground font-medium">
                          {t(
                            "URL opcional de tu imagen de perfil",
                            "Optional URL for your profile picture"
                          )}
                        </p>
                      </div>

                      {/* Learning Languages Selector */}
                      {role?.startsWith("student") && (
                        <div className="space-y-3">
                          <Label className="text-base font-bold">
                            {t("Idiomas que Estoy Aprendiendo", "Languages I'm Learning")}
                          </Label>
                          <div className="flex gap-4">
                            <label className={`flex items-center gap-3 px-6 py-3 border-4 ${detailsColor.border} rounded-2xl cursor-pointer transition-all ${learningLanguages.includes("es") ? 'bg-gray-100' : 'bg-white'}`}>
                              <input
                                type="checkbox"
                                checked={learningLanguages.includes("es")}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setLearningLanguages([...learningLanguages, "es"]);
                                  } else if (learningLanguages.length > 1) {
                                    setLearningLanguages(learningLanguages.filter(l => l !== "es"));
                                  }
                                }}
                                className="w-5 h-5 rounded border-2"
                              />
                              <span className="font-bold">{t("Español", "Spanish")}</span>
                            </label>
                            <label className={`flex items-center gap-3 px-6 py-3 border-4 ${detailsColor.border} rounded-2xl cursor-pointer transition-all ${learningLanguages.includes("en") ? 'bg-gray-100' : 'bg-white'}`}>
                              <input
                                type="checkbox"
                                checked={learningLanguages.includes("en")}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setLearningLanguages([...learningLanguages, "en"]);
                                  } else if (learningLanguages.length > 1) {
                                    setLearningLanguages(learningLanguages.filter(l => l !== "en"));
                                  }
                                }}
                                className="w-5 h-5 rounded border-2"
                              />
                              <span className="font-bold">{t("Inglés", "English")}</span>
                            </label>
                          </div>
                          <p className="text-sm text-muted-foreground font-medium">
                            {t(
                              "Selecciona al menos un idioma",
                              "Select at least one language"
                            )}
                          </p>
                        </div>
                      )}

                      <Button 
                        type="submit" 
                        className="w-full gap-2 h-14 bg-white hover:bg-gray-50 text-sky-700 border-4 border-sky-400 shadow-[0_8px_0_0_rgb(56,189,248)] rounded-2xl font-black text-lg transition-all hover:translate-y-[-2px] active:translate-y-[4px] active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={saving}
                      >
                        {saving ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            {t("Guardando...", "Saving...")}
                          </>
                        ) : (
                          <>
                            <Save className="h-5 w-5" />
                            {t("Guardar cambios", "Save changes")}
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activity" className="space-y-4 mt-6">
                <Card className={`border-4 ${activityColor.border} ${activityColor.shadow} bg-white rounded-3xl overflow-hidden`}>
                  <CardHeader className="bg-white">
                    <CardTitle className="font-black text-xl">{t("Actividad Reciente", "Recent Activity")}</CardTitle>
                    <CardDescription className="text-gray-700 font-medium">
                      {t("Tus últimas acciones en la plataforma", "Your latest actions on the platform")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      {recentActivity.map((activity, index) => {
                        const IconComponent = activity.icon;
                        return (
                          <div key={index} className={`flex items-start gap-4 pb-4 border-b-2 ${activityColor.border} last:border-0`}>
                            <div className={`h-12 w-12 rounded-2xl ${activityColor.bg} border-4 ${activityColor.border} flex items-center justify-center shrink-0`}>
                              <IconComponent className={`h-6 w-6 ${activityColor.text}`} />
                            </div>
                            <div className="flex-1 space-y-1">
                              <p className="text-sm font-bold">{activity.text}</p>
                              <p className="text-xs text-muted-foreground font-medium">{activity.time}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Progress Section for Students */}
                {role === "student" && (
                  <Card className={`border-4 ${colorSchemes.lime.border} ${colorSchemes.lime.shadow} rounded-3xl overflow-hidden`}>
                    <CardHeader className={`${colorSchemes.lime.bg} border-b-4 ${colorSchemes.lime.border}`}>
                      <CardTitle className="font-black text-xl">{t("Progreso del Mes", "Monthly Progress")}</CardTitle>
                      <CardDescription className="text-gray-700 font-medium">
                        {t("Tu avance en los últimos 30 días", "Your progress in the last 30 days")}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-bold">{t("Actividades completadas", "Activities completed")}</span>
                          <span className={`font-black ${colorSchemes.lime.text}`}>24/30</span>
                        </div>
                        <div className={`h-4 bg-gray-200 rounded-full border-2 ${colorSchemes.lime.border} overflow-hidden`}>
                          <div className={`h-full ${colorSchemes.lime.bg} transition-all`} style={{ width: '80%' }} />
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-bold">{t("Tiempo de práctica", "Practice time")}</span>
                          <span className={`font-black ${colorSchemes.lime.text}`}>8.5h / 10h</span>
                        </div>
                        <div className={`h-4 bg-gray-200 rounded-full border-2 ${colorSchemes.lime.border} overflow-hidden`}>
                          <div className={`h-full ${colorSchemes.lime.bg} transition-all`} style={{ width: '85%' }} />
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-bold">{t("Sesiones con AI Mentor", "AI Mentor sessions")}</span>
                          <span className={`font-black ${colorSchemes.lime.text}`}>12/15</span>
                        </div>
                        <div className={`h-4 bg-gray-200 rounded-full border-2 ${colorSchemes.lime.border} overflow-hidden`}>
                          <div className={`h-full ${colorSchemes.lime.bg} transition-all`} style={{ width: '80%' }} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default ProfileV2;
