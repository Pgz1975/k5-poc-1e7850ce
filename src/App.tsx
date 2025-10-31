import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Index from "./pages/Index";
import IndexV2 from "./pages/Index-v2";
import Auth from "./pages/Auth";
import AuthV2 from "./pages/Auth-v2";
import AuthV3 from "./pages/AuthV3";
import Profile from "./pages/Profile";
import ProfileV2 from "./pages/Profile-v2";
import StudentDashboard from "./pages/StudentDashboard";
import StudentDashboardV2 from "./pages/StudentDashboard-v2";
import TeacherDashboard from "./pages/TeacherDashboard";
import TeacherDashboardV2 from "./pages/TeacherDashboard-v2";
import FamilyDashboard from "./pages/FamilyDashboard";
import FamilyDashboardV2 from "./pages/FamilyDashboard-v2";
import SchoolDirectorDashboard from "./pages/SchoolDirectorDashboard";
import RegionalDirectorDashboard from "./pages/RegionalDirectorDashboard";
import DEPRExecutiveDashboard from "./pages/DEPRExecutiveDashboard";
import Activities from "./pages/Activities";
import ActivitiesV2 from "./pages/Activities-v2";
import ReadingExercise from "./pages/ReadingExercise";
import VoiceTest from "./pages/VoiceTest";
import ViewLesson from "./pages/ViewLesson";
import ViewAssessment from "./pages/ViewAssessment";
import PDFDemo from "./pages/PDFDemo";
import AvailableAssessments from "./pages/AvailableAssessments";
import AssessmentGenerator from "./pages/AssessmentGenerator";
import GeneratedAssessment from "./pages/GeneratedAssessment";
import CreateAssessment from "./pages/CreateAssessment";
import CreateDemoUsers from "./pages/CreateDemoUsers";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import StudentLessonsProgress from "./pages/StudentLessonsProgress";
import StudentLessonsProgressV2 from "./pages/StudentLessonsProgress-v2";
import DeleteTestLesson from "./pages/DeleteTestLesson";
import StudentExercisesProgress from "./pages/StudentExercisesProgress";
import StudentExercisesProgressV2 from "./pages/StudentExercisesProgress-v2";
import StudentAssessmentsProgress from "./pages/StudentAssessmentsProgress";
import StudentAssessmentsProgressV2 from "./pages/StudentAssessmentsProgress-v2";
import LessonExerciseFlow from "./pages/LessonExerciseFlow";
import GenerateContent from "./pages/GenerateContent";
import GenerateContentAdmin from "./pages/GenerateContentAdmin";
import TestG1Reset from "./pages/admin/TestG1Reset";
import DesignPreview from "./pages/DesignPreview";
import DemoHome from "./pages/demo/DemoHome";
import DemoActivityPage from "./pages/demo/DemoActivityPage";
import RealtimeStudentGuideDemo from "./pages/demo/RealtimeStudentGuideDemo";
import VoiceMonitoringDashboard from "./pages/VoiceMonitoringDashboard";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { ScrollToTop } from "./components/ScrollToTop";
import { useDesignVersion } from "@/hooks/useDesignVersion";

const queryClient = new QueryClient();

