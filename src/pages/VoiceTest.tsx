import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useRealtimeVoice } from '@/hooks/useRealtimeVoice';
import { useAuth } from '@/contexts/AuthContext';
import { Mic, MicOff, Activity, Trash2 } from 'lucide-react';
import { Header } from '@/components/Header';

export default function VoiceTest() {
  console.log('[VoiceTest] 🎬 Component rendering');
  
  const { user } = useAuth();
  const [language, setLanguage] = useState<'es-PR' | 'en-US'>('es-PR');
  const [model, setModel] = useState('gpt-realtime-2025-08-28');
  const [voiceGuidance, setVoiceGuidance] = useState('');
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    console.log('[VoiceTest] ✅ Component mounted');
    addLog('🎬 VoiceTest component mounted');
    
    return () => {
      console.log('[VoiceTest] 🧹 Component unmounting');
      addLog('🧹 Component unmounting');
    };
  }, []);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [`[${timestamp}] ${message}`, ...prev].slice(0, 100));
  };

  const {
    isConnected,
    isConnecting,
    isAIPlaying,
    transcript,
    connect,
    disconnect,
    sendText
  } = useRealtimeVoice({
    studentId: user?.id || 'test-student',
    language,
    model,
    voiceGuidance,
    onTranscription: (text, isUser) => {
      addLog(`${isUser ? '🎤 User' : '🔊 AI'}: ${text}`);
    }
  });

  const handleConnect = async () => {
    addLog('🔌 Connect button clicked');
    addLog(`📝 Voice Guidance: ${voiceGuidance || '(none)'}`);
    try {
      await connect();
      addLog('✅ Connect completed - voice guidance included in session config');
    } catch (error) {
      addLog(`❌ Connect failed: ${error}`);
    }
  };

  const handleDisconnect = () => {
    addLog('🔌 Disconnect button clicked');
    disconnect();
    addLog('✅ Disconnected');
  };

  const handleSendTestText = () => {
    const testText = language === 'es-PR' 
      ? 'Hola, soy Coquí. ¿Cómo estás?' 
      : 'Hello, I am Coquí. How are you?';
    addLog(`📤 Sending text: ${testText}`);
    sendText(testText);
  };

  const clearLogs = () => {
    setLogs([]);
    addLog('🗑️ Logs cleared');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-foreground mb-2">🎙️ Voice Test Page</h1>
          <p className="text-muted-foreground">Test the OpenAI Realtime Voice API integration</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Control Panel */}
          <Card className="p-6 space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Controls</h2>
              
              {/* Status Indicators */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Connection Status:</span>
                  <Badge variant={isConnected ? 'default' : 'secondary'}>
                    {isConnected ? '🟢 Connected' : isConnecting ? '🟡 Connecting...' : '🔴 Disconnected'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">AI Speaking:</span>
                  <Badge variant={isAIPlaying ? 'default' : 'secondary'}>
                    {isAIPlaying ? '🔊 Playing' : '🔇 Quiet'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">User ID:</span>
                  <Badge variant="outline" className="font-mono text-xs">
                    {user?.id?.slice(0, 8)}...
                  </Badge>
                </div>
              </div>

              {/* Model Selection */}
              <div className="space-y-2 mb-6">
                <label className="font-medium text-sm">Model:</label>
                <Select 
                  value={model} 
                  onValueChange={(value) => {
                    setModel(value);
                    addLog(`🤖 Model changed to ${value}`);
                  }}
                  disabled={isConnected}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-realtime-2025-08-28">
                      GPT Realtime (Aug 2025) - Latest Production
                    </SelectItem>
                    <SelectItem value="gpt-4o-realtime-preview-2024-12-17">
                      GPT-4o Realtime (Dec 2024) - Legacy
                    </SelectItem>
                    <SelectItem value="gpt-4o-realtime-preview-2024-10-01">
                      GPT-4o Realtime (Oct 2024) - Legacy
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  Note: Only GPT-4o models support realtime mode. GPT-5 variants are not yet available for the Realtime API.
                </p>
              </div>

              {/* Language Toggle */}
              <div className="space-y-2 mb-6">
                <label className="font-medium text-sm">Language:</label>
                <div className="flex gap-2">
                  <Button
                    variant={language === 'es-PR' ? 'default' : 'outline'}
                    onClick={() => {
                      setLanguage('es-PR');
                      addLog('🌐 Language changed to Spanish (es-PR)');
                    }}
                    disabled={isConnected}
                  >
                    🇵🇷 Español
                  </Button>
                  <Button
                    variant={language === 'en-US' ? 'default' : 'outline'}
                    onClick={() => {
                      setLanguage('en-US');
                      addLog('🌐 Language changed to English (en-US)');
                    }}
                    disabled={isConnected}
                  >
                    🇺🇸 English
                  </Button>
                </div>
              </div>

              {/* Voice Guidance */}
              <div className="space-y-2 mb-6">
                <Label htmlFor="voice-guidance" className="font-medium text-sm">
                  Voice Guidance (Optional):
                </Label>
                <Textarea
                  id="voice-guidance"
                  value={voiceGuidance}
                  onChange={(e) => setVoiceGuidance(e.target.value)}
                  placeholder="e.g., Speak slowly and clearly, emphasize key words..."
                  rows={3}
                  className="resize-none"
                  disabled={isConnected}
                />
                <p className="text-xs text-muted-foreground">
                  Custom instructions sent to the AI when connecting
                </p>
              </div>

              {/* Connection Buttons */}
              <div className="space-y-3">
                {!isConnected ? (
                  <Button 
                    onClick={handleConnect} 
                    disabled={isConnecting}
                    className="w-full"
                    size="lg"
                  >
                    <Mic className="mr-2 h-5 w-5" />
                    {isConnecting ? 'Connecting...' : 'Start Voice Session'}
                  </Button>
                ) : (
                  <Button 
                    onClick={handleDisconnect}
                    variant="destructive"
                    className="w-full"
                    size="lg"
                  >
                    <MicOff className="mr-2 h-5 w-5" />
                    Stop Voice Session
                  </Button>
                )}

                <Button
                  onClick={handleSendTestText}
                  disabled={!isConnected}
                  variant="secondary"
                  className="w-full"
                >
                  <Activity className="mr-2 h-4 w-4" />
                  Send Test Text
                </Button>
              </div>
            </div>

            {/* Transcript Display */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">Transcript</h3>
                <Badge variant="outline">{transcript.length} messages</Badge>
              </div>
              
              <ScrollArea className="h-48 rounded-md border bg-muted/30 p-4">
                {transcript.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic">
                    No transcript yet. Start speaking when connected.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {transcript.map((item, idx) => (
                      <div
                        key={idx}
                        className={`text-sm p-2 rounded ${
                          item.isUser 
                            ? 'bg-primary/10 text-primary' 
                            : 'bg-secondary/10 text-secondary-foreground'
                        }`}
                      >
                        <span className="font-semibold">
                          {item.isUser ? '🎤 You:' : '🤖 Coquí:'}
                        </span>{' '}
                        {item.text}
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>
          </Card>

          {/* Debug Logs */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Debug Logs</h2>
              <Button 
                onClick={clearLogs} 
                variant="outline" 
                size="sm"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Clear
              </Button>
            </div>

            <ScrollArea className="h-[500px] rounded-md border bg-black/90 p-4 font-mono text-xs">
              {logs.length === 0 ? (
                <p className="text-green-400 italic">No logs yet...</p>
              ) : (
                <div className="space-y-1">
                  {logs.map((log, idx) => (
                    <div key={idx} className="text-green-400">
                      {log}
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </Card>
        </div>

        {/* Instructions */}
        <Card className="mt-6 p-6 bg-muted/50">
          <h3 className="text-lg font-semibold mb-3">📋 Test Instructions</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
            <li>Select your preferred language (Spanish or English)</li>
            <li>Click "Start Voice Session" to connect to the Realtime API</li>
            <li>Grant microphone permissions when prompted</li>
            <li>Wait for the connection to establish (watch the status badge)</li>
            <li>Start speaking - your voice will be transcribed in real-time</li>
            <li>Coquí will respond with voice feedback</li>
            <li>Click "Send Test Text" to test text-to-speech without speaking</li>
            <li>Monitor the debug logs for detailed connection information</li>
            <li>Check browser console (F12) for additional technical logs</li>
          </ol>
        </Card>

        {/* Technical Info */}
        <Card className="mt-6 p-6 bg-primary/5">
          <h3 className="text-lg font-semibold mb-3">🔧 Technical Details</h3>
          <div className="grid gap-4 text-sm">
            <div>
              <span className="font-medium">Edge Function:</span>
              <code className="ml-2 px-2 py-1 bg-muted rounded text-xs">
                /functions/v1/realtime-voice-relay
              </code>
            </div>
            <div>
              <span className="font-medium">Selected Model:</span>
              <code className="ml-2 px-2 py-1 bg-muted rounded text-xs">
                {model}
              </code>
            </div>
            <div>
              <span className="font-medium">Audio Format:</span>
              <code className="ml-2 px-2 py-1 bg-muted rounded text-xs">
                PCM16, 24kHz, Mono
              </code>
            </div>
            <div>
              <span className="font-medium">Voice Detection:</span>
              <code className="ml-2 px-2 py-1 bg-muted rounded text-xs">
                Server VAD (Voice Activity Detection)
              </code>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
