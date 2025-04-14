
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ProfileService, UserRole } from "@/services/ProfileService";

interface UserRoleContextProps {
  userRole: UserRole | null;
  isAdmin: boolean;
  isSeller: boolean;
  isCustomer: boolean;
  permissions: Record<string, boolean>;
  hasPermission: (permission: string) => boolean;
  refreshUserRole: () => Promise<void>;
  setUserRole: (roleId: string) => Promise<boolean>;
  loading: boolean;
}

const UserRoleContext = createContext<UserRoleContextProps>({
  userRole: null,
  isAdmin: false,
  isSeller: false,
  isCustomer: false,
  permissions: {},
  hasPermission: () => false,
  refreshUserRole: async () => {},
  setUserRole: async () => false,
  loading: true,
});

export const useUserRole = () => useContext(UserRoleContext);

export const UserRoleProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRoleState] = useState<UserRole | null>(null);
  const [permissions, setPermissions] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  // Check if user has a specific permission
  const hasPermission = (permission: string) => {
    return !!permissions[permission];
  };

  // Derived role checks
  const isAdmin = userRole?.name === 'admin';
  const isSeller = userRole?.name === 'seller';
  const isCustomer = userRole?.name === 'customer' || (!isAdmin && !isSeller);

  // Fetch user role data
  const fetchUserRoleData = async (userId: string) => {
    try {
      setLoading(true);
      
      // Get user role
      const roleData = await ProfileService.getUserRole(userId);
      setUserRoleState(roleData);
      
      // Get user permissions
      const permissionsData = await ProfileService.getUserPermissions(userId);
      setPermissions(permissionsData || {});
    } catch (error) {
      console.error("Error fetching user role data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Refresh user role data
  const refreshUserRole = async () => {
    if (user?.id) {
      await fetchUserRoleData(user.id);
    }
  };

  // Set user role
  const updateUserRole = async (roleId: string): Promise<boolean> => {
    if (!user?.id) return false;
    
    const success = await ProfileService.setUserRole(user.id, roleId);
    if (success) {
      await refreshUserRole();
    }
    return success;
  };

  // Listen for auth changes
  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      
      if (data.user) {
        await fetchUserRoleData(data.user.id);
      } else {
        setUserRoleState(null);
        setPermissions({});
      }
    };

    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user || null);
        
        if (session?.user) {
          await fetchUserRoleData(session.user.id);
        } else {
          setUserRoleState(null);
          setPermissions({});
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <UserRoleContext.Provider
      value={{
        userRole,
        isAdmin,
        isSeller,
        isCustomer,
        permissions,
        hasPermission,
        refreshUserRole,
        setUserRole: updateUserRole,
        loading,
      }}
    >
      {children}
    </UserRoleContext.Provider>
  );
};
