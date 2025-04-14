
-- Add roles table for role-based access control
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  permissions JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default roles
INSERT INTO user_roles (name, description, permissions)
VALUES 
  ('admin', 'Administrator with full access', '{"canManageUsers": true, "canManageProducts": true, "canManageOrders": true, "canAccessDashboard": true, "canManageSettings": true}'),
  ('seller', 'Seller can manage their own products', '{"canManageProducts": true, "canManageOrders": true, "canAccessDashboard": true}'),
  ('customer', 'Regular customer', '{"canViewOrders": true, "canPlaceOrders": true}')
ON CONFLICT (name) DO NOTHING;

-- Add more fields to the profiles table for advanced metadata
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS role_id UUID REFERENCES user_roles(id),
ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS account_status TEXT DEFAULT 'active',
ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS account_settings JSONB DEFAULT '{"notifications": true, "marketing": false}';

-- Create a map table for users with multiple roles (optional)
CREATE TABLE IF NOT EXISTS user_role_mappings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id UUID REFERENCES user_roles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (user_id, role_id)
);

-- Set up RLS policies for the new tables
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_role_mappings ENABLE ROW LEVEL SECURITY;

-- Policies for user_roles
CREATE POLICY "Public user_roles are viewable by everyone" 
ON user_roles FOR SELECT USING (true);

CREATE POLICY "Admins can insert user_roles" 
ON user_roles FOR INSERT 
WITH CHECK (
  auth.uid() IN (
    SELECT p.id FROM profiles p
    WHERE p.role_id IN (SELECT id FROM user_roles WHERE name = 'admin')
  )
);

CREATE POLICY "Admins can update user_roles" 
ON user_roles FOR UPDATE 
USING (
  auth.uid() IN (
    SELECT p.id FROM profiles p
    WHERE p.role_id IN (SELECT id FROM user_roles WHERE name = 'admin')
  )
);

CREATE POLICY "Admins can delete user_roles" 
ON user_roles FOR DELETE 
USING (
  auth.uid() IN (
    SELECT p.id FROM profiles p
    WHERE p.role_id IN (SELECT id FROM user_roles WHERE name = 'admin')
  )
);

-- Policies for user_role_mappings
CREATE POLICY "Users can view their own role mappings" 
ON user_role_mappings FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all role mappings" 
ON user_role_mappings FOR SELECT 
USING (
  auth.uid() IN (
    SELECT p.id FROM profiles p
    WHERE p.role_id IN (SELECT id FROM user_roles WHERE name = 'admin')
  )
);

CREATE POLICY "Admins can insert role mappings" 
ON user_role_mappings FOR INSERT 
WITH CHECK (
  auth.uid() IN (
    SELECT p.id FROM profiles p
    WHERE p.role_id IN (SELECT id FROM user_roles WHERE name = 'admin')
  )
);

CREATE POLICY "Admins can update role mappings" 
ON user_role_mappings FOR UPDATE 
USING (
  auth.uid() IN (
    SELECT p.id FROM profiles p
    WHERE p.role_id IN (SELECT id FROM user_roles WHERE name = 'admin')
  )
);

CREATE POLICY "Admins can delete role mappings" 
ON user_role_mappings FOR DELETE 
USING (
  auth.uid() IN (
    SELECT p.id FROM profiles p
    WHERE p.role_id IN (SELECT id FROM user_roles WHERE name = 'admin')
  )
);

-- Functions to help with role management
CREATE OR REPLACE FUNCTION get_user_permissions(user_id UUID) 
RETURNS JSONB 
LANGUAGE plpgsql SECURITY DEFINER 
AS $$
DECLARE
  result JSONB := '{}'::JSONB;
BEGIN
  -- Get permissions from primary role
  SELECT r.permissions INTO result
  FROM profiles p
  JOIN user_roles r ON p.role_id = r.id
  WHERE p.id = user_id;

  -- Merge permissions from additional roles
  SELECT COALESCE(result, '{}'::JSONB) || COALESCE(jsonb_agg(r.permissions), '{}'::JSONB)
  INTO result
  FROM user_role_mappings m
  JOIN user_roles r ON m.role_id = r.id
  WHERE m.user_id = user_id;

  RETURN result;
END;
$$;

-- Function to check if a user has a specific permission
CREATE OR REPLACE FUNCTION has_permission(user_id UUID, permission TEXT) 
RETURNS BOOLEAN 
LANGUAGE plpgsql SECURITY DEFINER 
AS $$
DECLARE
  permissions JSONB;
BEGIN
  SELECT get_user_permissions(user_id) INTO permissions;
  RETURN permissions->permission = 'true';
END;
$$;

-- Add a trigger to update last_login_at when auth.users is updated
CREATE OR REPLACE FUNCTION update_last_login()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles
  SET last_login_at = NOW()
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_auth_user_login ON auth.users;
CREATE TRIGGER on_auth_user_login
AFTER UPDATE OF last_sign_in_at ON auth.users
FOR EACH ROW
EXECUTE FUNCTION update_last_login();
