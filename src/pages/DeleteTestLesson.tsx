import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { deleteTestLessonAndExercises } from '@/utils/deleteTestLesson';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

export default function DeleteTestLesson() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const navigate = useNavigate();

  const handleDelete = async () => {
    setIsProcessing(true);
    const result = await deleteTestLessonAndExercises();
    setIsProcessing(false);
    
    if (result.success) {
      setIsDone(true);
      toast({
        title: "Deleted successfully",
        description: "Test lesson and all related data have been permanently deleted.",
      });
      setTimeout(() => navigate('/student-dashboard/lessons'), 2000);
    } else {
      toast({
        title: "Error",
        description: "Failed to delete. Check console for details.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="p-8 max-w-md">
        <h1 className="text-2xl font-bold mb-4">Delete Test Lesson</h1>
        <p className="mb-4 text-muted-foreground">
          This will <strong>permanently delete</strong> lesson "TEST G1 Lesson" and all exercises containing "TEST G1 Exercise" in the title.
        </p>
        <p className="mb-6 text-sm text-destructive">
          ⚠️ Warning: This will also delete all voice interactions, completed activities, and lesson ordering data. This action cannot be undone.
        </p>
        <Button 
          onClick={handleDelete} 
          disabled={isProcessing || isDone}
          variant="destructive"
          className="w-full"
        >
          {isProcessing ? 'Deleting...' : isDone ? 'Deleted ✓' : 'Delete Permanently'}
        </Button>
      </Card>
    </div>
  );
}
