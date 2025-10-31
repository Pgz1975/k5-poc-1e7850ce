import { Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import RealtimeStudentGuideDemo from "@/pages/demo/RealtimeStudentGuideDemo";

/**
 * Standalone route configuration for the Realtime Student Guide Demo
 * 
 * To enable this demo, add the following route to your App.tsx Routes:
 * 
 * <Route path="/demo/realtime-guide" element={<ProtectedRoute><RealtimeStudentGuideDemo /></ProtectedRoute>} />
 * 
 * And add this import:
 * import RealtimeStudentGuideDemo from "./pages/demo/RealtimeStudentGuideDemo";
 */
export const RealtimeGuideRoute = (
  <Route path="/demo/realtime-guide" element={<ProtectedRoute><RealtimeStudentGuideDemo /></ProtectedRoute>} />
);

export const REALTIME_GUIDE_PATH = "/demo/realtime-guide";

/**
 * Instructions for manual integration:
 * 
 * 1. In src/App.tsx, add the import:
 *    import RealtimeStudentGuideDemo from "./pages/demo/RealtimeStudentGuideDemo";
 * 
 * 2. Add the route in the Routes section:
 *    <Route path="/demo/realtime-guide" element={<ProtectedRoute><RealtimeStudentGuideDemo /></ProtectedRoute>} />
 * 
 * 3. The demo will be accessible at /demo/realtime-guide
 */