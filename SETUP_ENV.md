# Environment Variables Setup Guide

## Quick Setup

1. Create a `.env.local` file in the root directory
2. Copy the template below and fill in your values

## Required Variables

### Supabase Configuration (Required)

Get these from your Supabase project:
1. Go to https://app.supabase.com
2. Select your project (or create a new one)
3. Go to Settings → API
4. Copy the following values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### Database Connection String (Required)

Get this from Supabase:
1. Go to Settings → Database
2. Under "Connection string", select "URI"
3. Copy the connection string and replace `[YOUR-PASSWORD]` with your database password

```env
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.your-project-ref.supabase.co:5432/postgres
```

### Authentication

This application uses **Supabase Auth** for authentication. No additional NextAuth configuration is needed.
All authentication is handled through Supabase.

## Complete .env.local Template

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Database Connection String
DATABASE_URL=postgresql://postgres:your_password@db.your-project-ref.supabase.co:5432/postgres

# Authentication is handled by Supabase Auth - no additional config needed

# Integration API Keys (Optional - add when available)
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

## Steps to Set Up

1. **Create Supabase Project** (if you don't have one):
   - Go to https://app.supabase.com
   - Click "New Project"
   - Fill in project details
   - Wait for project to be created

2. **Get Supabase Credentials**:
   - Project URL: Found in Settings → API → Project URL
   - Anon Key: Found in Settings → API → Project API keys → anon public
   - Service Role Key: Found in Settings → API → Project API keys → service_role (keep this secret!)

3. **Get Database Connection String**:
   - Go to Settings → Database
   - Under "Connection string", select "URI"
   - Copy and replace `[YOUR-PASSWORD]` with your database password

4. **Create .env.local file**:
   ```bash
   # Copy the template above into .env.local
   ```

5. **Fill in the values** from your Supabase project

6. **Authentication**: Already configured! Supabase Auth handles all authentication.

## Verification

After setting up, verify your configuration:
- The app should connect to Supabase
- Database migrations should run successfully
- Authentication should work

## Security Notes

- Never commit `.env.local` to git (it's already in .gitignore)
- Keep your `SUPABASE_SERVICE_ROLE_KEY` secret - it has admin access
- Use environment variables for all sensitive data

