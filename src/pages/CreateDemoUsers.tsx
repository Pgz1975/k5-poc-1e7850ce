import { useState } from "react";
import { createDemoUsers } from "@/utils/createDemoUsers";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const CreateDemoUsers = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const navigate = useNavigate();

  const handleCreateUsers = async () => {
    setLoading(true);
    try {
      const creationResults = await createDemoUsers();
      setResults(creationResults);
    } catch (error) {
      console.error("Error creating demo users:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Create Demo Users</CardTitle>
          <CardDescription>
            This will create all demo users for testing the platform
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={handleCreateUsers} 
            disabled={loading}
            className="w-full"
          >
            {loading ? "Creating Users..." : "Create All Demo Users"}
          </Button>

          {results.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold">Results:</h3>
              <div className="space-y-1 text-sm">
                {results.map((result, index) => (
                  <div 
                    key={index}
                    className={result.success ? "text-success" : "text-destructive"}
                  >
                    {result.email}: {result.success ? "✓ Created" : `✗ ${result.error}`}
                  </div>
                ))}
              </div>
            </div>
          )}

          <Button 
            variant="outline" 
            onClick={() => navigate("/")}
            className="w-full"
          >
            Back to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateDemoUsers;
