import { supabase } from "@/integrations/supabase/client";
import { defaultAvatars } from "./avatars";

/**
 * Utility to update demo users with default avatars
 * Run this once to populate avatars for existing users
 */
export async function assignDemoAvatars() {
  try {
    // Fetch all profiles without avatars
    const { data: profiles, error } = await supabase
      .from("profiles")
      .select("id")
      .is("avatar_url", null);

    if (error) throw error;

    if (!profiles || profiles.length === 0) {
      console.log("No profiles need avatar assignment");
      return;
    }

    // Assign random avatars
    const updates = profiles.map((profile, index) => ({
      id: profile.id,
      avatar_url: defaultAvatars[index % defaultAvatars.length],
    }));

    // Update in batches
    for (const update of updates) {
      await supabase
        .from("profiles")
        .update({ avatar_url: update.avatar_url })
        .eq("id", update.id);
    }

    console.log(`Successfully assigned avatars to ${updates.length} profiles`);
  } catch (error) {
    console.error("Error assigning demo avatars:", error);
  }
}
