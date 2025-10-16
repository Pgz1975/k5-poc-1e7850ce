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
import { defaultAvatars, generateAvatarUrl } from "@/utils/avatars";

const profileSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters").max(100),
  avatar_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

const Profile = () => {
  const { t } = useLanguage();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [role, setRole] = useState<string>("");
  const [createdAt, setCreatedAt] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        // Fetch profile
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profileError) throw profileError;

        // Fetch role
        const { data: userRole, error: roleError } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .single();

        if (roleError) throw roleError;

        setFullName(profile.full_name || "");
        setAvatarUrl(profile.avatar_url || "");
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
      // Validate input
      profileSchema.parse({ full_name: fullName, avatar_url: avatarUrl });

      if (!user) throw new Error("No user found");

      // Update profile
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          full_name: fullName,
          avatar_url: avatarUrl || null,
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
        return "bg-primary/10 text-primary border-primary/20";
      case "teacher":
        return "bg-secondary/10 text-secondary border-secondary/20";
      case "family":
        return "bg-success/10 text-success border-success/20";
      default:
        return "bg-muted";
    }
  };

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

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 py-8">
          <div className="container max-w-6xl px-4 md:px-6 space-y-6">
            {/* Profile Header Card */}
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={avatarUrl} alt={fullName} />
                    <AvatarFallback className="bg-gradient-hero text-white text-3xl">
                      {fullName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-2xl">{fullName}</CardTitle>
                      <Badge className={getRoleBadgeColor(role)}>{getRoleLabel(role)}</Badge>
                    </div>
                    <CardDescription className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {user?.email}
                    </CardDescription>
                    <CardDescription className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {t("Miembro desde", "Member since")} {createdAt && formatDate(createdAt)}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Stats Cards */}
            {stats && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.values(stats).map((stat, index) => {
                  const IconComponent = stat.icon;
                  return (
                    <Card key={index}>
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">
                          {stat.label}
                        </CardTitle>
                        <IconComponent className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{stat.value}</div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            {/* Tabs for Profile Details and Activity */}
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">{t("Detalles del Perfil", "Profile Details")}</TabsTrigger>
                <TabsTrigger value="activity">{t("Actividad Reciente", "Recent Activity")}</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4">
                <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <User className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle>{t("Editar Perfil", "Edit Profile")}</CardTitle>
                    <CardDescription>
                      {t("Actualiza tu información personal", "Update your personal information")}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert className="mb-4 bg-success/10 text-success border-success/20">
                    <AlertDescription>{success}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSave} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="full-name">
                      {t("Nombre completo", "Full name")}
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="full-name"
                        type="text"
                        placeholder={t("Tu nombre", "Your name")}
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="avatar-url">
                      {t("URL del avatar", "Avatar URL")}
                    </Label>
                    <Input
                      id="avatar-url"
                      type="url"
                      placeholder="https://example.com/avatar.jpg"
                      value={avatarUrl}
                      onChange={(e) => setAvatarUrl(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      {t(
                        "URL opcional de tu imagen de perfil",
                        "Optional URL for your profile picture"
                      )}
                    </p>
                  </div>

                  {/* Avatar Gallery */}
                  <div className="space-y-3">
                    <Label>
                      {t("O elige un avatar prediseñado", "Or choose a pre-designed avatar")}
                    </Label>
                    <div className="grid grid-cols-5 gap-3">
                      {defaultAvatars.map((avatar, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => setAvatarUrl(avatar)}
                          className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${
                            avatarUrl === avatar 
                              ? 'border-primary ring-2 ring-primary/20' 
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <img 
                            src={avatar} 
                            alt={`Avatar ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (user?.id) {
                            setAvatarUrl(generateAvatarUrl(user.id));
                          }
                        }}
                      >
                        {t("Generar avatar único", "Generate unique avatar")}
                      </Button>
                      <p className="text-xs text-muted-foreground">
                        {t("Basado en tu ID de usuario", "Based on your user ID")}
                      </p>
                    </div>
                  </div>

                  <Button type="submit" className="w-full gap-2" disabled={saving}>
                    {saving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {t("Guardando...", "Saving...")}
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        {t("Guardar cambios", "Save changes")}
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t("Actividad Reciente", "Recent Activity")}</CardTitle>
                <CardDescription>
                  {t("Tus últimas acciones en la plataforma", "Your latest actions on the platform")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => {
                    const IconComponent = activity.icon;
                    return (
                      <div key={index} className="flex items-start gap-4 pb-4 border-b last:border-0">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <IconComponent className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium">{activity.text}</p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Progress Section for Students */}
            {role === "student" && (
              <Card>
                <CardHeader>
                  <CardTitle>{t("Progreso del Mes", "Monthly Progress")}</CardTitle>
                  <CardDescription>
                    {t("Tu avance en los últimos 30 días", "Your progress in the last 30 days")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>{t("Actividades completadas", "Activities completed")}</span>
                      <span className="font-medium">24/30</span>
                    </div>
                    <Progress value={80} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>{t("Tiempo de práctica", "Practice time")}</span>
                      <span className="font-medium">8.5h / 10h</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>{t("Sesiones con AI Mentor", "AI Mentor sessions")}</span>
                      <span className="font-medium">12/15</span>
                    </div>
                    <Progress value={80} className="h-2" />
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

export default Profile;
