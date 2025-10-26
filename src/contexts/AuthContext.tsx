import React, { createContext, useContext, useState, useEffect } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

type UserRole = "student" | "student_kindergarten" | "student_1" | "student_2" | "student_3" | "student_4" | "student_5" | 
  "family" | "teacher_english" | "teacher_spanish" | "school_director" | "regional_director" | 
  "spanish_program_admin" | "english_program_admin" | "depr_executive";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signUp: (email: string, password: string, fullName: string, role: UserRole) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  loading: boolean;
  micPermissionRequested: boolean;
  setMicPermissionRequested: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [micPermissionRequested, setMicPermissionRequested] = useState(
    () => localStorage.getItem('mic-permission-requested') === 'true'
  );
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // Handle token refresh errors
        if (event === 'TOKEN_REFRESHED') {
          console.log('[Auth] Token refreshed successfully');
        }
        
        if (event === 'SIGNED_OUT') {
          console.log('[Auth] User signed out');
          // Clear any stale data
          localStorage.removeItem('supabase.auth.token');
        }

        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // THEN check for existing session with error handling
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('[Auth] Session error:', error.message);
        // Clear stale tokens on error
        if (error.message.includes('refresh') || error.message.includes('token')) {
          console.log('[Auth] Clearing stale session');
          supabase.auth.signOut();
        }
      }
      
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    }).catch((err) => {
      console.error('[Auth] Fatal session error:', err);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName: string, role: UserRole) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
        emailRedirectTo: `${window.location.origin}/`,
      },
    });

    if (!error && data.user) {
      // Insert user role - using insert with array syntax to match DB schema
      const { error: roleError } = await supabase
        .from("user_roles")
        .insert([{ user_id: data.user.id, role }]);

      if (roleError) {
        console.error("Error inserting user role:", roleError);
        return { error: roleError };
      }
    }

    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signOut = async () => {
    try {
      // Attempt server-side sign out (may return error without throwing)
      const { error } = await supabase.auth.signOut({ scope: 'global' as any });
      if (error) {
        console.warn('[Auth] signOut error (non-fatal):', error.message);
      }
    } catch (error: any) {
      console.warn('[Auth] signOut threw error (non-fatal):', error?.message || error);
    } finally {
      // Always clear local session to avoid being stuck
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('sb-') || key === 'supabase.auth.token')) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((key) => localStorage.removeItem(key));

      // Reset state and navigate
      setSession(null);
      setUser(null);
      navigate("/auth");
    }
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    return { error };
  };

  const handleSetMicPermissionRequested = (value: boolean) => {
    setMicPermissionRequested(value);
    localStorage.setItem('mic-permission-requested', value.toString());
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      signUp, 
      signIn, 
      signOut, 
      resetPassword, 
      loading,
      micPermissionRequested,
      setMicPermissionRequested: handleSetMicPermissionRequested
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
