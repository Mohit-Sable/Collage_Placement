import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

type AppRole = "student" | "placement_head" | "company";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  role: AppRole | null;
  loading: boolean;
  signUp: (email: string, password: string, role: AppRole, profileData: any) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<AppRole | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUserRole = async (userId: string) => {
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .single();

    if (error) {
      console.error("Error fetching user role:", error);
      return null;
    }
    return data?.role as AppRole;
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          // Defer role fetch to avoid deadlock
          setTimeout(async () => {
            const userRole = await fetchUserRole(session.user.id);
            setRole(userRole);
            setLoading(false);
          }, 0);
        } else {
          setRole(null);
          setLoading(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        fetchUserRole(session.user.id).then((userRole) => {
          setRole(userRole);
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, userRole: AppRole, profileData: any) => {
    const redirectUrl = `${window.location.origin}/`;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
      },
    });

    if (error) return { error };

    if (data.user) {
      // Insert user role
      const { error: roleError } = await supabase
        .from("user_roles")
        .insert({ user_id: data.user.id, role: userRole });

      if (roleError) {
        console.error("Error inserting role:", roleError);
        return { error: roleError };
      }

      // Insert profile based on role
      let profileError = null;
      
      if (userRole === "student") {
        const { error } = await supabase
          .from("student_profiles")
          .insert({
            user_id: data.user.id,
            email,
            full_name: profileData.fullName,
            branch: profileData.branch,
            year_of_graduation: profileData.yearOfGraduation,
          });
        profileError = error;
      } else if (userRole === "company") {
        const { error } = await supabase
          .from("company_profiles")
          .insert({
            user_id: data.user.id,
            email,
            company_name: profileData.companyName,
            industry: profileData.industry,
          });
        profileError = error;
      } else if (userRole === "placement_head") {
        const { error } = await supabase
          .from("placement_head_profiles")
          .insert({
            user_id: data.user.id,
            email,
            full_name: profileData.fullName,
            department: profileData.department,
          });
        profileError = error;
      }

      if (profileError) {
        console.error("Error inserting profile:", profileError);
        return { error: profileError };
      }

      setRole(userRole);
    }

    return { error: null };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setRole(null);
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ user, session, role, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
