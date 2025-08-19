-- Database Schema for E-commerce Application
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Products table
CREATE TABLE products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url VARCHAR(500),
  category VARCHAR(100),
  in_stock BOOLEAN DEFAULT true,
  stock_quantity INTEGER DEFAULT 0,
  discount_percentage INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users table
CREATE TABLE users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  avatar VARCHAR(500),
  role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'moderator')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE
);

-- Orders table
CREATE TABLE orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  total_amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed')),
  shipping_address JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order items table
CREATE TABLE order_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categories table
CREATE TABLE categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(10),
  color VARCHAR(100),
  product_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Offers table
CREATE TABLE offers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  discount_percentage INTEGER NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  applicable_products JSONB,
  minimum_purchase DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_featured ON products(is_featured);
CREATE INDEX idx_products_created_at ON products(created_at);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO categories (name, description, icon, color, product_count) VALUES
('Saree', 'Traditional Bengali sarees', '🥻', 'from-pink-100 to-pink-50', 0),
('Burqa', 'Modern and traditional burqas', '🧕', 'from-purple-100 to-purple-50', 0),
('Panjabi', 'Traditional panjabis', '👔', 'from-blue-100 to-blue-50', 0),
('Shirt', 'Formal and casual shirts', '👔', 'from-green-100 to-green-50', 0),
('T-Shirt', 'Comfortable t-shirts', '👕', 'from-orange-100 to-orange-50', 0),
('Pant', 'Formal and casual pants', '👖', 'from-indigo-100 to-indigo-50', 0);

-- Insert sample products
INSERT INTO products (name, description, price, image_url, category, stock_quantity, discount_percentage, is_featured) VALUES
('Traditional Silk Saree', 'Elegant silk saree with traditional Bengali design', 2500.00, '/traditional-saree.png', 'Saree', 15, 20, true),
('Modern Burqa', 'Contemporary design burqa with comfortable fit', 1800.00, '/modern-burqa.png', 'Burqa', 25, 15, false),
('Cotton Panjabi', 'Comfortable cotton panjabi for formal occasions', 1200.00, '/cotton-panjabi.png', 'Panjabi', 30, 10, true),
('Formal Shirt', 'Professional formal shirt for office wear', 800.00, '/formal-shirt.png', 'Shirt', 40, 25, false),
('Casual T-Shirt', 'Comfortable casual t-shirt for everyday wear', 400.00, '/casual-t-shirt.png', 'T-Shirt', 50, 30, true),
('Denim Pants', 'Classic denim pants with modern fit', 1500.00, '/denim-pants.png', 'Pant', 35, 20, false),
('Elegant Silk Saree', 'Premium silk saree with golden border', 3500.00, '/elegant-silk-saree.png', 'Saree', 10, 25, true),
('Designer Burqa', 'Luxury designer burqa with embroidery', 2800.00, '/designer-burqa.png', 'Burqa', 15, 20, true),
('Classic Panjabi', 'Traditional panjabi for special occasions', 2000.00, '/classic-panjabi.png', 'Panjabi', 20, 15, false),
('Business Shirt', 'Professional business shirt for corporate wear', 1200.00, '/business-shirt.png', 'Shirt', 30, 30, true),
('Sports T-Shirt', 'Comfortable sports t-shirt for active lifestyle', 600.00, '/sports-t-shirt.png', 'T-Shirt', 45, 35, false),
('Formal Pants', 'Elegant formal pants for office wear', 1800.00, '/formal-pants.png', 'Pant', 25, 25, true),
('Wedding Saree', 'Exquisite wedding saree with heavy work', 5000.00, '/wedding-saree.png', 'Saree', 8, 10, true),
('Casual Burqa', 'Comfortable casual burqa for daily wear', 1200.00, '/casual-burqa.png', 'Burqa', 35, 40, false),
('Party Panjabi', 'Stylish party panjabi for celebrations', 2500.00, '/party-panjabi.png', 'Panjabi', 18, 20, true);

