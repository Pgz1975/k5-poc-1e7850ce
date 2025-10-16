import { supabase } from "@/integrations/supabase/client";

/**
 * Updates the avatar for a specific user by their email
 * Note: This requires the user to be authenticated
 */
export const updateUserAvatar = async (userEmail: string, avatarUrl: string) => {
  try {
    // First get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user || user.email !== userEmail) {
      console.error("User not authenticated or email doesn't match");
      return { success: false, error: "User not authenticated" };
    }

    // Update the profile avatar
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ avatar_url: avatarUrl })
      .eq("id", user.id);

    if (updateError) {
      console.error("Error updating avatar:", updateError);
      return { success: false, error: updateError.message };
    }

    console.log(`Successfully updated avatar for ${userEmail}`);
    return { success: true };
  } catch (error) {
    console.error("Error:", error);
    return { success: false, error: String(error) };
  }
};
