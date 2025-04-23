
import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { User, Session } from '@supabase/supabase-js';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AuthContextProps {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isSignedIn: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  session: null,
  isLoading: true,
  isSignedIn: false,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
  
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state changed:", event);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setIsSignedIn(!!currentSession?.user);
        
        if (event === 'SIGNED_IN') {
          toast.success("Signed in successfully!");
        } else if (event === 'SIGNED_OUT') {
          toast.info("Signed out");
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log("Current session:", currentSession ? "exists" : "none");
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setIsSignedIn(!!currentSession?.user);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  const signOut = async () => {
    await supabase.auth.signOut();
  };
  
  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        isSignedIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
