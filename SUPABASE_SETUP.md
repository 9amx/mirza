# Supabase Database Setup Guide

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up/Login with your GitHub account
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - **Name**: `mirza-garments-db`
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to your users
6. Click "Create new project"
7. Wait for setup to complete (2-3 minutes)

## Step 2: Get Database Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (looks like: `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon public** key (starts with `eyJ...`)

## Step 3: Create Database Tables

1. In Supabase dashboard, go to **SQL Editor**
2. Click "New query"
3. Copy and paste the entire content from `lib/supabase-setup.sql`
4. Click "Run" to execute the SQL
5. You should see success messages for all table creations

## Step 4: Configure Vercel Environment Variables

1. Go to your Vercel dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add these variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

5. Click "Save"
6. Go to **Deployments** and redeploy your project

## Step 5: Test the Setup

1. After redeployment, visit your Vercel site
2. Go to admin panel
3. Try to:
   - Add a product
   - Create an order
   - Check if changes persist after refresh

## Step 6: Local Development (Optional)

Create `.env.local` file in your project root:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## Troubleshooting

### If you see "Database not configured" messages:
- Check that environment variables are set correctly in Vercel
- Make sure you redeployed after adding environment variables
- Verify the Supabase URL and key are correct

### If tables don't exist:
- Run the SQL setup script again in Supabase SQL Editor
- Check for any error messages in the SQL execution

### If you get permission errors:
- The SQL script includes RLS policies that should work
- You may need to adjust policies based on your authentication setup

## Next Steps

After setup, your app will:
- ✅ Save admin changes permanently
- ✅ Show orders in admin panel
- ✅ Persist all data across deployments
- ✅ Work with real database instead of file storage

The database will automatically handle:
- Product management
- Order tracking
- User management
- Settings storage
- Analytics data
