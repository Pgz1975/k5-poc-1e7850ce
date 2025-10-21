import React, { useState, useRef, useEffect } from 'react';
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

  // Refs for managing subscriptions and polling
  const subRef = useRef<{ unsubscribe: () => void } | null>(null);
  const pollerRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup function for subscriptions and polling
  const cleanup = () => {
    console.log('[PDFUploader] Cleaning up subscriptions and polling');
    if (subRef.current) {
      subRef.current.unsubscribe();
      subRef.current = null;
    }
    if (pollerRef.current) {
      clearInterval(pollerRef.current);
      pollerRef.current = null;
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, []);

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
      // Clean up any existing subscriptions/polling
      cleanup();

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

      console.log('[PDFUploader] Setting up progress monitoring for document:', result.documentId);

      // Set up realtime subscription
      const subscription = k5Client.subscribeToProgress(result.documentId, (progressUpdate) => {
        console.log('[PDFUploader] Realtime update received:', progressUpdate);
        setProgress(progressUpdate.progress);

        if (progressUpdate.status === 'completed') {
          setStatus('completed');
          cleanup(); // Clean up both subscription and polling

          toast({
            title: 'Processing complete',
            description: 'PDF has been successfully processed'
          });
        } else if (progressUpdate.status === 'failed') {
          setStatus('failed');
          cleanup(); // Clean up both subscription and polling

          toast({
            title: 'Processing failed',
            description: progressUpdate.error || 'An error occurred',
            variant: 'destructive'
          });
        }
      });

      // Store the subscription ref
      subRef.current = subscription;
      console.log('[PDFUploader] Realtime subscription established');

      // Set up polling fallback (every 2 seconds)
      const pollProgress = async () => {
        try {
          const progressUpdate = await k5Client.getProgress(result.documentId);
          console.log('[PDFUploader] Polling update:', progressUpdate);

          // Update progress if it's different
          setProgress((currentProgress) => {
            if (progressUpdate.progress > currentProgress) {
              console.log('[PDFUploader] Progress increased via polling:', progressUpdate.progress);
              return progressUpdate.progress;
            }
            return currentProgress;
          });

          // Check for completion/failure
          if (progressUpdate.status === 'completed') {
            setStatus('completed');
            cleanup();

            toast({
              title: 'Processing complete',
              description: 'PDF has been successfully processed'
            });
          } else if (progressUpdate.status === 'failed') {
            setStatus('failed');
            cleanup();

            toast({
              title: 'Processing failed',
              description: progressUpdate.error || 'An error occurred',
              variant: 'destructive'
            });
          }
        } catch (pollError) {
          console.error('[PDFUploader] Polling error:', pollError);
        }
      };

      // Start polling as a fallback
      console.log('[PDFUploader] Starting polling fallback');
      pollerRef.current = setInterval(pollProgress, 2000);

      // Do an immediate poll to ensure we have the latest status
      pollProgress();

    } catch (error) {
      console.error('[PDFUploader] Upload error:', error);
      setStatus('failed');
      cleanup();
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
    cleanup(); // Clean up any active subscriptions/polling
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
