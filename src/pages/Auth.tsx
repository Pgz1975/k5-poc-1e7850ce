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
    } else if (role === "school_director") {
      navigate("/school-director-dashboard");
    } else if (role === "regional_director") {
      navigate("/regional-director-dashboard");
    } else if (role === "depr_executive") {
      navigate("/depr-executive-dashboard");
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
        <title>{t("Iniciar Sesión - FluenxIA", "Sign In - FluenxIA")}</title>
        <meta name="description" content={t("Inicia sesión en FluenxIA para acceder a tu plataforma de fluidez bilingüe impulsada por AI", "Sign in to FluenxIA to access your AI-powered bilingual fluency platform")} />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-primary/5 to-secondary/5 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="h-12 w-12 rounded-full bg-gradient-hero flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl">FluenxIA</CardTitle>
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
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Auth;
