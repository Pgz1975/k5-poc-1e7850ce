import { useDesignVersion } from "@/hooks/useDesignVersion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export default function DesignPreview() {
  const { useV2Design, toggleDesignVersion } = useDesignVersion();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>Design System Preview</CardTitle>
          <CardDescription>
            Toggle between the current design and the new Duolingo-inspired v2 design
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <p className="font-semibold">Current Design Version</p>
              <p className="text-sm text-muted-foreground">
                {useV2Design ? "V2 - New Design" : "V1 - Current Design"}
              </p>
            </div>
            <div className={`w-3 h-3 rounded-full ${useV2Design ? 'bg-student-lime' : 'bg-primary'}`} />
          </div>

          <Button 
            onClick={toggleDesignVersion} 
            className="w-full"
            variant={useV2Design ? "student-lime" : "default"}
          >
            Switch to {useV2Design ? "V1 (Current)" : "V2 (New)"}
          </Button>

          <div className="space-y-2 pt-4 border-t">
            <Button 
              onClick={() => navigate('/')} 
              variant="outline"
              className="w-full"
            >
              View Homepage
            </Button>
            <Button 
              onClick={() => navigate('/student-dashboard')} 
              variant="outline"
              className="w-full"
            >
              View Student Dashboard
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center pt-4">
            This page is for testing purposes only. Changes persist in localStorage.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
