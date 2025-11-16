# Fix Password Authentication Issue

## Problem
Password authentication is failing even though the password is correct. This is usually due to:

1. **Password mismatch** - The password in DATABASE_URL doesn't match your Supabase project password
2. **Special characters** - Password contains characters that need URL encoding
3. **Connection string format** - Password might have extra spaces or quotes

## Solution Steps

### Step 1: Verify Your Supabase Database Password

1. Go to https://app.supabase.com
2. Select your project
3. Go to **Settings** → **Database**
4. If you forgot your password, you can reset it:
   - Click **"Reset database password"**
   - Set a new password (save it securely!)
   - Wait a few minutes for the change to propagate

### Step 2: Get Fresh Connection String

1. Still in **Settings** → **Database**
2. Under **Connection string**, select **"Direct connection"**
3. Select **"URI"** tab
4. Copy the connection string
5. It will have `[YOUR-PASSWORD]` placeholder

### Step 3: Update DATABASE_URL

Edit your `.env.local` file and replace the `DATABASE_URL` line:

**Option A: If password has NO special characters**
```env
DATABASE_URL=postgresql://postgres:YourPassword123@db.vznkfnsmebmzjnquzuph.supabase.co:5432/postgres
```

**Option B: If password HAS special characters, URL-encode them:**
- `@` → `%40`
- `#` → `%23`
- `$` → `%24`
- `%` → `%25`
- `&` → `%26`
- `+` → `%2B`
- `=` → `%3D`
- `/` → `%2F`
- `?` → `%3F`

Example: If password is `My@Pass#123`, use `My%40Pass%23123`

### Step 4: Test Connection

After updating, try again:
```bash
npm run db:push
```

## Alternative: Use Supabase SQL Editor (Temporary Workaround)

If migrations still don't work, you can manually create tables:

1. Go to Supabase Dashboard → **SQL Editor**
2. Click **"New query"**
3. We can provide you with the SQL to create tables manually

But it's better to fix the connection string so migrations work automatically.

## Quick Password Encoding Helper

If your password is `ttandSellaBella1234`, check if it needs encoding:
- No `@`, `#`, `$`, `%`, `&`, `+`, `=`, `/`, `?` → No encoding needed
- Contains any of those → URL encode them

## Still Having Issues?

1. Double-check password matches Supabase project password exactly
2. Make sure no extra spaces before/after password in connection string
3. Try resetting database password in Supabase and updating connection string
4. Verify connection string format matches exactly: `postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`

