# 🗄️ Database Setup Guide

## 📋 Prerequisites
- Supabase account (free at [supabase.com](https://supabase.com))
- Your e-commerce project ready

## 🎯 Step-by-Step Database Setup

### 1. **Create Supabase Project**
1. Go to [supabase.com](https://supabase.com)
2. Sign up/Login with GitHub
3. Click **"New Project"**
4. Choose your organization
5. Enter project details:
   - **Name**: `Mirza Garments-ecommerce`
   - **Database Password**: Choose a strong password
   - **Region**: Select closest to Bangladesh (Asia Pacific)
6. Click **"Create new project"**

### 2. **Get Database Credentials**
1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **Anon Public Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 3. **Set Environment Variables**
Create a `.env.local` file in your project root:
```bash
# Supabase Database Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. **Setup Database Schema**
1. In Supabase dashboard, go to **SQL Editor**
2. Click **"New Query"**
3. Copy and paste the entire content from `database-schema.sql`
4. Click **"Run"** to execute the schema

### 5. **Verify Database Setup**
After running the schema, you should have:
- ✅ **6 tables**: products, users, orders, order_items, categories, offers
- ✅ **15 sample products** with real data
- ✅ **8 sample users** with Bengali names
- ✅ **8 sample orders** with realistic data
- ✅ **6 categories** with proper structure
- ✅ **2 sample offers** for promotions

## 🔧 Database Features

### **Tables Created:**
1. **`products`** - All product information
2. **`users`** - Customer and admin user data
3. **`orders`** - Order details and status
4. **`order_items`** - Individual items in orders
5. **`categories`** - Product categories
6. **`offers`** - Promotional offers

### **Features Included:**
- ✅ **UUID Primary Keys** - Secure and unique identifiers
- ✅ **Foreign Key Relationships** - Data integrity
- ✅ **Indexes** - Fast query performance
- ✅ **Triggers** - Automatic timestamp updates
- ✅ **Constraints** - Data validation
- ✅ **Sample Data** - Ready to use

### **Sample Data:**
- **15 Products**: Sarees, Burqas, Panjabis, Shirts, T-Shirts, Pants
- **8 Users**: Real Bengali names with proper roles
- **8 Orders**: Various statuses and realistic amounts
- **6 Categories**: Traditional clothing categories
- **2 Offers**: New Year and Saree collection promotions

## 🚀 Integration with Your App

### **API Routes Updated:**
- ✅ `/api/products` - Fetch and create products
- ✅ `/api/products/[id]` - Get, update, delete individual products
- ✅ `/api/users` - Fetch and create users
- ✅ `/api/orders` - Fetch and create orders

### **Database Service:**
- ✅ **`DatabaseService`** class with all CRUD operations
- ✅ **Type-safe** operations with TypeScript
- ✅ **Error handling** and logging
- ✅ **Analytics** functions for dashboard

## 🔍 Testing Your Database

### **1. Test API Endpoints:**
```bash
# Test products API
curl http://localhost:3000/api/products

# Test users API
curl http://localhost:3000/api/users

# Test orders API
curl http://localhost:3000/api/orders
```

### **2. Check Supabase Dashboard:**
- Go to **Table Editor** in Supabase
- Verify all tables have data
- Check relationships are working

### **3. Test Admin Panel:**
- Visit `/admin` in your app
- Verify dashboard shows real data
- Check products, users, and orders pages

## 🌐 Vercel Deployment

### **Environment Variables for Vercel:**
1. In Vercel dashboard, go to **Settings** → **Environment Variables**
2. Add these variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### **Database Security:**
- ✅ **Row Level Security (RLS)** - Data protection
- ✅ **API Key Authentication** - Secure access
- ✅ **Connection Pooling** - Performance optimization

## 🔧 Database Operations

### **Available Functions:**
```typescript
// Products
await DatabaseService.getProducts()
await DatabaseService.getProduct(id)
await DatabaseService.createProduct(data)
await DatabaseService.updateProduct(id, data)
await DatabaseService.deleteProduct(id)

// Users
await DatabaseService.getUsers()
await DatabaseService.getUser(id)
await DatabaseService.createUser(data)

// Orders
await DatabaseService.getOrders()
await DatabaseService.getOrder(id)
await DatabaseService.createOrder(data)
await DatabaseService.updateOrderStatus(id, status)

// Analytics
await DatabaseService.getDashboardStats()
```

## 🎉 Success!
Your e-commerce application now has:
- ✅ **Real PostgreSQL Database** with Supabase
- ✅ **15 Sample Products** with images and prices
- ✅ **8 Sample Users** with Bengali names
- ✅ **8 Sample Orders** with realistic data
- ✅ **Full CRUD Operations** for all entities
- ✅ **Type-safe Database Operations**
- ✅ **Ready for Production** deployment
- ✅ **Fallback System** - Uses mock data when database is not configured

## 🔄 **Fallback System**
The application now includes a smart fallback system:
- **When database is configured**: Uses real Supabase database
- **When database is not configured**: Automatically uses mock data
- **No errors**: Application works seamlessly in both modes
- **Easy setup**: Just add environment variables to switch to real database

## 📊 Database Benefits:
- **Scalable**: PostgreSQL can handle millions of records
- **Reliable**: ACID compliance and data integrity
- **Fast**: Optimized indexes and queries
- **Secure**: Row-level security and authentication
- **Real-time**: Built-in real-time subscriptions
- **Free Tier**: 500MB database, 50MB bandwidth

Your database is now ready for production use! 🚀
