import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BookOpen, Mail, Lock, User, Chrome } from "lucide-react";
import { Helmet } from "react-helmet";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { demoUsers, createDemoUsers } from "@/utils/createDemoUsers";

const emailSchema = z.string().email();
const passwordSchema = z.string().min(6, "Password must be at least 6 characters");

const Auth = () => {
  const { t } = useLanguage();
  const { signUp, signIn, resetPassword, user, loading } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<"student" | "teacher_english" | "family">("student");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [demoUsersCreated, setDemoUsersCreated] = useState(false);

  // Create demo users on component mount
  useEffect(() => {
    const initDemoUsers = async () => {
      const created = localStorage.getItem("demoUsersCreated");
      if (!created) {
        await createDemoUsers();
        localStorage.setItem("demoUsersCreated", "true");
        setDemoUsersCreated(true);
      }
    };
    initDemoUsers();
  }, []);

  useEffect(() => {
    if (user && !loading) {
      // Redirect based on role
      redirectBasedOnRole();
    }
  }, [user, loading]);

  const redirectBasedOnRole = async () => {
    if (!user) return;

    // Check if admin user
    if (user.email === "admin@demo.com") {
      navigate("/admin-dashboard");
      return;
    }

    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      console.error("Error fetching user role:", error);
      navigate("/dashboard");
      return;
    }

    // Handle navigation based on role
    const role = data?.role;
    if (role === "student" || role?.startsWith("student_")) {
      navigate("/student-dashboard");
    } else if (role === "teacher_english" || role === "teacher_spanish") {
      navigate("/teacher-dashboard");
    } else if (role === "family") {
      navigate("/family-dashboard");
    } else {
      navigate("/dashboard");
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      emailSchema.parse(email);
      passwordSchema.parse(password);

      if (!fullName.trim()) {
        throw new Error("Full name is required");
      }

      const { error } = await signUp(email, password, fullName, role);

      if (error) {
        setError(error.message);
      } else {
        setSuccess(t("¡Cuenta creada! Redirigiendo...", "Account created! Redirecting..."));
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      emailSchema.parse(email);
      passwordSchema.parse(password);

      const { error } = await signIn(email, password);

      if (error) {
        setError(error.message);
      } else {
        setSuccess(t("¡Iniciando sesión...", "Signing in..."));
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      emailSchema.parse(email);

      const { error } = await resetPassword(email);

      if (error) {
        setError(error.message);
      } else {
        setSuccess(t(
          "Correo de recuperación enviado. Revisa tu bandeja de entrada.",
          "Recovery email sent. Check your inbox."
        ));
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (error) {
      setError(error.message);
    }
  };

  const handleDemoLogin = async (demoUser: typeof demoUsers[0]) => {
    setEmail(demoUser.email);
    setPassword(demoUser.password);
    setIsLoading(true);

    const { error } = await signIn(demoUser.email, demoUser.password);
    if (error) {
      setError(error.message);
    }
    setIsLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{t("Iniciar Sesión - LecturaPR", "Sign In - LecturaPR")}</title>
        <meta name="description" content={t("Inicia sesión en LecturaPR", "Sign in to LecturaPR")} />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-primary/5 to-secondary/5 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="h-12 w-12 rounded-full bg-gradient-hero flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl">LecturaPR</CardTitle>
            <CardDescription>
              {t(
                "Plataforma de lectura y aprendizaje bilingüe con AI",
                "Bilingual reading and learning platform with AI"
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="signin">{t("Entrar", "Sign In")}</TabsTrigger>
                <TabsTrigger value="signup">{t("Registro", "Sign Up")}</TabsTrigger>
                <TabsTrigger value="reset">{t("Recuperar", "Reset")}</TabsTrigger>
              </TabsList>

              {error && (
                <Alert variant="destructive" className="mt-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="mt-4 bg-success/10 text-success border-success/20">
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              <TabsContent value="signin" className="space-y-4">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">
                      {t("Correo electrónico", "Email")}
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signin-email"
                        type="email"
                        placeholder="tu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        autoComplete="email"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signin-password">
                      {t("Contraseña", "Password")}
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signin-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10"
                        autoComplete="current-password"
                        required
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? t("Entrando...", "Signing in...") : t("Entrar", "Sign In")}
                  </Button>
                </form>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">
                      {t("O continúa con", "Or continue with")}
                    </span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full gap-2"
                  onClick={handleGoogleSignIn}
                >
                  <Chrome className="h-4 w-4" />
                  Google
                </Button>

                <div className="mt-6 space-y-3">
                  <p className="text-sm font-medium text-center">
                    {t("Acceso rápido - Cuentas populares:", "Quick access - Popular accounts:")}
                  </p>
                  <div className="grid gap-2">
                    {demoUsers.slice(0, 5).map((demo) => (
                      <Button
                        key={demo.email}
                        type="button"
                        variant="secondary"
                        className="w-full justify-start gap-3 h-auto py-3"
                        onClick={() => handleDemoLogin(demo)}
                        disabled={isLoading}
                      >
                        <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden bg-muted">
                          <img 
                            src={demo.avatar} 
                            alt={demo.fullName}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex flex-col items-start flex-1 min-w-0">
                          <span className="font-semibold text-sm">
                            {demo.fullName}
                          </span>
                          <span className="text-xs text-muted-foreground truncate w-full">
                            {demo.email}
                          </span>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">
                      {t("Nombre completo", "Full name")}
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-name"
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
                    <Label htmlFor="signup-email">
                      {t("Correo electrónico", "Email")}
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="tu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        autoComplete="email"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password">
                      {t("Contraseña", "Password")}
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10"
                        autoComplete="new-password"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>{t("Tipo de cuenta", "Account type")}</Label>
                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        type="button"
                        variant={role === "student" ? "default" : "outline"}
                        onClick={() => setRole("student")}
                      >
                        {t("Estudiante", "Student")}
                      </Button>
                      <Button
                        type="button"
                        variant={role === "teacher_english" ? "default" : "outline"}
                        onClick={() => setRole("teacher_english")}
                      >
                        {t("Maestro", "Teacher")}
                      </Button>
                      <Button
                        type="button"
                        variant={role === "family" ? "default" : "outline"}
                        onClick={() => setRole("family")}
                      >
                        {t("Familia", "Family")}
                      </Button>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? t("Creando cuenta...", "Creating account...") : t("Crear cuenta", "Create account")}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="reset" className="space-y-4">
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reset-email">
                      {t("Correo electrónico", "Email")}
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="reset-email"
                        type="email"
                        placeholder="tu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        autoComplete="email"
                        required
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? t("Enviando...", "Sending...") : t("Enviar enlace", "Send link")}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
            
            {/* Demo Credentials */}
            <div className="mt-6 pt-4 border-t border-border/40">
              <p className="text-xs text-muted-foreground text-center mb-2 font-semibold">
                {t("Credenciales de demostración:", "Demo credentials:")}
              </p>
              
              <div className="space-y-3">
                {/* Students by Grade */}
                <div>
                  <p className="text-[10px] font-medium text-muted-foreground/80 mb-1">
                    {t("Estudiantes por Grado:", "Students by Grade:")}
                  </p>
                  <div className="grid grid-cols-1 gap-0.5 text-xs text-muted-foreground">
                    <div className="flex items-center justify-between py-0.5">
                      <span className="text-[10px]">{t("Kínder", "Kindergarten")}:</span>
                      <span className="font-mono text-[9px]">kindergarten@demo.com</span>
                    </div>
                    <div className="flex items-center justify-between py-0.5">
                      <span className="text-[10px]">{t("1er Grado", "1st Grade")}:</span>
                      <span className="font-mono text-[9px]">student1@demo.com</span>
                    </div>
                    <div className="flex items-center justify-between py-0.5">
                      <span className="text-[10px]">{t("2do Grado", "2nd Grade")}:</span>
                      <span className="font-mono text-[9px]">student2@demo.com</span>
                    </div>
                    <div className="flex items-center justify-between py-0.5">
                      <span className="text-[10px]">{t("3er Grado", "3rd Grade")}:</span>
                      <span className="font-mono text-[9px]">student3@demo.com</span>
                    </div>
                    <div className="flex items-center justify-between py-0.5">
                      <span className="text-[10px]">{t("4to Grado", "4th Grade")}:</span>
                      <span className="font-mono text-[9px]">student4@demo.com</span>
                    </div>
                    <div className="flex items-center justify-between py-0.5">
                      <span className="text-[10px]">{t("5to Grado", "5th Grade")}:</span>
                      <span className="font-mono text-[9px]">student5@demo.com</span>
                    </div>
                  </div>
                </div>

                {/* Teachers */}
                <div>
                  <p className="text-[10px] font-medium text-muted-foreground/80 mb-1">
                    {t("Maestros:", "Teachers:")}
                  </p>
                  <div className="grid grid-cols-1 gap-0.5 text-xs text-muted-foreground">
                    <div className="flex items-center justify-between py-0.5">
                      <span className="text-[10px]">{t("Inglés", "English")}:</span>
                      <span className="font-mono text-[9px]">teacher-english@demo.com</span>
                    </div>
                    <div className="flex items-center justify-between py-0.5">
                      <span className="text-[10px]">{t("Español", "Spanish")}:</span>
                      <span className="font-mono text-[9px]">teacher-spanish@demo.com</span>
                    </div>
                  </div>
                </div>

                {/* Administrative */}
                <div>
                  <p className="text-[10px] font-medium text-muted-foreground/80 mb-1">
                    {t("Administrativos:", "Administrative:")}
                  </p>
                  <div className="grid grid-cols-1 gap-0.5 text-xs text-muted-foreground">
                    <div className="flex items-center justify-between py-0.5">
                      <span className="text-[10px]">{t("Director Escolar", "School Director")}:</span>
                      <span className="font-mono text-[9px]">school-director@demo.com</span>
                    </div>
                    <div className="flex items-center justify-between py-0.5">
                      <span className="text-[10px]">{t("Director Regional", "Regional Director")}:</span>
                      <span className="font-mono text-[9px]">regional-director@demo.com</span>
                    </div>
                    <div className="flex items-center justify-between py-0.5">
                      <span className="text-[10px]">{t("Admin Español", "Spanish Admin")}:</span>
                      <span className="font-mono text-[9px]">spanish-admin@demo.com</span>
                    </div>
                    <div className="flex items-center justify-between py-0.5">
                      <span className="text-[10px]">{t("Admin Inglés", "English Admin")}:</span>
                      <span className="font-mono text-[9px]">english-admin@demo.com</span>
                    </div>
                    <div className="flex items-center justify-between py-0.5">
                      <span className="text-[10px]">{t("Ejecutivo DEPR", "DEPR Executive")}:</span>
                      <span className="font-mono text-[9px]">depr-executive@demo.com</span>
                    </div>
                  </div>
                </div>

                {/* Family */}
                <div>
                  <p className="text-[10px] font-medium text-muted-foreground/80 mb-1">
                    {t("Familia:", "Family:")}
                  </p>
                  <div className="grid grid-cols-1 gap-0.5 text-xs text-muted-foreground">
                    <div className="flex items-center justify-between py-0.5">
                      <span className="text-[10px]">{t("Cuenta Familiar", "Family Account")}:</span>
                      <span className="font-mono text-[9px]">family@demo.com</span>
                    </div>
                  </div>
                </div>

                <div className="text-center text-[10px] text-muted-foreground/70 mt-2 pt-2 border-t border-border/20">
                  {t("Contraseña para todos:", "Password for all:")} <span className="font-mono font-semibold">demo123</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Auth;
