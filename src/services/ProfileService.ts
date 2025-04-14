
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Extended Profile with advanced fields
export interface ExtendedProfile {
  id: string;
  full_name: string | null;
  phone_number: string | null;
  updated_at: string;
  created_at: string;
  avatar_url: string | null;
  address: string | null;
  bio: string | null;
  role_id: string | null;
  preferences: Record<string, any> | null;
  metadata: Record<string, any> | null;
  account_status: string;
  last_login_at: string | null;
  account_settings: Record<string, any> | null;
  username: string | null;
  website: string | null;
}

// Role information
export interface UserRole {
  id: string;
  name: string;
  description: string | null;
  permissions: Record<string, boolean>;
  created_at: string;
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
      return data as unknown as ExtendedProfile;
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
        } as any)
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
    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("*")
        .order("name");
        
      if (error) throw error;
      return data as UserRole[];
    } catch (error: any) {
      console.error("Error fetching roles:", error);
      return [];
    }
  },
  
  async getUserRole(userId: string): Promise<UserRole | null> {
    try {
      // First get the role_id from the profile
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role_id")
        .eq("id", userId)
        .single();
        
      if (profileError) throw profileError;
      
      if (!profile.role_id) return null;
      
      // Then get the role details
      const { data: role, error: roleError } = await supabase
        .from("user_roles")
        .select("*")
        .eq("id", profile.role_id)
        .single();
        
      if (roleError) throw roleError;
      
      return role as UserRole;
    } catch (error: any) {
      console.error("Error fetching user role:", error);
      return null;
    }
  },
  
  async getUserPermissions(userId: string): Promise<Record<string, boolean>> {
    try {
      const { data, error } = await supabase
        .rpc("get_user_permissions", { user_id: userId });
        
      if (error) throw error;
      return data as Record<string, boolean>;
    } catch (error: any) {
      console.error("Error fetching user permissions:", error);
      return {};
    }
  },
  
  async hasPermission(userId: string, permission: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .rpc("has_permission", { 
          user_id: userId,
          permission: permission
        });
        
      if (error) throw error;
      return !!data;
    } catch (error: any) {
      console.error(`Error checking permission ${permission}:`, error);
      return false;
    }
  },
  
  async setUserRole(userId: string, roleId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          role_id: roleId,
          updated_at: new Date().toISOString()
        })
        .eq("id", userId);
        
      if (error) throw error;
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
          account_status: status,
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
      // First get existing preferences
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("preferences")
        .eq("id", userId)
        .single();
        
      if (profileError) throw profileError;
      
      // Merge with existing preferences
      const updatedPreferences = {
        ...(profile.preferences || {}),
        ...preferences
      };
      
      // Update with merged preferences
      const { error } = await supabase
        .from("profiles")
        .update({
          preferences: updatedPreferences,
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