function AppRoutes() {
  const { useV2Design } = useDesignVersion();
  
  return (
    <Routes>
      <Route path="/" element={useV2Design ? <IndexV2 /> : <Index />} />
      <Route path="/design-preview" element={<DesignPreview />} />
      <Route path="/auth" element={useV2Design ? <AuthV2 /> : <Auth />} />
      <Route path="/authv2" element={<AuthV3 />} />
      <Route path="/profile" element={<ProtectedRoute>{useV2Design ? <ProfileV2 /> : <Profile />}</ProtectedRoute>} />
      <Route path="/dashboard" element={<Navigate to="/student-dashboard" replace />} />
      <Route path="/student-dashboard" element={<ProtectedRoute allowedRoles={["student", "student_kindergarten", "student_1", "student_2", "student_3", "student_4", "student_5"]}>{useV2Design ? <StudentDashboardV2 /> : <StudentDashboard />}</ProtectedRoute>} />
      <Route path="/student-dashboard/lessons" element={<ProtectedRoute allowedRoles={["student", "student_kindergarten", "student_1", "student_2", "student_3", "student_4", "student_5"]}>{useV2Design ? <StudentLessonsProgressV2 /> : <StudentLessonsProgress />}</ProtectedRoute>} />
      <Route path="/student-dashboard/exercises" element={<ProtectedRoute allowedRoles={["student", "student_kindergarten", "student_1", "student_2", "student_3", "student_4", "student_5"]}>{useV2Design ? <StudentExercisesProgressV2 /> : <StudentExercisesProgress />}</ProtectedRoute>} />
      <Route path="/student-dashboard/assessments" element={<ProtectedRoute allowedRoles={["student", "student_kindergarten", "student_1", "student_2", "student_3", "student_4", "student_5"]}>{useV2Design ? <StudentAssessmentsProgressV2 /> : <StudentAssessmentsProgress />}</ProtectedRoute>} />
      <Route path="/lesson/:id" element={<ProtectedRoute allowedRoles={["student", "student_kindergarten", "student_1", "student_2", "student_3", "student_4", "student_5"]}><ViewLesson /></ProtectedRoute>} />
      <Route path="/lesson/:lessonId/exercises" element={<ProtectedRoute allowedRoles={["student", "student_kindergarten", "student_1", "student_2", "student_3", "student_4", "student_5"]}><LessonExerciseFlow /></ProtectedRoute>} />
      <Route path="/activities" element={<ProtectedRoute allowedRoles={["student", "student_kindergarten", "student_1", "student_2", "student_3", "student_4", "student_5"]}>{useV2Design ? <ActivitiesV2 /> : <Activities />}</ProtectedRoute>} />
      <Route path="/available-assessments" element={<ProtectedRoute><AvailableAssessments /></ProtectedRoute>} />
      <Route path="/teacher-dashboard" element={<ProtectedRoute allowedRoles={["teacher", "teacher_english", "teacher_spanish"]}>{useV2Design ? <TeacherDashboardV2 /> : <TeacherDashboard />}</ProtectedRoute>} />
      <Route path="/family-dashboard" element={<ProtectedRoute allowedRoles={["family"]}>{useV2Design ? <FamilyDashboardV2 /> : <FamilyDashboard />}</ProtectedRoute>} />
      <Route path="/school-director-dashboard" element={<ProtectedRoute allowedRoles={["school_director"]}><SchoolDirectorDashboard /></ProtectedRoute>} />
      <Route path="/regional-director-dashboard" element={<ProtectedRoute allowedRoles={["regional_director"]}><RegionalDirectorDashboard /></ProtectedRoute>} />
      <Route path="/depr-executive-dashboard" element={<ProtectedRoute allowedRoles={["depr_executive"]}><DEPRExecutiveDashboard /></ProtectedRoute>} />
      <Route path="/reading-exercise" element={<ProtectedRoute allowedRoles={["student", "student_kindergarten", "student_1", "student_2", "student_3", "student_4", "student_5"]}><ReadingExercise /></ProtectedRoute>} />
      <Route path="/voice-test" element={<ProtectedRoute><VoiceTest /></ProtectedRoute>} />
      
      <Route path="/pdf-demo" element={<ProtectedRoute><PDFDemo /></ProtectedRoute>} />
      <Route path="/assessment-generator" element={<ProtectedRoute><AssessmentGenerator /></ProtectedRoute>} />
      <Route path="/generated/:id" element={<ProtectedRoute><GeneratedAssessment /></ProtectedRoute>} />
      <Route path="/create-assessment" element={<ProtectedRoute><CreateAssessment /></ProtectedRoute>} />
      <Route path="/assessments/edit/:id" element={<ProtectedRoute><CreateAssessment /></ProtectedRoute>} />
      <Route path="/assessment/:id" element={<ProtectedRoute><ViewAssessment /></ProtectedRoute>} />
      <Route path="/view-assessment/:id" element={<ProtectedRoute><ViewAssessment /></ProtectedRoute>} />
      <Route path="/create-demo-users" element={<CreateDemoUsers />} />
      <Route path="/admin-dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
      <Route path="/generate-content" element={<ProtectedRoute><GenerateContent /></ProtectedRoute>} />
      <Route path="/generate-content-admin" element={<ProtectedRoute><GenerateContentAdmin /></ProtectedRoute>} />
      <Route path="/admin/test-g1-reset" element={<ProtectedRoute allowedRoles={["teacher_english", "teacher_spanish", "school_director", "regional_director", "depr_executive"]}><TestG1Reset /></ProtectedRoute>} />
      <Route path="/delete-test-lesson" element={<DeleteTestLesson />} />
      <Route path="/demo" element={<ProtectedRoute><DemoHome /></ProtectedRoute>} />
      <Route path="/demo/:type/:id" element={<ProtectedRoute><DemoActivityPage /></ProtectedRoute>} />
      <Route path="/demo/realtime-guide" element={<ProtectedRoute><RealtimeStudentGuideDemo /></ProtectedRoute>} />
      <Route path="/voice-monitoring" element={<ProtectedRoute allowedRoles={["teacher_english", "teacher_spanish", "school_director", "regional_director", "depr_executive"]}><VoiceMonitoringDashboard /></ProtectedRoute>} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <LanguageProvider>
          <AuthProvider>
            <ScrollToTop />
            <AppRoutes />
          </AuthProvider>
        </LanguageProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
