import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BookOpen, Mail, Lock, User, Chrome } from "lucide-react";
import { Helmet } from "react-helmet";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { demoUsers } from "@/utils/createDemoUsers";
import CoquiMascot from "@/components/CoquiMascot";

const unitColors = {
  pink: 'hsl(329, 100%, 71%)',
  coral: 'hsl(11, 100%, 67%)',
  peach: 'hsl(27, 100%, 71%)',
  yellow: 'hsl(48, 100%, 71%)',
  lime: 'hsl(125, 100%, 71%)',
  cyan: 'hsl(176, 84%, 71%)',
  purple: 'hsl(250, 100%, 85%)',
};

const emailSchema = z.string().email();
const passwordSchema = z.string().min(6, "Password must be at least 6 characters");

const AuthV2 = () => {
  const { t } = useLanguage();
  const { signUp, signIn, resetPassword, user, loading } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<"signin" | "signup" | "reset">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<"student" | "teacher_english" | "family">("student");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user && !loading) {
      redirectBasedOnRole();
    }
  }, [user, loading]);

  const redirectBasedOnRole = async () => {
    if (!user) return;

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

    const userRole = data?.role;
    if (userRole === "student" || userRole?.startsWith("student_")) {
      navigate("/student-dashboard");
    } else if (userRole === "teacher_english" || userRole === "teacher_spanish") {
      navigate("/teacher-dashboard");
    } else if (userRole === "family") {
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 via-purple-50 to-pink-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{t("Iniciar Sesión - LecturaPR", "Sign In - LecturaPR")}</title>
        <meta name="description" content={t("Inicia sesión en LecturaPR", "Sign in to LecturaPR")} />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 via-purple-50 to-pink-50 p-4 relative overflow-hidden">
        {/* Decorative Coquí in corner */}
        <div className="fixed bottom-8 right-8 hidden lg:block">
          <CoquiMascot state="happy" size="medium" />
        </div>

        {/* Auth Card */}
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border-4 border-cyan-300 overflow-hidden relative z-10">
          {/* Header */}
          <div className="bg-gradient-to-br from-cyan-400 to-purple-400 p-8 text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="h-16 w-16 rounded-2xl bg-white shadow-lg flex items-center justify-center">
                <BookOpen className="h-8 w-8 text-cyan-500" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">LecturaPR</h1>
            <p className="text-cyan-50 text-sm">
              {t(
                "Plataforma de lectura bilingüe con AI",
                "Bilingual reading platform with AI"
              )}
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="bg-gray-50 px-6 py-4 border-b-4 border-gray-200">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab("signin")}
                className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all ${
                  activeTab === "signin"
                    ? "bg-cyan-400 text-white shadow-lg scale-105"
                    : "bg-white text-gray-600 hover:bg-gray-100"
                }`}
              >
                {t("Entrar", "Sign In")}
              </button>
              <button
                onClick={() => setActiveTab("signup")}
                className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all ${
                  activeTab === "signup"
                    ? "bg-purple-400 text-white shadow-lg scale-105"
                    : "bg-white text-gray-600 hover:bg-gray-100"
                }`}
              >
                {t("Registro", "Sign Up")}
              </button>
              <button
                onClick={() => setActiveTab("reset")}
                className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all ${
                  activeTab === "reset"
                    ? "bg-pink-400 text-white shadow-lg scale-105"
                    : "bg-white text-gray-600 hover:bg-gray-100"
                }`}
              >
                {t("Recuperar", "Reset")}
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {error && (
              <Alert variant="destructive" className="border-4 rounded-xl">
                <AlertDescription className="font-medium">{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="bg-green-50 text-green-800 border-4 border-green-300 rounded-xl">
                <AlertDescription className="font-medium">{success}</AlertDescription>
              </Alert>
            )}

            {/* Sign In Tab */}
            {activeTab === "signin" && (
              <div className="space-y-4">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email" className="text-gray-700 font-bold">
                      {t("Correo electrónico", "Email")}
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                      <Input
                        id="signin-email"
                        type="email"
                        placeholder="tu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-12 h-14 border-4 border-gray-300 rounded-xl focus:border-cyan-400 text-base"
                        autoComplete="email"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signin-password" className="text-gray-700 font-bold">
                      {t("Contraseña", "Password")}
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                      <Input
                        id="signin-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-12 h-14 border-4 border-gray-300 rounded-xl focus:border-cyan-400 text-base"
                        autoComplete="current-password"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-14 bg-gradient-to-r from-cyan-400 to-cyan-500 text-white font-bold rounded-xl shadow-[0_4px_0_hsl(176,84%,60%)] hover:shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed border-4 border-cyan-600"
                  >
                    {isLoading ? t("Entrando...", "Signing in...") : t("Entrar 🚀", "Sign In 🚀")}
                  </button>
                </form>

                {/* Divider */}
                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t-2 border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-white px-4 text-xs font-bold text-gray-500 uppercase">
                      {t("O continúa con", "Or continue with")}
                    </span>
                  </div>
                </div>

                {/* Google Sign In */}
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="w-full h-14 bg-white border-4 border-gray-300 rounded-xl font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-400 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                  <Chrome className="h-5 w-5" />
                  Google
                </button>

                {/* Demo Users */}
                <div className="mt-6 space-y-3">
                  <p className="text-sm font-bold text-center text-gray-700">
                    {t("Acceso Rápido - Cuentas Demo:", "Quick Access - Demo Accounts:")}
                  </p>
                  <div className="grid gap-2">
                    {demoUsers.map((demo) => (
                      <button
                        key={demo.email}
                        type="button"
                        onClick={() => handleDemoLogin(demo)}
                        disabled={isLoading}
                        className="w-full bg-gradient-to-br from-gray-50 to-white border-4 border-gray-200 rounded-3xl p-3 hover:border-cyan-300 hover:shadow-[0_6px_0_hsl(176,84%,85%)] hover:scale-105 active:scale-95 transition-all disabled:opacity-50 flex items-center gap-3"
                      >
                        <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                          <img 
                            src={demo.avatar} 
                            alt={demo.fullName}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex flex-col items-start flex-1 min-w-0">
                          <span className="font-bold text-sm text-gray-800">
                            {demo.fullName}
                          </span>
                          <span className="text-xs text-gray-500 truncate w-full">
                            {demo.email}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Sign Up Tab */}
            {activeTab === "signup" && (
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name" className="text-gray-700 font-bold">
                    {t("Nombre completo", "Full name")}
                  </Label>
                  <div className="relative">
                    <User className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder={t("Tu nombre", "Your name")}
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="pl-12 h-14 border-4 border-gray-300 rounded-xl focus:border-purple-400 text-base"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-gray-700 font-bold">
                    {t("Correo electrónico", "Email")}
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="tu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-12 h-14 border-4 border-gray-300 rounded-xl focus:border-purple-400 text-base"
                      autoComplete="email"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-gray-700 font-bold">
                    {t("Contraseña", "Password")}
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                    <Input
                      id="signup-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-12 h-14 border-4 border-gray-300 rounded-xl focus:border-purple-400 text-base"
                      autoComplete="new-password"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700 font-bold">{t("Tipo de cuenta", "Account type")}</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setRole("student")}
                      className={`py-3 px-2 rounded-xl font-bold text-sm transition-all ${
                        role === "student"
                          ? "bg-gradient-to-br from-pink-400 to-pink-500 text-white shadow-lg scale-105"
                          : "bg-white border-4 border-gray-300 text-gray-700 hover:border-pink-300"
                      }`}
                    >
                      {t("Estudiante", "Student")}
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole("teacher_english")}
                      className={`py-3 px-2 rounded-xl font-bold text-sm transition-all ${
                        role === "teacher_english"
                          ? "bg-gradient-to-br from-cyan-400 to-cyan-500 text-white shadow-lg scale-105"
                          : "bg-white border-4 border-gray-300 text-gray-700 hover:border-cyan-300"
                      }`}
                    >
                      {t("Maestro", "Teacher")}
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole("family")}
                      className={`py-3 px-2 rounded-xl font-bold text-sm transition-all ${
                        role === "family"
                          ? "bg-gradient-to-br from-lime-400 to-lime-500 text-white shadow-lg scale-105"
                          : "bg-white border-4 border-gray-300 text-gray-700 hover:border-lime-300"
                      }`}
                    >
                      {t("Familia", "Family")}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-14 bg-gradient-to-r from-purple-400 to-purple-500 text-white font-bold rounded-xl shadow-[0_4px_0_hsl(250,100%,75%)] hover:shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed border-4 border-purple-600"
                >
                  {isLoading ? t("Creando cuenta...", "Creating account...") : t("Crear cuenta ✨", "Create account ✨")}
                </button>
              </form>
            )}

            {/* Reset Password Tab */}
            {activeTab === "reset" && (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reset-email" className="text-gray-700 font-bold">
                    {t("Correo electrónico", "Email")}
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                    <Input
                      id="reset-email"
                      type="email"
                      placeholder="tu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-12 h-14 border-4 border-gray-300 rounded-xl focus:border-pink-400 text-base"
                      autoComplete="email"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-14 bg-gradient-to-r from-pink-400 to-pink-500 text-white font-bold rounded-xl shadow-[0_4px_0_hsl(329,100%,60%)] hover:shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed border-4 border-pink-600"
                >
                  {isLoading ? t("Enviando...", "Sending...") : t("Enviar enlace 📧", "Send link 📧")}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthV2;
