
-- This is a SQL migration script that needs to be executed in the Supabase SQL Editor

-- Add new columns to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Create products table if it doesn't exist
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  category TEXT NOT NULL,
  image_url TEXT,
  seller_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order_delivery_info table
CREATE TABLE IF NOT EXISTS order_delivery_info (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  phone_number TEXT NOT NULL
);

-- Create order_payment_info table
CREATE TABLE IF NOT EXISTS order_payment_info (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  method TEXT NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS orders_user_id_idx ON orders(user_id);
CREATE INDEX IF NOT EXISTS order_items_order_id_idx ON order_items(order_id);
CREATE INDEX IF NOT EXISTS order_delivery_info_order_id_idx ON order_delivery_info(order_id);
CREATE INDEX IF NOT EXISTS order_payment_info_order_id_idx ON order_payment_info(order_id);

-- Add RLS policies for better security
-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_delivery_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_payment_info ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Profiles: Users can view all profiles but only update their own
CREATE POLICY "Public profiles are viewable by everyone" 
ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" 
ON profiles FOR UPDATE USING (auth.uid() = id);

-- Products: Anyone can view products, only sellers can modify their own
CREATE POLICY "Products are viewable by everyone" 
ON products FOR SELECT USING (true);

CREATE POLICY "Sellers can insert their own products" 
ON products FOR INSERT WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Sellers can update their own products" 
ON products FOR UPDATE USING (auth.uid() = seller_id);

CREATE POLICY "Sellers can delete their own products" 
ON products FOR DELETE USING (auth.uid() = seller_id);

-- Orders: Users can only see and modify their own orders
CREATE POLICY "Users can view their own orders" 
ON orders FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own orders" 
ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own orders" 
ON orders FOR UPDATE USING (auth.uid() = user_id);

-- Order Items: Link to orders policy
CREATE POLICY "Users can view their own order items" 
ON order_items FOR SELECT USING (
  order_id IN (SELECT id FROM orders WHERE user_id = auth.uid())
);

CREATE POLICY "Users can insert their own order items" 
ON order_items FOR INSERT WITH CHECK (
  order_id IN (SELECT id FROM orders WHERE user_id = auth.uid())
);

-- Similar policies for delivery and payment info
CREATE POLICY "Users can view their own order delivery info" 
ON order_delivery_info FOR SELECT USING (
  order_id IN (SELECT id FROM orders WHERE user_id = auth.uid())
);

CREATE POLICY "Users can insert their own order delivery info" 
ON order_delivery_info FOR INSERT WITH CHECK (
  order_id IN (SELECT id FROM orders WHERE user_id = auth.uid())
);

CREATE POLICY "Users can view their own order payment info" 
ON order_payment_info FOR SELECT USING (
  order_id IN (SELECT id FROM orders WHERE user_id = auth.uid())
);

CREATE POLICY "Users can insert their own order payment info" 
ON order_payment_info FOR INSERT WITH CHECK (
  order_id IN (SELECT id FROM orders WHERE user_id = auth.uid())
);
