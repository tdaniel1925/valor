# Database Setup Guide

## Connection String Format

For Drizzle migrations, you may need to use the **direct connection** string instead of the pooler connection.

### Getting the Direct Connection String

1. Go to your Supabase project: https://app.supabase.com
2. Navigate to **Settings** → **Database**
3. Under **Connection string**, select **"Direct connection"** (not "URI" or "Pooled")
4. Copy the connection string
5. Replace `[YOUR-PASSWORD]` with your actual database password

### Format Example

**Pooler (for app connections):**
```
postgresql://postgres.xxxxx:password@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

**Direct (for migrations):**
```
postgresql://postgres.xxxxx:password@aws-0-us-east-1.pooler.supabase.com:5432/postgres
```

Note: The port changes from `6543` (pooler) to `5432` (direct).

### Password Encoding

If your password contains special characters, you may need to URL-encode them:
- `@` becomes `%40`
- `#` becomes `%23`
- `$` becomes `%24`
- `%` becomes `%25`
- `&` becomes `%26`
- `+` becomes `%2B`
- `=` becomes `%3D`

### Update .env.local

Update your `DATABASE_URL` in `.env.local`:

```env
DATABASE_URL=postgresql://postgres.xxxxx:your_password@aws-0-us-east-1.pooler.supabase.com:5432/postgres
```

### Alternative: Use Connection Pooling URL

If the direct connection doesn't work, try the connection pooling URL format:

```env
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
```

## Running Migrations

After updating the connection string:

```bash
npm run db:push
```

This will create all the database tables defined in your schema.

