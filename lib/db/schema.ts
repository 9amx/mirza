import { pgTable, serial, text, integer, decimal, boolean, timestamp, json } from 'drizzle-orm/pg-core';

// Users table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  phone: text('phone'),
  password_hash: text('password_hash').notNull(),
  role: text('role').default('customer').notNull(), // 'admin', 'customer'
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Categories table
export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Products table
export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  image_url: text('image_url'),
  category_id: integer('category_id').references(() => categories.id),
  stock_quantity: integer('stock_quantity').default(0).notNull(),
  in_stock: boolean('in_stock').default(true).notNull(),
  discount_percentage: integer('discount_percentage').default(0),
  is_featured: boolean('is_featured').default(false).notNull(),
  sizes: json('sizes').$type<string[]>(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Orders table
export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').references(() => users.id),
  customer_name: text('customer_name').notNull(),
  customer_email: text('customer_email').notNull(),
  customer_phone: text('customer_phone').notNull(),
  shipping_address: text('shipping_address').notNull(),
  total_amount: decimal('total_amount', { precision: 10, scale: 2 }).notNull(),
  status: text('status').default('pending').notNull(), // 'pending', 'processing', 'shipped', 'delivered', 'cancelled'
  payment_status: text('payment_status').default('pending').notNull(), // 'pending', 'paid', 'failed'
  payment_method: text('payment_method'),
  tracking_number: text('tracking_number'),
  notes: text('notes'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Order items table
export const order_items = pgTable('order_items', {
  id: serial('id').primaryKey(),
  order_id: integer('order_id').references(() => orders.id).notNull(),
  product_id: integer('product_id').references(() => products.id).notNull(),
  product_name: text('product_name').notNull(),
  product_price: decimal('product_price', { precision: 10, scale: 2 }).notNull(),
  quantity: integer('quantity').notNull(),
  size: text('size'),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Settings table
export const settings = pgTable('settings', {
  id: serial('id').primaryKey(),
  store_name: text('store_name').notNull(),
  store_description: text('store_description'),
  favicon_path: text('favicon_path'),
  currency: text('currency').default('BDT').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Banners table
export const banners = pgTable('banners', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  subtitle: text('subtitle'),
  image_url: text('image_url').notNull(),
  button_text: text('button_text'),
  button_link: text('button_link'),
  is_active: boolean('is_active').default(true).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Offers table
export const offers = pgTable('offers', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  discount_percentage: integer('discount_percentage').notNull(),
  start_date: timestamp('start_date').notNull(),
  end_date: timestamp('end_date').notNull(),
  is_active: boolean('is_active').default(true).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Delivery settings table
export const delivery_settings = pgTable('delivery_settings', {
  id: serial('id').primaryKey(),
  free_shipping_threshold: decimal('free_shipping_threshold', { precision: 10, scale: 2 }).default('1000.00').notNull(),
  standard_shipping_cost: decimal('standard_shipping_cost', { precision: 10, scale: 2 }).default('100.00').notNull(),
  express_shipping_cost: decimal('express_shipping_cost', { precision: 10, scale: 2 }).default('200.00').notNull(),
  delivery_time_standard: text('delivery_time_standard').default('3-5 business days').notNull(),
  delivery_time_express: text('delivery_time_express').default('1-2 business days').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});
