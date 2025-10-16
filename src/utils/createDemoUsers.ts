import { supabase } from "@/integrations/supabase/client";

export const demoUsers = [
  { 
    email: "student@demo.com", 
    password: "demo123", 
    fullName: "Demo Student", 
    role: "student" as const,
    avatar: "/avatars/student-2.jpg"
  },
  { 
    email: "teacher@demo.com", 
    password: "demo123", 
    fullName: "Demo Teacher", 
    role: "teacher" as const,
    avatar: "/avatars/teacher-2.jpg"
  },
  { 
    email: "family@demo.com", 
    password: "demo123", 
    fullName: "Demo Family", 
    role: "family" as const,
    avatar: "/avatars/family-2.jpg"
  },
];

export const createDemoUsers = async () => {
  const results = [];
  
  for (const user of demoUsers) {
    try {
      // Try to sign up
      const { data, error } = await supabase.auth.signUp({
        email: user.email,
        password: user.password,
        options: {
          data: {
            full_name: user.fullName,
          },
        },
      });

      if (error && !error.message.includes("already registered")) {
        console.error(`Failed to create ${user.email}:`, error);
        results.push({ email: user.email, success: false, error: error.message });
        continue;
      }

      // If user was created or already exists, ensure role is set
      if (data.user) {
        const { error: roleError } = await supabase
          .from("user_roles")
          .upsert(
            { user_id: data.user.id, role: user.role },
            { onConflict: "user_id,role", ignoreDuplicates: true }
          );

        if (roleError) {
          console.error(`Failed to set role for ${user.email}:`, roleError);
        }

        // Assign the specific avatar for this demo user
        const { error: profileError } = await supabase
          .from("profiles")
          .update({ avatar_url: user.avatar })
          .eq("id", data.user.id);

        if (profileError) {
          console.error(`Failed to set avatar for ${user.email}:`, profileError);
        }
      }

      results.push({ email: user.email, success: true });
    } catch (err) {
      console.error(`Error creating ${user.email}:`, err);
      results.push({ email: user.email, success: false, error: String(err) });
    }
  }

  return results;
};
