import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { k5Client } from '@/lib/K5Client';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Code } from 'lucide-react';

export const PDFDebugger: React.FC = () => {
  const { toast } = useToast();
  const [documentId, setDocumentId] = useState('');
  const [debugOutput, setDebugOutput] = useState<string[]>([]);
  const [realtimeStatus, setRealtimeStatus] = useState<'disconnected' | 'connected'>('disconnected');

  const addDebugLine = (line: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setDebugOutput(prev => [...prev, `[${timestamp}] ${line}`]);
  };

  // Test manual progress fetch
  const testManualProgress = async () => {
    if (!documentId) {
      toast({
        title: 'Error',
        description: 'Please enter a document ID',
        variant: 'destructive'
      });
      return;
    }

    try {
      addDebugLine(`Testing manual progress fetch for document: ${documentId}`);
      const progress = await k5Client.getProgress(documentId);
      addDebugLine(`Progress: ${JSON.stringify(progress, null, 2)}`);

      toast({
        title: 'Progress fetched',
        description: `Status: ${progress.status}, Progress: ${progress.progress}%`
      });
    } catch (error) {
      addDebugLine(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to fetch progress',
        variant: 'destructive'
      });
    }
  };

  // Test realtime subscription
  const testRealtimeSubscription = () => {
    if (!documentId) {
      toast({
        title: 'Error',
        description: 'Please enter a document ID',
        variant: 'destructive'
      });
      return;
    }

    addDebugLine(`Setting up realtime subscription for document: ${documentId}`);

    const channel = supabase
      .channel(`debug-${documentId}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'pdf_documents',
        filter: `id=eq.${documentId}`
      }, (payload) => {
        addDebugLine(`Realtime update received: ${JSON.stringify(payload, null, 2)}`);
      })
      .subscribe((status) => {
        addDebugLine(`Subscription status: ${status}`);
        if (status === 'SUBSCRIBED') {
          setRealtimeStatus('connected');
          addDebugLine('Realtime subscription active');
        }
      });

    // Clean up after 30 seconds
    setTimeout(() => {
      channel.unsubscribe();
      setRealtimeStatus('disconnected');
      addDebugLine('Realtime subscription closed');
    }, 30000);

    toast({
      title: 'Subscription started',
      description: 'Will monitor for 30 seconds'
    });
  };

  // Test realtime connectivity
  const testRealtimeConnectivity = async () => {
    addDebugLine('Testing realtime connectivity...');

    const testChannel = supabase
      .channel('connectivity-test')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'pdf_documents'
      }, (payload) => {
        addDebugLine(`Global realtime event: ${payload.eventType}`);
      })
      .subscribe((status) => {
        addDebugLine(`Global subscription status: ${status}`);
        if (status === 'SUBSCRIBED') {
          addDebugLine('✅ Realtime is working!');
          toast({
            title: 'Success',
            description: 'Realtime connection verified'
          });
          // Clean up immediately
          setTimeout(() => testChannel.unsubscribe(), 1000);
        } else if (status === 'CHANNEL_ERROR') {
          addDebugLine('❌ Realtime connection failed');
          toast({
            title: 'Error',
            description: 'Realtime connection failed',
            variant: 'destructive'
          });
        }
      });
  };

  // Manually trigger a database update to test realtime
  const triggerDatabaseUpdate = async () => {
    if (!documentId) {
      toast({
        title: 'Error',
        description: 'Please enter a document ID',
        variant: 'destructive'
      });
      return;
    }

    try {
      addDebugLine(`Triggering manual database update for document: ${documentId}`);

      // Get current progress
      const { data: currentDoc } = await supabase
        .from('pdf_documents')
        .select('processing_progress')
        .eq('id', documentId)
        .single();

      if (!currentDoc) {
        throw new Error('Document not found');
      }

      // Increment progress by 10
      const newProgress = Math.min((currentDoc.processing_progress || 0) + 10, 100);

      const { error } = await supabase
        .from('pdf_documents')
        .update({
          processing_progress: newProgress,
          processing_status: newProgress === 100 ? 'completed' : 'processing'
        })
        .eq('id', documentId);

      if (error) throw error;

      addDebugLine(`Updated progress to ${newProgress}%`);
      toast({
        title: 'Update triggered',
        description: `Progress updated to ${newProgress}%`
      });
    } catch (error) {
      addDebugLine(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update',
        variant: 'destructive'
      });
    }
  };

  // Clear debug output
  const clearDebug = () => {
    setDebugOutput([]);
    addDebugLine('Debug output cleared');
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Code className="h-5 w-5" />
          PDF Processing Debugger
        </CardTitle>
        <CardDescription>
          Debug tools for testing PDF processing and realtime updates
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Enter document ID"
            value={documentId}
            onChange={(e) => setDocumentId(e.target.value)}
            className="flex-1"
          />
          <div className={`px-3 py-2 rounded text-sm ${
            realtimeStatus === 'connected'
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-600'
          }`}>
            {realtimeStatus === 'connected' ? '🟢 Connected' : '⚪ Disconnected'}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button onClick={testManualProgress} variant="outline">
            Test Manual Progress Fetch
          </Button>
          <Button onClick={testRealtimeSubscription} variant="outline">
            Test Realtime Subscription
          </Button>
          <Button onClick={testRealtimeConnectivity} variant="outline">
            Test Realtime Connectivity
          </Button>
          <Button onClick={triggerDatabaseUpdate} variant="outline">
            Trigger DB Update (+10%)
          </Button>
        </div>

        <div className="relative">
          <div className="absolute top-2 right-2 z-10">
            <Button onClick={clearDebug} size="sm" variant="ghost">
              Clear
            </Button>
          </div>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-xs overflow-auto max-h-96">
            <div className="space-y-1">
              {debugOutput.length === 0 ? (
                <div className="text-gray-500">Debug output will appear here...</div>
              ) : (
                debugOutput.map((line, index) => (
                  <div key={index} className="whitespace-pre-wrap">
                    {line}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg space-y-2">
          <h3 className="font-semibold text-sm">Debug Instructions:</h3>
          <ul className="text-xs space-y-1 text-muted-foreground">
            <li>1. Upload a PDF using the main uploader and copy its document ID</li>
            <li>2. Paste the document ID in the input field above</li>
            <li>3. Use "Test Manual Progress Fetch" to check current status</li>
            <li>4. Use "Test Realtime Subscription" to monitor live updates</li>
            <li>5. Use "Trigger DB Update" to simulate progress changes</li>
            <li>6. Check the console for additional debug information</li>
          </ul>
        </div>

        <div className="bg-amber-50 dark:bg-amber-950 p-4 rounded-lg">
          <h3 className="font-semibold text-sm mb-2">Console Commands for Testing:</h3>
          <pre className="text-xs bg-gray-800 text-green-400 p-2 rounded overflow-x-auto">
{`// Test progress fetch directly
await k5Client.getProgress('<document-id>')

// Test realtime subscription
const ch = supabase.channel('test')
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'pdf_documents'
  }, (p) => console.log('Update:', p))
  .subscribe()

// Cleanup
ch.unsubscribe()`}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
};