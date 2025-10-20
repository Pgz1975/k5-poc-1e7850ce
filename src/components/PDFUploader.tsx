import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { k5Client } from '@/lib/K5Client';
import { Upload, FileText, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const PDFUploader: React.FC = () => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'processing' | 'completed' | 'failed'>('idle');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setStatus('idle');
      setProgress(0);
    } else {
      toast({
        title: 'Invalid file',
        description: 'Please select a PDF file',
        variant: 'destructive'
      });
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      setUploading(true);
      setStatus('uploading');
      setProgress(10);

      const result = await k5Client.uploadPDF(file, {
        gradeLevel: [1, 2, 3, 4, 5],
        language: 'bilingual',
        contentType: 'reading_material'
      });

      setDocumentId(result.documentId);
      setStatus('processing');
      setProgress(30);

      toast({
        title: 'Upload successful',
        description: 'Processing PDF...'
      });

      // Subscribe to progress updates
      const subscription = k5Client.subscribeToProgress(result.documentId, (progressUpdate) => {
        setProgress(progressUpdate.progress);
        
        if (progressUpdate.status === 'completed') {
          setStatus('completed');
          subscription.unsubscribe();
          
          toast({
            title: 'Processing complete',
            description: 'PDF has been successfully processed'
          });
        } else if (progressUpdate.status === 'failed') {
          setStatus('failed');
          subscription.unsubscribe();
          
          toast({
            title: 'Processing failed',
            description: progressUpdate.error || 'An error occurred',
            variant: 'destructive'
          });
        }
      });

    } catch (error) {
      console.error('Upload error:', error);
      setStatus('failed');
      toast({
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive'
      });
    } finally {
      setUploading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setStatus('idle');
    setProgress(0);
    setDocumentId(null);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>K5 PDF Upload System</CardTitle>
        <CardDescription>
          Upload educational PDFs for bilingual text extraction and processing
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="pdf-upload">Select PDF File</Label>
          <div className="flex gap-2">
            <Input
              id="pdf-upload"
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              disabled={uploading || status === 'processing'}
            />
            {file && status !== 'completed' && (
              <Button
                onClick={handleUpload}
                disabled={uploading || status === 'processing'}
              >
                {uploading ? 'Uploading...' : 'Upload'}
                <Upload className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {file && (
          <div className="flex items-center gap-2 p-4 bg-muted rounded-lg">
            <FileText className="h-5 w-5" />
            <div className="flex-1">
              <p className="font-medium">{file.name}</p>
              <p className="text-sm text-muted-foreground">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
        )}

        {(status === 'uploading' || status === 'processing') && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>
                {status === 'uploading' ? 'Uploading...' : 'Processing...'}
              </span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        )}

        {status === 'completed' && (
          <div className="flex items-center gap-2 p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            <div className="flex-1">
              <p className="font-medium text-green-900 dark:text-green-100">
                Processing Complete
              </p>
              <p className="text-sm text-green-700 dark:text-green-300">
                Document ID: {documentId}
              </p>
            </div>
            <Button onClick={reset} variant="outline" size="sm">
              Upload Another
            </Button>
          </div>
        )}

        {status === 'failed' && (
          <div className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
            <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            <div className="flex-1">
              <p className="font-medium text-red-900 dark:text-red-100">
                Processing Failed
              </p>
              <p className="text-sm text-red-700 dark:text-red-300">
                Please try again
              </p>
            </div>
            <Button onClick={reset} variant="outline" size="sm">
              Try Again
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
