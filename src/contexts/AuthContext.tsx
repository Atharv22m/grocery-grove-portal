
import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { useUser, useAuth as useClerkAuth, useSession } from "@clerk/clerk-react";

interface AuthContextProps {
  user: any;
  isLoading: boolean;
  isSignedIn: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  isLoading: true,
  isSignedIn: false,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerkAuth();
  const { session } = useSession();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  
  useEffect(() => {
    // Update authentication state when user or session changes
    setIsAuthenticated(!!user && !!session);
  }, [user, session]);
  
  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading: !isLoaded,
        isSignedIn: isAuthenticated,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
