import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useStudentGuideRealtime } from "@/hooks/useStudentGuideRealtime";
import { ConnectionState } from "@/lib/realtime/types";
import { getLanguageConfig } from "@/lib/realtime/languageConfigs";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  MessageSquare, 
  RefreshCw,
  Send,
  Languages,
  Loader2,
  AlertTriangle,
  CheckCircle,
  Circle
} from "lucide-react";

export default function RealtimeStudentGuideDemo() {
  const { language, setLanguage, t } = useLanguage();
  const [textMessage, setTextMessage] = useState("");
  
  const {
    isConnected,
    isConnecting,
    connectionState,
    transcript,
    error,
    latency,
    connect,
    disconnect,
    sendMessage,
    retry,
    clearTranscript,
    mute,
    unmute,
    isMuted
  } = useStudentGuideRealtime(language, {
    autoConnect: true,
    onConnectionSuccess: () => {
      console.log('Connected successfully');
    },
    onConnectionError: (error) => {
      console.error('Connection error:', error);
    }
  });

  const config = getLanguageConfig(language);

  // Handle language switching
  const handleLanguageSwitch = (newLanguage: 'es' | 'en') => {
    setLanguage(newLanguage);
  };

  // Handle text message sending
  const handleSendText = () => {
    if (textMessage.trim() && isConnected) {
      sendMessage(textMessage.trim());
      setTextMessage("");
    }
  };

  // Handle enter key for text input
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendText();
    }
  };

  // Connection status indicator
  const getConnectionStatusIcon = () => {
    switch (connectionState) {
      case ConnectionState.CONNECTED:
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case ConnectionState.CONNECTING:
      case ConnectionState.RECONNECTING:
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
      case ConnectionState.ERROR:
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <Circle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getConnectionStatusText = () => {
    switch (connectionState) {
      case ConnectionState.CONNECTED:
        return config.uiText.connected;
      case ConnectionState.CONNECTING:
        return config.uiText.connecting;
      case ConnectionState.RECONNECTING:
        return config.uiText.reconnecting;
      case ConnectionState.ERROR:
        return error?.message || 'Error de conexión';
      default:
        return config.uiText.disconnected;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container max-w-4xl px-4 mx-auto space-y-6">
          
          {/* Hero Section */}
          <div className="text-center space-y-4 py-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-full border border-purple-200">
              <Sparkles className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-semibold text-purple-700">
                {t("Demostración AI", "AI Demo")}
              </span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
              {t(
                "Tu Guía de Aprendizaje por Voz",
                "Your Voice Learning Guide"
              )}
            </h1>
            
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t(
                "Habla con tu guía personal para aprender a usar la plataforma. Tu guía te ayudará en español puertorriqueño.",
                "Talk with your personal guide to learn how to use the platform. Your guide will help you in English."
              )}
            </p>
          </div>

          {/* Language Switcher */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 p-1 bg-gray-100 rounded-lg">
              <Button
                variant={language === 'es' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handleLanguageSwitch('es')}
                className="gap-2"
              >
                <Languages className="h-4 w-4" />
                Español
              </Button>
              <Button
                variant={language === 'en' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handleLanguageSwitch('en')}
                className="gap-2"
              >
                <Languages className="h-4 w-4" />
                English
              </Button>
            </div>
          </div>

          {/* Main Demo Card */}
          <Card className="p-6 space-y-6">
            
            {/* Connection Status */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                {getConnectionStatusIcon()}
                <div>
                  <div className="font-medium text-gray-900">
                    {getConnectionStatusText()}
                  </div>
                  {isConnected && latency > 0 && (
                    <div className="text-sm text-gray-500">
                      {t("Latencia", "Latency")}: {latency.toFixed(0)}ms
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {/* Voice configured indicator */}
                <Badge variant="outline" className="gap-1">
                  <Volume2 className="h-3 w-3" />
                  {t("Voz", "Voice")}: {config.voice}
                </Badge>
                
                {/* Audio controls */}
                {isConnected && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={isMuted ? unmute : mute}
                    className="gap-2"
                  >
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    {isMuted ? config.uiText.unmute : config.uiText.mute}
                  </Button>
                )}
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  {error.message}
                  {error.retryable && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={retry}
                      className="ml-3"
                    >
                      <RefreshCw className="h-4 w-4 mr-1" />
                      {config.uiText.retry}
                    </Button>
                  )}
                </AlertDescription>
              </Alert>
            )}

            {/* Connection Controls */}
            {!isConnected && !isConnecting && (
              <div className="text-center space-y-4">
                <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
                  <Mic className="h-12 w-12 text-blue-600 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">
                    {t(
                      "¡Comencemos a hablar!",
                      "Let's Start Talking!"
                    )}
                  </h3>
                  <p className="text-blue-700 mb-4">
                    {t(
                      "Haz clic para empezar a hablar con tu guía de aprendizaje.",
                      "Click to start talking with your learning guide."
                    )}
                  </p>
                </div>
                
                <Button
                  onClick={connect}
                  size="lg"
                  className="gap-2 px-8"
                >
                  <Mic className="h-5 w-5" />
                  {t("Conectar con mi Guía", "Connect to My Guide")}
                </Button>
              </div>
            )}

            {/* Transcript Display */}
            {transcript.length > 0 && (
              <>
                <Separator />
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      {t("Conversación", "Conversation")}
                    </h3>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearTranscript}
                      className="gap-2"
                    >
                      <RefreshCw className="h-4 w-4" />
                      {t("Limpiar", "Clear")}
                    </Button>
                  </div>
                  
                  <div className="max-h-80 overflow-y-auto space-y-3 p-4 bg-gray-50 rounded-lg">
                    {transcript.map((entry) => (
                      <div
                        key={entry.id}
                        className={`flex ${entry.speaker === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            entry.speaker === 'user'
                              ? 'bg-blue-500 text-white'
                              : 'bg-white border shadow-sm'
                          }`}
                        >
                          <div className="text-xs font-medium mb-1 opacity-70">
                            {entry.speaker === 'user' ? config.uiText.you : config.uiText.guide}
                          </div>
                          <div className="text-sm">
                            {entry.text}
                          </div>
                          <div className="text-xs opacity-50 mt-1">
                            {entry.timestamp.toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Text Input (Backup Communication) */}
            {isConnected && (
              <>
                <Separator />
                
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">
                    {t("O escribe un mensaje", "Or type a message")}
                  </h4>
                  
                  <div className="flex gap-2">
                    <Input
                      value={textMessage}
                      onChange={(e) => setTextMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={t(
                        "Escribe tu mensaje aquí...",
                        "Type your message here..."
                      )}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleSendText}
                      disabled={!textMessage.trim()}
                      className="gap-2"
                    >
                      <Send className="h-4 w-4" />
                      {t("Enviar", "Send")}
                    </Button>
                  </div>
                </div>
              </>
            )}

            {/* Disconnect Control */}
            {isConnected && (
              <div className="text-center pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={disconnect}
                  className="gap-2"
                >
                  <MicOff className="h-4 w-4" />
                  {t("Terminar Conversación", "End Conversation")}
                </Button>
              </div>
            )}
            
          </Card>

          {/* Help Section */}
          <Card className="p-6 bg-blue-50 border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">
              {t("¿Cómo funciona?", "How does it work?")}
            </h3>
            <div className="space-y-2 text-blue-800">
              <p>
                {t(
                  "1. Haz clic en 'Conectar con mi Guía' para empezar",
                  "1. Click 'Connect to My Guide' to start"
                )}
              </p>
              <p>
                {t(
                  "2. Permite el acceso al micrófono cuando te lo pida el navegador",
                  "2. Allow microphone access when prompted by your browser"
                )}
              </p>
              <p>
                {t(
                  "3. Tu guía se presentará y te hará una pregunta",
                  "3. Your guide will introduce themselves and ask you a question"
                )}
              </p>
              <p>
                {t(
                  "4. Habla naturalmente o usa el cuadro de texto como alternativa",
                  "4. Speak naturally or use the text box as an alternative"
                )}
              </p>
            </div>
          </Card>
          
        </div>
      </main>
      
      <Footer />
    </div>
  );
}