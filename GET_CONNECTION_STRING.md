# How to Get the Correct Connection String from Supabase

## Step-by-Step Instructions

### 1. Go to Supabase Dashboard
- Visit: https://app.supabase.com
- Sign in to your account
- Select your project: **vznkfnsmebmzjnquzuph**

### 2. Navigate to Database Settings
- Click **Settings** (gear icon) in the left sidebar
- Click **Database** under Project Settings

### 3. Get Direct Connection String
- Scroll down to **"Connection string"** section
- Select **"Direct connection"** tab (NOT "URI" or "Pooled")
- Select **"URI"** format (the dropdown/button)
- You'll see a connection string like:
  ```
  postgresql://postgres:[YOUR-PASSWORD]@db.vznkfnsmebmzjnquzuph.supabase.co:5432/postgres
  ```

### 4. Copy and Update
- Copy the ENTIRE connection string
- Open your `.env.local` file
- Find the `DATABASE_URL` line
- Replace it with the copied string
- **IMPORTANT**: Replace `[YOUR-PASSWORD]` with your actual database password
  - This is the password you set when creating the Supabase project
  - If you forgot it, click **"Reset database password"** in the same page

### 5. Save and Test
- Save `.env.local`
- Run: `npm run db:push`

## What the Connection String Should Look Like

**Correct Format:**
```
postgresql://postgres:your_actual_password_here@db.vznkfnsmebmzjnquzuph.supabase.co:5432/postgres
```

**Key Points:**
- Starts with `postgresql://`
- Username is `postgres` (not `postgres.xxxxx`)
- Password comes right after `postgres:` (no spaces)
- Host is `db.vznkfnsmebmzjnquzuph.supabase.co`
- Port is `5432`
- Database is `postgres`

## If Password Reset is Needed

1. In Supabase Dashboard → Settings → Database
2. Click **"Reset database password"**
3. Enter a new password (save it!)
4. Wait 2-3 minutes for changes to propagate
5. Get fresh connection string and update `.env.local`

## Verify Your Current Password

The password in your connection string should match:
- The password you set when creating the Supabase project
- OR the password you see/reset in Settings → Database

If they don't match, that's why authentication is failing!

