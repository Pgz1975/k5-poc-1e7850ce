import { supabase } from "@/integrations/supabase/client";

export const demoUsers = [
  // Grade-specific student accounts
  { 
    email: "kindergarten@demo.com", 
    password: "demo123", 
    fullName: "Demo Kindergarten Student", 
    role: "student_kindergarten" as const,
    avatar: "/avatars/student-1.jpg"
  },
  { 
    email: "student1@demo.com", 
    password: "demo123", 
    fullName: "Demo 1st Grade Student", 
    role: "student_1" as const,
    avatar: "/avatars/student-2.jpg"
  },
  { 
    email: "student2@demo.com", 
    password: "demo123", 
    fullName: "Demo 2nd Grade Student", 
    role: "student_2" as const,
    avatar: "/avatars/student-3.jpg"
  },
  { 
    email: "student3@demo.com", 
    password: "demo123", 
    fullName: "Demo 3rd Grade Student", 
    role: "student_3" as const,
    avatar: "/avatars/student-4.jpg"
  },
  { 
    email: "student4@demo.com", 
    password: "demo123", 
    fullName: "Demo 4th Grade Student", 
    role: "student_4" as const,
    avatar: "/avatars/student-1.jpg"
  },
  { 
    email: "student5@demo.com", 
    password: "demo123", 
    fullName: "Demo 5th Grade Student", 
    role: "student_5" as const,
    avatar: "/avatars/student-2.jpg"
  },
  // Teacher accounts
  { 
    email: "teacher-english@demo.com", 
    password: "demo123", 
    fullName: "Demo English Teacher", 
    role: "teacher_english" as const,
    avatar: "/avatars/teacher-1.jpg"
  },
  { 
    email: "teacher-spanish@demo.com", 
    password: "demo123", 
    fullName: "Demo Spanish Teacher", 
    role: "teacher_spanish" as const,
    avatar: "/avatars/teacher-2.jpg"
  },
  // Family account
  { 
    email: "family@demo.com", 
    password: "demo123", 
    fullName: "Demo Family", 
    role: "family" as const,
    avatar: "/avatars/family-2.jpg"
  },
  // Administrative accounts
  { 
    email: "school-director@demo.com", 
    password: "demo123", 
    fullName: "Demo School Director", 
    role: "school_director" as const,
    avatar: "/avatars/teacher-3.jpg"
  },
  { 
    email: "regional-director@demo.com", 
    password: "demo123", 
    fullName: "Demo Regional Director", 
    role: "regional_director" as const,
    avatar: "/avatars/teacher-1.jpg"
  },
  { 
    email: "spanish-admin@demo.com", 
    password: "demo123", 
    fullName: "Demo Spanish Program Admin", 
    role: "spanish_program_admin" as const,
    avatar: "/avatars/teacher-2.jpg"
  },
  { 
    email: "english-admin@demo.com", 
    password: "demo123", 
    fullName: "Demo English Program Admin", 
    role: "english_program_admin" as const,
    avatar: "/avatars/teacher-3.jpg"
  },
  { 
    email: "depr-executive@demo.com", 
    password: "demo123", 
    fullName: "Demo DEPR Executive", 
    role: "depr_executive" as const,
    avatar: "/avatars/teacher-1.jpg"
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
            [{ user_id: data.user.id, role: user.role }],
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
