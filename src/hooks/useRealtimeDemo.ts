import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  ExperimentalVoiceClient,
  type DemoConfig,
  type DemoType,
} from "@/utils/realtime/ExperimentalVoiceClient";

type DemoFeatures = DemoConfig["features"];

export interface UseRealtimeDemoConfig {
  demoActivityId: string;
  demoType: DemoType;
  studentId?: string;
  language?: "es-PR" | "en-US";
  voiceGuidance?: string;
  voice?: DemoConfig["voice"];
  edgeFunctionUrl?: string;
  features?: DemoFeatures;
  onWordTranscription?: DemoConfig["onWordTranscription"];
  onFunctionCall?: DemoConfig["onFunctionCall"];
  onAudioVisualization?: DemoConfig["onAudioVisualization"];
}

export function useRealtimeDemo(config: UseRealtimeDemoConfig) {
  const { user, session } = useAuth();
  const clientRef = useRef<ExperimentalVoiceClient | null>(null);
  const listenersRef = useRef<Array<() => void>>([]);

  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isAIPlaying, setIsAIPlaying] = useState(false);
  const [audioLevel, setAudioLevel] = useState(-100);
  const [frequencyData, setFrequencyData] = useState(() => new Uint8Array(128));
  const [error, setError] = useState<Error | null>(null);
  const [demoSessionId, setDemoSessionId] = useState<string | null>(null);

  const mergedConfig = useMemo<DemoConfig>(() => {
    if (!config.demoActivityId) {
      throw new Error("useRealtimeDemo requires demoActivityId");
    }

    return {
      demoActivityId: config.demoActivityId,
      demoType: config.demoType,
      features: config.features ?? {},
      studentId: config.studentId ?? user?.id ?? undefined,
      language: config.language ?? "es-PR",
      voiceGuidance: config.voiceGuidance,
      voice: config.voice ?? "alloy",
      edgeFunctionUrl: config.edgeFunctionUrl,
      apiKey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
      accessToken: session?.access_token,
      onWordTranscription: config.onWordTranscription,
      onFunctionCall: config.onFunctionCall,
      onAudioVisualization: (data) => {
        setFrequencyData(new Uint8Array(data));
        config.onAudioVisualization?.(data);
      },
    };
  }, [config, user?.id, session?.access_token]);

  const detachListeners = useCallback(() => {
    listenersRef.current.forEach((unsubscribe) => {
      try {
        unsubscribe();
      } catch (err) {
        console.warn("useRealtimeDemo listener cleanup failed", err);
      }
    });
    listenersRef.current = [];
  }, []);

  const endSession = useCallback(async () => {
    detachListeners();
    if (clientRef.current) {
      await clientRef.current.disconnect();
      clientRef.current = null;
    }
    setDemoSessionId(null);
    setIsConnected(false);
    setIsConnecting(false);
    setIsAIPlaying(false);
    setAudioLevel(-100);
    setFrequencyData(new Uint8Array(128));
  }, [detachListeners]);

  const startSession = useCallback(
    async (overrideActivityId?: string) => {
      const demoActivityId = overrideActivityId ?? mergedConfig.demoActivityId;
      if (!demoActivityId) {
        throw new Error("startSession requires demoActivityId");
      }

      await endSession();
      setError(null);
      setIsConnecting(true);

      const client = new ExperimentalVoiceClient({
        ...mergedConfig,
        demoActivityId,
      });

      listenersRef.current = [
        client.on("connected", () => {
          setIsConnected(true);
          setIsConnecting(false);
        }),
        client.on("disconnected", () => {
          setIsConnected(false);
          setIsAIPlaying(false);
          setIsConnecting(false);
        }),
        client.on("audio-level", (level) => {
          setAudioLevel(typeof level === "number" ? level : -100);
        }),
        client.on("audio-playback", (playing) => {
          setIsAIPlaying(!!playing);
        }),
        client.on("demo-session", (session) => {
          if (typeof session === "string") {
            setDemoSessionId(session);
          }
        }),
        client.on("error", (err) => {
          const nextError = err instanceof Error ? err : new Error(String(err));
          setError(nextError);
          setIsConnecting(false);
        }),
      ];

      clientRef.current = client;

      try {
        await client.connect();
      } catch (err) {
        await endSession();
        const connectionError = err instanceof Error ? err : new Error(String(err));
        setError(connectionError);
        setIsConnecting(false);
        throw connectionError;
      }
    },
    [mergedConfig, endSession],
  );

  useEffect(() => {
    return () => {
      endSession().catch(() => {});
    };
  }, [endSession]);

  return {
    client: clientRef.current,
    isConnected,
    isConnecting,
    isAIPlaying,
    audioLevel,
    frequencyData,
    error,
    demoSessionId,
    startSession,
    endSession,
  };
}
