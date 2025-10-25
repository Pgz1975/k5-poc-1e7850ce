import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import CoquiMascot from "@/components/CoquiMascot";
import { Mic, Globe } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

interface MicrophonePermissionModalProps {
  isOpen: boolean;
  onPermissionGranted: () => void;
  onPermissionDenied: () => void;
}

export const MicrophonePermissionModal = ({
  isOpen,
  onPermissionGranted,
  onPermissionDenied,
}: MicrophonePermissionModalProps) => {
  const { language: contextLanguage } = useLanguage();
  const [language, setLanguage] = useState<'es' | 'en'>(contextLanguage === 'es' ? 'es' : 'en');
  const [isRequesting, setIsRequesting] = useState(false);

  const content = {
    es: {
      title: "¡Bienvenido a LecturaPR!",
      message: "Para poder ayudarte con tus lecciones y prácticas de lectura, necesito acceso a tu micrófono.",
      features: [
        "🗣️ Practicar pronunciación",
        "💬 Conversar conmigo durante las lecciones",
        "📊 Recibir retroalimentación personalizada"
      ],
      required: "El micrófono es requerido para usar la plataforma",
      allow: "Permitir Micrófono",
      deny: "Ahora No",
      requesting: "Solicitando permiso...",
      success: "¡Perfecto! Ya podemos empezar",
      error: "No se pudo acceder al micrófono. Por favor, verifica los permisos de tu navegador."
    },
    en: {
      title: "Welcome to LecturaPR!",
      message: "To help you with your lessons and reading practice, I need access to your microphone.",
      features: [
        "🗣️ Practice pronunciation",
        "💬 Talk with me during lessons",
        "📊 Receive personalized feedback"
      ],
      required: "Microphone is required to use the platform",
      allow: "Allow Microphone",
      deny: "Not Now",
      requesting: "Requesting permission...",
      success: "Perfect! We can start now",
      error: "Could not access microphone. Please check your browser permissions."
    }
  };

  const t = content[language];

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'es' ? 'en' : 'es');
  };

  const requestMicrophonePermission = async () => {
    setIsRequesting(true);
    try {
      // Request browser permission
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Stop the tracks immediately - we just needed permission
      stream.getTracks().forEach(track => track.stop());
      
      toast.success(t.success, {
        icon: '🐸'
      });

      // Close modal immediately - welcome will be spoken by WelcomeSpeaker
      onPermissionGranted();
      
    } catch (error) {
      console.error('Microphone permission error:', error);
      toast.error(t.error, {
        duration: 5000
      });
      onPermissionDenied();
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onPermissionDenied()}>
      <DialogContent className="sm:max-w-md">
        <DialogTitle className="sr-only">{t.title}</DialogTitle>
        <DialogDescription className="sr-only">{t.message}</DialogDescription>
        <div className="flex flex-col items-center space-y-4 py-4">
          {/* Language Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className="absolute top-4 right-12 gap-2"
          >
            <Globe className="h-4 w-4" />
            {language === 'es' ? 'EN' : 'ES'}
          </Button>

          {/* Coquí Mascot */}
          <div className="relative">
            <CoquiMascot 
              state="happy"
              size="medium"
              position="inline"
              className="animate-bounce-gentle"
            />
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-center text-primary">
            {t.title}
          </h2>

          {/* Message */}
          <p className="text-center text-muted-foreground px-4">
            {t.message}
          </p>

          {/* Features List */}
          <div className="w-full bg-primary/5 rounded-lg p-4 space-y-2">
            {t.features.map((feature, idx) => (
              <p key={idx} className="text-sm">
                {feature}
              </p>
            ))}
          </div>

          {/* Required Notice */}
          <div className="flex items-center gap-2 text-sm text-primary font-medium">
            <Mic className="h-4 w-4" />
            {t.required}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 w-full pt-2">
            <Button
              onClick={requestMicrophonePermission}
              disabled={isRequesting}
              className="w-full gap-2 bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary"
              size="lg"
            >
              {isRequesting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                  {t.requesting}
                </>
              ) : (
                <>
                  <Mic className="h-5 w-5" />
                  {t.allow}
                </>
              )}
            </Button>

            <Button
              onClick={onPermissionDenied}
              variant="ghost"
              disabled={isRequesting}
              className="w-full"
            >
              {t.deny}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
