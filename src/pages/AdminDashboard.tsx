import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  BookOpen, 
  FileText, 
  Upload, 
  Settings, 
  BarChart, 
  GraduationCap, 
  Heart,
  Mic,
  FileCheck,
  PlusCircle,
  Database
} from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const dashboardSections = [
    {
      title: "User Dashboards",
      description: "Access different user role dashboards",
      items: [
        { title: "Student Dashboard", description: "View student interface", icon: GraduationCap, path: "/student-dashboard" },
        { title: "Teacher Dashboard", description: "View teacher interface", icon: Users, path: "/teacher-dashboard" },
        { title: "Family Dashboard", description: "View family interface", icon: Heart, path: "/family-dashboard" },
      ]
    },
    {
      title: "Content Management",
      description: "Create and manage educational content",
      items: [
        { title: "Create Assessment", description: "Build new assessments", icon: PlusCircle, path: "/create-assessment" },
        { title: "Assessment Generator", description: "AI-powered assessment creation", icon: FileCheck, path: "/assessment-generator" },
        { title: "Activities", description: "Manage reading activities", icon: BookOpen, path: "/activities" },
      ]
    },
    {
      title: "PDF & Resources",
      description: "Upload and manage educational materials",
      items: [
        { title: "PDF Demo", description: "Upload and process PDFs", icon: Upload, path: "/pdf-demo" },
        { title: "Reading Exercise", description: "Interactive reading exercises", icon: FileText, path: "/reading-exercise/kindergarten" },
      ]
    },
    {
      title: "Testing & Tools",
      description: "Development and testing utilities",
      items: [
        { title: "Voice Test", description: "Test voice recognition", icon: Mic, path: "/voice-test" },
        { title: "Create Demo Users", description: "Populate database with demo accounts", icon: Database, path: "/create-demo-users" },
      ]
    },
    {
      title: "Settings & Profile",
      description: "Manage account and preferences",
      items: [
        { title: "Profile", description: "Edit your profile", icon: Settings, path: "/profile" },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-4xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Platform Administrator Control Panel
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8">
          {dashboardSections.map((section) => (
            <div key={section.title} className="space-y-4">
              <div>
                <h2 className="text-2xl font-semibold text-foreground">{section.title}</h2>
                <p className="text-muted-foreground">{section.description}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Card 
                      key={item.path}
                      className="hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => navigate(item.path)}
                    >
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                          <CardTitle className="text-lg">{item.title}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription>{item.description}</CardDescription>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <Button variant="outline" onClick={() => navigate("/")}>
            Return to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
