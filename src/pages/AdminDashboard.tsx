import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Upload, 
  Settings, 
  BookOpen,
  FileCheck,
  PlusCircle,
  ExternalLink,
  Lock
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [manualAssessments, setManualAssessments] = useState<any[]>([]);
  const [generatedAssessments, setGeneratedAssessments] = useState<any[]>([]);
  const [pdfDocuments, setPdfDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (!user || user.email !== "admin@demo.com") {
        toast({
          title: "Access Denied",
          description: "This dashboard is restricted to administrators only.",
          variant: "destructive",
        });
        navigate("/");
        return;
      }
      
      fetchContent();
    }
  }, [user, authLoading, navigate]);

  const fetchContent = async () => {
    setLoading(true);
    try {
      const [manualRes, generatedRes, pdfRes] = await Promise.all([
        supabase
          .from("manual_assessments")
          .select("id, title, created_at, grade_level, language, status")
          .order("created_at", { ascending: false })
          .limit(10),
        supabase
          .from("generated_assessments")
          .select("id, assessment_type, created_at, grade_level, language, metadata")
          .order("created_at", { ascending: false })
          .limit(10),
        supabase
          .from("pdf_documents")
          .select("id, filename, created_at, processing_status, grade_level")
          .order("created_at", { ascending: false })
          .limit(10),
      ]);

      if (manualRes.data) setManualAssessments(manualRes.data);
      if (generatedRes.data) setGeneratedAssessments(generatedRes.data);
      if (pdfRes.data) setPdfDocuments(pdfRes.data);
    } catch (error) {
      console.error("Error fetching content:", error);
      toast({
        title: "Error",
        description: "Failed to load content",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || user.email !== "admin@demo.com") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-destructive" />
              <CardTitle>Access Denied</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              This dashboard is restricted to administrators only.
            </p>
            <Button onClick={() => navigate("/")} className="mt-4 w-full">
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const quickActions = [
    { title: "Create Assessment", icon: PlusCircle, path: "/create-assessment" },
    { title: "Generate Assessment", icon: FileCheck, path: "/assessment-generator" },
    { title: "Upload PDF", icon: Upload, path: "/pdf-demo" },
    { title: "Create Demo Users", icon: Settings, path: "/create-demo-users" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-muted-foreground mt-2">
                Welcome, {user.email}
              </p>
            </div>
            <Button variant="outline" onClick={() => navigate("/")}>
              Return to Home
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Card 
                  key={action.path}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => navigate(action.path)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <CardTitle className="text-base">{action.title}</CardTitle>
                    </div>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Content Overview */}
        <div className="grid gap-6">
          {/* Manual Assessments */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <CardTitle>Manual Assessments</CardTitle>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate("/create-assessment")}
                >
                  Create New
                </Button>
              </div>
              <CardDescription>Recently created assessments</CardDescription>
            </CardHeader>
            <CardContent>
              {manualAssessments.length === 0 ? (
                <p className="text-muted-foreground text-sm">No assessments created yet</p>
              ) : (
                <div className="space-y-2">
                  {manualAssessments.map((assessment) => (
                    <div 
                      key={assessment.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => navigate(`/assessment/${assessment.id}`)}
                    >
                      <div className="flex-1">
                        <p className="font-medium">{assessment.title}</p>
                        <p className="text-sm text-muted-foreground">
                          Grade {assessment.grade_level} • {assessment.language?.toUpperCase()} • {assessment.status}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">
                          {new Date(assessment.created_at).toLocaleDateString()}
                        </span>
                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* PDF Documents */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <CardTitle>PDF Documents</CardTitle>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate("/pdf-demo")}
                >
                  Upload New
                </Button>
              </div>
              <CardDescription>Educational materials and resources</CardDescription>
            </CardHeader>
            <CardContent>
              {pdfDocuments.length === 0 ? (
                <p className="text-muted-foreground text-sm">No PDF documents uploaded yet</p>
              ) : (
                <div className="space-y-2">
                  {pdfDocuments.map((doc) => (
                    <div 
                      key={doc.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => navigate("/pdf-demo")}
                    >
                      <div className="flex-1">
                        <p className="font-medium">{doc.filename}</p>
                        <p className="text-sm text-muted-foreground">
                          Status: {doc.processing_status}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">
                          {new Date(doc.created_at).toLocaleDateString()}
                        </span>
                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