-- Insert sample users
INSERT INTO users (name, email, phone, role, is_active) VALUES
('আহমেদ রহমান', 'ahmed@example.com', '+880 1712345678', 'customer', true),
('ফাতেমা খাতুন', 'fatema@example.com', '+880 1812345678', 'customer', true),
('Admin User', 'admin@Mirza Garments.com', '+880 1912345678', 'admin', true),
('মোহাম্মদ আলী', 'mohammad@example.com', '+880 1612345678', 'customer', true),
('আয়েশা সুলতানা', 'ayesha@example.com', '+880 1512345678', 'customer', true),
('রহমান মিয়া', 'rahman@example.com', '+880 1412345678', 'customer', false),
('নাজমা খাতুন', 'nazma@example.com', '+880 1312345678', 'customer', true),
('ইমরান হোসেন', 'imran@example.com', '+880 1212345678', 'customer', true);

-- Insert sample orders
INSERT INTO orders (user_id, total_amount, status, payment_status, shipping_address) VALUES
((SELECT id FROM users WHERE email = 'ahmed@example.com'), 4900.00, 'delivered', 'paid', '{"street": "123 Main Street", "city": "Dhaka", "state": "Dhaka", "postal_code": "1200", "country": "Bangladesh"}'),
((SELECT id FROM users WHERE email = 'fatema@example.com'), 3000.00, 'processing', 'paid', '{"street": "456 Oak Avenue", "city": "Chittagong", "state": "Chittagong", "postal_code": "4000", "country": "Bangladesh"}'),
((SELECT id FROM users WHERE email = 'ahmed@example.com'), 3800.00, 'shipped', 'paid', '{"street": "789 Pine Road", "city": "Sylhet", "state": "Sylhet", "postal_code": "3100", "country": "Bangladesh"}'),
((SELECT id FROM users WHERE email = 'fatema@example.com'), 5700.00, 'pending', 'pending', '{"street": "321 Elm Street", "city": "Rajshahi", "state": "Rajshahi", "postal_code": "6000", "country": "Bangladesh"}'),
((SELECT id FROM users WHERE email = 'admin@Mirza Garments.com'), 7000.00, 'delivered', 'paid', '{"street": "654 Maple Drive", "city": "Khulna", "state": "Khulna", "postal_code": "9000", "country": "Bangladesh"}'),
((SELECT id FROM users WHERE email = 'ahmed@example.com'), 3000.00, 'processing', 'paid', '{"street": "987 Cedar Lane", "city": "Barisal", "state": "Barisal", "postal_code": "8200", "country": "Bangladesh"}'),
((SELECT id FROM users WHERE email = 'fatema@example.com'), 6200.00, 'shipped', 'paid', '{"street": "147 Birch Avenue", "city": "Rangpur", "state": "Rangpur", "postal_code": "5400", "country": "Bangladesh"}'),
((SELECT id FROM users WHERE email = 'admin@Mirza Garments.com'), 5000.00, 'pending', 'pending', '{"street": "258 Spruce Street", "city": "Comilla", "state": "Comilla", "postal_code": "3500", "country": "Bangladesh"}');

-- Insert sample order items
INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
((SELECT id FROM orders LIMIT 1), (SELECT id FROM products WHERE name = 'Traditional Silk Saree'), 1, 2500.00),
((SELECT id FROM orders LIMIT 1), (SELECT id FROM products WHERE name = 'Cotton Panjabi'), 2, 1200.00),
((SELECT id FROM orders LIMIT 1 OFFSET 1), (SELECT id FROM products WHERE name = 'Modern Burqa'), 1, 1800.00),
((SELECT id FROM orders LIMIT 1 OFFSET 1), (SELECT id FROM products WHERE name = 'Casual T-Shirt'), 3, 400.00);

-- Insert sample offers
INSERT INTO offers (title, description, discount_percentage, start_date, end_date, minimum_purchase) VALUES
('New Year Special', 'Get 20% off on all products', 20, '2024-01-01T00:00:00Z', '2024-12-31T23:59:59Z', 1000.00),
('Saree Collection Sale', 'Special discount on saree collection', 25, '2024-01-15T00:00:00Z', '2024-12-31T23:59:59Z', 2000.00);

-- Update product counts in categories
UPDATE categories SET product_count = (
  SELECT COUNT(*) FROM products WHERE category = categories.name
);
