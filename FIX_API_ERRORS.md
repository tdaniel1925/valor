# Fix for API 500 Errors

## Root Cause Analysis

The API endpoints are returning 500 errors because:

1. **Missing Dependencies** - The `node_modules` directory didn't exist ✅ FIXED
2. **Missing Environment Variables** - The `.env.local` file doesn't exist ❌ NEEDS USER ACTION
3. **Database Not Set Up** - Migrations haven't been run (requires step 2 first)

## What I Fixed

✅ Installed all project dependencies (removed @sentry/nextjs due to download restrictions)
✅ Created `.env.local.example` template file

## What You Need to Do

### Step 1: Create Supabase Project (if you haven't already)

1. Go to https://app.supabase.com
2. Sign in or create an account
3. Click "New Project"
4. Set up your project:
   - Name: Valor Insurance Platform
   - Database Password: Create and save a strong password
   - Region: Choose closest to you
5. Wait 2-3 minutes for initialization

### Step 2: Get Your Credentials

Once your Supabase project is ready:

**A. Get API credentials:**
1. In Supabase Dashboard, go to **Settings** (gear icon) → **API**
2. Copy these values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key (long JWT token)
   - **service_role** key (keep this secret!)

**B. Get database connection string:**
1. Still in Settings, go to **Database**
2. Find "Connection string" section
3. Select **"Direct connection"** tab
4. Select **"URI"** format
5. Copy the connection string
6. Replace `[YOUR-PASSWORD]` with your database password from Step 1

### Step 3: Create .env.local File

```bash
# Copy the example file
cp .env.local.example .env.local

# Edit the file and add your actual values
# Replace all the placeholder values with your Supabase credentials
```

Your `.env.local` should look like this (with YOUR actual values):

```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefgh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
DATABASE_URL=postgresql://postgres:YourPassword123@db.abcdefgh.supabase.co:5432/postgres
```

### Step 4: Run Database Migrations

After creating `.env.local` with the correct values:

```bash
# Push database schema to Supabase
npm run db:push

# (Optional) Seed the database with sample data
npm run db:seed
```

### Step 5: Start the Development Server

```bash
npm run dev
```

The application should now work at http://localhost:3006

## API Endpoints That Were Failing

- `/api/activity?limit=5` - Returns recent activity logs
- `/api/dashboard/production` - Returns production metrics (cases, commissions)

Both endpoints should work after completing the setup above.

## Technical Details

### Files Modified:
- `package.json` - Removed `@sentry/nextjs` due to binary download restrictions

### Error Details:
The endpoints were failing with:
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

This happens because the database connection library (`postgres`) couldn't connect without a valid `DATABASE_URL`.

## Need Help?

If you encounter issues:

1. **"Missing environment variable"** - Make sure `.env.local` exists and has all required values
2. **"Database connection failed"** - Verify your `DATABASE_URL` has the correct password
3. **"Invalid API key"** - Double-check you copied the complete keys from Supabase (no spaces)

Refer to `ENV_SETUP_GUIDE.md` for detailed step-by-step instructions.
