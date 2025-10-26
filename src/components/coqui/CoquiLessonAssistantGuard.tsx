import { useAuth } from "@/contexts/AuthContext";
import { CoquiLessonAssistant } from "./CoquiLessonAssistant";
import type { VoiceContextConfig } from "@/hooks/useCoquiSession";

interface GuardProps {
  activityId: string;
  activityType: "lesson" | "exercise";
  voiceContext?: VoiceContextConfig;
  position?: "fixed" | "inline";
  className?: string;
  autoConnect?: boolean;
  isConnecting?: boolean;
}

export const CoquiLessonAssistantGuard = (props: GuardProps) => {
  const { user, loading } = useAuth();
  
  // Never render the assistant until auth resolves AND a user exists
  if (loading || !user) return null;
  
  return (
    <CoquiLessonAssistant
      {...props}
      autoConnect={props.autoConnect ?? true}
    />
  );
};
