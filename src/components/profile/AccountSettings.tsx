
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, Bell } from "lucide-react";
import { ProfileService, ExtendedProfile } from "@/services/ProfileService";

interface AccountSettingsProps {
  userId: string;
  profile: ExtendedProfile | null;
  onProfileUpdated: () => void;
}

export const AccountSettings = ({ 
  userId,
  profile,
  onProfileUpdated 
}: AccountSettingsProps) => {
  const [isSaving, setIsSaving] = useState(false);
  
  const [settings, setSettings] = useState({
    notifications: true,
    marketing: false
  });
  
  const handleToggleChange = (field: 'notifications' | 'marketing') => {
    setSettings(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };
  
  const handleSaveSettings = async () => {
    try {
      setIsSaving(true);
      
      // Update account settings in profile
      await ProfileService.updateProfile({
        id: userId,
        metadata: {
          notifications: settings.notifications,
          marketing: settings.marketing
        }
      });
      
      // Refresh data
      onProfileUpdated();
    } catch (error) {
      console.error("Error saving settings:", error);
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="mr-2 h-5 w-5" />
            Notification Preferences
          </CardTitle>
          <CardDescription>
            Control how and when you receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="notifications">Enable notifications</Label>
              <p className="text-sm text-gray-500">
                Receive notifications about your orders, account and offers
              </p>
            </div>
            <Switch
              id="notifications"
              checked={settings.notifications}
              onCheckedChange={() => handleToggleChange('notifications')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="marketing">Marketing emails</Label>
              <p className="text-sm text-gray-500">
                Receive emails about promotions and new products
              </p>
            </div>
            <Switch
              id="marketing"
              checked={settings.marketing}
              onCheckedChange={() => handleToggleChange('marketing')}
            />
          </div>
          
          <Button 
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="w-full sm:w-auto"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Preferences"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
