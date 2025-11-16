# Environment Variables Setup - Step by Step

## Quick Setup Checklist

- [ ] Create Supabase project
- [ ] Get Supabase credentials
- [ ] Create `.env.local` file
- [ ] Add all required variables
- [ ] Test connection

## Step 1: Create Supabase Project

1. Go to https://app.supabase.com
2. Sign in or create an account
3. Click **"New Project"**
4. Fill in:
   - **Name**: Valor Insurance Platform (or your choice)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to you
   - **Pricing Plan**: Free tier is fine for development
5. Click **"Create new project"**
6. Wait 2-3 minutes for project to initialize

## Step 2: Get Your Supabase Credentials

Once your project is ready:

### A. Get Project URL and API Keys

1. In your Supabase project dashboard, click **Settings** (gear icon) in the left sidebar
2. Click **API** under Project Settings
3. You'll see:
   - **Project URL** - Copy this (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key - Copy this (long string starting with `eyJ...`)
   - **service_role** key - Copy this (keep it secret! It has admin access)

### B. Get Database Connection String

1. Still in Settings, click **Database**
2. Scroll to **Connection string** section
3. Select **URI** tab
4. Copy the connection string (looks like: `postgresql://postgres.[ref]:[YOUR-PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres`)
5. **Important**: Replace `[YOUR-PASSWORD]` with the database password you created in Step 1

## Step 3: Create .env.local File

Create a file named `.env.local` in the root directory (`C:\dev\valor\.env.local`)

### Option A: Using PowerShell (Recommended)

Run this command in PowerShell (replace with your actual values):

```powershell
cd C:\dev\valor

@"
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=YOUR_PROJECT_URL_HERE
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY_HERE
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY_HERE

# Database Connection String
DATABASE_URL=YOUR_DATABASE_CONNECTION_STRING_HERE

# Integration API Keys (Optional - leave empty for now)
WINFLEX_API_KEY=
WINFLEX_API_URL=
IPIPELINE_API_KEY=
IPIPELINE_API_URL=
IPIPELINE_GAID=
RATEWATCH_API_KEY=
RATEWATCH_API_URL=
SURANCEBAY_API_KEY=
SURANCEBAY_API_URL=
FIRELIGHT_API_KEY=
FIRELIGHT_API_URL=
THREEMARK_API_KEY=
THREEMARK_API_URL=
GOHIGHLEVEL_API_KEY=
GOHIGHLEVEL_API_URL=
"@ | Out-File -FilePath .env.local -Encoding utf8
```

Then edit `.env.local` and replace the placeholder values.

### Option B: Manual Creation

1. Create a new file named `.env.local` in `C:\dev\valor\`
2. Copy and paste this template:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Database Connection String
DATABASE_URL=postgresql://postgres.xxxxx:your_password@aws-0-us-east-1.pooler.supabase.com:6543/postgres

# Integration API Keys (Optional - leave empty for now)
WINFLEX_API_KEY=
WINFLEX_API_URL=
IPIPELINE_API_KEY=
IPIPELINE_API_URL=
IPIPELINE_GAID=
RATEWATCH_API_KEY=
RATEWATCH_API_URL=
SURANCEBAY_API_KEY=
SURANCEBAY_API_URL=
FIRELIGHT_API_KEY=
FIRELIGHT_API_URL=
THREEMARK_API_KEY=
THREEMARK_API_URL=
GOHIGHLEVEL_API_KEY=
GOHIGHLEVEL_API_URL=
```

3. Replace the placeholder values with your actual Supabase credentials

## Step 4: Fill in Your Values

Edit `.env.local` and replace:

1. **NEXT_PUBLIC_SUPABASE_URL**: Your Project URL from Supabase
2. **NEXT_PUBLIC_SUPABASE_ANON_KEY**: Your anon public key from Supabase
3. **SUPABASE_SERVICE_ROLE_KEY**: Your service_role key from Supabase
4. **DATABASE_URL**: Your database connection string with password replaced

### Example (DO NOT USE THESE - They're just examples):

```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0NTk4ODAwMCwiZXhwIjoxOTYxNTY0MDAwfQ.example
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjQ1OTg4MDAwLCJleHAiOjE5NjE1NjQwMDB9.example
DATABASE_URL=postgresql://postgres.abcdefghijklmnop:MySecurePassword123!@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

## Step 5: Verify Setup

After creating `.env.local`, restart your dev server:

1. Stop the current server (Ctrl+C in terminal)
2. Run `npm run dev` again
3. Check for any connection errors

## Troubleshooting

### Error: "Missing environment variable"
- Make sure `.env.local` exists in the root directory
- Check that variable names match exactly (case-sensitive)
- Restart the dev server after creating/editing `.env.local`

### Error: "Invalid API key"
- Double-check you copied the entire key (they're very long)
- Make sure there are no extra spaces or line breaks
- Verify you're using the correct key (anon vs service_role)

### Error: "Database connection failed"
- Verify your DATABASE_URL has the correct password
- Check that you replaced `[YOUR-PASSWORD]` in the connection string
- Make sure the database password matches what you set when creating the project

### File not found
- Make sure `.env.local` is in `C:\dev\valor\` (same folder as `package.json`)
- Check that the file isn't named `.env.local.txt` (Windows sometimes adds .txt)

## Security Reminders

- ✅ `.env.local` is already in `.gitignore` - it won't be committed to git
- ✅ Never share your `SUPABASE_SERVICE_ROLE_KEY` publicly
- ✅ Never commit `.env.local` to version control
- ✅ Use different Supabase projects for development and production

## Next Steps

After setting up environment variables:

1. Run database migrations: `npm run db:push`
2. (Optional) Seed database: `npm run db:seed`
3. Start dev server: `npm run dev`
4. Open http://localhost:3006

