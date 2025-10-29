import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { unpublishTestLessonAndExercises } from '@/utils/deleteTestLesson';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

export default function DeleteTestLesson() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const navigate = useNavigate();

  const handleUnpublish = async () => {
    setIsProcessing(true);
    const result = await unpublishTestLessonAndExercises();
    setIsProcessing(false);
    
    if (result.success) {
      setIsDone(true);
      toast({
        title: "Unpublished successfully",
        description: "Test lesson and exercises are now drafts.",
      });
      setTimeout(() => navigate('/student-dashboard/lessons'), 2000);
    } else {
      toast({
        title: "Error",
        description: "Failed to unpublish. Check console for details.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="p-8 max-w-md">
        <h1 className="text-2xl font-bold mb-4">Unpublish Test Lesson</h1>
        <p className="mb-6 text-muted-foreground">
          This will unpublish lesson "TEST G1 Lesson" and all exercises containing "TEST G1 Exercise" in the title.
        </p>
        <Button 
          onClick={handleUnpublish} 
          disabled={isProcessing || isDone}
          variant="outline"
          className="w-full"
        >
          {isProcessing ? 'Unpublishing...' : isDone ? 'Unpublished ✓' : 'Unpublish Now'}
        </Button>
      </Card>
    </div>
  );
}
