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
  Lock,
  Edit,
  Trash2,
  Link2,
  Layers
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
  const [parentLessons, setParentLessons] = useState<Record<string, string>>({});

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
          .select("id, title, created_at, grade_level, language, status, type, subtype, parent_lesson_id")
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

      if (manualRes.data) {
        setManualAssessments(manualRes.data);
        
        // Fetch parent lesson titles
        const parentIds = manualRes.data
          .filter(a => a.parent_lesson_id)
          .map(a => a.parent_lesson_id);
        
        if (parentIds.length > 0) {
          const { data: parents } = await supabase
            .from("manual_assessments")
            .select("id, title")
            .in("id", parentIds);
          
          if (parents) {
            const parentMap: Record<string, string> = {};
            parents.forEach(p => {
              parentMap[p.id] = p.title;
            });
            setParentLessons(parentMap);
          }
        }
      }
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

  const handleDeleteAssessment = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this assessment? This will also delete all related voice sessions and results.")) return;

    try {
      // Delete related records first to avoid foreign key constraint errors
      await supabase.from("voice_sessions").delete().eq("assessment_id", id);
      await supabase.from("voice_interactions").delete().eq("assessment_id", id);
      await supabase.from("voice_assessment_results").delete().eq("assessment_id", id);

      // Now delete the assessment
      const { error } = await supabase
        .from("manual_assessments")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Assessment deleted successfully",
      });
      fetchContent();
    } catch (error) {
      console.error("Error deleting assessment:", error);
      toast({
        title: "Error",
        description: "Failed to delete assessment",
        variant: "destructive",
      });
    }
  };

  const handleDeletePdf = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this PDF document?")) return;

    try {
      const { error } = await supabase
        .from("pdf_documents")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "PDF document deleted successfully",
      });
      fetchContent();
    } catch (error) {
      console.error("Error deleting PDF:", error);
      toast({
        title: "Error",
        description: "Failed to delete PDF document",
        variant: "destructive",
      });
    }
  };

  const handleEditAssessment = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/create-assessment?edit=${id}`);
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
    { title: "Create Content", icon: PlusCircle, path: "/create-assessment" },
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
                  {manualAssessments.map((assessment) => {
                    const isLesson = assessment.type === 'lesson';
                    const isExercise = assessment.type === 'exercise';
                    const isAssessment = assessment.type === 'assessment';
                    const hasParent = assessment.parent_lesson_id;
                    
                    return (
                      <div 
                        key={assessment.id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                        onClick={() => navigate(`/assessment/${assessment.id}`)}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium">{assessment.title}</p>
                            {isLesson && (
                              <Badge variant="outline" className="bg-blue-500/10 text-blue-700 border-blue-300">
                                <Layers className="h-3 w-3 mr-1" />
                                Lesson
                              </Badge>
                            )}
                            {isExercise && (
                              <Badge variant="outline" className="bg-green-500/10 text-green-700 border-green-300">
                                <FileCheck className="h-3 w-3 mr-1" />
                                Exercise
                              </Badge>
                            )}
                            {isAssessment && (
                              <Badge variant="outline" className="bg-purple-500/10 text-purple-700 border-purple-300">
                                <FileText className="h-3 w-3 mr-1" />
                                Assessment
                              </Badge>
                            )}
                            {hasParent && (
                              <Badge variant="secondary" className="bg-amber-500/10 text-amber-700 border-amber-300">
                                <Link2 className="h-3 w-3 mr-1" />
                                {parentLessons[assessment.parent_lesson_id] || 'Linked'}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Grade {assessment.grade_level} • {assessment.language?.toUpperCase()} • {assessment.status}
                            {assessment.subtype && ` • ${assessment.subtype.replace('_', ' ')}`}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            {new Date(assessment.created_at).toLocaleDateString()}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => handleEditAssessment(assessment.id, e)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => handleDeleteAssessment(assessment.id, e)}
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
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
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {new Date(doc.created_at).toLocaleDateString()}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => handleDeletePdf(doc.id, e)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
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
