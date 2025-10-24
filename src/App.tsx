import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
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
import AvailableAssessments from "./pages/AvailableAssessments";
import AssessmentGenerator from "./pages/AssessmentGenerator";
import GeneratedAssessment from "./pages/GeneratedAssessment";
import CreateAssessment from "./pages/CreateAssessment";
import ViewAssessment from "./pages/ViewAssessment";
import CreateDemoUsers from "./pages/CreateDemoUsers";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import StudentLessonsProgress from "./pages/StudentLessonsProgress";
import StudentExercisesProgress from "./pages/StudentExercisesProgress";
import StudentAssessmentsProgress from "./pages/StudentAssessmentsProgress";
import ViewLesson from "./pages/ViewLesson";
import LessonExerciseFlow from "./pages/LessonExerciseFlow";

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
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/student-dashboard" element={<ProtectedRoute allowedRoles={["student", "student_kindergarten", "student_1", "student_2", "student_3", "student_4", "student_5"]}><StudentDashboard /></ProtectedRoute>} />
              <Route path="/student-dashboard/lessons" element={<ProtectedRoute allowedRoles={["student", "student_kindergarten", "student_1", "student_2", "student_3", "student_4", "student_5"]}><StudentLessonsProgress /></ProtectedRoute>} />
              <Route path="/student-dashboard/exercises" element={<ProtectedRoute allowedRoles={["student", "student_kindergarten", "student_1", "student_2", "student_3", "student_4", "student_5"]}><StudentExercisesProgress /></ProtectedRoute>} />
              <Route path="/student-dashboard/assessments" element={<ProtectedRoute allowedRoles={["student", "student_kindergarten", "student_1", "student_2", "student_3", "student_4", "student_5"]}><StudentAssessmentsProgress /></ProtectedRoute>} />
              <Route path="/lesson/:id" element={<ProtectedRoute allowedRoles={["student", "student_kindergarten", "student_1", "student_2", "student_3", "student_4", "student_5"]}><ViewLesson /></ProtectedRoute>} />
              <Route path="/lesson/:lessonId/exercises" element={<ProtectedRoute allowedRoles={["student", "student_kindergarten", "student_1", "student_2", "student_3", "student_4", "student_5"]}><LessonExerciseFlow /></ProtectedRoute>} />
              <Route path="/activities" element={<ProtectedRoute allowedRoles={["student", "student_kindergarten", "student_1", "student_2", "student_3", "student_4", "student_5"]}><Activities /></ProtectedRoute>} />
              <Route path="/available-assessments" element={<ProtectedRoute><AvailableAssessments /></ProtectedRoute>} />
              <Route path="/teacher-dashboard" element={<ProtectedRoute allowedRoles={["teacher", "teacher_english", "teacher_spanish"]}><TeacherDashboard /></ProtectedRoute>} />
              <Route path="/family-dashboard" element={<ProtectedRoute allowedRoles={["family"]}><FamilyDashboard /></ProtectedRoute>} />
              <Route path="/reading-exercise" element={<ProtectedRoute allowedRoles={["student", "student_kindergarten", "student_1", "student_2", "student_3", "student_4", "student_5"]}><ReadingExercise /></ProtectedRoute>} />
              <Route path="/voice-test" element={<ProtectedRoute><VoiceTest /></ProtectedRoute>} />
              
              <Route path="/pdf-demo" element={<ProtectedRoute><PDFDemo /></ProtectedRoute>} />
              <Route path="/assessment-generator" element={<ProtectedRoute><AssessmentGenerator /></ProtectedRoute>} />
              <Route path="/generated/:id" element={<ProtectedRoute><GeneratedAssessment /></ProtectedRoute>} />
              <Route path="/create-assessment" element={<ProtectedRoute><CreateAssessment /></ProtectedRoute>} />
              <Route path="/assessment/:id" element={<ProtectedRoute><ViewAssessment /></ProtectedRoute>} />
              <Route path="/view-assessment/:id" element={<ProtectedRoute><ViewAssessment /></ProtectedRoute>} />
              <Route path="/create-demo-users" element={<CreateDemoUsers />} />
              <Route path="/admin-dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
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
