
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
import { Loader2, Bell, Mail, AlertTriangle } from "lucide-react";
import { RoleSelector } from "@/components/profile/RoleSelector";
import { ProfileService, ExtendedProfile } from "@/services/ProfileService";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useUserRole } from "@/contexts/UserRoleContext";
import { Permission } from "@/components/auth/Permission";

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
  const { userRole, refreshUserRole } = useUserRole();
  
  const [settings, setSettings] = useState({
    notifications: profile?.account_settings?.notifications ?? true,
    marketing: profile?.account_settings?.marketing ?? false,
    emailFrequency: profile?.preferences?.emailFrequency ?? "daily"
  });
  
  const [accountStatus, setAccountStatus] = useState<'active' | 'suspended' | 'inactive'>(
    (profile?.account_status as any) || 'active'
  );
  
  const handleToggleChange = (field: 'notifications' | 'marketing') => {
    setSettings(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };
  
  const handleEmailFrequencyChange = (value: string) => {
    setSettings(prev => ({
      ...prev,
      emailFrequency: value
    }));
  };
  
  const handleStatusChange = (value: 'active' | 'suspended' | 'inactive') => {
    setAccountStatus(value);
  };
  
  const handleSaveSettings = async () => {
    try {
      setIsSaving(true);
      
      // Update account settings
      await ProfileService.updateProfile({
        id: userId,
        account_settings: {
          notifications: settings.notifications,
          marketing: settings.marketing
        }
      });
      
      // Update preferences
      await ProfileService.updateUserPreferences(userId, {
        emailFrequency: settings.emailFrequency
      });
      
      // Refresh data
      onProfileUpdated();
      await refreshUserRole();
    } catch (error) {
      console.error("Error saving settings:", error);
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleSaveStatus = async () => {
    try {
      setIsSaving(true);
      await ProfileService.setAccountStatus(userId, accountStatus);
      onProfileUpdated();
    } catch (error) {
      console.error("Error saving account status:", error);
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
          
          <div className="space-y-3">
            <Label>Email frequency</Label>
            <RadioGroup 
              value={settings.emailFrequency} 
              onValueChange={handleEmailFrequencyChange}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="daily" id="daily" />
                <Label htmlFor="daily">Daily digest</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="weekly" id="weekly" />
                <Label htmlFor="weekly">Weekly summary</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="important" id="important" />
                <Label htmlFor="important">Important updates only</Label>
              </div>
            </RadioGroup>
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
      
      <Permission role="admin">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Mail className="mr-2 h-5 w-5" />
              User Role Management
            </CardTitle>
            <CardDescription>
              Manage this user's role and permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="role">User Role</Label>
                <RoleSelector 
                  userId={userId}
                  currentRoleId={profile?.role_id || undefined}
                  onRoleChange={() => onProfileUpdated()}
                />
                <p className="text-sm text-gray-500">
                  Current role: {userRole?.name || "No role assigned"}
                </p>
              </div>
              
              <div className="space-y-3">
                <Label>Account Status</Label>
                <RadioGroup 
                  value={accountStatus} 
                  onValueChange={handleStatusChange as any}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="active" id="active" />
                    <Label htmlFor="active">Active</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="suspended" id="suspended" />
                    <Label htmlFor="suspended">Suspended</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="inactive" id="inactive" />
                    <Label htmlFor="inactive">Inactive</Label>
                  </div>
                </RadioGroup>
              </div>
              
              {accountStatus !== 'active' && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md flex items-center text-yellow-700 text-sm mb-4">
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Changing account status will affect user's ability to log in and use the platform.
                </div>
              )}
              
              <Button 
                onClick={handleSaveStatus}
                disabled={isSaving}
                className="w-full sm:w-auto"
                variant={accountStatus !== 'active' ? "destructive" : "default"}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Update Status"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </Permission>
    </div>
  );
}
