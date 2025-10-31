import type { Language, LanguageConfig } from './types';

export const languageConfigs: Record<Language, LanguageConfig> = {
  es: {
    voice: 'ash',
    greetingMessage: '¡Hola! Soy tu guía de aprendizaje. Estoy aquí para ayudarte a navegar nuestra plataforma y hacer que aprender sea divertido. ¿Cómo te sientes sobre empezar las actividades de hoy?',
    uiText: {
      connecting: 'Conectando con tu guía...',
      connected: '¡Conectado! Tu guía está lista para ayudarte',
      disconnected: 'Desconectado',
      reconnecting: 'Reconectando...',
      mute: 'Silenciar',
      unmute: 'Activar sonido',
      retry: 'Intentar de nuevo',
      speakNow: 'Puedes hablar ahora',
      listening: 'Te estoy escuchando...',
      you: 'Tú',
      guide: 'Guía'
    },
    errorMessages: {
      microphoneError: 'Necesitamos acceso al micrófono para poder hablar contigo. ¿Me puedes ayudar activándolo?',
      connectionError: 'No pudimos conectar con tu guía. ¿Intentamos de nuevo?',
      networkError: 'Parece que hay un problema con el internet. ¿Podemos intentar de nuevo en un momentito?',
      tokenError: 'Hubo un problema preparando tu sesión. ¿Intentamos de nuevo?',
      sessionExpired: 'Nuestra conversación se terminó, pero podemos empezar una nueva cuando quieras.'
    }
  },
  en: {
    voice: 'ash',
    greetingMessage: 'Hello! I\'m your learning guide. I\'m here to help you navigate our platform and make learning fun! How are you feeling about starting today\'s activities?',
    uiText: {
      connecting: 'Connecting to your guide...',
      connected: 'Connected! Your guide is ready to help',
      disconnected: 'Disconnected',
      reconnecting: 'Reconnecting...',
      mute: 'Mute',
      unmute: 'Unmute',
      retry: 'Try Again',
      speakNow: 'You can speak now',
      listening: 'I\'m listening...',
      you: 'You',
      guide: 'Guide'
    },
    errorMessages: {
      microphoneError: 'We need microphone access to talk with you. Can you help me turn it on?',
      connectionError: 'Couldn\'t connect to your guide. Should we try again?',
      networkError: 'Looks like there\'s an internet connection issue. Can we try again in a moment?',
      tokenError: 'There was a problem setting up your session. Should we try again?',
      sessionExpired: 'Our conversation has ended, but we can start a new one whenever you\'re ready.'
    }
  }
};

export const getLanguageConfig = (language: Language): LanguageConfig => {
  return languageConfigs[language];
};

export const getInitialGreeting = (language: Language): string => {
  return languageConfigs[language].greetingMessage;
};

export const getUIText = (language: Language, key: keyof LanguageConfig['uiText']): string => {
  return languageConfigs[language].uiText[key];
};

export const getErrorMessage = (language: Language, key: keyof LanguageConfig['errorMessages']): string => {
  return languageConfigs[language].errorMessages[key];
};

export const getVoiceForLanguage = (language: Language): string => {
  return languageConfigs[language].voice;
};