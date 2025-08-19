-- Supabase Database Setup for Mirza Garments E-commerce
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  image_url TEXT,
  category TEXT,
  in_stock BOOLEAN DEFAULT true,
  stock_quantity INTEGER DEFAULT 0,
  discount_percentage NUMERIC DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  sizes JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ
);

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  avatar TEXT,
  role TEXT CHECK (role IN ('customer', 'admin', 'moderator')) DEFAULT 'customer',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  last_login TIMESTAMPTZ
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  total_amount NUMERIC NOT NULL,
  status TEXT CHECK (status IN ('pending', 'processing', 'out_for_delivery', 'shipped', 'delivered', 'cancelled')) DEFAULT 'pending',
  payment_status TEXT CHECK (payment_status IN ('pending', 'paid', 'failed')) DEFAULT 'pending',
  products JSONB, -- [{ product_id, quantity, price }]
  shipping_address JSONB, -- { street, city, state, postal_code, country }
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY,
  product_id TEXT REFERENCES products(id),
  user_id TEXT REFERENCES users(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Banners table
CREATE TABLE IF NOT EXISTS banners (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  link_url TEXT,
  is_active BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Offers table
CREATE TABLE IF NOT EXISTS offers (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  discount_percentage NUMERIC NOT NULL,
  valid_from TIMESTAMPTZ NOT NULL,
  valid_until TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Settings table
CREATE TABLE IF NOT EXISTS settings (
  id TEXT PRIMARY KEY,
  store_name TEXT DEFAULT 'Mirza Garments',
  store_description TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  address TEXT,
  social_links JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ
);

-- Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public read access for products" ON products FOR SELECT USING (true);
CREATE POLICY "Public read access for categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public read access for banners" ON banners FOR SELECT USING (true);
CREATE POLICY "Public read access for offers" ON offers FOR SELECT USING (true);
CREATE POLICY "Public read access for settings" ON settings FOR SELECT USING (true);

-- Create policies for authenticated users
CREATE POLICY "Users can read their own data" ON users FOR SELECT USING (auth.uid()::text = id);
CREATE POLICY "Users can update their own data" ON users FOR UPDATE USING (auth.uid()::text = id);
CREATE POLICY "Users can read their own orders" ON orders FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "Users can create orders" ON orders FOR INSERT WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "Users can read product reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Users can create reviews" ON reviews FOR INSERT WITH CHECK (auth.uid()::text = user_id);

-- Create policies for admin access (you'll need to implement role checking)
CREATE POLICY "Admin full access to products" ON products FOR ALL USING (true);
CREATE POLICY "Admin full access to users" ON users FOR ALL USING (true);
CREATE POLICY "Admin full access to orders" ON orders FOR ALL USING (true);
CREATE POLICY "Admin full access to categories" ON categories FOR ALL USING (true);
CREATE POLICY "Admin full access to reviews" ON reviews FOR ALL USING (true);
CREATE POLICY "Admin full access to banners" ON banners FOR ALL USING (true);
CREATE POLICY "Admin full access to offers" ON offers FOR ALL USING (true);
CREATE POLICY "Admin full access to settings" ON settings FOR ALL USING (true);

-- Insert default settings
INSERT INTO settings (id, store_name, store_description, contact_email, contact_phone, address, social_links)
VALUES (
  'default',
  'Mirza Garments',
  'Your trusted source for quality garments',
  'admin@mirzagarments.com',
  '+880 1866 786910',
  'Dhaka, Bangladesh',
  '{"facebook": "https://facebook.com/mirzagarments", "instagram": "https://instagram.com/mirzagarments"}'
) ON CONFLICT (id) DO NOTHING;

-- Insert some default categories
INSERT INTO categories (id, name, description) VALUES
  ('cat-1', 'Men\'s Clothing', 'Quality men\'s garments'),
  ('cat-2', 'Women\'s Clothing', 'Elegant women\'s fashion'),
  ('cat-3', 'Kids Clothing', 'Comfortable kids wear'),
  ('cat-4', 'Accessories', 'Fashion accessories')
ON CONFLICT (id) DO NOTHING;
