import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider } from "./contexts/AuthContext";
import { ScrollToTop } from "./components/ScrollToTop";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import StudentDashboard from "./pages/StudentDashboard";
import Activities from "./pages/Activities";
import TeacherDashboard from "./pages/TeacherDashboard";
import FamilyDashboard from "./pages/FamilyDashboard";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import ReadingExercise from "./pages/ReadingExercise";
import VoiceTest from "./pages/VoiceTest";
import PDFDemo from "./pages/PDFDemo";
import AssessmentGenerator from "./pages/AssessmentGenerator";
import GeneratedAssessment from "./pages/GeneratedAssessment";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <LanguageProvider>
          <AuthProvider>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/activities" element={<Activities />} />
              <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
              <Route path="/family-dashboard" element={<FamilyDashboard />} />
              <Route path="/reading-exercise" element={<ReadingExercise />} />
              <Route path="/voice-test" element={<VoiceTest />} />
              <Route path="/pdf-demo" element={<PDFDemo />} />
              <Route path="/assessment-generator" element={<AssessmentGenerator />} />
              <Route path="/generated/:id" element={<GeneratedAssessment />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </LanguageProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
