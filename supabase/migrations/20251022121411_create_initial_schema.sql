/*
  # Create La Boutique Database Schema

  ## Overview
  This migration creates the complete database schema for La Boutique e-commerce platform,
  including products, categories, users, orders, and content management.

  ## 1. New Tables

  ### `profiles`
  User profile data extending auth.users
  - `id` (uuid, primary key, references auth.users)
  - `email` (text, unique)
  - `first_name` (text)
  - `last_name` (text)
  - `role` (text, default 'user')
  - `is_active` (boolean, default true)
  - `created_at` (timestamptz, default now())
  - `updated_at` (timestamptz, default now())

  ### `categories`
  Product categories
  - `id` (uuid, primary key)
  - `name` (text, unique)
  - `description` (text)
  - `is_active` (boolean, default true)
  - `created_at` (timestamptz, default now())
  - `updated_at` (timestamptz, default now())

  ### `products`
  Products catalog
  - `id` (uuid, primary key)
  - `name` (text)
  - `description` (text)
  - `price` (integer, price in cents)
  - `original_price` (integer, nullable)
  - `category_id` (uuid, references categories)
  - `stock` (integer, default 0)
  - `rating` (numeric, default 0)
  - `review_count` (integer, default 0)
  - `images` (jsonb, array of image URLs)
  - `features` (jsonb, array of features)
  - `specifications` (jsonb, key-value pairs)
  - `is_new` (boolean, default false)
  - `is_active` (boolean, default true)
  - `sales` (integer, default 0)
  - `created_at` (timestamptz, default now())
  - `updated_at` (timestamptz, default now())

  ### `orders`
  Customer orders
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles)
  - `status` (text, default 'pending')
  - `total_amount` (integer)
  - `items` (jsonb, array of order items)
  - `shipping_address` (jsonb, address details)
  - `payment_method` (text)
  - `payment_status` (text, default 'pending')
  - `notes` (text, nullable)
  - `created_at` (timestamptz, default now())
  - `updated_at` (timestamptz, default now())

  ### `content`
  CMS content management
  - `id` (uuid, primary key)
  - `section` (text)
  - `key` (text)
  - `value` (text)
  - `type` (text, default 'text')
  - `created_at` (timestamptz, default now())
  - `updated_at` (timestamptz, default now())
  - UNIQUE constraint on (section, key)

  ## 2. Security
  - Enable Row Level Security (RLS) on all tables
  - Policies for authenticated users to read their own data
  - Policies for admin users to manage all data
  - Public read access for products, categories, and content
  - Secure user profile and order data

  ## 3. Functions
  - Trigger to automatically update `updated_at` timestamp
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  role text DEFAULT 'user' NOT NULL,
  is_active boolean DEFAULT true NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text UNIQUE NOT NULL,
  description text DEFAULT '',
  is_active boolean DEFAULT true NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  description text DEFAULT '',
  price integer NOT NULL,
  original_price integer,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  stock integer DEFAULT 0 NOT NULL,
  rating numeric(3,2) DEFAULT 0 NOT NULL,
  review_count integer DEFAULT 0 NOT NULL,
  images jsonb DEFAULT '[]'::jsonb NOT NULL,
  features jsonb DEFAULT '[]'::jsonb NOT NULL,
  specifications jsonb DEFAULT '{}'::jsonb NOT NULL,
  is_new boolean DEFAULT false NOT NULL,
  is_active boolean DEFAULT true NOT NULL,
  sales integer DEFAULT 0 NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  status text DEFAULT 'pending' NOT NULL,
  total_amount integer NOT NULL,
  items jsonb NOT NULL,
  shipping_address jsonb NOT NULL,
  payment_method text NOT NULL,
  payment_status text DEFAULT 'pending' NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create content table
CREATE TABLE IF NOT EXISTS content (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  section text NOT NULL,
  key text NOT NULL,
  value text DEFAULT '',
  type text DEFAULT 'text' NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(section, key)
);

ALTER TABLE content ENABLE ROW LEVEL SECURITY;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_updated_at BEFORE UPDATE ON content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admin can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- RLS Policies for categories
CREATE POLICY "Anyone can view active categories"
  ON categories FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Admin can manage categories"
  ON categories FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- RLS Policies for products
CREATE POLICY "Anyone can view active products"
  ON products FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Admin can manage products"
  ON products FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- RLS Policies for orders
CREATE POLICY "Users can view their own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create their own orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admin can view all orders"
  ON orders FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admin can update all orders"
  ON orders FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- RLS Policies for content
CREATE POLICY "Anyone can view content"
  ON content FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admin can manage content"
  ON content FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_content_section ON content(section);