import { useAuth } from "@/contexts/AuthContext";
import { CoquiLessonAssistant } from "./CoquiLessonAssistant";
import type { VoiceContextConfig } from "@/hooks/useCoquiSession";

interface GuardProps {
  activityId: string;
  activityType: "lesson" | "exercise" | "system";
  voiceContext?: VoiceContextConfig;
  position?: "fixed" | "inline";
  className?: string;
  autoConnect?: boolean;
  isConnecting?: boolean;
}

export const CoquiLessonAssistantGuard = ({ autoConnect = true, ...rest }: GuardProps) => {
  const { user, loading } = useAuth();
  const { activityType } = rest;
  
  // For system-level assistant (dashboard), always render the mascot UI
  if (activityType !== 'system') {
    // In lessons/exercises, wait for auth to resolve and a user to exist
    if (loading || !user) return null;
  }
  
  return <CoquiLessonAssistant autoConnect={autoConnect} {...rest} />;
};
