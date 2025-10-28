import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type DemoVoiceSessionUpdate =
  Database["public"]["Tables"]["demo_voice_sessions"]["Update"];

type DemoInteractionInsert =
  Database["public"]["Tables"]["demo_interactions"]["Insert"];

export async function updateDemoSession(
  sessionId: string,
  payload: Partial<DemoVoiceSessionUpdate>,
) {
  return supabase
    .from("demo_voice_sessions")
    .update(payload)
    .eq("id", sessionId);
}

export async function logDemoInteraction(
  sessionId: string,
  interaction: Pick<DemoInteractionInsert, "interaction_type" | "transcript" | "metadata">,
) {
  const insertPayload: DemoInteractionInsert = {
    demo_session_id: sessionId,
    interaction_type: interaction.interaction_type,
    transcript: interaction.transcript ?? null,
    metadata: interaction.metadata ?? {},
  };

  return supabase
    .from("demo_interactions")
    .insert(insertPayload);
}
