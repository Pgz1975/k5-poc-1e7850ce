import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { SpeechRecognizerFactory } from '@/lib/speech/factory/SpeechRecognizerFactory';
import { ISpeechRecognizer } from '@/lib/speech/interfaces/ISpeechRecognizer';
import { ModelType } from '@/lib/speech/types/ModelType';
import { RecognizerConfig } from '@/lib/speech/types/RecognizerConfig';
import { ModelSwitcher } from '@/lib/speech/services/ModelSwitcher';
import { ModelSelector } from '@/components/voice/ModelSelector';
import { CostComparison } from '@/components/voice/CostComparison';
import { PerformanceMetrics } from '@/components/voice/PerformanceMetrics';
import { UsageDashboard } from '@/components/voice/UsageDashboard';
import { useAuth } from '@/contexts/AuthContext';
import { Mic, MicOff, Activity, Trash2, Loader2 } from 'lucide-react';
import { Header } from '@/components/Header';

export default function VoiceTest() {
  console.log('[VoiceTest] 🎬 Component rendering');
  
  const { user } = useAuth();
  const [language, setLanguage] = useState<'es-PR' | 'en'>('es-PR');
  const [model, setModel] = useState<ModelType>(ModelType.WEB_SPEECH);
  const [voiceGuidance, setVoiceGuidance] = useState('');
  const [logs, setLogs] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isAIPlaying, setIsAIPlaying] = useState(false);
  const [transcript, setTranscript] = useState<Array<{text: string, isUser: boolean}>>([]);
  const [metrics, setMetrics] = useState<any>({});
  const [micLevel, setMicLevel] = useState(0);
  const [aiLevel, setAiLevel] = useState(0);
  const recognizerRef = useRef<ISpeechRecognizer | null>(null);
  const [modelSwitcher] = useState(() => new ModelSwitcher());
  const [isSwitching, setIsSwitching] = useState(false);
  const [currentConfig, setCurrentConfig] = useState<RecognizerConfig | null>(null);

  useEffect(() => {
    console.log('[VoiceTest] ✅ Component mounted');
    addLog('🎬 VoiceTest component mounted');
    
    return () => {
      console.log('[VoiceTest] 🧹 Component unmounting');
      addLog('🧹 Component unmounting');
      recognizerRef.current?.disconnect();
    };
  }, []);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [`[${timestamp}] ${message}`, ...prev].slice(0, 100));
  };

  const handleConnect = async () => {
    addLog('🔌 Connect button clicked');
    addLog(`🤖 Model: ${model}`);
    addLog(`📝 Voice Guidance: ${voiceGuidance || '(none)'}`);
    setIsConnecting(true);
    setIsSwitching(true);

    try {
      // Configure recognizer
      const config: RecognizerConfig = {
        model,
        language: language === 'es-PR' ? 'es-PR' : 'en-US',
        studentId: user?.id || 'test-student',
        voiceGuidance,
        onTranscription: (text, isUser) => {
          addLog(`${isUser ? '🎤 User' : '🔊 AI'}: ${text}`);
          setTranscript(prev => {
            const updated = [...prev, { text, isUser }];
            modelSwitcher.updateTranscript(updated);
            return updated;
          });
        },
        onError: (error) => {
          addLog(`❌ Error: ${error.message}`);
        },
        onConnectionChange: (connected) => {
          setIsConnected(connected);
          addLog(connected ? '✅ Connected' : '🔌 Disconnected');
        },
        onAudioLevel: (level) => {
          setMicLevel(level);
        }
      };

      // Store config for model switching
      setCurrentConfig(config);

      // Use ModelSwitcher to connect
      const recognizer = await modelSwitcher.switchModel(model, config);
      recognizerRef.current = recognizer;

      // Restore transcript if available
      const preserved = modelSwitcher.getPreservedTranscript();
      if (preserved.length > 0) {
        setTranscript(preserved);
        addLog(`📝 Restored ${preserved.length} transcript entries`);
      }

      // Get and display cost metrics
      const costMetrics = recognizer.getCost();
      addLog(`💰 Model cost: $${costMetrics.totalCost.toFixed(4)}`);

    } catch (error) {
      addLog(`❌ Connect failed: ${error}`);
    } finally {
      setIsConnecting(false);
      setIsSwitching(false);
    }
  };

  const handleDisconnect = () => {
    addLog('🔌 Disconnect button clicked');
    recognizerRef.current?.disconnect();
    setIsConnected(false);
    setIsAIPlaying(false);
    addLog('✅ Disconnected');
  };

  const handleSendTestText = () => {
    const testText = language === 'es-PR' 
      ? 'Hola, soy Coquí. ¿Cómo estás?' 
      : 'Hello, I am Coquí. How are you?';
    addLog(`📤 Sending text: ${testText}`);
    recognizerRef.current?.sendText(testText);
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
                
                {/* Audio Level Meters */}
                {isConnected && (
                  <>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm flex items-center gap-2">
                          <Mic className="h-4 w-4" />
                          Mic Input
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {Math.round(micLevel * 100)}%
                        </span>
                      </div>
                      <div className="flex gap-1 h-6 items-end">
                        {[...Array(20)].map((_, i) => (
                          <div
                            key={i}
                            className={`flex-1 rounded-t transition-all duration-75 ${
                              i < micLevel * 20
                                ? i < 14
                                  ? 'bg-primary'
                                  : i < 17
                                  ? 'bg-yellow-500'
                                  : 'bg-red-500'
                                : 'bg-muted'
                            }`}
                            style={{ 
                              height: i < micLevel * 20 ? `${((i + 1) / 20) * 100}%` : '10%'
                            }}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm flex items-center gap-2">
                          <Activity className="h-4 w-4" />
                          AI Output
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {Math.round(aiLevel * 100)}%
                        </span>
                      </div>
                      <div className="flex gap-1 h-6 items-end">
                        {[...Array(20)].map((_, i) => (
                          <div
                            key={i}
                            className={`flex-1 rounded-t transition-all duration-75 ${
                              i < aiLevel * 20
                                ? i < 14
                                  ? 'bg-secondary'
                                  : i < 17
                                  ? 'bg-yellow-500'
                                  : 'bg-red-500'
                                : 'bg-muted'
                            }`}
                            style={{ 
                              height: i < aiLevel * 20 ? `${((i + 1) / 20) * 100}%` : '10%'
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </>
                )}
                {metrics.avgLatency !== undefined && (
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Avg Latency:</span>
                    <Badge variant="outline">
                      {Math.round(metrics.avgLatency)}ms
                    </Badge>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="font-medium">User ID:</span>
                  <Badge variant="outline" className="font-mono text-xs">
                    {user?.id?.slice(0, 8)}...
                  </Badge>
                </div>
              </div>

              {/* Cost Information */}
              {isConnected && recognizerRef.current && (
                <div className="mt-4 p-3 rounded-lg bg-muted/50">
                  <h4 className="text-sm font-medium mb-2">💰 Cost Tracking</h4>
                  {(() => {
                    const cost = recognizerRef.current.getCost();
                    const metadata = recognizerRef.current.getMetadata();
                    return (
                      <>
                        <div className="text-xs space-y-1">
                          <div>Model: {metadata.name}</div>
                          <div>Session Cost: ${cost.lastSessionCost.toFixed(4)}</div>
                          <div>Total Cost: ${cost.totalCost.toFixed(4)}</div>
                          <div>Sessions: {cost.sessionsCount}</div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}

              {/* Model Selection */}
              <div className="mb-6">
                <ModelSelector 
                  value={model}
                  onChange={(value) => {
                    setModel(value);
                    addLog(`🤖 Model changed to ${value}`);
                  }}
                  disabled={isConnected || isSwitching}
                  showCostBadge={true}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Web Speech API is free and runs locally. OpenAI models require API costs.
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
                    variant={language === 'en' ? 'default' : 'outline'}
                    onClick={() => {
                      setLanguage('en');
                      addLog('🌐 Language changed to English (en)');
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
                {isSwitching && (
                  <div className="flex items-center justify-center p-4 bg-muted/50 rounded-lg">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    <span className="text-sm">Switching model...</span>
                  </div>
                )}

                {!isConnected ? (
                  <Button 
                    onClick={handleConnect} 
                    disabled={isConnecting || isSwitching}
                    className="w-full"
                    size="lg"
                  >
                    <Mic className="mr-2 h-5 w-5" />
                    {isConnecting ? 'Connecting...' : 'Start Voice Session'}
                  </Button>
                ) : (
                  <>
                    <Button 
                      onClick={handleDisconnect}
                      variant="destructive"
                      className="w-full"
                      size="lg"
                      disabled={isSwitching}
                    >
                      <MicOff className="mr-2 h-5 w-5" />
                      Stop Voice Session
                    </Button>

                    <Button
                      onClick={async () => {
                        addLog('🔄 Quick switching model...');
                        setIsSwitching(true);
                        try {
                          const newModel = model === ModelType.WEB_SPEECH
                            ? ModelType.GPT4O_MINI_REALTIME
                            : ModelType.WEB_SPEECH;

                          if (!currentConfig) {
                            throw new Error('No config available');
                          }

                          const recognizer = await modelSwitcher.switchModel(newModel, {
                            ...currentConfig,
                            model: newModel
                          }, true);

                          recognizerRef.current = recognizer;
                          setModel(newModel);
                          addLog(`✅ Switched to ${newModel}`);
                        } catch (error) {
                          addLog(`❌ Switch failed: ${error}`);
                        } finally {
                          setIsSwitching(false);
                        }
                      }}
                      variant="outline"
                      className="w-full"
                      disabled={isSwitching}
                    >
                      🔄 Quick Switch Model
                    </Button>
                  </>
                )}

                <Button
                  onClick={handleSendTestText}
                  disabled={!isConnected || isSwitching}
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

          {/* Model Comparison & Metrics */}
          <div className="space-y-4">
            <CostComparison 
              currentModel={model}
              sessionMinutes={10}
              studentsCount={100000}
            />

            {recognizerRef.current && (
              <PerformanceMetrics 
                metadata={recognizerRef.current.getMetadata()}
                latency={metrics.avgLatency}
              />
            )}

            {/* Usage Dashboard */}
            {user?.id && (
              <UsageDashboard />
            )}
          </div>

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
              <span className="font-medium">Implementation:</span>
              <code className="ml-2 px-2 py-1 bg-muted rounded text-xs">
                ISpeechRecognizer Factory Pattern
              </code>
            </div>
            <div>
              <span className="font-medium">Edge Function:</span>
              <code className="ml-2 px-2 py-1 bg-muted rounded text-xs">
                /functions/v1/realtime-token-enhanced
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
