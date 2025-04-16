
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface UserRole {
  id: string;
  name: string;
  description: string | null;
  permissions: Record<string, boolean>;
}

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
  const { user, isLoading } = useAuth();
  const [userRole, setUserRoleState] = useState<UserRole | null>(null);
  const [permissions, setPermissions] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  // Check if user has a specific permission
  const hasPermission = (permission: string) => {
    return !!permissions[permission];
  };

  // Hardcoded roles for this simplified version
  const isAdmin = user?.primaryEmailAddress?.emailAddress === "admin@example.com"; // Simple check for admin
  const isSeller = user?.primaryEmailAddress?.emailAddress?.includes("seller");    // Simple check for seller
  const isCustomer = user !== null && !isAdmin && !isSeller; // Everyone else is a customer

  // Simplified fetch user role data function
  const fetchUserRoleData = async (userId: string) => {
    try {
      setLoading(true);
      
      // For now, we'll use simplified role logic based on email
      if (isAdmin) {
        setUserRoleState({
          id: "1",
          name: "admin",
          description: "Administrator with full access",
          permissions: {
            canManageUsers: true,
            canManageProducts: true,
            canManageOrders: true
          }
        });
        setPermissions({
          canManageUsers: true,
          canManageProducts: true,
          canManageOrders: true
        });
      } else if (isSeller) {
        setUserRoleState({
          id: "2",
          name: "seller",
          description: "Can manage products and orders",
          permissions: {
            canManageProducts: true,
            canManageOrders: true
          }
        });
        setPermissions({
          canManageProducts: true,
          canManageOrders: true
        });
      } else {
        setUserRoleState({
          id: "3",
          name: "customer",
          description: "Regular customer",
          permissions: {
            canViewOrders: true
          }
        });
        setPermissions({
          canViewOrders: true
        });
      }
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
    
    // In this simplified version, we'll just refresh the role
    await refreshUserRole();
    return true;
  };

  // Listen for auth changes
  useEffect(() => {
    if (!isLoading) {
      if (user) {
        fetchUserRoleData(user.id);
      } else {
        setUserRoleState(null);
        setPermissions({});
        setLoading(false);
      }
    }
  }, [user, isLoading]);

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
