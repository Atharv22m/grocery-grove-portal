
import { ReactNode } from "react";
import { useUserRole } from "@/contexts/UserRoleContext";
import { Skeleton } from "@/components/ui/skeleton";

type PermissionProps = {
  /**
   * The permission required to view the children
   */
  permission?: string;
  /**
   * The role required to view the children
   */
  role?: "admin" | "seller" | "customer";
  /**
   * Whether any role is required to view the children
   */
  requireAuth?: boolean;
  /**
   * Content to display if the user has permission
   */
  children: ReactNode;
  /**
   * Content to display if the user does not have permission
   */
  fallback?: ReactNode;
  /**
   * Whether to show a loading skeleton when checking permissions
   */
  showLoading?: boolean;
};

/**
 * A component that conditionally renders content based on user permissions
 */
export const Permission = ({
  permission,
  role,
  requireAuth = false,
  children,
  fallback = null,
  showLoading = true,
}: PermissionProps) => {
  const { hasPermission, isAdmin, isSeller, isCustomer, loading, userRole } = useUserRole();
  
  // Show loading state if checking permissions
  if (loading && showLoading) {
    return (
      <div className="animate-pulse">
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }
  
  // Check if user has the required role
  if (role) {
    if ((role === "admin" && !isAdmin) ||
        (role === "seller" && !isSeller) ||
        (role === "customer" && !isCustomer)) {
      return <>{fallback}</>;
    }
  }
  
  // Check if the user needs to be authenticated
  if (requireAuth && !userRole) {
    return <>{fallback}</>;
  }
  
  // Check if the user has the required permission
  if (permission && !hasPermission(permission)) {
    return <>{fallback}</>;
  }
  
  // User has all required permissions
  return <>{children}</>;
};
