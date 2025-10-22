import { useSimpleRealtimeVoice } from '@/hooks/useSimpleRealtimeVoice';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff } from 'lucide-react';
import { Header } from '@/components/Header';

export default function VoiceTestSimple() {
  const { isConnected, isConnecting, events, connect, disconnect } = useSimpleRealtimeVoice();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto p-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Header */}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">Simple Voice Test</h1>
              <Badge variant="default">gpt-realtime-2025-08-28</Badge>
            </div>
            <p className="text-muted-foreground">
              Minimal OpenAI Realtime API implementation using official WebRTC pattern
            </p>
          </div>

          {/* Connection Card */}
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    isConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-300'
                  }`} />
                  <span className="font-medium">
                    {isConnected ? 'Connected' : isConnecting ? 'Connecting...' : 'Disconnected'}
                  </span>
                </div>
                {isConnected ? (
                  <Mic className="w-5 h-5 text-green-500" />
                ) : (
                  <MicOff className="w-5 h-5 text-gray-400" />
                )}
              </div>

              {!isConnected ? (
                <Button 
                  onClick={connect} 
                  disabled={isConnecting}
                  size="lg"
                  className="w-full"
                >
                  {isConnecting ? 'Connecting...' : 'Start Voice Chat'}
                </Button>
              ) : (
                <Button 
                  onClick={disconnect} 
                  variant="destructive"
                  size="lg"
                  className="w-full"
                >
                  End Chat
                </Button>
              )}

              {isConnected && (
                <p className="text-sm text-muted-foreground text-center">
                  Speak naturally - the AI will respond when you pause
                </p>
              )}
            </div>
          </Card>

          {/* Events Log */}
          {events.length > 0 && (
            <Card className="p-6">
              <h3 className="font-semibold mb-3">Events Log (Last 20)</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {events.map((event, i) => (
                  <div 
                    key={i} 
                    className="text-sm font-mono p-2 bg-muted rounded flex items-center justify-between"
                  >
                    <span>{event.type}</span>
                    {event.type.includes('audio') && (
                      <Badge variant="outline" className="text-xs">audio</Badge>
                    )}
                    {event.type.includes('transcription') && (
                      <Badge variant="outline" className="text-xs">text</Badge>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Info */}
          <Card className="p-4 border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
            <p className="text-sm text-blue-900 dark:text-blue-100">
              <strong>Model:</strong> gpt-realtime-2025-08-28 (Production/GA) <br />
              <strong>Voice:</strong> alloy <br />
              <strong>Connection:</strong> WebRTC (browser-native, lowest latency) <br />
              <strong>Purpose:</strong> Baseline testing without Puerto Rico features
            </p>
          </Card>

          <Card className="p-4 border-yellow-200 bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-800">
            <p className="text-sm text-yellow-900 dark:text-yellow-100">
              <strong>Comparison Note:</strong> This uses the new gpt-realtime-2025-08-28 model. Compare audio quality with /voice-test (old model) to evaluate if migration is worthwhile.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
