import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface DemoUser {
  email: string;
  password: string;
  full_name: string;
  role: string;
  grade_level?: number;
  language_specialization?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Security: Require a specific secret key for this sensitive operation
    const authHeader = req.headers.get("x-setup-key");
    if (authHeader !== "demo-setup-2025") {
      return new Response(
        JSON.stringify({ error: "Unauthorized - invalid setup key" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
      );
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    const demoUsers: DemoUser[] = [
      {
        email: "teacher@login.com",
        password: "demo1234",
        full_name: "Demo Teacher First Grade",
        role: "teacher_english",
        language_specialization: "en",
      },
      {
        email: "student1@login.com",
        password: "demo1234",
        full_name: "Demo Student First Grade",
        role: "student_1",
        grade_level: 1,
      },
      {
        email: "family@login.com",
        password: "demo1234",
        full_name: "Demo Parent First Grade",
        role: "family",
      },
      {
        email: "school-director@login.com",
        password: "demo1234",
        full_name: "Demo School Director",
        role: "school_director",
      },
      {
        email: "regional-director@login.com",
        password: "demo1234",
        full_name: "Demo Regional Director",
        role: "regional_director",
      },
      {
        email: "depr-executive@login.com",
        password: "demo1234",
        full_name: "Demo DEPR Administrator",
        role: "depr_executive",
      },
    ];

    const results = [];

    for (const user of demoUsers) {
      console.log(`Creating user: ${user.email}`);

      // Check if user already exists
      const { data: existingUser } = await supabaseAdmin.auth.admin.listUsers();
      const userExists = existingUser?.users.some(u => u.email === user.email);

      let userId: string;

      if (userExists) {
        console.log(`User ${user.email} already exists, skipping creation`);
        const existing = existingUser?.users.find(u => u.email === user.email);
        userId = existing!.id;
        results.push({
          email: user.email,
          status: "already_exists",
          userId,
        });
      } else {
        // Create auth user
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
          email: user.email,
          password: user.password,
          email_confirm: true,
          user_metadata: {
            full_name: user.full_name,
          },
        });

        if (authError) {
          console.error(`Error creating user ${user.email}:`, authError);
          results.push({
            email: user.email,
            status: "error",
            error: authError.message,
          });
          continue;
        }

        userId = authData.user.id;
        console.log(`Created user ${user.email} with ID: ${userId}`);

        // Create profile
        const { error: profileError } = await supabaseAdmin
          .from("profiles")
          .insert({
            id: userId,
            full_name: user.full_name,
            grade_level: user.grade_level,
            language_specialization: user.language_specialization,
          });

        if (profileError) {
          console.error(`Error creating profile for ${user.email}:`, profileError);
        }

        // Create role
        const { error: roleError } = await supabaseAdmin
          .from("user_roles")
          .insert({
            user_id: userId,
            role: user.role,
          });

        if (roleError) {
          console.error(`Error creating role for ${user.email}:`, roleError);
        }

        results.push({
          email: user.email,
          status: "created",
          userId,
          role: user.role,
        });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Demo users setup completed",
        results,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in setup-demo-users:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
