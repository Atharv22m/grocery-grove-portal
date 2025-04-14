
import { useEffect, useState } from "react";
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectLabel, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useUserRole } from "@/contexts/UserRoleContext";

interface RoleSelectorProps {
  userId: string;
  currentRoleId?: string | null;
  onRoleChange?: (roleId: string) => void;
  disabled?: boolean;
}

export const RoleSelector = ({
  userId,
  currentRoleId,
  onRoleChange,
  disabled = false
}: RoleSelectorProps) => {
  const [loading, setLoading] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState<string | undefined>(
    currentRoleId || undefined
  );
  const { isAdmin } = useUserRole();
  
  // Simplified roles for now
  const roles = [
    { id: "1", name: "admin", description: "Administrator with full access" },
    { id: "2", name: "seller", description: "Can manage products and orders" },
    { id: "3", name: "customer", description: "Regular customer" },
  ];
  
  useEffect(() => {
    setSelectedRoleId(currentRoleId || undefined);
  }, [currentRoleId]);
  
  const handleRoleChange = async (roleId: string) => {
    setSelectedRoleId(roleId);
    
    if (onRoleChange) {
      onRoleChange(roleId);
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center space-x-2">
        <Loader2 className="h-4 w-4 animate-spin text-primary" />
        <span>Loading roles...</span>
      </div>
    );
  }
  
  return (
    <Select
      value={selectedRoleId}
      onValueChange={handleRoleChange}
      disabled={disabled || !isAdmin}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a role" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Available Roles</SelectLabel>
          {roles.map((role) => (
            <SelectItem key={role.id} value={role.id}>
              {role.name.charAt(0).toUpperCase() + role.name.slice(1)} 
              {role.description && ` - ${role.description}`}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
