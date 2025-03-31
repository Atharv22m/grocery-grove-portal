
import { useState } from "react";
import { UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ProfileAvatarProps {
  userId: string;
  avatarUrl: string | null;
  fullName: string | null;
  onAvatarUpdate?: (url: string) => void;
  size?: "sm" | "md" | "lg";
}

export const ProfileAvatar = ({
  userId,
  avatarUrl,
  fullName,
  onAvatarUpdate,
  size = "md"
}: ProfileAvatarProps) => {
  const [isUploading, setIsUploading] = useState(false);
  
  // Calculate dimensions based on size
  const dimensions = {
    sm: { container: "h-16 w-16", icon: "h-8 w-8" },
    md: { container: "h-24 w-24", icon: "h-12 w-12" },
    lg: { container: "h-32 w-32", icon: "h-16 w-16" }
  }[size];

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;
      
      // Validate file type and size
      if (!file.type.startsWith('image/')) {
        toast.error("Please select an image file");
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image must be smaller than 5MB");
        return;
      }
      
      setIsUploading(true);
      
      // Upload file to Supabase storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      
      const { error: uploadError, data } = await supabase.storage
        .from('avatars')
        .upload(fileName, file);
        
      if (uploadError) {
        throw uploadError;
      }
      
      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);
        
      // Update the user's profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', userId);
        
      if (updateError) {
        throw updateError;
      }
      
      if (onAvatarUpdate) {
        onAvatarUpdate(publicUrl);
      }
      
      toast.success("Profile picture updated");
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      toast.error(error.message || "Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="relative">
      <div className={`${dimensions.container} rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-2 border-primary`}>
        {isUploading ? (
          <div className="animate-pulse bg-gray-300 h-full w-full"></div>
        ) : avatarUrl ? (
          <img 
            src={avatarUrl} 
            alt={fullName || "User"} 
            className="h-full w-full object-cover"
          />
        ) : (
          <UserRound className={`${dimensions.icon} text-gray-400`} />
        )}
      </div>
      
      <label htmlFor="avatar-upload">
        <Button 
          size="sm" 
          className="absolute bottom-0 right-0 rounded-full h-8 w-8 p-0"
          aria-label="Change profile picture"
          disabled={isUploading}
        >
          +
        </Button>
      </label>
      
      <input 
        type="file" 
        id="avatar-upload"
        className="sr-only" 
        accept="image/*"
        onChange={handleFileChange}
        disabled={isUploading}
      />
    </div>
  );
};
