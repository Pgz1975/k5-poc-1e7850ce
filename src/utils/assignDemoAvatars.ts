import { supabase } from "@/integrations/supabase/client";
import { getRandomAvatarForRole, type UserRole } from "./avatars";

/**
 * Assigns random avatars to demo users based on their role
 * This is useful for updating existing profiles that don't have avatars
 */
export const assignDemoAvatars = async () => {
  try {
    // Get all profiles
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id");

    if (profilesError) {
      console.error("Error fetching profiles:", profilesError);
      return { success: false, error: profilesError };
    }

    if (!profiles || profiles.length === 0) {
      console.log("No profiles found");
      return { success: true, message: "No profiles to update" };
    }

    // For each profile, get their role and assign an avatar
    for (const profile of profiles) {
      const { data: roleData, error: roleError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", profile.id)
        .single();

      if (roleError || !roleData) {
        console.warn(`No role found for user ${profile.id}`);
        continue;
      }

      const role = roleData.role as UserRole;
      const avatarUrl = getRandomAvatarForRole(role);

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: avatarUrl })
        .eq("id", profile.id);

      if (updateError) {
        console.error(`Failed to update avatar for ${profile.id}:`, updateError);
      } else {
        console.log(`Assigned ${role} avatar to profile ${profile.id}`);
      }
    }

    return { success: true, message: "Avatars assigned successfully" };
  } catch (error) {
    console.error("Error assigning avatars:", error);
    return { success: false, error };
  }
};
