# Quick Start Guide

Get the Valor Insurance Platform up and running in minutes!

## Prerequisites

- Node.js 18+ installed
- npm or yarn
- Supabase account (free tier works)

## Step 1: Clone & Install

```bash
# Clone the repository
git clone <repository-url>
cd valor

# Install dependencies
npm install
```

## Step 2: Set Up Supabase

1. Create a new project at https://supabase.com
2. Go to **Settings** → **API**
3. Copy your project URL and anon key
4. Go to **Settings** → **Database**
5. Copy your database connection string (use **Direct connection** for migrations)

## Step 3: Configure Environment

Create `.env.local` in the root directory:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
DATABASE_URL=your_database_connection_string

# Optional: Email (for notifications)
EMAIL_FROM=noreply@yourdomain.com
EMAIL_SERVICE_API_KEY=your_email_service_key
```

## Step 4: Set Up Database

### Option A: Manual SQL (Recommended)

1. Open Supabase SQL Editor
2. Run `database_schema.sql` to create all tables
3. Run `database_seed.sql` to seed initial data

### Option B: Drizzle Kit

```bash
npm run db:push
npm run db:seed
```

## Step 5: Run the Application

```bash
npm run dev
```

The app will be available at **http://localhost:3006**

## Step 6: Create Your First User

1. Go to **http://localhost:3006/auth/signup**
2. Sign up with your email
3. Verify your email (check Supabase dashboard for email)
4. Log in

## Step 7: Assign Roles (Optional)

If you need admin access:

1. Go to Supabase SQL Editor
2. Run:
```sql
-- Get your user ID from Supabase Auth users table
-- Then assign Executive role
INSERT INTO user_roles (user_id, role_id)
SELECT 
  'your-user-id-here'::uuid,
  id
FROM roles
WHERE name = 'Executive'
ON CONFLICT DO NOTHING;
```

## 🎉 You're Ready!

The platform is now running. You can:
- Create quotes
- Create cases
- Track commissions
- Manage contracts
- View dashboard metrics

## Troubleshooting

### Database Connection Issues
- Verify `DATABASE_URL` uses direct connection (port 5432)
- Check password is correct and URL-encoded if needed
- See `DB_SETUP.md` for detailed help

### Authentication Issues
- Verify Supabase URL and keys are correct
- Check redirect URLs in Supabase dashboard
- Ensure email verification is configured

### Port Already in Use
- The app runs on port 3006 by default
- Change port in `package.json` if needed

## Need Help?

- Check `README.md` for detailed documentation
- See `DEPLOYMENT.md` for deployment help
- Review `SETUP_ENV.md` for environment setup
- Check `DB_SETUP.md` for database issues

