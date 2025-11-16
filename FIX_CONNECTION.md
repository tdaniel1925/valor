# Fix Database Connection for Migrations

## Issue
Password authentication is failing even though the password is correct. This is likely because you're using the **pooler connection** for migrations, which may not work.

## Solution: Use Direct Connection String

### Step 1: Get Direct Connection String from Supabase

1. Go to https://app.supabase.com
2. Select your project
3. Go to **Settings** → **Database**
4. Scroll to **Connection string** section
5. Select **"Direct connection"** tab (NOT "URI" or "Pooled")
6. Copy the connection string
7. It should look like:
   ```
   postgresql://postgres.vznkfnsmebmzjnquzuph:[YOUR-PASSWORD]@aws-1-us-east-2.pooler.supabase.com:5432/postgres
   ```
   Note: Port should be **5432** (direct), not **6543** (pooler)

### Step 2: Update .env.local

Edit your `.env.local` file and update the `DATABASE_URL`:

**Current (Pooler - for app connections):**
```env
DATABASE_URL=postgresql://postgres.vznkfnsmebmzjnquzuph:password@aws-1-us-east-2.pooler.supabase.com:6543/postgres
```

**Updated (Direct - for migrations):**
```env
DATABASE_URL=postgresql://postgres.vznkfnsmebmzjnquzuph:password@aws-1-us-east-2.pooler.supabase.com:5432/postgres
```

**OR use the connection pooling URL format:**
```env
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.vznkfnsmebmzjnquzuph.supabase.co:5432/postgres
```

### Step 3: Verify Password

Make sure:
- No extra spaces in the connection string
- Password is correct (the one you set when creating the Supabase project)
- Special characters in password are URL-encoded if needed

### Step 4: Run Migration Again

```bash
npm run db:push
```

## Alternative: Use Supabase SQL Editor

If migrations still don't work, you can manually create tables using the Supabase SQL Editor:

1. Go to Supabase Dashboard → SQL Editor
2. Run the SQL from your schema files

But it's better to fix the connection string so migrations work automatically.

