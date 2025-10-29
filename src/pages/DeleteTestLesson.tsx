import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { deleteTestLessonAndExercises } from '@/utils/deleteTestLesson';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

export default function DeleteTestLesson() {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const navigate = useNavigate();

  const handleDelete = async () => {
    setIsDeleting(true);
    const result = await deleteTestLessonAndExercises();
    setIsDeleting(false);
    
    if (result.success) {
      setIsDeleted(true);
      toast({
        title: "Deleted successfully",
        description: "Test lesson and exercises have been removed.",
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
        <p className="mb-6 text-muted-foreground">
          This will delete lesson "TEST G1 Lesson" and all exercises containing "TEST G1 Exercise" in the title.
        </p>
        <Button 
          onClick={handleDelete} 
          disabled={isDeleting || isDeleted}
          variant="destructive"
          className="w-full"
        >
          {isDeleting ? 'Deleting...' : isDeleted ? 'Deleted ✓' : 'Delete Now'}
        </Button>
      </Card>
    </div>
  );
}
