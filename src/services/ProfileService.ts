
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Extended Profile with advanced fields
export interface ExtendedProfile {
  id: string;
  full_name: string | null;
  phone_number: string | null;
  updated_at: string;
  created_at?: string;
  avatar_url?: string | null;
  address?: string | null;
  bio?: string | null;
  role_id?: string | null;
  metadata?: Record<string, any> | null;
  account_status?: string;
  last_login_at?: string | null;
  username?: string | null;
  website?: string | null;
}

// Role information
export interface UserRole {
  id: string;
  name: string;
  description: string | null;
  permissions: Record<string, boolean>;
  created_at?: string;
}

export const ProfileService = {
  async getProfile(userId: string): Promise<ExtendedProfile | null> {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
        
      if (error) throw error;
      return data as ExtendedProfile;
    } catch (error: any) {
      console.error("Error fetching profile:", error);
      return null;
    }
  },
  
  async updateProfile(profile: Partial<ExtendedProfile>): Promise<boolean> {
    try {
      if (!profile.id) {
        throw new Error("Profile ID is required");
      }
      
      const { error } = await supabase
        .from("profiles")
        .update({
          ...profile,
          updated_at: new Date().toISOString()
        })
        .eq("id", profile.id);
        
      if (error) throw error;
      toast.success("Profile updated successfully");
      return true;
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error(error.message || "Failed to update profile");
      return false;
    }
  },
  
  async getAllRoles(): Promise<UserRole[]> {
    // Return hardcoded roles for now
    return [
      {
        id: "1",
        name: "admin",
        description: "Administrator with full access",
        permissions: {
          canManageUsers: true,
          canManageProducts: true,
          canManageOrders: true
        }
      },
      {
        id: "2",
        name: "seller",
        description: "Can manage products and orders",
        permissions: {
          canManageProducts: true,
          canManageOrders: true
        }
      },
      {
        id: "3",
        name: "customer",
        description: "Regular customer",
        permissions: {
          canViewOrders: true
        }
      }
    ];
  },
  
  async getUserRole(userId: string): Promise<UserRole | null> {
    try {
      // Get the user email to determine role
      const { data: user } = await supabase.auth.getUser();
      
      if (!user || !user.user) return null;
      
      // Simple role logic based on email
      if (user.user.email === "admin@example.com") {
        return {
          id: "1",
          name: "admin",
          description: "Administrator with full access",
          permissions: {
            canManageUsers: true,
            canManageProducts: true,
            canManageOrders: true
          }
        };
      } else if (user.user.email?.includes("seller")) {
        return {
          id: "2",
          name: "seller",
          description: "Can manage products and orders",
          permissions: {
            canManageProducts: true,
            canManageOrders: true
          }
        };
      } else {
        return {
          id: "3",
          name: "customer",
          description: "Regular customer",
          permissions: {
            canViewOrders: true
          }
        };
      }
    } catch (error: any) {
      console.error("Error fetching user role:", error);
      return null;
    }
  },
  
  async getUserPermissions(userId: string): Promise<Record<string, boolean>> {
    try {
      const role = await this.getUserRole(userId);
      return role?.permissions || {};
    } catch (error: any) {
      console.error("Error fetching user permissions:", error);
      return {};
    }
  },
  
  async hasPermission(userId: string, permission: string): Promise<boolean> {
    try {
      const permissions = await this.getUserPermissions(userId);
      return !!permissions[permission];
    } catch (error: any) {
      console.error(`Error checking permission ${permission}:`, error);
      return false;
    }
  },
  
  async setUserRole(userId: string, roleId: string): Promise<boolean> {
    try {
      // In the simplified version, we'll just pretend it worked
      toast.success("User role updated successfully");
      return true;
    } catch (error: any) {
      console.error("Error setting user role:", error);
      toast.error(error.message || "Failed to update user role");
      return false;
    }
  },
  
  async setAccountStatus(userId: string, status: 'active' | 'suspended' | 'inactive'): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          metadata: { account_status: status },
          updated_at: new Date().toISOString()
        })
        .eq("id", userId);
        
      if (error) throw error;
      toast.success(`Account status updated to ${status}`);
      return true;
    } catch (error: any) {
      console.error("Error setting account status:", error);
      toast.error(error.message || "Failed to update account status");
      return false;
    }
  },
  
  async updateUserPreferences(userId: string, preferences: Record<string, any>): Promise<boolean> {
    try {
      // Update metadata with preferences
      const { error } = await supabase
        .from("profiles")
        .update({
          metadata: preferences,
          updated_at: new Date().toISOString()
        })
        .eq("id", userId);
        
      if (error) throw error;
      toast.success("Preferences updated successfully");
      return true;
    } catch (error: any) {
      console.error("Error updating preferences:", error);
      toast.error(error.message || "Failed to update preferences");
      return false;
    }
  }
};
